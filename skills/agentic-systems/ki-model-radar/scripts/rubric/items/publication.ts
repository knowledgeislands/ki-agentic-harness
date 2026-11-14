import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ModelRadarRubricContext } from '../contexts/radar.ts'

export const RUBRIC = createRubricPublicationFamily<ModelRadarRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
