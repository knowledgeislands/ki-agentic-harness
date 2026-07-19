import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { ActivitiesContext } from '../contexts/activities.ts'
import { ACT } from './activities.ts'

export const KI_KB_ACTIVITIES_RUBRIC: RubricDefinition<ActivitiesContext> = {
  name: 'ki-kb-activities',
  concern: 'kb-activities',
  families: [
    defineRubricFamily({
      code: 'ACT',
      title: 'knowledge-base activities',
      description: 'Activity note structure, frontmatter, realization-specific declarations, and safe index maintenance.',
      standard: '../SKILL.md',
      selectContext: (context: ActivitiesContext) => context,
      items: ACT
    })
  ]
}

export const KI_KB_ACTIVITIES_FAMILY_CODES = ['ACT'] as const
