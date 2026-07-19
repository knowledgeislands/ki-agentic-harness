import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { EngineeringRubricContext } from '../contexts/engineering.ts'
import { ENGINEERING_ITEMS } from './engineering.ts'

const families = [...new Set(ENGINEERING_ITEMS.map((item) => item.code.split('-')[0]))]
export const KI_ENGINEERING_RUBRIC: RubricDefinition<EngineeringRubricContext> = {
  name: 'ki-engineering',
  concern: 'engineering standards',
  families: families.map((code) =>
    defineRubricFamily({
      code,
      title: `${code} engineering rules`,
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: (context: EngineeringRubricContext) => context,
      items: ENGINEERING_ITEMS.filter((item) => item.code.startsWith(`${code}-`)) as [
        (typeof ENGINEERING_ITEMS)[number],
        ...(typeof ENGINEERING_ITEMS)[number][]
      ]
    })
  ) as [
    ReturnType<typeof defineRubricFamily<EngineeringRubricContext, EngineeringRubricContext>>,
    ...ReturnType<typeof defineRubricFamily<EngineeringRubricContext, EngineeringRubricContext>>[]
  ]
}
