import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import type {
  AuditOutcome,
  ConformWrite,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'
import { type FolderOutcomes, folderOutcomes } from './work-folder.ts'

const ACTIVE_FIELDS = ['type', 'thread', 'state', 'created_at', 'updated_at'] as const
const WORK_FILE = 'work.md'
const WORK_REQUIRED = ['id', 'level', 'title', 'worker', 'supervisor', 'state', 'since'] as const
const WORK_FIELDS: ReadonlySet<string> = new Set([
  ...WORK_REQUIRED,
  'label',
  'project',
  'theme',
  'parent',
  'covers',
  'target',
  'hold',
  'blocking',
  'received',
  'beat',
  'mark',
  'created_at'
])
const WORK_LEVELS: readonly unknown[] = ['territory', 'regular', 'project']
const COORDINATING_LEVELS: readonly unknown[] = ['territory', 'project']
const WORK_STATES: readonly unknown[] = [
  'with-worker',
  'handoff-to-supervisor',
  'with-supervisor',
  'handoff-to-worker',
  'handoff',
  'on-hold',
  'finished'
]
const HOLD_REASONS: readonly unknown[] = ['paused', 'more-expected']
const KEBAB = '[a-z0-9]+(?:-[a-z0-9]+)*'
/** The reserved second id segment of a secondary State of play, `<territory>.sop.<name>`. */
const SECONDARY_SEGMENT = 'sop'
const WORK_ID = new RegExp(`^${KEBAB}(?:\\.${KEBAB})*$`)
const SLUG = new RegExp(`^${KEBAB}$`)
const HOLDER = new RegExp(`^(?:owner|agent|(?:run|person|repo)/[A-Za-z0-9_.-]+|work/${KEBAB}(?:\\.${KEBAB})*)$`)
const WORK_HEADINGS = ['Next steps', 'Messages', 'Parked'] as const
const STATE_FILE = 'state.md'
const PACKAGE_FILES = ['queries.md', 'messages.md', 'decisions.md'] as const
const DEFINITION_REQUIRED = ['id', 'level', 'title', 'description', 'worker', 'supervisor'] as const
const DEFINITION_FIELDS: ReadonlySet<string> = new Set([
  ...DEFINITION_REQUIRED,
  'label',
  'project',
  'theme',
  'parent',
  'covers',
  'created_at'
])
const DEFINITION_HEADINGS = ['Goals', 'Scope'] as const
const STATE_REQUIRED = ['id', 'state', 'since'] as const
const STATE_FIELDS: ReadonlySet<string> = new Set([
  ...STATE_REQUIRED,
  'target',
  'hold',
  'blocking',
  'received',
  'beat',
  'mark',
  'method_read'
])
const QUERY_HEADINGS = ['Open', 'Parked'] as const
const QUERY_HEADING = /^[A-Z0-9][A-Z0-9-]* - \S/
const QUERY_PARTS = ['**Context:**', '**Query:**', '**Options:**'] as const
const MESSAGE_LINE =
  /^- (IMPORTANT · )?(\d{4}-\d{2}-\d{2})(?: @[a-z0-9]+(?:-[a-z0-9]+)*)? · [A-Z0-9][A-Z0-9-]* · [^:\n]+: \S/
const REVISION = /^[0-9a-f]{7,40}$/
// Soft limits under the standard's Size limits, warned and never failed.
const LIMITS = {
  description: 500,
  definitionWords: 300,
  stateWords: 400,
  nowLines: 5,
  messageWords: 60,
  messageDays: 7,
  decisionLines: 400
} as const
const DATED_LINE = /^\s*(?:[-*]|\d+\.)?\s*(?:\*\*)?\d{4}-\d{2}-\d{2}/gm
const COMMIT_ID = /\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/g
const TEST_COUNT = /\b\d+\s+(?:tests?|pass(?:ed|es)?|fail(?:ed|s|ures?)?)\b/gi
const OPTIONAL_FIELDS = ['label', 'role'] as const
const ROLES = ['conversational', 'coordination', 'state-of-play'] as const
const COORDINATING_ROLES: readonly unknown[] = ['coordination', 'state-of-play']
const UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const OPAQUE_SESSION_NAME = /^(?:sess(?:ion)?|conversation)[_-][a-z0-9]{12,}$/i
const FORBIDDEN_KEY = /^(?:claude_|codex_)?(?:session|conversation|transcript)(?:_id|_url|_ref)?$/i
const TRANSCRIPT_LINE = /^(?:user|assistant|human|agent):\s+\S/im
const SESSION_CONTINUITY =
  /\b(?:resume|reopen|reattach|reconnect|authenticate|connect)\b[^\n.]{0,60}\b(?:conversation|session)\b/i
const SESSION_LOCATOR =
  /\b(?:https?:\/\/\S*(?:conversation|session)\S*|(?:claude|codex)[_-]?(?:session|conversation)[_-]?[a-z0-9-]{8,})\b/i
const HEADINGS = [
  'Objective',
  'Current state',
  'Decisions made',
  'Files touched',
  'Open questions',
  'Next step'
] as const

type ParsedRecord = {
  readonly path: string
  readonly stem: string
  readonly fields: Readonly<Record<string, unknown>> | null
  readonly body: string
}

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }
export type ScaffoldContext = OutcomeContext & {
  readonly legacy: readonly AuditOutcome[]
  readonly ensureScaffold?: () => void
}
export type RecordContext = {
  readonly identity: readonly AuditOutcome[]
  readonly schema: readonly AuditOutcome[]
  readonly label: readonly AuditOutcome[]
  readonly role: readonly AuditOutcome[]
}
export type LifecycleContext = { readonly mechanical: readonly AuditOutcome[]; readonly size: readonly AuditOutcome[] }

export type WorkPackageRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly configuration: OutcomeContext
  readonly structure: ScaffoldContext
  readonly records: RecordContext
  readonly lifecycle: LifecycleContext
  readonly boundary: OutcomeContext
  readonly folder: FolderOutcomes
}

const table = (value: unknown): Readonly<Record<string, unknown>> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Readonly<Record<string, unknown>>) : null

const physicalDirectory = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isDirectory()
const physicalFile = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isFile()

