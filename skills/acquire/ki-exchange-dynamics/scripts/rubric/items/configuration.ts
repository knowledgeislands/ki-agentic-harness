import type { RubricFamily } from '../../shared/rubric.ts'
import type { ExchangeDynamicsContext } from '../contexts/exchange-dynamics.ts'

export const CONFIG = {
  code: 'CONFIG',
  title: 'Exchange dynamics configuration',
  standard: 'standards-exchange-dynamics.md',
  description: 'The method finds analyses by their file name and accepts no configuration keys of its own.',
  selectContext: (context) => context,
  items: [
    {
      code: 'CONFIG-1',
      title: 'the exchange dynamics method has no configuration properties',
      description:
        'Unexpected keys in the skill table are visible rather than silently accepted as settings the method does not read.',
      sources: ['standards-exchange-dynamics.md#the-analysis-contract'],
      mechanical: {
        level: 'WARN',
        remediation: {
          class: 'diagnostic',
          guidance: 'Remove unsupported keys; an analysis carries its own rendering requests.'
        },
        audit: {
          phase: 'INSPECT',
          run: ({ configurationKeys }) =>
            configurationKeys.length
              ? configurationKeys.map((key) => ({
                  status: 'VIOLATION' as const,
                  message: `Unsupported exchange dynamics property: ${key}`
                }))
              : [
                  {
                    status: 'PASS' as const,
                    message: 'The exchange dynamics table contains no unsupported properties.'
                  }
                ]
        }
      }
    }
  ]
} satisfies RubricFamily<ExchangeDynamicsContext, ExchangeDynamicsContext>
