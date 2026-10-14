import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'
import { workIdentifier } from '../../shared/work-identifiers.ts'
import type { AuditOutcome, RubricContextOptions, RubricPublicationContext, RubricSession } from '../types.ts'
import { evaluateHousekeepingSchedule, FULL_COMMIT_REF, type HousekeepingSchedule } from './schedule.ts'
import { parseStrictYaml as parseYaml } from './strict-yaml.ts'

const TEMPLATE_ID = workIdentifier('HK')
const RUN_ID = workIdentifier()
const CADENCE = /^P[1-9]\d*[DWM]$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const HORIZONS = new Set(['now', 'next', 'soon', 'future'])
/** Pre-v1 spawn horizons, read only under roadmap migration tolerance. */
const LEGACY_HORIZONS = new Set(['waiting-for', 'parked'])
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const KINDS = new Set(['deliver', 'decide', 'investigate', 'audit'])
const PURPOSES = new Set(['capability', 'corrective', 'debt', 'governance', 'learning', 'adoption', 'upkeep'])
const CLASSIFICATION_FIELDS = ['initiative', 'component', 'purpose', 'kind'] as const
const RUN_STATES = new Set(['draft', 'ready', 'in-progress', 'awaiting-review'])
const KB_SCHEDULE_FIELDS = new Set([
  'cadence',
  'last_run',
  'grace',
  'spawn_policy',
  'spawn_horizon',
  'active_run',
  'commit_threshold',
  'last_run_ref',
  ...CLASSIFICATION_FIELDS
])
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

export type HousekeepingRubricContext = {
  rubric: RubricPublicationContext
  templates: { outcomes: readonly AuditOutcome[]; schedules: readonly AuditOutcome[] }
}

type Frontmatter = {
  values: Readonly<Record<string, string>>
  body: string
  errors: readonly string[]
  selected: boolean
}
type Template = {
  id: string
  activeRun: string | null
  subject: string
  errors: string[]
  values: Readonly<Record<string, string>>
}
type Run = { id: string; status: string; housekeepingTemplate: string; scheduledFor: string }

const file = (path: string): boolean => {
  try {
    const stat = lstatSync(path)
    return stat.isFile() && !stat.isSymbolicLink()
  } catch {
    return false
  }
}

const directory = (path: string): boolean => {
  try {
    const stat = lstatSync(path)
    return stat.isDirectory() && !stat.isSymbolicLink()
  } catch {
    return false
  }
}

const present = (path: string): boolean => {
  try {
    lstatSync(path)
    return true
  } catch {
    return false
  }
}
const safeContainedPath = (root: string, path: string): boolean => {
  const value = relative(root, path)
  if (!value || isAbsolute(value) || value === '..' || value.startsWith('../')) return false
  let cursor = root
  for (const segment of value.split('/')) {
    cursor = join(cursor, segment)
    if (present(cursor) && !directory(cursor)) return false
  }
  return true
}
const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const frontmatter = (content: string, kb = false): Frontmatter => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(content)
  if (!match)
    return {
      values: {},
      body: content,
      selected: !kb,
      errors: kb && !content.startsWith('---') ? [] : ['must begin with a complete YAML frontmatter block']
    }
  const values: Record<string, string> = {}
  const errors: string[] = []
  let selected = !kb
  try {
    const document: unknown = parseYaml(match[1] ?? '')
    if (!record(document)) throw new Error('frontmatter must be a mapping')
    selected = !kb || Object.hasOwn(document, 'housekeeping')
    if (kb && !selected) return { values, body: match[2] ?? '', errors, selected }
    let fields = document
    if (kb) {
      if (!record(document.housekeeping)) throw new Error('housekeeping must be a mapping')
      fields = { id: document.id, title: document.title, status: document.status }
      for (const [key, value] of Object.entries(document.housekeeping)) {
        if (!KB_SCHEDULE_FIELDS.has(key)) errors.push(`has unexpected housekeeping field '${key}'`)
        else fields[key.replaceAll('_', '-')] = value
      }
    }
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined) continue
      if (value !== null && typeof value !== 'string' && !(key === 'commit-threshold' && typeof value === 'number'))
        errors.push(`field '${key}' must be a scalar of the declared type`)
      values[key] = value === null ? 'null' : String(value)
    }
  } catch (error) {
    errors.push(`has invalid YAML or housekeeping profile: ${error instanceof Error ? error.message : String(error)}`)
  }
  return { values, body: match[2] ?? '', errors, selected }
}