const one = (outcomes: readonly AuditOutcome[], pass: string, absent?: string): readonly AuditOutcome[] => {
  if (absent) return [{ status: 'NOT_APPLICABLE', message: absent }]
  return outcomes.length > 0 ? outcomes : [{ status: 'PASS', message: pass }]
}

const parseCheckpoint = (path: string, root: string): ParsedRecord => {
  const text = readFileSync(path, 'utf8')
  const lines = text.split(/\r?\n/)
  let fields: Readonly<Record<string, unknown>> | null = null
  let body = text
  if (lines[0]?.trim() === '---') {
    const closing = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
    if (closing > 0) {
      try {
        fields = table(Bun.YAML.parse(lines.slice(1, closing).join('\n')))
      } catch {
        fields = null
      }
      body = lines.slice(closing + 1).join('\n')
    }
  }
  return { path: relative(root, path), stem: basename(path, '.md'), fields, body }
}

const inspectDirectory = (directory: string, root: string): { records: ParsedRecord[]; violations: AuditOutcome[] } => {
  const records: ParsedRecord[] = []
  const violations: AuditOutcome[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const path = join(directory, entry.name)
    if (entry.name === 'README.md') continue
    if (!entry.isFile() || entry.isSymbolicLink() || extname(entry.name) !== '.md') {
      violations.push({
        status: 'VIOLATION',
        message: 'checkpoint scope permits only flat regular Markdown records',
        subject: relative(root, path)
      })
      continue
    }
    records.push(parseCheckpoint(path, root))
  }
  return { records, violations }
}

const validTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && UTC_TIMESTAMP.test(value) && !Number.isNaN(Date.parse(value))

/** Whether the repository's `.ki.toml` declares `[skills.ki-coordination]`, the gate for a coordinating role. */
const declaresCoordination = (root: string): boolean => {
  const config = join(root, '.ki.toml')
  if (!physicalFile(config)) return false
  try {
    return table(table(table(Bun.TOML.parse(readFileSync(config, 'utf8')))?.skills)?.['ki-coordination']) !== null
  } catch {
    return false
  }
}

/** Session-continuity material a work file or checkpoint must not carry. */
const boundaryOutcomes = (record: ParsedRecord, fields: Readonly<Record<string, unknown>>): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  const forbiddenFields = Object.keys(fields).filter((key) => FORBIDDEN_KEY.test(key))
  if (forbiddenFields.length > 0)
    outcomes.push({
      status: 'VIOLATION',
      message: `record carries forbidden session or transcript field(s): ${forbiddenFields.join(', ')}`,
      subject: record.path
    })
  if (TRANSCRIPT_LINE.test(record.body))
    outcomes.push({
      status: 'VIOLATION',
      message: 'record body appears to contain role-by-role transcript content',
      subject: record.path
    })
  if (SESSION_CONTINUITY.test(record.body))
    outcomes.push({
      status: 'VIOLATION',
      message: 'record body appears to claim continuity with the originating session',
      subject: record.path
    })
  if (SESSION_LOCATOR.test(record.body))
    outcomes.push({
      status: 'VIOLATION',
      message: 'record body appears to carry a session or conversation locator',
      subject: record.path
    })
  return outcomes
}

