import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HomebrewTapRubricContext } from '../contexts/homebrew-tap.ts'

const SOURCE = 'standards-homebrew-tap.md'

const GATE_1: RubricItem<readonly AuditOutcome[]> = {
  code: 'GATE-1',
  title: 'check-only commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs `ruby -wc` over the staged Ruby files and the focused `ki repo audit --skill ki-repo-homebrew-tap --staged`, directly or through the canonical `quiet_audit` helper, check-only and never `ki repo conform`; `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text.',
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

export const GATE: RubricFamily<HomebrewTapRubricContext, readonly AuditOutcome[]> = {
  code: 'GATE',
  title: 'commit gate',
  description: 'What a Homebrew tap commit gate runs.',
  standard: SOURCE,
  selectContext: (context) => context.gate,
  items: [GATE_1]
}
