import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { AcquisitionContext } from '../contexts/acquisition.ts'

export const RUBRIC = createRubricPublicationFamily<AcquisitionContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