const recordEvidence = (
  records: readonly ParsedRecord[],
  coordinationDeclared: boolean,
  absent?: string
): {
  identity: readonly AuditOutcome[]
  schema: readonly AuditOutcome[]
  label: readonly AuditOutcome[]
  role: readonly AuditOutcome[]
  lifecycle: readonly AuditOutcome[]
  boundary: readonly AuditOutcome[]
} => {
  if (absent) {
    const outcome = [{ status: 'NOT_APPLICABLE' as const, message: absent }]
    return { identity: outcome, schema: outcome, label: outcome, role: outcome, lifecycle: outcome, boundary: outcome }
  }
  const identity: AuditOutcome[] = []
  const schema: AuditOutcome[] = []
  const label: AuditOutcome[] = []
  const role: AuditOutcome[] = []
  const lifecycle: AuditOutcome[] = []
  const boundary: AuditOutcome[] = []
  const activeThreads = new Set<string>()

  for (const record of records) {
    const fields = record.fields
    const thread = fields?.thread
    if (!fields) {
      schema.push({
        status: 'VIOLATION',
        message: 'checkpoint frontmatter must be a valid YAML mapping',
        subject: record.path
      })
      continue
    }

    if (!record.stem || record.stem === '.' || record.stem === '..')
      identity.push({
        status: 'VIOLATION',
        message: 'checkpoint filename must provide a non-empty portable thread name',
        subject: record.path
      })
    if (UUID.test(record.stem) || OPAQUE_SESSION_NAME.test(record.stem))
      identity.push({
        status: 'VIOLATION',
        message: 'checkpoint filename appears to encode an opaque runtime-session identifier',
        subject: record.path
      })
    if (typeof thread !== 'string' || thread.length === 0 || thread !== record.stem)
      identity.push({
        status: 'VIOLATION',
        message: 'thread must exactly match the checkpoint filename stem',
        subject: record.path
      })

    const headings = [...record.body.matchAll(/^(#{1,6})\s+(.+?)\s*$/gm)].map((match) => ({
      level: match[1]?.length ?? 0,
      title: match[2] ?? ''
    }))
    const expected = [{ level: 1, title: record.stem }, ...HEADINGS.map((title) => ({ level: 2, title }))]
    if (JSON.stringify(headings) !== JSON.stringify(expected))
      schema.push({
        status: 'VIOLATION',
        message: 'checkpoint headings must be the exact H1 and ordered six-section sequence',
        subject: record.path
      })

    for (const [index, heading] of HEADINGS.entries()) {
      const start = `## ${heading}`
      const sectionStart = record.body.indexOf(start)
      const next = HEADINGS[index + 1]
      const sectionEnd = next ? record.body.indexOf(`## ${next}`, sectionStart + start.length) : record.body.length
      if (
        sectionStart < 0 ||
        sectionEnd < 0 ||
        record.body.slice(sectionStart + start.length, sectionEnd).trim().length === 0
      )
        schema.push({
          status: 'VIOLATION',
          message: `${heading} must contain substantive checkpoint content`,
          subject: record.path
        })
    }

    const actualFields = Object.keys(fields)
    if (
      ACTIVE_FIELDS.some((field) => !actualFields.includes(field)) ||
      actualFields.some(
        (field) =>
          !(ACTIVE_FIELDS as readonly string[]).includes(field) &&
          !(OPTIONAL_FIELDS as readonly string[]).includes(field)
      )
    )
      schema.push({
        status: 'VIOLATION',
        message: 'active checkpoint frontmatter must use only its closed field set',
        subject: record.path
      })
    if ('label' in fields) {
      if (typeof fields.label !== 'string' || fields.label.trim().length === 0 || /[\r\n]/.test(fields.label))
        schema.push({
          status: 'VIOLATION',
          message: 'label must be a non-empty single-line string',
          subject: record.path
        })
    } else
      label.push({
        status: 'VIOLATION',
        message: 'checkpoint has no label naming the thread for the human client',
        subject: record.path
      })
    if ('role' in fields) {
      if (!(ROLES as readonly unknown[]).includes(fields.role))
        schema.push({
          status: 'VIOLATION',
          message: `role must be one of ${ROLES.join(', ')}`,
          subject: record.path
        })
      else if (COORDINATING_ROLES.includes(fields.role) && !coordinationDeclared)
        role.push({
          status: 'VIOLATION',
          message: `role ${String(fields.role)} is valid only where .ki.toml declares [skills.ki-coordination]`,
          subject: record.path
        })
    }
    if (fields.type !== 'ki-checkpoint')
      schema.push({ status: 'VIOLATION', message: 'type must be ki-checkpoint', subject: record.path })
    if (fields.state !== 'active')
      lifecycle.push({
        status: 'VIOLATION',
        message: 'state must be active at the checkpoint location',
        subject: record.path
      })

    const created = fields.created_at
    const updated = fields.updated_at
    if (!validTimestamp(created))
      schema.push({ status: 'VIOLATION', message: 'created_at must be a UTC RFC 3339 timestamp', subject: record.path })
    if (!validTimestamp(updated))
      schema.push({ status: 'VIOLATION', message: 'updated_at must be a UTC RFC 3339 timestamp', subject: record.path })
    if (validTimestamp(created) && validTimestamp(updated) && Date.parse(created) > Date.parse(updated))
      lifecycle.push({
        status: 'VIOLATION',
        message: 'created_at must not be later than updated_at',
        subject: record.path
      })
    if (typeof thread === 'string' && thread.length > 0) {
      if (activeThreads.has(thread))
        lifecycle.push({
          status: 'VIOLATION',
          message: `thread ${thread} has more than one active record`,
          subject: record.path
        })
      activeThreads.add(thread)
    }

    boundary.push(...boundaryOutcomes(record, fields))
  }

  return {
    identity: one(identity, 'Every checkpoint has one consistent human-selected thread identity.'),
    schema: one(schema, 'Every checkpoint uses the closed metadata and heading schema.'),
    label: one(label, 'Every checkpoint carries a presentation label.'),
    role: one(role, 'Every coordinating role is declared where ki-coordination is declared.'),
    lifecycle: one(lifecycle, 'Checkpoint states, uniqueness, and timestamps are coherent.'),
    boundary: one(boundary, 'No mechanically recognisable transcript or session-continuity dependency is present.')
  }
}

type Evidence = {
  identity: AuditOutcome[]
  schema: AuditOutcome[]
  role: AuditOutcome[]
  lifecycle: AuditOutcome[]
  size: AuditOutcome[]
  legacy: AuditOutcome[]
  boundary: AuditOutcome[]
}

/** One work folder: its work file, and in the package shape its other four files where present. */
type WorkFolder = {
  readonly stem: string
  readonly package: boolean
  readonly work: ParsedRecord
  readonly state?: ParsedRecord
  readonly queries?: ParsedRecord
  readonly messages?: ParsedRecord
  readonly decisions?: string
}

/** The work folders under `+/_WORK/`, each a physical directory holding its work file and, as a package, `state.md`. */
const inspectWork = (directory: string, root: string): { works: WorkFolder[]; violations: AuditOutcome[] } => {
  const works: WorkFolder[] = []
  const violations: AuditOutcome[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const folder = join(directory, entry.name)
    if (!entry.isDirectory() || entry.isSymbolicLink()) {
      violations.push({
        status: 'VIOLATION',
        message: '+/_WORK/ holds only physical work folders',
        subject: relative(root, folder)
      })
      continue
    }
    const path = join(folder, WORK_FILE)
    if (!physicalFile(path)) {
      violations.push({
        status: 'VIOLATION',
        message: 'a work folder holds its work file, work.md, as a regular file',
        subject: relative(root, folder)
      })
      continue
    }
    const work = { ...parseCheckpoint(path, root), stem: entry.name }
    // A folder is in the package shape exactly when state.md exists.
    if (!existsSync(join(folder, STATE_FILE))) {
      works.push({ stem: entry.name, package: false, work })
      continue
    }
    const files: Partial<Record<string, ParsedRecord>> = {}
    for (const name of [STATE_FILE, ...PACKAGE_FILES]) {
      const file = join(folder, name)
      if (physicalFile(file)) files[name] = { ...parseCheckpoint(file, root), stem: entry.name }
      else
        violations.push({
          status: 'VIOLATION',
          message: `a work package holds all five files as regular files from creation; ${name} is missing or unsafe`,
          subject: relative(root, folder)
        })
    }
    works.push({
      stem: entry.name,
      package: true,
      work,
      ...(files[STATE_FILE] ? { state: files[STATE_FILE] } : {}),
      ...(files['queries.md'] ? { queries: files['queries.md'] } : {}),
      ...(files['messages.md'] ? { messages: files['messages.md'] } : {}),
      ...(physicalFile(join(folder, 'decisions.md'))
        ? { decisions: readFileSync(join(folder, 'decisions.md'), 'utf8') }
        : {})
    })
  }
  return { works, violations }
}

const singleLine = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0 && !/[\r\n]/.test(value)

