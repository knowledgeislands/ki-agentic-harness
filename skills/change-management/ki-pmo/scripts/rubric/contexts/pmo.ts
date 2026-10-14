/**
 * Read-only discovery of a repository's coordinating threads for the thin `ki-pmo` rubric.
 *
 * Boundary: reads the repository's `.ki.toml` identity, its `+/_CHECKPOINTS/` records, the thread reports under
 * `+/_THREADS/<run>/` and, on a Capital, the `Streams/Projects/` and `Streams/Initiatives/` registry. It never
 * writes, and it never judges a transcript: thread behaviour is reviewed by the judgment items from evidence the
 * owner selects.
 */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'
import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'
import { REPOSITORY_CODE, SCOPE_SEGMENT, SERIAL } from '../../shared/work-identifiers.ts'

/** The state-of-play thread's cap on simultaneously active coordination threads. */
export const ACTIVE_THREAD_CAP = 4
const MASTER_THREAD = '_state-of-play'
const CHECKPOINT_DIRECTORY = join('+', '_CHECKPOINTS')
const PROJECTS_DIRECTORY = join('Streams', 'Projects')
const INITIATIVES_DIRECTORY = join('Streams', 'Initiatives')
const THREADS_DIRECTORY = join('+', '_THREADS')
const REPORT_SUFFIX = '.report.md'
/**
 * A full record identifier in prose: repository code, issuing area and serial, composed from the shared grammar, which
 * also matches a Decision Record such as `ADR-KI-HARNESS-010`.
 * A Needs tag such as `ACCEPT-181` or `GOV-187-REVIEW` has no issuing-area segment between a repository code and a
 * serial and is not matched; neither is a short form such as `GOV-187`, which the judgment items review.
 */
const RECORD_IDENTIFIER = new RegExp(`(?<![A-Z0-9-])${REPOSITORY_CODE}-${SCOPE_SEGMENT}-${SERIAL}(?![A-Z0-9-])`, 'g')
const FENCED_BLOCK = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm
const MARKDOWN_LINK = /\[([^\]\n]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
const PROJECT_THREAD = /^(?<initiative>[a-z0-9]+(?:-[a-z0-9]+)*)\.(?<project>[a-z0-9]+(?:-[a-z0-9]+)*)$/

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }

export type PmoRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly master: OutcomeContext
  readonly labels: OutcomeContext
  readonly cap: OutcomeContext
  readonly links: OutcomeContext
  readonly judgment: OutcomeContext
}

type Checkpoint = {
  readonly path: string
  readonly thread: string
  readonly fields: Readonly<Record<string, unknown>> | null
}

type Identity = { readonly repository?: string; readonly capital?: string }

const table = (value: unknown): Readonly<Record<string, unknown>> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Readonly<Record<string, unknown>>) : null

const physicalDirectory = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isDirectory()

const one = (outcomes: readonly AuditOutcome[], pass: string, absent?: string): readonly AuditOutcome[] => {
  if (absent) return [{ status: 'NOT_APPLICABLE', message: absent }]
  return outcomes.length > 0 ? outcomes : [{ status: 'PASS', message: pass }]
}

/** The `[skills.ki-repo]` identity of a checkout, or an empty identity when it cannot be read. */
export const repositoryIdentity = (root: string): Identity => {
  const config = join(root, '.ki.toml')
  if (!existsSync(config)) return {}
  try {
    const repo = table(table(table(Bun.TOML.parse(readFileSync(config, 'utf8')))?.skills)?.['ki-repo'])
    const repository = typeof repo?.repository === 'string' ? repo.repository : undefined
    const capital = typeof repo?.capital === 'string' ? repo.capital : undefined
    return { repository, capital }
  } catch {
    return {}
  }
}

/** A Capital is a repository whose declared `capital` is itself. */
export const isCapital = (identity: Identity): boolean =>
  Boolean(identity.repository) && identity.repository === identity.capital

const parseCheckpoint = (path: string, root: string): Checkpoint => {
  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  let fields: Readonly<Record<string, unknown>> | null = null
  if (lines[0]?.trim() === '---') {
    const closing = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
    if (closing > 0) {
      try {
        fields = table(Bun.YAML.parse(lines.slice(1, closing).join('\n')))
      } catch {
        fields = null
      }
    }
  }
  return { path: relative(root, path), thread: basename(path, '.md'), fields }
}

