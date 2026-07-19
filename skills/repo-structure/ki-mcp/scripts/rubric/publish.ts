import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_MCP_RUBRIC } from './items/index.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const classification = (item: RubricItem<never>): string =>
  rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? (item.mechanical?.heuristic ? 'M-heuristic' : 'M') : 'J'))
    .join(' + ')
const anchor = (value: string): string =>
  value
    .toLowerCase()
    .replaceAll(/\s/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
const item = (value: RubricItem<never>): string =>
  `- **${value.code} [${classification(value)}] — ${value.title}** — ${value.description} (${value.sources.join(', ')})${value.judgment ? `\n  - _Review prompt:_ ${value.judgment.prompt}` : ''}`
export const renderRubric = <Context>(
  definition: RubricDefinition<Context>
): string => `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — ${definition.concern}

> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical. Edit those definitions, then rerun \`scripts/rubric/publish.ts\`.

## Contents

${definition.families.map((family) => `- [${family.code} — ${family.title}](#${anchor(`${family.code} — ${family.title}`)})`).join('\n')}

${definition.families.map((family) => `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(item).join('\n')}`).join('\n\n')}
`
export const publishRubric = async (): Promise<void> => writeFile(publicationPath, renderRubric(KI_MCP_RUBRIC))
if (import.meta.main) await publishRubric()
