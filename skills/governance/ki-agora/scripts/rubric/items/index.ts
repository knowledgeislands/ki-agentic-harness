import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type AgoraRubricContext, createAgoraSession } from '../contexts/agora.ts'
import { CONFIG } from './configuration.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-agora',
  concern: 'Owner-declared Agora membership and inclusion',
  createSession: createAgoraSession,
  families: [RUBRIC, CONFIG]
} satisfies SkillRubricDefinition<AgoraRubricContext>
