import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createPaperclipAliasSession, type PaperclipAliasRubricContext } from '../contexts/alias.ts'
import { ALIAS } from './alias.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-agent-coordination-paperclip',
  concern: 'the deprecated Paperclip coordination alias',
  createSession: createPaperclipAliasSession,
  families: [RUBRIC, ALIAS]
} satisfies SkillRubricDefinition<PaperclipAliasRubricContext>
