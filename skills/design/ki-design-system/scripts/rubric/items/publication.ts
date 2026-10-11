import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { DesignRubricContext } from '../contexts/design.ts'

export const RUBRIC = createRubricPublicationFamily<DesignRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
