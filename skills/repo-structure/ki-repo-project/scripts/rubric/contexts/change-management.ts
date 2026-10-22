import type { RubricContextOptions, RubricSession } from '../../shared/rubric.ts'
import type { ProjectRubricContext } from '../types.ts'
import { inspectProjectGate } from './commit-gate.ts'

export const createProjectSession = (options: RubricContextOptions): RubricSession<ProjectRubricContext> => {
  const context: ProjectRubricContext = { gate: inspectProjectGate(options.repository) }
  return {
    subjects: [{ families: ['PROJECT', 'GATE'], context: () => context }],
    proposal: () => ({ writes: [] })
  }
}
