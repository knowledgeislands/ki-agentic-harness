import type { AuditOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

export const outcomes = (values: AuditOutcome[], passMessage: string): RubricOutcomes<AuditOutcome> =>
  (values.length > 0 ? values : [{ status: 'PASS', message: passMessage }]) as unknown as RubricOutcomes<AuditOutcome>
