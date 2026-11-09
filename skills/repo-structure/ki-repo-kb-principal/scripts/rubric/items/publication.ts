import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { PrincipalContext } from '../contexts/principal.ts'

export const RUBRIC = createRubricPublicationFamily<PrincipalContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
