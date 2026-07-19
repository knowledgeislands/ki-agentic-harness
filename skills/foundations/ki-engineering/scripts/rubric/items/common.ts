import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { EngineeringRubricContext } from '../contexts/engineering.ts'

type Code = `${string}-${number}`
type MechanicalLevel = 'FAIL' | 'WARN'
const SOURCE = ['standards.md'] as const

const audit = (code: Code, context: EngineeringRubricContext): RubricOutcomes<AuditOutcome> => {
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
    : [{ status: 'NOT_APPLICABLE', message: `${code} did not apply to this target` }]
}

const conform = (code: Code, context: EngineeringRubricContext): RubricOutcomes<ConformOutcome> => {
  const outcomes = context
    .conformFindings()
    .filter((finding) => finding.code === code)
    .map((finding) => ({
      status:
        finding.status === 'FAIL' || finding.status === 'WARN'
          ? ('VIOLATION' as const)
          : finding.status === 'FIXED'
            ? ('FIXED' as const)
            : finding.status === 'NOT_APPLICABLE'
              ? ('NOT_APPLICABLE' as const)
              : finding.status === 'PASS'
                ? ('PASS' as const)
                : ('INFO' as const),
      ...(finding.status === 'FAIL' || finding.status === 'WARN' ? { level: finding.status } : {}),
      message: finding.message,
      ...(finding.subject ? { subject: finding.subject } : {})
    }))
  return outcomes.length
    ? (outcomes as unknown as RubricOutcomes<ConformOutcome>)
    : [{ status: 'NOT_APPLICABLE', message: `${code} has no safe conform action` }]
}

export const mechanical = (
  code: Code,
  title: string,
  description: string,
  level: MechanicalLevel,
  overrideLevels?: readonly MechanicalLevel[]
): RubricItem<EngineeringRubricContext> => ({
  code,
  title,
  description,
  sources: SOURCE,
  mechanical: {
    level,
    ...(overrideLevels ? { overrideLevels } : {}),
    audit: { phase: 'INSPECT', run: (context) => audit(code, context) },
    conform: { phase: 'PRIMARY', run: (context) => conform(code, context) }
  }
})

export const judgment = (code: Code, title: string, description: string, prompt: string): RubricItem<EngineeringRubricContext> => ({
  code,
  title,
  description,
  sources: SOURCE,
  judgment: { prompt }
})
