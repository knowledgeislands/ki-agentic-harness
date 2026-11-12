import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const GRAPH = {
  code: 'GRAPH',
  title: 'Staging graph, layers and tending',
  standard: 'standards-knowledge-graph.md',
  description:
    'The staging graph and its layers are judged on supplied evidence; folder and zone structure is the knowledge base’s own.',
  selectContext: (context) => context,
  items: [
    {
      code: 'GRAPH-1',
      title: 'routing links run one way',
      description:
        'Routing cards may link into captures and staged cards, but nothing in a capture links into the routing cards.',
      sources: ['standards-knowledge-graph.md#the-staging-graph'],
      judgment: judgment('Does any capture link into a routing card?')
    },
    {
      code: 'GRAPH-2',
      title: 'shadow nodes are read-only pointers that record their check',
      description:
        'Each shadow node records the card it shadows, where that card lives and when it was last checked, and carries no knowledge of its own.',
      sources: ['standards-knowledge-graph.md#layered-graphs-and-shadow-nodes'],
      judgment: judgment(
        'Does every shadow node name its subject, where it lives and its last check, and hold no content that should be edited through it?'
      )
    },
    {
      code: 'GRAPH-3',
      title: 'the layer above is consulted before a card is grown',
      description:
        'A new card is grown only after checking the layer above; a suitable card there is brought down as a shadow and grown off, never duplicated.',
      sources: ['standards-knowledge-graph.md#layered-graphs-and-shadow-nodes'],
      judgment: judgment(
        'For each new card, was the layer above checked first, and does no new card duplicate an attachment point or settled card above?'
      )
    },
    {
      code: 'GRAPH-4',
      title: 'pruning keeps each area’s touch point',
      description:
        'Shadow nodes are pruned only in untended areas after a few rounds of use, and every live area keeps its one shadow at its touch point.',
      sources: ['standards-knowledge-graph.md#layered-graphs-and-shadow-nodes', 'standards-knowledge-graph.md#tending'],
      judgment: judgment(
        'Were pruned shadows in untended areas only, and does every live area keep one shadow node where it touches the layer above?'
      )
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
