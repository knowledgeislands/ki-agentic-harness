import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { KnowledgeGraphContext } from '../contexts/knowledge-graph.ts'

export const DISPATCH = {
  code: 'DISPATCH',
  title: 'Dispatch and authority',
  standard: 'standards-knowledge-graph.md',
  description: 'Dispatch is judged on the moves and the approvals they cite.',
  selectContext: (context) => context,
  items: [
    {
      code: 'DISPATCH-1',
      title: 'dispatch is an approved Git move that leaves a shadow',
      description:
        'Each package moves by Git into the receiving island’s +/_ACQUIRED/ as its own folder, under an approval naming it, with no ledger, and each dispatched card leaves a shadow node behind.',
      sources: [
        'standards-knowledge-graph.md#dispatch',
        'standards-knowledge-graph.md#layered-graphs-and-shadow-nodes'
      ],
      judgment: judgment(
        'Was every dispatch a Git move into the receiver’s +/_ACQUIRED/ under an approval naming the package, with no ledger, leaving a shadow node for each card?'
      )
    },
    {
      code: 'DISPATCH-2',
      title: 'holding areas dispatch nothing and authority stays separate',
      description:
        'No package leaves a graph declared a holding area, and receiver reconciliation, source deletion and history compaction each had their own grant.',
      sources: ['standards-knowledge-graph.md#dispatch'],
      judgment: judgment(
        'Did nothing leave a declared holding area, and did every reconciliation, deletion or history change rest on its own grant?'
      )
    }
  ]
} satisfies RubricFamily<KnowledgeGraphContext, KnowledgeGraphContext>
