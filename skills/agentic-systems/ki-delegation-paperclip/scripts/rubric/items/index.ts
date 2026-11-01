import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createPaperclipCoordinationSession, type PaperclipCoordinationContext } from '../contexts/coordination.ts'
import { COORD } from './coordination.ts'
import { ORG } from './organisation.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-delegation-paperclip',
  concern: 'Knowledge Islands delegation through Paperclip',
  createSession: createPaperclipCoordinationSession,
  families: [COORD, ORG, RUBRIC]
} satisfies SkillRubricDefinition<PaperclipCoordinationContext>
