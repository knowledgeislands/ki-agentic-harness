import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { WebsiteContext } from '../contexts/website.ts'

export const RUBRIC = createRubricPublicationFamily<WebsiteContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
