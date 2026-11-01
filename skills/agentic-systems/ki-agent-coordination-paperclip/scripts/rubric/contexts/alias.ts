import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }

export type PaperclipAliasRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly alias: OutcomeContext
}

/** The deprecated `ki-agent-coordination-paperclip` declaration warns and names `ki-delegation-paperclip`; it inspects nothing else. */
export const createPaperclipAliasSession = ({
  configuration,
  publication
}: RubricContextOptions): RubricSession<PaperclipAliasRubricContext> => {
  const context: PaperclipAliasRubricContext = {
    rubric: { publication },
    alias: {
      outcomes: configuration
        ? [
            {
              status: 'VIOLATION',
              message:
                'ki-agent-coordination-paperclip is a deprecated alias: declare [skills.ki-delegation-paperclip] in its place, keeping organisation_code, so the Paperclip checks run',
              subject: '.ki.toml'
            }
          ]
        : [{ status: 'NOT_APPLICABLE', message: 'No ki-agent-coordination-paperclip declaration active.' }]
    }
  }
  return {
    subjects: [{ subject: '.ki.toml', families: ['RUBRIC', 'ALIAS'], context: () => context }],
    proposal: () => ({ writes: [] })
  }
}
