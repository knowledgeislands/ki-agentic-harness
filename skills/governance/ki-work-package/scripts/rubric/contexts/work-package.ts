/**
 * The `ki-work-package` audit context: every package under `work/<territory>/<work id>/`, sub-packages included, read
 * against the standard's entry file, state, closed list and boundary, and the earlier copies of packages left in the
 * retired working areas. The audit reads; it never authors, moves or deletes a package.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'
import {
  EARLIER_AREAS,
  ENTRY_FILE,
  type FolderOutcomes,
  folderOutcomes,
  type PackageFolder,
  WORK_DIRECTORY,
  workLayout
} from './work-folder.ts'

const WORK_LEVELS: readonly unknown[] = ['territory', 'regular', 'project']
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
/** Who set a hold, under HOLD-SELF (Kris, 7 November 2026): the owner, or the worker itself for the idle hold. */
const HOLD_SETTERS: readonly unknown[] = ['owner', 'worker']
const KEBAB = '[a-z0-9]+(?:-[a-z0-9]+)*'
/** The reserved second id segment of a secondary State of play, `<territory>.sop.<name>`. */
const SECONDARY_SEGMENT = 'sop'
const WORK_ID = new RegExp(`^${KEBAB}(?:\\.${KEBAB})*$`)
const SLUG = new RegExp(`^${KEBAB}$`)
const HOLDER = new RegExp(`^(?:owner|agent|(?:run|person|repo)/[A-Za-z0-9_.-]+|work/${KEBAB}(?:\\.${KEBAB})*)$`)
/** The definition fields of `_index.md`, each required one listed first. */
const DEFINITION_REQUIRED = ['id', 'level', 'description', 'worker', 'supervisor', 'repositories'] as const
const DEFINITION_FIELDS: readonly string[] = [
  ...DEFINITION_REQUIRED,
  'label',
  'project',
  'theme',
  'parent',
  'covers',
  'role',
  'created_at'
]
/** The thread capability fields Kris set under FOOTER-CAPABILITY-STATUS-2 on 1 November 2026. */
const CAPABILITIES = ['listening', 'syncing'] as const
const CAPABILITY_FIELDS = CAPABILITIES.flatMap((capability) => [`${capability}_enabled`, `${capability}_status`])
const CAPABILITY_STATUSES: readonly unknown[] = ['on', 'off']
/** The state fields that stand beside the definition in `_index.md`, under PACKAGE-STATE (9 November 2026). */
const STATE_REQUIRED = ['state', 'since'] as const
const STATE_FIELDS: readonly string[] = [
  ...STATE_REQUIRED,
  'target',
  'hold',
  'blocking',
  'received',
  'beat',
  'mark',
  'method_read',
  'workers',
  ...CAPABILITY_FIELDS
]
const ENTRY_FIELDS: ReadonlySet<string> = new Set([...DEFINITION_FIELDS, ...STATE_FIELDS])
const ENTRY_REQUIRED: readonly string[] = [...DEFINITION_REQUIRED, ...STATE_REQUIRED]
/** The body of `_index.md`: the id H1, then these sections, with an optional `## Values` after Scope. */
const BODY_BEFORE_VALUES = ['Goals', 'Scope'] as const
const VALUES_HEADING = 'Values'
const BODY_AFTER_VALUES = ['Now', 'Held', 'Changes'] as const
/**
 * The role standard, whose Role catalogue table is the one home of each role's tier and glyph (STAGE-C-ROLES, Kris, 7
 * November 2026). The checker reads it at audit time and holds no copy.
 */
