import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { AuthoringRubricContext } from '../contexts/authoring.ts'

export const RUBRIC = createRubricPublicationFamily<AuthoringRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
