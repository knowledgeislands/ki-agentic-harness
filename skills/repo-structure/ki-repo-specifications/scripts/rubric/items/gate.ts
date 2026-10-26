import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { SpecificationsContext } from '../contexts/specifications.ts'

const SOURCE = 'standards-specifications.md'

const GATE_1: RubricItem<readonly AuditOutcome[]> = {
  code: 'GATE-1',
  title: 'check-only commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs only fast check-only staged lints: no `ki repo audit`, `ki repo conform`, `ki repo repair`, `--fix` or `--write`. The full `ki repo audit` runs in CI. `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Copy the canonical pre-commit from `assets/githooks/`, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (gate) => gate }
  }
}

export const GATE: RubricFamily<SpecificationsContext, readonly AuditOutcome[]> = {
  code: 'GATE',
  title: 'commit gate',
  description: 'What a Specifications repository commit gate runs.',
  standard: SOURCE,
  selectContext: (context) => context.gate,
  items: [GATE_1]
}
