import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { auditOutcome, conformOutcome, type RoadmapContext } from '../contexts/roadmap.ts'

export const outcomes = <T>(values: readonly T[], fallback: T): RubricOutcomes<T> => [values[0] ?? fallback, ...values.slice(1)]

export const audit = (code: string, context: RoadmapContext): RubricOutcomes<AuditOutcome> =>
  outcomes(context.audit.filter((finding) => finding.area === code).map(auditOutcome), { status: 'PASS', message: 'No violations found.' })

export const conform = (code: string, context: RoadmapContext): RubricOutcomes<ConformOutcome> =>
  outcomes(context.conform().filter((finding) => finding.area === code).map(conformOutcome), { status: 'PASS', message: 'No changes required.' })

export const mechanical = (code: string, title: string, description: string, level: 'FAIL' | 'WARN' = 'FAIL', conforming = false): RubricItem<RoadmapContext> => ({
  code,
  title,
  description,
  sources: [code.startsWith('PLAN-') ? 'plan-format.md' : 'standards.md'],
  mechanical: {
    level,
    audit: { phase: 'INSPECT', run: (context) => audit(code, context) },
    ...(conforming ? { conform: { phase: 'PREPARE' as const, run: (context: RoadmapContext) => conform(code, context) } } : {})
  }
})
