import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

export type KnowledgeGraphContext = {
  readonly configurationKeys: readonly string[]
  readonly rubric: RubricPublicationContext
}

export const createKnowledgeGraphSession = ({
  configuration,
  publication
}: RubricContextOptions): RubricSession<KnowledgeGraphContext> => {
  const context: KnowledgeGraphContext = {
    configurationKeys: Object.keys(configuration).sort(),
    rubric: { publication }
  }
  return {
    subjects: [
      { families: ['CONFIG'], context: () => context },
      { families: ['CARD'], context: () => context },
      { families: ['CURATE'], context: () => context },
      { families: ['GRAPH'], context: () => context },
      { families: ['DISPATCH'], context: () => context },
      { families: ['RUBRIC'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
