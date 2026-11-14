import { spawnSync } from 'node:child_process'
import { DIAGRAM_TYPES, type ReceiptEntry, receiptFindings } from './diagram-receipts.ts'

const DIRECTORY = 'docs/diagrams'
const MANIFEST = `${DIRECTORY}/diagrams.toml`
type StagedReceipts = {
  applicable: boolean
  findings: readonly string[]
  subjects: readonly string[]
}

/** Read index blobs, never working files or checkout filters. No index or repository writes. */
export const inspectStagedDiagramReceipts = (root: string): StagedReceipts => {
  const git = (args: readonly string[]) => {
    const result = spawnSync('git', ['-C', root, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024
    })
    if (result.error || result.status !== 0) throw new Error(`Cannot read staged diagram snapshot: git ${args[0]}`)
    return result.stdout
  }
  const repository = spawnSync('git', ['-C', root, 'rev-parse', '--is-inside-work-tree'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  })
  if (repository.status !== 0) return { applicable: false, findings: [], subjects: [] }
  let subjects: string[] = [MANIFEST]
  try {
    const changed = git(['diff', '--cached', '--name-only', '-z', '--', DIRECTORY])
      .toString()
      .split('\0')
      .filter(Boolean)
    if (changed.length) subjects = changed
    const blobs = new Map<string, string>()
    for (const record of git(['ls-files', '--stage', '-z', '--', '.ki.toml', DIRECTORY])
      .toString()
      .split('\0')
      .filter(Boolean)) {
      const match = /^(\d+) ([0-9a-f]+) (\d)\t(.+)$/.exec(record)
      if (!match) throw new Error('Cannot parse staged diagram index entry')
      const [, mode, oid, stage, file] = match
      if (stage !== '0') throw new Error(`Unmerged staged snapshot: ${file}`)
      if (mode !== '100644' && mode !== '100755') throw new Error(`Staged snapshot requires regular files: ${file}`)
      blobs.set(file!, oid!)
    }
    const readPath = (file: string): Buffer | undefined => {
      const oid = blobs.get(file)
      return oid ? git(['cat-file', 'blob', oid]) : undefined
    }
    const configuration = readPath('.ki.toml')
    if (!configuration) return { applicable: false, findings: [], subjects }
    const config = Bun.TOML.parse(configuration.toString()) as { skills?: Record<string, unknown> }
    if (!config.skills || !Object.hasOwn(config.skills, 'ki-diagrams'))
      return { applicable: false, findings: [], subjects }
    const manifest = readPath(MANIFEST)
    if (!manifest) return { applicable: true, findings: [`Missing staged ${MANIFEST}`], subjects }
    const parsed = Bun.TOML.parse(manifest.toString())
    const entries: ReceiptEntry[] = []
    const findings: string[] = []
    for (const [slug, table] of Object.entries(parsed)) {
      if (typeof table !== 'object' || table === null || Array.isArray(table)) {
        findings.push(`Invalid staged diagram entry: ${slug}`)
        continue
      }
      const item = table as Record<string, unknown>
      if ('commit_html' in item && typeof item.commit_html !== 'boolean') {
        findings.push(`Invalid staged commit_html: ${slug}`)
        continue
      }
      if (item.commit_html !== true) continue
      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        !DIAGRAM_TYPES.includes(item.type as (typeof DIAGRAM_TYPES)[number])
      ) {
        findings.push(`Invalid staged diagram slug or type: ${slug}`)
        continue
      }
      const entry = { slug, type: item.type as string, commitHtml: true }
      entries.push(entry)
      for (const file of [`${slug}.${entry.type}.json`, `${slug}.html`]) {
        if (!blobs.has(`${DIRECTORY}/${file}`)) findings.push(`Missing staged ${DIRECTORY}/${file}`)
      }
    }
    findings.push(...receiptFindings('', entries, (file) => readPath(`${DIRECTORY}/${file}`)))
    return { applicable: true, findings, subjects }
  } catch (error) {
    return { applicable: true, findings: [error instanceof Error ? error.message : String(error)], subjects }
  }
}
