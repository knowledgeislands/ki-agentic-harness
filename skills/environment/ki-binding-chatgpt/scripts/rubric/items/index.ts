import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type CodexBindingContext, createCodexBindingSession } from '../contexts/codex.ts'
import { CODEXBIND } from './codexbind.ts'
import { RUBRIC } from './publication.ts'
export default {
  contract: 1,
  name: 'ki-binding-chatgpt',
  concern: 'Knowledge Islands Codex MCP binding',
  createSession: createCodexBindingSession,
  families: [CODEXBIND, RUBRIC]
} satisfies SkillRubricDefinition<CodexBindingContext>
