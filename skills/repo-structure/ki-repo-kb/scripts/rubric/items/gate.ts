import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { KbGateContext, KbRubricContext } from '../contexts/kb.ts'

const SOURCE = 'standards-knowledge-base.md'

const GATE_1: RubricItem<KbGateContext> = {
  code: 'GATE-1',
  title: 'check-only commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs the focused `ki repo audit --skill ki-repo-kb --staged`, directly or through the canonical `quiet_audit` helper, check-only and never `ki repo conform`; `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Copy the canonical pre-commit from `assets/githooks/`, which runs the focused staged audit, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.hook }
  }
}

export const GATE: RubricFamily<KbRubricContext, KbGateContext> = {
  code: 'GATE',
  title: 'commit gate',
  description: 'What a Knowledge Base commit gate runs.',
  standard: SOURCE,
  selectContext: (context) => context.gate,
  items: [GATE_1]
}
