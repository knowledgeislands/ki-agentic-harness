import { type AuditOutcome, judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { ExchangeDynamicsContext } from '../contexts/exchange-dynamics.ts'

export const ANALYSIS = {
  code: 'ANALYSIS',
  title: 'Analyses and their contract',
  standard: 'standards-exchange-dynamics.md',
  description:
    'Committed analyses are checked against the contract mechanically; the quality of the reading is judged on the analysis and its source.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ANALYSIS-1',
      title: 'every committed analysis passes the contract',
      description:
        'Each `analysis.json` that claims to be an exchange dynamics analysis conforms to the schema, and its speakers, phases, bands, citations and quotations cross-reference cleanly.',
      sources: ['standards-exchange-dynamics.md#the-analysis-contract'],
      mechanical: {
        level: 'FAIL',
        cost: 3,
        remediation: {
          class: 'diagnostic',
          guidance:
            'Run `bun scripts/validate-analysis.ts <analysis.json>` from the skill and repair the analysis, never its renderings, until it passes.'
        },
        audit: {
          phase: 'INSPECT',
          run: ({ analyses }) => {
            const found = analyses()
            if (!found.length)
              return [
                { status: 'NOT_APPLICABLE' as const, message: 'No exchange dynamics analysis is committed here.' }
              ]
            return found.flatMap(({ path, issues }): AuditOutcome[] =>
              issues.length
                ? issues.map((issue) => ({
                    status: 'VIOLATION' as const,
                    subject: path,
                    message: `${issue.path} ${issue.message}`
                  }))
                : [{ status: 'PASS' as const, subject: path, message: 'The analysis passes the contract.' }]
            )
          }
        }
      }
    },
    {
      code: 'ANALYSIS-2',
      title: 'events are chosen for what they change',
      description:
        'Selected events are the contributions that move the exchange, a new position, a challenge, a concession or a turn, in a number that fits the exchange, not an even sample.',
      sources: ['standards-exchange-dynamics.md#method'],
      judgment: judgment(
        'Does each selected event change the exchange, and is any contribution that turned it left out?'
      )
    },
    {
      code: 'ANALYSIS-3',
      title: 'the four layers stay apart',
      description:
        'Observation, interpretation, inference and uncertainty are kept distinct; every inference is marked as one and no motive is stated as fact.',
      sources: ['standards-exchange-dynamics.md#the-four-layers'],
      judgment: judgment(
        'Is every possible motive marked as inference, and is what was said kept apart from what it is taken to mean?'
      )
    },
    {
      code: 'ANALYSIS-4',
      title: 'sentiment and tension are read independently',
      description:
        'Each score has a basis that justifies it on its own axis, and the two axes are allowed to move apart where the material does.',
      sources: ['standards-exchange-dynamics.md#method'],
      judgment: judgment(
        'Does every sentiment and tension score carry a basis that justifies it, without one axis being derived from the other?'
      )
    },
    {
      code: 'ANALYSIS-5',
      title: 'phases and conclusions come from the material',
      description:
        'Phase boundaries follow real shifts in the dynamics, and every takeaway, participant reading and overall conclusion traces to the events it cites.',
      sources: ['standards-exchange-dynamics.md#method', 'standards-exchange-dynamics.md#safeguards'],
      judgment: judgment(
        'Do the phase boundaries match shifts in the material, and does each cited event actually support the conclusion that cites it?'
      )
    }
  ]
} satisfies RubricFamily<ExchangeDynamicsContext, ExchangeDynamicsContext>
