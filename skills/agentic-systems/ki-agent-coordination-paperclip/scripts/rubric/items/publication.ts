import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { PaperclipAliasRubricContext } from '../contexts/alias.ts'

export const RUBRIC = createRubricPublicationFamily<PaperclipAliasRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
