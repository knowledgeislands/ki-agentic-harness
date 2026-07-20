import {
  type AuditOutcome,
  type ConformOutcome,
  OUTCOME_STATUSES,
  RUBRIC_PHASES,
  type RubricDefinition,
  type RubricItem,
  type RubricMode,
  type RubricPhase,
  type RubricRepairOutcome,
  VIOLATION_LEVELS,
  type ViolationLevel,
  validateRubricCatalogue
} from './rubric.ts'

export const CHECKER_LEVELS = ['FAIL', 'WARN', 'FIXED', 'INFO', 'NOT_APPLICABLE', 'PASS'] as const
export type CheckerLevel = (typeof CHECKER_LEVELS)[number]

export type CheckerEvaluationSubject<RootContext> = {
  familyCodes: readonly string[]
  context: () => RootContext
  subject?: string
}

export type CheckerStatusEvent =
  | {
      type: 'start'
      mode: RubricMode
      completed: 0
      total: number
    }
  | {
      type: 'item-complete'
      mode: RubricMode
      completed: number
      total: number
      code: string
      title: string
      phase: RubricPhase
      subject?: string
    }
  | {
      type: 'complete'
      mode: RubricMode
      completed: number
      total: number
    }
  | {
      type: 'failed'
      mode: RubricMode
      completed: number
      total: number
    }

export type CheckerStatusTracker = (event: CheckerStatusEvent) => void

export type CheckerInput<RootContext> = {
  mode: RubricMode
  concern: string
  target: string
  rubric: RubricDefinition<RootContext>
  subjects: readonly CheckerEvaluationSubject<RootContext>[]
  statusTracker?: CheckerStatusTracker
}

export type CheckerRunIdentity = {
  version: 1
  runId: string
  mode: RubricMode
  concern: string
  target: string
  generatedAt: string
}

export type CheckerMetaRecord = CheckerRunIdentity & {
  record: 'meta'
}

export type CheckerFinding = {
  level: CheckerLevel
  code: string
  title: string
  message: string
  subject?: string
}

export type CheckerFindingRecord = CheckerRunIdentity &
  CheckerFinding & {
    record: 'finding'
  }

export type CheckerSummary = {
  fail: number
  warn: number
  fixed: number
  info: number
  notApplicable: number
  pass: number
  judgment: {
    unevaluated: number
  }
}

export type CheckerSummaryRecord = CheckerRunIdentity & {
  record: 'summary'
  summary: CheckerSummary
}

export type CheckerRecord = CheckerMetaRecord | CheckerFindingRecord | CheckerSummaryRecord

export type CheckerResult = {
  records: readonly CheckerRecord[]
  findings: readonly CheckerFinding[]
  summary: CheckerSummary
  exitCode: 0 | 1
}

export type CheckerParseResult = {
  records: readonly unknown[]
  errors: readonly string[]
}

type UnknownRecord = Record<string, unknown>
type ExecutionOutcome = AuditOutcome | ConformOutcome

type ErasedExecution = {
  phase: RubricPhase
  mode: RubricMode
  run: (context: unknown) => unknown
}

type PlannedItem<RootContext> = {
  phase: RubricPhase
  subjectIndex: number
  familyIndex: number
  itemIndex: number
  subject: CheckerEvaluationSubject<RootContext>
  selectContext: (root: RootContext) => unknown
  item: RubricItem<never>
  audit: ErasedExecution
  repair?: {
    phase: RubricPhase
    run: (context: unknown) => unknown
    repairOn: ReadonlySet<'VIOLATION' | 'INFO'>
  }
  legacyConform?: ErasedExecution
}

const LEVEL_SUMMARY_KEYS = {
  FAIL: 'fail',
  WARN: 'warn',
  FIXED: 'fixed',
  INFO: 'info',
  NOT_APPLICABLE: 'notApplicable',
  PASS: 'pass'
} as const satisfies Record<CheckerLevel, keyof Omit<CheckerSummary, 'judgment'>>

const RUN_KEYS = ['version', 'runId', 'record', 'mode', 'concern', 'target', 'generatedAt'] as const
const FINDING_KEYS = [...RUN_KEYS, 'level', 'code', 'title', 'message', 'subject'] as const
const SUMMARY_KEYS = [...RUN_KEYS, 'summary'] as const
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isRecord = (value: unknown): value is UnknownRecord => typeof value === 'object' && value !== null && !Array.isArray(value)
const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const isRubricPhase = (value: unknown): value is RubricPhase => typeof value === 'string' && RUBRIC_PHASES.includes(value as RubricPhase)
const isViolationLevel = (value: unknown): value is ViolationLevel =>
  typeof value === 'string' && VIOLATION_LEVELS.includes(value as ViolationLevel)

