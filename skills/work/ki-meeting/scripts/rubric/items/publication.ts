import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { MeetingContext } from '../contexts/meeting.ts'

export const RUBRIC = createRubricPublicationFamily<MeetingContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
