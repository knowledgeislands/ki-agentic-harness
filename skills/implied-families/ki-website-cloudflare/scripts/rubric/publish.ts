import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_WEBSITE_CLOUDFLARE_RUBRIC } from './items/index.ts'

const path = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
export const renderRubric = () =>
  `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — website-cloudflare\n\n${KI_WEBSITE_CLOUDFLARE_RUBRIC.families
    .map(
      (f) =>
        `## ${f.code} — ${f.title}\n\n→ [standard](${f.standard})\n\n${f.description}\n\n${f.items
          .map(
            (i) =>
              `- **${i.code} [${rubricTypes(i)
                .map((t) => (t === 'MECHANICAL' ? 'M' : 'J'))
                .join(' + ')}] — ${i.title}** — ${i.description}`
          )
          .join('\n')}`
    )
    .join('\n\n')}\n`
export const publishRubric = async () => writeFile(path, renderRubric())
if (import.meta.main) await publishRubric()
