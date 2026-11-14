import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, TradesRubricContext } from '../contexts/trades.ts'

const SOURCE = 'standards-trades.md'

const CONFIG_1: RubricItem<OutcomeContext> = {
  code: 'CONFIG-1',
  title: 'the member table is bare and identities are canonical',
  description:
    'A participating repository declares `[skills.ki-trades]` carrying at most a presentation-only `map_bonus` integer from 0 through 3. The retired `routes` and `subtypes` keys fail because routes now come from the Capital trade policy, `territory` is permitted only in a Capital, and any other key fails. The repository identity comes only from the canonical GitHub form of `ki-repo.repository`.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Remove retired or unknown ki-trades keys and propose any route change to the Capital trade policy, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

export const CONFIG: RubricFamily<TradesRubricContext, OutcomeContext> = {
  code: 'CONFIG',
  title: 'Declared participation',
  description: 'A bare, canonical local ki-trades declaration.',
  standard: SOURCE,
  selectContext: (context) => context.configuration,
  items: [CONFIG_1]
}
