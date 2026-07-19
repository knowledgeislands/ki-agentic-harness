import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { AgentsRubricContext } from '../contexts/agents.ts'
import { COLLISION } from './collision.ts'
import { DESCRIPTION } from './description.ts'
import { FRONTMATTER } from './frontmatter.ts'
import { LANE } from './lane.ts'
import { LAYOUT } from './layout.ts'
import { LINK } from './link.ts'
import { LONGEVITY } from './longevity.ts'
import { NAME } from './name.ts'
import { PROCESS } from './process.ts'
import { PROMPT } from './prompt.ts'

const context = (value: AgentsRubricContext): AgentsRubricContext => value

export const KI_AGENTS_RUBRIC: RubricDefinition<AgentsRubricContext> = {
  name: 'ki-agents',
  concern: 'Claude Code subagent definitions',
  families: [
    defineRubricFamily({ code: 'LAY', title: 'File and frontmatter layout', description: 'Agent definition layout and filename identity.', standard: 'standards.md#2-layout', selectContext: context, items: LAYOUT }),
    defineRubricFamily({ code: 'NAME', title: 'Frontmatter name', description: 'Agent name syntax, uniqueness, and role quality.', standard: 'standards.md#3-frontmatter-name', selectContext: context, items: NAME }),
    defineRubricFamily({ code: 'DESC', title: 'Frontmatter description', description: 'The agent delegation signal.', standard: 'standards.md#4-frontmatter-description', selectContext: context, items: DESCRIPTION }),
    defineRubricFamily({ code: 'FM', title: 'Frontmatter tools and model', description: 'Optional frontmatter and runtime choices.', standard: 'standards.md#5-frontmatter-optional-fields', selectContext: context, items: FRONTMATTER }),
    defineRubricFamily({ code: 'PROMPT', title: 'System-prompt quality', description: 'System-prompt presence, structure, and focus.', standard: 'standards.md#6-system-prompt-size--focus', selectContext: context, items: PROMPT }),
    defineRubricFamily({ code: 'LANE', title: 'Lane and delegation', description: 'Agent ownership, boundaries, and orchestration.', standard: 'standards.md#9-lane--delegation', selectContext: context, items: LANE }),
    defineRubricFamily({ code: 'LINK', title: 'Linking', description: 'Resolvable files and name-based composition.', standard: 'standards.md#10-linking', selectContext: context, items: LINK }),
    defineRubricFamily({ code: 'PROC', title: 'Process and evaluation', description: 'Representative and cross-model evaluation.', standard: 'standards.md#11-process--evaluation', selectContext: context, items: PROCESS }),
    defineRubricFamily({ code: 'LONG', title: 'Longevity', description: 'Runtime grounding and refresh discipline.', standard: 'standards.md#12-longevity', selectContext: context, items: LONGEVITY }),
    defineRubricFamily({ code: 'COLL', title: 'Cross-agent collision', description: 'Trigger collisions and reciprocal off-ramps.', standard: 'standards.md#13-cross-agent-collision', selectContext: context, items: COLLISION })
  ]
}

export const KI_AGENTS_FAMILY_CODES = KI_AGENTS_RUBRIC.families.map((family) => family.code)
