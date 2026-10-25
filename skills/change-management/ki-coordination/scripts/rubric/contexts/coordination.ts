/**
 * Read-only discovery of a repository's coordinating work for the thin `ki-coordination` rubric.
 *
 * Boundary: reads the repository's `.ki.toml` identity, its work files `+/_WORK/<id>/work.md` and the reports and
 * decisions logs beside them, the holding area `+/_WORK_REVIEW/`, which it only counts, and for the tolerance window
 * its `+/_CHECKPOINTS/` records and the thread reports under `+/_THREADS/<run>/`, each old shape passing with a
 * warning; on a Capital the `Streams/Projects/`, `Streams/Themes/` and legacy `Streams/Initiatives/` registry; and the
 * coordinator binding: the repository's and the user's Claude Code settings, of which it reads only the output style and the hook
 * commands, and the deployed output style; and for the owner-queue cap the front matter of the roadmap records in the
 * checkout and in each checkout beside it that names the same Capital. It never
 * writes, and it never judges a transcript: coordinator behaviour is reviewed by the judgment items from evidence the
 * owner selects.
 */
import { type Dirent, existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'
import { REPOSITORY_CODE, SCOPE_SEGMENT, SERIAL } from '../../shared/work-identifiers.ts'

/** Territory work's cap on simultaneously active Project work. */
export const ACTIVE_THREAD_CAP = 4
const MASTER_THREAD = '_state-of-play'
const CHECKPOINT_DIRECTORY = join('+', '_CHECKPOINTS')
const WORK_DIRECTORY = join('+', '_WORK')
const WORK_REVIEW_DIRECTORY = join('+', '_WORK_REVIEW')
const PROJECTS_DIRECTORY = join('Streams', 'Projects')
const THEMES_DIRECTORY = join('Streams', 'Themes')
const INITIATIVES_DIRECTORY = join('Streams', 'Initiatives')
const THREADS_DIRECTORY = join('+', '_THREADS')
const REPORT_SUFFIX = '.report.md'
const WORK_FILE = 'work.md'
/** The work package's state file; a folder holding one is in the five-file package shape. */
const STATE_FILE = 'state.md'
/** More roadmap records than this awaiting acceptance for one Project is over the owner-queue cap, warned on rather than failed. */
export const AWAITING_ACCEPTANCE_LIMIT = 8
/** The roadmap folders of a Knowledge Base and of a code repository. */
const ROADMAP_DIRECTORIES = [join('Streams', 'Roadmap'), join('docs', 'roadmap')] as const
/** The roadmap status of a record whose delivery waits on the owner's acceptance. */
const AWAITING_ACCEPTANCE = 'awaiting-review'
const WORK_SEGMENT = '[a-z0-9]+(?:-[a-z0-9]+)*'
/** A work id: the territory, then a Project slug or `regular`, then for ad hoc work its slug. */
const WORK_ID = new RegExp(`^${WORK_SEGMENT}(?:\\.${WORK_SEGMENT}){0,2}$`)
/** The work states a work file's `state` takes, as the Work Process note's observatory fields name them. */
const SETTLED_STATES: ReadonlySet<string> = new Set(['on-hold', 'finished'])
/**
 * A full record identifier in prose: repository code, issuing area and serial, composed from the shared grammar, which
 * also matches a Decision Record such as `ADR-KI-HARNESS-010`.
 * A Needs tag such as `ACCEPT-181` or `GOV-187-REVIEW` has no issuing-area segment between a repository code and a
 * serial and is not matched; neither is a short form such as `GOV-187`, which the judgment items review.
 */
const RECORD_IDENTIFIER = new RegExp(`(?<![A-Z0-9-])${REPOSITORY_CODE}-${SCOPE_SEGMENT}-${SERIAL}(?![A-Z0-9-])`, 'g')
const FENCED_BLOCK = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm
const MARKDOWN_LINK = /\[([^\]\n]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
/** An inline code span: a run of backticks closed by a run of the same length, within one paragraph. */
const CODE_SPAN = /(?<!`)(`+)(?!`)(?:[^\n]|\n(?![ \t]*\n))*?(?<!`)\1(?!`)/g
const OUTPUT_STYLE = 'ki-coordinator'
const COORDINATOR_HOOK = 'coordinator-reminder.sh'
const HOOK_EVENTS = ['UserPromptSubmit', 'SessionStart'] as const
const PROJECT_THREAD = /^(?<initiative>[a-z0-9]+(?:-[a-z0-9]+)*)\.(?<project>[a-z0-9]+(?:-[a-z0-9]+)*)$/
/** A report whose form line leads with a glyph state was written under the work model, so on or after 2026-10-18; 🧑 and → 👤 are the glyphs before GLYPH-OWNER. */
const GLYPH_FORM_LINE =
  /^\*\*(?:🤖|👤|🧑|⏸️|🏁|→ 🎯|→ 👤)[^\n]* · (?:Summary|Recap|Full summary|Re-bootstrap|Run report|Hold report) at /mu

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }

export type CoordinationRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly master: OutcomeContext
  readonly labels: OutcomeContext
  readonly roles: OutcomeContext
  readonly cap: OutcomeContext
  readonly links: OutcomeContext
  readonly confidence: OutcomeContext
  readonly headings: OutcomeContext
  readonly binding: OutcomeContext
  readonly judgment: OutcomeContext
}

type Checkpoint = {
  readonly path: string
  readonly thread: string
  readonly fields: Readonly<Record<string, unknown>> | null
}

/** One work file: its id from its folder name, its folder and its front matter. */
export type Work = {
  readonly path: string
  readonly id: string
  readonly folder: string
  readonly fields: Readonly<Record<string, unknown>> | null
}

export type WorkLevel = 'territory' | 'regular' | 'project'

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

/**
 * The level a work id implies: one segment is territory work, the main State of play; a second segment `sop` is a
 * secondary State of play, territory work too; a second segment `regular` regular work; any other Project work.
 */
export const workLevel = (id: string): WorkLevel => {
  const segments = id.split('.')
  if (segments.length === 1 || segments[1] === 'sop') return 'territory'
  return segments[1] === 'regular' ? 'regular' : 'project'
}

const frontMatter = (path: string): Readonly<Record<string, unknown>> | null => {
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
  return fields
}

const parseCheckpoint = (path: string, root: string): Checkpoint => ({
  path: relative(root, path),
  thread: basename(path, '.md'),
  fields: frontMatter(path)
})

/** The folders directly under a directory, sorted, or undefined when the directory is absent. */
const folders = (directory: string): readonly string[] | undefined => {
  if (!physicalDirectory(directory)) return undefined
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => join(directory, entry.name))
    .sort((left, right) => left.localeCompare(right))
}

/**
 * The front matter of a work: its work file's, with the state file's over it where the folder is in the package shape,
 * so the state fields are read from `state.md` and the definition fields from `work.md`.
 */
const workFields = (folder: string): Readonly<Record<string, unknown>> | null => {
  const definition = frontMatter(join(folder, WORK_FILE))
  if (!existsSync(join(folder, STATE_FILE))) return definition
  const state = frontMatter(join(folder, STATE_FILE))
  return definition && state ? { ...definition, ...state, id: definition.id ?? state.id } : definition
}

/** The work files `+/_WORK/<id>/work.md`, or undefined when no `+/_WORK/` subarea exists. */
const workFiles = (root: string): readonly Work[] | undefined => {
  const found = folders(join(root, WORK_DIRECTORY))
  if (!found) return undefined
  return found
    .filter((folder) => existsSync(join(folder, WORK_FILE)))
    .map((folder) => ({
      path: relative(root, join(folder, WORK_FILE)),
      id: basename(folder),
      folder,
      fields: workFields(folder)
    }))
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
      if (slug !== 'Projects' && slug !== 'Initiatives' && slug !== 'Themes' && slug !== 'README') slugs.add(slug)
    } else if (entry.isDirectory() && existsSync(join(directory, entry.name, `${entry.name}.md`))) {
      slugs.add(entry.name)
    }
  }
  return slugs
}

const LEGACY_MASTER_LABEL = 'Master: state-of-play'
const MASTER_LABEL = /^\S.* > SoP$/
const SECONDARY_LABEL = /^\S.* > SoP \([a-z0-9]+(?:-[a-z0-9]+)*\)$/

const masterLabel = (label: unknown): boolean =>
  typeof label === 'string' && (label === LEGACY_MASTER_LABEL || MASTER_LABEL.test(label))

const projectLabel = (label: string, project: string, title = project.replaceAll('-', ' ')): boolean =>
  label.endsWith(`: ${project}`) || label.toLowerCase().endsWith(` > ${title.toLowerCase()}`)

/** A tolerance-window warning: the old shape passes, naming its new home. */
const legacy = (message: string, subject: string): AuditOutcome => ({
  status: 'VIOLATION',
  level: 'WARN',
  message,
  subject
})

const masterOutcomes = (
  records: readonly Checkpoint[] | undefined,
  works: readonly Work[] | undefined,
  capital: boolean
): AuditOutcome[] => {
  const territory = works?.find((work) => !work.id.includes('.'))
  const secondaries = works?.filter((work) => work.id.includes('.') && workLevel(work.id) === 'territory') ?? []
  const master = records?.find((record) => record.thread === MASTER_THREAD)
  if (capital && !territory && !master)
    return [
      {
        status: 'VIOLATION',
        message: 'a Capital holds its territory work `+/_WORK/<territory>/work.md`; none is present',
        subject: WORK_DIRECTORY
      }
    ]
  if (!capital && (territory || secondaries.length || master))
    return [
      {
        status: 'VIOLATION',
        message: 'only a Capital holds territory work; this repository is not its own capital',
        subject: territory?.path ?? secondaries[0]?.path ?? master?.path ?? WORK_DIRECTORY
      }
    ]
  const outcomes: AuditOutcome[] = []
  if (territory && !MASTER_LABEL.test(String(territory.fields?.title ?? '')))
    outcomes.push({
      status: 'VIOLATION',
      message: 'territory work is titled `<Territory> > SoP`',
      subject: territory.path
    })
  for (const secondary of secondaries) {
    const name = secondary.id.split('.')[2]
    if (
      !SECONDARY_LABEL.test(String(secondary.fields?.title ?? '')) ||
      !String(secondary.fields?.title).endsWith(`(${name})`)
    )
      outcomes.push({
        status: 'VIOLATION',
        message: 'a secondary State of play `<territory>.sop.<name>` is titled `<Territory> > SoP (<name>)`',
        subject: secondary.path
      })
  }
  if (master && !masterLabel(master.fields?.label))
    outcomes.push({
      status: 'VIOLATION',
      message:
        'the state-of-play thread checkpoint is labelled `<Space> > SoP`, or `Master: state-of-play` until its change is approved',
      subject: master.path
    })
  if (master)
    outcomes.push(
      legacy(
        "the state-of-play checkpoint is the thread-model shape; territory work moves to `+/_WORK/<territory>/work.md` at the territory's migration",
        master.path
      )
    )
  return outcomes
}

/** The first UTC day on which a theme resolving only in `Streams/Initiatives/` fails rather than warns, set under THEME-CLOSE. */
export const THEMES_CLOSE = '2026-11-07'

/** The current UTC day, `YYYY-MM-DD`. */
const utcDay = (): string => new Date().toISOString().slice(0, 10)

/** The theme a work file names, resolved in `Streams/Themes/`, or in the legacy `Streams/Initiatives/` with a warning until {@link THEMES_CLOSE} and a violation from it. */
export const themeOutcomes = (
  work: Work,
  themes: ReadonlySet<string> | undefined,
  initiatives: ReadonlySet<string> | undefined,
  today = utcDay()
): AuditOutcome[] => {
  const theme = work.fields?.theme
  if (theme === undefined || theme === null) return []
  if (typeof theme !== 'string')
    return [{ status: 'VIOLATION', message: "a work file's `theme` is a theme slug", subject: work.path }]
  if (themes?.has(theme)) return []
  if (initiatives?.has(theme)) {
    const message = `the theme \`${theme}\` resolves only in the legacy \`Streams/Initiatives/\` registry; its page moves to \`Streams/Themes/${theme}.md\``
    return [
      today < THEMES_CLOSE
        ? legacy(`${message}, which fails from ${THEMES_CLOSE}`, work.path)
        : { status: 'VIOLATION', level: 'FAIL', message, subject: work.path }
    ]
  }
  if (!themes && !initiatives) return []
  return [
    {
      status: 'VIOLATION',
      message: `the theme \`${theme}\` is not in the Capital's \`Streams/Themes/\` registry`,
      subject: work.path
    }
  ]
}

/** A registered Project's title from its note, flat or folder, falling back to the slug in words. */
const registeredProjectTitle = (root: string, projects: ReadonlySet<string> | undefined, slug: string): string => {
  const flatNote = join(root, PROJECTS_DIRECTORY, `${slug}.md`)
  const projectNote = existsSync(flatNote) ? flatNote : join(root, PROJECTS_DIRECTORY, slug, `${slug}.md`)
  const registeredTitle = projects?.has(slug) ? frontMatter(projectNote)?.title : undefined
  return typeof registeredTitle === 'string' && registeredTitle.trim() ? registeredTitle : slug.replaceAll('-', ' ')
}

const labelOutcomes = (
  root: string,
  records: readonly Checkpoint[],
  works: readonly Work[],
  capital: boolean,
  today = utcDay()
): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  const projects = capital ? registrySlugs(join(root, PROJECTS_DIRECTORY)) : undefined
  const themes = capital ? registrySlugs(join(root, THEMES_DIRECTORY)) : undefined
  const initiatives = capital ? registrySlugs(join(root, INITIATIVES_DIRECTORY)) : undefined
  for (const work of works) {
    if (workLevel(work.id) !== 'project') continue
    const slug = work.id.split('.')[1] ?? ''
    const project = work.fields?.project
    const title = work.fields?.title
    const projectTitle = registeredProjectTitle(root, projects, slug)
    if (project !== slug)
      outcomes.push({
        status: 'VIOLATION',
        message: `Project work names its Project in \`project: ${slug}\`, the second segment of its id`,
        subject: work.path
      })
    if (typeof title !== 'string' || !projectLabel(title, slug, projectTitle))
      outcomes.push({
        status: 'VIOLATION',
        message: `the title of Project work ends in its Project's title, \` > ${projectTitle}\``,
        subject: work.path
      })
    if (projects && !projects.has(slug))
      outcomes.push({
        status: 'VIOLATION',
        message: `the Project \`${slug}\` is not in the Capital's \`Streams/Projects/\` registry`,
        subject: work.path
      })
    if (capital) outcomes.push(...themeOutcomes(work, themes, initiatives, today))
  }
  for (const record of records) {
    const match = PROJECT_THREAD.exec(record.thread)
    if (!match?.groups) continue
    const { initiative, project } = match.groups as { initiative: string; project: string }
    const label = record.fields?.label
    const projectTitle = registeredProjectTitle(root, projects, project)
    if (typeof label === 'string' && !projectLabel(label, project, projectTitle))
      outcomes.push({
        status: 'VIOLATION',
        message: `the label of a coordination thread checkpoint ends in its Project name, \` > ${projectTitle}\` or \`: ${project}\``,
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
    outcomes.push(
      legacy(
        `the coordination thread checkpoint is the thread-model shape; its work moves to \`+/_WORK/<territory>.${project}/work.md\` at the territory's migration`,
        record.path
      )
    )
  }
  return outcomes
}

/**
 * Each work file declares a `level` that agrees with its id, and its `id`, where given, is its folder name. For the
 * tolerance window, coordinating checkpoints declare their type in `role`: `_state-of-play` as `state-of-play`, an
 * `<initiative>.<project>` checkpoint as `coordination`, unless the owner has declared it `conversational`, since the
 * file name is never authority for the role. Only `_state-of-play` carries `state-of-play`.
 */
const roleOutcomes = (records: readonly Checkpoint[], works: readonly Work[]): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  for (const work of works) {
    if (!WORK_ID.test(work.id)) {
      outcomes.push({
        status: 'VIOLATION',
        message: 'a work folder is named by its id: lower-case kebab segments joined by `.`, at most three',
        subject: work.path
      })
      continue
    }
    const id = work.fields?.id
    if (id !== undefined && id !== work.id)
      outcomes.push({
        status: 'VIOLATION',
        message: `a work file's \`id\` is its folder name, \`${work.id}\``,
        subject: work.path
      })
    const level = workLevel(work.id)
    if (work.fields?.level !== level)
      outcomes.push({
        status: 'VIOLATION',
        message: `a work file declares the level its id implies, \`level: ${level}\``,
        subject: work.path
      })
  }
  for (const record of records) {
    const role = record.fields?.role
    const master = record.thread === MASTER_THREAD
    if (master && role !== 'state-of-play')
      outcomes.push({
        status: 'VIOLATION',
        message: 'the state-of-play thread checkpoint declares `role: state-of-play`',
        subject: record.path
      })
    else if (!master && role === 'state-of-play')
      outcomes.push({
        status: 'VIOLATION',
        message: 'only the `_state-of-play` checkpoint declares `role: state-of-play`',
        subject: record.path
      })
    else if (!master && PROJECT_THREAD.test(record.thread) && role === undefined)
      outcomes.push({
        status: 'VIOLATION',
        message:
          'a coordination thread checkpoint declares `role: coordination`, or `role: conversational` where the owner runs it as a conversation',
        subject: record.path
      })
  }
  return outcomes
}

const capOutcomes = (records: readonly Checkpoint[], works: readonly Work[]): AuditOutcome[] => {
  const activeWork = works.filter(
    (work) => workLevel(work.id) === 'project' && !SETTLED_STATES.has(String(work.fields?.state ?? ''))
  )
  const activeThreads = records.filter(
    (record) => PROJECT_THREAD.test(record.thread) && (record.fields?.state ?? 'active') === 'active'
  )
  const active = activeWork.length + activeThreads.length
  if (active <= ACTIVE_THREAD_CAP) return []
  return [
    {
      status: 'VIOLATION',
      message: `${active} pieces of Project work are active; territory work keeps at most ${ACTIVE_THREAD_CAP} active at once`,
      subject: activeWork.length > 0 ? WORK_DIRECTORY : CHECKPOINT_DIRECTORY
    }
  ]
}

/**
 * The work folders awaiting review under `+/_WORK_REVIEW/`, which are counted and otherwise not checked; a non-empty
 * area warns, so that territory work raises it to the owner as one `REVIEW-HOLD` query.
 */
const reviewOutcomes = (root: string): AuditOutcome[] => {
  const review = folders(join(root, WORK_REVIEW_DIRECTORY))
  if (!review || review.length === 0) return []
  return [
    {
      status: 'VIOLATION',
      level: 'WARN',
      message: `${review.length} work folder(s) await review under \`+/_WORK_REVIEW/\`; they are not live and not counted, and territory work raises them as one \`REVIEW-HOLD\` query until the area is empty`,
      subject: WORK_REVIEW_DIRECTORY
    }
  ]
}

/**
 * Reports in work folders, `+/_WORK/<id>/*.report.md`, and for the tolerance window in thread folders,
 * `+/_THREADS/<run>/*.report.md`; undefined when neither subarea exists. Work awaiting review is not read.
 */
const workReports = (root: string): readonly string[] | undefined => {
  const work = folders(join(root, WORK_DIRECTORY))
  const threads = folders(join(root, THREADS_DIRECTORY))
  if (!work && !threads) return undefined
  const reports: string[] = []
  for (const folder of [...(work ?? []), ...(threads ?? [])])
    for (const entry of readdirSync(folder, { withFileTypes: true }))
      if (entry.isFile() && !entry.isSymbolicLink() && entry.name.endsWith(REPORT_SUFFIX))
        reports.push(join(folder, entry.name))
  return reports.sort((left, right) => left.localeCompare(right))
}

/** The distinct full record identifiers a text names, in order of first appearance. */
export const recordIdentifiers = (text: string): readonly string[] => [
  ...new Set(Array.from(text.matchAll(RECORD_IDENTIFIER), (match) => match[0]))
]

/**
 * How a record link's absolute local target is checked: for existence inside the audited checkout, or outside it
 * where the target's folder is present on this machine, such as another checkout beside it; otherwise, as on a CI
 * runner where no other checkout exists, for shape only.
 */
const linkCheck = (root: string, file: string): 'existence' | 'shape' => {
  const within = relative(resolve(root), file)
  const inside = !isAbsolute(within) && within.split(sep)[0] !== '..'
  return inside || existsSync(dirname(file)) ? 'existence' : 'shape'
}

/** A record link's shape: its file name is a Markdown file opening with one of the identifiers its text names. */
const recordShaped = (file: string, named: readonly string[]): boolean => {
  const name = basename(file)
  return (
    name.endsWith('.md') && named.some((identifier) => name.startsWith(`${identifier}-`) || name === `${identifier}.md`)
  )
}

/**
 * Review one report for the linking rule: every full record identifier in its prose sits inside the text of a
 * Markdown link, and a link whose text names a record and whose target is an absolute local path points at a file
 * that exists, so a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last
 * revision rather than to its deleted file. A target outside the audited checkout `root` whose folder is absent from
 * this machine cannot be checked for existence, so it is checked for shape only: its file name opens with a named
 * identifier and ends `.md`. Fenced blocks, such as the reply block the owner pastes back, are not prose
 * and are skipped; so are inline code spans, which quote literal text such as a commit subject and cannot hold a link.
 * Links are read first, so a link whose text is a code span still has its target checked.
 */
export const reportLinkFindings = (
  text: string,
  root: string
): { readonly bare: readonly string[]; readonly missing: readonly string[]; readonly misshapen: readonly string[] } => {
  const prose = text.replace(FENCED_BLOCK, ' ')
  const missing = new Set<string>()
  const misshapen = new Set<string>()
  const unlinked = prose.replace(MARKDOWN_LINK, (_whole, label: string, target: string) => {
    const named = recordIdentifiers(label)
    if (named.length > 0 && target.startsWith('/')) {
      const file = target.split('#')[0] ?? target
      if (linkCheck(root, file) === 'existence') {
        if (!existsSync(file)) for (const identifier of named) missing.add(`${identifier} -> ${target}`)
      } else if (!recordShaped(file, named)) for (const identifier of named) misshapen.add(`${identifier} -> ${target}`)
    }
    return ' '
  })
  return { bare: recordIdentifiers(unlinked.replace(CODE_SPAN, ' ')), missing: [...missing], misshapen: [...misshapen] }
}

const linkOutcomes = (root: string, reports: readonly string[]): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  for (const report of reports) {
    const subject = relative(root, report)
    const { bare, missing, misshapen } = reportLinkFindings(readFileSync(report, 'utf8'), root)
    if (bare.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        message: `every record identifier in a work report is a link to its local file; unlinked: ${bare.join(', ')}`,
        subject
      })
    if (missing.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        message: `a record link points at a file that exists, or for a pruned record at the GitHub link to the file at its last revision; missing: ${missing.join(', ')}`,
        subject
      })
    if (misshapen.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        message: `a record link outside this checkout, whose folder is not on this machine, targets a Markdown file named for the record; misshapen: ${misshapen.join(', ')}`,
        subject
      })
  }
  return outcomes
}

