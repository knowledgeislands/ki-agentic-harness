import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { GranolaRubricContext } from '../contexts/granola.ts'

export const ACQUIRE = {
  code: 'ACQUIRE',
  title: 'Granola acquisition fidelity',
  standard: 'standards-granola-acquisition.md',
  description: 'Complete enumeration, faithful source projections, the capture as the only record.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ACQUIRE-1',
      title: 'complete identity enumeration',
      description:
        'Global and every folder history use saturation-aware date-window splitting, UUID deduplication, and fail-closed completeness.',
      sources: ['standards-granola-acquisition.md#complete-identity-enumeration'],
      judgment: judgment(
        'Does the evidence prove every global and folder window complete, unsaturated and deduplicated?'
      )
    },
    {
      code: 'ACQUIRE-2',
      title: 'faithful read',
      description:
        'Details, complete transcripts, and MCP screenshot bytes are preserved with identities, hashes, and explicit omissions.',
      sources: ['standards-granola-acquisition.md#acquisition-fidelity'],
      judgment: judgment(
        'Does evidence reconcile attachment counts and UUIDs, validate transcripts and image bytes, and preserve hashes, provenance, and omissions?'
      )
    },
    {
      code: 'ACQUIRE-3',
      title: 'repeat runs are honest',
      description:
        'Acquired members are skipped on membership alone, existing captures are found by UUID and kept unless refreshed, and no skip claims unchanged content.',
      sources: ['standards-granola-acquisition.md#repeat-runs-and-amendments'],
      judgment: judgment(
        'Were existing captures found by UUID and kept or deliberately refreshed in place, with duplicate or foreign-account captures reported and no ledger written?'
      )
    },
    {
      code: 'ACQUIRE-4',
      title: 'Acquired marker is confirmed and verified',
      description:
        'Only a confirmed mark adds Acquired membership, after verifying the committed capture against fresh source hashes and preserving every original membership.',
      sources: ['standards-granola-acquisition.md#acquired-marker'],
      judgment: judgment(
        'Was each marker explicitly confirmed, checked against its single committed capture, and read back with every original membership intact?'
      )
    }
  ]
} satisfies RubricFamily<GranolaRubricContext, GranolaRubricContext>
