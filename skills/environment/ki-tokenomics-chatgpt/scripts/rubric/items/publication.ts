import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { CodexRubricContext } from '../contexts/codex.ts'

export const RUBRIC = createRubricPublicationFamily<CodexRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
