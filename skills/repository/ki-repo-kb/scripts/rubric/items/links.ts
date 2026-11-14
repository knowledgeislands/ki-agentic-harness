import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { KbLinkContext, KbRubricContext } from '../contexts/kb.ts'

const SOURCE = 'standards-knowledge-base.md'

const LINK_1: RubricItem<KbLinkContext> = {
  code: 'LINK-1',
  title: 'Internal links resolve in exact case',
  description:
    'Ambiguous wikilinks fail; unresolved or wrong-case internal links warn unless strict_link_resolution is true; GFM is preferred.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Repair missing or wrong-case destinations and qualify ambiguous wikilinks, then rerun the audit; supported link syntax alone is never a defect.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.uniqueTargets }
  },
  judgment: {
    scope: 'Sampled base notes and the prescribed linking convention.',
    prompt:
      'Do sampled notes prefer descriptive note-relative GFM links in angle brackets, while retaining readable supported wikilinks and preserving meaning during conversion?',
    outcomes: ['conforming', 'note revision', 'convention clarification'],
    guidance: 'Revise links to the established convention; do not change the convention from a sample alone.'
  }
}

export const LINK: RubricFamily<KbRubricContext, KbLinkContext> = {
  code: 'LINK',
  title: 'base linking',
  description: 'Mechanical internal-link resolution in exact case and judgment review of the preferred GFM form.',
  standard: SOURCE,
  selectContext: (context) => context.links,
  items: [LINK_1]
}
