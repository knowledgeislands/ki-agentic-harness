import type { AuditOutcome, RubricFamily } from '../../shared/rubric.ts'
import type { ProjectRubricContext } from '../types.ts'

export const GATE: RubricFamily<ProjectRubricContext, readonly AuditOutcome[]> = {
  code: 'GATE',
  title: 'Project commit gate',
  standard: 'standards-project-repository.md',
  description: 'The general Project gate delegates to the inherited repository contract.',
  selectContext: (context) => context.gate,
  items: [
    {
      code: 'GATE-1',
      title: 'Check-only Project commit gate',
      description:
        'Where the general Project is the primary shape and a committed pre-commit exists, it runs ki repo audit --skill ki-repo --staged, directly or through the canonical quiet helper. Hook existence, binding and exact text remain with ki-repo.',
      sources: ['standards-project-repository.md#commit-gate'],
      mechanical: {
        level: 'WARN',
        remediation: {
          class: 'diagnostic',
          guidance: 'Copy the canonical Project pre-commit asset for this package variant, then rerun the audit.'
        },
        audit: { phase: 'INSPECT', run: (context) => context }
      }
    }
  ]
}
