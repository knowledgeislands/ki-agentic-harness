import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { WebsiteAppContext } from '../contexts/website-app.ts'
export const RUBRIC = createRubricPublicationFamily<WebsiteAppContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
