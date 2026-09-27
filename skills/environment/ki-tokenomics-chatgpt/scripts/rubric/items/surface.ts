import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CodexEvidenceContext, CodexRubricContext } from '../contexts/codex.ts'

const SOURCE = 'standards-codex-tokenomics.md'
const SURF_1: RubricItem<CodexEvidenceContext> = {
  code: 'CODEX-SURF-1',
  title: 'Documented Codex surfaces are bounded',
  description:
    'Only directly observed selected-repository Codex configuration, instructions, skills, and custom-agent source structure is reported; user-memory and effective-session state are unavailable, and values that may be secret are not emitted.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Adjust the selected Codex configuration or document the observed standing surface; hosted conform does not change runtime state.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.surfaces }
  }
}
export const SURF: RubricFamily<CodexRubricContext, CodexEvidenceContext> = {
  code: 'SURF',
  title: 'Codex standing surfaces',
  description: 'Bounded documented Codex evidence.',
  standard: SOURCE,
  selectContext: (context) => context.codex,
  items: [SURF_1]
}
