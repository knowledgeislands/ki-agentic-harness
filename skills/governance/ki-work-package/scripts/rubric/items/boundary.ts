import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standards-work-package.md'

const BOUNDARY_1: RubricItem<OutcomeContext> = {
  code: 'BOUNDARY-1',
  title: 'a work package contains current state only',
  description:
    'A work package, single-file work file or old checkpoint has no vendor-session field, conversation locator, role-by-role transcript, or mechanically recognisable claim that a fresh agent can reopen the originating session. It is current state, not session continuity.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    heuristic: true,
    remediation: {
      class: 'guarded',
      guidance: 'Remove session-continuity material only through an explicit user-authorised work-file update.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  },
  judgment: {
    scope: 'Every work package, single-file work file and old checkpoint and its content.',
    prompt:
      'Would this package let an agent with no transcript or vendor-session access pick the work up, without implying that the originating conversation can be reopened?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance:
      'Do not edit work-file content without explicit authority; ask the user when its content or ownership is uncertain.'
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
