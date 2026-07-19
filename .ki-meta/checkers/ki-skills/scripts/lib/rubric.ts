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

export const NAME_5 = {
  code: 'NAME-5',
  title: 'name matches the parent directory name exactly',
  types: ['M'],
  sources: ['SPEC'],
  mechanical: {
    audit: 'implemented',
    conform: 'safe'
  }
} as const satisfies RubricItem

export const RUBRIC_ITEMS = [NAME_5] as const satisfies readonly RubricItem[]

export function rubricItem(code: string): RubricItem | undefined {
  return RUBRIC_ITEMS.find((item) => item.code === code)
}
