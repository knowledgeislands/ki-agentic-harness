/**
 * The work folder's closed list and tidy, read for the `ki-work-package` FOLDER family: each `+/_WORK/<id>/` against
 * its closed list, the tidy candidates (answered reports, received briefs, finished folders outliving their closing
 * mark, open queries beyond the limit), the `+/_WORK_REVIEW/` index, and for the tolerance window each thread folder
 * `+/_THREADS/<run>/` against its old closed list. The listings name candidates; they are never permission to delete.
 */
import { type Dirent, existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const WORK_DIRECTORY = join('+', '_WORK')
const THREADS_DIRECTORY = join('+', '_THREADS')
const REVIEW_DIRECTORY = join('+', '_WORK_REVIEW')
const REVIEW_INDEX = 'README.md'
const REPORT_SUFFIX = '.report.md'
const DECISIONS_LOG = 'decisions.md'
const QUERIES_FILE = 'queries.md'
const STATE_FILE = 'state.md'
const WORK_FILE = 'work.md'
/** The five package files; a single-file work folder holds only `work.md` of them. */
const PACKAGE_FILES: ReadonlySet<string> = new Set([WORK_FILE, STATE_FILE, QUERIES_FILE, 'messages.md', DECISIONS_LOG])
/** Briefs and feedback packages are Markdown files directly under their folder. */
const MARKDOWN_FOLDERS: ReadonlySet<string> = new Set(['briefs', 'feedback'])
const DESIGN_FOLDER = 'design'
/** Design notes, diagram sources such as `*.architecture.json` and Mermaid, and their `.svg` and `.html` renders. */
const DESIGN_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.json', '.mmd', '.svg', '.html'])
/** More open queries than this in `queries.md` is a coordination smell, warned on rather than failed. */
export const OPEN_QUERY_LIMIT = 8
/** A query heading, `### <TAG> - <title>` or `### [<TAG>](<record>) - <title>`, capturing the Needs tag. */
const NEEDS_TAG = '[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*'
const QUERY_HEADING = new RegExp(`^### (?:\\[(${NEEDS_TAG})\\]\\([^)\\s]*\\)|(${NEEDS_TAG})) - `, 'gm')
const FENCED_BLOCK = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm
/** An index line's work id: a wikilink, a Markdown link or a code span leading the list item. */
const INDEX_ID = /^- +(?:\[\[([^\]/|#]+)|\[[^\]]*\]\(<?([^)/>#]+)|`([^`/]+)\/?`)/

export type FolderOutcomes = {
  readonly closed: readonly AuditOutcome[]
  readonly answered: readonly AuditOutcome[]
  readonly briefs: readonly AuditOutcome[]
  readonly finished: readonly AuditOutcome[]
  readonly review: readonly AuditOutcome[]
  readonly queries: readonly AuditOutcome[]
}

const physicalDirectory = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isDirectory()

const entries = (folder: string): Dirent[] =>
  readdirSync(folder, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))

const folders = (directory: string): readonly string[] | undefined =>
  physicalDirectory(directory)
    ? entries(directory)
        .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
        .map((entry) => join(directory, entry.name))
    : undefined

const one = (outcomes: readonly AuditOutcome[], pass: string, absent?: string): readonly AuditOutcome[] => {
  if (absent) return [{ status: 'NOT_APPLICABLE', message: absent }]
  return outcomes.length > 0 ? outcomes : [{ status: 'PASS', message: pass }]
}

const plainFile = (entry: Dirent): boolean => entry.isFile() && !entry.isSymbolicLink()
const report = (entry: Dirent): boolean => plainFile(entry) && entry.name.endsWith(REPORT_SUFFIX)

/** Entries of `design/` that are not design notes, diagram sources or renders, recursing into subject folders. */
const strayDesign = (folder: string, prefix: string): string[] =>
  entries(folder).flatMap((entry) => {
    const path = `${prefix}/${entry.name}`
    if (entry.isDirectory() && !entry.isSymbolicLink()) return strayDesign(join(folder, entry.name), path)
    return plainFile(entry) && DESIGN_EXTENSIONS.has(extname(entry.name)) ? [] : [path]
  })

/** Entries of a work folder outside its closed list, `design/`, `briefs/` and `feedback/` read one level down. */
export const workFolderStray = (folder: string): readonly string[] =>
  entries(folder).flatMap((entry) => {
    if (plainFile(entry) && (PACKAGE_FILES.has(entry.name) || entry.name.endsWith(REPORT_SUFFIX))) return []
    if (!entry.isDirectory() || entry.isSymbolicLink()) return [entry.name]
    if (entry.name === DESIGN_FOLDER) return strayDesign(join(folder, entry.name), entry.name)
    if (!MARKDOWN_FOLDERS.has(entry.name)) return [`${entry.name}/`]
    return entries(join(folder, entry.name))
      .filter((inner) => !(plainFile(inner) && extname(inner.name) === '.md'))
      .map((inner) => `${entry.name}/${inner.name}${inner.isDirectory() ? '/' : ''}`)
  })

/** Entries of a thread folder outside its old closed list, `decisions.md` and `<name>.report.md`. */
export const threadFolderStray = (folder: string): readonly string[] =>
  entries(folder)
    .filter((entry) => !(report(entry) || (plainFile(entry) && entry.name === DECISIONS_LOG)))
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))

/** The prose of a report's `## Queries` section, fenced blocks blanked, or empty when it has none. */
const querySection = (text: string): string =>
  /^## Queries[ \t]*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text.replace(FENCED_BLOCK, ' '))?.[1] ?? ''

/**
 * The Needs tags of a report's open queries: the `###` headings under its `## Queries` section, each
 * `<TAG> - <title>`, the tag optionally linked to its record. A report with no Queries section names none.
 */
export const reportQueryTags = (text: string): readonly string[] =>
  Array.from(querySection(text).matchAll(QUERY_HEADING), (match) => match[1] ?? match[2] ?? '').filter(Boolean)

/** The reports whose every Needs tag the folder's decisions log names, so all their queries are answered. */
export const answeredReports = (folder: string): readonly string[] => {
  const path = join(folder, DECISIONS_LOG)
  const log = existsSync(path) ? readFileSync(path, 'utf8') : ''
  const named = (tag: string): boolean => new RegExp(`(?<![A-Z0-9-])${tag}(?![A-Z0-9-])`).test(log)
  return entries(folder)
    .filter(report)
    .filter((entry) => reportQueryTags(readFileSync(join(folder, entry.name), 'utf8')).every(named))
    .map((entry) => entry.name)
}

/** The briefs `briefs/<run>.md` whose run's report `<run>.report.md` the folder has received. */
export const receivedBriefs = (folder: string): readonly string[] => {
  const briefs = join(folder, 'briefs')
  if (!physicalDirectory(briefs)) return []
  return entries(briefs)
    .filter((entry) => plainFile(entry) && extname(entry.name) === '.md')
    .filter((entry) => existsSync(join(folder, `${entry.name.slice(0, -'.md'.length)}${REPORT_SUFFIX}`)))
    .map((entry) => `briefs/${entry.name}`)
}

/** The open queries in a work package's `queries.md`: the `###` query headings under its `## Open` section. */
export const openQueryCount = (folder: string): number => {
  const path = join(folder, QUERIES_FILE)
  if (!existsSync(path)) return 0
  const open = /^## Open[ \t]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(readFileSync(path, 'utf8'))?.[1] ?? ''
  return Array.from(open.matchAll(QUERY_HEADING)).length
}

const frontField = (path: string, field: string): string | undefined => {
  if (!existsSync(path)) return undefined
  const head = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, 'utf8'))?.[1] ?? ''
  const value = new RegExp(`^${field}:[ \\t]*['"]?([^'"\\n]*?)['"]?[ \\t]*$`, 'm').exec(head)?.[1]
  return value === undefined || value === '' ? undefined : value
}

