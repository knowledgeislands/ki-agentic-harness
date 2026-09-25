import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createPaperclipCoordinationSession, type PaperclipCoordinationContext } from '../contexts/coordination.ts'
import { COORD } from './coordination.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-agent-coordination-paperclip',
  concern: 'Knowledge Islands coordination through Paperclip',
  createSession: createPaperclipCoordinationSession,
  families: [COORD, RUBRIC]
} satisfies SkillRubricDefinition<PaperclipCoordinationContext>
