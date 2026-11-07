import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { DodecakrisisContext } from '../contexts/dodecakrisis.ts'

export const RUBRIC = createRubricPublicationFamily<DodecakrisisContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
