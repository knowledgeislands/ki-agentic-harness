import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { DodecakrisisContext } from '../contexts/dodecakrisis.ts'

export const RUBRIC = createRubricPublicationFamily<DodecakrisisContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
