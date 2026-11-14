import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { EngineeringRubricContext } from '../contexts/engineering.ts'

export const RUBRIC = createRubricPublicationFamily<EngineeringRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