/** The prose of a report's `## Queries` section, fenced blocks blanked, or empty when it has none. */
const querySection = (text: string): string =>
  /^## Queries[ \t]*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(text.replace(FENCED_BLOCK, ' '))?.[1] ?? ''

/** The first UTC day on which a report's recommended option must carry a confidence, set by KI-HARNESS-GOV-207. */
export const CONFIDENCE_SINCE = '2026-10-18'
/** A footer banner's top border, `╭─ <form> · <YYYY-MM-DDTHH:MM:SSZ> ─…`, capturing the issued UTC day. */
const ISSUED_BORDER = /^╭─ [a-z -]+ · (\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}Z /gm
const RECOMMENDED_OPTION = /^[ \t]*(?:\*\*Options:\*\*[ \t]*)?[a-z]\) \(recommended/
const CONFIDENT_OPTION =
  /^[ \t]*(?:\*\*Options:\*\*[ \t]*)?[a-z]\) \(recommended, confidence (?:high|medium|low) - [^)\s][^)]*\)/

/** The latest UTC day a report's footer banners were issued, or undefined for a report with no footer. */
export const reportIssuedDay = (text: string): string | undefined =>
  Array.from(text.matchAll(ISSUED_BORDER), (match) => match[1] ?? '')
    .sort()
    .at(-1)

