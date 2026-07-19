import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteCloudflareContext } from '../contexts/website-cloudflare.ts'
import { WCF } from './wcf.ts'
export const KI_WEBSITE_CLOUDFLARE_RUBRIC: RubricDefinition<WebsiteCloudflareContext> = {
  name: 'ki-website-cloudflare',
  concern: 'website-cloudflare',
  families: [
    defineRubricFamily({
      code: 'WCF',
      title: 'Cloudflare hosting',
      description: 'Workers + Static Assets hosting standard.',
      standard: 'standards.md',
      selectContext: (context: WebsiteCloudflareContext) => context,
      items: WCF
    })
  ]
}
export const KI_WEBSITE_CLOUDFLARE_FAMILY_CODES = ['WCF'] as const