/**
 * Whether finished work's folder has outlived the mark that closes it: the work is `finished` and its mark falls at or
 * after the moment it finished, so the close-out commit is due. The state comes from `state.md` where the package has
 * one, otherwise from the single-file `work.md`.
 */
export const outlivesClosingMark = (folder: string): boolean => {
  const file = existsSync(join(folder, STATE_FILE)) ? join(folder, STATE_FILE) : join(folder, WORK_FILE)
  if (frontField(file, 'state') !== 'finished') return false
  const since = Date.parse(frontField(file, 'since') ?? '')
  const mark = Date.parse(frontField(file, 'mark') ?? '')
  return !Number.isNaN(since) && !Number.isNaN(mark) && mark >= since
}

/** The `+/_WORK_REVIEW/` folders with no index line, and the index lines naming no folder. */
export const reviewIndexFindings = (
  directory: string
): { readonly unindexed: readonly string[]; readonly orphaned: readonly string[] } => {
  const held = (folders(directory) ?? []).map((folder) => relative(directory, folder))
  const index = join(directory, REVIEW_INDEX)
  const indexed = existsSync(index)
    ? readFileSync(index, 'utf8')
        .split(/\r?\n/)
        .map((line) => INDEX_ID.exec(line))
        .flatMap((match) => (match ? [(match[1] ?? match[2] ?? match[3] ?? '').trim()] : []))
        .filter(Boolean)
    : []
  return {
    unindexed: held.filter((id) => !indexed.includes(id)),
    orphaned: indexed.filter((id) => !held.includes(id))
  }
}

