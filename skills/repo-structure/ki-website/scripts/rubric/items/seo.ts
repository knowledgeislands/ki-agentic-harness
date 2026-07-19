import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { inactive, judgment, mechanical } from './shared.ts'
export const WEB_26 = mechanical(
  'WEB-26',
  'SEO metadata partial',
  'a `seo-meta` partial exists under `_includes/partials/`.',
  'WARN',
  (c) =>
    inactive(c) ?? [
      {
        status: c.seoMeta ? 'PASS' : 'VIOLATION',
        message: c.seoMeta ? 'seo-meta partial present' : 'no seo-meta partial under _includes/partials/ (SEO meta tags)',
        subject: c.siteAt('src', '_includes', 'partials')
      }
    ]
)
export const WEB_27 = judgment(
  'WEB-27',
  'site-wide SEO metadata',
  '`seo-meta` is **included from `base.njk`** so every page carries canonical + OG + Twitter tags.',
  'Does base.njk include seo-meta so all pages receive canonical, Open Graph, and Twitter metadata?'
)
export const WEB_28 = judgment(
  'WEB-28',
  'noindex metadata',
  '`noindex` front matter emits the robots meta on non-indexed pages (e.g. `404`).',
  'Does noindex front matter emit robots metadata on intentionally non-indexed pages?'
)
export const WEB_29 = judgment(
  'WEB-29',
  'public site discovery assets',
  'a **public** site ships `sitemap.xml` + `robots.txt` (admin-only sections excluded) and a webmanifest + favicons.',
  'Where the site is public, does it ship and scope the required discovery and application assets?'
)
export const SEO: readonly RubricItem<WebsiteContext>[] = [WEB_26, WEB_27, WEB_28, WEB_29]