/**
 * The lines of a report's Queries section that mark an option recommended without the confidence form
 * `(recommended, confidence high|medium|low - <reason>)`. Fenced blocks, such as the reply block, are skipped.
 */
export const reportConfidenceFindings = (text: string): readonly string[] => {
  const section = querySection(text)
  return section
    .split(/\r?\n/)
    .filter((line) => RECOMMENDED_OPTION.test(line) && !CONFIDENT_OPTION.test(line))
    .map((line) => line.trim())
}

/**
 * The `###` headings of a report's Queries section under which more than one lettered option is marked recommended,
 * under REVIEW-CHECK. Fenced blocks are skipped.
 */
export const reportMultipleRecommendationFindings = (text: string): readonly string[] =>
  querySection(text)
    .split(/^(?=### )/m)
    .filter((query) => query.startsWith('### '))
    .filter((query) => query.split(/\r?\n/).filter((line) => RECOMMENDED_OPTION.test(line)).length > 1)
    .map((query) => (query.split(/\r?\n/, 1)[0] ?? '').slice(4).trim())

/** Whether a report's form line leads with a glyph state, so it was written under the work model. */
export const reportHasGlyphForm = (text: string): boolean => GLYPH_FORM_LINE.test(text)

/**
 * A report is held to the confidence form when its form line leads with a glyph state, which the work model brought
 * in on {@link CONFIDENCE_SINCE}, or when a block-letter footer dates it on or after that day; an earlier report, or
 * one with neither to date it, is not checked.
 */
const confidenceOutcomes = (root: string, reports: readonly string[]): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  for (const report of reports) {
    const text = readFileSync(report, 'utf8')
    const issued = reportIssuedDay(text)
    if (!reportHasGlyphForm(text) && (!issued || issued < CONFIDENCE_SINCE)) continue
    const lines = reportConfidenceFindings(text)
    if (lines.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        message: `a recommended option reads \`a) (recommended, confidence high|medium|low - <reason>)\`; without it: ${lines.map((line) => `\`${line.slice(0, 60)}\``).join(', ')}`,
        subject: relative(root, report)
      })
    const packed = reportMultipleRecommendationFindings(text)
    if (packed.length > 0)
      outcomes.push({
        status: 'VIOLATION',
        level: 'WARN',
        message: `a query recommends one option; more than one is marked recommended under: ${packed.map((heading) => `\`${heading.slice(0, 60)}\``).join(', ')}`,
        subject: relative(root, report)
      })
  }
  return outcomes
}

/**
 * Whether a saved report opens with its `#` heading: the first non-blank line, or for a report saved with front matter,
 * a leading `---` block whose first line is a YAML key, the first non-blank line after it. A frame rule, a comment or
 * any other line first does not count.
 */
export const reportOpensWithHeading = (text: string): boolean => {
  const lines = text.replace(/^\uFEFF/u, '').split('\n')
  let start = 0
  if (lines[0]?.trim() === '---' && /^[A-Za-z_][\w-]*:/u.test(lines[1] ?? '')) {
    const close = lines.findIndex((line, at) => at > 0 && line.trim() === '---')
    if (close < 0) return false
    start = close + 1
  }
  const first = lines.slice(start).find((line) => line.trim() !== '')
  return first !== undefined && /^# \S/u.test(first)
}

const headingOutcomes = (root: string, reports: readonly string[]): AuditOutcome[] =>
  reports
    .filter((report) => !reportOpensWithHeading(readFileSync(report, 'utf8')))
    .map((report) => ({
      status: 'VIOLATION' as const,
      message: "a saved report's first non-blank line is its `#` report heading, after front matter if it has any",
      subject: relative(root, report)
    }))

/**
 * The checkouts whose roadmaps count towards the owner queue: the audited root, and each checkout beside it whose
 * `.ki.toml` names the same Capital, so a Capital counts the records its siblings hold for its Projects.
 */
const territoryCheckouts = (root: string): readonly string[] => {
  const capital = repositoryIdentity(root).capital
  if (!capital) return [root]
  const parent = dirname(resolve(root))
  let entries: Dirent[]
  try {
    entries = readdirSync(parent, { withFileTypes: true })
  } catch {
    return [resolve(root)]
  }
  const siblings = entries
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => join(parent, entry.name))
    .filter((checkout) => checkout !== resolve(root) && repositoryIdentity(checkout).capital === capital)
  return [resolve(root), ...siblings]
}

/** The roadmap records awaiting the owner's acceptance in each checkout, counted by the Project their `project` field names. */
export const awaitingAcceptanceCounts = (checkouts: readonly string[]): ReadonlyMap<string, number> => {
  const counts = new Map<string, number>()
  for (const checkout of checkouts)
    for (const roadmap of ROADMAP_DIRECTORIES) {
      const directory = join(checkout, roadmap)
      if (!physicalDirectory(directory)) continue
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isFile() || extname(entry.name) !== '.md') continue
        const fields = frontMatter(join(directory, entry.name))
        if (fields?.status !== AWAITING_ACCEPTANCE || typeof fields.project !== 'string') continue
        counts.set(fields.project, (counts.get(fields.project) ?? 0) + 1)
      }
    }
  return counts
}

