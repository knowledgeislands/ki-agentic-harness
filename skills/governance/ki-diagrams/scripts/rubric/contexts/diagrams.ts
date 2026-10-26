import { DIAGRAM_TYPES, RECEIPT_SUFFIX, receiptFindings } from '../../shared/diagram-receipts.ts'

export {
  type DiagramReceipt,
  diagramReceipt,
  fingerprint,
  RECEIPT_SUFFIX,
  receiptFindings
} from '../../shared/diagram-receipts.ts'

import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { externalReference, SVG_FORMS, type SvgForm } from '../../export-svg.ts'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

const DIAGRAMS_DIRECTORY = 'docs/diagrams'
const MANIFEST_FILE = 'diagrams.toml'
const INDEX_FILE = 'README.md'
const FIELDS = ['type', 'question', 'audience', 'traced', 'stale_when', 'regenerate', 'last_checked'] as const

/**
 * A `traced` entry is a repository-relative path or pathspec glob, or, in a private repository whose
 * remote must not be cited by URL, that path with the revision and lines it was traced at:
 * `path:revision` or `path:revision:lines`, the lines `N` or `N-M`. The audit accepts either form.
 */
const TRACED_CITATION = /^([^:]+):([0-9a-f]{7,40})(?::(\d+)(?:-(\d+))?)?$/

/** Whether a `traced` entry is a plain path or glob, or a well-formed `path:revision:lines` citation. */
export const tracedEntryValid = (entry: unknown): entry is string =>
  typeof entry === 'string' &&
  entry.length > 0 &&
  !entry.startsWith('/') &&
  (!entry.includes(':') || TRACED_CITATION.test(entry))

/** The path part of a `traced` entry, with any `:revision:lines` citation removed. */
export const tracedPath = (entry: string): string => entry.match(TRACED_CITATION)?.[1] ?? entry
/**
 * Optional fields: `commit_html = true` opts a diagram into committing its interactive HTML, and `svg_form` names
 * the committed SVG's form, absent meaning `dual`.
 */
const OPTIONAL_FIELDS = ['commit_html', 'svg_form'] as const
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
  readonly commitHtml: boolean
  readonly svgForm: SvgForm
}

export type DiagramsLayoutContext = {
  readonly directoryExists: boolean
  /** Manifest parse and schema problems, each naming the slug or field at fault. */
  readonly manifestIssues: readonly string[]
  readonly manifestExists: boolean
  readonly indexExists: boolean
  /** Files under docs/diagrams the manifest does not account for. */
  readonly unlisted: readonly string[]
  /** Committed forms a listed diagram lacks, including an SVG the README does not embed or opted-in HTML it does not link. */
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

export type DiagramsReceiptContext = {
  /** One entry per committed viewer whose receipt is missing, unreadable or does not match its source and HTML. */
  readonly findings: readonly string[]
  readonly viewerCount: number
}

export type DiagramsMermaidContext = {
  readonly gitAvailable: boolean
  /** One `<file>:<line>` per tracked Markdown fence whose info string is `mermaid` and carries no keep marker. */
  readonly fences: readonly string[]
  /** Fences the owner decided to keep, marked on the line before. */
  readonly kept: number
}

export type DiagramsMarkContext = {
  /** The working folders under `+/diagrams/`, one per slug. */
  readonly folderCount: number
  /** One `<folder>: <problem>` per working folder whose `mark.toml` is missing or not well formed. */
  readonly findings: readonly string[]
}

export type DiagramsRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly layout: DiagramsLayoutContext
  readonly privacy: DiagramsPrivacyContext
  readonly svg: DiagramsSvgContext
  readonly freshness: DiagramsFreshnessContext
  readonly receipts: DiagramsReceiptContext
  readonly mermaid: DiagramsMermaidContext
  readonly marks: DiagramsMarkContext
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
      if (!([...FIELDS, ...OPTIONAL_FIELDS] as readonly string[]).includes(field))
        issues.push(`${slug}: unknown field ${field}`)
    if ('commit_html' in table && typeof table.commit_html !== 'boolean')
      issues.push(`${slug}: commit_html must be true or false`)
    const svgForm = table.svg_form
    const svgFormValid = (SVG_FORMS as readonly unknown[]).includes(svgForm)
    if ('svg_form' in table && !svgFormValid) issues.push(`${slug}: svg_form must be one of ${SVG_FORMS.join(', ')}`)
    const type = table.type
    if (typeof type !== 'string' || !(DIAGRAM_TYPES as readonly string[]).includes(type))
      issues.push(`${slug}: type must be one of ${DIAGRAM_TYPES.join(', ')}`)
    for (const field of ['question', 'audience', 'stale_when', 'regenerate'] as const)
      if (field in table && (typeof table[field] !== 'string' || !(table[field] as string).trim()))
        issues.push(`${slug}: ${field} must be a non-empty string`)
    const traced = table.traced
    const tracedValid = Array.isArray(traced) && traced.length > 0 && traced.every(tracedEntryValid)
    if ('traced' in table && !tracedValid)
      issues.push(
        `${slug}: traced must be a non-empty list of repository-relative paths, each a path, a pathspec glob or path:revision:lines`
      )
    const lastChecked = table.last_checked
    if ('last_checked' in table && (typeof lastChecked !== 'string' || !REVISION.test(lastChecked)))
      issues.push(`${slug}: last_checked must be a commit identifier`)
    if (typeof type === 'string')
      entries.push({
        slug,
        type,
        traced: tracedValid ? (traced as string[]) : [],
        lastChecked: typeof lastChecked === 'string' ? lastChecked : '',
        commitHtml: table.commit_html === true,
        svgForm: svgFormValid ? (svgForm as SvgForm) : 'dual'
      })
  }
  return { entries, issues }
}

