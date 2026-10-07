import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { outcomesFor, type RoadmapAuditContext, type RoadmapRubricContext } from '../contexts/roadmap.ts'

const SOURCE = 'standards-repository-roadmaps.md'

const ROAD_1: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-1',
  title: 'roadmap structure and root orientation',
  description:
    'The canonical docs/roadmap structure contains only regular work-item files, the issue ledger, the ideas list and an optional README index, and root ROADMAP.md is a concise orientation rather than a duplicate queue.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Restore the concise root orientation and canonical roadmap structure without reconstructing or prioritizing the work queue.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => outcomesFor(context, 'ROAD-1', 'The roadmap structure and root orientation are canonical.')
    }
  }
}

const ROAD_2: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-2',
  title: 'honest horizon placement',
  description:
    'Triage records are captured, unadopted work without a horizon; adopted records sit in honest horizons for their status; held records name their reason, condition, and review date; cancelled records carry an evidence-backed resolution.',
  sources: [SOURCE],
  judgment: {
    scope: 'Every horizon, triage adoption boundary, hold, and cancellation.',
    prompt:
      'Review whether triage records remain unadopted and horizon-free, moves out of triage have explicit human adoption, held records name an honest condition, and cancelled records carry an evidence-backed resolution.',
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance:
      'Confirm placement with the owning authority, record a gap, or record an explicit exclusion; do not move work automatically.'
  }
}

const ROAD_3: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-3',
  title: 'open finite work',
  description: 'Work-item indexes are open-only and contain finite work rather than continuous practice.',
  sources: [SOURCE],
  judgment: {
    scope: 'Every roadmap item represented in the open work queue.',
    prompt: 'Review that roadmap items are finite open work, not completed work or ongoing practice.',
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance:
      'Split, retain, close, or exclude work only after an owner confirms the intended record; otherwise record a gap.'
  }
}

const ROAD_4: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-4',
  title: 'horizon vocabulary',
  description:
    'Every work item uses the canonical horizon vocabulary; the root orientation carries no parallel horizon list.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Use the canonical horizon vocabulary and remove duplicate root-horizon lists without changing any item placement.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => outcomesFor(context, 'ROAD-4', 'Every horizon has its canonical blurb.')
    }
  }
}

const ROAD_5: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-5',
  title: 'horizon transitions and readiness',
  description:
    'Capture into triage needs no adoption decision; leaving triage requires explicit human adoption, and later horizon promotion, deferral, hold, and release meet the readiness contract.',
  sources: [SOURCE],
  judgment: {
    scope: 'Every proposed triage adoption, promotion, deferral, hold, release, and its readiness evidence.',
    prompt:
      'Review triage exits for explicit human adoption and each later promotion, deferral, hold, or release against the readiness contract and plan state.',
    outcomes: ['conforming', 'gap', 'exclusion'],
    guidance:
      'Confirm the lifecycle move with its owner, record a gap, or record an explicit exclusion; never choose the move automatically.'
  }
}

const ROAD_6: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-6',
  title: 'repository work-item code',
  description:
    'The ki-repo table declares a valid stable repository code; roadmap configuration declares any identifier areas as a map from code to title and any components as a vocabulary; a bare area list fails in the Knowledge Islands Agora and warns elsewhere, where each listed code is defined under ## Areas in the roadmap index; retired themes and area-to-theme maps fail.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Correct the configured repository code, areas, or component vocabulary from authoritative repository configuration.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => outcomesFor(context, 'ROAD-6', 'The repository work-item code is valid.')
    }
  }
}

const ROAD_7: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-7',
  title: 'issue-allocation ledger',
  description:
    'docs/roadmap/_ISSUES.md records repository-wide or fixed-area high-water marks. A number is reserved by committing the applicable ledger advance on its own before the record is written, in the one designated writing checkout the repository serialises roadmap writes through. The mechanical checks read the ledger alone — its issuing mode, its exact match against the configured areas, and its high-water floor against retained items — and cannot observe the commit ordering or the checkout that made the advance.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'automatic'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        outcomesFor(context, 'ROAD-7', 'The issue-allocation ledger reserves every issued repository or area number.')
    },
    conform: {
      phase: 'DERIVED',
      run: (context) => {
        context.scaffoldIssueLedger?.()
        context.repairIssueLedger?.()
      }
    }
  }
}

const ROAD_8: RubricItem<RoadmapAuditContext> = {
  code: 'ROAD-8',
  title: 'lifecycle and pruning commit boundaries',
  description:
    'Lifecycle transitions may share their coherent work commit; a prune-only commit with the standardised message removes one or more eligible records only after each has landed as done.',
  sources: [SOURCE],
  judgment: {
    scope:
      'The Git history and proposed commits that create or transition work records, land accepted done records, or prune selected records.',
    prompt:
      'Review whether lifecycle changes are grouped with their coherent work without requiring intermediate-state commits, and whether every prune commit follows a prior committed done state, contains only eligible work-record removals, and carries the standardised `chore(roadmap): prune <N> done work record(s)` subject with one `- <ID>` body line per record.',
    outcomes: [
      'conforming',
      'lifecycle commit over-separated',
      'committed done state missing',
      'prune commit mixed',
      'prune commit message nonstandard'
    ],
    guidance:
      'Combine lifecycle changes with the planning, implementation, review, or closure unit they describe. Before pruning, land each selected record as done; then remove one or more eligible records in a dedicated prune-only commit under the standardised message; `ki repo roadmap prune` makes that commit by default unless run with `--no-commit`. Git history is the archive; pruned records are not restored.'
  }
}

export const ROAD: RubricFamily<RoadmapRubricContext, RoadmapAuditContext> = {
  code: 'ROAD',
  title: 'roadmaps',
  description: 'Canonical generated-index structure, placement, and readiness.',
  standard: SOURCE,
  selectContext: (context) => context.roadmaps,
  items: [ROAD_1, ROAD_2, ROAD_3, ROAD_4, ROAD_5, ROAD_6, ROAD_7, ROAD_8]
}
