import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type CodexContext, createCodexSession } from '../contexts/agents.ts'
import { CODEX } from './codex.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-subagents-chatgpt',
  concern: 'Codex standalone TOML source projections',
  createSession: createCodexSession,
  families: [CODEX, RUBRIC]
} satisfies SkillRubricDefinition<CodexContext>
