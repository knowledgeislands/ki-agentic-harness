import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PrincipalContext } from '../contexts/principal.ts'

const SOURCE = 'standards-principal.md'

const PRINCIPAL_1: RubricItem<PrincipalContext> = {
  code: 'PRINCIPAL-1',
  title: 'principal governance surface exists',
  description: 'A principal base carries the required governance, memory, and Enactment Process entry points.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Create or restore the missing principal governance entry point through the principal owner.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        context.missing.length || context.empty.length
          ? context.missing
              .map((subject) => ({
                status: 'VIOLATION' as const,
                message: 'Missing or unsafe principal entry point.',
                subject
              }))
              .concat(
                context.empty.map((subject) => ({
                  status: 'VIOLATION' as const,
                  message: 'Principal entry point is empty and cannot provide structural orientation.',
                  subject
                }))
              )
          : [{ status: 'PASS', message: 'The principal governance surface is present.' }]
    }
  }
}
const PRINCIPAL_2: RubricItem<PrincipalContext> = {
  code: 'PRINCIPAL-2',
  title: 'Enactment gate is anchored',
  description: 'Always-loaded repository guidance names the Enactment Process or enactment gate.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Anchor the Enactment Process in the authoritative repository guidance through the principal owner.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => [
        context.enactmentAnchor
          ? { status: 'PASS', message: 'The Enactment gate is anchored in repository orientation.' }
          : {
              status: 'VIOLATION',
              message: 'Anchor the Enactment Process in CLAUDE.md or AGENTS.md.',
              subject: 'CLAUDE.md / AGENTS.md'
            }
      ]
    }
  }
}

const PRINCIPAL_3: RubricItem<PrincipalContext> = {
  code: 'PRINCIPAL-3',
  title: 'territorial declarations agree',
  description:
    'Charter and Known Lands agree on the territory, its one Capital, canonical repository identities, and governed membership; registry location, repository selection, company binding, or a passing audit does not appoint a principal or grant exchange rights.',
  sources: [`${SOURCE}#territorial-declaration`],
  judgment: {
    scope: 'The Charter, internal Known Lands inventory, and their cited authority declarations.',
    prompt:
      'Do the declarations identify one Capital and agree on jurisdiction and membership, with discrepancies retained for the territorial owner rather than resolved from runtime or working-set evidence?',
    outcomes: ['conforming', 'declaration reconciliation required', 'owner decision required'],
    guidance:
      'Reconcile the authored declarations through the territorial owner; record unresolved differences without inferring authority from registry, repository selection, or company state.'
  }
}
const PRINCIPAL_4: RubricItem<PrincipalContext> = {
  code: 'PRINCIPAL-4',
  title: 'internal inventory and external signposting are distinct',
  description:
    'Known Lands separates governed internal membership from external signposting, uses canonical repository identities and authority references, and leaves local locations in the registry; receiver-owned public adoption needs no reciprocal public consumer list.',
  sources: [`${SOURCE}#known-lands-relationships`],
  judgment: {
    scope: 'Known Lands entries and any declarations of external knowledge consumption or adoption.',
    prompt:
      'Are internal members and external destinations distinguishable, with external authority respected, local unavailability separate from membership, and adoption controlled by the receiver without publishing private consumer identities?',
    outcomes: ['conforming', 'relationship clarification required', 'owner decision required'],
    guidance:
      'Clarify relationship sections or labels and authority references; keep local locations in the registry and adoption decisions with the receiver.'
  }
}
export const PRINCIPAL: RubricFamily<PrincipalContext, PrincipalContext> = {
  code: 'PRINCIPAL',
  title: 'principal governance',
  description: 'Principal governance surfaces, Enactment anchor, and authored territorial relationships.',
  standard: SOURCE,
  selectContext: (context) => context,
  items: [PRINCIPAL_1, PRINCIPAL_2, PRINCIPAL_3, PRINCIPAL_4]
}
