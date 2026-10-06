import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { RoutesContext, TradesRubricContext } from '../contexts/trades.ts'

const SOURCE = 'standards-trades.md'

const ROUTE_1: RubricItem<RoutesContext> = {
  code: 'ROUTE-1',
  title: 'trade routes come from the resolved Capital policy and activate per peer',
  description:
    "Routes and standing grants are read only from the territory trade policy of the repository's declared Capital, resolved as the unique locally registered Capital listing this repository; a malformed or ambiguous policy fails closed and an unregistered Capital warns that the policy is not available here. A granted route is active only when exactly one registered repository declares the peer's canonical GitHub home, declares ki-trades, and names the same Capital.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Correct the local capital declaration or register the Capital checkout; route changes are proposed to the Capital, never declared locally.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

const ROUTE_2: RubricItem<RoutesContext> = {
  code: 'ROUTE-2',
  title: 'a participating member is named by its Capital policy',
  description:
    'A territory member that declares ki-trades is named as a source or receiver in at least one channel of its resolved Capital trade policy. The Capital itself hosts the policy and is exempt.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Propose a channel naming this repository to the Capital, or remove the ki-trades declaration if the repository does not trade.'
    },
    audit: { phase: 'INSPECT', run: ({ coverageOutcomes }) => coverageOutcomes }
  }
}

export const ROUTE: RubricFamily<TradesRubricContext, RoutesContext> = {
  code: 'ROUTE',
  title: 'Capital-granted routes',
  description: 'Routes granted by the Capital trade policy and their per-peer activation.',
  standard: SOURCE,
  selectContext: (context) => context.routes,
  items: [ROUTE_1, ROUTE_2]
}
