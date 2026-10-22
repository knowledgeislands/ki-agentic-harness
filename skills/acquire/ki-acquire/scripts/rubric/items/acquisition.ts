import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { AcquisitionContext } from '../contexts/acquisition.ts'

export const ACQUIRE = {
  code: 'ACQUIRE',
  title: 'Faithful common acquisition',
  standard: 'standards-acquisition.md',
  description:
    'Policy judgments require source and destination evidence; mechanical success does not establish fidelity.',
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
      title: 'existing captures are found before writing',
      description:
        'An existing capture of the same source identity is found first; unchanged retries are no-ops and unknown or conflicting routes remain visible.',
      sources: ['standards-acquisition.md#identity-and-routing'],
      judgment: judgment(
        'Was an existing capture of the source identity sought before writing, with changed scope linked or refreshed deliberately and unresolved routing left visible?'
      )
    },
    {
      code: 'ACQUIRE-3',
      title: 'promised material and originals are preserved',
      description:
        'The selected source contract governs fidelity, exact required originals, retained versions and explicit omissions.',
      sources: ['standards-acquisition.md#preservation-and-originals'],
      judgment: judgment(
        'Do source and asset evidence prove the promised coverage and required original bytes, with gaps still visible?'
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
      title: 'the capture is the record and authority stays separate',
      description:
        'No ledger, checkpoint or receipt accompanies the capture. Dispatch is a Git move into the receiver’s +/_ACQUIRED/. Receiver triage annotates the package with evidenced dispositions and gaps while preserving source material; provider mutation, reconciliation, source deletion and history compaction each require separate authority.',
      sources: [
        'standards-acquisition.md#scope',
        'standards-acquisition.md#dispatch-and-authority',
        'standards-acquisition.md#receiver-local-triage'
      ],
      judgment: judgment(
        'Is the capture package the only acquisition record, does each complete received session carry an evidenced local disposition with gaps visible, and did every dispatch, reconciliation, provider mutation or destructive operation stay within its own authority?'
      )
    }
  ]
} satisfies RubricFamily<AcquisitionContext, AcquisitionContext>
