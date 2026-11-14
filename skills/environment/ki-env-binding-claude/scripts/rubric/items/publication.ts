import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ClaudeBindingContext } from '../contexts/claude.ts'

export const RUBRIC = createRubricPublicationFamily<ClaudeBindingContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
