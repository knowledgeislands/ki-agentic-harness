import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { BindingRubricContext } from '../contexts/binding.ts'
import { BIND } from './bind.ts'

/** Catalogue wiring only; rule definitions live in their semantic family module. */
export const KI_BINDING_RUBRIC: RubricDefinition<BindingRubricContext> = {
  name: 'ki-binding',
  concern: 'binding',
  families: [
    defineRubricFamily({
      code: 'BIND',
      title: 'Cross-surface agreement',
      description: 'Agreement between the source and enabled run surfaces.',
      standard: 'standards.md',
      selectContext: (context: BindingRubricContext) => context,
      items: BIND
    })
  ]
}
export const KI_BINDING_FAMILY_CODES = ['BIND'] as const
