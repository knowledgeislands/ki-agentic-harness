import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const GRAPH = {
  code: 'GRAPH',
  title: 'Root definition, subgraphs, layers and tending',
  standard: 'standards-knowledge-graph.md',
  description:
    'A graph’s root definition, subgraphs, staging and layers are judged on supplied evidence; folder and zone structure is the knowledge base’s own.',
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
    },
    {
      code: 'GRAPH-5',
      title: 'the graph defines itself at its root',
      description:
        'The root folder, a skill’s `knowledge/`, holds `_graph.md`, of card type graph, whose sections declare in order the card types, link vocabulary, properties, constraints, subgraphs, and extent and limitations, none left out.',
      sources: ['standards-knowledge-graph.md#the-root-definition'],
      judgment: judgment(
        'Does the graph’s `_graph.md` declare every card type, vocabulary, property, constraint and subgraph its cards use, and state its extent, limitations and pending cards?'
      )
    },
    {
      code: 'GRAPH-6',
      title: 'outside usage is a subgraph linked to the graph’s terms',
      description:
        'Where parties use their own words for a term, each party’s words are cards in its own subgraph linked to the term with mapping predicates, one link per sense, and comparisons are read from those links rather than listed in prose.',
      sources: ['standards-knowledge-graph.md#subgraphs'],
      judgment: judgment(
        'Are synonyms, senses and comparisons expressed as links between subgraph cards rather than as lists in a card’s prose?'
      )
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
