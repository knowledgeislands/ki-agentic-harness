import type { AuditOutcome, ConformOutcome, RubricMode, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { collectAuditFindings, type RepoEvidenceFinding } from './audit.ts'
import { collectConformFindings } from './conform.ts'

type RepoOutcome = AuditOutcome | ConformOutcome

export type RepoRubricContext = {
  mode: RubricMode
  outcomes: (code: string) => RubricOutcomes<RepoOutcome>
}

const outcome = (finding: RepoEvidenceFinding): RepoOutcome => {
  if (finding.level === 'FAIL' || finding.level === 'WARN') {
    return {
      status: 'VIOLATION',
      level: finding.level,
      message: finding.message,
      ...(finding.subject ? { subject: finding.subject } : {})
    }
  }
  return {
    status: finding.level,
    message: finding.message,
    ...(finding.subject ? { subject: finding.subject } : {})
  }
}

const GITHUB_CODES = new Set([
  'FILES-1',
  'FILES-2',
  'FILES-3',
  'GH-1',
  'GH-2',
  'GH-3',
  'PKG-1',
  'MERGE-1',
  'TOGGLE-1',
  'VIS-1',
  'TOPICS-1',
  'BP-1',
  'DEP-1',
  'SEC-1',
  'ACT-1',
  'CHECKS-1',
  'COV-1',
  'STRUCT-1',
  'STRUCT-2'
])

const contextFrom = (mode: RubricMode, findings: readonly RepoEvidenceFinding[]): RepoRubricContext => {
  const githubUnavailable = findings.some((finding) => finding.code === 'ACCESS-1' && finding.level === 'NOT_APPLICABLE')
  return {
    mode,
    outcomes: (code) => {
      const matched = findings.filter((finding) => finding.code === code).map(outcome)
      if (matched.length > 0) return matched as unknown as RubricOutcomes<RepoOutcome>
      if (mode === 'audit' && githubUnavailable && GITHUB_CODES.has(code)) {
        return [{ status: 'NOT_APPLICABLE', message: 'GitHub evidence was unavailable for this run' }]
      }
      return [
        mode === 'audit'
          ? { status: 'PASS', message: 'criterion satisfied' }
          : { status: 'NOT_APPLICABLE', message: 'no conform action was required or available' }
      ]
    }
  }
}

export const createAuditContext = (argv: readonly string[]): { target: string; context: RepoRubricContext; educate?: string } => {
  const collection = collectAuditFindings(argv)
  return {
    target: collection.target,
    context: contextFrom('audit', collection.findings),
    ...(collection.educate ? { educate: collection.educate } : {})
  }
}

export const createConformContext = (argv: readonly string[]): { target: string; context: RepoRubricContext } => {
  const collection = collectConformFindings(argv)
  return { target: collection.target, context: contextFrom('conform', collection.findings) }
}
