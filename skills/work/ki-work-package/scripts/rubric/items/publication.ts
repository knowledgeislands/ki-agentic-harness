import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { WorkPackageRubricContext } from '../contexts/work-package.ts'

export const RUBRIC = createRubricPublicationFamily<WorkPackageRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
