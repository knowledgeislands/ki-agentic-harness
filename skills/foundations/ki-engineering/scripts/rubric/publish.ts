import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_ENGINEERING_RUBRIC } from './items/index.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const headingAnchor = (heading: string): string =>
  heading
    .toLowerCase()
    .replaceAll(/\s/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
const renderContents = <Context>(rubric: RubricDefinition<Context>): string =>
  rubric.families.map((family) => `- [${family.code} — ${family.title}](#${headingAnchor(`${family.code} — ${family.title}`)})`).join('\n')
const renderItem = (item: RubricItem<never>): string =>
  `- **${item.code} [${rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? 'M' : 'J'))
    .join(
      ' + '
    )}] — ${item.title}** — ${item.description}${item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''} (${item.sources.join(', ')})`
export const renderRubric = <Context>(rubric: RubricDefinition<Context>): string =>
  `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — ${rubric.concern}\n\n> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical; this file is generated from the in-memory catalogue.\n\n## Contents\n\n${renderContents(rubric)}\n\n${rubric.families.map((family) => `## ${family.code} — ${family.title}\n\n${family.description}\n\n${family.items.map(renderItem).join('\n')}`).join('\n\n')}\n`
export const publishRubric = async (): Promise<void> => writeFile(publicationPath, renderRubric(KI_ENGINEERING_RUBRIC))
if (import.meta.main) await publishRubric()
