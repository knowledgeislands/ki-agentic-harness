import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { KbLinkContext, KbRubricContext } from '../contexts/kb.ts'

const SOURCE = 'standards-knowledge-base.md'

const LINK_1: RubricItem<KbLinkContext> = {
  code: 'LINK-1',
  title: 'Obsidian note linking',
  description: 'Base note content uses shortest-unique Obsidian wikilinks, with aliased full paths for contents lists.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Qualify each ambiguous wikilink with the shortest path prefix that makes it unique, or rename one of the colliding notes, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.uniqueTargets }
  },
  judgment: {
    scope: 'Sampled base notes and the prescribed linking convention.',
    prompt:
      'Beyond the mechanical uniqueness check, do sampled base notes use the shortest unique form and the aliased full paths the convention prescribes?',
    outcomes: ['conforming', 'note revision', 'convention clarification'],
    guidance: 'Revise links to the established convention; do not change the convention from a sample alone.'
  }
}

export const LINK: RubricFamily<KbRubricContext, KbLinkContext> = {
  code: 'LINK',
  title: 'base linking',
  description: 'Mechanical wikilink uniqueness and judgment review of Obsidian wikilink content.',
  standard: SOURCE,
  selectContext: (context) => context.links,
  items: [LINK_1]
}
