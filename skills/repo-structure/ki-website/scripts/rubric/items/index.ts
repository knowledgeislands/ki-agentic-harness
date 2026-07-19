import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { WEB } from './web.ts'

export const KI_WEBSITE_RUBRIC: RubricDefinition<WebsiteContext> = {
  name: 'ki-website',
  concern: 'website',
  families: [
    defineRubricFamily({
      code: 'WEB',
      title: 'Eleventy website standard',
      description: 'The static-site stack, workspace layout, generated output, and sustainable operating boundary.',
      standard: 'standards.md',
      selectContext: (context: WebsiteContext) => context,
      items: WEB
    })
  ]
}
export const KI_WEBSITE_FAMILY_CODES = ['WEB'] as const
