/** Generic identity, execution, and catalogue model for structured governance rubrics. */

export const RUBRIC_MODES = ['audit', 'conform'] as const
export type RubricMode = (typeof RUBRIC_MODES)[number]

export const RUBRIC_PHASES = ['PREPARE', 'INSPECT', 'PRIMARY', 'DERIVED', 'NORMALISE'] as const
export type RubricPhase = (typeof RUBRIC_PHASES)[number]

export const VIOLATION_LEVELS = ['FAIL', 'WARN'] as const
export type ViolationLevel = (typeof VIOLATION_LEVELS)[number]

export const RUBRIC_TYPES = ['MECHANICAL', 'JUDGMENT'] as const
export type RubricType = (typeof RUBRIC_TYPES)[number]

export const OUTCOME_STATUSES = ['PASS', 'VIOLATION', 'NOT_APPLICABLE', 'INFO', 'FIXED'] as const
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number]
export type AuditOutcomeStatus = Exclude<OutcomeStatus, 'FIXED'>
export type NonEmptyReadonlyArray<Value> = readonly [Value, ...Value[]]

type RubricOutcomeBase<Status extends OutcomeStatus> = {
  status: Status
  message: string
  subject?: string
}

export type RubricOutcome<Status extends OutcomeStatus> = Status extends 'VIOLATION'
  ? RubricOutcomeBase<Status> & { level?: ViolationLevel }
  : RubricOutcomeBase<Status> & { level?: never }

export type AuditOutcome = RubricOutcome<AuditOutcomeStatus>
export type ConformOutcome = RubricOutcome<OutcomeStatus>
/** A rubric execution may emit one outcome per inspected subject, including none when there are no subjects. */
export type RubricOutcomes<Result> = readonly Result[]

export type RubricExecution<Context, Result> = {
  phase: RubricPhase
  run: (context: Context) => RubricOutcomes<Result>
}

/** A safe mutation requested only after this item's AUDIT outcome makes it eligible. */
export type RubricRepairOutcome = {
  /** True only when this invocation observed a persistent target change. */
  changed: boolean
  message: string
  subject?: string
}

export type RubricRepairExecution<Context> = {
  phase: RubricPhase
  run: (context: Context) => RubricOutcomes<RubricRepairOutcome>
}

export type MechanicalRubric<Context> = {
  level: ViolationLevel
  overrideLevels?: readonly ViolationLevel[]
  heuristic?: boolean
  audit: RubricExecution<Context, AuditOutcome>
  /**
   * The canonical CONFORM action. The checker runs AUDIT, conditionally runs
   * this action, then immediately runs AUDIT again before emitting a finding.
   */
  repair?: RubricRepairExecution<Context>
  /** Additional neutral outcomes that this repair may safely address. */
  repairOn?: readonly Extract<AuditOutcomeStatus, 'INFO'>[]
  /**
   * Transitional direct-CONFORM callback for already-vendored catalogues.
   * New items must declare `repair`; the rollout removes this once every
   * consumer has moved to the audit-gated contract.
   */
  conform?: RubricExecution<Context, ConformOutcome>
}

export type JudgmentRubric = {
  prompt: string
}

export type RubricItemBase = {
  code: string
  title: string
  description: string
  sources: NonEmptyReadonlyArray<string>
}

export type RubricItem<Context> = RubricItemBase &
  (
    | {
        mechanical: MechanicalRubric<Context>
        judgment?: JudgmentRubric
      }
    | {
        mechanical?: never
        judgment: JudgmentRubric
      }
  )

export type RubricFamily<RootContext, FamilyContext> = {
  code: string
  title: string
  description: string
  standard: string
  selectContext: (root: RootContext) => FamilyContext
  items: NonEmptyReadonlyArray<RubricItem<FamilyContext>>
}

type CatalogueRubricFamily<RootContext> = {
  code: string
  title: string
  description: string
  standard: string
  selectContext: (root: RootContext) => unknown
  /** `never` erases heterogeneous family contexts without making callbacks callable. */
  items: NonEmptyReadonlyArray<RubricItem<never>>
}

export type RubricDefinition<RootContext> = {
  name: string
  concern: string
  families: NonEmptyReadonlyArray<CatalogueRubricFamily<RootContext>>
}

export type RubricCatalogueIssue = {
  path: string
  message: string
}

export const defineRubricFamily = <RootContext, FamilyContext>(
  family: RubricFamily<RootContext, FamilyContext>
): RubricFamily<RootContext, FamilyContext> => family

export const rubricTypes = <Context>(item: RubricItem<Context>): readonly RubricType[] => [
  ...(item.mechanical ? (['MECHANICAL'] as const) : []),
  ...(item.judgment ? (['JUDGMENT'] as const) : [])
]

/** Validate semantic catalogue invariants that TypeScript cannot express across entries. */
export const validateRubricCatalogue = <RootContext>(definition: RubricDefinition<RootContext>): readonly RubricCatalogueIssue[] => {
  const issues: RubricCatalogueIssue[] = []
  const familyCodes = new Set<string>()
  const itemCodes = new Set<string>()
  for (const [familyIndex, family] of definition.families.entries()) {
    const familyPath = `definition.families[${familyIndex}]`

    if (familyCodes.has(family.code)) issues.push({ path: `${familyPath}.code`, message: `duplicates family code ${family.code}` })
    familyCodes.add(family.code)

    for (const [itemIndex, item] of family.items.entries()) {
      const itemPath = `${familyPath}.items[${itemIndex}]`
      if (!item.code.startsWith(`${family.code}-`))
        issues.push({ path: `${itemPath}.code`, message: `must belong to family ${family.code}` })
      if (itemCodes.has(item.code)) issues.push({ path: `${itemPath}.code`, message: `duplicates rubric item code ${item.code}` })
      itemCodes.add(item.code)
    }
  }

  return issues
}
