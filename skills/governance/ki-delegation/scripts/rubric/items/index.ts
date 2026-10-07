import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createDelegationSession } from '../contexts/delegation.ts'
import type { DelegationRubricContext } from '../types.ts'
import { RUN } from './background-runs.ts'
import { PACKET } from './delegation.ts'

export default {
  contract: 1,
  name: 'ki-delegation',
  concern: 'delegation packets and background runs',
  createSession: createDelegationSession,
  families: [PACKET, RUN]
} satisfies SkillRubricDefinition<DelegationRubricContext>
