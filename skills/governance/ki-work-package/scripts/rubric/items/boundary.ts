import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standard-work-package.md'

const BOUNDARY_1: RubricItem<OutcomeContext> = {
  code: 'BOUNDARY-1',
  title: 'a work package contains current state only',
  description:
    "A package's `_index.md` has no vendor-session field, conversation locator, role-by-role transcript, or mechanically recognisable claim that a fresh agent can reopen the originating session. It is the work's definition and current state, not session continuity.",
  sources: [`${SOURCE}#416-prohibited-payloads-and-claims`],
  mechanical: {
    level: 'FAIL',
    heuristic: true,
    remediation: {
      class: 'guarded',
      guidance: 'Remove session-continuity material only through an explicit user-authorised update of the entry file.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  },
  judgment: {
    scope: 'Every package and sub-package, its entry file and its change documents.',
    prompt:
      'Would this package let an agent with no transcript or vendor-session access pick the work up, without implying that the originating conversation can be reopened?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance:
      'Do not edit package content without explicit authority; ask the user when its content or ownership is uncertain.'
  }
}

export const BOUNDARY: RubricFamily<WorkPackageRubricContext, OutcomeContext> = {
  code: 'BOUNDARY',
  title: 'Runtime-neutral reconstruction',
  description: 'Portable package content never depends on a transcript, vendor session, or private runtime state.',
  standard: SOURCE,
  selectContext: (context) => context.boundary,
  items: [BOUNDARY_1]
}
