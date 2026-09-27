import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HousekeepingRubricContext, HousekeepingSelectionContext } from '../contexts/housekeeping.ts'

const SOURCE = 'standards-auto-memory.md'

const SELECT_1: RubricItem<HousekeepingSelectionContext> = {
  code: 'SELECT-1',
  title: 'Auto-memory state and project scope established',
  description:
    'Disabled auto-memory passes without memory inspection. Enabled auto-memory requires an explicit project-scoped opt-in and a selected contained directory; malformed or unsupported settings fail closed.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Review effective settings and environment overrides; disable auto-memory or opt in explicitly for this project, then rerun audit.'
    },
    audit: { phase: 'PREPARE', run: (context) => context.selected }
  }
}

export const SELECTION: RubricFamily<HousekeepingRubricContext, HousekeepingSelectionContext> = {
  code: 'SELECT',
  title: 'Native-memory selection',
  description: 'Evidence that bounds the local native-memory inspection.',
  standard: SOURCE,
  selectContext: (context) => context.selection,
  items: [SELECT_1]
}
