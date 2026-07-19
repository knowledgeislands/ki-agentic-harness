import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { BindingChezMoiContext } from '../contexts/binding-chezmoi.ts'
import { BINDCHEZ } from './bindchez.ts'
export const KI_BINDING_CHEZMOI_RUBRIC: RubricDefinition<BindingChezMoiContext> = {
  name: 'ki-binding-chezmoi',
  concern: 'binding-chezmoi',
  families: [
    defineRubricFamily({
      code: 'BINDCHEZ',
      title: 'Chezmoi binding render path',
      description: 'The renderer-specific binding contract.',
      standard: 'standards.md',
      selectContext: (context: BindingChezMoiContext) => context,
      items: BINDCHEZ
    })
  ]
}
export const KI_BINDING_CHEZMOI_FAMILY_CODES = ['BINDCHEZ'] as const
