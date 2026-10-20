import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HarnessGateContext } from '../contexts/commit-gate.ts'
import type { HarnessRubricContext } from '../contexts/harness.ts'

const SOURCE = 'standards-compatible-harness.md'

const GATE_1: RubricItem<HarnessGateContext> = {
  code: 'GATE-1',
  title: 'Check-only harness commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs the focused `ki repo audit --skill ki-repo-harness --staged`, directly or through the canonical `quiet_audit` helper, check-only and never `ki repo conform`; `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Copy the canonical pre-commit from `assets/githooks/`, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook }
  }
}

export const GATE: RubricFamily<HarnessRubricContext, HarnessGateContext> = {
  code: 'GATE',
  title: 'Commit gate',
  description: 'What a harness commit gate runs.',
  standard: SOURCE,
  selectContext: (context) => context.gate,
  items: [GATE_1]
}
