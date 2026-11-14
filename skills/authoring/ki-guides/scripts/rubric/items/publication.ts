import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { GuidesRubricContext } from '../contexts/guides.ts'

export const RUBRIC = createRubricPublicationFamily<GuidesRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