/**
 * The owner-queue cap: more than eight roadmap records awaiting acceptance for a piece of Project work's Project warn.
 * The work folder's closed list and tidy are the `ki-work-package` FOLDER items.
 */
const queueOutcomes = (root: string, work: readonly string[]): AuditOutcome[] => {
  const projects = work.filter((folder) => workLevel(basename(folder)) === 'project')
  if (projects.length === 0) return []
  const awaiting = awaitingAcceptanceCounts(territoryCheckouts(root))
  return projects.flatMap((folder): AuditOutcome[] => {
    const project = basename(folder).split('.')[1] ?? ''
    const count = awaiting.get(project) ?? 0
    return count > AWAITING_ACCEPTANCE_LIMIT
      ? [
          {
            status: 'VIOLATION',
            message: `${count} roadmap records await acceptance for Project \`${project}\`, more than ${AWAITING_ACCEPTANCE_LIMIT}: over the owner-queue cap; launch no new build or planning run until acceptance catches up, while acceptance fixes and backlog-clearing work stay allowed`,
            subject: relative(root, folder)
          }
        ]
      : []
  })
}

const settings = (path: string): Readonly<Record<string, unknown>> | null | undefined => {
  if (!existsSync(path)) return undefined
  try {
    return table(JSON.parse(readFileSync(path, 'utf8')))
  } catch {
    return null
  }
}

