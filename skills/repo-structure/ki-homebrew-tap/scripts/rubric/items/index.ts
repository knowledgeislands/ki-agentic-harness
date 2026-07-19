import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { HomebrewTapContext } from '../contexts/homebrew-tap.ts'
import { CONFIG } from './config.ts'
import { TAP } from './tap.ts'

export const KI_HOMEBREW_TAP_RUBRIC: RubricDefinition<HomebrewTapContext> = {
  name: 'ki-homebrew-tap',
  concern: 'homebrew-tap',
  families: [
    defineRubricFamily({
      code: 'TAP',
      title: 'tap structure',
      description: 'Formula layout, local Homebrew evidence, and judgment prompts.',
      standard: 'standards.md',
      selectContext: (context: HomebrewTapContext) => context,
      items: TAP as never
    }),
    defineRubricFamily({
      code: 'CONFIG',
      title: 'configuration',
      description: 'Identity marker and keyless configuration.',
      standard: 'standards.md',
      selectContext: (context: HomebrewTapContext) => context,
      items: CONFIG as never
    })
  ]
}

export const KI_HOMEBREW_TAP_FAMILY_CODES = ['TAP', 'CONFIG'] as const