const emptySummary = (unevaluated: number): CheckerSummary => ({
  fail: 0,
  warn: 0,
  fixed: 0,
  info: 0,
  notApplicable: 0,
  pass: 0,
  judgment: { unevaluated }
})

const selectedFamilyCodes = <RootContext>(subjects: readonly CheckerEvaluationSubject<RootContext>[]): ReadonlySet<string> =>
  new Set(subjects.flatMap((subject) => subject.familyCodes))

const selectedJudgmentCount = <RootContext>(
  rubric: RubricDefinition<RootContext>,
  subjects: readonly CheckerEvaluationSubject<RootContext>[]
): number => {
  const familyCodes = selectedFamilyCodes(subjects)
  const itemCodes = new Set<string>()
  for (const family of rubric.families)
    if (familyCodes.has(family.code)) for (const item of family.items) if (item.judgment) itemCodes.add(item.code)
  return itemCodes.size
}

const planItems = <RootContext>(input: CheckerInput<RootContext>): PlannedItem<RootContext>[] => {
  const catalogueIssues = validateRubricCatalogue(input.rubric)
  if (catalogueIssues.length > 0)
    throw new Error(`invalid rubric catalogue: ${catalogueIssues.map((issue) => `${issue.path} ${issue.message}`).join('; ')}`)

  const knownFamilyCodes = new Set(input.rubric.families.map((family) => family.code))
  const planned: PlannedItem<RootContext>[] = []

  for (const [subjectIndex, subject] of input.subjects.entries()) {
    if (subject.subject !== undefined && !isNonEmptyString(subject.subject))
      throw new Error(`checker subject ${subjectIndex + 1} must be non-empty when present`)
    for (const familyCode of subject.familyCodes)
      if (!knownFamilyCodes.has(familyCode)) throw new Error(`checker subject selects unknown rubric family: ${familyCode}`)

    const requested = new Set(subject.familyCodes)
    for (const [familyIndex, family] of input.rubric.families.entries()) {
      if (!requested.has(family.code)) continue
      for (const [itemIndex, item] of family.items.entries()) {
        if (!item.mechanical) continue
        const audit = item.mechanical.audit
        if (!isRubricPhase(audit.phase)) throw new Error(`rubric execution has unknown phase: ${item.code}`)
        const repair = item.mechanical.repair
        const legacyConform = item.mechanical.conform
        if (repair && !isRubricPhase(repair.phase)) throw new Error(`rubric repair has unknown phase: ${item.code}`)
        if (legacyConform && !isRubricPhase(legacyConform.phase)) throw new Error(`rubric execution has unknown phase: ${item.code}`)
        // Families have heterogeneous contexts. Erasure is confined to the plan;
        // each family still creates the context consumed by its own typed item.
        planned.push({
          phase:
            input.mode === 'conform' && repair
              ? repair.phase
              : input.mode === 'conform' && legacyConform
                ? legacyConform.phase
                : audit.phase,
          subjectIndex,
          familyIndex,
          itemIndex,
          subject,
          selectContext: family.selectContext,
          item,
          audit: { phase: audit.phase, mode: 'audit', run: audit.run as (context: unknown) => unknown },
          ...(repair
            ? {
                repair: {
                  phase: repair.phase,
                  run: repair.run as (context: unknown) => unknown,
                  repairOn: new Set(['VIOLATION', ...(item.mechanical.repairOn ?? [])])
                }
              }
            : {}),
          ...(legacyConform
            ? {
                legacyConform: {
                  phase: legacyConform.phase,
                  mode: 'conform' as const,
                  run: legacyConform.run as (context: unknown) => unknown
                }
              }
            : {})
        })
      }
    }
  }

  return planned.sort(
    (left, right) =>
      RUBRIC_PHASES.indexOf(left.phase) - RUBRIC_PHASES.indexOf(right.phase) ||
      left.familyIndex - right.familyIndex ||
      left.itemIndex - right.itemIndex ||
      left.subjectIndex - right.subjectIndex
  )
}

