import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { auditEvidence, type StreamRubricContext, type StreamsRubricContext } from '../contexts/streams.ts'

const SOURCE = 'standards-streams-structure.md'

const STREAM_1: RubricItem<StreamRubricContext> = {
  code: 'STREAM-1',
  title: 'operational areas',
  description:
    'Streams contains the Roadmap operational area; recurring definitions belong in Activities, with Trades reserved for later explicit adoption.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    overrideLevels: ['FAIL'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Establish Roadmap; reconcile any Housekeeping definitions into configured Activities only with owner approval, preserving linked-run evidence.'
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.operationalAreas, 'WARN', ['FAIL']) }
  }
}

const STREAM_2: RubricItem<StreamRubricContext> = {
  code: 'STREAM-2',
  title: 'legacy state folders',
  description: 'Legacy state and Focus folders are migration inputs, not target Streams structure.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Classify each retained legacy record before removing or replacing a legacy navigation folder.'
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.legacyFolders, 'WARN') }
  }
}

const STREAM_4: RubricItem<StreamRubricContext> = {
  code: 'STREAM-4',
  title: 'adapter-owned records',
  description:
    'Roadmap records follow their owning adapter; recurring definitions are Activity notes rather than a generic Streams record model.',
  sources: [SOURCE],
  judgment: {
    scope: 'Roadmap records and any recurring definitions still awaiting reconciliation out of Streams.',
    prompt:
      'Does each roadmap record follow its adapter, with recurring obligations routed to the configured Activity collection?',
    outcomes: ['conforming', 'adapter migration required', 'classification decision required'],
    guidance:
      'Route the record to the correct area and apply its owning adapter’s format; record any unresolved classification decision.'
  }
}

const STREAM_5: RubricItem<StreamRubricContext> = {
  code: 'STREAM-5',
  title: 'legacy migration disposition',
  description:
    'Each retained legacy Stream has a deliberate roadmap, recurring Activity, canonical-knowledge, or prune disposition.',
  sources: [SOURCE],
  judgment: {
    scope: 'Sampled legacy Streams records and their owner-approved migration decisions.',
    prompt: 'Does each sampled legacy record have an appropriate explicit disposition?',
    outcomes: ['conforming', 'migration required', 'owner decision required'],
    guidance:
      'Record the owner-approved destination before moving, retaining, or pruning the legacy record; never infer it from the former path.'
  }
}

const STREAM_6: RubricItem<StreamRubricContext> = {
  code: 'STREAM-6',
  title: 'unique roadmap identity',
  description: 'Every Streams/Roadmap record carries an identifier no other record in the base shares.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Keep the canonical holder of the identifier; reallocate the other record from _ISSUES.md with a committed ledger advance and update its references. Never reuse a pruned serial.'
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.roadmapIdentity, 'FAIL') }
  }
}

const STREAM_7: RubricItem<StreamRubricContext> = {
  code: 'STREAM-7',
  title: 'roadmap record frontmatter',
  description:
    'Every Streams/Roadmap record other than _ISSUES.md and the Roadmap.md index note begins with parseable frontmatter whose id matches its filename identifier.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Give the record canonical frontmatter in the roadmap adapter's work-item format with an id matching its filename, or move a non-record out of Streams/Roadmap/. Full record format remains the roadmap adapter's audit."
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.roadmapFrontmatter, 'FAIL') }
  }
}

export const STREAM: RubricFamily<StreamsRubricContext, StreamRubricContext> = {
  code: 'STREAM',
  title: 'Streams structure',
  description: 'Operational-area layout, legacy migration, and adapter routing.',
  standard: SOURCE,
  selectContext: (context) => context.stream,
  items: [STREAM_1, STREAM_2, STREAM_4, STREAM_5, STREAM_6, STREAM_7]
}