/** Whether a Claude Code settings `hooks` table runs the coordinator hook at an event. */
const runsHook = (hooks: Readonly<Record<string, unknown>> | null, event: string): boolean => {
  const groups = hooks?.[event]
  if (!Array.isArray(groups)) return false
  return groups.some((group) => {
    const handlers = table(group)?.hooks
    return (
      Array.isArray(handlers) &&
      handlers.some((handler) => {
        const command = table(handler)?.command
        return typeof command === 'string' && command.includes(COORDINATOR_HOOK)
      })
    )
  })
}

/**
 * The coordinator binding where `ki-coordination` is declared: the repository's tracked settings select the output style, and
 * the user's Claude Code settings register the hook with the style deployed beside them. The user half is reported as
 * not checked when the user settings are absent, as on a machine with no Claude Code.
 */
export const bindingOutcomes = (root: string, userHome: string): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  const repositorySettings = join('.claude', 'settings.json')
  const tracked = settings(join(root, repositorySettings))
  outcomes.push(
    tracked?.outputStyle === OUTPUT_STYLE
      ? { status: 'PASS', message: `The repository selects the \`${OUTPUT_STYLE}\` output style.` }
      : {
          status: 'VIOLATION',
          message: `a repository that declares \`ki-coordination\` selects \`"outputStyle": "${OUTPUT_STYLE}"\` in its tracked \`.claude/settings.json\``,
          subject: repositorySettings
        }
  )
  const user = settings(join(userHome, '.claude', 'settings.json'))
  if (user === undefined) {
    outcomes.push({
      status: 'INFO',
      message: 'No user Claude Code settings are present; the coordinator hook binding is not checked.'
    })
    return outcomes
  }
  const missing = HOOK_EVENTS.filter((event) => !runsHook(table(user?.hooks), event))
  if (missing.length > 0)
    outcomes.push({
      status: 'VIOLATION',
      message: `the user's Claude Code settings run \`hooks/${COORDINATOR_HOOK}\` at ${missing.map((event) => `\`${event}\``).join(' and ')}; the user-environment manager binds it`,
      subject: join('~', '.claude', 'settings.json')
    })
  const deployed = join('.claude', 'output-styles', `${OUTPUT_STYLE}.md`)
  if (!existsSync(join(userHome, deployed)))
    outcomes.push({
      status: 'VIOLATION',
      message: `the \`${OUTPUT_STYLE}\` output style is deployed for the user; the user-environment manager binds it`,
      subject: join('~', deployed)
    })
  if (missing.length === 0 && existsSync(join(userHome, deployed)))
    outcomes.push({
      status: 'PASS',
      message: 'The user binds the coordinator hook and deploys the output style.'
    })
  return outcomes
}