const checkedOutcomes = (planned: PlannedItem<unknown>, execution: ErasedExecution, value: unknown): readonly ExecutionOutcome[] => {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`rubric execution returned no outcome: ${planned.item.code}`)
  return value.map((outcome, index) => {
    const label = `rubric outcome ${planned.item.code}[${index}]`
    if (!isRecord(outcome)) throw new Error(`${label} must be an object`)
    if (typeof outcome.status !== 'string' || !OUTCOME_STATUSES.includes(outcome.status as ExecutionOutcome['status']))
      throw new Error(`${label} has unknown status`)
    if (execution.mode === 'audit' && outcome.status === 'FIXED') throw new Error(`${label} cannot be FIXED in audit mode`)
    if (outcome.level !== undefined && (outcome.status !== 'VIOLATION' || !isViolationLevel(outcome.level)))
      throw new Error(`${label} has an invalid violation level`)
    if (!isNonEmptyString(outcome.message)) throw new Error(`${label} message must be non-empty`)
    if (outcome.subject !== undefined && !isNonEmptyString(outcome.subject))
      throw new Error(`${label} subject must be non-empty when present`)
    return outcome as ExecutionOutcome
  })
}

const checkedRepairOutcomes = (planned: PlannedItem<unknown>, value: unknown): readonly RubricRepairOutcome[] => {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`rubric repair returned no outcome: ${planned.item.code}`)
  return value.map((outcome, index) => {
    const label = `rubric repair ${planned.item.code}[${index}]`
    if (!isRecord(outcome)) throw new Error(`${label} must be an object`)
    if (typeof outcome.changed !== 'boolean') throw new Error(`${label} changed must be boolean`)
    if (!isNonEmptyString(outcome.message)) throw new Error(`${label} message must be non-empty`)
    if (outcome.subject !== undefined && !isNonEmptyString(outcome.subject))
      throw new Error(`${label} subject must be non-empty when present`)
    return outcome as RubricRepairOutcome
  })
}

const findingLevel = (item: RubricItem<never>, outcome: ExecutionOutcome): CheckerLevel => {
  if (outcome.status === 'VIOLATION') {
    if (!item.mechanical) throw new Error(`judgment-only rubric item produced a mechanical outcome: ${item.code}`)
    if (outcome.level !== undefined && outcome.level !== item.mechanical.level && !item.mechanical.overrideLevels?.includes(outcome.level))
      throw new Error(`rubric outcome ${item.code} uses an undeclared violation level: ${outcome.level}`)
    return outcome.level ?? item.mechanical.level
  }
  return outcome.status
}

const emitStatus = (tracker: CheckerStatusTracker | undefined, event: CheckerStatusEvent): void => {
  try {
    tracker?.(event)
  } catch {
    // Status presentation is auxiliary, so a broken writer cannot change checking.
  }
}

const executeRubric = <RootContext>(
  input: CheckerInput<RootContext>,
  plannedItems: readonly PlannedItem<RootContext>[],
  onItemComplete: (planned: PlannedItem<RootContext>) => void
): CheckerFinding[] => {
  const findings: CheckerFinding[] = []
  const auditContexts = new Map<number, RootContext>()
  for (const planned of plannedItems) {
    if (input.mode === 'audit' && !auditContexts.has(planned.subjectIndex))
      auditContexts.set(planned.subjectIndex, planned.subject.context())
    const contextFor = (): unknown => {
      const rootContext = input.mode === 'audit' ? (auditContexts.get(planned.subjectIndex) as RootContext) : planned.subject.context()
      return planned.selectContext(rootContext)
    }
    const usesLegacyConform = input.mode === 'conform' && !planned.repair && planned.legacyConform
    const preAudit = usesLegacyConform
      ? undefined
      : checkedOutcomes(planned as PlannedItem<unknown>, planned.audit, planned.audit.run(contextFor()))
    let outcomes: readonly ExecutionOutcome[] = preAudit ?? []
    if (input.mode === 'conform' && planned.repair && preAudit) {
      const eligible = preAudit.some((outcome) => planned.repair?.repairOn.has(outcome.status as 'VIOLATION' | 'INFO'))
      if (eligible) {
        const repairs = checkedRepairOutcomes(planned as PlannedItem<unknown>, planned.repair.run(contextFor()))
        const postAudit = checkedOutcomes(planned as PlannedItem<unknown>, planned.audit, planned.audit.run(contextFor()))
        const changed = repairs.some((repair) => repair.changed)
        const postClean = postAudit.every((outcome) => !planned.repair?.repairOn.has(outcome.status as 'VIOLATION' | 'INFO'))
        outcomes =
          changed && postClean
            ? postAudit.map((outcome) =>
                outcome.status === 'PASS'
                  ? {
                      ...outcome,
                      status: 'FIXED' as const,
                      message: `${repairs
                        .filter((repair) => repair.changed)
                        .map((repair) => repair.message)
                        .join('; ')}; verified: ${outcome.message}`
                    }
                  : outcome
              )
            : postAudit
      }
    } else if (usesLegacyConform && planned.legacyConform) {
      outcomes = checkedOutcomes(planned as PlannedItem<unknown>, planned.legacyConform, planned.legacyConform.run(contextFor()))
    }
    for (const outcome of outcomes) {
      const subject = outcome.subject ?? planned.subject.subject
      findings.push({
        level: findingLevel(planned.item, outcome),
        code: planned.item.code,
        title: planned.item.title,
        message: outcome.message,
        ...(subject ? { subject } : {})
      })
    }

    onItemComplete(planned)
  }
  return findings
}

