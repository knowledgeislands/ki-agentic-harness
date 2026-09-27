import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type CodexRubricContext, createCodexSession } from '../contexts/codex.ts'
import { NA } from './not-applicable.ts'
import { RUBRIC } from './publication.ts'
import { SURF } from './surface.ts'
export default {
  contract: 1,
  name: 'ki-tokenomics-chatgpt',
  concern: 'Bounded Codex tokenomics evidence',
  createSession: createCodexSession,
  families: [SURF, NA, RUBRIC]
} satisfies SkillRubricDefinition<CodexRubricContext>
