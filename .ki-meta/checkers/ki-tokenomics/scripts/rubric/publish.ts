import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RubricDefinition, type RubricItem, rubricTypes } from '../vendored/ki-skills/rubric.ts'
import { KI_TOKENOMICS_RUBRIC } from './items/index.ts'
const output = fileURLToPath(new URL('../../references/rubric.md', import.meta.url))
const item = (value: RubricItem<never>): string => `- **${value.code} [${rubricTypes(value).map((type) => type === 'MECHANICAL' ? 'M' : 'J').join(' + ')}] — ${value.title}** — ${value.description} (${value.sources.join(', ')})${value.judgment ? `\n  - _Review prompt:_ ${value.judgment.prompt}` : ''}`
export const renderRubric = <Context>(rubric: RubricDefinition<Context>): string => `<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->\n\n# Generated rubric — ${rubric.concern}\n\n> **Generated publication.** TypeScript rubric items under \`scripts/rubric/items/\` are canonical.\n\n${rubric.families.map((family) => `## ${family.code} — ${family.title}\n\n→ [standard](${family.standard})\n\n${family.description}\n\n${family.items.map(item).join('\n')}`).join('\n\n')}\n`
export const publishRubric = async (): Promise<void> => writeFile(output, renderRubric(KI_TOKENOMICS_RUBRIC))
if (import.meta.main) await publishRubric()
