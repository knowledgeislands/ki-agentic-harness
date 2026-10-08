import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { KbGateContext, KbRubricContext } from '../contexts/kb.ts'

const SOURCE = 'standards-knowledge-base.md'

const GATE_1: RubricItem<KbGateContext> = {
  code: 'GATE-1',
  title: 'check-only commit gate',
  description:
    'Where a committed `.githooks/pre-commit` exists, it runs `ki repo audit` check-only and never `ki repo conform`; `ki-repo` HOOK-1 owns whether the hook exists.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Make `.githooks/pre-commit` run `ki repo audit` without a rewriting flag, then rerun the audit.'
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
