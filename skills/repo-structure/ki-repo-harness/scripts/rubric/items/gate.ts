import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HarnessGateContext } from '../contexts/commit-gate.ts'
import type { HarnessRubricContext } from '../contexts/harness.ts'

const SOURCE = 'standards-compatible-harness.md'

const GATE_1: RubricItem<HarnessGateContext> = {
  code: 'GATE-1',
  title: 'Check-only harness commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs only fast check-only staged lints: no `ki repo audit`, `ki repo conform`, `ki repo repair`, `--fix` or `--write`. The full `ki repo audit` runs in CI. `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text.',
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

const GATE_2: RubricItem<HarnessGateContext> = {
  code: 'GATE-2',
  title: 'Staged diagram viewer receipts',
  description:
    'For a staged repository declaring ki-diagrams, every commit_html viewer has a receipt matching the exact staged source and HTML; missing or unsafe staged files and unreadable snapshots fail closed. Unstaged bytes never supply or repair this evidence.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Rebuild the viewer and receipt, stage their matching source, HTML and receipt, then rerun the focused audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.receipts }
  }
}

export const GATE: RubricFamily<HarnessRubricContext, HarnessGateContext> = {
  code: 'GATE',
  title: 'Commit gate',
  description: 'What a harness commit gate runs.',
  standard: SOURCE,
  selectContext: (context) => context.gate,
  items: [GATE_1, GATE_2]
}