/** Section content between one `## <heading>` and the next, or undefined when the heading is absent. */
const section = (body: string, heading: string, next: string | undefined): string | undefined => {
  const start = `## ${heading}`
  const sectionStart = body.indexOf(start)
  if (sectionStart < 0) return undefined
  const sectionEnd = next ? body.indexOf(`## ${next}`, sectionStart + start.length) : body.length
  return sectionEnd < 0 ? undefined : body.slice(sectionStart + start.length, sectionEnd)
}

/** The H1 and H2 headings of a body, in order. */
const outline = (body: string): { level: number; title: string }[] =>
  [...body.matchAll(/^(#{1,2})\s+(.+?)\s*$/gm)].map((match) => ({
    level: match[1]?.length ?? 0,
    title: match[2] ?? ''
  }))

const sameOutline = (body: string, h1: string, h2: readonly string[]): boolean =>
  JSON.stringify(outline(body)) ===
  JSON.stringify([{ level: 1, title: h1 }, ...h2.map((title) => ({ level: 2, title }))])

/** The content under each H2 heading, keyed by its title. */
const h2Sections = (body: string): Map<string, string> => {
  const sections = new Map<string, string>()
  const matches = [...body.matchAll(/^## (.+?)\s*$/gm)]
  for (const [index, match] of matches.entries()) {
    const start = (match.index ?? 0) + match[0].length
    const end = matches[index + 1]?.index ?? body.length
    sections.set(match[1] ?? '', body.slice(start, end))
  }
  return sections
}

const words = (text: string): number => text.split(/\s+/).filter(Boolean).length

/** Package parents name coordinating work, while State-of-play covers registers survive absent packages. */
const placementFailures = (
  id: string,
  fields: Readonly<Record<string, unknown>>,
  packageShape: boolean
): readonly string[] => {
  const segments = id.split('.')
  const territory = segments[0] ?? ''
  const secondary = segments[1] === SECONDARY_SEGMENT
  // Single-file records retain their pre-cascade field rules until migrated.
  if (!packageShape) {
    if (fields.level !== 'territory' && secondary)
      return [`a <territory>.${SECONDARY_SEGMENT}.<name> id is territory work`]
    if (fields.level !== 'territory')
      return 'parent' in fields || 'covers' in fields
        ? ['parent and covers belong to a secondary State of play in the single-file shape']
        : []
    if (segments.length === 1 || id.endsWith('.sop.main'))
      return 'parent' in fields || 'covers' in fields ? ['the single-file main carries no parent or covers'] : []
  }
  const failures: string[] = []
  const main = fields.level === 'territory' && (segments.length === 1 || id.endsWith('.sop.main'))
  if (fields.level === 'territory' && !main && (segments.length !== 3 || !secondary))
    failures.push(`territory work id must be <territory> or <territory>.${SECONDARY_SEGMENT}.<name>`)
  if (fields.level !== 'territory' && secondary)
    failures.push(`a <territory>.${SECONDARY_SEGMENT}.<name> id is territory work`)
  const parent = fields.parent
  const parentPattern = new RegExp(`^${KEBAB}(?:\\.${SECONDARY_SEGMENT}\\.${KEBAB})?$`)
  if (
    main
      ? 'parent' in fields
      : typeof parent !== 'string' || !parentPattern.test(parent) || parent.split('.')[0] !== territory || parent === id
  )
    failures.push(
      main ? 'the main State of play carries no parent' : 'parent must name a different same-territory State of play'
    )
  if (secondary && !main && parent !== territory && parent !== `${territory}.sop.main`)
    failures.push(`parent must name the main State of play, ${territory}`)
  if (fields.level !== 'territory') {
    if ('covers' in fields) failures.push('covers belongs only to States of play')
    return failures
  }
  const covers = fields.covers
  if (!Array.isArray(covers) || (!main && !covers.length))
    failures.push(
      main
        ? 'covers must be the main State of play register, an array'
        : 'covers must list the work ids the secondary State of play coordinates'
    )
  else {
    if (new Set(covers).size !== covers.length) failures.push('covers must not repeat a work id')
    for (const covered of covers)
      if (
        typeof covered !== 'string' ||
        !WORK_ID.test(covered) ||
        !covered.startsWith(`${territory}.`) ||
        covered.split('.')[1] === SECONDARY_SEGMENT ||
        covered.split('.').length < 2
      )
        failures.push(
          `covers names ${String(covered)}, which is not Project, regular or ad hoc work of territory ${territory}`
        )
  }
  return failures
}

/** The definition fields both shapes share: level, title, label, project, theme, holders and the coordination gate. */
const definitionChecks = (
  record: ParsedRecord,
  fields: Readonly<Record<string, unknown>>,
  coordinationDeclared: boolean,
  evidence: Evidence,
  packageShape = false
): void => {
  const fail = (list: AuditOutcome[], message: string): void => {
    list.push({ status: 'VIOLATION', message, subject: record.path })
  }
  if (!WORK_ID.test(record.stem) || UUID.test(record.stem) || OPAQUE_SESSION_NAME.test(record.stem))
    fail(evidence.identity, 'a work folder is named by a dotted id of lower-case kebab segments')
  if (fields.id !== record.stem) fail(evidence.identity, 'id must exactly match the work folder name')
  if (!WORK_LEVELS.includes(fields.level)) fail(evidence.schema, 'level must be territory, regular or project')
  if (!singleLine(fields.title)) fail(evidence.schema, 'title must be a non-empty single-line string')
  if ('label' in fields && !singleLine(fields.label))
    fail(evidence.schema, 'label must be a non-empty single-line string')
  if (fields.level === 'project' ? !SLUG.test(String(fields.project ?? '')) : 'project' in fields)
    fail(evidence.schema, 'project names the Project slug at project level and is absent otherwise')
  if (fields.theme !== undefined && fields.theme !== null && !SLUG.test(String(fields.theme)))
    fail(evidence.schema, 'theme must be a theme slug or null')
  for (const message of placementFailures(String(fields.id ?? ''), fields, packageShape)) fail(evidence.schema, message)
  for (const field of ['worker', 'supervisor'] as const)
    if (!HOLDER.test(String(fields[field] ?? '')))
      fail(evidence.schema, `${field} must be a holder: owner, agent, run/, work/, person/ or repo/`)
  if ('created_at' in fields && fields.created_at !== null && !validTimestamp(fields.created_at))
    fail(evidence.schema, 'created_at must be a UTC RFC 3339 timestamp or null')
  if (COORDINATING_LEVELS.includes(fields.level) && !coordinationDeclared)
    fail(evidence.role, `${String(fields.level)} work is valid only where .ki.toml declares [skills.ki-coordination]`)
}

/** The state fields both shapes share: state, target, hold, blocking and the move times. */
const stateChecks = (record: ParsedRecord, fields: Readonly<Record<string, unknown>>, evidence: Evidence): void => {
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: record.path })
  }
  if (!WORK_STATES.includes(fields.state)) fail(`state must be one of ${WORK_STATES.join(', ')}`)
  if (fields.state === 'handoff' ? !HOLDER.test(String(fields.target ?? '')) : 'target' in fields)
    fail('target names a holder in handoff and is absent otherwise')
  const hold = table(fields.hold)
  if (
    fields.state === 'on-hold'
      ? !hold ||
        Object.keys(hold).some((key) => key !== 'reason' && key !== 'release') ||
        !HOLD_REASONS.includes(hold.reason) ||
        !singleLine(hold.release)
      : 'hold' in fields
  )
    fail('hold carries reason, paused or more-expected, and release when on hold, else absent')
  if (
    'blocking' in fields &&
    (typeof fields.blocking !== 'boolean' || (fields.blocking && fields.state !== 'handoff-to-supervisor'))
  )
    fail('blocking is a boolean, true only in handoff-to-supervisor')
  if (!validTimestamp(fields.since)) fail('since must be a UTC RFC 3339 timestamp')
  for (const field of ['received', 'beat', 'mark'] as const)
    if (field in fields && fields[field] !== null && !validTimestamp(fields[field]))
      fail(`${field} must be a UTC RFC 3339 timestamp or null`)
}

