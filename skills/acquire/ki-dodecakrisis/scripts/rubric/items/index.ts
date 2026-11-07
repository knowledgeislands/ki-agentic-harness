import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createDodecakrisisSession, type DodecakrisisContext } from '../contexts/dodecakrisis.ts'
import { CONFIG } from './configuration.ts'
import { LEARN } from './learning.ts'
import { MAILBOX } from './mailbox.ts'
import { RUBRIC } from './publication.ts'
import { RULES } from './rules.ts'

export default {
  contract: 1,
  name: 'ki-dodecakrisis',
  concern: 'D12 sorting rules, mailbox binding and learning',
  createSession: createDodecakrisisSession,
  families: [CONFIG, RULES, MAILBOX, LEARN, RUBRIC]
} satisfies SkillRubricDefinition<DodecakrisisContext>