export const createCoordinationSession = ({
  repository,
  userHome,
  publication
}: RubricContextOptions): RubricSession<CoordinationRubricContext> => {
  const root = resolve(repository)
  const today = utcDay()
  const identity = repositoryIdentity(root)
  const capital = isCapital(identity)
  const records = checkpoints(root)
  const works = workFiles(root)
  const reports = workReports(root)
  const workFolders = folders(join(root, WORK_DIRECTORY))
  const absent =
    records || works
      ? undefined
      : 'No `+/_WORK/` or `+/_CHECKPOINTS/` subarea is present; no coordinating work has opened here.'
  const unreported = reports
    ? undefined
    : 'No `+/_WORK/` or `+/_THREADS/` folder is present; no coordinating work has reported here.'
  const context: CoordinationRubricContext = {
    rubric: { publication },
    master: {
      outcomes: one(
        masterOutcomes(records, works, capital),
        capital ? 'The Capital holds its territory work.' : 'No territory work is present outside a Capital.',
        !capital && absent ? absent : undefined
      )
    },
    labels: {
      outcomes: one(
        labelOutcomes(root, records ?? [], works ?? [], capital, today),
        'Every piece of Project work names its Project, its title ends in it and it resolves in the registry.',
        absent
      )
    },
    roles: {
      outcomes: one(
        roleOutcomes(records ?? [], works ?? []),
        'Every work file declares the level its id implies.',
        absent
      )
    },
    cap: {
      outcomes: [
        ...one(
          [...capOutcomes(records ?? [], works ?? []), ...queueOutcomes(root, workFolders ?? [])],
          'The active Project work and its records awaiting acceptance are within the cap.',
          absent
        ),
        ...reviewOutcomes(root)
      ]
    },
    links: {
      outcomes: one(
        linkOutcomes(root, reports ?? []),
        reports && reports.length > 0
          ? `Every record identifier in the ${reports.length} work report(s) is a link to an existing file, or outside this checkout to a record-shaped one.`
          : 'No work report is present under `+/_WORK/` or `+/_THREADS/`.',
        unreported
      )
    },
    confidence: {
      outcomes: one(
        confidenceOutcomes(root, reports ?? []),
        reports && reports.length > 0
          ? `Every recommended option in the work reports written on or after ${CONFIDENCE_SINCE} carries its confidence.`
          : 'No work report is present under `+/_WORK/` or `+/_THREADS/`.',
        unreported
      )
    },
    headings: {
      outcomes: one(
        headingOutcomes(root, reports ?? []),
        reports && reports.length > 0
          ? `Each of the ${reports.length} work report(s) opens with its \`#\` heading.`
          : 'No work report is present under `+/_WORK/` or `+/_THREADS/`.',
        unreported
      )
    },
    binding: { outcomes: bindingOutcomes(root, userHome) },
    judgment: {
      outcomes: [
        {
          status: 'INFO',
          message:
            'Coordinator responsiveness, the report forms, the mark and the refresh rule are reviewed from the transcripts, reports and work files the owner selects.'
        }
      ]
    }
  }
  return {
    subjects: [{ families: ['RUBRIC', 'COORD'], context: () => context }],
    proposal: () => ({ writes: [] })
  }
}
