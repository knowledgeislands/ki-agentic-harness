import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createProjectSession } from '../contexts/change-management.ts'
import type { ProjectRubricContext } from '../types.ts'
import { GATE } from './gate.ts'
import { PROJECT } from './selection.ts'

export default {
  contract: 1,
  name: 'ki-repo-project',
  concern: 'Project repository orientation',
  createSession: createProjectSession,
  families: [PROJECT, GATE]
} satisfies SkillRubricDefinition<ProjectRubricContext>
