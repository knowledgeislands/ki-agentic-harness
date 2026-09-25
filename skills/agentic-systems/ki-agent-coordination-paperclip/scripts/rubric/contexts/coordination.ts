import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

export type PaperclipCoordinationContext = { rubric: RubricPublicationContext }

export const createPaperclipCoordinationSession = ({
  publication
}: RubricContextOptions): RubricSession<PaperclipCoordinationContext> => {
  const context: PaperclipCoordinationContext = { rubric: { publication } }
  return {
    subjects: [
      {
        families: ['COORD'],
        context: () => context,
        subject: 'KI–Paperclip coordination arrangement'
      },
      { families: ['RUBRIC'], context: () => context, subject: 'ki-agent-coordination-paperclip' }
    ],
    proposal: () => ({ writes: [] })
  }
}