/**
 * Files under docs/diagrams that no listed diagram accounts for, and the committed forms a listed diagram lacks.
 * A diagram's `<slug>.html` and its receipt belong to it only under `commit_html = true`, which also requires the
 * HTML; whether the receipt is present and matches is the receipt check's question.
 */
export const reconcile = (
  files: readonly string[],
  entries: readonly DiagramEntry[],
  index: string | undefined
): { readonly unlisted: readonly string[]; readonly missing: readonly string[] } => {
  const expected = new Set([MANIFEST_FILE, INDEX_FILE])
  const missing: string[] = []
  for (const { slug, type, commitHtml } of entries) {
    const source = `${slug}.${type}.json`
    const svg = `${slug}.svg`
    const html = `${slug}.html`
    expected.add(source).add(svg)
    if (commitHtml) {
      expected.add(html).add(`${slug}${RECEIPT_SUFFIX}`)
      if (!files.includes(html)) missing.push(`${DIAGRAMS_DIRECTORY}/${html}`)
      else if (index !== undefined && !index.includes(`(${html})`))
        missing.push(`${DIAGRAMS_DIRECTORY}/${INDEX_FILE} links no ${html}`)
    }
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

/** Each private-information pattern a committed source, SVG or HTML carries, named by file and kind. */
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

/** The marker on the line before a Mermaid fence that records the owner's decision to keep it. */
export const KEEP_MERMAID = '<!-- ki-diagrams: keep mermaid -->'
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/

/**
 * The Mermaid fences in one Markdown text: each line that opens a fenced block whose info string is `mermaid`,
 * backtick or tilde, as a 1-based line number with whether the line before carries the keep marker. A fence nested in
 * a longer fence is part of its content and is not counted.
 */
export const mermaidFences = (text: string): { readonly line: number; readonly kept: boolean }[] => {
  const lines = text.split(/\r?\n/)
  const found: { line: number; kept: boolean }[] = []
  let open: string | undefined
  lines.forEach((line, index) => {
    const match = FENCE.exec(line)
    if (open) {
      if (match?.[1] && match[1][0] === open[0] && match[1].length >= open.length && !match[2]?.trim()) open = undefined
      return
    }
    if (!match?.[1]) return
    const info = match[2]?.trim() ?? ''
    if (match[1][0] === '`' && info.includes('`')) return
    open = match[1]
    if (info.split(/\s+/)[0]?.toLowerCase() === 'mermaid')
      found.push({ line: index + 1, kept: lines[index - 1]?.trim() === KEEP_MERMAID })
  })
  return found
}

/** The Mermaid fences across a repository's tracked Markdown, read from the working tree. */
const repositoryMermaid = (repository: string): { fences: string[]; kept: number } => {
  const files = git(repository, ['ls-files', '-z', '--', '*.md']).stdout.split('\0').filter(Boolean)
  const fences: string[] = []
  let kept = 0
  for (const file of files) {
    const path = join(repository, file)
    if (!isFile(path)) continue
    for (const fence of mermaidFences(readFileSync(path, 'utf8'))) {
      if (fence.kept) kept += 1
      else fences.push(`${file}:${fence.line}`)
    }
  }
  return { fences, kept }
}

/** The working area a build writes each diagram into, one folder per slug. */
export const WORKING_DIRECTORY = '+/diagrams'
/** The sidecar at the root of a working folder that says who wrote it and when. */
export const MARK_FILE = 'mark.toml'

/**
 * A working-area mark under the `ki-delegation` background-run standard: the work, then the run and agent for a
 * background run or the session for an interactive one, then the time.
 */
export type WorkingMark = {
  readonly work?: string
  readonly run?: string
  readonly agent?: string
  readonly session?: string
  readonly written_at: string
}

const MARK_FIELDS = ['work', 'run', 'agent', 'session', 'written_at'] as const

/** The `mark.toml` text for one mark, its fields in the standard's order and absent ones left out. */
export const formatMark = (mark: WorkingMark): string =>
  MARK_FIELDS.map((field) => {
    const value = mark[field]
    return value === undefined ? '' : `${field} = ${JSON.stringify(value)}\n`
  }).join('')

/** Every way one `mark.toml` text falls short of a well-formed mark; empty when it is well formed. */
export const markIssues = (text: string): string[] => {
  let parsed: unknown
  try {
    parsed = TOML.parse(text)
  } catch {
    return ['mark.toml is not TOML']
  }
  if (!isRecord(parsed)) return ['mark.toml is not a table']
  const table = parsed
  const issues: string[] = []
  const stringField = (field: string): string | undefined => {
    const value = table[field]
    if (value === undefined) return undefined
    if (typeof value !== 'string' || !value.trim()) {
      issues.push(`${field} is not a non-empty string`)
      return undefined
    }
    return value
  }
  const [work, run, agent, session, written] = MARK_FIELDS.map(stringField)
  for (const field of Object.keys(table))
    if (!(MARK_FIELDS as readonly string[]).includes(field)) issues.push(`${field} is not a mark field`)
  if (!work) issues.push('work is missing')
  if (run || agent) {
    if (!run || !agent) issues.push('a background run names both run and agent')
    if (session) issues.push('a mark names a run or a session, not both')
  } else if (!session) issues.push('neither run and agent nor session is named')
  if (!written) issues.push('written_at is missing')
  else if (Number.isNaN(Date.parse(written)) || !/^\d{4}-\d{2}-\d{2}T/.test(written))
    issues.push('written_at is not an ISO 8601 time')
  return issues
}

/** The working folders under `+/diagrams/` with what each one's mark lacks. */
const workingMarks = (root: string): DiagramsMarkContext => {
  const directory = join(root, WORKING_DIRECTORY)
  if (!isDirectory(directory)) return { folderCount: 0, findings: [] }
  const folders = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => entry.name)
    .sort()
  const findings = folders.flatMap((folder) => {
    const path = join(directory, folder, MARK_FILE)
    const subject = `${WORKING_DIRECTORY}/${folder}`
    if (!isFile(path)) return [`${subject}: no ${MARK_FILE}`]
    return markIssues(readFileSync(path, 'utf8')).map((issue) => `${subject}: ${issue}`)
  })
  return { folderCount: folders.length, findings }
}

/** Read-only history: the traced paths each diagram's `last_checked` revision has since seen change. */
const staleDiagrams = (repository: string, entries: readonly DiagramEntry[]): string[] =>
  entries.flatMap(({ slug, traced, lastChecked }) => {
    if (!lastChecked || traced.length === 0) return []
    if (!git(repository, ['cat-file', '-e', `${lastChecked}^{commit}`]).ok)
      return [`${slug}: last_checked ${lastChecked} is not in this repository's history`]
    const changed = git(repository, ['diff', '--name-only', lastChecked, 'HEAD', '--', ...traced.map(tracedPath)])
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
  const htmls = files.filter((file) => file.endsWith('.html'))
  const read = (file: string): string => readFileSync(join(directory, file), 'utf8')
  const privacy = [...sources, ...svgs, ...htmls].flatMap((file) =>
    privateFindings(`${DIAGRAMS_DIRECTORY}/${file}`, read(file))
  )
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
    privacy: { findings: privacy, sourceCount: sources.length + svgs.length + htmls.length },
    svg: { findings: external, svgCount: svgs.length },
    freshness: {
      gitAvailable,
      stale: gitAvailable ? staleDiagrams(root, entries) : [],
      diagramCount: entries.length
    },
    receipts: {
      findings: manifestExists ? receiptFindings(directory, entries) : [],
      viewerCount: entries.filter((entry) => entry.commitHtml).length
    },
    mermaid: { gitAvailable, ...(gitAvailable ? repositoryMermaid(root) : { fences: [], kept: 0 }) },
    marks: workingMarks(root),
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
