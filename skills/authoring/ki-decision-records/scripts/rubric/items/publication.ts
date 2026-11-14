import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { DecisionRecordsRubricContext } from '../contexts/decision-records.ts'

export const RUBRIC = createRubricPublicationFamily<DecisionRecordsRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
