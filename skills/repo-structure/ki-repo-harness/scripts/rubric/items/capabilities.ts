import { AUTOMATIC_REMEDIATION, type AuditOutcome, type RubricFamily, type RubricItem } from '../../shared/rubric.ts'
import type {
  HarnessCapabilityPublicationContext,
  HarnessReviewContext,
  HarnessRootCapabilitySummaryContext,
  HarnessRubricContext,
  HarnessSkillDiagramContext
} from '../contexts/harness.ts'

const STANDARD = ['standards-compatible-harness.md#capability-publication'] as const

type CapabilitiesContext = HarnessReviewContext & {
  publication: HarnessCapabilityPublicationContext
  rootSummary: HarnessRootCapabilitySummaryContext
  skillDiagrams: readonly HarnessSkillDiagramContext[]
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
  title: 'Generated skill diagrams are exact',
  description:
    'A harness that adopts `ki-diagrams` publishes two Archify architecture sources derived deterministically from `SKILL.md` frontmatter and the `skills/<concern>/<skill>/` layout. `docs/diagrams/skill-map.architecture.json` draws one region per source concern with each skill in the shape its `ki-applicability` declares; `docs/diagrams/skill-graph.architecture.json` draws the skills that have a declared relationship, with solid `ki-depends-on` composition edges and dashed `ki-optional-depends-on` edges. AUDIT compares each committed source with its rendering, ignoring only the traced revision; CONFORM rewrites it. The SVG beside each follows through the `ki-diagrams` refresh procedure.',
  sources: STANDARD,
  mechanical: {
    level: 'FAIL',
    remediation: AUTOMATIC_REMEDIATION,
    audit: {
      phase: 'DERIVED',
      run: ({ skillDiagrams }) => {
        if (skillDiagrams.every((diagram) => diagram.state === 'not-applicable'))
          return [
            {
              status: 'NOT_APPLICABLE',
              message: 'The repository does not declare ki-diagrams, so no skill diagrams are published.',
              subject: 'docs/diagrams/'
            }
          ]
        return skillDiagrams.flatMap((diagram): AuditOutcome[] => {
          const subject = diagram.path
          if (diagram.state === 'in-sync')
            return [{ status: 'PASS', message: 'The generated diagram is exact.', subject }]
          if (diagram.state === 'unsafe' || diagram.state === 'not-applicable')
            return diagram.issues.map((message) => ({ status: 'VIOLATION', message, subject }))
          return [
            {
              status: 'VIOLATION',
              message:
                diagram.state === 'missing'
                  ? 'The generated diagram is missing.'
                  : 'The generated diagram differs from canonical SKILL.md frontmatter; regenerate it, then finalize and re-export the SVG.',
              subject
            }
          ]
        })
      }
    },
    conform: {
      phase: 'DERIVED',
      run: ({ skillDiagrams }) => {
        for (const diagram of skillDiagrams)
          if (diagram.state === 'missing' || diagram.state === 'stale') diagram.requestUpdate?.()
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
    skillDiagrams: context.skillDiagrams
  }),
  items: [CAP_1, CAP_2, CAP_3, CAP_4]
}
