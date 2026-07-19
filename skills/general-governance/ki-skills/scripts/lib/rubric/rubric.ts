/**
 * Structured identity for the ki-skills rubric.
 *
 * This is the rubric's future source of truth. It gives a checker one stable
 * identity, type, source attribution, and declared mechanical capability for
 * each rule. The existing Markdown rubric is only a temporary migration
 * surface until every criterion is represented here.
 *
 * Rule implementations remain in audit.ts and conform.ts for this first
 * vertical slice. Do not move them here until the shared execution context is
 * deliberately designed.
 */

export type RubricItemType = 'M' | 'J'
export type RubricSource = string
export const RUBRIC_LEVELS = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'NA', 'PASS'] as const
export type RubricLevel = (typeof RUBRIC_LEVELS)[number]

export type RubricItem = {
  code: string
  title: string
  types: readonly RubricItemType[]
  sources: readonly RubricSource[]
  mechanical?: {
    audit: 'implemented'
    conform?: 'safe'
  }
}

export type MechanicalRubricFinding = {
  type: 'M'
  level: RubricLevel
  code: string
  message: string
  ref?: string
  file?: string
}

export type JudgmentRubricFinding = {
  type: 'J'
  level: 'ADVISORY'
  code: string
  message: string
  ref: string
  file?: string
}

export type RubricFinding = MechanicalRubricFinding | JudgmentRubricFinding

export type ConformAction = {
  item: RubricItem
  message: string
  file?: string
  applied: boolean
}