const chronology = (record: ParsedRecord, created: unknown, since: unknown, evidence: Evidence): void => {
  if (validTimestamp(created) && validTimestamp(since) && Date.parse(created) > Date.parse(since))
    evidence.lifecycle.push({
      status: 'VIOLATION',
      message: 'created_at must not be later than since',
      subject: record.path
    })
}

/** A single-file work folder: `work.md` carries the definition and the state under its old form. */
const singleFileEvidence = (work: ParsedRecord, coordinationDeclared: boolean, evidence: Evidence): void => {
  const fields = work.fields
  if (!fields) {
    evidence.schema.push({
      status: 'VIOLATION',
      message: 'work file front matter must be a valid YAML mapping',
      subject: work.path
    })
    return
  }
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: work.path })
  }
  evidence.legacy.push({
    status: 'VIOLATION',
    message: `legacy: a single-file work folder, read for the tolerance window; it moves to the five-file package, adding ${STATE_FILE}, queries.md and messages.md, at the territory's migration`,
    subject: work.path
  })
  if (!sameOutline(work.body, work.stem, WORK_HEADINGS))
    fail('work file headings must be the id H1 and Next steps, Messages and Parked')
  for (const [index, heading] of WORK_HEADINGS.entries())
    if ((section(work.body, heading, WORK_HEADINGS[index + 1])?.trim().length ?? 0) === 0)
      fail(`${heading} must say something, if only None`)
  const keys = Object.keys(fields)
  if (WORK_REQUIRED.some((field) => !keys.includes(field)) || keys.some((field) => !WORK_FIELDS.has(field)))
    fail('work file front matter must use only its closed field set')
  definitionChecks(work, fields, coordinationDeclared, evidence)
  stateChecks(work, fields, evidence)
  chronology(work, fields.created_at, fields.since, evidence)
  evidence.boundary.push(...boundaryOutcomes(work, fields))
}

/** The message queue: its H1, then lines in the Messages line shape, important lines first, or None. */
const messageEvidence = (messages: ParsedRecord, onHold: boolean, now: number, evidence: Evidence): void => {
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: messages.path })
  }
  const warn = (message: string): void => {
    evidence.size.push({ status: 'VIOLATION', message, subject: messages.path })
  }
  if (JSON.stringify(outline(messages.body)) !== JSON.stringify([{ level: 1, title: `${messages.stem} messages` }])) {
    fail(`messages.md holds the H1 "# ${messages.stem} messages" and no other heading`)
    return
  }
  const content = messages.body.replace(/^#\s+.+$/m, '').trim()
  if (content === 'None' || content === 'None.') return
  if (content.length === 0) {
    fail('messages.md must say something, if only None')
    return
  }
  const lines: string[] = []
  for (const line of content.split(/\r?\n/)) {
    if (line.trim().length === 0) continue
    if (line.startsWith('- ')) lines.push(line)
    else if (/^\s/.test(line) && lines.length > 0) lines[lines.length - 1] += ` ${line.trim()}`
    else {
      fail('messages.md holds only message lines, one list item each, or None')
      return
    }
  }
  let ordinarySeen = false
  for (const line of lines) {
    const match = MESSAGE_LINE.exec(line)
    if (!match) {
      fail('each message line reads "- <date> · <TAG> · <sender label> (<sender id>): ...", or begins "- IMPORTANT · "')
      continue
    }
    if (match[1]) {
      if (ordinarySeen) fail('important message lines stand above every ordinary line')
    } else ordinarySeen = true
    if (words(line) > LIMITS.messageWords)
      warn(`a message line runs past about ${LIMITS.messageWords} words; link the detail`)
    const sent = Date.parse(`${match[2]}T00:00:00Z`)
    if (!onHold && !Number.isNaN(sent) && now - sent > LIMITS.messageDays * 86_400_000)
      warn(
        `a message line dated ${match[2]} has waited more than ${LIMITS.messageDays} days on work that is not on hold`
      )
  }
}