const ROLE_STANDARD = fileURLToPath(new URL('../../../references/standard-roles.md', import.meta.url))
const ROLE_MIGRATION = 'standards-roles-migration.md'
const TIERS: readonly string[] = ['leaders', 'managers', 'makers']
/** The closed keys of a `workers` entry under the role standard, and the keys the role migration file tolerates. */
const WORKER_FIELDS: ReadonlySet<string> = new Set(['role', 'tier', 'since', 'status', 'listening'])
const WORKER_RETIRED_FIELDS: ReadonlySet<string> = new Set(['name', 'uri', 'designation', 'focus'])
const WORKER_STATUSES: readonly unknown[] = ['active', 'idle']
/** Old role and tier words read under the role migration file, each warned on. */
const ROLE_ALIASES: Readonly<Record<string, string>> = { assistant: 'gatekeeper', keeper: 'warden' }
const TIER_ALIASES: Readonly<Record<string, string>> = { enablers: 'managers', doers: 'makers' }
const REVISION = /^[0-9a-f]{7,40}$/
/** The two limits the standard keeps, warned and never failed. */
const LIMITS = { description: 500, nowLines: 5 } as const
const DATED_LINE = /^\s*(?:[-*]|\d+\.)?\s*(?:\*\*)?\d{4}-\d{2}-\d{2}/gm
const COMMIT_ID = /\b(?=[0-9a-f]*\d)(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/g
const TEST_COUNT = /\b\d+\s+(?:tests?|pass(?:ed|es)?|fail(?:ed|s|ures?)?)\b/gi
const UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const OPAQUE_SESSION_NAME = /^(?:sess(?:ion)?|conversation)[_-][a-z0-9]{12,}$/i
const FORBIDDEN_KEY = /^(?:claude_|codex_)?(?:session|conversation|transcript)(?:_id|_url|_ref)?$/i
const TRANSCRIPT_LINE = /^(?:user|assistant|human|agent):\s+\S/im
const SESSION_CONTINUITY =
  /\b(?:resume|reopen|reattach|reconnect|authenticate|connect)\b[^\n.]{0,60}\b(?:conversation|session)\b/i
const SESSION_LOCATOR =
  /\b(?:https?:\/\/\S*(?:conversation|session)\S*|(?:claude|codex)[_-]?(?:session|conversation)[_-]?[a-z0-9-]{8,})\b/i

type ParsedRecord = {
  readonly path: string
  readonly fields: Readonly<Record<string, unknown>> | null
  readonly body: string
}

/** A package read for the audit: its folder and its parsed entry file. */
type Package = { readonly folder: PackageFolder; readonly entry: ParsedRecord }

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }
export type StructureContext = OutcomeContext & { readonly earlier: readonly AuditOutcome[] }
export type RecordContext = { readonly identity: readonly AuditOutcome[]; readonly schema: readonly AuditOutcome[] }
export type LifecycleContext = { readonly mechanical: readonly AuditOutcome[]; readonly size: readonly AuditOutcome[] }

export type WorkPackageRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly configuration: OutcomeContext
  readonly structure: StructureContext
  readonly records: RecordContext
  readonly lifecycle: LifecycleContext
  readonly boundary: OutcomeContext
  readonly folder: FolderOutcomes
}

type Evidence = {
  identity: AuditOutcome[]
  schema: AuditOutcome[]
  lifecycle: AuditOutcome[]
  size: AuditOutcome[]
  boundary: AuditOutcome[]
}

const table = (value: unknown): Readonly<Record<string, unknown>> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Readonly<Record<string, unknown>>) : null

const one = (outcomes: readonly AuditOutcome[], pass: string, absent?: string): readonly AuditOutcome[] => {
  if (absent) return [{ status: 'NOT_APPLICABLE', message: absent }]
  return outcomes.length > 0 ? outcomes : [{ status: 'PASS', message: pass }]
}

const parseRecord = (path: string, root: string): ParsedRecord => {
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
  return { path: relative(root, path), fields, body }
}

const validTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && UTC_TIMESTAMP.test(value) && !Number.isNaN(Date.parse(value))

const singleLine = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0 && !/[\r\n]/.test(value)

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

const nonEmptyLines = (text: string): number => text.split(/\r?\n/).filter((line) => line.trim().length > 0).length

/** Session-continuity material an entry file must not carry. */
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

