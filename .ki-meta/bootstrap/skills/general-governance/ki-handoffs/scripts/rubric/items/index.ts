import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { HandoffsRubricContext } from '../contexts/handoffs.ts'
import { HAND } from './hand.ts'

const RUBRIC_FAMILIES = [
  defineRubricFamily({
    code: 'HAND',
    title: 'Handoff readiness',
    description: 'The opt-in marker contract and delegation-readiness doctrine.',
    standard: 'standards.md#the-opt-in-marker-contract',
    selectContext: (context: HandoffsRubricContext) => context,
    items: HAND
  })
] as const

export const KI_HANDOFFS_RUBRIC: RubricDefinition<HandoffsRubricContext> = {
  name: 'ki-handoffs',
  concern: 'Knowledge Islands handoff readiness',
  families: RUBRIC_FAMILIES
}

export const KI_HANDOFFS_FAMILY_CODES = RUBRIC_FAMILIES.map((family) => family.code)
