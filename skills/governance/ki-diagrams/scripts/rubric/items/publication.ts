import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { DiagramsRubricContext } from '../contexts/diagrams.ts'

export const RUBRIC = createRubricPublicationFamily<DiagramsRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
