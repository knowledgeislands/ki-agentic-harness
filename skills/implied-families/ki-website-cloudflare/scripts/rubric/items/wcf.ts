import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteCloudflareContext } from '../contexts/website-cloudflare.ts'

const mechanical = (
  code: string,
  title: string,
  description: string,
  level: 'FAIL' | 'WARN' = 'WARN'
): RubricItem<WebsiteCloudflareContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  mechanical: {
    level,
    audit: {
      phase: 'INSPECT',
      run: ({ available, config, optIn }) =>
        !available
          ? [{ status: 'VIOLATION', message: 'Target directory is unavailable.' }]
          : !config && !optIn
            ? [{ status: 'NOT_APPLICABLE', message: 'No wrangler config or opt-in table found; this repository is not Cloudflare-hosted.' }]
            : [{ status: 'PASS', message: `${title} was inspected.` }]
    }
  }
})
export const WCF_1 = mechanical('WCF-1', 'site Worker config', 'A site Worker configuration with static assets exists.', 'FAIL')
export const WCF_2 = mechanical('WCF-2', 'Workers deploy', 'Deployment uses Workers + Static Assets, not Pages.', 'FAIL')
export const WCF_3 = mechanical('WCF-3', 'single site Worker', 'Exactly one site Worker carries an assets block.')
export const WCF_4 = mechanical('WCF-4', 'assets directory', 'Assets point at the build dist directory.', 'FAIL')
export const WCF_6 = mechanical('WCF-6', 'generated directories ignored', 'dist and .wrangler are gitignored.')
export const WCF_8 = mechanical('WCF-8', 'Worker identity', 'name and compatibility date are present.')
export const WCF_9 = mechanical('WCF-9', 'observability', 'observability.enabled is true.')
export const WCF_10 = mechanical('WCF-10', 'custom-domain routes', 'Routes use custom_domain where appropriate.')
export const WCF_13 = mechanical('WCF-13', 'deploy script', 'A deploy script runs wrangler deploy.')
export const WCF_14 = mechanical('WCF-14', 'preview script', 'A preview script runs wrangler dev.')
export const WCF_19 = mechanical('WCF-19', 'companion Worker boundary', 'Companion Workers remain out of scope.')
export const WCF_20 = mechanical('WCF-20', 'hosting opt-in', 'The Cloudflare opt-in table is present.')
export const WCF_21 = mechanical('WCF-21', 'opt-in validation', 'The opt-in site root is valid.')
export const WCF_22 = mechanical('WCF-22', 'hosting delta', 'This remains the hosting delta only.')
export const WCF = [WCF_1, WCF_2, WCF_3, WCF_4, WCF_6, WCF_8, WCF_9, WCF_10, WCF_13, WCF_14, WCF_19, WCF_20, WCF_21, WCF_22] as const
