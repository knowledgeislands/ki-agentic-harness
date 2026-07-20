import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_HOUSEKEEPING_RUBRIC } from './items/index.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const classification = (item: RubricItem<never>): string =>
  rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? (item.mechanical?.heuristic ? 'M-heuristic' : 'M') : 'J'))
    .join(' + ')
const renderItem = (item: RubricItem<never>): string =>
  `- **${item.code} [${classification(item)}] — ${item.title}** — ${item.description} (${item.sources.join(', ')})${item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''}`
export const renderRubric = <RootContext>(
  definition: RubricDefinition<RootContext>
): string => `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — ${definition.concern}

> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical. Edit those definitions, then rerun \`scripts/rubric/publish.ts\`.

${definition.families.map((family) => `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(renderItem).join('\n')}`).join('\n\n')}
`
export const publishRubric = async (): Promise<void> => writeFile(publicationPath, renderRubric(KI_HOUSEKEEPING_RUBRIC))
if (import.meta.main) await publishRubric()
