import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { McpRubricContext } from '../contexts/mcp.ts'

export const RUBRIC = createRubricPublicationFamily<McpRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
