import type { RubricFamily } from '../../shared/rubric.ts'
import type { AcquisitionContext } from '../contexts/acquisition.ts'

export const CONFIG = {
  code: 'CONFIG',
  title: 'Common acquisition configuration',
  standard: 'standards-acquisition.md',
  description:
    'The common contract takes local conventions from repository guidance and accepts no configuration keys.',
  selectContext: (context) => context,
  items: [
    {
      code: 'CONFIG-1',
      title: 'common acquisition has no configuration properties',
      description:
        'Unexpected keys in the common skill table are visible rather than silently accepted as provider settings.',
      sources: ['standards-acquisition.md#scope'],
      mechanical: {
        level: 'WARN',
        remediation: {
          class: 'diagnostic',
          guidance: 'Remove unsupported keys; keep provider settings under their owning adapter.'
        },
        audit: {
          phase: 'INSPECT',
          run: ({ configurationKeys }) =>
            configurationKeys.length
              ? configurationKeys.map((key) => ({
                  status: 'VIOLATION' as const,
                  message: `Unsupported common acquisition property: ${key}`
                }))
              : [
                  {
                    status: 'PASS' as const,
                    message: 'The common acquisition table contains no unsupported properties.'
                  }
                ]
        }
      }
    }
  ]
} satisfies RubricFamily<AcquisitionContext, AcquisitionContext>
