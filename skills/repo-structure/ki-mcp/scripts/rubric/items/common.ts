import type { AuditOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
export const result = (status: AuditOutcome['status'], message: string, subject?: string): RubricOutcomes<AuditOutcome> => [
  { status, message, ...(subject ? { subject } : {}) } as AuditOutcome
]
export const outcomes = (value: readonly AuditOutcome[]): RubricOutcomes<AuditOutcome> => {
  if (!value.length) throw new Error('rubric item must return an outcome')
  return value as RubricOutcomes<AuditOutcome>
}
