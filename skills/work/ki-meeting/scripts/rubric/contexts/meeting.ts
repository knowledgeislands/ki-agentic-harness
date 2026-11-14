import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** The meeting rubric reviews a meeting by judgment; its only evidence is the rubric publication. */
export type MeetingContext = { readonly rubric: RubricPublicationContext }

export const createMeetingSession = ({ publication }: RubricContextOptions): RubricSession<MeetingContext> => {
  const context: MeetingContext = { rubric: { publication } }
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      { families: ['MEETING'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
