import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_KB_RUBRIC } from './items/index.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const classification = (item: RubricItem<never>): string =>
  rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? 'M' : 'J'))
    .join(' + ')
export const renderRubric = <Context>(
  rubric: RubricDefinition<Context>
): string => `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — ${rubric.concern}

> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical; this file is generated from that catalogue.

## Contents

${rubric.families
  .map(
    (family) =>
      `- [${family.code} — ${family.title}](#${family.code.toLowerCase()}--${family.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')})`
  )
  .join('\n')}

${rubric.families.map((family) => `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map((item) => `- **${item.code} [${classification(item)}] — ${item.title}** — ${item.description}${item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''} (${item.sources.join(', ')})`).join('\n')}`).join('\n\n')}
`
export const publishRubric = async (): Promise<void> => writeFile(publicationPath, renderRubric(KI_KB_RUBRIC))
if (import.meta.main) await publishRubric()
