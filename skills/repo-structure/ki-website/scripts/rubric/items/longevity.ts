import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { judgment } from './shared.ts'
export const WEB_37 = judgment(
  'WEB-37',
  'volatile facts have one home',
  'volatile facts (Eleventy/Tailwind/Lucide versions, the spec idioms the config relies on) sit in `package.json` / the standard, not scattered — a bump is one known edit.',
  'Do volatile facts live in package metadata or the standard rather than being scattered through implementation?'
)
export const WEB_38 = judgment(
  'WEB-38',
  'current standard',
  'this audit runs against a **current** standard: a cited requirement is confirmed by Mode REFRESH + [`sources.md`](sources.md) not having gone stale since its `last reviewed` date.',
  'Has Mode REFRESH confirmed the cited sources and updated the review record recently enough?'
)
export const LONGEVITY: readonly RubricItem<WebsiteContext>[] = [WEB_37, WEB_38]
