#!/usr/bin/env bun
/** Mechanical auditor for flat non-KB repository work items. */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import {
  isAgoraRepository,
  loadProjectRegistry,
  loadTerritoryRegistry,
  type ProjectRegistry,
  parseRegistryReference,
  type RegistryLookup
} from './project-registry.ts'
import { parseStrictYaml as parseYaml } from './strict-yaml.ts'

type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
export type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
export type Horizon = (typeof HORIZONS)[number] | (typeof LEGACY_HORIZONS)[number]
export type WorkItem = {
  readonly id: string
  readonly area: string | null
  readonly serial: number
  readonly title: string
  readonly theme: string | null
  readonly horizon: Horizon | null
  readonly status: string
  readonly kind: string | undefined
  readonly purpose: string | undefined
  readonly project: string | undefined
  readonly initiative: string | undefined
  readonly component: string | undefined
  readonly resolution: string | undefined
  readonly resolutionTarget: string | undefined
  readonly terminalTriage: boolean
  readonly blocks: readonly string[]
  readonly blockedBy: readonly string[]
  readonly waitingOnTrades: readonly string[]
  readonly baselineRef: string | null
  readonly intakeDisposition: string | undefined
  readonly intakeDispositionTarget: string | undefined
  readonly createdAt: string | undefined
  readonly updatedAt: string | undefined
  readonly file: string
  readonly body: string
}
type RoadmapConfiguration = {
  readonly repoCode: string
  /** Issuing area codes, each with its title; a legacy bare list leaves the title undefined. */
  readonly areas: ReadonlyMap<string, string | undefined>
  readonly components: ReadonlySet<string>
}

export const HORIZONS = ['now', 'next', 'soon', 'future', 'hold'] as const
/** Retired pre-v1 horizons, recognised only so the checker can fail them. */
export const LEGACY_HORIZONS = ['waiting-for', 'parked', 'triage'] as const

