import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_HOMEBREW_TAP_RUBRIC } from './items/index.ts'

const output = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const renderItem = (item: RubricItem<never>): string =>
  `- **${item.code} [${rubricTypes(item)
    .map((type) => (type === 'MECHANICAL' ? 'M' : 'J'))
    .join(
      ' + '
    )}] — ${item.title}** — ${item.description} (${item.sources.join(', ')})${item.judgment ? `\n  - _Review prompt:_ ${item.judgment.prompt}` : ''}`
export const renderRubric = <Context>(rubric: RubricDefinition<Context>): string =>
  `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — ${rubric.concern}\n\n> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical.\n\n${rubric.families.map((family) => `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(renderItem).join('\n')}`).join('\n\n')}\n`
export const publishRubric = (): void => writeFileSync(output, renderRubric(KI_HOMEBREW_TAP_RUBRIC))
if (import.meta.main) publishRubric()
