import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

export type AcquisitionContext = {
  readonly configurationKeys: readonly string[]
  readonly rubric: RubricPublicationContext
}

export const createAcquisitionSession = ({
  configuration,
  publication
}: RubricContextOptions): RubricSession<AcquisitionContext> => {
  const context: AcquisitionContext = { configurationKeys: Object.keys(configuration).sort(), rubric: { publication } }
  return {
    subjects: [
      { families: ['CONFIG'], context: () => context },
      { families: ['ACQUIRE'], context: () => context },
      { families: ['RUBRIC'], context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
