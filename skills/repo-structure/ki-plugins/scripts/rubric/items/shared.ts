import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes, ViolationLevel } from '../../vendored/ki-skills/rubric.ts'
import type { PluginsContext } from '../contexts/plugins.ts'

export const inactive = (context: PluginsContext): RubricOutcomes<AuditOutcome> | null =>
  !context.available
    ? [{ status: 'VIOLATION', message: `target path is not a directory: ${context.target}` }]
    : !context.applicable
      ? [{ status: 'NOT_APPLICABLE', message: 'ki-plugins is not applicable to this repository' }]
      : null

export const mechanical = (
  code: string,
  title: string,
  description: string,
  level: ViolationLevel,
  audit: (context: PluginsContext) => RubricOutcomes<AuditOutcome>,
  conform?: (context: PluginsContext) => RubricOutcomes<ConformOutcome>
): RubricItem<PluginsContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  mechanical: {
    level,
    audit: { phase: 'INSPECT', run: audit },
    ...(conform ? { conform: { phase: 'PRIMARY', run: conform } } : {})
  }
})

export const judgment = (code: string, title: string, description: string, prompt: string): RubricItem<PluginsContext> => ({
  code,
  title,
  description,
  sources: ['standards.md'],
  judgment: { prompt }
})

export const result = (condition: boolean, pass: string, violation: string, subject?: string): RubricOutcomes<AuditOutcome> => [
  { status: condition ? 'PASS' : 'VIOLATION', message: condition ? pass : violation, ...(subject ? { subject } : {}) }
]
