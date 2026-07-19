import type { AuditOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { StreamsContext } from '../contexts/streams.ts'
type Code = `${string}-${string}`
const source = ['references/Streams Structure Reference.md'] as const
const audit = (code: Code, context: StreamsContext): RubricOutcomes<AuditOutcome> => {
  const values = context.auditFindings
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
  return values.length
    ? (values as unknown as RubricOutcomes<AuditOutcome>)
    : [{ status: 'NOT_APPLICABLE', message: `${code} did not apply.` }]
}
export const mechanical = (
  code: Code,
  title: string,
  description: string,
  level: 'FAIL' | 'WARN',
  conform = false
): RubricItem<StreamsContext> => ({
  code,
  title,
  description,
  sources: source,
  mechanical: {
    level,
    audit: { phase: 'INSPECT', run: (context) => audit(code, context) },
    ...(conform ? { conform: { phase: 'PRIMARY' as const, run: (context: StreamsContext) => context.conformRule(code) } } : {})
  }
})
export const judgment = (code: Code, title: string, description: string, prompt: string): RubricItem<StreamsContext> => ({
  code,
  title,
  description,
  sources: source,
  judgment: { prompt }
})
