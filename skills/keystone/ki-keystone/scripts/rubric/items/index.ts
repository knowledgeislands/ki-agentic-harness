import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createKeystoneSession, type KeystoneContext } from '../contexts/keystone.ts'
import { KEYSTONE } from './keystone.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-keystone',
  concern: 'the guild tree of a skill collection',
  createSession: createKeystoneSession,
  families: [RUBRIC, KEYSTONE]
} satisfies SkillRubricDefinition<KeystoneContext>