const checkpoints = (root: string): readonly Checkpoint[] | undefined => {
  const directory = join(root, CHECKPOINT_DIRECTORY)
  if (!physicalDirectory(directory)) return undefined
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.isSymbolicLink() && extname(entry.name) === '.md')
    .filter((entry) => entry.name !== 'README.md')
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => parseCheckpoint(join(directory, entry.name), root))
}

/** Registry slugs: `<slug>.md` or the folder note `<slug>/<slug>.md`. */
const registrySlugs = (directory: string): ReadonlySet<string> | undefined => {
  if (!physicalDirectory(directory)) return undefined
  const slugs = new Set<string>()
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isFile() && extname(entry.name) === '.md') {
      const slug = basename(entry.name, '.md')
      if (slug !== 'Projects' && slug !== 'Initiatives') slugs.add(slug)
    } else if (entry.isDirectory() && existsSync(join(directory, entry.name, `${entry.name}.md`))) {
      slugs.add(entry.name)
    }
  }
  return slugs
}

const masterOutcomes = (root: string, records: readonly Checkpoint[] | undefined, capital: boolean): AuditOutcome[] => {
  const master = records?.find((record) => record.thread === MASTER_THREAD)
  if (capital && !master)
    return [
      {
        status: 'VIOLATION',
        message: 'a Capital holds the state-of-play thread checkpoint `_state-of-play.md`; none is present',
        subject: join(CHECKPOINT_DIRECTORY, `${MASTER_THREAD}.md`)
      }
    ]
  if (!capital && master)
    return [
      {
        status: 'VIOLATION',
        message:
          'only a Capital holds a `_state-of-play.md` state-of-play checkpoint; this repository is not its own capital',
        subject: master.path
      }
    ]
  if (master && master.fields?.label !== 'Master: state-of-play')
    return [
      {
        status: 'VIOLATION',
        message: 'the state-of-play thread checkpoint is labelled `Master: state-of-play`',
        subject: master.path
      }
    ]
  void root
  return []
}

const labelOutcomes = (root: string, records: readonly Checkpoint[], capital: boolean): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  const projects = capital ? registrySlugs(join(root, PROJECTS_DIRECTORY)) : undefined
  const initiatives = capital ? registrySlugs(join(root, INITIATIVES_DIRECTORY)) : undefined
  for (const record of records) {
    const match = PROJECT_THREAD.exec(record.thread)
    if (!match?.groups) continue
    const { initiative, project } = match.groups as { initiative: string; project: string }
    const label = record.fields?.label
    if (typeof label === 'string' && !label.endsWith(`: ${project}`))
      outcomes.push({
        status: 'VIOLATION',
        message: `the label of a coordination thread checkpoint ends in its Project name, \`: ${project}\``,
        subject: record.path
      })
    if (projects && !projects.has(project))
      outcomes.push({
        status: 'VIOLATION',
        message: `the Project \`${project}\` is not in the Capital's \`Streams/Projects/\` registry`,
        subject: record.path
      })
    if (initiatives && !initiatives.has(initiative))
      outcomes.push({
        status: 'VIOLATION',
        message: `the Initiative \`${initiative}\` is not in the Capital's \`Streams/Initiatives/\` registry`,
        subject: record.path
      })
  }
  return outcomes
}

const capOutcomes = (records: readonly Checkpoint[]): AuditOutcome[] => {
  const active = records.filter(
    (record) => PROJECT_THREAD.test(record.thread) && (record.fields?.state ?? 'active') === 'active'
  )
  if (active.length <= ACTIVE_THREAD_CAP) return []
  return [
    {
      status: 'VIOLATION',
      message: `${active.length} coordination threads are active; the state-of-play thread keeps at most ${ACTIVE_THREAD_CAP} active at once`,
      subject: CHECKPOINT_DIRECTORY
    }
  ]
}

