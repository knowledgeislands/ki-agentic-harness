import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'
import { judgment } from './shared.ts'
export const WEB_23 = judgment(
  'WEB-23',
  'Markdown content',
  'pages are Markdown with YAML front matter, grouped into content folders.',
  'Are pages Markdown with YAML front matter and grouped into sensible content folders?'
)
export const WEB_24 = judgment(
  'WEB-24',
  'folder data cascade',
  'folder front matter (`layout`, section/tag) is set by a `*.11tydata.json`/`.js` cascade file, not repeated per page.',
  'Do cascade data files own repeated folder-level front matter?'
)
export const WEB_25 = judgment(
  'WEB-25',
  'JSON5 validation',
  'structured JSON5 data, where present, is validated at build (Zod) and aborts on a bad record.',
  'Where structured JSON5 exists, is it validated during the build and does invalid data stop the build?'
)
export const CONTENT: readonly RubricItem<WebsiteContext>[] = [WEB_23, WEB_24, WEB_25]
