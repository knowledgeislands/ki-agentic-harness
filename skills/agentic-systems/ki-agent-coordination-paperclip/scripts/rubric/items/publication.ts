import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { RetiredPaperclipRubricContext } from '../contexts/retired.ts'

export const RUBRIC = createRubricPublicationFamily<RetiredPaperclipRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
