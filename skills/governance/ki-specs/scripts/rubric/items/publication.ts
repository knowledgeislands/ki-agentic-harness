import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { SpecsRubricContext } from '../contexts/specs.ts'

export const RUBRIC = createRubricPublicationFamily<SpecsRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
