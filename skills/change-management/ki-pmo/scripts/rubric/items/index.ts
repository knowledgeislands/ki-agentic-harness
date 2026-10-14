import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createPmoSession, type PmoRubricContext } from '../contexts/pmo.ts'
import { RUBRIC } from './publication.ts'
import { PMO } from './threads.ts'

export default {
  contract: 1,
  name: 'ki-pmo',
  concern: 'coordinating threads',
  createSession: createPmoSession,
  families: [RUBRIC, PMO]
} satisfies SkillRubricDefinition<PmoRubricContext>
