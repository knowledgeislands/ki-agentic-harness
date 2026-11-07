import type { RubricFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const CONFIG = {
  code: 'CONFIG',
  title: 'Knowledge-graph configuration',
  standard: 'standards-knowledge-graph.md',
  description:
    'The method takes its layout from the knowledge base that declares it and accepts no configuration keys of its own.',
  selectContext: (context) => context,
  items: [
    {
      code: 'CONFIG-1',
      title: 'the knowledge-graph method has no configuration properties',
      description:
        'Unexpected keys in the skill table are visible rather than silently accepted as staging-layout settings, which belong to the knowledge base’s own structure.',
      sources: ['standards-knowledge-graph.md#the-staging-graph'],
      mechanical: {
        level: 'WARN',
        remediation: {
          class: 'diagnostic',
          guidance: 'Remove unsupported keys; declare the staging layout in the knowledge base’s own structure.'
        },
        audit: {
          phase: 'INSPECT',
          run: ({ configurationKeys }) =>
            configurationKeys.length
              ? configurationKeys.map((key) => ({
                  status: 'VIOLATION' as const,
                  message: `Unsupported knowledge-graph property: ${key}`
                }))
              : [
                  {
                    status: 'PASS' as const,
                    message: 'The knowledge-graph table contains no unsupported properties.'
                  }
                ]
        }
      }
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
