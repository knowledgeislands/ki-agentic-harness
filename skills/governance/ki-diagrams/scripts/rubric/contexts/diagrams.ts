import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { externalReference } from '../../export-svg.ts'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

const DIAGRAMS_DIRECTORY = 'docs/diagrams'
const MANIFEST_FILE = 'diagrams.toml'
const INDEX_FILE = 'README.md'
export const DIAGRAM_TYPES = ['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle'] as const
const FIELDS = ['type', 'question', 'audience', 'traced', 'stale_when', 'regenerate', 'last_checked'] as const
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const REVISION = /^[0-9a-f]{7,40}$/

/** Local absolute paths and personal addresses that must not reach a committed source or SVG. */
const PRIVATE_PATTERNS: readonly (readonly [string, RegExp])[] = [
  ['local absolute path', /(?:^|[\s"'(=:])(?:\/Users\/|\/home\/|\/private\/|\/var\/folders\/|[A-Za-z]:\\Users\\)/],
  ['file URL', /file:\/\//i],
  ['email address', /\b(?!git@)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/]
]

export type DiagramEntry = {
  readonly slug: string
  readonly type: string
  readonly traced: readonly string[]
  readonly lastChecked: string
}

export type DiagramsLayoutContext = {
  readonly directoryExists: boolean
  /** Manifest parse and schema problems, each naming the slug or field at fault. */
  readonly manifestIssues: readonly string[]
  readonly manifestExists: boolean
  readonly indexExists: boolean
  /** Files under docs/diagrams the manifest does not account for. */
  readonly unlisted: readonly string[]
  /** Committed forms a listed diagram lacks, including an SVG the README does not embed. */
  readonly missing: readonly string[]
  readonly diagramCount: number
}

export type DiagramsPrivacyContext = {
  readonly findings: readonly string[]
  readonly sourceCount: number
}

export type DiagramsSvgContext = {
  readonly findings: readonly string[]
  readonly svgCount: number
}

export type DiagramsFreshnessContext = {
  readonly gitAvailable: boolean
  /** One entry per diagram whose traced paths changed after `last_checked`, or whose revision is unknown. */
  readonly stale: readonly string[]
  readonly diagramCount: number
}

export type DiagramsRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly layout: DiagramsLayoutContext
  readonly privacy: DiagramsPrivacyContext
  readonly svg: DiagramsSvgContext
  readonly freshness: DiagramsFreshnessContext
  readonly judgment: Record<never, never>
}

const isDirectory = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isDirectory()

const isFile = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isFile()

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** The manifest's diagram tables, validated field by field; every problem is reported, not just the first. */
export const parseManifest = (
  text: string
): { readonly entries: readonly DiagramEntry[]; readonly issues: readonly string[] } => {
  let parsed: unknown
  try {
    parsed = TOML.parse(text)
  } catch (error) {
    return { entries: [], issues: [`${MANIFEST_FILE} is not valid TOML: ${(error as Error).message.split('\n')[0]}`] }
  }
  const entries: DiagramEntry[] = []
  const issues: string[] = []
  for (const [slug, table] of Object.entries(parsed as Record<string, unknown>)) {
    if (!SLUG.test(slug)) issues.push(`${slug}: the slug must be lower-case kebab-case`)
    if (!isRecord(table)) {
      issues.push(`${slug}: must be a table`)
      continue
    }
    for (const field of FIELDS) if (!(field in table)) issues.push(`${slug}: missing ${field}`)
    for (const field of Object.keys(table))
      if (!(FIELDS as readonly string[]).includes(field)) issues.push(`${slug}: unknown field ${field}`)
    const type = table.type
    if (typeof type !== 'string' || !(DIAGRAM_TYPES as readonly string[]).includes(type))
      issues.push(`${slug}: type must be one of ${DIAGRAM_TYPES.join(', ')}`)
    for (const field of ['question', 'audience', 'stale_when', 'regenerate'] as const)
      if (field in table && (typeof table[field] !== 'string' || !(table[field] as string).trim()))
        issues.push(`${slug}: ${field} must be a non-empty string`)
    const traced = table.traced
    const tracedValid =
      Array.isArray(traced) &&
      traced.length > 0 &&
      traced.every((path) => typeof path === 'string' && path.length > 0 && !path.startsWith('/'))
    if ('traced' in table && !tracedValid)
      issues.push(`${slug}: traced must be a non-empty list of repository-relative paths`)
    const lastChecked = table.last_checked
    if ('last_checked' in table && (typeof lastChecked !== 'string' || !REVISION.test(lastChecked)))
      issues.push(`${slug}: last_checked must be a commit identifier`)
    if (typeof type === 'string')
      entries.push({
        slug,
        type,
        traced: tracedValid ? (traced as string[]) : [],
        lastChecked: typeof lastChecked === 'string' ? lastChecked : ''
      })
  }
  return { entries, issues }
}

/** Files under docs/diagrams that no listed diagram accounts for, and the committed forms a listed diagram lacks. */
export const reconcile = (
  files: readonly string[],
  entries: readonly DiagramEntry[],
  index: string | undefined
): { readonly unlisted: readonly string[]; readonly missing: readonly string[] } => {
  const expected = new Set([MANIFEST_FILE, INDEX_FILE])
  const missing: string[] = []
  for (const { slug, type } of entries) {
    const source = `${slug}.${type}.json`
    const svg = `${slug}.svg`
    expected.add(source).add(svg).add(`${slug}.html`)
    if (!files.includes(source)) missing.push(`${DIAGRAMS_DIRECTORY}/${source}`)
    if (!files.includes(svg)) missing.push(`${DIAGRAMS_DIRECTORY}/${svg}`)
    else if (index !== undefined && !index.includes(`(${svg})`))
      missing.push(`${DIAGRAMS_DIRECTORY}/${INDEX_FILE} embeds no ${svg}`)
  }
  return {
    unlisted: files.filter((file) => !expected.has(file)).map((file) => `${DIAGRAMS_DIRECTORY}/${file}`),
    missing
  }
}

/** Each private-information pattern a committed source or SVG carries, named by file and kind. */
export const privateFindings = (file: string, text: string): string[] =>
  PRIVATE_PATTERNS.flatMap(([kind, pattern]) => (pattern.test(text) ? [`${file}: ${kind}`] : []))

const git = (repository: string, args: readonly string[]): { ok: boolean; stdout: string } => {
  const result = spawnSync('git', ['-C', repository, ...args], {
    encoding: 'utf8',
    shell: false,
    stdio: ['ignore', 'pipe', 'ignore']
  })
  return { ok: !result.error && result.status === 0, stdout: result.stdout ?? '' }
}

/** Read-only history: the traced paths each diagram's `last_checked` revision has since seen change. */
const staleDiagrams = (repository: string, entries: readonly DiagramEntry[]): string[] =>
  entries.flatMap(({ slug, traced, lastChecked }) => {
    if (!lastChecked || traced.length === 0) return []
    if (!git(repository, ['cat-file', '-e', `${lastChecked}^{commit}`]).ok)
      return [`${slug}: last_checked ${lastChecked} is not in this repository's history`]
    const changed = git(repository, ['diff', '--name-only', lastChecked, 'HEAD', '--', ...traced])
      .stdout.split('\n')
      .filter(Boolean)
    return changed.length === 0 ? [] : [`${slug}: ${changed.join(', ')} changed since ${lastChecked.slice(0, 12)}`]
  })

export const createDiagramsSession = ({
  repository,
  publication
}: RubricContextOptions): RubricSession<DiagramsRubricContext> => {
  const root = resolve(repository)
  const directory = join(root, DIAGRAMS_DIRECTORY)
  const directoryExists = isDirectory(directory)
  const files = directoryExists
    ? readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isFile() && !entry.isSymbolicLink())
        .map((entry) => entry.name)
        .sort()
    : []
  const manifestPath = join(directory, MANIFEST_FILE)
  const manifestExists = directoryExists && isFile(manifestPath)
  const { entries, issues } = manifestExists
    ? parseManifest(readFileSync(manifestPath, 'utf8'))
    : { entries: [], issues: [] }
  const indexPath = join(directory, INDEX_FILE)
  const indexExists = directoryExists && isFile(indexPath)
  const { unlisted, missing } = manifestExists
    ? reconcile(files, entries, indexExists ? readFileSync(indexPath, 'utf8') : undefined)
    : { unlisted: [], missing: [] }

  const sources = files.filter((file) => file.endsWith('.json'))
  const svgs = files.filter((file) => file.endsWith('.svg'))
  const read = (file: string): string => readFileSync(join(directory, file), 'utf8')
  const privacy = [...sources, ...svgs].flatMap((file) => privateFindings(`${DIAGRAMS_DIRECTORY}/${file}`, read(file)))
  const external = svgs.flatMap((file) => {
    const text = read(file)
    if (!text.includes('<svg')) return [`${DIAGRAMS_DIRECTORY}/${file}: not an SVG document`]
    const reference = externalReference(text)
    return reference ? [`${DIAGRAMS_DIRECTORY}/${file}: ${reference}`] : []
  })
  const gitAvailable = git(root, ['rev-parse', '--is-inside-work-tree']).ok

  const context: DiagramsRubricContext = {
    rubric: { publication },
    layout: {
      directoryExists,
      manifestExists,
      manifestIssues: issues,
      indexExists,
      unlisted,
      missing,
      diagramCount: entries.length
    },
    privacy: { findings: privacy, sourceCount: sources.length + svgs.length },
    svg: { findings: external, svgCount: svgs.length },
    freshness: {
      gitAvailable,
      stale: gitAvailable ? staleDiagrams(root, entries) : [],
      diagramCount: entries.length
    },
    judgment: {}
  }

  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['DIAG'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
