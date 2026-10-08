import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'
import { linkageOutcomes, worktreeBaseOutcomes } from './local-evidence.ts'

export type PaperclipCoordinationContext = {
  rubric: RubricPublicationContext
  organisation: { outcomes: readonly AuditOutcome[] }
  /** `COORD-3` repository-side task-link evidence; the coordination plane is never read. */
  linkage: { outcomes: readonly AuditOutcome[] }
  /** `COORD-15` location and base of the selected checkout when it is a linked worktree. */
  worktreeBase: { outcomes: readonly AuditOutcome[] }
}

export const createPaperclipCoordinationSession = ({
  configuration,
  publication,
  repository
}: RubricContextOptions): RubricSession<PaperclipCoordinationContext> => {
  const outcomes: AuditOutcome[] = []
  for (const key of Object.keys(configuration))
    if (key !== 'organisation_code')
      outcomes.push({
        status: 'VIOLATION',
        message: `unrecognised ki-agent-coordination-paperclip configuration key ${key}`,
        subject: '.ki.toml'
      })
  if (typeof configuration.organisation_code !== 'string' || !/^[A-Z][A-Z0-9]*$/.test(configuration.organisation_code))
    outcomes.push({
      status: 'VIOLATION',
      message: 'organisation_code must be a non-empty uppercase organisation identifier',
      subject: '.ki.toml'
    })
  const context: PaperclipCoordinationContext = {
    rubric: { publication },
    organisation: {
      outcomes: outcomes.length
        ? outcomes
        : [{ status: 'PASS', message: 'Organisation code is explicitly configured.' }]
    },
    linkage: { outcomes: linkageOutcomes(repository) },
    worktreeBase: { outcomes: worktreeBaseOutcomes(repository) }
  }
  return {
    subjects: [
      {
        families: ['COORD', 'ORG'],
        context: () => context,
        subject: 'KI–Paperclip coordination arrangement'
      },
      { families: ['RUBRIC'], context: () => context, subject: 'ki-agent-coordination-paperclip' }
    ],
    proposal: () => ({ writes: [] })
  }
}
