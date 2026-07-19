/**
 * Structured identity and execution model for the ki-skills rubric.
 *
 * This is the rubric's source of truth. It gives a checker stable rule
 * identity, source attribution, and optional audit, conform, or judgment
 * behaviour.
 */

export type RubricSource = string
export const RUBRIC_LEVELS = [
  'FAIL', // A mechanical requirement is not met; audit exits non-zero.
  'WARN', // A material recommendation needs attention, but does not fail the run.
  'POLISH', // A safe, low-risk improvement is available.
  'ADVISORY', // Judgment or manual work is needed; the checker does not decide it.
  'INFO', // Neutral measurement or status, never a verdict.
  'NA', // The criterion does not apply to this target.
  'PASS' // The criterion was checked and is satisfied.
] as const
export type RubricLevel = (typeof RUBRIC_LEVELS)[number]

export type RubricType = 'M' | 'J'

export type RubricFinding = {
  type: RubricType
  level: RubricLevel
  code: string
  message: string
  file?: string
}

export type RubricItem<Context = unknown> = {
  code: string
  title: string
  description: string
  sources: readonly RubricSource[]
  judgment?: {
    prompt: string
  }
  audit?: (context: Context) => RubricFinding[]
  conform?: (context: Context) => ConformAction<Context>[]
}

export const auditRubricItems = <Context>(items: readonly RubricItem<Context>[], context: Context): RubricFinding[] =>
  items.flatMap((item) => item.audit?.(context) ?? [])

export const conformRubricItems = <Context>(items: readonly RubricItem<Context>[], context: Context): ConformAction<Context>[] =>
  items.flatMap((item) => item.conform?.(context) ?? [])

export type ConformAction<Context = unknown> = {
  item: RubricItem<Context>
  message: string
  file?: string
  level?: Extract<RubricLevel, 'POLISH' | 'ADVISORY'>
}
