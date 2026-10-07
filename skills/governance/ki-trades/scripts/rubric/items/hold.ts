import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HoldContext } from '../contexts/hold.ts'
import type { TradesRubricContext } from '../contexts/trades.ts'

const SOURCE = '../SKILL.md'

const HOLD_1: RubricItem<HoldContext> = {
  code: 'HOLD-1',
  title: 'the trades hold is reviewed by its date',
  description:
    'While the skill carries its "Trades are on hold" notice, the notice names the date by which the hold is due for review, and that date has not passed. At the date the owner either re-enables trades and brings ki-trades up to date with the territory model, or renews the hold with a new date.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Ask the owner to review the hold: remove the notice and bring the trade standard up to date with the territory model, or renew the hold by changing its review date in SKILL.md.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

export const HOLD: RubricFamily<TradesRubricContext, HoldContext> = {
  code: 'HOLD',
  title: 'Trades hold review',
  description: 'A hold on new trades carries a review date, so it is renewed or lifted rather than left standing.',
  standard: SOURCE,
  selectContext: (context) => context.hold,
  items: [HOLD_1]
}
