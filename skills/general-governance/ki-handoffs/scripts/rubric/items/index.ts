import type { AuditOutcome, ConformOutcome, RubricDefinition, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { type HandoffsRubricContext, hasDecisionsHeading, hasReadinessMarker, namesEscalate, namesLocked } from '../contexts/handoffs.ts'

const VALID_TIERS = new Set(['haiku', 'sonnet', 'opus'])

const outcomes = <Result>(values: Result[]): RubricOutcomes<Result> => {
  if (values.length === 0) throw new Error('rubric execution must return at least one outcome')
  return values as unknown as RubricOutcomes<Result>
}

const result = (status: AuditOutcome['status'], message: string, subject?: string): RubricOutcomes<AuditOutcome> => [
  { status, message, ...(subject ? { subject } : {}) }
]

const MARKERS = [
  {
    code: 'HAND-1',
    title: 'Semantic tier marker',
    description:
      'An artifact with handoff: true carries a tier field whose value is one of haiku / sonnet / opus (the opt-in marker contract). Missing or out-of-set → FAIL.',
    sources: ['standards.md#the-opt-in-marker-contract'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HandoffsRubricContext) => {
          if (!context.targetExists) return result('VIOLATION', `Requested audit path does not exist: ${context.target}`, context.target)
          if (context.artifacts.length === 0) return result('NOT_APPLICABLE', 'No handoff-opted-in artifacts (handoff: true).')
          return outcomes<AuditOutcome>(
            context.artifacts.map((artifact) => {
              const tier = artifact.frontmatter.tier
              if (!tier)
                return {
                  status: 'VIOLATION',
                  message: "handoff artifact missing 'tier' (one of haiku | sonnet | opus)",
                  subject: artifact.subject
                }
              return {
                status: VALID_TIERS.has(tier) ? 'PASS' : 'VIOLATION',
                message: VALID_TIERS.has(tier) ? 'tier is a valid semantic value.' : `tier '${tier}' not one of haiku | sonnet | opus`,
                subject: artifact.subject
              }
            })
          )
        }
      }
    }
  },
  {
    code: 'HAND-2',
    title: 'Decisions locked versus escalate',
    description:
      "An artifact with handoff: true has a body section whose heading matches decisions, and that section names both locked and escalate (the opt-in marker contract; the quality bar's “Decisions resolved”). Missing section or either label → FAIL.",
    sources: ['standards.md#the-opt-in-marker-contract', 'standards.md#the-quality-bar'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HandoffsRubricContext) => {
          if (!context.targetExists) return result('NOT_APPLICABLE', 'Requested path is absent.', context.target)
          if (context.artifacts.length === 0) return result('NOT_APPLICABLE', 'No handoff-opted-in artifacts (handoff: true).')
          return outcomes<AuditOutcome>(
            context.artifacts.map((artifact) => {
              if (!hasDecisionsHeading(artifact))
                return {
                  status: 'VIOLATION',
                  message: "no decisions section (a '## Decisions' heading)",
                  subject: artifact.subject
                }
              const complete = namesLocked(artifact) && namesEscalate(artifact)
              return {
                status: complete ? 'PASS' : 'VIOLATION',
                message: complete
                  ? 'Decisions section distinguishes locked from escalate.'
                  : "decisions section must distinguish 'locked' from 'escalate' (both labels present)",
                subject: artifact.subject
              }
            })
          )
        }
      }
    }
  },
  {
    code: 'HAND-3',
    title: 'Readiness marker',
    description:
      'An artifact with handoff: true carries a readiness marker: a readiness: frontmatter field, a ## Readiness heading, or a Readiness test checkbox (the readiness test). Missing → WARN.',
    sources: ['standards.md#the-opt-in-marker-contract', 'standards.md#the-readiness-test'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HandoffsRubricContext) => {
          if (!context.targetExists) return result('NOT_APPLICABLE', 'Requested path is absent.', context.target)
          if (context.artifacts.length === 0) return result('NOT_APPLICABLE', 'No handoff-opted-in artifacts (handoff: true).')
          return outcomes<AuditOutcome>(
            context.artifacts.map((artifact) => ({
              status: hasReadinessMarker(artifact) ? 'PASS' : 'VIOLATION',
              message: hasReadinessMarker(artifact)
                ? 'Readiness marker is present.'
                : "no readiness marker (readiness: frontmatter, a '## Readiness' heading, or a 'Readiness test' checkbox)",
              subject: artifact.subject
            }))
          )
        }
      },
      conform: {
        phase: 'NORMALISE',
        run: (context: HandoffsRubricContext): RubricOutcomes<ConformOutcome> => {
          if (!context.targetExists) return [{ status: 'NOT_APPLICABLE', message: 'Requested path is absent.', subject: context.target }]
          if (context.artifacts.length === 0)
            return [{ status: 'NOT_APPLICABLE', message: 'No handoff-opted-in artifacts (handoff: true).' }]
          return outcomes(context.artifacts.flatMap(context.addReadinessMarker))
        }
      }
    }
  }
] as const

