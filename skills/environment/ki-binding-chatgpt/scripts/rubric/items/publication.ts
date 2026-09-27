import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { CodexBindingContext } from '../contexts/codex.ts'

export const RUBRIC = createRubricPublicationFamily<CodexBindingContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
