import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

export type OutcomeContext = { readonly outcomes: readonly AuditOutcome[] }

export type WorkFolderAliasRubricContext = {
  readonly rubric: RubricPublicationContext
  readonly alias: OutcomeContext
}

/** The deprecated `ki-work-folder` declaration warns and names `ki-work-package`; it inspects nothing else. */
export const createWorkFolderAliasSession = ({
  configuration,
  publication
}: RubricContextOptions): RubricSession<WorkFolderAliasRubricContext> => {
  const context: WorkFolderAliasRubricContext = {
    rubric: { publication },
    alias: {
      outcomes: configuration
        ? [
            {
              status: 'VIOLATION',
              message:
                'ki-work-folder is a deprecated alias: declare [skills.ki-work-package] in its place so the work-package checks run',
              subject: '.ki.toml'
            }
          ]
        : [{ status: 'NOT_APPLICABLE', message: 'No ki-work-folder declaration is active.' }]
    }
  }
  return {
    subjects: [{ subject: '.ki.toml', families: ['RUBRIC', 'ALIAS'], context: () => context }],
    proposal: () => ({ writes: [] })
  }
}
