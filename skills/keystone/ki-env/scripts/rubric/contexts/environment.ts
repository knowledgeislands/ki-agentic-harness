import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** The environment rubric reviews a repository's environment declarations by judgment; its only evidence is the rubric publication. */
export type EnvironmentContext = { readonly rubric: RubricPublicationContext }

export const createEnvironmentSession = ({ publication }: RubricContextOptions): RubricSession<EnvironmentContext> => {
  const context: EnvironmentContext = { rubric: { publication } }
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['ENV'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
