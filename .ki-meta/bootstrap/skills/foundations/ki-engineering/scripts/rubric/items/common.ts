import type { AuditOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { EngineeringRubricContext } from '../contexts/engineering.ts'

type Code = `${string}-${number}`
type MechanicalLevel = 'FAIL' | 'WARN'
const SOURCE = ['standards.md'] as const
const SAFE_REPAIRS = new Set<Code>([
  'PKG-1',
  'PKG-2',
  'PKG-3',
  'PKG-5',
  'PKG-6',
  'MISE-1',
  'SCR-2',
  'SCR-3',
  'SCR-4',
  'SCR-5',
  'TSC-2',
  'BIO-1',
  'BIO-2',
  'KNIP-1',
  'KNIP-2',
  'SYNC-1',
  'DEPS-1',
  'TOML-1'
])

const audit = (code: Code, context: EngineeringRubricContext): RubricOutcomes<AuditOutcome> => {
  const outcomes = context
    .audit(code)
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
    ...(SAFE_REPAIRS.has(code)
      ? { repair: { phase: 'PRIMARY' as const, run: (context: EngineeringRubricContext) => [context.repair(code)] } }
      : {})
  }
})

export const judgment = (code: Code, title: string, description: string, prompt: string): RubricItem<EngineeringRubricContext> => ({
  code,
  title,
  description,
  sources: SOURCE,
  judgment: { prompt }
})
