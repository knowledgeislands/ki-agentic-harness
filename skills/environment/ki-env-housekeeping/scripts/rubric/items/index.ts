import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createHousekeepingSession, type HousekeepingContext } from '../contexts/housekeeping.ts'
import { HOUSE } from './housekeeping.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-env-housekeeping',
  concern: 'housekeeping rules every agent host shares',
  createSession: createHousekeepingSession,
  families: [RUBRIC, HOUSE]
} satisfies SkillRubricDefinition<HousekeepingContext>