const DOCTRINE = [
  {
    code: 'HAND-4',
    title: 'Locked decisions are closed',
    description:
      'The locked decisions are genuinely closed: no residual reasoning, hedging, or open questions parked under “locked” (the reasoning-layer split; quality bar “Decisions resolved”).',
    sources: ['standards.md#the-reasoning-layer-split', 'standards.md#the-quality-bar'],
    judgment: {
      prompt:
        'The locked decisions are genuinely closed: no residual reasoning, hedging, or open questions parked under “locked” (the reasoning-layer split; quality bar “Decisions resolved”).'
    }
  },
  {
    code: 'HAND-5',
    title: 'Definition of done',
    description:
      'Each unit carries a definition-of-done that is a pass/fail acceptance test, not a goal (quality bar “Definition-of-done”).',
    sources: ['standards.md#the-quality-bar'],
    judgment: {
      prompt: 'Each unit carries a definition-of-done that is a pass/fail acceptance test, not a goal (quality bar “Definition-of-done”).'
    }
  },
  {
    code: 'HAND-6',
    title: 'Appropriate assigned tier',
    description:
      'The assigned tier is appropriate to how concrete the steps are: mechanical work at the cheap class, spec-driven drafting at the mid class, hard judgement at the top class; a unit that could only run at the planning tier signals under-decomposed reasoning (tier assignment).',
    sources: ['standards.md#tier-assignment'],
    judgment: {
      prompt:
        'The assigned tier is appropriate to how concrete the steps are: mechanical work at the cheap class, spec-driven drafting at the mid class, hard judgement at the top class; a unit that could only run at the planning tier signals under-decomposed reasoning (tier assignment).'
    }
  },
  {
    code: 'HAND-7',
    title: 'Cold-agent readiness',
    description:
      'The readiness test would actually pass: a cold agent at the assigned tier could execute the first phase from the spec alone (the readiness test).',
    sources: ['standards.md#the-readiness-test'],
    judgment: {
      prompt:
        'The readiness test would actually pass: a cold agent at the assigned tier could execute the first phase from the spec alone (the readiness test).'
    }
  },
  {
    code: 'HAND-8',
    title: 'Tokenomics composition boundary',
    description:
      'Cost and tier-selection reasoning are not restated here but deferred to ki-tokenomics; no model ids or prices are hard-coded on the artifact (composition boundary).',
    sources: ['standards.md#tier-assignment'],
    judgment: {
      prompt:
        'Cost and tier-selection reasoning are not restated here but deferred to `ki-tokenomics`; no model ids or prices are hard-coded on the artifact (composition boundary).'
    }
  }
] as const

export const KI_HANDOFFS_RUBRIC: RubricDefinition<HandoffsRubricContext> = {
  name: 'ki-handoffs',
  concern: 'Knowledge Islands handoff readiness',
  families: [
    {
      code: 'HAND',
      title: 'Handoff readiness',
      description: 'The opt-in marker contract and delegation-readiness doctrine.',
      standard: 'standards.md#the-opt-in-marker-contract',
      selectContext: (context) => context,
      items: [...MARKERS, ...DOCTRINE]
    }
  ]
}

export const KI_HANDOFFS_FAMILY_CODES = ['HAND'] as const