export const folderOutcomes = (root: string): FolderOutcomes => {
  const work = folders(join(root, WORK_DIRECTORY))
  const threads = folders(join(root, THREADS_DIRECTORY))
  const absent = work || threads ? undefined : 'No `+/_WORK/` or `+/_THREADS/` folder is present.'
  const subject = (path: string): string => relative(root, path)
  const closed: AuditOutcome[] = []
  const answered: AuditOutcome[] = []
  const briefs: AuditOutcome[] = []
  const finished: AuditOutcome[] = []
  const queries: AuditOutcome[] = []
  for (const folder of work ?? []) {
    const stray = workFolderStray(folder)
    if (stray.length > 0)
      closed.push({
        status: 'VIOLATION',
        message: `a work folder holds only the five package files, \`<name>${REPORT_SUFFIX}\`, \`briefs/\`, \`feedback/\` and \`design/\` notes with their diagram sources and renders; outside the closed list: ${stray.join(', ')}`,
        subject: subject(folder)
      })
    const due = answeredReports(folder)
    if (due.length > 0)
      answered.push({
        status: 'VIOLATION',
        message: `every query of these reports is answered in the decisions log, so each whose outcome has a durable home is due for the tidy: ${due.join(', ')}`,
        subject: subject(folder)
      })
    const received = receivedBriefs(folder)
    if (received.length > 0)
      briefs.push({
        status: 'VIOLATION',
        message: `each of these briefs has its run's report in the folder, so it is due for the tidy: ${received.join(', ')}`,
        subject: subject(folder)
      })
    if (outlivesClosingMark(folder))
      finished.push({
        status: 'VIOLATION',
        message:
          "finished work's folder outlives the mark that closes it; once its decisions are homed and `design/` resolved, delete the folder in one commit",
        subject: subject(folder)
      })
    const open = openQueryCount(folder)
    if (open > OPEN_QUERY_LIMIT)
      queries.push({
        status: 'VIOLATION',
        message: `${open} open queries in \`${QUERIES_FILE}\`, more than ${OPEN_QUERY_LIMIT}: a coordination smell; answer, park or merge them`,
        subject: subject(join(folder, QUERIES_FILE))
      })
  }
  for (const folder of threads ?? []) {
    const stray = threadFolderStray(folder)
    if (stray.length > 0)
      closed.push({
        status: 'VIOLATION',
        level: 'WARN',
        message: `legacy: a thread folder holds only \`${DECISIONS_LOG}\` and \`<name>${REPORT_SUFFIX}\`; outside the closed list: ${stray.join(', ')}`,
        subject: subject(folder)
      })
    const due = answeredReports(folder)
    if (due.length > 0)
      answered.push({
        status: 'VIOLATION',
        message: `every query of these reports is answered in the decisions log, so each whose outcome has a durable home is due for the tidy: ${due.join(', ')}`,
        subject: subject(folder)
      })
  }
  if (threads && threads.length > 0)
    closed.push({
      status: 'VIOLATION',
      level: 'WARN',
      message: `legacy: ${threads.length} thread folder(s) under \`+/_THREADS/\` are the thread-model shape; each moves into its work folder \`+/_WORK/<id>/\` at the territory's migration`,
      subject: THREADS_DIRECTORY
    })
  const reviewDirectory = join(root, REVIEW_DIRECTORY)
  const review: AuditOutcome[] = []
  if (physicalDirectory(reviewDirectory)) {
    const { unindexed, orphaned } = reviewIndexFindings(reviewDirectory)
    if (unindexed.length > 0)
      review.push({
        status: 'VIOLATION',
        message: `each folder awaiting review has one line in \`${REVIEW_INDEX}\` saying why it is there; no line names: ${unindexed.join(', ')}`,
        subject: subject(join(reviewDirectory, REVIEW_INDEX))
      })
    if (orphaned.length > 0)
      review.push({
        status: 'VIOLATION',
        message: `an index line goes with its folder when the folder leaves review; no folder holds: ${orphaned.join(', ')}`,
        subject: subject(join(reviewDirectory, REVIEW_INDEX))
      })
  }
  const count = (work?.length ?? 0) + (threads?.length ?? 0)
  const noWork = work ? undefined : 'No `+/_WORK/` folder is present.'
  return {
    closed: one(closed, `The ${count} work folder(s) hold only their closed list.`, absent),
    answered: one(answered, 'No folder keeps a report whose every query is answered.', absent),
    briefs: one(briefs, "No folder keeps a brief whose run's report it has received.", noWork),
    finished: one(finished, "No finished work's folder outlives its closing mark.", noWork),
    review: one(
      review,
      'Every folder awaiting review has its index line, and every index line its folder.',
      physicalDirectory(reviewDirectory) ? undefined : 'No `+/_WORK_REVIEW/` holding area is present.'
    ),
    queries: one(queries, `No work package holds more than ${OPEN_QUERY_LIMIT} open queries.`, noWork)
  }
}
