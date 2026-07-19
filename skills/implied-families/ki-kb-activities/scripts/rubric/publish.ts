import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_KB_ACTIVITIES_RUBRIC } from './items/index.ts'

const path = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const item = (value: RubricItem<never>) =>
  `- **${value.code} [${rubricTypes(value)
    .map((type) => (type === 'MECHANICAL' ? 'M' : 'J'))
    .join(
      ' + '
    )}] — ${value.title}** — ${value.description} (${value.sources.join(', ')})${value.judgment ? `\n  - _Review prompt:_ ${value.judgment.prompt}` : ''}`

export const renderRubric = <Context>(
  definition: RubricDefinition<Context>
) => `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — ${definition.concern}

> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical; this file is generated from the in-memory catalogue. Edit the item definitions, then rerun \`scripts/rubric/publish.ts\`.

Line-by-line criteria for auditing ${definition.name}. Classifications are derived from item aspects: **[M]** mechanical and **[J]** judgment. Sources are cited as declared by each canonical item.

## Contents

${definition.families
  .map(
    (family) => `- [${family.code} — ${family.title}](#${family.code.toLowerCase()}--${family.title.toLowerCase().replaceAll(' ', '-')})`
  )
  .join('\n')}

${definition.families
  .map(
    (family) =>
      `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(item).join('\n')}`
  )
  .join('\n\n')}
`

export const publishRubric = async () => writeFile(path, renderRubric(KI_KB_ACTIVITIES_RUBRIC))
if (import.meta.main) await publishRubric()
