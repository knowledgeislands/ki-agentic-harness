/**
 * Structured identity and execution model for the ki-skills rubric.
 *
 * This is the rubric's future source of truth. It gives a checker stable rule
 * identity, source attribution, and optional audit, conform, or judgment
 * behaviour. The existing Markdown rubric is only a temporary migration
 * surface until every criterion is represented here.
 */

export type RubricSource = string
export const RUBRIC_LEVELS = [
  'FAIL', // Required criterion violated; blocks completion.
  'WARN', // Recommended criterion violated; should be fixed, but may ship with a reason.
  'POLISH', // Minor or cosmetic divergence, including a safe conform change applied.
  'ADVISORY', // Judgment the checker cannot decide; handed to the reader.
  'INFO', // Neutral context rather than a verdict.
  'NA', // Criterion checked but not applicable to this target.
  'PASS' // Criterion is met.
] as const
export type RubricLevel = (typeof RUBRIC_LEVELS)[number]

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

export type RubricFinding = {
  type: 'M' | 'J'
  level: RubricLevel
  code: string
  message: string
  ref?: string
  file?: string
}

export type ConformAction<Context = unknown> = {
  item: RubricItem<Context>
  message: string
  file?: string
}