/** The queries file: its H1, Open and Parked, each query a tagged block with Context, Query and Options. */
const queryEvidence = (queries: ParsedRecord, evidence: Evidence): void => {
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: queries.path })
  }
  if (!sameOutline(queries.body, `${queries.stem} queries`, QUERY_HEADINGS))
    fail(`queries.md headings must be the H1 "# ${queries.stem} queries", then Open and Parked`)
  const sections = h2Sections(queries.body)
  for (const heading of QUERY_HEADINGS)
    if ((sections.get(heading)?.trim().length ?? 0) === 0) fail(`${heading} must say something, if only None`)
  const blocks = [...queries.body.matchAll(/^### (.+?)\s*$/gm)]
  for (const block of blocks) {
    const title = block[1] ?? ''
    if (!QUERY_HEADING.test(title)) fail(`query heading "${title}" must read "<TAG> - <title>"`)
    const start = (block.index ?? 0) + block[0].length
    const following = queries.body.slice(start).search(/^#{2,3} /m)
    const text = queries.body.slice(start, following < 0 ? undefined : start + following)
    if (QUERY_PARTS.some((part) => !text.includes(part)))
      fail(`query "${title}" must carry **Context:**, **Query:** and **Options:**`)
  }
}

/** Bulk history in a state body: dated log lines, runs of commit identifiers or test counts. */
const historyOutcome = (state: ParsedRecord): AuditOutcome | undefined => {
  const dated = state.body.match(DATED_LINE)?.length ?? 0
  const commits = state.body.match(COMMIT_ID)?.length ?? 0
  const counts = state.body.match(TEST_COUNT)?.length ?? 0
  if (dated < 3 && commits < 3 && counts < 2) return undefined
  return {
    status: 'VIOLATION',
    message:
      'state.md appears to carry history (dated log lines, commit identifiers or test counts); Git and the run reports hold it, so link one rather than copy it',
    subject: state.path
  }
}

/** A work package: the definition in `work.md` and the state, queries, messages and decisions beside it. */
const packageEvidence = (folder: WorkFolder, coordinationDeclared: boolean, now: number, evidence: Evidence): void => {
  const { work } = folder
  const fields = work.fields
  if (!fields) {
    evidence.schema.push({
      status: 'VIOLATION',
      message: 'work file front matter must be a valid YAML mapping',
      subject: work.path
    })
    return
  }
  const fail = (record: ParsedRecord, message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: record.path })
  }
  const warn = (record: ParsedRecord, message: string): void => {
    evidence.size.push({ status: 'VIOLATION', message, subject: record.path })
  }
  const keys = Object.keys(fields)
  const strayState = keys.filter((field) => STATE_FIELDS.has(field) && field !== 'id')
  if (strayState.length > 0)
    fail(
      work,
      `a package's work.md carries no state field (${strayState.join(', ')}); its state lives in ${STATE_FILE}`
    )
  else if (
    DEFINITION_REQUIRED.some((field) => !keys.includes(field)) ||
    keys.some((field) => !DEFINITION_FIELDS.has(field))
  )
    fail(work, 'work.md front matter must use only its closed definition field set')
  if (!sameOutline(work.body, work.stem, DEFINITION_HEADINGS))
    fail(work, `a package's work.md headings must be the id H1, Goals and Scope; its state lives in ${STATE_FILE}`)
  const definition = h2Sections(work.body)
  for (const heading of DEFINITION_HEADINGS)
    if ((definition.get(heading)?.trim().length ?? 0) === 0) fail(work, `${heading} must say something`)
  if (typeof fields.description !== 'string' || fields.description.trim().length === 0)
    fail(work, 'description must be a non-empty routing description')
  else if (fields.description.trim().length > LIMITS.description)
    warn(work, `description runs past ${LIMITS.description} characters`)
  if (words(work.body) > LIMITS.definitionWords) warn(work, `work.md body runs past ${LIMITS.definitionWords} words`)
  definitionChecks(work, fields, coordinationDeclared, evidence, true)
  evidence.boundary.push(...boundaryOutcomes(work, fields))

  const state = folder.state
  if (state) {
    const stateFields = state.fields
    if (!stateFields) fail(state, 'state.md front matter must be a valid YAML mapping')
    else {
      if (stateFields.id !== folder.stem)
        evidence.identity.push({
          status: 'VIOLATION',
          message: 'id must exactly match the work folder name',
          subject: state.path
        })
      const stateKeys = Object.keys(stateFields)
      if (
        STATE_REQUIRED.some((field) => !stateKeys.includes(field)) ||
        stateKeys.some((field) => !STATE_FIELDS.has(field))
      )
        fail(state, 'state.md front matter must use only its closed state field set')
      stateChecks(state, stateFields, evidence)
      if (
        'method_read' in stateFields &&
        stateFields.method_read !== null &&
        (typeof stateFields.method_read !== 'string' || !REVISION.test(stateFields.method_read))
      )
        fail(state, 'method_read must be a short harness revision or null')
      chronology(state, fields.created_at, stateFields.since, evidence)
      evidence.boundary.push(...boundaryOutcomes(state, stateFields))
    }
    const headings = outline(state.body)
    const queue =
      fields.level === 'territory' && headings.some((heading) => heading.level === 2 && heading.title === 'Queue')
    const expected = queue ? ['Now', 'Queue', 'Next steps', 'Held'] : ['Now', 'Next steps', 'Held']
    if (!sameOutline(state.body, `${folder.stem} state`, expected))
      fail(
        state,
        `state.md headings must be the H1 "# ${folder.stem} state", then Now, Next steps and Held, territory work adding Queue after Now`
      )
    const sections = h2Sections(state.body)
    for (const heading of expected)
      if ((sections.get(heading)?.trim().length ?? 0) === 0) fail(state, `${heading} must say something, if only None`)
    const now = (sections.get('Now') ?? '').split(/\r?\n/).filter((line) => line.trim().length > 0).length
    if (now > LIMITS.nowLines) warn(state, `Now runs past ${LIMITS.nowLines} lines`)
    if (words(state.body) > LIMITS.stateWords) warn(state, `state.md body runs past ${LIMITS.stateWords} words`)
    const history = historyOutcome(state)
    if (history) evidence.size.push(history)
  }
  if (folder.queries) queryEvidence(folder.queries, evidence)
  if (folder.messages) messageEvidence(folder.messages, state?.fields?.state === 'on-hold', now, evidence)
  if (folder.decisions !== undefined && folder.decisions.split(/\r?\n/).length > LIMITS.decisionLines)
    evidence.size.push({
      status: 'VIOLATION',
      message: `decisions.md runs past ${LIMITS.decisionLines} lines; strike decisions a durable home now carries`,
      subject: join(dirname(work.path), 'decisions.md')
    })
}