/** A top-level package's parent and covers: package parents name coordinating work, the main's register survives absent packages. */
const placementFailures = (id: string, fields: Readonly<Record<string, unknown>>): readonly string[] => {
  const segments = id.split('.')
  const territory = segments[0] ?? ''
  const secondary = segments[1] === SECONDARY_SEGMENT
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

/** A sub-package's placement: its parent package named as `parent`, its parent's level, and no covers. */
const subPackageFailures = (
  folder: PackageFolder,
  fields: Readonly<Record<string, unknown>>,
  parentFields: Readonly<Record<string, unknown>> | null | undefined
): readonly string[] => {
  const failures: string[] = []
  const parentId = folder.parent?.expectedId
  if (fields.parent !== parentId) failures.push(`parent must name the sub-package's parent package, ${parentId}`)
  if ('covers' in fields) failures.push('covers belongs only to States of play')
  if (parentFields && fields.level !== parentFields.level)
    failures.push(`a sub-package's level is its parent's, ${String(parentFields.level)}`)
  return failures
}

/** The definition fields: level, label, project, theme, placement, holders, created_at and repositories. */
const definitionChecks = (
  item: Package,
  fields: Readonly<Record<string, unknown>>,
  parentFields: Readonly<Record<string, unknown>> | null | undefined,
  evidence: Evidence
): void => {
  const { folder, entry } = item
  const fail = (list: AuditOutcome[], message: string): void => {
    list.push({ status: 'VIOLATION', message, subject: entry.path })
  }
  if (!WORK_ID.test(folder.expectedId) || UUID.test(folder.name) || OPAQUE_SESSION_NAME.test(folder.name))
    fail(evidence.identity, 'a package folder is named by a dotted id of lower-case kebab segments')
  if (fields.id !== folder.expectedId)
    fail(
      evidence.identity,
      folder.parent
        ? `id must be ${folder.expectedId}, the parent's id and the sub-package's folder name`
        : 'id must exactly match the package folder name'
    )
  if (!folder.parent && folder.expectedId.split('.')[0] !== folder.territory)
    fail(
      evidence.identity,
      `a package stands in the territory folder of its id's first segment, not ${folder.territory}`
    )
  if (!WORK_LEVELS.includes(fields.level)) fail(evidence.schema, 'level must be territory, regular or project')
  if ('label' in fields && !singleLine(fields.label))
    fail(evidence.schema, 'label must be a non-empty single-line string')
  if (fields.level === 'project' ? !SLUG.test(String(fields.project ?? '')) : 'project' in fields)
    fail(evidence.schema, 'project names the Project slug at project level and is absent otherwise')
  if (fields.theme !== undefined && fields.theme !== null && !SLUG.test(String(fields.theme)))
    fail(evidence.schema, 'theme must be a theme slug or null')
  const placement = folder.parent
    ? subPackageFailures(folder, fields, parentFields)
    : placementFailures(String(fields.id ?? ''), fields)
  for (const message of placement) fail(evidence.schema, message)
  for (const field of ['worker', 'supervisor'] as const)
    if (!HOLDER.test(String(fields[field] ?? '')))
      fail(evidence.schema, `${field} must be a holder: owner, agent, run/, work/, person/ or repo/`)
  if ('created_at' in fields && fields.created_at !== null && !validTimestamp(fields.created_at))
    fail(evidence.schema, 'created_at must be a UTC RFC 3339 timestamp or null')
  if (
    'repositories' in fields &&
    (!Array.isArray(fields.repositories) || fields.repositories.some((name) => !singleLine(name)))
  )
    fail(evidence.schema, 'repositories must be a list of repository names, empty where the package works in none')
}

/** The state fields: state, target, hold, blocking, the move times and method_read. */
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
        Object.keys(hold).some((key) => key !== 'reason' && key !== 'release' && key !== 'set_by') ||
        !HOLD_REASONS.includes(hold.reason) ||
        !singleLine(hold.release) ||
        ('set_by' in hold && !HOLD_SETTERS.includes(hold.set_by)) ||
        (hold.set_by === 'worker' && hold.reason !== 'more-expected')
      : 'hold' in fields
  )
    fail(
      'hold carries reason, paused or more-expected, release and an optional set_by, owner or worker, the worker setting only more-expected, when on hold, else absent'
    )
  if (
    'blocking' in fields &&
    (typeof fields.blocking !== 'boolean' || (fields.blocking && fields.state !== 'handoff-to-supervisor'))
  )
    fail('blocking is a boolean, true only in handoff-to-supervisor')
  if (!validTimestamp(fields.since)) fail('since must be a UTC RFC 3339 timestamp')
  for (const field of ['received', 'beat', 'mark'] as const)
    if (field in fields && fields[field] !== null && !validTimestamp(fields[field]))
      fail(`${field} must be a UTC RFC 3339 timestamp or null`)
  if (
    'method_read' in fields &&
    fields.method_read !== null &&
    (typeof fields.method_read !== 'string' || !REVISION.test(fields.method_read))
  )
    fail('method_read must be a short harness revision or null')
}

