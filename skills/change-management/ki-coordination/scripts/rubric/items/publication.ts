import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { CoordinationRubricContext } from '../contexts/coordination.ts'

export const RUBRIC = createRubricPublicationFamily<CoordinationRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