/** Thread reports: `+/_THREADS/<run>/*.report.md`, or undefined when no thread folder exists. */
const threadReports = (root: string): readonly string[] | undefined => {
  const directory = join(root, THREADS_DIRECTORY)
  if (!physicalDirectory(directory)) return undefined
  const reports: string[] = []
  for (const run of readdirSync(directory, { withFileTypes: true })) {
    if (!run.isDirectory() || run.isSymbolicLink()) continue
    for (const entry of readdirSync(join(directory, run.name), { withFileTypes: true }))
      if (entry.isFile() && !entry.isSymbolicLink() && entry.name.endsWith(REPORT_SUFFIX))
        reports.push(join(directory, run.name, entry.name))
  }
  return reports.sort((left, right) => left.localeCompare(right))
}

/** The distinct full record identifiers a text names, in order of first appearance. */
export const recordIdentifiers = (text: string): readonly string[] => [
  ...new Set(Array.from(text.matchAll(RECORD_IDENTIFIER), (match) => match[0]))
]

/**
 * Review one thread report for the linking rule: every full record identifier in its prose sits inside the text of a
 * Markdown link, and a link whose text names a record and whose target is an absolute local path points at a file
 * that exists, so a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last
 * revision rather than to its deleted file. Fenced blocks, such as the reply block the owner pastes back, are not prose
 * and are skipped.
 */
export const reportLinkFindings = (
  text: string
): { readonly bare: readonly string[]; readonly missing: readonly string[] } => {
  const prose = text.replace(FENCED_BLOCK, ' ')
  const missing = new Set<string>()
  const unlinked = prose.replace(MARKDOWN_LINK, (_whole, label: string, target: string) => {
    const named = recordIdentifiers(label)
    if (named.length > 0 && target.startsWith('/')) {
      const file = target.split('#')[0] ?? target
      if (!existsSync(file)) for (const identifier of named) missing.add(`${identifier} -> ${target}`)
    }
    return ' '
  })
  return { bare: recordIdentifiers(unlinked), missing: [...missing] }
}

const linkOutcomes = (root: string, reports: readonly string[]): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  for (const report of reports) {
    const subject = relative(root, report)
    const { bare, missing } = reportLinkFindings(readFileSync(report, 'utf8'))
    if (bare.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        message: `every record identifier in a thread report is a link to its local file; unlinked: ${bare.join(', ')}`,
        subject
      })
    if (missing.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        message: `a record link points at a file that exists, or for a pruned record at the GitHub link to the file at its last revision; missing: ${missing.join(', ')}`,
        subject
      })
  }
  return outcomes
}

export const createPmoSession = ({
  repository,
  publication
}: RubricContextOptions): RubricSession<PmoRubricContext> => {
  const root = resolve(repository)
  const identity = repositoryIdentity(root)
  const capital = isCapital(identity)
  const records = checkpoints(root)
  const reports = threadReports(root)
  const absent = records
    ? undefined
    : 'No `+/_CHECKPOINTS/` subarea is present; no coordinating thread has opened here.'
  const context: PmoRubricContext = {
    rubric: { publication },
    master: {
      outcomes: one(
        masterOutcomes(root, records, capital),
        capital
          ? 'The Capital holds its `_state-of-play.md` state-of-play checkpoint.'
          : 'No state-of-play checkpoint is present outside a Capital.',
        !capital && !records ? absent : undefined
      )
    },
    labels: {
      outcomes: one(
        labelOutcomes(root, records ?? [], capital),
        'Every coordination thread checkpoint label ends in its Project name and resolves in the registry.',
        absent
      )
    },
    cap: {
      outcomes: one(capOutcomes(records ?? []), 'The active coordination threads are within the cap.', absent)
    },
    links: {
      outcomes: one(
        linkOutcomes(root, reports ?? []),
        reports && reports.length > 0
          ? `Every record identifier in the ${reports.length} thread report(s) under \`+/_THREADS/\` is a link to an existing file.`
          : 'No thread report is present under `+/_THREADS/`.',
        reports ? undefined : 'No `+/_THREADS/` folder is present; no coordinating thread has reported here.'
      )
    },
    judgment: {
      outcomes: [
        {
          status: 'INFO',
          message:
            'Coordinator responsiveness, the report forms, the mark and the refresh rule are reviewed from the transcripts, reports and checkpoints the owner selects.'
        }
      ]
    }
  }
  return {
    subjects: [{ families: ['RUBRIC', 'PMO'], context: () => context }],
    proposal: () => ({ writes: [] })
  }
}
