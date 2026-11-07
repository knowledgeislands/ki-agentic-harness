import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ExchangeDynamicsContext } from '../contexts/exchange-dynamics.ts'

export const SAFE = {
  code: 'SAFE',
  title: 'Safeguards and privacy',
  standard: 'standards-exchange-dynamics.md',
  description:
    'The ten mandatory principles, the sensitive tier and the privacy rules are judged on the analysis, its source and where both are kept.',
  selectContext: (context) => context,
  items: [
    {
      code: 'SAFE-1',
      title: 'participants are described by behaviour in this exchange',
      description:
        'Participant readings describe communication style within the exchange, separate experience from observable behaviour and make no claim about personality.',
      sources: ['standards-exchange-dynamics.md#method', 'standards-exchange-dynamics.md#safeguards'],
      judgment: judgment(
        'Does every participant reading stay with behaviour in this exchange, with evidence and an alternative where one is plausible?'
      )
    },
    {
      code: 'SAFE-2',
      title: 'no narrative is forced and gaps are named',
      description:
        'The analysis neither forces escalation nor resolution, keeps alternative interpretations the evidence supports, and names an incomplete transcript or missing context.',
      sources: ['standards-exchange-dynamics.md#safeguards'],
      judgment: judgment(
        'Are the stated completeness and missing context honest, and are supported alternative readings kept rather than resolved away?'
      )
    },
    {
      code: 'SAFE-3',
      title: 'sensitive exchanges take the stronger tier',
      description:
        'A legal, employment or otherwise sensitive exchange is marked so and meets the stronger tier: cited messages for every event, alternatives for every participant, no inference in a shared rendering, and no sharing without the owner’s word.',
      sources: ['standards-exchange-dynamics.md#safeguards'],
      judgment: judgment(
        'Is the sensitivity marked correctly, and where it is sensitive or legal, does the analysis meet every requirement of the stronger tier?'
      )
    },
    {
      code: 'SAFE-4',
      title: 'the analysis keeps its source’s privacy',
      description:
        'The analysis is kept where its source is kept; a rendering for anyone outside the exchange names no real person without consent; published examples are wholly invented.',
      sources: ['standards-exchange-dynamics.md#privacy'],
      judgment: judgment(
        'Is the analysis stored in its source’s privacy tier, and does every shared rendering or example use invented names or role labels unless consent is recorded?'
      )
    }
  ]
} satisfies RubricFamily<ExchangeDynamicsContext, ExchangeDynamicsContext>
