import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type CoordinationRubricContext, createCoordinationSession } from '../contexts/coordination.ts'
import { RUBRIC } from './publication.ts'
import { COORD } from './threads.ts'

export default {
  contract: 1,
  name: 'ki-coordination',
  concern: 'coordinating threads',
  createSession: createCoordinationSession,
  families: [RUBRIC, COORD]
} satisfies SkillRubricDefinition<CoordinationRubricContext>