/**
 * The thread capability fields: each `_enabled` a boolean, absent reading false; each `_status` `on` or `off`, present
 * exactly when its capability is enabled; and a syncing thread is always a listening thread.
 */
const capabilityChecks = (
  record: ParsedRecord,
  fields: Readonly<Record<string, unknown>>,
  evidence: Evidence
): void => {
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: record.path })
  }
  for (const capability of CAPABILITIES) {
    const enabled = fields[`${capability}_enabled`]
    const status = `${capability}_status`
    if (`${capability}_enabled` in fields && typeof enabled !== 'boolean')
      fail(`${capability}_enabled must be true or false`)
    if (enabled === true ? !CAPABILITY_STATUSES.includes(fields[status]) : status in fields)
      fail(`${status} is on or off while ${capability}_enabled is true, and absent otherwise`)
  }
  if (fields.syncing_enabled === true && fields.listening_enabled !== true)
    fail('syncing_enabled true requires listening_enabled true: a syncing thread is always a listening thread')
}

export type CatalogueRole = { readonly tier: string; readonly glyph: string }

/** The Role catalogue table of the role standard: each role's tier and glyph, by role name. */
export const roleCatalogue = (standard = readFileSync(ROLE_STANDARD, 'utf8')): ReadonlyMap<string, CatalogueRole> => {
  const section = standard.split(/^#{2,3} (?:[\d.]+ )?Role catalogue$/m)[1]?.split(/^#{2,3} /m)[0] ?? ''
  const roles = new Map<string, CatalogueRole>()
  for (const line of section.split(/\r?\n/)) {
    const [role = '', tier = '', glyph = ''] = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
    if (/^[a-z]+$/.test(role) && TIERS.includes(tier) && glyph.length > 0) roles.set(role, { tier, glyph })
  }
  return roles
}

const warning = (record: ParsedRecord, message: string): AuditOutcome => ({
  status: 'VIOLATION',
  level: 'WARN',
  message: `tolerance: ${message}, under ${ROLE_MIGRATION}`,
  subject: record.path
})

/** A `role` value against the catalogue: a catalogue role passes, an old word warns, anything else fails. */
const roleOutcome = (
  record: ParsedRecord,
  value: unknown,
  where: string,
  catalogue: ReadonlyMap<string, CatalogueRole>
): AuditOutcome | undefined => {
  if (typeof value === 'string' && catalogue.has(value)) return undefined
  if (typeof value === 'string' && ROLE_ALIASES[value])
    return warning(record, `${where} role ${value} is read as ${ROLE_ALIASES[value]}`)
  return {
    status: 'VIOLATION',
    message: `${where} role must be one catalogue role: ${[...catalogue.keys()].join(', ')}`,
    subject: record.path
  }
}

/**
 * `workers` under the role standard: a list of live seats, each one catalogue role with its catalogue tier and at most
 * since, status and listening. The retired entry keys, focus among them, warn.
 */
const workersChecks = (
  record: ParsedRecord,
  fields: Readonly<Record<string, unknown>>,
  evidence: Evidence,
  catalogue: ReadonlyMap<string, CatalogueRole>
): void => {
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: record.path })
  }
  const warn = (message: string): void => {
    evidence.schema.push(warning(record, message))
  }
  if (!('workers' in fields) || fields.workers === null) return
  if (!Array.isArray(fields.workers)) {
    fail('workers must be a list of seats, each a mapping with role and tier')
    return
  }
  fields.workers.forEach((value, index) => {
    const entry = table(value)
    const at = `workers[${index}]`
    if (!entry) {
      fail(`${at} must be a mapping with role and tier`)
      return
    }
    const unknown = Object.keys(entry).filter((key) => !WORKER_FIELDS.has(key) && !WORKER_RETIRED_FIELDS.has(key))
    if (unknown.length > 0)
      fail(`${at} carries field(s) outside role, tier, since, status and listening: ${unknown.join(', ')}`)
    const retired = Object.keys(entry).filter((key) => WORKER_RETIRED_FIELDS.has(key))
    if (retired.length > 0) warn(`${at} carries ${retired.join(', ')}, which the role standard drops`)
    const roleResult = roleOutcome(record, entry.role, at, catalogue)
    if (roleResult) evidence.schema.push(roleResult)
    const role = typeof entry.role === 'string' ? (ROLE_ALIASES[entry.role] ?? entry.role) : undefined
    const expected = role ? catalogue.get(role)?.tier : undefined
    const tier = typeof entry.tier === 'string' ? entry.tier : undefined
    if (tier && TIER_ALIASES[tier]) warn(`${at} tier ${tier} is read as ${TIER_ALIASES[tier]}`)
    const resolved = tier ? (TIER_ALIASES[tier] ?? tier) : undefined
    if (!resolved || !TIERS.includes(resolved)) fail(`${at} tier must be one of ${TIERS.join(', ')}`)
    else if (expected && resolved !== expected) fail(`${at} tier must be ${expected}, the catalogue tier of ${role}`)
    if ('since' in entry && !validTimestamp(entry.since)) fail(`${at} since must be a UTC RFC 3339 timestamp`)
    if ('status' in entry && !WORKER_STATUSES.includes(entry.status)) fail(`${at} status must be active or idle`)
    if (entry.listening === 'agora-call') warn(`${at} listening agora-call is read as on`)
    else if ('listening' in entry && !CAPABILITY_STATUSES.includes(entry.listening))
      fail(`${at} listening must be on or off`)
  })
}

