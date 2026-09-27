import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'
import { codexMemoryContext, type MemoryContext } from './memory.ts'

export type HousekeepingRubricContext = { readonly rubric: RubricPublicationContext; readonly memory: MemoryContext }

export const createHousekeepingSession = (options: RubricContextOptions): RubricSession<HousekeepingRubricContext> => {
  const context: HousekeepingRubricContext = {
    rubric: { publication: options.publication },
    memory: codexMemoryContext(options)
  }
  return {
    subjects: [
      { families: ['STATE'], context: () => context },
      { families: ['MEMORY'], context: () => context },
      { families: ['RUBRIC'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