const ID_RE = /^[A-Z0-9][A-Z0-9-]{1,23}-\d{3,}$/
const FILE_RE = /^([A-Z0-9][A-Z0-9-]{1,23}-\d{3,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/
const AREA_RE = /^[A-Z][A-Z0-9]*$/
const AREA_TITLE_RE = /^[A-Z0-9]\S*(?: \S+)*$/
const COMMIT_RE = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/
const TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
const TRADE_RE = /^TRD-[0-9a-f]{8}$/
const TASK_PROVIDER_RE = /^[a-z][a-z0-9-]*$/
const TASK_RELATIONS = new Set(['evaluation', 'implementation', 'review', 'integration', 'coordination', 'related'])
const TASK_FIELDS = ['authority', 'scope', 'id', 'key', 'url', 'relation'] as const
const TASK_LINKS_PARSE_ERROR = Symbol('task_links parse error')
const MAX_TITLE_WORDS = 4
const STATUS = new Set(['triage', 'draft', 'ready', 'in-progress', 'awaiting-review', 'done', 'cancelled'])
const OPEN_STATUSES = new Set(['draft', 'ready', 'in-progress', 'awaiting-review'])
const TERMINAL_STATUSES = new Set(['done', 'cancelled'])
const HORIZONS_BY_STATUS: Readonly<Record<string, readonly string[]>> = {
  draft: HORIZONS,
  ready: ['now', 'next', 'hold'],
  'in-progress': ['now', 'hold'],
  'awaiting-review': ['now', 'hold']
}
const HOLD_REASONS = new Set(['waiting-for', 'parked'])
const HOLD_FIELDS = new Set(['reason', 'condition', 'review', 'trades'])
const HOLD_STALE_DAYS = 31
const HOLD_PARSE_ERROR = Symbol('hold parse error')
const RESOLUTIONS = new Set(['obsolete', 'rejected', 'duplicate', 'merged', 'superseded'])
const TARGETED_RESOLUTIONS = new Set(['duplicate', 'merged', 'superseded'])
const KINDS = new Set(['deliver', 'decide', 'investigate', 'audit'])
const PURPOSES = new Set(['capability', 'corrective', 'debt', 'governance', 'learning', 'adoption', 'upkeep'])
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const INTAKE_DISPOSITIONS = new Set(['rejected', 'duplicate', 'merged'])
const IMMEDIATE = new Set<string>(['now', 'next'])
const RECORD_FIELDS = new Set([
  'id',
  'area',
  'title',
  'kind',
  'purpose',
  'project',
  'initiative',
  'component',
  'horizon',
  'hold',
  'status',
  'resolution',
  'resolution_target',
  'blocks',
  'blocked_by',
  'task_links',
  'baseline_ref',
  'created_at',
  'updated_at',
  'transferred_from',
  'housekeeping_template',
  'scheduled_for',
  // Retired fields, recognised only so the checker can fail them.
  'theme',
  'waiting_on_trades',
  'intake_disposition',
  'intake_disposition_target'
])
const STANDARD = 'references/standards-repository-roadmaps.md'
const FORMAT = 'references/standards-work-item-format.md'
const RUBRIC = 'references/rubric.md'
const ROADMAP_CONFIG = 'ki-work-roadmap'
const REPO_CONFIG = 'ki-repo'
const LEGACY_AREA_LIST = 'a bare areas list is the legacy form; map each code to its title, e.g. GOV = "Governance"'

/** The legacy bare areas list fails in the Knowledge Islands Agora and warns outside it. */
export const legacyAreaList = (repository: string): { level: 'FAIL' | 'WARN'; msg: string } =>
  isAgoraRepository(repository)
    ? { level: 'FAIL', msg: LEGACY_AREA_LIST }
    : { level: 'WARN', msg: `outside the Agora, ${LEGACY_AREA_LIST}` }

export const ISSUE_LEDGER = '_ISSUES.md'
export const IDEAS_LIST = '_IDEAS.md'
/** Roadmap index holding area definitions; not a record. */
export const ROADMAP_INDEX = 'README.md'
const NON_RECORDS = new Set([ISSUE_LEDGER, IDEAS_LIST, ROADMAP_INDEX])
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

let findings: Finding[] = []
const add = (level: Level, area: string, msg: string, ref = RUBRIC, file?: string): void => {
  findings.push({ level, area, msg, ref, file })
}

const parseScalar = (value: string): string | boolean | null | undefined => {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null
  const quoted = trimmed.match(/^(['"])(.*)\1$/)
  return quoted ? quoted[2] : trimmed || undefined
}

const canonicalTimestamp = (value: string): boolean => {
  if (!TIMESTAMP_RE.test(value)) return false
  const milliseconds = Date.parse(value)
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString().replace('.000Z', 'Z') === value
}

const parseTaskLinks = (lines: readonly string[], display: string): unknown => {
  try {
    return (parseYaml(`task_links:\n${lines.join('\n')}`) as { task_links?: unknown } | null)?.task_links
  } catch (error) {
    const detail = error instanceof Error ? error.message.split('\n')[0] : 'parse failed'
    add('FAIL', 'ITEM-1', `task_links YAML is invalid: ${detail}`, FORMAT, display)
    return TASK_LINKS_PARSE_ERROR
  }
}

const parseHold = (lines: readonly string[], display: string): unknown => {
  try {
    return (parseYaml(`hold:\n${lines.join('\n')}`) as { hold?: unknown } | null)?.hold
  } catch (error) {
    const detail = error instanceof Error ? error.message.split('\n')[0] : 'parse failed'
    add('FAIL', 'ITEM-2', `hold YAML is invalid: ${detail}`, FORMAT, display)
    return HOLD_PARSE_ERROR
  }
}

const validateTaskLinks = (links: unknown, display: string): void => {
  if (links === TASK_LINKS_PARSE_ERROR) return
  if (!links || typeof links !== 'object' || Array.isArray(links) || !Object.keys(links).length) {
    add('FAIL', 'ITEM-1', 'task_links must be a non-empty provider map', FORMAT, display)
    return
  }
  for (const [provider, references] of Object.entries(links)) {
    if (!TASK_PROVIDER_RE.test(provider))
      add('FAIL', 'ITEM-1', `task_links provider '${provider}' must be lowercase kebab-case`, FORMAT, display)
    if (!Array.isArray(references) || !references.length) {
      add('FAIL', 'ITEM-1', `task_links provider '${provider}' must have references`, FORMAT, display)
      continue
    }
    const identities = new Set<string>()
    for (const reference of references) {
      if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
        add('FAIL', 'ITEM-1', 'task_links reference must be a field map', FORMAT, display)
        continue
      }
      const keys = Object.keys(reference)
      if (keys.length !== TASK_FIELDS.length || TASK_FIELDS.some((field) => !keys.includes(field)))
        add('FAIL', 'ITEM-1', 'task_links reference must have exactly six required fields', FORMAT, display)
      const record = reference as Record<string, unknown>
      if (TASK_FIELDS.some((field) => typeof record[field] !== 'string' || !(record[field] as string).trim()))
        add('FAIL', 'ITEM-1', 'task_links reference fields must be non-empty strings', FORMAT, display)
      if (typeof record.relation === 'string' && !TASK_RELATIONS.has(record.relation))
        add('FAIL', 'ITEM-1', `task_links relation '${record.relation}' is invalid`, FORMAT, display)
      const identity = JSON.stringify([provider, record.authority, record.scope, record.id, record.relation])
      if (identities.has(identity))
        add('FAIL', 'ITEM-1', 'task_links repeats a task identity and relation', FORMAT, display)
      identities.add(identity)
    }
  }
}

const parseFrontmatter = (
  text: string,
  display: string
): { values: Record<string, unknown>; body: string } | undefined => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    add('FAIL', 'ITEM-1', 'work item must begin with YAML frontmatter', FORMAT, display)
    return undefined
  }
  const values: Record<string, unknown> = {}
  const lines = match[1].split(/\r?\n/)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const field = line.match(/^([a-z][a-z0-9]*(?:_[a-z0-9]+)*):\s*(.*?)\s*$/)
    if (!field) {
      add('FAIL', 'ITEM-1', `frontmatter line is invalid: ${line}`, FORMAT, display)
      continue
    }
    const [, key, raw] = field
    if (key in values) add('FAIL', 'ITEM-1', `frontmatter repeats '${key}'`, FORMAT, display)
    if (key === 'hold') {
      if (raw) {
        add('FAIL', 'ITEM-2', 'hold must be a nested mapping', FORMAT, display)
        values[key] = HOLD_PARSE_ERROR
        continue
      }
      const nested: string[] = []
      while (index + 1 < lines.length && (lines[index + 1] === '' || /^\s+/.test(lines[index + 1])))
        nested.push(lines[++index])
      values[key] = parseHold(nested, display)
      continue
    }
    if (key === 'task_links') {
      if (raw) {
        add('FAIL', 'ITEM-1', 'task_links must be a nested provider map', FORMAT, display)
        values[key] = TASK_LINKS_PARSE_ERROR
        continue
      }
      const nested: string[] = []
      while (index + 1 < lines.length && (lines[index + 1] === '' || /^\s+/.test(lines[index + 1])))
        nested.push(lines[++index])
      values[key] = parseTaskLinks(nested, display)
      continue
    }
    if (raw === '[]') values[key] = []
    else if (/^\[[^\]]*\]$/.test(raw)) {
      values[key] = raw
        .slice(1, -1)
        .split(',')
        .map((value) => value.trim().replace(/^(['"])(.*)\1$/, '$2'))
        .filter(Boolean)
    } else values[key] = parseScalar(raw)
  }
  return { values, body: text.slice(match[0].length) }
}

const isKb = (repository: string): boolean => {
  const config = join(repository, '.ki.toml')
  if (!existsSync(config)) return false
  try {
    const parsed = TOML.parse(readFileSync(config, 'utf8')) as Record<string, unknown>
    const table = (parsed.skills as Record<string, unknown> | undefined)?.[REPO_CONFIG]
    return (
      typeof table === 'object' &&
      table !== null &&
      !Array.isArray(table) &&
      (table as Record<string, unknown>).repo_type === 'kb'
    )
  } catch {
    return false
  }
}

const roadmapConfiguration = (repository: string): RoadmapConfiguration | undefined => {
  const config = join(repository, '.ki.toml')
  if (!existsSync(config)) {
    add('FAIL', 'ROAD-6', 'missing .ki.toml ki-work-roadmap repo_code', STANDARD, '.ki.toml')
    return undefined
  }
  try {
    const parsed = TOML.parse(readFileSync(config, 'utf8')) as Record<string, unknown>
    const repoTable = (parsed.skills as Record<string, unknown> | undefined)?.[REPO_CONFIG]
    const repoValues =
      typeof repoTable === 'object' && repoTable !== null && !Array.isArray(repoTable)
        ? (repoTable as Record<string, unknown>)
        : undefined
    const code = repoValues?.repo_code
    if (typeof code !== 'string' || !/^[A-Z0-9][A-Z0-9-]{1,23}$/.test(code)) {
      add(
        'FAIL',
        'ROAD-6',
        'ki-repo repo_code must be a stable uppercase identifier for a repository declaring ki-work-roadmap',
        STANDARD,
        '.ki.toml'
      )
      return undefined
    }
    const table = (parsed.skills as Record<string, unknown> | undefined)?.[ROADMAP_CONFIG]
    const values =
      typeof table === 'object' && table !== null && !Array.isArray(table)
        ? (table as Record<string, unknown>)
        : undefined
    if (values?.themes !== undefined)
      retire('ki-work-roadmap themes; remove the themes list', '.ki.toml', 'ROAD-6', STANDARD)
    const configuredAreas = values?.areas
    const areas = new Map<string, string | undefined>()
    if (Array.isArray(configuredAreas)) {
      if (!configuredAreas.length || configuredAreas.some((area) => typeof area !== 'string' || !AREA_RE.test(area))) {
        add('FAIL', 'ROAD-6', 'ki-work-roadmap areas must map uppercase area codes to titles', STANDARD, '.ki.toml')
        return undefined
      }
      if (new Set(configuredAreas).size !== configuredAreas.length) {
        add('FAIL', 'ROAD-6', 'ki-work-roadmap areas must not repeat an area code', STANDARD, '.ki.toml')
        return undefined
      }
      const legacy = legacyAreaList(repository)
      add(legacy.level, 'ROAD-6', legacy.msg, STANDARD, '.ki.toml')
      for (const area of configuredAreas) areas.set(area, undefined)
    } else if (configuredAreas !== undefined) {
      if (typeof configuredAreas !== 'object' || configuredAreas === null) {
        add('FAIL', 'ROAD-6', 'ki-work-roadmap areas must map uppercase area codes to titles', STANDARD, '.ki.toml')
        return undefined
      }
      for (const [area, title] of Object.entries(configuredAreas)) {
        if (!AREA_RE.test(area)) {
          add('FAIL', 'ROAD-6', 'roadmap area codes must be uppercase', STANDARD, '.ki.toml')
          return undefined
        }
        if (typeof title !== 'string' || !AREA_TITLE_RE.test(title)) {
          add(
            'FAIL',
            'ROAD-6',
            typeof title === 'string' && SLUG_RE.test(title)
              ? `area ${area} maps to theme '${title}'; the area-to-theme map is retired, so map the code to its title`
              : `area ${area} must map to a title that starts with a capital letter`,
            STANDARD,
            '.ki.toml'
          )
          return undefined
        }
        areas.set(area, title)
      }
      if (!areas.size) {
        add('FAIL', 'ROAD-6', 'ki-work-roadmap areas must not be empty when declared', STANDARD, '.ki.toml')
        return undefined
      }
    }
    const configuredComponents = values?.components
    const components = new Set<string>()
    if (configuredComponents !== undefined) {
      if (
        !Array.isArray(configuredComponents) ||
        configuredComponents.some((component) => typeof component !== 'string' || !SLUG_RE.test(component))
      ) {
        add(
          'FAIL',
          'ROAD-6',
          'ki-work-roadmap components must be a list of lowercase kebab-case names',
          STANDARD,
          '.ki.toml'
        )
        return undefined
      }
      if (new Set(configuredComponents).size !== configuredComponents.length) {
        add('FAIL', 'ROAD-6', 'ki-work-roadmap components must not repeat a name', STANDARD, '.ki.toml')
        return undefined
      }
      for (const component of configuredComponents) components.add(component)
    }
    return { repoCode: code, areas, components }
  } catch {
    add('FAIL', 'ROAD-6', 'cannot parse .ki.toml', STANDARD, '.ki.toml')
    return undefined
  }
}

const EXECUTION_SECTIONS = [
  'Current state',
  'Steps',
  'Files touched',
  'Verify',
  'Dependencies / blocks',
  'Documentation impact'
] as const
const DOCUMENTATION_IMPACT_SECTIONS = ['Decision Records', 'Specifications', 'Guides', 'Roadmap'] as const
const REVIEW_SECTIONS = [
  'Delivered',
  'Change Summary',
  'Verification',
  'Outstanding concerns',
  'Post-change review',
  'Mini recap'
] as const

const requiredSections = (item: WorkItem): readonly string[] => {
  const sections: string[] = ['Goal', 'Context', 'Boundary']
  if (item.terminalTriage) {
    sections.push('Intake disposition', 'Done', 'Discussion')
    return sections
  }
  if (item.status === 'triage' || item.status === 'cancelled') {
    if (item.status === 'cancelled') sections.push('Cancelled')
    sections.push('Discussion')
    return sections
  }
  if (item.status === 'draft' && item.horizon === 'soon') sections.push('Shaping')
  if (item.status !== 'draft' || (item.horizon !== null && IMMEDIATE.has(item.horizon)))
    sections.push(...EXECUTION_SECTIONS)
  if (item.status === 'awaiting-review' || item.status === 'done') sections.push('Review')
  if (item.status === 'done') sections.push('Done')
  sections.push('Discussion')
  return sections
}

const headings = (body: string): readonly string[] =>
  body.split(/\r?\n/).flatMap((line) => line.match(/^##\s+(.+?)\s*#*\s*$/)?.[1] ?? [])

const sectionContent = (body: string, heading: string): string | undefined => {
  const lines = body.split(/\r?\n/)
  const start = lines.findIndex((line) => line.match(new RegExp(`^##\\s+${heading}\\s*#*\\s*$`)))
  if (start === -1) return undefined
  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join('\n')
    .trim()
}

const subsectionHeadings = (content: string): readonly string[] =>
  content.split(/\r?\n/).flatMap((line) => line.match(/^###\s+(.+?)\s*#*\s*$/)?.[1] ?? [])

const subsectionContent = (content: string, heading: string): string | undefined => {
  const lines = content.split(/\r?\n/)
  const start = lines.findIndex((line) => line.match(new RegExp(`^###\\s+${heading}\\s*#*\\s*$`)))
  if (start === -1) return undefined

  const end = lines.findIndex((line, index) => index > start && /^#{1,3}\s+/.test(line))
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join('\n')
    .trim()
}

const validateSteps = (item: WorkItem): void => {
  const content = sectionContent(item.body, 'Steps')
  if (content === undefined) return
  const steps = content.split(/\r?\n/).filter((line) => line.trim())
  if (!steps.length || steps.some((step) => !/^- \[(?: |x)\] \S/.test(step))) {
    add('FAIL', 'ITEM-3', '## Steps must contain only task-list entries using - [ ] or - [x]', FORMAT, item.file)
    return
  }
  const hasUnchecked = steps.some((step) => step.startsWith('- [ ]'))
  if (['awaiting-review', 'done'].includes(item.status) && hasUnchecked)
    add('FAIL', 'ITEM-3', 'awaiting-review and done items must mark every Step as - [x]', FORMAT, item.file)
  if (['draft', 'ready'].includes(item.status) && !hasUnchecked)
    add('FAIL', 'ITEM-3', 'draft and ready items must retain at least one - [ ] Step', FORMAT, item.file)
}

const validateDocumentationImpact = (item: WorkItem): void => {
  const impact = sectionContent(item.body, 'Documentation impact')
  if (impact === undefined) return

  const sections = subsectionHeadings(impact)
  if (JSON.stringify(sections) !== JSON.stringify(DOCUMENTATION_IMPACT_SECTIONS)) {
    add(
      'FAIL',
      'EXEC-4',
      `## Documentation impact requires ${DOCUMENTATION_IMPACT_SECTIONS.map((heading) => `### ${heading}`).join(', ')}`,
      FORMAT,
      item.file
    )
    return
  }

  for (const heading of DOCUMENTATION_IMPACT_SECTIONS) {
    if (!subsectionContent(impact, heading)) {
      add('FAIL', 'EXEC-4', `### ${heading} documentation impact is non-empty`, FORMAT, item.file)
    }
  }
}

const validateBody = (item: WorkItem): void => {
  const present = headings(item.body)
  const required = requiredSections(item)
  if (item.terminalTriage || (item.status === 'cancelled' && item.baselineRef === null)) {
    const deliveryHeadings = present.filter((heading) =>
      [...EXECUTION_SECTIONS, 'Delegation', 'Review'].includes(heading)
    )
    if (deliveryHeadings.length && item.terminalTriage)
      tolerate(
        `terminal Triage must not contain delivery sections: ${deliveryHeadings.join(', ')}`,
        item.file,
        'ITEM-3'
      )
    else if (deliveryHeadings.length)
      add(
        'FAIL',
        'ITEM-3',
        `a record cancelled before it started must not contain delivery sections: ${deliveryHeadings.join(', ')}`,
        FORMAT,
        item.file
      )
  }
  const sequence = present.filter((heading) => required.includes(heading))
  if (JSON.stringify(sequence) !== JSON.stringify(required))
    add('FAIL', 'ITEM-3', `body must contain ${required.join(' → ')} in order`, FORMAT, item.file)
  if (!sectionContent(item.body, 'Goal')) add('FAIL', 'ITEM-3', '## Goal must be non-empty', FORMAT, item.file)
  if (item.terminalTriage && !sectionContent(item.body, 'Intake disposition'))
    tolerate('terminal Triage item requires a non-empty ## Intake disposition', item.file, 'ITEM-3')
  if (item.status === 'cancelled') {
    if (!sectionContent(item.body, 'Cancelled'))
      add('FAIL', 'ITEM-3', '## Cancelled must be non-empty', FORMAT, item.file)
    else if (present.at(-2) !== 'Cancelled')
      add('FAIL', 'ITEM-3', '## Cancelled must immediately precede ## Discussion', FORMAT, item.file)
  }
  if (present.at(-1) !== 'Discussion')
    add('FAIL', 'ITEM-3', '## Discussion must be the final top-level section', FORMAT, item.file)
  if (required.includes('Steps')) validateSteps(item)
  if (required.includes('Documentation impact')) validateDocumentationImpact(item)
  if (item.status === 'awaiting-review' || item.status === 'done') {
    const review = sectionContent(item.body, 'Review')
    if (review && JSON.stringify(subsectionHeadings(review)) !== JSON.stringify(REVIEW_SECTIONS))
      add('FAIL', 'ITEM-3', `## Review must contain ${REVIEW_SECTIONS.join(' → ')} in order`, FORMAT, item.file)
  }
}

/** Residual pre-v1 shapes that still only warn; see the standard's closed migration window. */
const tolerate = (msg: string, file?: string, area = 'ITEM-2', ref = FORMAT): void =>
  add('WARN', area, `legacy: ${msg}`, ref, file)

/** Retired pre-v1 shapes (KI-HARNESS-GOV-150): the migration window has closed, so each one fails. */
const retire = (msg: string, file?: string, area = 'ITEM-2', ref = FORMAT): void =>
  add('FAIL', area, `retired: ${msg}`, ref, file)

const validateHorizon = (
  status: string | undefined,
  horizon: string | undefined,
  legacy: boolean,
  display: string
): void => {
  if (!status || !STATUS.has(status)) return
  if (horizon === undefined) {
    if (OPEN_STATUSES.has(status)) add('FAIL', 'ITEM-2', `${status} record must declare a horizon`, FORMAT, display)
    return
  }
  if (legacy) {
    retire(
      `horizon '${horizon}'; use ${horizon === 'triage' ? 'status triage without a horizon' : 'horizon hold with a hold mapping'}`,
      display
    )
    if (horizon === 'triage' && status !== 'draft' && status !== 'done')
      add('FAIL', 'ITEM-2', 'open Triage item must remain draft until adopted', FORMAT, display)
    else if (horizon !== 'triage' && status !== 'draft')
      add('FAIL', 'ITEM-2', 'non-draft item must be in now or next', FORMAT, display)
    return
  }
  if (!(HORIZONS as readonly string[]).includes(horizon)) return
  if (status === 'done') {
    if (IMMEDIATE.has(horizon)) tolerate('a done record no longer carries a horizon', display)
    else add('FAIL', 'ITEM-2', 'a done record carries no horizon', FORMAT, display)
    return
  }
  if (status === 'triage' || status === 'cancelled') {
    add('FAIL', 'ITEM-2', `a ${status} record carries no horizon`, FORMAT, display)
    return
  }
  const allowed = HORIZONS_BY_STATUS[status] ?? []
  if (allowed.includes(horizon)) return
  if (horizon === 'next') tolerate(`${status} at next is retired; move it to now or hold`, display)
  else add('FAIL', 'ITEM-2', `${status} record must sit at ${allowed.join(', ')}`, FORMAT, display)
}

const isoDate = (value: unknown): boolean => {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : value
  return typeof text === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(text))
}

const validateHold = (
  values: Record<string, unknown>,
  status: string | undefined,
  horizon: string | undefined,
  updatedAt: string | undefined,
  display: string
): void => {
  if (horizon !== 'hold') {
    if ('hold' in values) add('FAIL', 'ITEM-2', 'hold is valid only at horizon hold', FORMAT, display)
    return
  }
  const hold = values.hold
  if (hold === HOLD_PARSE_ERROR) return
  if (!hold || typeof hold !== 'object' || Array.isArray(hold)) {
    add('FAIL', 'ITEM-2', 'horizon hold requires a hold mapping with reason and condition', FORMAT, display)
    return
  }
  const fields = hold as Record<string, unknown>
  const unexpected = Object.keys(fields).filter((key) => !HOLD_FIELDS.has(key))
  if (unexpected.length)
    add('FAIL', 'ITEM-2', `hold has unexpected field(s): ${unexpected.join(', ')}`, FORMAT, display)
  if (typeof fields.reason !== 'string' || !HOLD_REASONS.has(fields.reason))
    add('FAIL', 'ITEM-2', 'hold.reason must be waiting-for or parked', FORMAT, display)
  if (typeof fields.condition !== 'string' || !fields.condition.trim())
    add('FAIL', 'ITEM-2', 'hold.condition must name the release condition', FORMAT, display)
  if ('review' in fields && !isoDate(fields.review))
    add('FAIL', 'ITEM-2', 'hold.review must be an ISO date', FORMAT, display)
  if ('trades' in fields) {
    const trades = fields.trades
    if (!Array.isArray(trades) || !trades.length)
      add('FAIL', 'TRADE-2', 'hold.trades must be a non-empty list', FORMAT, display)
    else {
      if (trades.some((trade) => typeof trade !== 'string' || !TRADE_RE.test(trade)))
        add('FAIL', 'TRADE-2', 'hold.trades must contain only canonical trade identities', FORMAT, display)
      if (new Set(trades).size !== trades.length)
        add('FAIL', 'TRADE-2', 'hold.trades must not repeat a trade identity', FORMAT, display)
    }
  }
  if (
    status === 'in-progress' &&
    updatedAt &&
    canonicalTimestamp(updatedAt) &&
    Date.now() - Date.parse(updatedAt) > HOLD_STALE_DAYS * 86_400_000
  )
    add(
      'WARN',
      'ITEM-2',
      `in-progress hold has not been updated for over ${HOLD_STALE_DAYS} days; review its release condition`,
      FORMAT,
      display
    )
}

const validateResolution = (
  values: Record<string, unknown>,
  id: string | undefined,
  status: string | undefined,
  resolution: string | undefined,
  target: string | undefined,
  display: string
): void => {
  if (status === 'cancelled') {
    if (!resolution) add('FAIL', 'ITEM-2', 'cancelled record requires a resolution', FORMAT, display)
    else if (!RESOLUTIONS.has(resolution))
      add('FAIL', 'ITEM-2', 'resolution must be one canonical value', FORMAT, display)
  } else if ('resolution' in values)
    add('FAIL', 'ITEM-2', 'resolution is valid only on a cancelled record', FORMAT, display)
  if (resolution && TARGETED_RESOLUTIONS.has(resolution)) {
    if (!target?.trim()) add('FAIL', 'ITEM-2', `${resolution} resolution requires resolution_target`, FORMAT, display)
    else if (!ID_RE.test(target))
      add('FAIL', 'ITEM-2', 'resolution_target must be a canonical work-item ID', FORMAT, display)
    else if (target === id)
      add('FAIL', 'ITEM-2', 'resolution_target must differ from the cancelled record', FORMAT, display)
  } else if ('resolution_target' in values)
    add(
      'FAIL',
      'ITEM-2',
      'resolution_target is valid only for a duplicate, merged or superseded resolution',
      FORMAT,
      display
    )
}

const validateLegacyIntake = (
  values: Record<string, unknown>,
  id: string | undefined,
  terminalTriage: boolean,
  disposition: string | undefined,
  target: string | undefined,
  display: string
): void => {
  const hasTarget = 'intake_disposition_target' in values
  if ('intake_disposition' in values || hasTarget)
    retire('intake_disposition fields; cancel the record with a resolution', display)
  if (!terminalTriage) return
  if (!disposition || !INTAKE_DISPOSITIONS.has(disposition))
    tolerate('terminal Triage intake_disposition must be rejected, duplicate, or merged', display)
  if (disposition === 'rejected' && hasTarget)
    tolerate('rejected Triage disposition must not name intake_disposition_target', display)
  else if ((disposition === 'duplicate' || disposition === 'merged') && (!hasTarget || !target?.trim()))
    tolerate(`${disposition} Triage disposition requires intake_disposition_target`, display)
  else if ((disposition === 'duplicate' || disposition === 'merged') && target && !ID_RE.test(target))
    tolerate('intake_disposition_target must be a canonical work-item ID', display)
  else if ((disposition === 'duplicate' || disposition === 'merged') && target === id)
    tolerate('intake_disposition_target must differ from the disposed item', display)
}

const parseItem = (repository: string, name: string, configuration?: RoadmapConfiguration): WorkItem | undefined => {
  const directory = join(repository, 'docs', 'roadmap')
  const absolute = join(directory, name)
  const display = relative(repository, absolute)
  const file = FILE_RE.exec(name)
  if (!file) {
    add('FAIL', 'ITEM-1', 'work-item filename must be <id>-<slug>.md', FORMAT, display)
    return undefined
  }
  if (lstatSync(absolute).isSymbolicLink()) {
    add('FAIL', 'SAFE-1', 'work item must not be a symlink', STANDARD, display)
    return undefined
  }
  const parsed = parseFrontmatter(readFileSync(absolute, 'utf8'), display)
  if (!parsed) return undefined
  const value = (key: string): string | undefined =>
    typeof parsed.values[key] === 'string' ? (parsed.values[key] as string) : undefined
  const id = value('id')
  const area = value('area')
  const title = value('title')
  const theme = value('theme')
  const horizon = value('horizon') as Horizon | undefined
  const status = value('status')
  const kind = value('kind')
  const purpose = value('purpose')
  const project = value('project')
  const initiative = value('initiative')
  const component = value('component')
  const resolution = value('resolution')
  const resolutionTarget = value('resolution_target')
  const blocks = Array.isArray(parsed.values.blocks) ? (parsed.values.blocks as string[]) : undefined
  const blockedBy = Array.isArray(parsed.values.blocked_by) ? (parsed.values.blocked_by as string[]) : undefined
  const waitingOnTrades = Array.isArray(parsed.values.waiting_on_trades)
    ? (parsed.values.waiting_on_trades as string[])
    : undefined
  const baselineRef = parsed.values.baseline_ref
  const intakeDisposition = value('intake_disposition')
  const intakeDispositionTarget = value('intake_disposition_target')
  const createdAt = value('created_at')
  const updatedAt = value('updated_at')
  for (const key of ['id', 'title', 'status', 'blocks', 'blocked_by', 'baseline_ref', 'created_at', 'updated_at']) {
    if (!(key in parsed.values)) add('FAIL', 'ITEM-1', `frontmatter is missing '${key}'`, FORMAT, display)
  }
  const unexpected = Object.keys(parsed.values).filter((key) => !RECORD_FIELDS.has(key))
  if (unexpected.length)
    add('FAIL', 'ITEM-1', `frontmatter has unexpected field(s): ${unexpected.join(', ')}`, FORMAT, display)
  if ('task_links' in parsed.values) {
    validateTaskLinks(parsed.values.task_links, display)
  }
  if (!id || id !== file[1] || !ID_RE.test(id))
    add('FAIL', 'ITEM-1', 'frontmatter id must match the filename identifier', FORMAT, display)
  if (!title?.trim()) add('FAIL', 'ITEM-1', 'title must be non-empty', FORMAT, display)
  else if (title.trim().split(/\s+/).length > MAX_TITLE_WORDS)
    add('FAIL', 'ITEM-1', `title must contain at most ${MAX_TITLE_WORDS} words`, FORMAT, display)
  const configuredArea = configuration && area && configuration.areas.has(area) ? area : undefined
  const issueNumber =
    configuration && id
      ? id.slice(`${configuration.repoCode}${configuration.areas.size ? `-${area ?? ''}` : ''}-`.length)
      : undefined
  const expectedPrefix = configuration?.areas.size
    ? `${configuration.repoCode}-${configuredArea ?? ''}-`
    : `${configuration?.repoCode ?? ''}-`
  if (
    !configuration ||
    !id?.startsWith(expectedPrefix) ||
    !issueNumber ||
    !/^\d{3,}$/.test(issueNumber) ||
    (configuration.areas.size > 0 && (!area || !configuredArea)) ||
    (configuration.areas.size === 0 && area !== undefined)
  )
    add(
      'FAIL',
      'ITEM-1',
      'item identifier must use configured repository code, optional configured area code, and zero-padded issue number',
      FORMAT,
      display
    )
  if (!status || !STATUS.has(status)) add('FAIL', 'ITEM-2', 'status must be one lifecycle value', FORMAT, display)
  if (!blocks || !blockedBy) add('FAIL', 'ITEM-2', 'blocks and blocked_by must be arrays', FORMAT, display)
  const legacyHorizon = horizon !== undefined && (LEGACY_HORIZONS as readonly string[]).includes(horizon)
  const terminalTriage = horizon === 'triage' && status === 'done'
  if (horizon !== undefined && !legacyHorizon && !(HORIZONS as readonly string[]).includes(horizon))
    add('FAIL', 'ITEM-2', 'horizon must be one canonical value', FORMAT, display)
  validateHorizon(status, horizon, legacyHorizon, display)
  validateHold(parsed.values, status, horizon, updatedAt, display)
  validateResolution(parsed.values, id, status, resolution, resolutionTarget, display)
  if (kind !== undefined && !KINDS.has(kind)) add('FAIL', 'ITEM-2', 'kind must be one canonical value', FORMAT, display)
  if (purpose !== undefined && !PURPOSES.has(purpose))
    add('FAIL', 'ITEM-2', 'purpose must be one canonical value', FORMAT, display)
  for (const [key, slug] of [
    ['project', project],
    ['initiative', initiative],
    ['component', component]
  ] as const)
    if (key in parsed.values && (!slug || !(key === 'component' ? SLUG_RE.test(slug) : parseRegistryReference(slug))))
      add(
        'FAIL',
        'ITEM-2',
        key === 'component'
          ? `${key} must be a lowercase kebab-case slug`
          : `${key} must be a lowercase kebab-case slug, optionally qualified as <territory>/<slug>`,
        FORMAT,
        display
      )
  if (component && SLUG_RE.test(component) && !configuration?.components.has(component))
    add('FAIL', 'ITEM-2', `component '${component}' must be declared in ki-work-roadmap components`, STANDARD, display)
  if (kind === undefined && status && OPEN_STATUSES.has(status) && !legacyHorizon)
    tolerate('an adopted record should declare kind', display)
  if ('theme' in parsed.values) retire('theme; classify with project, initiative or component', display)
  validateLegacyIntake(parsed.values, id, terminalTriage, intakeDisposition, intakeDispositionTarget, display)
  if ('waiting_on_trades' in parsed.values)
    retire('waiting_on_trades; name the trades in hold.trades', display, 'TRADE-2')
  if (baselineRef !== null && (typeof baselineRef !== 'string' || !COMMIT_RE.test(baselineRef)))
    add('FAIL', 'ITEM-2', 'baseline_ref must be null or a full lowercase commit ID', FORMAT, display)
  if ((createdAt === undefined) !== (updatedAt === undefined))
    add('FAIL', 'ITEM-2', 'created_at and updated_at must be present together', FORMAT, display)
  if (createdAt !== undefined && updatedAt !== undefined) {
    if (!canonicalTimestamp(createdAt) || !canonicalTimestamp(updatedAt))
      add('FAIL', 'ITEM-2', 'timestamps must use canonical RFC 3339 UTC second precision', FORMAT, display)
    else if (Date.parse(createdAt) > Date.parse(updatedAt))
      add('FAIL', 'ITEM-2', 'created_at must not be later than updated_at', FORMAT, display)
  }
  if (terminalTriage && baselineRef !== null) tolerate('terminal Triage item baseline_ref must remain null', display)
  if ((status === 'draft' || status === 'triage') && baselineRef !== null)
    add('FAIL', 'ITEM-2', `${status} item baseline_ref must be null`, FORMAT, display)
  if (
    status &&
    ['in-progress', 'awaiting-review', 'done'].includes(status) &&
    !terminalTriage &&
    (typeof baselineRef !== 'string' || !COMMIT_RE.test(baselineRef))
  )
    add('FAIL', 'ITEM-2', 'executing or completed item needs an immutable baseline_ref', FORMAT, display)
  const serial = Number.parseInt(id?.split('-').at(-1) ?? '', 10)
  if (!id || !title || !status || !blocks || !blockedBy || !Number.isSafeInteger(serial)) return undefined
  const item: WorkItem = {
    id,
    area: area ?? null,
    serial,
    title,
    theme: theme ?? null,
    horizon: horizon ?? null,
    status,
    kind,
    purpose,
    project,
    initiative,
    component,
    resolution,
    resolutionTarget,
    terminalTriage,
    blocks,
    blockedBy,
    waitingOnTrades: waitingOnTrades ?? [],
    baselineRef: baselineRef as string | null,
    intakeDisposition,
    intakeDispositionTarget,
    createdAt,
    updatedAt,
    file: display,
    body: parsed.body
  }
  validateBody(item)
  return item
}

export const workItemsFor = (repository: string, configuration?: RoadmapConfiguration): readonly WorkItem[] => {
  const root = resolve(repository)
  const directory = join(root, 'docs', 'roadmap')
  if (!existsSync(directory) || !lstatSync(directory).isDirectory()) return []
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && !NON_RECORDS.has(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => [parseItem(root, entry.name, configuration)].filter((item): item is WorkItem => Boolean(item)))
}

const validateDependencies = (items: readonly WorkItem[], configuration?: RoadmapConfiguration): void => {
  const byId = new Map(items.map((item) => [item.id, item]))
  for (const item of items) {
    if (
      (item.intakeDisposition === 'duplicate' || item.intakeDisposition === 'merged') &&
      item.intakeDispositionTarget &&
      ID_RE.test(item.intakeDispositionTarget) &&
      item.intakeDispositionTarget !== item.id &&
      !byId.has(item.intakeDispositionTarget)
    )
      tolerate(
        `intake_disposition_target '${item.intakeDispositionTarget}' does not resolve to a retained work item`,
        item.file
      )
    if (
      item.resolutionTarget &&
      ID_RE.test(item.resolutionTarget) &&
      item.resolutionTarget !== item.id &&
      configuration &&
      item.resolutionTarget.startsWith(`${configuration.repoCode}-`) &&
      !byId.has(item.resolutionTarget)
    )
      add(
        'WARN',
        'ITEM-2',
        `resolution_target '${item.resolutionTarget}' does not resolve to a retained work item; cite its revision in ## Cancelled`,
        FORMAT,
        item.file
      )
    for (const id of [...item.blocks, ...item.blockedBy])
      if (!byId.has(id)) add('FAIL', 'ITEM-5', `dependency '${id}' does not exist`, FORMAT, item.file)
    for (const id of item.blocks)
      if (!byId.get(id)?.blockedBy.includes(item.id))
        add('FAIL', 'ITEM-5', `blocks '${id}' is not reciprocal`, FORMAT, item.file)
    for (const id of item.blockedBy)
      if (!byId.get(id)?.blocks.includes(item.id))
        add('FAIL', 'ITEM-5', `blocked_by '${id}' is not reciprocal`, FORMAT, item.file)
    if (
      ['ready', 'in-progress', 'awaiting-review'].includes(item.status) &&
      item.blockedBy.some((id) => byId.get(id)?.status !== 'done')
    )
      add('FAIL', 'ITEM-5', 'active item has a non-done blocker', FORMAT, item.file)
  }
}

/**
 * Project and initiative membership: unresolvable references warn; only a contradicted initiative fails. A bare slug
 * resolves in the repository's own Capital territory; `<territory>/<slug>` resolves in the named territory's registry.
 */
const validateClassification = (repository: string, items: readonly WorkItem[]): void => {
  const classified = items.filter((item) => item.project || item.initiative)
  if (!classified.length) return
  const lookups = new Map<string, RegistryLookup>()
  const registryFor = (territory: string | undefined): ProjectRegistry | undefined => {
    const key = territory ?? ''
    if (!lookups.has(key)) {
      const lookup = territory === undefined ? loadProjectRegistry(repository) : loadTerritoryRegistry(territory)
      lookups.set(key, lookup)
      if (!('unavailable' in lookup)) {
        if (territory === undefined && lookup.registry.legacyInitiativesIndex)
          tolerate(
            'Streams/Projects/Initiatives.md is retired; keep one note per Initiative in Streams/Initiatives/',
            undefined,
            'ITEM-2',
            STANDARD
          )
      } else if (territory === undefined)
        add('WARN', 'ITEM-2', `project registry is unavailable: ${lookup.unavailable}`, STANDARD)
      else add('WARN', 'ITEM-2', `territory '${territory}' registry is unavailable: ${lookup.unavailable}`, STANDARD)
    }
    const lookup = lookups.get(key)
    return lookup && 'registry' in lookup ? lookup.registry : undefined
  }
  for (const item of classified) {
    const project = item.project ? parseRegistryReference(item.project) : undefined
    const initiative = item.initiative ? parseRegistryReference(item.initiative) : undefined
    const projectRegistry = project && registryFor(project.territory)
    const initiativeRegistry = initiative && registryFor(initiative.territory)
    if (project && projectRegistry && !projectRegistry.projects.has(project.slug))
      add('WARN', 'ITEM-2', `project '${item.project}' is not in the project registry`, STANDARD, item.file)
    if (initiative && initiativeRegistry && !initiativeRegistry.initiatives.has(initiative.slug))
      add('WARN', 'ITEM-2', `initiative '${item.initiative}' is not in the project registry`, STANDARD, item.file)
    if (!project || !initiative || !projectRegistry?.projects.has(project.slug) || !initiativeRegistry) continue
    const registered = projectRegistry.projects.get(project.slug)
    if (registered && (registered !== initiative.slug || projectRegistry.root !== initiativeRegistry.root))
      add(
        'FAIL',
        'ITEM-2',
        `initiative '${item.initiative}' contradicts project '${item.project}', which serves '${project.territory ? `${project.territory}/` : ''}${registered}'`,
        STANDARD,
        item.file
      )
    else add('WARN', 'ITEM-2', 'initiative is redundant beside a registered project', STANDARD, item.file)
  }
  const members = new Map<string, WorkItem[]>()
  for (const item of items) if (item.project) members.set(item.project, [...(members.get(item.project) ?? []), item])
  for (const [project, records] of members)
    if (records.every((item) => TERMINAL_STATUSES.has(item.status)))
      add(
        'INFO',
        'ITEM-2',
        `project '${project}' has no open records here; completing it remains a human decision`,
        STANDARD
      )
}

export const rootRoadmap = (): string =>
  '# Repository roadmap\n\nThis repository manages forward work as canonical structured Markdown work items under [`docs/roadmap/`](docs/roadmap/).\n\nUse `ki` to audit and report these items; `ROADMAP.md` deliberately does not duplicate their queue.\n'

type LedgerAllocation = number | ReadonlyMap<string, number>
type LedgerBody = (allocation: LedgerAllocation) => string

const ledgerAreas = (allocation: ReadonlyMap<string, number>) => {
  const areas = [...allocation.entries()].sort(([left], [right]) => left.localeCompare(right))
  const values = areas.map(([area, lastId]) => `${area}: ${lastId}`).join(', ')
  const detail = areas
    .map(([area, lastId]) => `- \`${area}\` reserves through \`${lastId.toString().padStart(3, '0')}\`.`)
    .join('\n')
  return { values, detail }
}

// The ledger body before KI-HARNESS-GOV-105 added the commit-before-record ordering sentence.
const ledgerBodyAllocateOnly: LedgerBody = (allocation) => {
  if (typeof allocation === 'number')
    return `---\nlast_id: ${allocation}\n---\n\n# Roadmap issue ledger\n\nThis ledger reserves every repository-scoped roadmap issue number through \`${allocation.toString().padStart(3, '0')}\`. Allocate the next work item as one greater than \`last_id\`; never lower this value or reuse an issued number after a record is pruned.\n`
  const { values, detail } = ledgerAreas(allocation)
  return `---\nareas: { ${values} }\n---\n\n# Roadmap issue ledger\n\nThis ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.\n\n${detail}\n`
}

const RESERVATION_ORDER = "Reserve a number by committing this ledger's advance on its own before writing the record."

const ledgerBodyCommitFirst: LedgerBody = (allocation) => {
  if (typeof allocation === 'number')
    return `---\nlast_id: ${allocation}\n---\n\n# Roadmap issue ledger\n\nThis ledger reserves every repository-scoped roadmap issue number through \`${allocation.toString().padStart(3, '0')}\`. Allocate the next work item as one greater than \`last_id\`; never lower this value or reuse an issued number after a record is pruned. ${RESERVATION_ORDER}\n`
  const { values, detail } = ledgerAreas(allocation)
  return `---\nareas: { ${values} }\n---\n\n# Roadmap issue ledger\n\nThis ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. ${RESERVATION_ORDER} Areas are not mutable themes or groups.\n\n${detail}\n`
}

export const issueLedger: LedgerBody = ledgerBodyCommitFirst

/**
 * Earlier canonical ledger bodies. CONFORM may rewrite a ledger
 * matching one of these exactly to `issueLedger()`; any other text stays
 * unrecognised. The canonical body is always matched first.
 */
const SUPERSEDED_LEDGER_BODIES: readonly LedgerBody[] = [ledgerBodyAllocateOnly]

export type LedgerForm = 'canonical' | 'superseded'

const parseLedgerAllocation = (text: string): LedgerAllocation | undefined => {
  const matched = text.match(/^---\r?\nlast_id:\s*(\d+)\s*\r?\n---\r?\n/)
  if (matched) {
    const lastId = Number.parseInt(matched[1], 10)
    return Number.isSafeInteger(lastId) && lastId >= 0 ? lastId : undefined
  }
  const areaMatch = text.match(/^---\r?\nareas:\s*\{\s*(.*?)\s*}\s*\r?\n---\r?\n/)
  if (!areaMatch) return undefined
  const allocation = new Map<string, number>()
  for (const entry of areaMatch[1].split(',')) {
    const pair = entry.trim().match(/^([A-Z][A-Z0-9]*):\s*(\d+)$/)
    if (!pair || allocation.has(pair[1])) return undefined
    const lastId = Number.parseInt(pair[2], 10)
    if (!Number.isSafeInteger(lastId) || lastId < 0) return undefined
    allocation.set(pair[1], lastId)
  }
  return allocation.size ? allocation : undefined
}

export const ledgerAllocation = (
  text: string
): { readonly allocation: LedgerAllocation; readonly form: LedgerForm } | undefined => {
  const allocation = parseLedgerAllocation(text)
  if (allocation === undefined) return undefined
  if (text === issueLedger(allocation)) return { allocation, form: 'canonical' }
  if (SUPERSEDED_LEDGER_BODIES.some((body) => text === body(allocation))) return { allocation, form: 'superseded' }
  return undefined
}

export const inspectRoadmap = (repository: string): readonly Finding[] => {
  findings = []
  const root = resolve(repository)
  const roadmap = join(root, 'docs', 'roadmap')
  const rootIndexPath = join(root, 'ROADMAP.md')
  if (isKb(root)) {
    if (existsSync(roadmap) || existsSync(rootIndexPath))
      add(
        'FAIL',
        'SCOPE-1',
        'KB repository must use ki-repo-kb-streams instead of repository roadmap artefacts',
        STANDARD
      )
    else add('NA', 'SCOPE-1', 'KB repository: repository-roadmap standard does not apply', STANDARD)
    return findings
  }
  const configuration = roadmapConfiguration(root)
  if (!existsSync(roadmap) || !lstatSync(roadmap).isDirectory()) {
    add('FAIL', 'ROAD-1', 'non-KB repository requires docs/roadmap/ as a directory', STANDARD)
    return findings
  }
  const names = readdirSync(roadmap, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of names) {
    const display = relative(root, join(roadmap, entry.name))
    if (!entry.isFile()) {
      add('FAIL', 'ROAD-1', 'docs/roadmap contains only regular work-item files', STANDARD, display)
    }
  }
  const items = workItemsFor(root, configuration)
  const ids = new Set<string>()
  for (const item of items) {
    if (ids.has(item.id)) add('FAIL', 'ITEM-1', `duplicate work-item id '${item.id}'`, FORMAT, item.file)
    ids.add(item.id)
  }
  validateDependencies(items, configuration)
  validateClassification(root, items)
  const ledgerPath = join(roadmap, ISSUE_LEDGER)
  if (!existsSync(ledgerPath) || lstatSync(ledgerPath).isSymbolicLink() || !lstatSync(ledgerPath).isFile())
    add(
      'FAIL',
      'ROAD-7',
      `docs/roadmap/${ISSUE_LEDGER} must be a regular issue-allocation ledger`,
      STANDARD,
      `docs/roadmap/${ISSUE_LEDGER}`
    )
  else {
    const ledger = ledgerAllocation(readFileSync(ledgerPath, 'utf8'))
    const allocation = ledger?.allocation
    if (ledger?.form === 'superseded')
      add(
        'WARN',
        'ROAD-7',
        'ledger body uses a superseded canonical form; run conform',
        STANDARD,
        `docs/roadmap/${ISSUE_LEDGER}`
      )
    if (allocation === undefined)
      add(
        'FAIL',
        'ROAD-7',
        `docs/roadmap/${ISSUE_LEDGER} must use the canonical immutable ledger shape`,
        STANDARD,
        `docs/roadmap/${ISSUE_LEDGER}`
      )
    else if (configuration?.areas.size) {
      if (
        typeof allocation === 'number' ||
        [...configuration.areas.keys()].some((area) => !allocation.has(area)) ||
        [...allocation.keys()].some((area) => !configuration.areas.has(area))
      )
        add(
          'FAIL',
          'ROAD-7',
          'issue ledger areas must exactly match configured issuing areas',
          STANDARD,
          `docs/roadmap/${ISSUE_LEDGER}`
        )
      else {
        for (const area of configuration.areas.keys()) {
          const highest = Math.max(0, ...items.filter((item) => item.area === area).map((item) => item.serial))
          const lastId = allocation.get(area) ?? 0
          if (lastId < highest)
            add(
              'FAIL',
              'ROAD-7',
              `issue ledger area ${area} high-water ${lastId} is below retained issue ${highest}`,
              STANDARD,
              `docs/roadmap/${ISSUE_LEDGER}`
            )
        }
      }
    } else {
      const highest = Math.max(0, ...items.map((item) => item.serial))
      if (typeof allocation !== 'number')
        add(
          'FAIL',
          'ROAD-7',
          'repository-scoped roadmap ledger must use last_id',
          STANDARD,
          `docs/roadmap/${ISSUE_LEDGER}`
        )
      else if (allocation < highest)
        add(
          'FAIL',
          'ROAD-7',
          `issue ledger last_id ${allocation} is below retained issue ${highest}`,
          STANDARD,
          `docs/roadmap/${ISSUE_LEDGER}`
        )
    }
  }
  if (!existsSync(rootIndexPath) || lstatSync(rootIndexPath).isSymbolicLink())
    add('FAIL', 'ROOT-1', 'root ROADMAP.md must be a regular work-item orientation', STANDARD, 'ROADMAP.md')
  else if (readFileSync(rootIndexPath, 'utf8') !== rootRoadmap())
    add('FAIL', 'ROOT-1', 'root ROADMAP.md must be the canonical work-item orientation', STANDARD, 'ROADMAP.md')
  return findings
}
