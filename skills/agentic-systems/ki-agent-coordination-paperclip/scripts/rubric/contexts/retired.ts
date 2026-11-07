import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }

export type RetiredPaperclipRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly retired: OutcomeContext
}

/** A `ki-agent-coordination-paperclip` declaration warns that the skill is retired and asks for its removal; it inspects nothing else. */
export const createRetiredPaperclipSession = ({
  configuration,
  publication
}: RubricContextOptions): RubricSession<RetiredPaperclipRubricContext> => {
  const context: RetiredPaperclipRubricContext = {
    rubric: { publication },
    retired: {
      outcomes: configuration
        ? [
            {
              status: 'VIOLATION',
              message:
                'ki-agent-coordination-paperclip is retired: remove [skills.ki-agent-coordination-paperclip] from .ki.toml',
              subject: '.ki.toml'
            }
          ]
        : [{ status: 'NOT_APPLICABLE', message: 'No ki-agent-coordination-paperclip declaration active.' }]
    }
  }
  return {
    subjects: [{ subject: '.ki.toml', families: ['RUBRIC', 'RETIRED'], context: () => context }],
    proposal: () => ({ writes: [] })
  }
}
