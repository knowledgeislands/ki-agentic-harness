import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { CoordinationRubricContext } from '../contexts/coordination.ts'

export const RUBRIC = createRubricPublicationFamily<CoordinationRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
