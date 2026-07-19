/**
 * Structured identity and execution model for the ki-skills rubric.
 *
 * This is the rubric's future source of truth. It gives a checker stable rule
 * identity, source attribution, and optional audit, conform, or judgment
 * behaviour. The existing Markdown rubric is only a temporary migration
 * surface until every criterion is represented here.
 */

import { CHECKER_LEVELS, type CheckerFinding, type CheckerLevel } from '../checker-reporter.ts'

export type RubricSource = string
export const RUBRIC_LEVELS = CHECKER_LEVELS
export type RubricLevel = CheckerLevel

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

export type RubricFinding = CheckerFinding

export type ConformAction<Context = unknown> = {
  item: RubricItem<Context>
  message: string
  file?: string
  level?: Extract<RubricLevel, 'POLISH' | 'ADVISORY'>
}
