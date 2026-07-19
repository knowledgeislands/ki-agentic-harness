import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_KB_STREAMS_RUBRIC } from './items/index.ts'
const destination = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
export const renderRubric = <Context>(rubric: RubricDefinition<Context>): string =>
  `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — ${rubric.concern}\n\n> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical.\n\n## Contents\n\n${rubric.families.map((family) => `- [${family.code} — ${family.title}](#${family.code.toLowerCase()}--${family.title.replaceAll(' ', '-')})`).join('\n')}\n\n${rubric.families
    .map(
      (family) =>
        `## ${family.code} — ${family.title}\n\n${family.description}\n\n${family.items
          .map(
            (item: RubricItem<never>) =>
              `- **${item.code} [${rubricTypes(item)
                .map((type) => (type === 'MECHANICAL' ? 'M' : 'J'))
                .join(
                  ' + '
                )}] — ${item.title}** — ${item.description}${item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''} (${item.sources.join(', ')})`
          )
          .join('\n')}`
    )
    .join('\n\n')}\n`
export const publishRubric = async (): Promise<void> => writeFile(destination, renderRubric(KI_KB_STREAMS_RUBRIC))
if (import.meta.main) await publishRubric()
