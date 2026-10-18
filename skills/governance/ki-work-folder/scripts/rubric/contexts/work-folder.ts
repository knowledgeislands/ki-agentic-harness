import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'
import type {
  AuditOutcome,
  ConformWrite,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

const ACTIVE_FIELDS = ['type', 'thread', 'state', 'created_at', 'updated_at'] as const
const WORK_FILE = 'work.md'
const WORK_REQUIRED = ['id', 'level', 'title', 'worker', 'supervisor', 'state', 'since'] as const
const WORK_FIELDS: ReadonlySet<string> = new Set([
  ...WORK_REQUIRED,
  'label',
  'project',
  'theme',
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
const OPTIONAL_TIMES = ['received', 'beat', 'mark', 'created_at'] as const
const KEBAB = '[a-z0-9]+(?:-[a-z0-9]+)*'
const WORK_ID = new RegExp(`^${KEBAB}(?:\\.${KEBAB})*$`)
const SLUG = new RegExp(`^${KEBAB}$`)
const HOLDER = new RegExp(`^(?:owner|agent|(?:run|person|repo)/[A-Za-z0-9_.-]+|work/${KEBAB}(?:\\.${KEBAB})*)$`)
const WORK_HEADINGS = ['Next steps', 'Messages', 'Parked'] as const
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
export type LifecycleContext = { readonly mechanical: readonly AuditOutcome[] }

export type WorkFolderRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly configuration: OutcomeContext
  readonly structure: ScaffoldContext
  readonly records: RecordContext
  readonly lifecycle: LifecycleContext
  readonly boundary: OutcomeContext
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
  boundary: AuditOutcome[]
}

/** The work folders under `+/_WORK/`, each a physical directory holding its work file. */
const inspectWork = (directory: string, root: string): { works: ParsedRecord[]; violations: AuditOutcome[] } => {
  const works: ParsedRecord[] = []
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
    works.push({ ...parseCheckpoint(path, root), stem: entry.name })
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

/** Validates each work file `+/_WORK/<id>/work.md` against the closed work-file form. */
const workEvidence = (works: readonly ParsedRecord[], coordinationDeclared: boolean): Evidence => {
  const evidence: Evidence = { identity: [], schema: [], role: [], lifecycle: [], boundary: [] }
  const fail = (list: AuditOutcome[], record: ParsedRecord, message: string): void => {
    list.push({ status: 'VIOLATION', message, subject: record.path })
  }
  for (const work of works) {
    const fields = work.fields
    if (!fields) {
      fail(evidence.schema, work, 'work file front matter must be a valid YAML mapping')
      continue
    }
    if (!WORK_ID.test(work.stem) || UUID.test(work.stem) || OPAQUE_SESSION_NAME.test(work.stem))
      fail(evidence.identity, work, 'a work folder is named by a dotted id of lower-case kebab segments')
    if (fields.id !== work.stem) fail(evidence.identity, work, 'id must exactly match the work folder name')

    const headings = [...work.body.matchAll(/^(#{1,2})\s+(.+?)\s*$/gm)].map((match) => ({
      level: match[1]?.length ?? 0,
      title: match[2] ?? ''
    }))
    const expected = [{ level: 1, title: work.stem }, ...WORK_HEADINGS.map((title) => ({ level: 2, title }))]
    if (JSON.stringify(headings) !== JSON.stringify(expected))
      fail(evidence.schema, work, 'work file headings must be the id H1 and Next steps, Messages and Parked')
    for (const [index, heading] of WORK_HEADINGS.entries())
      if ((section(work.body, heading, WORK_HEADINGS[index + 1])?.trim().length ?? 0) === 0)
        fail(evidence.schema, work, `${heading} must say something, if only None`)

    const keys = Object.keys(fields)
    if (WORK_REQUIRED.some((field) => !keys.includes(field)) || keys.some((field) => !WORK_FIELDS.has(field)))
      fail(evidence.schema, work, 'work file front matter must use only its closed field set')
    if (!WORK_LEVELS.includes(fields.level)) fail(evidence.schema, work, 'level must be territory, regular or project')
    if (!singleLine(fields.title)) fail(evidence.schema, work, 'title must be a non-empty single-line string')
    if ('label' in fields && !singleLine(fields.label))
      fail(evidence.schema, work, 'label must be a non-empty single-line string')
    if (fields.level === 'project' ? !SLUG.test(String(fields.project ?? '')) : 'project' in fields)
      fail(evidence.schema, work, 'project names the Project slug at project level and is absent otherwise')
    if (fields.theme !== undefined && fields.theme !== null && !SLUG.test(String(fields.theme)))
      fail(evidence.schema, work, 'theme must be a theme slug or null')
    for (const field of ['worker', 'supervisor'] as const)
      if (!HOLDER.test(String(fields[field] ?? '')))
        fail(evidence.schema, work, `${field} must be a holder: owner, agent, run/, work/, person/ or repo/`)
    if (!WORK_STATES.includes(fields.state))
      fail(evidence.schema, work, `state must be one of ${WORK_STATES.join(', ')}`)
    if (fields.state === 'handoff' ? !HOLDER.test(String(fields.target ?? '')) : 'target' in fields)
      fail(evidence.schema, work, 'target names a holder in handoff and is absent otherwise')
    const hold = table(fields.hold)
    if (
      fields.state === 'on-hold'
        ? !hold ||
          Object.keys(hold).some((key) => key !== 'reason' && key !== 'release') ||
          !HOLD_REASONS.includes(hold.reason) ||
          !singleLine(hold.release)
        : 'hold' in fields
    )
      fail(evidence.schema, work, 'hold carries reason, paused or more-expected, and release when on hold, else absent')
    if (
      'blocking' in fields &&
      (typeof fields.blocking !== 'boolean' || (fields.blocking && fields.state !== 'handoff-to-supervisor'))
    )
      fail(evidence.schema, work, 'blocking is a boolean, true only in handoff-to-supervisor')

    if (!validTimestamp(fields.since)) fail(evidence.schema, work, 'since must be a UTC RFC 3339 timestamp')
    for (const field of OPTIONAL_TIMES)
      if (field in fields && fields[field] !== null && !validTimestamp(fields[field]))
        fail(evidence.schema, work, `${field} must be a UTC RFC 3339 timestamp or null`)
    if (
      validTimestamp(fields.created_at) &&
      validTimestamp(fields.since) &&
      Date.parse(fields.created_at) > Date.parse(fields.since)
    )
      fail(evidence.lifecycle, work, 'created_at must not be later than since')

    if (COORDINATING_LEVELS.includes(fields.level) && !coordinationDeclared)
      fail(
        evidence.role,
        work,
        `${String(fields.level)} work is valid only where .ki.toml declares [skills.ki-coordination]`
      )
    evidence.boundary.push(...boundaryOutcomes(work, fields))
  }
  return evidence
}

/** Whether an old checkpoint's stem maps to a work id that already has a work file, under ki-coordination's Work naming. */
const supersededBy = (stem: string, works: readonly ParsedRecord[]): string | undefined => {
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
    "# Checkpoints\n\nThis directory retains active, human-named reconstruction snapshots while `ki-work-folder` is declared. A Project's coordination thread is named `<initiative>.<project>.md` and the state-of-play thread `_state-of-play.md`; each record's `label` is the human's client-side thread name, for presentation only. Checkpoint records are temporary inputs to further repository work. Removing a checkpoint deletes its record after durable information is routed; this README remains as the capability boundary. Git supplies recovery history.\n"
} as const

export const createWorkFolderSession = ({
  mode,
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<WorkFolderRubricContext> => {
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
  const works: ParsedRecord[] = []
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
        message: '+/_CHECKPOINTS/README.md differs from canonical ki-work-folder orientation',
        subject: checkpointReadme.path
      })
    const active = inspectDirectory(checkpointDirectory, root)
    records.push(...active.records)
    structureViolations.push(...active.violations)
  }
  for (const record of records) {
    legacy.push({
      status: 'VIOLATION',
      message: `legacy: an old checkpoint, read for the tolerance window; its work moves to +/_WORK/<id>/${WORK_FILE} at the territory's migration`,
      subject: record.path
    })
  }

  const configOutcomes: AuditOutcome[] = configured
    ? Object.keys(configured).map((key) => ({
        status: 'VIOLATION' as const,
        level: 'WARN' as const,
        message: `unrecognised ki-work-folder configuration key ${key}`,
        subject: '.ki.toml'
      }))
    : []
  const coordinationDeclared = declaresCoordination(root)
  const unsafe =
    (workExists && !workSafe) || (checkpointExists && !checkpointSafe)
      ? 'Records are unavailable until every subarea is safe.'
      : undefined
  const old = recordEvidence(records, coordinationDeclared, undeclaredAbsent ?? unsafe)
  const current = workEvidence(works, coordinationDeclared)
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
  const context: WorkFolderRubricContext = {
    rubric: { publication },
    configuration: {
      outcomes: one(
        configOutcomes,
        configured
          ? 'The ki-work-folder declaration is an empty capability marker.'
          : 'No ki-work-folder declaration is active.'
      )
    },
    structure: {
      outcomes: one(
        structureViolations,
        'The work area holds only work folders with their work files, and any legacy scaffold is canonical.',
        undeclaredAbsent
      ),
      legacy: one(legacy, 'No old checkpoint remains to be moved.', undeclaredAbsent),
      ...(mode === 'conform' && canConformScaffold ? { ensureScaffold: () => (scaffoldRequested = true) } : {})
    },
    records: {
      identity: merged(
        old.identity,
        current.identity,
        'Every work file and old checkpoint has one consistent identity.'
      ),
      schema: merged(old.schema, current.schema, 'Every work file and old checkpoint uses its closed schema.'),
      label: old.label,
      role: merged(old.role, current.role, 'Coordinating work lives only where ki-coordination is declared.')
    },
    lifecycle: {
      mechanical: merged(old.lifecycle, current.lifecycle, 'Record states, uniqueness, and timestamps are coherent.')
    },
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
        families: ['RUBRIC', 'CONFIG', 'STRUCTURE', 'RECORD', 'LIFECYCLE', 'BOUNDARY'],
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
