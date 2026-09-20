import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ChatGPTRubricContext } from '../contexts/chatgpt.ts'

export const RUBRIC = createRubricPublicationFamily<ChatGPTRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
