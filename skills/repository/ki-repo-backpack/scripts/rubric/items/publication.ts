import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { HarnessRubricContext } from '../contexts/harness.ts'

export const RUBRIC = createRubricPublicationFamily<HarnessRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
