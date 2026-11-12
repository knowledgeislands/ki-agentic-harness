import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const RUBRIC = createRubricPublicationFamily<KnowledgeGraphContext>(
  ({ rubric }) => rubric,
  '../../ki-skills/references/standard-rubric-authoring.md',
  ['../../ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
