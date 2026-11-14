import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { HoldContext } from '../contexts/hold.ts'
import type { TradesRubricContext } from '../contexts/trades.ts'

const SOURCE = '../SKILL.md'

const HOLD_1: RubricItem<HoldContext> = {
  code: 'HOLD-1',
  title: 'the trades hold is reviewed by its date',
  description:
    'While the skill carries its "Trades are on hold" notice, the notice names the fallback date by which the hold is due for review, and that date has not passed. Opening the Trades revamp Project reviews the hold sooner; at the review the owner either re-enables trades and brings ki-trades up to date with the revamp\'s trade policy, or renews the hold with a new date.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Ask the owner to review the hold: open the Trades revamp, remove the notice and bring the trade standard up to date with its trade policy, or renew the hold by changing its fallback review date in SKILL.md.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

export const HOLD: RubricFamily<TradesRubricContext, HoldContext> = {
  code: 'HOLD',
  title: 'Trades hold review',
  description:
    'A hold on new trades is reviewed when the Trades revamp opens or by its fallback date, so it is renewed or lifted rather than left standing.',
  standard: SOURCE,
  selectContext: (context) => context.hold,
  items: [HOLD_1]
}
