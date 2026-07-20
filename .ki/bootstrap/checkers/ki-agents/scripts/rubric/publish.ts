import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_AGENTS_RUBRIC } from './items/index.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))

const classification = (item: RubricItem<never>): string =>
  rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? (item.mechanical?.heuristic ? 'M-heuristic' : 'M') : 'J'))
    .join(' + ')

const renderItem = (item: RubricItem<never>): string => {
  const prompt = item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''
  return `- **${item.code} [${classification(item)}] — ${item.title}** — ${item.description} (${item.sources.join(', ')})${prompt}`
}

const headingAnchor = (heading: string): string =>
  heading
    .toLowerCase()
    .replaceAll(/\s/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')

export const renderRubric = <RootContext>(definition: RubricDefinition<RootContext>): string => {
  const contents = definition.families
    .map((family) => `- [${family.code} — ${family.title}](#${headingAnchor(`${family.code} — ${family.title}`)})`)
    .join('\n')
  const families = definition.families
    .map(
      (family) =>
        `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(renderItem).join('\n')}`
    )
    .join('\n\n')

  return `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — ${definition.concern}

> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical. Edit those definitions, then rerun \`scripts/rubric/publish.ts\`.

## Contents

${contents}

${families}
`
}

export const publishRubric = async (): Promise<void> => writeFile(publicationPath, renderRubric(KI_AGENTS_RUBRIC))

if (import.meta.main) await publishRubric()
