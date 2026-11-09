import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ClaudeContext } from '../contexts/agents.ts'

export const RUBRIC = createRubricPublicationFamily<ClaudeContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
