import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { EnvironmentContext } from '../contexts/environment.ts'

export const RUBRIC = createRubricPublicationFamily<EnvironmentContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
