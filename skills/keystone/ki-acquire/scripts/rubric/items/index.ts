import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type AcquisitionContext, createAcquisitionSession } from '../contexts/acquisition.ts'
import { ACQUIRE } from './acquisition.ts'
import { CONFIG } from './configuration.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-acquire',
  concern: 'Source-independent faithful knowledge acquisition',
  createSession: createAcquisitionSession,
  families: [CONFIG, ACQUIRE, RUBRIC]
} satisfies SkillRubricDefinition<AcquisitionContext>