export const runChecker = <RootContext>(input: CheckerInput<RootContext>): CheckerResult => {
  if (!input.concern.trim()) throw new Error('checker concern must be non-empty')
  if (!input.target.trim()) throw new Error('checker target must be non-empty')

  const plannedItems = planItems(input)
  let completed = 0
  emitStatus(input.statusTracker, { type: 'start', mode: input.mode, completed: 0, total: plannedItems.length })

  try {
    const findings = executeRubric(input, plannedItems, (planned) => {
      completed++
      emitStatus(input.statusTracker, {
        type: 'item-complete',
        mode: input.mode,
        completed,
        total: plannedItems.length,
        code: planned.item.code,
        title: planned.item.title,
        phase: planned.phase,
        ...(planned.subject.subject ? { subject: planned.subject.subject } : {})
      })
    })
    const summary = emptySummary(selectedJudgmentCount(input.rubric, input.subjects))
    for (const finding of findings) summary[LEVEL_SUMMARY_KEYS[finding.level]]++

    const identity: CheckerRunIdentity = {
      version: 1,
      runId: crypto.randomUUID(),
      mode: input.mode,
      concern: input.concern,
      target: input.target,
      generatedAt: new Date().toISOString()
    }
    const records: CheckerRecord[] = [
      { ...identity, record: 'meta' },
      ...findings.map((finding) => ({ ...identity, record: 'finding' as const, ...finding })),
      { ...identity, record: 'summary', summary }
    ]
    const result = { records, findings, summary, exitCode: findings.some((finding) => finding.level === 'FAIL') ? 1 : 0 } as const
    emitStatus(input.statusTracker, { type: 'complete', mode: input.mode, completed, total: plannedItems.length })
    return result
  } catch (error) {
    emitStatus(input.statusTracker, { type: 'failed', mode: input.mode, completed, total: plannedItems.length })
    throw error
  }
}

export const checkerJsonl = (records: readonly CheckerRecord[]): string => `${records.map((record) => JSON.stringify(record)).join('\n')}\n`

export const parseCheckerJsonl = (output: string): CheckerParseResult => {
  const records: unknown[] = []
  const errors: string[] = []
  for (const [index, raw] of output.split(/\r?\n/).entries()) {
    const line = raw.trim()
    if (!line) continue
    try {
      records.push(JSON.parse(line) as unknown)
    } catch {
      errors.push(`line ${index + 1} is not valid JSON`)
    }
  }
  return { records, errors }
}

const permittedKeys = (record: string): readonly string[] => {
  if (record === 'meta') return RUN_KEYS
  if (record === 'finding') return FINDING_KEYS
  if (record === 'summary') return SUMMARY_KEYS
  return []
}

const selectedRubricItemsByCode = <RootContext>(
  rubric: RubricDefinition<RootContext>,
  subjects: readonly CheckerEvaluationSubject<RootContext>[]
): ReadonlyMap<string, RubricItem<never>> => {
  const familyCodes = selectedFamilyCodes(subjects)
  return new Map(
    rubric.families
      .filter((family) => familyCodes.has(family.code))
      .flatMap((family) => family.items.map((item) => [item.code, item] as const))
  )
}

