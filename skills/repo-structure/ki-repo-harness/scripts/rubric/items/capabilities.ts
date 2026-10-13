import { AUTOMATIC_REMEDIATION, type RubricFamily, type RubricItem } from '../../shared/rubric.ts'
import type {
  HarnessCapabilityPublicationContext,
  HarnessReviewContext,
  HarnessRootCapabilitySummaryContext,
  HarnessRubricContext,
  HarnessSkillGraphContext
} from '../contexts/harness.ts'
import { SKILL_GRAPH_PATH } from '../contexts/skill-graph.ts'

const STANDARD = ['standards-compatible-harness.md#capability-publication'] as const

type CapabilitiesContext = HarnessReviewContext & {
  publication: HarnessCapabilityPublicationContext
  rootSummary: HarnessRootCapabilitySummaryContext
  skillGraph: HarnessSkillGraphContext
}

const CAP_1: RubricItem<CapabilitiesContext> = {
  code: 'CAP-1',
  title: 'Capability inventory and boundaries',
  description:
    'Each populated harness shelf makes its typed capabilities discoverable and routes their content and runtime semantics to the owning kind standard.',
  sources: STANDARD,
  judgment: {
    scope: 'Every populated source shelf, its compatible payload representation, and the owning kind standards.',
    prompt:
      'Review each populated shelf: are its capabilities discoverable through the compatible payload, and are kind-specific semantics delegated to the appropriate standard?',
    outcomes: ['conforming', 'inventory revision', 'route to owning standard'],
    guidance:
      'Revise the inventory or route the concern to its owning standard; do not alter a capability’s runtime semantics from this container-level review.'
  }
}

const CAP_2: RubricItem<CapabilitiesContext> = {
  code: 'CAP-2',
  title: 'Generated capability catalogue is exact',
  description:
    'A populated skills shelf publishes one marker-bounded catalogue in `skills/README.md`, derived exactly from canonical skill frontmatter and safely replaceable without changing authored surrounding guidance.',
  sources: STANDARD,
  mechanical: {
    level: 'FAIL',
    remediation: AUTOMATIC_REMEDIATION,
    audit: {
      phase: 'DERIVED',
      run: ({ publication }) => {
        if (publication.state === 'in-sync')
          return [
            { status: 'PASS', message: 'The generated capability catalogue is exact.', subject: 'skills/README.md' }
          ]
        if (publication.state === 'unsafe')
          return publication.issues.map((message) => ({ status: 'VIOLATION', message, subject: 'skills/README.md' }))
        return [
          {
            status: 'VIOLATION',
            message:
              publication.state === 'missing'
                ? 'The generated capability catalogue is missing from skills/README.md.'
                : 'The generated capability catalogue differs from canonical SKILL.md frontmatter.',
            subject: 'skills/README.md'
          }
        ]
      }
    },
    conform: {
      phase: 'DERIVED',
      run: ({ publication }) => {
        if (publication.state !== 'in-sync') publication.requestUpdate?.()
      }
    }
  }
}

const CAP_3: RubricItem<CapabilitiesContext> = {
  code: 'CAP-3',
  title: 'Authored capability counts are exact',
  description:
    'When root `README.md` carries the recognised numeric Agent Skills summary, its total, governance, and process counts match canonical skill frontmatter; a single complete stale claim is safely repairable without changing surrounding prose.',
  sources: STANDARD,
  mechanical: {
    level: 'FAIL',
    remediation: AUTOMATIC_REMEDIATION,
    audit: {
      phase: 'DERIVED',
      run: ({ rootSummary }) => {
        if (rootSummary.state === 'absent')
          return [
            {
              status: 'NOT_APPLICABLE',
              message: 'README.md does not publish an explicit numeric Agent Skills summary.',
              subject: 'README.md'
            }
          ]
        if (rootSummary.state === 'matching')
          return [
            {
              status: 'PASS',
              message: 'The authored README.md capability counts match canonical skill frontmatter.',
              subject: 'README.md'
            }
          ]
        if (rootSummary.state === 'stale') {
          const expected = rootSummary.expected
          const observed = rootSummary.observed
          return [
            {
              status: 'VIOLATION',
              message: `README.md publishes ${observed?.total}/${observed?.governance}/${observed?.process} total/governance/process skills; canonical skill frontmatter requires ${expected?.total}/${expected?.governance}/${expected?.process}.`,
              subject: 'README.md'
            }
          ]
        }
        return rootSummary.issues.map((message) => ({ status: 'VIOLATION', message, subject: 'README.md' }))
      }
    },
    conform: {
      phase: 'DERIVED',
      run: ({ rootSummary }) => {
        if (rootSummary.state === 'stale') rootSummary.requestUpdate?.()
      }
    }
  }
}

const CAP_4: RubricItem<CapabilitiesContext> = {
  code: 'CAP-4',
  title: 'Generated skill graph is exact',
  description:
    'A harness that adopts `ki-diagrams` publishes `docs/diagrams/skill-graph.architecture.json`, the Archify architecture source derived deterministically from every skill’s `ki-depends-on` and `ki-optional-depends-on` frontmatter: one node per skill, solid composition edges, dashed optional edges, and one region at the foot for skills with no declared relationship. AUDIT compares the committed source with that rendering, ignoring only the traced revision; CONFORM rewrites it. The SVG beside it follows through the `ki-diagrams` refresh procedure.',
  sources: STANDARD,
  mechanical: {
    level: 'FAIL',
    remediation: AUTOMATIC_REMEDIATION,
    audit: {
      phase: 'DERIVED',
      run: ({ skillGraph }) => {
        const subject = SKILL_GRAPH_PATH
        if (skillGraph.state === 'not-applicable')
          return [
            {
              status: 'NOT_APPLICABLE',
              message: 'The repository does not declare ki-diagrams, so no skill graph is published.',
              subject
            }
          ]
        if (skillGraph.state === 'in-sync')
          return [{ status: 'PASS', message: 'The generated skill graph is exact.', subject }]
        if (skillGraph.state === 'unsafe')
          return skillGraph.issues.map((message) => ({ status: 'VIOLATION', message, subject }))
        return [
          {
            status: 'VIOLATION',
            message:
              skillGraph.state === 'missing'
                ? 'The generated skill graph is missing.'
                : 'The generated skill graph differs from canonical SKILL.md dependency frontmatter; regenerate it, then finalize and re-export the SVG.',
            subject
          }
        ]
      }
    },
    conform: {
      phase: 'DERIVED',
      run: ({ skillGraph }) => {
        if (skillGraph.state === 'missing' || skillGraph.state === 'stale') skillGraph.requestUpdate?.()
      }
    }
  }
}

export const CAP: RubricFamily<HarnessRubricContext, CapabilitiesContext> = {
  code: 'CAP',
  title: 'Capability publication',
  description: 'Typed compatible-harness capability inventory and kind-specific boundaries.',
  standard: 'standards-compatible-harness.md',
  selectContext: (context) => ({
    ...context.review,
    publication: context.capabilityPublication,
    rootSummary: context.rootCapabilitySummary,
    skillGraph: context.skillGraph
  }),
  items: [CAP_1, CAP_2, CAP_3, CAP_4]
}
