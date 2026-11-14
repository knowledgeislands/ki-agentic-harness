import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { StreamsRubricContext } from '../contexts/streams.ts'

export const RUBRIC = createRubricPublicationFamily<StreamsRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
