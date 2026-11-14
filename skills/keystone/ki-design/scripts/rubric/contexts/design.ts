import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** The design rubric reviews design work by judgment; its only evidence is the rubric publication. */
export type DesignContext = { readonly rubric: RubricPublicationContext }

export const createDesignSession = ({ publication }: RubricContextOptions): RubricSession<DesignContext> => {
  const context: DesignContext = { rubric: { publication } }
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['DESIGN'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
