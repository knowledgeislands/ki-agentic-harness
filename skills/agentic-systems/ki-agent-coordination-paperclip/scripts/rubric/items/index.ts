import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createRetiredPaperclipSession, type RetiredPaperclipRubricContext } from '../contexts/retired.ts'
import { RUBRIC } from './publication.ts'
import { RETIRED } from './retired.ts'

export default {
  contract: 1,
  name: 'ki-agent-coordination-paperclip',
  concern: 'the retired Paperclip delegation declaration',
  createSession: createRetiredPaperclipSession,
  families: [RUBRIC, RETIRED]
} satisfies SkillRubricDefinition<RetiredPaperclipRubricContext>
