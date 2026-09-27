import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HousekeepingRubricContext, HousekeepingSelectionContext } from '../contexts/housekeeping.ts'

const SOURCE = 'standards-auto-memory.md'

const SELECT_1: RubricItem<HousekeepingSelectionContext> = {
  code: 'SELECT-1',
  title: 'Auto-memory state and project scope established',
  description:
    'Disabled auto-memory passes under disabled or transition policy without memory file inspection. Enabled auto-memory requires declared transition or both enabled policy and a project-scoped Claude opt-in; malformed or unsupported settings fail closed.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Reconcile the KI lifecycle declaration with effective Claude settings and environment overrides, then rerun audit.'
    },
    audit: { phase: 'PREPARE', run: (context) => context.selected }
  }
}

const SELECT_2: RubricItem<HousekeepingSelectionContext> = {
  code: 'SELECT-2',
  title: 'Existing auto-memory reconciled before transition closes',
  description:
    'A transition declaration or existing files in a disabled selected memory directory warn until reviewed learning is routed and the transition is closed. The audit never creates, moves, or deletes memory files.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Review existing memory through repository or KB intake, retain the files until approved reconciliation, then mark the skill declaration disabled.'
    },
    audit: { phase: 'PREPARE', run: (context) => context.reconciliation }
  }
}

export const SELECTION: RubricFamily<HousekeepingRubricContext, HousekeepingSelectionContext> = {
  code: 'SELECT',
  title: 'Native-memory selection',
  description: 'Evidence that bounds the local native-memory inspection.',
  standard: SOURCE,
  selectContext: (context) => context.selection,
  items: [SELECT_1, SELECT_2]
}