/** Bulk history in the state's Now and Held: dated log lines, runs of commit identifiers or test counts. */
const historyOutcome = (record: ParsedRecord, state: string): AuditOutcome | undefined => {
  const dated = state.match(DATED_LINE)?.length ?? 0
  const commits = state.match(COMMIT_ID)?.length ?? 0
  const counts = state.match(TEST_COUNT)?.length ?? 0
  if (dated < 3 && commits < 3 && counts < 2) return undefined
  return {
    status: 'VIOLATION',
    message:
      'Now and Held appear to carry history (dated log lines, commit identifiers or test counts); the Git log and the commit hold it, so link one rather than copy it',
    subject: record.path
  }
}

/** One package's entry file: its closed fields, the definition and the state, its body and its boundary. */
const packageEvidence = (
  item: Package,
  parentFields: Readonly<Record<string, unknown>> | null | undefined,
  catalogue: ReadonlyMap<string, CatalogueRole>,
  evidence: Evidence
): void => {
  const { folder, entry } = item
  const fields = entry.fields
  const fail = (message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: entry.path })
  }
  const warn = (message: string): void => {
    evidence.size.push({ status: 'VIOLATION', message, subject: entry.path })
  }
  if (!fields) {
    fail(`${ENTRY_FILE} front matter must be a valid YAML mapping`)
    return
  }
  const keys = Object.keys(fields)
  const missing = ENTRY_REQUIRED.filter((field) => !keys.includes(field))
  const unknown = keys.filter((field) => !ENTRY_FIELDS.has(field))
  if (missing.length > 0 || unknown.length > 0)
    fail(
      `${ENTRY_FILE} front matter must use only its closed field set${missing.length > 0 ? `; missing: ${missing.join(', ')}` : ''}${unknown.length > 0 ? `; outside it: ${unknown.join(', ')}` : ''}`
    )
  const middle = [[], [VALUES_HEADING]].find((optional) =>
    sameOutline(entry.body, folder.expectedId, [...BODY_BEFORE_VALUES, ...optional, ...BODY_AFTER_VALUES])
  )
  if (!middle)
    fail(
      `${ENTRY_FILE} headings must be the id H1 "# ${folder.expectedId}", then Goals, Scope, an optional Values, Now, Held and Changes`
    )
  const sections = h2Sections(entry.body)
  for (const heading of [...BODY_BEFORE_VALUES, ...BODY_AFTER_VALUES])
    if (sections.has(heading) && (sections.get(heading)?.trim().length ?? 0) === 0)
      fail(`${heading} must say something, if only None`)
  const values = sections.get(VALUES_HEADING)
  if (values !== undefined && nonEmptyLines(values) !== 1)
    fail('Values is one line, linking the shared values and adding any of the work its own')
  if (typeof fields.description !== 'string' || fields.description.trim().length === 0)
    fail('description must be a non-empty routing description')
  else if (fields.description.trim().length > LIMITS.description)
    warn(`description runs past ${LIMITS.description} characters`)
  if (nonEmptyLines(sections.get('Now') ?? '') > LIMITS.nowLines) warn(`Now runs past ${LIMITS.nowLines} lines`)
  const history = historyOutcome(entry, `${sections.get('Now') ?? ''}\n${sections.get('Held') ?? ''}`)
  if (history) evidence.size.push(history)

  definitionChecks(item, fields, parentFields, evidence)
  if (!('role' in fields)) evidence.schema.push(warning(entry, `${ENTRY_FILE} names no role from the role catalogue`))
  else {
    const outcome = roleOutcome(entry, fields.role, ENTRY_FILE, catalogue)
    if (outcome) evidence.schema.push(outcome)
  }
  stateChecks(entry, fields, evidence)
  capabilityChecks(entry, fields, evidence)
  workersChecks(entry, fields, evidence, catalogue)
  if (
    validTimestamp(fields.created_at) &&
    validTimestamp(fields.since) &&
    Date.parse(fields.created_at) > Date.parse(fields.since)
  )
    evidence.lifecycle.push({
      status: 'VIOLATION',
      message: 'created_at must not be later than since',
      subject: entry.path
    })
  evidence.boundary.push(...boundaryOutcomes(entry, fields))
}

