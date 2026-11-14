import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createDiagramsSession, type DiagramsRubricContext } from '../contexts/diagrams.ts'
import { DIAG } from './diagrams.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-diagrams',
  concern: 'repository living diagrams',
  createSession: createDiagramsSession,
  families: [RUBRIC, DIAG]
} satisfies SkillRubricDefinition<DiagramsRubricContext>
