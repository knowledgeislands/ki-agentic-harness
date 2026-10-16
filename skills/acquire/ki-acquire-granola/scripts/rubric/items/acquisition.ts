import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { GranolaRubricContext } from '../contexts/granola.ts'

export const ACQUIRE = {
  code: 'ACQUIRE',
  title: 'Granola acquisition fidelity',
  standard: 'standards-granola-acquisition.md',
  description: 'Complete enumeration, faithful source projections, immutable checkpoints.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ACQUIRE-1',
      title: 'complete identity enumeration',
      description:
        'Global and every folder history use saturation-aware date-window splitting, UUID reconciliation, and fail-closed completeness evidence.',
      sources: ['standards-granola-acquisition.md#complete-identity-enumeration'],
      judgment: judgment(
        'Does the evidence prove every global and folder window complete, unsaturated, deduplicated, and resumable?'
      )
    },
    {
      code: 'ACQUIRE-2',
      title: 'faithful read and checkpoint',
      description:
        'Detail, complete transcripts, and MCP screenshot bytes retain identities, hashes, immutable versions, and explicit omissions.',
      sources: ['standards-granola-acquisition.md#acquisition-fidelity', 'standards-granola-acquisition.md#checkpoint'],
      judgment: judgment(
        'Does evidence reconcile attachment counts and UUIDs, validate complete transcript pages and image bytes, and preserve hashes, versions, provenance, and omissions?'
      )
    },
    {
      code: 'ACQUIRE-3',
      title: 'amendment revalidation honest',
      description:
        'Verified Acquired skips remain distinct from explicit exhaustive refresh because identity listing and progress markers cannot prove content unchanged.',
      sources: ['standards-granola-acquisition.md#incremental-acquisition-and-amendments'],
      judgment: judgment(
        'Does the checkpoint evidence name its revalidation coverage and avoid claiming unchanged content from identity listing alone?'
      )
    },

    {
      code: 'ACQUIRE-4',
      title: 'handling checkpoints survive capture removal',
      description:
        'Verified preservation permits temporary capture removal while retained handling checkpoints prevent unchanged reimport and surface amendments for review.',
      sources: ['standards-granola-acquisition.md#staging-and-harvesting-boundary'],
      judgment: judgment(
        'Does removal follow verified durable preservation, retain the handling checkpoint, avoid unchanged recapture, and distinguish amendments from missing staged evidence?'
      )
    }
  ]
} satisfies RubricFamily<GranolaRubricContext, GranolaRubricContext>