/** The top-level packages' coordination: parents resolve, covers agree with the main register and with each parent. */
const relationshipEvidence = (packages: readonly Package[], evidence: Evidence): void => {
  const top = packages.filter((item) => !item.folder.parent && item.entry.fields)
  const id = (item: Package): string => item.folder.expectedId
  const names = (item: Package): readonly string[] => {
    const [territory, kind, name] = id(item).split('.')
    if (item.entry.fields?.level === 'territory' && (!kind || (kind === SECONDARY_SEGMENT && name === 'main')))
      return [`${territory}.sop.main`, territory as string]
    return [id(item)]
  }
  const byId = new Map<string, Package>()
  const fail = (item: Package, message: string): void => {
    evidence.schema.push({ status: 'VIOLATION', message, subject: item.entry.path })
  }
  for (const item of top)
    for (const name of names(item)) {
      const existing = byId.get(name)
      if (existing && existing !== item) fail(item, `ambiguous work home ${name}: ${id(existing)} and ${id(item)}`)
      else byId.set(name, item)
    }
  const includes = (values: unknown, wanted: string): boolean =>
    Array.isArray(values) &&
    values.some(
      (value) =>
        value === wanted ||
        (typeof value === 'string' && byId.get(value) !== undefined && byId.get(value) === byId.get(wanted))
    )
  const secondaryOwners = new Map<string, string>()
  for (const item of top) {
    const fields = item.entry.fields
    if (!fields) continue
    const territory = id(item).split('.')[0] ?? ''
    const main = byId.get(`${territory}.sop.main`) ?? byId.get(territory)
    const parent = typeof fields.parent === 'string' ? byId.get(fields.parent) : undefined
    const covers = Array.isArray(fields.covers) ? fields.covers : []
    if (main && typeof fields.parent === 'string' && !parent)
      fail(item, 'parent does not resolve to a State of play in the store')
    if (fields.level === 'territory' && item !== main)
      for (const covered of covers) {
        if (typeof covered !== 'string') continue
        const key = byId.get(covered) ? id(byId.get(covered) as Package) : covered
        const previous = secondaryOwners.get(key)
        if (previous && previous !== id(item)) fail(item, `covers duplicates ${covered} in ${previous}`)
        secondaryOwners.set(key, id(item))
        if (main && Array.isArray(main.entry.fields?.covers) && !includes(main.entry.fields.covers, covered))
          fail(item, `covers names ${covered}, absent from the main register`)
        const child = byId.get(covered)
        if (child && byId.get(String(child.entry.fields?.parent)) !== item)
          fail(child, `parent disagrees with ${id(item)} coverage`)
      }
    if (fields.level !== 'territory') {
      if (main && Array.isArray(main.entry.fields?.covers) && !includes(main.entry.fields.covers, id(item)))
        fail(item, 'work is absent from the main covers register')
      if (parent && Array.isArray(parent.entry.fields?.covers) && !includes(parent.entry.fields.covers, id(item)))
        fail(item, 'parent covers does not include this work')
    }
  }
}