export const validateCheckerRecords = <RootContext>({
  records,
  rubric,
  subjects,
  exitCode
}: {
  records: readonly unknown[]
  rubric: RubricDefinition<RootContext>
  subjects: readonly CheckerEvaluationSubject<RootContext>[]
  exitCode?: number
}): readonly string[] => {
  const errors: string[] = []
  if (records.length < 2) return ['a checker response must contain meta and summary records']
  const first = records[0]
  const last = records.at(-1)
  if (!isRecord(first) || first.record !== 'meta') errors.push('first record must be meta')
  if (!isRecord(last) || last.record !== 'summary') errors.push('last record must be summary')
  if (!isRecord(first)) return errors

  const identity = {
    version: first.version,
    runId: first.runId,
    mode: first.mode,
    concern: first.concern,
    target: first.target,
    generatedAt: first.generatedAt
  }
  if (identity.version !== 1) errors.push('meta version must be 1')
  if (!isNonEmptyString(identity.runId) || !UUID.test(identity.runId)) errors.push('meta runId must be a UUID')
  if (identity.mode !== 'audit' && identity.mode !== 'conform') errors.push('meta mode must be audit or conform')
  if (!isNonEmptyString(identity.concern)) errors.push('meta concern must be non-empty')
  if (!isNonEmptyString(identity.target)) errors.push('meta target must be non-empty')
  if (!isNonEmptyString(identity.generatedAt) || Number.isNaN(Date.parse(identity.generatedAt)))
    errors.push('meta generatedAt must be an ISO timestamp')

  const items = selectedRubricItemsByCode(rubric, subjects)
  const counted = emptySummary(selectedJudgmentCount(rubric, subjects))
  let hasFailure = false
  for (const [index, value] of records.entries()) {
    const label = `record ${index + 1}`
    if (!isRecord(value)) {
      errors.push(`${label} must be an object`)
      continue
    }
    const record = typeof value.record === 'string' ? value.record : ''
    if (!['meta', 'finding', 'summary'].includes(record)) {
      errors.push(`${label} has an invalid record kind`)
      continue
    }
    if (index > 0 && index < records.length - 1 && record !== 'finding') errors.push(`${label} must be a finding record`)
    for (const key of Object.keys(value)) if (!permittedKeys(record).includes(key)) errors.push(`${label} has unknown field: ${key}`)
    for (const [key, expected] of Object.entries(identity)) if (value[key] !== expected) errors.push(`${label} ${key} must match meta`)
    if (record !== 'finding') continue

    const code = isNonEmptyString(value.code) ? value.code : ''
    const item = items.get(code)
    if (!code) errors.push(`${label} code must be non-empty`)
    else if (!item) errors.push(`${label} code does not resolve in the selected rubric items: ${code}`)
    else if (!item.mechanical) errors.push(`${label} code resolves to a judgment-only item: ${code}`)
    if (!isNonEmptyString(value.title)) errors.push(`${label} title must be non-empty`)
    else if (item && value.title !== item.title) errors.push(`${label} title does not match rubric item: ${code}`)
    if (!isNonEmptyString(value.message)) errors.push(`${label} message must be non-empty`)
    if (value.subject !== undefined && !isNonEmptyString(value.subject)) errors.push(`${label} subject must be non-empty when present`)

    const level =
      typeof value.level === 'string' && CHECKER_LEVELS.includes(value.level as CheckerLevel) ? (value.level as CheckerLevel) : undefined
    if (!level) errors.push(`${label} level is not recognised`)
    else {
      if (identity.mode === 'audit' && level === 'FIXED') errors.push(`${label} audit finding cannot be FIXED`)
      if (
        item?.mechanical &&
        (level === 'FAIL' || level === 'WARN') &&
        level !== item.mechanical.level &&
        !item.mechanical.overrideLevels?.includes(level)
      )
        errors.push(`${label} violation level is not declared by rubric item: ${code}`)
      counted[LEVEL_SUMMARY_KEYS[level]]++
      if (level === 'FAIL') hasFailure = true
    }
  }

  if (isRecord(last) && last.record === 'summary') {
    const summary = last.summary
    if (!isRecord(summary)) errors.push('summary record must carry a summary object')
    else {
      for (const key of ['fail', 'warn', 'fixed', 'info', 'notApplicable', 'pass'] as const)
        if (!Number.isInteger(summary[key]) || (summary[key] as number) < 0) errors.push(`summary ${key} must be a non-negative integer`)
        else if (summary[key] !== counted[key]) errors.push(`summary ${key} does not match findings`)
      const judgment = summary.judgment
      if (!isRecord(judgment) || !Number.isInteger(judgment.unevaluated) || (judgment.unevaluated as number) < 0)
        errors.push('summary judgment.unevaluated must be a non-negative integer')
      else {
        if (judgment.unevaluated !== counted.judgment.unevaluated)
          errors.push('summary judgment.unevaluated does not match selected rubric items')
        for (const key of Object.keys(judgment)) if (key !== 'unevaluated') errors.push(`summary judgment has unknown field: ${key}`)
      }
      const allowed = new Set(['fail', 'warn', 'fixed', 'info', 'notApplicable', 'pass', 'judgment'])
      for (const key of Object.keys(summary)) if (!allowed.has(key)) errors.push(`summary has unknown field: ${key}`)
    }
  }
  if (exitCode !== undefined && (exitCode !== 0) !== hasFailure)
    errors.push('process exit status must be non-zero if and only if a FAIL finding exists')
  return errors
}
