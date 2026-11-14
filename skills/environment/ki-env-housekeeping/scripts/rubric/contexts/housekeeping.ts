import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** The shared housekeeping rubric reviews by judgment; each runtime skill checks its own host's evidence mechanically. */
export type HousekeepingContext = { readonly rubric: RubricPublicationContext }

export const createHousekeepingSession = ({
  publication
}: RubricContextOptions): RubricSession<HousekeepingContext> => {
  const context: HousekeepingContext = { rubric: { publication } }
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['HOUSE'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
