import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PolicyContext, TradesRubricContext } from '../contexts/trades.ts'

const SOURCE = 'standards-trades.md'

const POLICY_1: RubricItem<PolicyContext> = {
  code: 'POLICY-1',
  title: 'the Capital trade policy is well formed',
  description:
    'In a Capital, `[skills.ki-trades.territory]` carries only `subtypes`, `channels`, and `standing`. Each channel declares exactly a unique `id`, a `purpose`, disjoint non-empty canonical `from` and `to` arrays of territory members, and a non-empty duplicate-free subset of work and knowledge, and no route triple is granted twice. Each standing grant names a defined knowledge subtype over disjoint canonical endpoints already joined by a knowledge channel, without duplicates. Any violation fails closed.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Correct the Capital trade policy; until it is valid it grants no routes anywhere in the territory.'
    },
    audit: { phase: 'INSPECT', run: ({ schemaOutcomes }) => schemaOutcomes }
  }
}

const POLICY_2: RubricItem<PolicyContext> = {
  code: 'POLICY-2',
  title: 'named islands declare ki-trades',
  description:
    'In a Capital, every island the trade policy names that is registered locally declares `[skills.ki-trades]`; an island not checked out here is reported as unverifiable.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Hand the named island a declaration of ki-trades through its own repository, or remove it from the policy channels.'
    },
    audit: { phase: 'INSPECT', run: ({ namedOutcomes }) => namedOutcomes }
  }
}

export const POLICY: RubricFamily<TradesRubricContext, PolicyContext> = {
  code: 'POLICY',
  title: 'Capital trade policy',
  description: 'The Capital-owned territory trade policy and the islands it names.',
  standard: SOURCE,
  selectContext: (context) => context.policy,
  items: [POLICY_1, POLICY_2]
}
