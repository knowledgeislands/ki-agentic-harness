import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const CODE_DIR = 'docs/decisions'
const KB_DIR = 'Admin/Governance/Decisions'
const PREFIX_TO_TYPE: Record<string, { decisionType: string; type: string; typeUrl: string }> = {
  SDR: {
    decisionType: 'strategy',
    type: 'Strategy Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/sdr'
  },
  PDR: {
    decisionType: 'product',
    type: 'Product Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/pdr'
  },
  ADR: {
    decisionType: 'architecture',
    type: 'Architecture Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/adr'
  },
  DDR: { decisionType: 'data', type: 'Data Decision Record', typeUrl: 'https://knowledgeislands.info/specifications/decision-records/ddr' },
  XDR: {
    decisionType: 'security',
    type: 'Security Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/xdr'
  },
  ODR: {
    decisionType: 'operations',
    type: 'Operations Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/odr'
  },
  GDR: {
    decisionType: 'governance',
    type: 'Governance Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/gdr'
  },
  RDR: {
    decisionType: 'research',
    type: 'Research Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/rdr'
  },
  KDR: {
    decisionType: 'knowledge',
    type: 'Knowledge Decision Record',
    typeUrl: 'https://knowledgeislands.info/specifications/decision-records/kdr'
  }
}
const ID = /^(SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)-(XXX|\d{3,})$/
const INDEX_ID = /^\s*(?:\d+\.|[-*])\s+.*?((?:SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-[A-Z][A-Z0-9-]+-(?:XXX|\d{3,}))/
const HEADING = /^#\s+((?:SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-[A-Z][A-Z0-9-]+-(?:XXX|\d{3,})):\s+(.+)$/m

export type DecisionRecord = {
  file: string
  id: string
  prefix: string
  scope: string
  serial: string
  expectedDecisionType: string
  expectedType: string
  expectedTypeUrl: string
  expectedFilename: string
  content: string
  body: string
  frontmatter?: string
  frontmatterId?: string
  title?: string
  date?: string
  status?: string
  type?: string
  typeUrl?: string
  decisionType?: string
  headingId?: string
  headingTitle?: string
  missingSections: readonly string[]
}

export type DecisionRecordsContext = {
  directory: string
  dryRun: boolean
  exists: boolean
  kbMode: boolean
  indexFile: string
  indexExists: boolean
  adoptionRootRequired: boolean
  indexIds: readonly string[]
  indexCounts: ReadonlyMap<string, number>
  invalidFilenames: readonly string[]
  records: readonly DecisionRecord[]
  duplicateIds: ReadonlyMap<string, readonly string[]>
  serialGaps: ReadonlyMap<string, readonly number[]>
  outOfOrderIds: readonly { id: string; previous: number }[]
  appendMissingIndexEntries: () => readonly DecisionRecord[]
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

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
      readdirSync(absolute).some((name) => name.endsWith('.md')))
  )
    return absolute
  return join(absolute, kbMode ? KB_DIR : CODE_DIR)
}

const frontmatterValue = (frontmatter: string | undefined, key: string): string | undefined => {
  const value = frontmatter?.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim()
  if (!value) return undefined
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value) as string
    } catch {
      return value
    }
  }
  const quoted = value.match(/^(['"])(.*)\1$/)
  return quoted?.[2] ?? value
}

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
    const records: DecisionRecord[] = []

    for (const file of markdownFiles) {
      const content = readFileSync(join(directory, file), 'utf8')
      const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1]
      const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '')
      const heading = body.match(HEADING)
      const identity = heading?.[1]?.match(ID)
      if (!identity || !heading?.[2]) continue
      const [, prefix, scope, serial] = identity
      const id = `${prefix}-${scope}-${serial}`
      const headingTitle = heading[2].trim()
      const expectedFilename = `${id}-${slugify(headingTitle)}.md`
      const expected = PREFIX_TO_TYPE[prefix] as { decisionType: string; type: string; typeUrl: string }
      records.push({
        file,
        id,
        prefix,
        scope,
        serial,
        expectedDecisionType: expected.decisionType,
        expectedType: expected.type,
        expectedTypeUrl: expected.typeUrl,
        expectedFilename,
        content,
        body,
        ...(frontmatter ? { frontmatter } : {}),
        ...(frontmatterValue(frontmatter, 'id') ? { frontmatterId: frontmatterValue(frontmatter, 'id') } : {}),
        ...(frontmatterValue(frontmatter, 'title') ? { title: frontmatterValue(frontmatter, 'title') } : {}),
        ...(frontmatterValue(frontmatter, 'date') ? { date: frontmatterValue(frontmatter, 'date') } : {}),
        ...(frontmatterValue(frontmatter, 'status') ? { status: frontmatterValue(frontmatter, 'status') } : {}),
        ...(frontmatterValue(frontmatter, 'type') ? { type: frontmatterValue(frontmatter, 'type') } : {}),
        ...(frontmatterValue(frontmatter, 'type_url') ? { typeUrl: frontmatterValue(frontmatter, 'type_url') } : {}),
        ...(frontmatterValue(frontmatter, 'decision_type') ? { decisionType: frontmatterValue(frontmatter, 'decision_type') } : {}),
        headingId: id,
        headingTitle,
        missingSections: ['## Context', '## Decision', '## Consequences'].filter((section) => !body.includes(section))
      })
    }

    const invalidFilenames = records.filter((record) => record.file !== record.expectedFilename).map((record) => record.file)
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
      adoptionRootRequired: indexContent.includes('<!-- ki-decision-records: adoption-root -->'),
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
          const additions = missing.map(
            (record) => `- [${record.id}](${record.file}) — ${record.headingTitle ?? '(title unknown — see file)'}`
          )
          writeFileSync(join(directory, indexFile), `${indexContent.replace(/\n*$/, '\n')}${additions.join('\n')}\n`)
        }
        return missing
      }
    }
  }
}