/** Each earlier copy of packages left in a retired working area, listed for its owner and never deleted by the audit. */
const earlierCopies = (root: string): AuditOutcome[] =>
  EARLIER_AREAS.filter((area) => existsSync(join(root, '+', area))).map((area) => ({
    status: 'VIOLATION',
    message: `+/${area}/ is a retired working area: each live package in it moves to work/<territory>/<id>/ in the Agora store, and the earlier copy is removed only on its owner's word`,
    subject: `+/${area}`
  }))

export const createWorkPackageSession = ({
  repository,
  configuration,
  publication
}: RubricContextOptions): RubricSession<WorkPackageRubricContext> => {
  const root = resolve(repository)
  // The host resolves declaration presence before passing this selected capability table.
  const declared = Boolean(configuration)
  const layout = declared ? workLayout(root) : undefined
  const absent = !declared
    ? 'ki-work-package is not declared, so `work/` is not read.'
    : layout
      ? undefined
      : 'No `work/` folder is present.'
  const packages: Package[] = (layout?.packages ?? []).map((folder) => ({
    folder,
    entry: parseRecord(join(folder.path, ENTRY_FILE), root)
  }))
  const byFolder = new Map(packages.map((item) => [item.folder, item]))
  const catalogue = roleCatalogue()
  const evidence: Evidence = { identity: [], schema: [], lifecycle: [], size: [], boundary: [] }
  for (const item of packages) {
    const parent = item.folder.parent ? byFolder.get(item.folder.parent) : undefined
    packageEvidence(item, parent?.entry.fields, catalogue, evidence)
  }
  relationshipEvidence(packages, evidence)

  const configOutcomes: AuditOutcome[] = Object.keys(configuration ?? {}).map((key) => ({
    status: 'VIOLATION' as const,
    level: 'WARN' as const,
    message: `unrecognised ki-work-package configuration key ${key}`,
    subject: '.ki.toml'
  }))
  const notRead = absent ? { status: 'NOT_APPLICABLE' as const, message: absent } : undefined
  const context: WorkPackageRubricContext = {
    rubric: { publication },
    configuration: {
      outcomes: one(
        configOutcomes,
        declared
          ? 'The ki-work-package declaration is an empty capability marker.'
          : 'No ki-work-package declaration is active.'
      )
    },
    structure: {
      outcomes: one(
        layout?.violations ?? [],
        '`work/` holds only territory folders, each holding only packages with their entry file.',
        absent
      ),
      earlier: one(
        declared ? earlierCopies(root) : [],
        'No earlier copy of a package is left in a retired working area.',
        declared ? undefined : absent
      )
    },
    records: {
      identity: one(evidence.identity, 'Every package and sub-package has one consistent identity.', absent),
      schema: one(evidence.schema, "Every package's entry file uses its closed schema.", absent)
    },
    lifecycle: {
      mechanical: one(evidence.lifecycle, 'Every package keeps its timestamps in order.', absent),
      size: one(evidence.size, 'Every package keeps within its limits and carries no history.', absent)
    },
    folder: notRead ? { closed: [notRead], finished: [notRead], changes: [notRead] } : folderOutcomes(root, layout),
    boundary: {
      outcomes: one(
        evidence.boundary,
        'No mechanically recognisable transcript or session-continuity dependency is present.',
        absent
      )
    }
  }

  return {
    subjects: [
      {
        subject: WORK_DIRECTORY,
        families: ['RUBRIC', 'CONFIG', 'STRUCTURE', 'RECORD', 'LIFECYCLE', 'FOLDER', 'BOUNDARY'],
        context: () => context
      }
    ],
    proposal: () => ({ writes: [] })
  }
}
