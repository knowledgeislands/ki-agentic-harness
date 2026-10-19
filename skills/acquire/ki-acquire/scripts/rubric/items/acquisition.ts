import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { AcquisitionContext } from '../contexts/acquisition.ts'

export const ACQUIRE = {
  code: 'ACQUIRE',
  title: 'Faithful common acquisition',
  standard: 'standards-acquisition.md',
  description:
    'Policy judgments require source, request and destination evidence; mechanical success does not establish fidelity.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ACQUIRE-1',
      title: 'scope and coverage are explicit',
      description:
        'The authorised scope, provenance and chronology distinguish supplied text, a bounded digest and a complete source export.',
      sources: ['standards-acquisition.md#scope-and-coverage'],
      judgment: judgment(
        'Does the evidence establish the authorised source scope and coverage without inventing dates or weakening source-specific completeness?'
      )
    },
    {
      code: 'ACQUIRE-2',
      title: 'identities and routes survive retries',
      description:
        'Verified retries reuse established identities and paths while amendments and unknown or conflicting routes remain explicit.',
      sources: ['standards-acquisition.md#identities-and-routing'],
      judgment: judgment(
        'Were existing identities and handling evidence checked before writing, with request/package relationships and unresolved routing preserved?'
      )
    },
    {
      code: 'ACQUIRE-3',
      title: 'promised material and originals are preserved',
      description:
        'The selected source contract governs fidelity, exact required originals, retained versions and explicit omissions.',
      sources: ['standards-acquisition.md#preservation-and-originals'],
      judgment: judgment(
        'Do source and asset evidence prove the promised coverage and required original bytes, with gaps and earlier commitments still visible?'
      )
    },
    {
      code: 'ACQUIRE-4',
      title: 'completion follows destination verification',
      description:
        'Reports distinguish offered, received, committed and remotely verified material rather than overstating success.',
      sources: ['standards-acquisition.md#verification-and-reporting'],
      judgment: judgment(
        'Was the agreed destination read back and compared, and does the report match the actual verified scope and remaining gaps?'
      )
    },
    {
      code: 'ACQUIRE-5',
      title: 'handling proof and authority remain separate',
      description:
        'Handling evidence survives authorised package removal; capture does not grant receiver writes, provider mutation, source retirement or history compaction.',
      sources: ['standards-acquisition.md#retained-state-and-authority'],
      judgment: judgment(
        'Does retained proof prevent reacquisition of handled sources, and did every publication or destructive operation stay within its own authority?'
      )
    }
  ]
} satisfies RubricFamily<AcquisitionContext, AcquisitionContext>
