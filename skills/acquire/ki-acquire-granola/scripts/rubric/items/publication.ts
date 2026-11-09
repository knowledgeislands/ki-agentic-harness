import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { GranolaRubricContext } from '../contexts/granola.ts'

export const RUBRIC = createRubricPublicationFamily<GranolaRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
