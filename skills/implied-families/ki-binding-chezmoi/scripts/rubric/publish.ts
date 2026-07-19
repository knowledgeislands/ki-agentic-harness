import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_BINDING_CHEZMOI_RUBRIC } from './items/index.ts'

const publicationPath = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const item = (rule: RubricItem<never>) =>
  `- **${rule.code} [${rubricTypes(rule)
    .map((type) => (type === 'MECHANICAL' ? 'M' : 'J'))
    .join(
      ' + '
    )}] — ${rule.title}** — ${rule.description} (${rule.sources.join(', ')})${rule.judgment ? `\n  - _Review prompt:_ ${rule.judgment.prompt}` : ''}`
export const renderRubric = <Context>(rubric: RubricDefinition<Context>): string =>
  `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — ${rubric.concern}\n\n> **Generated publication.** The TypeScript rubric items under \`scripts/rubric/items/\` are canonical. Edit those definitions, then rerun \`scripts/rubric/publish.ts\`.\n\n${rubric.families.map((family) => `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(item).join('\n')}`).join('\n\n')}\n`
export const publishRubric = async (): Promise<void> => writeFile(publicationPath, renderRubric(KI_BINDING_CHEZMOI_RUBRIC))
if (import.meta.main) await publishRubric()
