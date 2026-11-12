import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createKnowledgeGraphSession, type KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'
import { CARD } from './cards.ts'
import { CONFIG } from './configuration.ts'
import { CURATE } from './curation.ts'
import { DISPATCH } from './dispatch.ts'
import { GRAPH } from './graph.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-knowledge-graph',
  concern: 'Knowledge graphs: root definition, cards, links, curation and dispatch',
  createSession: createKnowledgeGraphSession,
  families: [CONFIG, CARD, CURATE, GRAPH, DISPATCH, RUBRIC]
} satisfies SkillRubricDefinition<KnowledgeGraphContext>
