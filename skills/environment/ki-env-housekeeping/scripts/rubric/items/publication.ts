import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { HousekeepingContext } from '../contexts/housekeeping.ts'

export const RUBRIC = createRubricPublicationFamily<HousekeepingContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