/** Validates each work folder under `+/_WORK/`, in the package shape or, for the tolerance window, the single-file shape. */
const relationshipEvidence = (works: readonly WorkFolder[], evidence: Evidence): void => {
  const packages = works.filter((folder) => folder.package && folder.work.fields)
  const names = (folder: WorkFolder): readonly string[] => {
    const [territory, kind, name] = folder.stem.split('.')
    const level = folder.work.fields?.level
    if (level === 'territory' && (!kind || (kind === 'sop' && name === 'main')))
      return [`${territory}.sop.main`, territory as string]
    if (level === 'project' && (!name || kind === 'prj'))
      return [`${territory}.prj.${name ?? kind}`, `${territory}.${name ?? kind}`]
    if (level === 'regular' && (kind === 'reg' || kind === 'regular')) {
      if (!name || name === 'main')
        return [`${territory}.reg.main`, `${territory}.regular.main`, `${territory}.regular`]
      return [`${territory}.reg.${name}`, `${territory}.regular.${name}`]
    }
    return [folder.stem]
  }
  const byId = new Map<string, WorkFolder>()
  const fail = (folder: WorkFolder, message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: folder.work.path })
  }
  for (const folder of packages)
    for (const name of names(folder)) {
      const existing = byId.get(name)
      if (existing && existing !== folder)
        fail(folder, `ambiguous work home ${name}: ${existing.stem} and ${folder.stem}`)
      else byId.set(name, folder)
    }
  const includes = (values: unknown, id: string): boolean =>
    Array.isArray(values) &&
    values.some(
      (value) =>
        value === id || (typeof value === 'string' && byId.get(value) !== undefined && byId.get(value) === byId.get(id))
    )
  const secondaryOwners = new Map<string, string>()
  for (const folder of packages) {
    const fields = folder.work.fields
    if (!fields) continue
    const territory = folder.stem.split('.')[0] ?? ''
    const main = byId.get(`${territory}.sop.main`) ?? byId.get(territory)
    const parent = typeof fields.parent === 'string' ? byId.get(fields.parent) : undefined
    const covers = Array.isArray(fields.covers) ? fields.covers : []
    if (main && typeof fields.parent === 'string' && !parent)
      fail(folder, 'parent does not resolve to a State of play in the Capital')
    if (fields.level === 'territory' && folder !== main)
      for (const covered of covers) {
        if (typeof covered !== 'string') continue
        const previous = secondaryOwners.get(byId.get(covered)?.stem ?? covered)
        if (previous && previous !== folder.stem) fail(folder, `covers duplicates ${covered} in ${previous}`)
        secondaryOwners.set(byId.get(covered)?.stem ?? covered, folder.stem)
        if (main && Array.isArray(main.work.fields?.covers) && !includes(main.work.fields.covers, covered))
          fail(folder, `covers names ${covered}, absent from the main register`)
        const child = byId.get(covered)
        if (child && byId.get(String(child.work.fields?.parent)) !== folder)
          fail(child, `parent disagrees with ${folder.stem} coverage`)
      }
    if (fields.level !== 'territory') {
      if (main && Array.isArray(main.work.fields?.covers) && !includes(main.work.fields.covers, folder.stem))
        fail(folder, 'work is absent from the main covers register')
      if (parent && Array.isArray(parent.work.fields?.covers) && !includes(parent.work.fields.covers, folder.stem))
        fail(folder, 'parent covers does not include this work')
    }
  }
}

const workEvidence = (works: readonly WorkFolder[], coordinationDeclared: boolean, now: number): Evidence => {
  const evidence: Evidence = { identity: [], schema: [], role: [], lifecycle: [], size: [], legacy: [], boundary: [] }
  for (const folder of works)
    if (folder.package) packageEvidence(folder, coordinationDeclared, now, evidence)
    else singleFileEvidence(folder.work, coordinationDeclared, evidence)
  relationshipEvidence(works, evidence)
  return evidence
}

/** Whether an old checkpoint's stem maps to a work id that already has a work file, under ki-coordination's Work naming. */
const supersededBy = (stem: string, works: readonly WorkFolder[]): string | undefined => {
  const ids = works.map((work) => work.stem)
  if (stem === '_state-of-play') return ids.find((id) => !id.includes('.'))
  const project = stem.includes('.') ? stem.split('.').at(-1) : undefined
  return ids.find((id) => {
    const segments = id.split('.')
    return project
      ? segments.length === 2 && segments[1] === project
      : segments.length === 3 && segments[1] === 'regular' && segments[2] === stem
  })
}

/** The thread-model subareas the work folder retired, which never sit beside `+/_WORK/`. */
const RETIRED_AREAS = ['_THREADS', '_CHECKPOINTS'] as const

export const checkpointReadme = {
  path: '+/_CHECKPOINTS/README.md',
  content:
    "# Checkpoints\n\nThis directory retains active, human-named reconstruction snapshots while `ki-work-package` is declared. A Project's coordination thread is named `<initiative>.<project>.md` and the state-of-play thread `_state-of-play.md`; each record's `label` is the human's client-side thread name, for presentation only. Checkpoint records are temporary inputs to further repository work. Removing a checkpoint deletes its record after durable information is routed; this README remains as the capability boundary. Git supplies recovery history.\n"
} as const

