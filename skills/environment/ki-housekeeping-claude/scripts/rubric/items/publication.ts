import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { HousekeepingRubricContext } from '../contexts/housekeeping.ts'

export const RUBRIC = createRubricPublicationFamily<HousekeepingRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
