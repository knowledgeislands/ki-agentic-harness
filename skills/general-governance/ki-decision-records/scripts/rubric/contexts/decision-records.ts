import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

const CODE_DIR = 'docs/decisions'
const KB_DIR = 'Admin/Governance/Decisions'
const PREFIX_TO_TYPE: Record<string, string> = {
  SDR: 'strategy',
  PDR: 'product',
  ADR: 'architecture',
  DDR: 'data',
  XDR: 'security',
  ODR: 'operations',
  GDR: 'governance',
  RDR: 'research',
  KDR: 'knowledge'
}
const FILENAME = /^(SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)-(XXX|\d{3,})(-[a-z0-9-]+)?\.md$/
const INDEX_ID = /^\s*(?:\d+\.|[-*])\s+.*?((?:SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-[A-Z][A-Z0-9-]+-(?:XXX|\d{3,}))/
const HEADING = /^#\s+((?:SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-[A-Z][A-Z0-9-]+-(?:XXX|\d{3,})):\s+(.+)$/m

export type DecisionRecord = {
  file: string
  id: string
  prefix: string
  scope: string
  serial: string
  expectedType: string
  content: string
  body: string
  frontmatter?: string
  type?: string
  decisionType?: string
  headingId?: string
  headingTitle?: string
  date?: string
  missingSections: readonly string[]
}

export type DecisionRecordsContext = {
  directory: string
  dryRun: boolean
  exists: boolean
  kbMode: boolean
  indexFile: string
  indexExists: boolean
  indexIds: readonly string[]
  indexCounts: ReadonlyMap<string, number>
  invalidFilenames: readonly string[]
  records: readonly DecisionRecord[]
  duplicateIds: ReadonlyMap<string, readonly string[]>
  serialGaps: ReadonlyMap<string, readonly number[]>
  outOfOrderIds: readonly { id: string; previous: number }[]
  appendMissingIndexEntries: () => readonly DecisionRecord[]
}

const findKiConfig = (start: string): string | undefined => {
  let directory = resolve(start)
  for (let depth = 0; depth < 10; depth++) {
    const candidate = join(directory, '.ki-config.toml')
    if (existsSync(candidate)) return candidate
    const parent = dirname(directory)
    if (parent === directory) return undefined
    directory = parent
  }
  return undefined
}

const isKb = (target: string): boolean => {
  const config = findKiConfig(target)
  if (!config) return false
  const content = readFileSync(config, 'utf8')
  return /^\s*repo_type\s*=\s*["']kb["']/m.test(content) || /^\[ki-kb\]/m.test(content)
}

const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const resolveDirectory = (target: string, kbMode: boolean): string => {
  const absolute = resolve(target)
  for (const relative of kbMode ? [KB_DIR, CODE_DIR] : [CODE_DIR, KB_DIR]) {
    const candidate = join(absolute, relative)
    if (isDirectory(candidate)) return candidate
  }
  if (
    isDirectory(absolute) &&
    (['README.md', 'Decisions.md'].some((name) => existsSync(join(absolute, name))) ||
      readdirSync(absolute).some((name) => FILENAME.test(name)))
  )
    return absolute
  return join(absolute, kbMode ? KB_DIR : CODE_DIR)
}

const frontmatterValue = (frontmatter: string | undefined, key: string): string | undefined =>
  frontmatter?.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim()

export const createDecisionRecordsContextFactory = ({
  target,
  dryRun = false
}: {
  target: string
  dryRun?: boolean
}): (() => DecisionRecordsContext) => {
  const kbMode = isKb(target)
  const directory = resolveDirectory(target, kbMode)
  return () => {
    const exists = isDirectory(directory)
    const entries = exists ? readdirSync(directory).sort() : []
    const indexFile = kbMode ? 'Decisions.md' : 'README.md'
    const indexExists = entries.includes(indexFile)
    const indexContent = indexExists ? readFileSync(join(directory, indexFile), 'utf8') : ''
    const indexIds = indexContent
      .split('\n')
      .map((line) => line.match(INDEX_ID)?.[1])
      .filter((id): id is string => Boolean(id))
    const indexCounts = new Map<string, number>()
    for (const id of indexIds) indexCounts.set(id, (indexCounts.get(id) ?? 0) + 1)
    const markdownFiles = entries.filter((file) => file.endsWith('.md') && file !== indexFile)
    const invalidFilenames = markdownFiles.filter((file) => !FILENAME.test(file))
    const records: DecisionRecord[] = []

    for (const file of markdownFiles) {
      const filename = file.match(FILENAME)
      if (!filename) continue
      const [, prefix, scope, serial] = filename
      const id = `${prefix}-${scope}-${serial}`
      const content = readFileSync(join(directory, file), 'utf8')
      const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1]
      const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '')
      const heading = body.match(HEADING)
      const date = body.match(/^\*\*Date:\*\*\s+(.+)$/m)?.[1]?.trim()
      records.push({
        file,
        id,
        prefix,
        scope,
        serial,
        expectedType: PREFIX_TO_TYPE[prefix] as string,
        content,
        body,
        ...(frontmatter ? { frontmatter } : {}),
        ...(frontmatterValue(frontmatter, 'type') ? { type: frontmatterValue(frontmatter, 'type') } : {}),
        ...(frontmatterValue(frontmatter, 'decision_type') ? { decisionType: frontmatterValue(frontmatter, 'decision_type') } : {}),
        ...(heading?.[1] ? { headingId: heading[1] } : {}),
        ...(heading?.[2] ? { headingTitle: heading[2].trim() } : {}),
        ...(date ? { date } : {}),
        missingSections: ['## Context', '## Decision', '## Consequences'].filter((section) => !body.includes(section))
      })
    }

    const idsToFiles = new Map<string, string[]>()
    const serialsBySeries = new Map<string, number[]>()
    for (const record of records) {
      idsToFiles.set(record.id, [...(idsToFiles.get(record.id) ?? []), record.file])
      if (record.serial !== 'XXX') {
        const key = `${record.prefix}-${record.scope}`
        serialsBySeries.set(key, [...(serialsBySeries.get(key) ?? []), Number(record.serial)])
      }
    }
    const duplicateIds = new Map([...idsToFiles].filter(([, files]) => files.length > 1))
    const serialGaps = new Map<string, number[]>()
    for (const [series, serials] of serialsBySeries) {
      const unique = [...new Set(serials)].sort((left, right) => left - right)
      const maximum = unique.at(-1) ?? 0
      const missing = Array.from({ length: maximum }, (_, index) => index + 1).filter((serial) => !unique.includes(serial))
      if (missing.length > 0) serialGaps.set(series, missing)
    }
    const outOfOrderIds: Array<{ id: string; previous: number }> = []
    const maximumBySeries = new Map<string, number>()
    for (const id of indexIds) {
      const match = id.match(/^(.*)-(\d{3,})$/)
      if (!match) continue
      const series = match[1] as string
      const serial = Number(match[2])
      const previous = maximumBySeries.get(series)
      if (previous !== undefined && serial < previous) outOfOrderIds.push({ id, previous })
      maximumBySeries.set(series, Math.max(previous ?? 0, serial))
    }

    return {
      directory,
      dryRun,
      exists,
      kbMode,
      indexFile,
      indexExists,
      indexIds,
      indexCounts,
      invalidFilenames,
      records,
      duplicateIds,
      serialGaps,
      outOfOrderIds,
      appendMissingIndexEntries: () => {
        if (!indexExists) return []
        const missing = records.filter((record) => (indexCounts.get(record.id) ?? 0) === 0)
        if (!dryRun && missing.length > 0) {
          const additions = missing.map((record) => `- [${record.id}](${record.file}) — ${record.headingTitle ?? '(title unknown — see file)'}`)
          writeFileSync(join(directory, indexFile), `${indexContent.replace(/\n*$/, '\n')}${additions.join('\n')}\n`)
        }
        return missing
      }
    }
  }
}
