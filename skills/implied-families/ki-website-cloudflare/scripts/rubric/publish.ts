import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_WEBSITE_CLOUDFLARE_RUBRIC } from './items/index.ts'

const path = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const renderItem = (item: RubricItem<never>): string =>
  `- **${item.code} [${rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? (item.mechanical?.heuristic ? 'M-heuristic' : 'M') : 'J'))
    .join(
      ' + '
    )}] — ${item.title}** — ${item.description} (${item.sources.join(', ')})${item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''}`

export const renderRubric = <Context>(rubric: RubricDefinition<Context>): string =>
  `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — website-cloudflare\n\n> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun \`scripts/rubric/publish.ts\`.\n\n${rubric.families
    .map((f) => `## ${f.code} — ${f.title}\n\n→ [standard](${f.standard})\n\n${f.description}\n\n${f.items.map(renderItem).join('\n')}`)
    .join('\n\n')}\n`
export const publishRubric = async (): Promise<void> => writeFile(path, renderRubric(KI_WEBSITE_CLOUDFLARE_RUBRIC))
if (import.meta.main) await publishRubric()