const validDate = (value: string): boolean => {
  if (!DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
}

const hasBodySection = (body: string, heading: string): boolean => {
  const section = new RegExp(`^## ${heading}\\s*$([\\s\\S]*?)(?=^##\\s|$(?![\\s\\S]))`, 'm').exec(body)
  return Boolean(section?.[1].trim())
}

/** Roadmap migration tolerance: retired or missing classification is reported, never failed. */
const migrationNotices = (values: Readonly<Record<string, string>>): string[] => {
  const notices: string[] = []
  const horizon = values['spawn-horizon'] ?? ''
  if (LEGACY_HORIZONS.has(horizon))
    notices.push(`Migration: spawn-horizon '${horizon}' is retired; spawn at now, next, soon or future.`)
  if (!('initiative' in values)) notices.push('Migration: the template should declare the initiative its runs serve.')
  return notices
}

const repositoryLayout = (root: string): { kb: boolean; templateRoot: string; errors: string[] } => {
  const config = join(root, '.ki.toml')
  const project = { kb: false, templateRoot: join(root, 'docs', 'housekeeping'), errors: [] }
  if (!present(config)) return project
  if (!file(config)) return { ...project, errors: ['Repository configuration is not a safe regular file.'] }
  try {
    const parsed = TOML.parse(readFileSync(config, 'utf8')) as Record<string, unknown>
    const skills = record(parsed.skills) ? parsed.skills : {}
    const kb = record(skills['ki-repo']) && skills['ki-repo'].repo_type === 'kb'
    if (!kb) return project
    // Consume the Activities-owned location binding; its owner validates the table.
    const activities = record(skills['ki-repo-kb-activities']) ? skills['ki-repo-kb-activities'] : {}
    const location = activities.activities_dir ?? 'Admin/Operations/Activities'
    if (typeof location !== 'string' || !location.trim() || isAbsolute(location))
      return { ...project, kb: true, errors: ['The Activities collection binding must be a non-empty relative path.'] }
    return { kb, templateRoot: resolve(root, location.trim()), errors: [] }
  } catch {
    return { ...project, errors: ['Cannot resolve recurring-work placement from malformed repository configuration.'] }
  }
}

const runIndex = (root: string, kb: boolean): ReadonlyMap<string, Run[]> => {
  const roadmap = kb ? join(root, 'Streams', 'Roadmap') : join(root, 'docs', 'roadmap')
  if (!safeContainedPath(root, roadmap) || !directory(roadmap)) return new Map()
  const runs = new Map<string, Run[]>()
  for (const entry of readdirSync(roadmap, { withFileTypes: true })) {
    const path = join(roadmap, entry.name)
    if (!entry.name.endsWith('.md') || !file(path)) continue
    const parsed = frontmatter(readFileSync(path, 'utf8')).values
    const id = parsed.id
    if (!id) continue
    const run: Run = {
      id,
      status: parsed.status ?? '',
      housekeepingTemplate: parsed.housekeeping_template ?? '',
      scheduledFor: parsed.scheduled_for ?? ''
    }
    runs.set(id, [...(runs.get(id) ?? []), run])
  }
  return runs
}

const templateErrors = ({
  path,
  kb,
  parsed,
  today
}: {
  path: string
  kb: boolean
  parsed: Frontmatter
  today: string
}): string[] => {
  const errors = [...parsed.errors]
  const expected = new Set([
    'id',
    'title',
    'status',
    'cadence',
    'last-run',
    'grace',
    'spawn-policy',
    'spawn-horizon',
    'active-run'
  ])
  for (const key of expected) if (!(key in parsed.values)) errors.push(`is missing frontmatter field '${key}'`)
  const allowed = new Set([...expected, 'commit-threshold', 'last-run-ref', ...CLASSIFICATION_FIELDS])
  const unexpected = Object.keys(parsed.values).filter((key) => !allowed.has(key))
  if (unexpected.length) errors.push(`has unexpected frontmatter field(s): ${unexpected.join(', ')}`)

  const id = parsed.values.id
  if (!id || !TEMPLATE_ID.test(id)) errors.push('has an invalid housekeeping template id')
  if (!parsed.values.title?.trim()) errors.push('has an empty title')
  if (!kb && (!id || !new RegExp(`^${id}-[a-z0-9]+(?:-[a-z0-9]+)*\\.md$`).test(basename(path))))
    errors.push('filename must repeat the template id followed by a lowercase kebab-case slug')
  if (!(kb ? ['active', 'paused', 'retired'] : ['active', 'paused']).includes(parsed.values.status ?? ''))
    errors.push(kb ? "status must be 'active', 'paused', or 'retired'" : "status must be 'active' or 'paused'")
  if (kb && parsed.values.status === 'retired' && parsed.values['active-run'] !== 'null')
    errors.push('retirement requires explicit disposition of active-run before retaining the retired Activity')
  if (!CADENCE.test(parsed.values.cadence ?? '')) errors.push('cadence must be a positive one-unit ISO-8601 duration')
  if (!CADENCE.test(parsed.values.grace ?? '')) errors.push('grace must be a positive one-unit ISO-8601 duration')
  if (parsed.values['last-run'] !== 'null' && !validDate(parsed.values['last-run'] ?? ''))
    errors.push("last-run must be 'null' or a valid ISO date")
  if (validDate(parsed.values['last-run'] ?? '') && (parsed.values['last-run'] as string) > today)
    errors.push('last-run cannot claim a successful review after the evaluation date')
  const threshold = parsed.values['commit-threshold']
  if (threshold !== undefined && (!/^[1-9]\d*$/.test(threshold) || !Number.isSafeInteger(Number(threshold))))
    errors.push('commit-threshold must be a positive safe integer')
  const anchor = parsed.values['last-run-ref']
  if (anchor !== undefined && anchor !== 'null' && !FULL_COMMIT_REF.test(anchor))
    errors.push("last-run-ref must be 'null' or a full lowercase commit identity")
  if (anchor !== undefined && anchor !== 'null' && parsed.values['last-run'] === 'null')
    errors.push('last-run-ref requires successful last-run date evidence')
  if (!['manual', 'when-due', 'when-overdue'].includes(parsed.values['spawn-policy'] ?? ''))
    errors.push('has an invalid spawn-policy')
  const horizon = parsed.values['spawn-horizon'] ?? ''
  if (!HORIZONS.has(horizon) && !LEGACY_HORIZONS.has(horizon)) errors.push('has an invalid spawn-horizon')
  for (const key of ['initiative', 'component'] as const)
    if (key in parsed.values && !SLUG.test(parsed.values[key] ?? ''))
      errors.push(`${key} must be a lowercase kebab-case slug`)
  if ('purpose' in parsed.values && !PURPOSES.has(parsed.values.purpose ?? ''))
    errors.push('purpose must be one canonical value')
  if ('kind' in parsed.values && !KINDS.has(parsed.values.kind ?? '')) errors.push('kind must be one canonical value')
  if (parsed.values['active-run'] !== 'null' && !RUN_ID.test(parsed.values['active-run'] ?? ''))
    errors.push("active-run must be 'null' or a work-record identity")
  for (const heading of ['Goal', 'Procedure', 'Successful-run evidence', 'Obsolescence'])
    if (!hasBodySection(parsed.body, heading)) errors.push(`requires a non-empty '${heading}' body section`)
  return errors
}

const collectionEntries = (root: string, recursive: boolean): string[] =>
  readdirSync(root)
    .sort()
    .flatMap((name) => {
      const path = join(root, name)
      return recursive && directory(path) ? collectionEntries(path, true) : [path]
    })

export const createHousekeepingSession = ({
  repository,
  publication
}: RubricContextOptions): RubricSession<HousekeepingRubricContext> => {
  const root = resolve(repository)
  const today = new Date().toISOString().slice(0, 10)
  const layout = repositoryLayout(root)
  const { kb, templateRoot } = layout
  const relativeRoot = relative(root, templateRoot)
  const outcomes: AuditOutcome[] = layout.errors.map((message) => ({
    status: 'VIOLATION',
    message,
    subject: '.ki.toml'
  }))
  const schedules: AuditOutcome[] = []
  if (kb && present(join(root, 'Streams', 'Housekeeping'))) {
    outcomes.push({
      status: 'VIOLATION',
      message:
        'Reconcile retained Streams/Housekeeping records into canonical Activity notes before scheduling; preserve identities, run links, and review evidence. No files were moved or deleted.',
      subject: 'Streams/Housekeeping'
    })
  }
  if (!safeContainedPath(root, templateRoot)) {
    outcomes.push({
      status: 'VIOLATION',
      message: 'Recurring-work collection must be a contained path without symbolic links or non-directory ancestors.',
      subject: relativeRoot
    })
  }
  if (outcomes.length) {
    schedules.push({ status: 'INFO', message: 'Collection evidence is invalid; no schedule was evaluated.' })
  } else if (!directory(templateRoot)) {
    outcomes.push({
      status: 'NOT_APPLICABLE',
      message: 'No housekeeping template directory is present.',
      subject: relativeRoot
    })
  } else {
    const templates: Template[] = []
    for (const path of collectionEntries(templateRoot, kb)) {
      const name = basename(path)
      const subject = relative(root, path)
      if (kb && file(path) && (path === join(templateRoot, 'Activities.md') || !name.endsWith('.md'))) continue
      if (!name.endsWith('.md') || !file(path)) {
        outcomes.push({
          status: 'VIOLATION',
          message: 'Housekeeping template root contains an unsafe or unexpected entry.',
          subject
        })
        continue
      }
      const parsed = frontmatter(readFileSync(path, 'utf8'), kb)
      if (kb && !parsed.selected && !parsed.errors.length) continue
      templates.push({
        id: parsed.values.id ?? '',
        activeRun: parsed.values['active-run'] === 'null' ? null : (parsed.values['active-run'] ?? null),
        subject,
        values: parsed.values,
        errors: templateErrors({ path, kb, parsed, today })
      })
    }
    if (!templates.length && !outcomes.length)
      outcomes.push({
        status: 'NOT_APPLICABLE',
        message: 'No housekeeping templates are present.',
        subject: relativeRoot
      })

    const runs = runIndex(root, kb)
    const identities = new Map<string, number>()
    for (const template of templates) identities.set(template.id, (identities.get(template.id) ?? 0) + 1)
    for (const template of templates)
      if ((identities.get(template.id) ?? 0) > 1)
        template.errors.push('housekeeping identity must be unique in the collection')
    const activeOwners = new Map<string, Template[]>()
    for (const template of templates)
      if (template.activeRun)
        activeOwners.set(template.activeRun, [...(activeOwners.get(template.activeRun) ?? []), template])
    for (const template of templates) {
      if (!template.activeRun) continue
      const linked = runs.get(template.activeRun) ?? []
      if (linked.length !== 1) template.errors.push('active-run must resolve to exactly one linked roadmap record')
      else {
        const run = linked[0] as Run
        if (!RUN_STATES.has(run.status))
          template.errors.push('active-run must reference an unfinished lifecycle record')
        if (run.housekeepingTemplate !== template.id)
          template.errors.push('linked run must name this template in housekeeping_template')
        if (!validDate(run.scheduledFor)) template.errors.push('linked run must carry a valid scheduled_for date')
      }
      if ((activeOwners.get(template.activeRun)?.length ?? 0) > 1)
        template.errors.push('active-run cannot be linked by more than one housekeeping template')
    }
    for (const template of templates) {
      outcomes.push({
        status: template.errors.length ? 'VIOLATION' : 'PASS',
        message: template.errors.length
          ? `Housekeeping template is invalid: ${template.errors.join('; ')}.`
          : 'Housekeeping template has a complete lifecycle, identity, schedule, body, and linkage contract.',
        subject: template.subject
      })
      for (const message of migrationNotices(template.values))
        outcomes.push({ status: 'INFO', message, subject: template.subject })
      if (template.errors.length) continue
      const values = template.values
      if (values.status === 'retired') {
        schedules.push({
          status: 'INFO',
          subject: template.subject,
          message: 'Retired Activity retained for rationale and evidence; no run is eligible.'
        })
        continue
      }
      const evaluation = evaluateHousekeepingSchedule({
        repository: root,
        today,
        schedule: {
          status: values.status as HousekeepingSchedule['status'],
          cadence: values.cadence as string,
          grace: values.grace as string,
          lastRun: values['last-run'] === 'null' ? null : (values['last-run'] as string),
          activeRun: template.activeRun,
          spawnPolicy: values['spawn-policy'] as HousekeepingSchedule['spawnPolicy'],
          ...(values['commit-threshold'] === undefined ? {} : { commitThreshold: Number(values['commit-threshold']) }),
          ...(values['last-run-ref'] === undefined
            ? {}
            : { lastRunRef: values['last-run-ref'] === 'null' ? null : values['last-run-ref'] })
        }
      })
      schedules.push({
        status: 'INFO',
        subject: template.subject,
        message: `Schedule action: ${evaluation.action}; ${evaluation.reason} Calendar due: ${evaluation.calendarDue ?? 'unknown'}; commits: ${evaluation.commits.kind === 'known' ? evaluation.commits.count : evaluation.commits.kind}. No run was created.`
      })
      if (evaluation.commits.kind === 'unknown')
        schedules.push({
          status: 'VIOLATION',
          subject: template.subject,
          message: `Change-volume evidence is unknown: ${evaluation.commits.reason} Do not infer zero commits or backfill a reviewed revision.`
        })
    }
  }
  const context: HousekeepingRubricContext = { rubric: { publication }, templates: { outcomes, schedules } }
  return { subjects: [{ families: ['HOUSE'], context: () => context }], proposal: () => ({ writes: [] }) }
}
