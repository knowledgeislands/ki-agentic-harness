import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createEnvironmentSession, type EnvironmentContext } from '../contexts/environment.ts'
import { ENV } from './environment.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-env',
  concern: 'where agents run',
  createSession: createEnvironmentSession,
  families: [RUBRIC, ENV]
} satisfies SkillRubricDefinition<EnvironmentContext>
