import type { AuditOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { KbRubricContext } from '../contexts/kb.ts'

type Code = `${string}-${string}`
const SOURCE = ['standards.md'] as const
const audit = (code: Code, context: KbRubricContext): RubricOutcomes<AuditOutcome> => {
  const outcomes = context.auditFindings
    .filter((finding) => finding.code === code)
    .map((finding) => ({
      status:
        finding.level === 'PASS'
          ? ('PASS' as const)
          : finding.level === 'NOT_APPLICABLE'
            ? ('NOT_APPLICABLE' as const)
            : finding.level === 'FAIL' || finding.level === 'WARN'
              ? ('VIOLATION' as const)
              : ('INFO' as const),
      ...(finding.level === 'FAIL' || finding.level === 'WARN' ? { level: finding.level } : {}),
      message: finding.message,
      ...(finding.subject ? { subject: finding.subject } : {})
    }))
  return outcomes.length
    ? (outcomes as unknown as RubricOutcomes<AuditOutcome>)
    : [{ status: 'NOT_APPLICABLE', message: `${code} did not apply to this target.` }]
}
export const mechanical = (
  code: Code,
  title: string,
  description: string,
  level: 'FAIL' | 'WARN',
  conform = false
): RubricItem<KbRubricContext> => ({
  code,
  title,
  description,
  sources: SOURCE,
  mechanical: {
    level,
    audit: { phase: 'INSPECT', run: (context) => audit(code, context) },
    ...(conform ? { conform: { phase: 'PRIMARY' as const, run: (context: KbRubricContext) => context.conformRule(code) } } : {})
  }
})
export const judgment = (code: Code, title: string, description: string, prompt: string): RubricItem<KbRubricContext> => ({
  code,
  title,
  description,
  sources: SOURCE,
  judgment: { prompt }
})
