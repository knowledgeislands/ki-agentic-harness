import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CodexEvidenceContext, CodexRubricContext } from '../contexts/codex.ts'

const SOURCE = 'standards-codex-tokenomics.md'
const NA_1: RubricItem<CodexEvidenceContext> = {
  code: 'CODEX-NA-1',
  title: 'Effective session state is unavailable',
  description:
    'Effective model, instructions, active MCP, trust, memory use, transcript, compaction, billing, and tool-schema metrics are unavailable without authorised session evidence.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Use an explicitly authorised session-evidence owner; do not infer session state from filesystem sources.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.unavailable }
  }
}
export const NA: RubricFamily<CodexRubricContext, CodexEvidenceContext> = {
  code: 'NA',
  title: 'Unavailable Codex runtime state',
  description: 'Session facts not inferred from filesystem observations.',
  standard: SOURCE,
  selectContext: (context) => context.codex,
  items: [NA_1]
}
