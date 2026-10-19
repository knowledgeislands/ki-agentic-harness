import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { WorkFolderAliasRubricContext } from '../contexts/alias.ts'

export const RUBRIC = createRubricPublicationFamily<WorkFolderAliasRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
