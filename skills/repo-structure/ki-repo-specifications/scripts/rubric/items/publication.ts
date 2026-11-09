import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { SpecificationsContext } from '../contexts/specifications.ts'

export const RUBRIC = createRubricPublicationFamily<SpecificationsContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