export const createWorkPackageSession = ({
  mode,
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<WorkPackageRubricContext> => {
  const root = resolve(repository)
  const workDirectory = join(root, '+', '_WORK')
  const checkpointDirectory = join(root, '+', '_CHECKPOINTS')
  const readmePath = join(root, checkpointReadme.path)
  // The host resolves declaration presence before passing this selected capability table.
  const configured = configuration
  const workExists = existsSync(workDirectory)
  const workSafe = physicalDirectory(workDirectory)
  const checkpointExists = existsSync(checkpointDirectory)
  const checkpointSafe = physicalDirectory(checkpointDirectory)
  const undeclaredAbsent =
    !configured && !workExists && !checkpointExists
      ? 'The undeclared +/_WORK/ and +/_CHECKPOINTS/ subareas are absent.'
      : undefined
  const structureViolations: AuditOutcome[] = []
  const legacy: AuditOutcome[] = []
  const works: WorkFolder[] = []
  const records: ParsedRecord[] = []

  if (workExists && !workSafe)
    structureViolations.push({
      status: 'VIOLATION',
      message: '+/_WORK/ must be a physical directory',
      subject: relative(root, workDirectory)
    })
  if (workSafe) {
    const found = inspectWork(workDirectory, root)
    works.push(...found.works)
    structureViolations.push(...found.violations)
  }
  // Kris named a run report written into a retired folder THREADS-REGRESSION on 2026-10-18: once the
  // repository holds +/_WORK/, neither retired subarea exists beside it, tracked or not.
  if (workExists)
    for (const area of RETIRED_AREAS)
      if (existsSync(join(root, '+', area)))
        structureViolations.push({
          status: 'VIOLATION',
          message: `+/${area}/ is retired beside +/_WORK/; move each file into its work folder +/_WORK/<id>/ and remove the folder`,
          subject: `+/${area}`
        })
  if (checkpointExists && !checkpointSafe)
    structureViolations.push({
      status: 'VIOLATION',
      message: '+/_CHECKPOINTS/ must be a physical directory',
      subject: relative(root, checkpointDirectory)
    })
  if (checkpointSafe) {
    if (!physicalFile(readmePath))
      structureViolations.push({
        status: 'VIOLATION',
        message: '+/_CHECKPOINTS/README.md is absent or unsafe while the legacy directory exists',
        subject: checkpointReadme.path
      })
    else if (readFileSync(readmePath, 'utf8') !== checkpointReadme.content)
      structureViolations.push({
        status: 'VIOLATION',
        message: '+/_CHECKPOINTS/README.md differs from its canonical scaffold',
        subject: checkpointReadme.path
      })
    const active = inspectDirectory(checkpointDirectory, root)
    records.push(...active.records)
    structureViolations.push(...active.violations)
  }
  for (const record of records) {
    legacy.push({
      status: 'VIOLATION',
      message: `legacy: an old checkpoint, read for the tolerance window; its work moves to the work package +/_WORK/<id>/ at the territory's migration`,
      subject: record.path
    })
  }

  const configOutcomes: AuditOutcome[] = configured
    ? Object.keys(configured).map((key) => ({
        status: 'VIOLATION' as const,
        level: 'WARN' as const,
        message: `unrecognised ki-work-package configuration key ${key}`,
        subject: '.ki.toml'
      }))
    : []
  const coordinationDeclared = declaresCoordination(root)
  const unsafe =
    (workExists && !workSafe) || (checkpointExists && !checkpointSafe)
      ? 'Records are unavailable until every subarea is safe.'
      : undefined
  const old = recordEvidence(records, coordinationDeclared, undeclaredAbsent ?? unsafe)
  const current = workEvidence(works, coordinationDeclared, Date.now())
  for (const record of records) {
    const id = supersededBy(record.stem, works)
    if (id)
      current.lifecycle.push({
        status: 'VIOLATION',
        message: `the old checkpoint and the work file of ${id} are both active; the move deletes the checkpoint`,
        subject: record.path
      })
  }
  const merged = (
    oldOutcomes: readonly AuditOutcome[],
    currentOutcomes: readonly AuditOutcome[],
    pass: string
  ): readonly AuditOutcome[] => {
    if (undeclaredAbsent ?? unsafe) return oldOutcomes
    const violations = [...oldOutcomes.filter((outcome) => outcome.status !== 'PASS'), ...currentOutcomes]
    return one(violations, pass)
  }
  const canConformScaffold =
    Boolean(configured) && checkpointSafe && (!existsSync(readmePath) || physicalFile(readmePath))
  let scaffoldRequested = false
  const context: WorkPackageRubricContext = {
    rubric: { publication },
    configuration: {
      outcomes: one(
        configOutcomes,
        configured
          ? 'The ki-work-package declaration is an empty capability marker.'
          : 'No ki-work-package declaration is active.'
      )
    },
    structure: {
      outcomes: one(
        structureViolations,
        'The work area holds only work folders with their package files, and any legacy scaffold is canonical.',
        undeclaredAbsent
      ),
      legacy: one(
        [...legacy, ...((undeclaredAbsent ?? unsafe) ? [] : current.legacy)],
        'No single-file work folder or old checkpoint remains to be moved.',
        undeclaredAbsent
      ),
      ...(mode === 'conform' && canConformScaffold ? { ensureScaffold: () => (scaffoldRequested = true) } : {})
    },
    records: {
      identity: merged(
        old.identity,
        current.identity,
        'Every work package, single-file work folder and old checkpoint has one consistent identity.'
      ),
      schema: merged(
        old.schema,
        current.schema,
        'Every work package, single-file work folder and old checkpoint uses its closed schema.'
      ),
      label: old.label,
      role: merged(old.role, current.role, 'Coordinating work lives only where ki-coordination is declared.')
    },
    lifecycle: {
      mechanical: merged(old.lifecycle, current.lifecycle, 'Record states, uniqueness, and timestamps are coherent.'),
      size: one(
        (undeclaredAbsent ?? unsafe) ? [] : current.size,
        'Every work package keeps within its soft size limits and carries no history.',
        undeclaredAbsent
      )
    },
    folder: folderOutcomes(root),
    boundary: {
      outcomes: merged(
        old.boundary,
        current.boundary,
        'No mechanically recognisable transcript or session-continuity dependency is present.'
      )
    }
  }

  return {
    subjects: [
      {
        subject: relative(root, workDirectory),
        families: ['RUBRIC', 'CONFIG', 'STRUCTURE', 'RECORD', 'LIFECYCLE', 'FOLDER', 'BOUNDARY'],
        context: () => context
      }
    ],
    proposal: () => {
      const writes: ConformWrite[] = []
      if (
        scaffoldRequested &&
        (!physicalFile(readmePath) || readFileSync(readmePath, 'utf8') !== checkpointReadme.content)
      )
        writes.push({
          path: checkpointReadme.path,
          content: checkpointReadme.content,
          ...(!existsSync(readmePath) ? { create: true } : {})
        })
      return { writes }
    }
  }
}
