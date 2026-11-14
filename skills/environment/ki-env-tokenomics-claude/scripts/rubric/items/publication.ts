import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ClaudeRubricContext } from '../contexts/claude.ts'

export const RUBRIC = createRubricPublicationFamily<ClaudeRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
