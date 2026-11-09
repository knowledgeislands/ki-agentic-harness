import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { DesignRubricContext } from '../contexts/design.ts'

export const RUBRIC = createRubricPublicationFamily<DesignRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
