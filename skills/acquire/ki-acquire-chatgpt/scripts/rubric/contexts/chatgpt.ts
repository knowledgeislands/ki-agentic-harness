import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

export type ChatGPTRubricContext = {
  readonly rubric: RubricPublicationContext
}

export const createChatGPTSession = ({ publication }: RubricContextOptions): RubricSession<ChatGPTRubricContext> => {
  const context: ChatGPTRubricContext = { rubric: { publication } }

  return {
    subjects: [
      { families: ['SOURCE'], context: () => context },
      { families: ['ROUTING'], context: () => context },
      { families: ['FIDELITY'], context: () => context },
      { families: ['RETIRE'], context: () => context },
      { families: ['RUBRIC'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
