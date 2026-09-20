import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { type ChatGPTRubricContext, createChatGPTSession } from '../contexts/chatgpt.ts'
import { FIDELITY } from './fidelity.ts'
import { RUBRIC } from './publication.ts'
import { RETIRE } from './retirement.ts'
import { ROUTING } from './routing.ts'
import { SOURCE } from './source.ts'

export default {
  contract: 1,
  name: 'ki-acquire-chatgpt',
  concern: 'Incremental and faithful ChatGPT project acquisition',
  createSession: createChatGPTSession,
  families: [SOURCE, ROUTING, FIDELITY, RETIRE, RUBRIC]
} satisfies SkillRubricDefinition<ChatGPTRubricContext>
