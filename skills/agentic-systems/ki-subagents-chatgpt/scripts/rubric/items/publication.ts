import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { CodexContext } from '../contexts/agents.ts'

export const RUBRIC = createRubricPublicationFamily<CodexContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
