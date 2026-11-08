/**
 * The work folder's closed list and tidy, read for the `ki-work-package` FOLDER family: each `+/_WORK/<id>/` against
 * its closed list, the focus folders its `_index.md` declares included, the tidy candidates (answered reports, received briefs, finished folders outliving their closing
 * mark, open queries beyond the limit), decisions-log text the `ki agent close` gate cannot read as an entry, the
 * `+/_WORK_REVIEW/` index, and for the tolerance window each thread folder `+/_THREADS/<run>/` against its old closed
 * list. The listings name candidates; they are never permission to delete.
 */
import { type Dirent, existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const WORK_DIRECTORY = join('+', '_WORK')
const THREADS_DIRECTORY = join('+', '_THREADS')
const REVIEW_DIRECTORY = join('+', '_WORK_REVIEW')
const REVIEW_INDEX = 'README.md'
const REPORT_SUFFIX = '.report.md'
const DECISIONS_LOG = 'decisions.md'
/** The discussion file, `discussions.md`, or `queries.md` for the DISCUSSIONS tolerance window, read in that order. */
const DISCUSSION_FILES = ['discussions.md', 'queries.md'] as const
const STATE_FILE = 'state.md'
/** The package's entry file under INDEX-ENTRY (Kris, 8 November 2026), its leading underscore sorting it first. */
export const ENTRY_FILE = '_index.md'
/** The entry file's earlier name, still read during the INDEX-ENTRY rollout; `standards-index-entry-migration.md` retires it. */
export const LEGACY_ENTRY_FILE = 'work.md'
/** The entry files a work folder holds, `_index.md` first; holding both fails the closed list. */
export const entryFiles = (folder: string): readonly string[] =>
  [ENTRY_FILE, LEGACY_ENTRY_FILE].filter((name) => existsSync(join(folder, name)))
/** The entry file a reader takes: `_index.md` where present, else `work.md`, else `_index.md` as the name it lacks. */
export const entryFile = (folder: string): string => entryFiles(folder)[0] ?? ENTRY_FILE
const MESSAGES_FILE = 'messages.md'
/** The five package files, either entry name read; a single-file work folder holds only its entry file of them. */
const PACKAGE_FILES: ReadonlySet<string> = new Set([
  ENTRY_FILE,
  LEGACY_ENTRY_FILE,
  STATE_FILE,
  ...DISCUSSION_FILES,
  MESSAGES_FILE,
  DECISIONS_LOG
])
/** Findings, briefs and feedback packages are Markdown files directly under their folder. */
const MARKDOWN_FOLDERS: ReadonlySet<string> = new Set(['findings', 'briefs', 'feedback'])
const DESIGN_FOLDER = 'design'
/** Run reports, `reports/<name>.report.md`, under TOP-LEVEL-NOW (1 November 2026). */
const REPORTS_FOLDER = 'reports'
const BRIEFS_FOLDER = 'briefs'
/** The type folders LAYOUT-PILLARS (2 November 2026) replaces with focus folders, read for the tolerance window. */
const TYPE_FOLDERS = [BRIEFS_FOLDER, DESIGN_FOLDER, REPORTS_FOLDER] as const
/** Folder names a focus id never takes: the type folders and the kinds that keep their own folder. */
export const RESERVED_FOLDERS: ReadonlySet<string> = new Set([...TYPE_FOLDERS, ...MARKDOWN_FOLDERS])
/** A brief in a focus folder, `<focus-id>/<run>.brief.md`. */
const BRIEF_SUFFIX = '.brief.md'
/** A focus area's id, leading its list item under `_index.md`'s `## Focus` as a code span. */
const FOCUS_ITEM = /^(?:\d+[.)]|[-*+])[ \t]+`([^`\n]+)`/
export const FOCUS_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
/**
 * The holding area of EMERGING-FOCUS (3 November 2026): its leading underscore sorts it first and marks it as no theme,
 * the one exception to the kebab-case id rule. Under EMERGING-ONLY-WHEN-USED it is listed only while it holds something.
 */
export const EMERGING_FOCUS = '_emerging'
/** The holding area's name before EMERGING-FOCUS, still read for the tolerance window. */
export const LEGACY_EMERGING_FOCUS = 'aside'
/** A focus id names its folder: kebab-case, or the holding area, and never a reserved folder's name. */
export const focusIdNamesFolder = (id: string): boolean =>
  (FOCUS_ID.test(id) || id === EMERGING_FOCUS) && !RESERVED_FOLDERS.has(id)
/** Design notes, diagram sources such as `*.architecture.json` and Mermaid, and their `.svg` and `.html` renders. */
const DESIGN_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.json', '.mmd', '.svg', '.html'])
/** More open queries than this in the discussion file is a coordination smell, warned on rather than failed. */
export const OPEN_QUERY_LIMIT = 8
/** A query heading, `### <TAG> - <title>` or `### [<TAG>](<record>) - <title>`, capturing the Needs tag. */
const NEEDS_TAG = '[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*'
const QUERY_HEADING = new RegExp(`^### (?:\\[(${NEEDS_TAG})\\]\\([^)\\s]*\\)|(${NEEDS_TAG})) - `, 'gm')
const FENCED_BLOCK = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm
/** An index line's work id: a wikilink, a Markdown link or a code span leading the list item. */
const INDEX_ID = /^- +(?:\[\[([^\]/|#]+)|\[[^\]]*\]\(<?([^)/>#]+)|`([^`/]+)\/?`)/
/** A decisions-log entry: the `ki agent close` gate opens one at every `## ` heading, whatever its text. */
const ENTRY_HEADING = '## '
/** Entry-shaped text before the first entry: a list item, or a heading deeper than an entry's. */
const ENTRY_SHAPED = /^(?:[-*+] |\d+[.)] |#{3,6} )/
const FENCE = /^(`{3,}|~{3,})/

export type FolderOutcomes = {
  readonly closed: readonly AuditOutcome[]
  readonly answered: readonly AuditOutcome[]
  readonly briefs: readonly AuditOutcome[]
  readonly finished: readonly AuditOutcome[]
  readonly review: readonly AuditOutcome[]
  readonly queries: readonly AuditOutcome[]
  readonly decisions: readonly AuditOutcome[]
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

/** The focus ids a Focus section's text lists, each leading its list item as a code span, in order. */
export const focusIdsIn = (focus: string): readonly string[] =>
  focus.split(/\r?\n/).flatMap((line) => {
    const id = FOCUS_ITEM.exec(line)?.[1]?.trim()
    return id ? [id] : []
  })

/**
 * The focus ids a work folder's `_index.md` declares under `## Focus` under LAYOUT-PILLARS, in order: each list item
 * leading with its id as a code span. A folder whose work file has no Focus section declares none.
 */
export const focusIds = (folder: string): readonly string[] => {
  const path = join(folder, entryFile(folder))
  if (!existsSync(path) || !lstatSync(path).isFile()) return []
  return focusIdsIn(/^## Focus[ \t]*$([\s\S]*?)(?=^#{1,2} |(?![\s\S]))/m.exec(readFileSync(path, 'utf8'))?.[1] ?? '')
}

/** The declared focus ids that name a folder, a valid id and no reserved folder name. */
const focusFolders = (folder: string): readonly string[] => focusIds(folder).filter(focusIdNamesFolder)

/**
 * Entries of a work folder outside its closed list: each declared focus folder read as `design/` is, its briefs,
 * reports and design notes with their diagram sources and renders, and `design/`, `findings/`, `briefs/`, `feedback/`
 * and `reports/` read one level down. A top-level `<name>.report.md` is left to {@link topLevelReports} for the
 * tolerance window.
 */
export const workFolderStray = (folder: string): readonly string[] => {
  const focus = new Set(focusFolders(folder))
  return entries(folder).flatMap((entry) => {
    if (plainFile(entry) && (PACKAGE_FILES.has(entry.name) || entry.name.endsWith(REPORT_SUFFIX))) return []
    if (!entry.isDirectory() || entry.isSymbolicLink()) return [entry.name]
    if (entry.name === DESIGN_FOLDER || focus.has(entry.name)) return strayDesign(join(folder, entry.name), entry.name)
    if (entry.name === REPORTS_FOLDER)
      return entries(join(folder, entry.name))
        .filter((inner) => !report(inner))
        .map((inner) => `${entry.name}/${inner.name}${inner.isDirectory() ? '/' : ''}`)
    if (!MARKDOWN_FOLDERS.has(entry.name)) return [`${entry.name}/`]
    return entries(join(folder, entry.name))
      .filter((inner) => !(plainFile(inner) && extname(inner.name) === '.md'))
      .map((inner) => `${entry.name}/${inner.name}${inner.isDirectory() ? '/' : ''}`)
  })
}

/** A focus folder's entry file under INDEX-NAME (4 November 2026), and its earlier name read for the tolerance window. */
export const FOCUS_INDEX = '_index.md'
const LEGACY_FOCUS_INDEX = 'index.md'

/**
 * The declared focus folders holding something without their `_index.md`, each named with `index.md` where it still
 * uses the earlier name, warned on for the INDEX-NAME tolerance window.
 */
export const focusIndexFindings = (folder: string): readonly string[] =>
  focusFolders(folder).flatMap((id) => {
    const area = join(folder, id)
    if (!physicalDirectory(area)) return []
    const names = entries(area).map((entry) => entry.name)
    if (names.includes(FOCUS_INDEX) || names.length === 0) return []
    return [names.includes(LEGACY_FOCUS_INDEX) ? `${id}/${LEGACY_FOCUS_INDEX}` : `${id}/`]
  })

/** A discussion point or message line naming `_emerging` in its `focus:` slot. */
const EMERGING_SLOT = new RegExp(`\\bfocus:[ \\t]*\`?${EMERGING_FOCUS}\\b`)

/**
 * Whether a work folder lists `_emerging` while it holds nothing, under EMERGING-ONLY-WHEN-USED: no file in its
 * folder and no discussion point or message line naming it.
 */
export const idleEmerging = (folder: string): boolean => {
  if (!focusIds(folder).includes(EMERGING_FOCUS)) return false
  const area = join(folder, EMERGING_FOCUS)
  const held = physicalDirectory(area)
    ? entries(area).filter((entry) => entry.name !== FOCUS_INDEX && entry.name !== LEGACY_FOCUS_INDEX)
    : []
  if (held.length > 0) return false
  return ![...DISCUSSION_FILES, MESSAGES_FILE].some((name) => {
    const path = join(folder, name)
    return existsSync(path) && lstatSync(path).isFile() && EMERGING_SLOT.test(readFileSync(path, 'utf8'))
  })
}

/** The type folders, `briefs/`, `design/` and `reports/`, still held by a package that declares its focus areas. */
export const typeFoldersBesideFocus = (folder: string): readonly string[] =>
  focusIds(folder).length === 0 ? [] : TYPE_FOLDERS.filter((name) => physicalDirectory(join(folder, name)))

/** Reports still at a work folder's top level, stray files warned on until the sweep into `reports/` is done. */
export const topLevelReports = (folder: string): readonly string[] =>
  entries(folder)
    .filter(report)
    .map((entry) => entry.name)

/** The `<suffix>` files directly under one subfolder of a work folder, relative to it, or none when it is absent. */
const filesIn = (folder: string, name: string, suffix: string): readonly string[] =>
  physicalDirectory(join(folder, name))
    ? entries(join(folder, name))
        .filter((entry) => plainFile(entry) && entry.name.endsWith(suffix))
        .map((entry) => `${name}/${entry.name}`)
    : []

/**
 * A folder's run reports, relative to it: `reports/<name>.report.md`, then those in each declared focus folder, then any
 * still at the top level.
 */
const runReports = (folder: string): readonly string[] => [
  ...filesIn(folder, REPORTS_FOLDER, REPORT_SUFFIX),
  ...focusFolders(folder).flatMap((id) => filesIn(folder, id, REPORT_SUFFIX)),
  ...topLevelReports(folder)
]

/** Entries of a thread folder outside its old closed list, `decisions.md` and `<name>.report.md`. */
export const threadFolderStray = (folder: string): readonly string[] =>
  entries(folder)
    .filter((entry) => !(report(entry) || (plainFile(entry) && entry.name === DECISIONS_LOG)))
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))

/** The prose of a report's `## Discussion` or `## Queries` section, fenced blocks blanked, or empty when it has none. */
const querySection = (text: string): string =>
  /^## (?:Discussion|Queries)[ \t]*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text.replace(FENCED_BLOCK, ' '))?.[1] ?? ''

/**
 * The Needs tags of a report's open queries: the `###` headings under its `## Discussion` or `## Queries` section, each
 * `<TAG> - <title>`, the tag optionally linked to its record. A report with neither section names none.
 */
export const reportQueryTags = (text: string): readonly string[] =>
  Array.from(querySection(text).matchAll(QUERY_HEADING), (match) => match[1] ?? match[2] ?? '').filter(Boolean)

/** The reports whose every Needs tag the folder's decisions log names, so all their queries are answered. */
export const answeredReports = (folder: string): readonly string[] => {
  const path = join(folder, DECISIONS_LOG)
  const log = existsSync(path) ? readFileSync(path, 'utf8') : ''
  const named = (tag: string): boolean => new RegExp(`(?<![A-Z0-9-])${tag}(?![A-Z0-9-])`).test(log)
  return runReports(folder).filter((name) => reportQueryTags(readFileSync(join(folder, name), 'utf8')).every(named))
}

/**
 * The briefs whose run's report the folder has received: each `<focus-id>/<run>.brief.md`, and for the tolerance window
 * each `briefs/<run>.md`, whose `<run>.report.md` sits in any focus folder, in `reports/` or at the top level.
 */
export const receivedBriefs = (folder: string): readonly string[] => {
  const received = new Set(runReports(folder).map((path) => basename(path, REPORT_SUFFIX)))
  return [
    ...focusFolders(folder).flatMap((id) => filesIn(folder, id, BRIEF_SUFFIX)),
    ...filesIn(folder, BRIEFS_FOLDER, '.md')
  ].filter((path) => received.has(basename(path, path.endsWith(BRIEF_SUFFIX) ? BRIEF_SUFFIX : '.md')))
}

/** A work package's discussion file, `discussions.md` before `queries.md`, or undefined when it has neither. */
export const discussionFile = (folder: string): string | undefined =>
  DISCUSSION_FILES.find((name) => existsSync(join(folder, name)))

/** The open queries in a work package's discussion file: the `###` query headings under its `## Open` section. */
export const openQueryCount = (folder: string): number => {
  const file = discussionFile(folder)
  if (!file) return 0
  const path = join(folder, file)
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
 * Whether a finished work's folder is still standing and so awaits its close-out, whatever its mark: no coordinator
 * reads a Finished work's folder, so territory work closes it under the `ki-work-package` close-out. The state comes from
 * `state.md` where the package has one, otherwise from the single-file entry file.
 */
export const awaitsCloseOut = (folder: string): boolean => {
  const file = existsSync(join(folder, STATE_FILE)) ? join(folder, STATE_FILE) : join(folder, entryFile(folder))
  return frontField(file, 'state') === 'finished'
}

/**
 * Whether the work is On hold, either reason. Under HOLD-TIDY (Kris, 4 November 2026, landed under HOLD-STATES on 7
 * November 2026) a held folder keeps nothing already dealt with, so its tidy candidates fail rather than warn.
 */
export const heldFolder = (folder: string): boolean => {
  const file = existsSync(join(folder, STATE_FILE)) ? join(folder, STATE_FILE) : join(folder, entryFile(folder))
  return frontField(file, 'state') === 'on-hold'
}

/**
 * What in a decisions log the `ki agent close` gate cannot read as an entry, under the tools-ki contract that every
 * `## ` heading opens one and runs to the next: entry-shaped lines before the first heading, which the gate never
 * sees; headings with no text, which it cannot name; and repeated headings, which `ki agent reconcile` cannot address.
 * Fenced blocks are skipped; the gate itself does not skip them, so a `## ` line there still opens an entry.
 */
export const decisionLogFindings = (text: string): readonly string[] => {
  let fence: string | undefined
  let entries = 0
  let unseen = 0
  let empty = 0
  const headings = new Set<string>()
  const repeated = new Set<string>()
  for (const line of text.split(/\r?\n/)) {
    const marker = FENCE.exec(line)?.[1]
    if (marker && (fence === undefined || marker.startsWith(fence))) {
      fence = fence === undefined ? marker : undefined
      continue
    }
    if (fence !== undefined) continue
    if (line.startsWith(ENTRY_HEADING)) {
      entries += 1
      const heading = line.slice(ENTRY_HEADING.length).trim()
      if (heading === '') empty += 1
      else if (headings.has(heading)) repeated.add(heading)
      headings.add(heading)
    } else if (entries === 0 && ENTRY_SHAPED.test(line)) unseen += 1
  }
  return [
    ...(unseen > 0
      ? [`${unseen} entry-shaped line(s) before the first \`## \` heading, which the close gate never reads`]
      : []),
    ...(empty > 0 ? [`${empty} \`## \` heading(s) with no text, which the close gate cannot name`] : []),
    ...[...repeated].map((heading) => `repeated heading \`## ${heading}\`, which \`ki agent reconcile\` cannot address`)
  ]
}

const decisionLogOutcome = (folder: string, subject: (path: string) => string): AuditOutcome | undefined => {
  const path = join(folder, DECISIONS_LOG)
  if (!existsSync(path) || !lstatSync(path).isFile()) return undefined
  const findings = decisionLogFindings(readFileSync(path, 'utf8'))
  return findings.length > 0
    ? {
        status: 'VIOLATION',
        message: `the close gate reads every \`## \` heading as one entry and nothing else; ${findings.join('; ')}`,
        subject: subject(path)
      }
    : undefined
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
  const decisions: AuditOutcome[] = []
  for (const folder of [...(work ?? []), ...(threads ?? [])]) {
    const unread = decisionLogOutcome(folder, subject)
    if (unread) decisions.push(unread)
  }
  for (const folder of work ?? []) {
    const stray = workFolderStray(folder)
    if (stray.length > 0)
      closed.push({
        status: 'VIOLATION',
        message: `a work folder holds only the five package files, one folder per focus area its \`${ENTRY_FILE}\` declares under \`## Focus\` holding briefs, reports and design notes with their diagram sources and renders, \`findings/\`, \`feedback/\` and, for the tolerance window, \`${REPORTS_FOLDER}/<name>${REPORT_SUFFIX}\`, \`briefs/\` and \`design/\`; outside the closed list: ${stray.join(', ')}`,
        subject: subject(folder)
      })
    if (entryFiles(folder).length > 1)
      closed.push({
        status: 'VIOLATION',
        message: `a work folder holds one entry file, \`${ENTRY_FILE}\`; during the INDEX-ENTRY rollout \`${LEGACY_ENTRY_FILE}\` is read in its place, never beside it, so keep one`,
        subject: subject(folder)
      })
    const typed = typeFoldersBesideFocus(folder)
    if (typed.length > 0)
      closed.push({
        status: 'VIOLATION',
        level: 'WARN',
        message: `tolerance: a package that declares its focus areas keeps briefs, reports and design notes in their focus folders, not in type folders; move the contents of ${typed.map((name) => `\`${name}/\``).join(', ')} into the focus folder each belongs to`,
        subject: subject(folder)
      })
    const unindexed = focusIndexFindings(folder)
    if (unindexed.length > 0)
      closed.push({
        status: 'VIOLATION',
        level: 'WARN',
        message: `tolerance: each focus folder starts with \`${FOCUS_INDEX}\`, giving its goal, contents and what it sends out; rename \`index.md\` or add one: ${unindexed.join(', ')}`,
        subject: subject(folder)
      })
    if (idleEmerging(folder))
      closed.push({
        status: 'VIOLATION',
        level: 'WARN',
        message: `\`## Focus\` lists \`${EMERGING_FOCUS}\` while it holds nothing; drop it from the list and remove its folder until something new fits no named focus`,
        subject: subject(folder)
      })
    const loose = topLevelReports(folder)
    if (loose.length > 0)
      closed.push({
        status: 'VIOLATION',
        level: 'WARN',
        message: `tolerance: run reports belong in \`${REPORTS_FOLDER}/\`, leaving only the five package files at the top level; stray until the sweep: ${loose.join(', ')}`,
        subject: subject(folder)
      })
    const held = heldFolder(folder)
    const due = answeredReports(folder)
    if (due.length > 0)
      answered.push({
        status: 'VIOLATION',
        ...(held ? { level: 'FAIL' as const } : {}),
        message: held
          ? `work On hold keeps nothing already dealt with; tidy these reports, whose every query is answered in the decisions log, before the hold: ${due.join(', ')}`
          : `every query of these reports is answered in the decisions log, so each whose outcome has a durable home is due for the tidy: ${due.join(', ')}`,
        subject: subject(folder)
      })
    const received = receivedBriefs(folder)
    if (received.length > 0)
      briefs.push({
        status: 'VIOLATION',
        ...(held ? { level: 'FAIL' as const } : {}),
        message: held
          ? `work On hold keeps nothing already dealt with; tidy these briefs, whose run's report has been received, before the hold: ${received.join(', ')}`
          : `each of these briefs has its run's report in the folder, so it is due for the tidy: ${received.join(', ')}`,
        subject: subject(folder)
      })
    if (awaitsCloseOut(folder))
      finished.push({
        status: 'VIOLATION',
        message:
          "finished work's folder is still standing; territory work closes it at an owner-authorised mark whose report names it, deleting it in one commit once the close-out checks hold, and otherwise asks the owner",
        subject: subject(folder)
      })
    const open = openQueryCount(folder)
    const file = discussionFile(folder) ?? DISCUSSION_FILES[1]
    if (open > OPEN_QUERY_LIMIT)
      queries.push({
        status: 'VIOLATION',
        message: `${open} open queries in \`${file}\`, more than ${OPEN_QUERY_LIMIT}: a coordination smell; answer, park or merge them`,
        subject: subject(join(folder, file))
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
    finished: one(finished, "No finished work's folder is left standing.", noWork),
    review: one(
      review,
      'Every folder awaiting review has its index line, and every index line its folder.',
      physicalDirectory(reviewDirectory) ? undefined : 'No `+/_WORK_REVIEW/` holding area is present.'
    ),
    queries: one(queries, `No work package holds more than ${OPEN_QUERY_LIMIT} open queries.`, noWork),
    decisions: one(decisions, 'Every decisions log is read by the close gate as `## ` entries alone.', absent)
  }
}
