import { SPEC } from './specifications.ts'
import { SYNC } from './sync.ts'
import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { SpecificationsContext } from '../contexts/specifications.ts'
export const KI_SPECIFICATIONS_RUBRIC: RubricDefinition<SpecificationsContext> = { name: 'ki-specifications', concern: 'specifications', families: [
  defineRubricFamily({ code: 'SPEC', title: 'repository structure', description: 'Repository identity and stable top-level seams.', standard: 'standards.md', selectContext: (context: SpecificationsContext) => context, items: SPEC as never }),
  defineRubricFamily({ code: 'SYNC', title: 'standard synchronisation', description: 'Alignment across the knowledge chain.', standard: 'standards.md', selectContext: (context: SpecificationsContext) => context, items: SYNC as never })
] }
export const KI_SPECIFICATIONS_FAMILY_CODES = ['SPEC', 'SYNC'] as const
