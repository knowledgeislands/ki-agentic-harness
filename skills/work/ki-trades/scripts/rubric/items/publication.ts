import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { TradesRubricContext } from '../contexts/trades.ts'

export const RUBRIC = createRubricPublicationFamily<TradesRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
