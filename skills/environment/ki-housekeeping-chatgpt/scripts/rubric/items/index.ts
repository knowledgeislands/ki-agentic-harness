import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createHousekeepingSession, type HousekeepingRubricContext } from '../contexts/housekeeping.ts'
import { MEMORY } from './memory.ts'
import { RUBRIC } from './publication.ts'
import { STATE } from './safety.ts'

export default {
  contract: 1,
  name: 'ki-housekeeping-chatgpt',
  concern: 'Safe repository-scoped ChatGPT session housekeeping',
  createSession: createHousekeepingSession,
  families: [STATE, MEMORY, RUBRIC]
} satisfies SkillRubricDefinition<HousekeepingRubricContext>
