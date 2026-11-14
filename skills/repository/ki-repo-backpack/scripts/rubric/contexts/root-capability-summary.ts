import type { CapabilityCounts } from './capability-publication.ts'

export type RootCapabilitySummaryDraft = {
  state: 'absent' | 'matching' | 'stale' | 'incomplete' | 'ambiguous' | 'unsafe'
  issues: readonly string[]
  observed?: CapabilityCounts
  merged?: string
}

const claimSignal = /\d+ reusable \[Agent Skills\]\([^)]+\)/g
const completeClaim =
  /(?<total>\d+)(?<afterTotal> reusable \[Agent Skills\]\([^)]+\): )(?<governance>\d+)(?<afterGovernance> governance skills that hold standards(?:, | and ))(?<process>\d+)(?<afterProcess> process skills that drive workflows)(?<knowledgeClause> and (?<knowledge>\d+) knowledge skills? that holds? (?:a body|bodies) of knowledge)?/g

/** The knowledge clause the claim carries once the harness publishes a knowledge skill, and never before. */
const knowledgeClause = (count: number): string =>
  count === 0
    ? ''
    : ` and ${count} knowledge ${count === 1 ? 'skill that holds a body' : 'skills that hold bodies'} of knowledge`

const afterGovernance = (knowledge: number): string =>
  knowledge === 0 ? ' governance skills that hold standards and ' : ' governance skills that hold standards, '

const countMatches = (content: string, pattern: RegExp): number => [...content.matchAll(pattern)].length

export const prepareRootCapabilitySummary = (
  readme: string | undefined,
  expected: CapabilityCounts | undefined,
  inventoryIssues: readonly string[]
): RootCapabilitySummaryDraft => {
  if (readme === undefined) return { state: 'absent', issues: [] }

  const candidates = countMatches(readme, claimSignal)
  if (candidates === 0) return { state: 'absent', issues: [] }

  const matches = [...readme.matchAll(completeClaim)]
  if (candidates > 1 || matches.length > 1)
    return {
      state: 'ambiguous',
      issues: ['README.md contains more than one numeric Agent Skills capability claim.']
    }
  if (matches.length === 0)
    return {
      state: 'incomplete',
      issues: [
        'README.md contains a numeric Agent Skills claim without the complete total, governance, process and any knowledge count shape.'
      ]
    }
  if (expected === undefined)
    return {
      state: 'unsafe',
      issues: inventoryIssues.length > 0 ? inventoryIssues : ['Canonical capability counts are unavailable.']
    }

  const match = matches[0]
  const groups = match?.groups
  if (!match || match.index === undefined || !groups)
    return { state: 'unsafe', issues: ['README.md capability-count captures are unavailable.'] }

  const observed: CapabilityCounts = {
    total: Number.parseInt(groups.total ?? '', 10),
    governance: Number.parseInt(groups.governance ?? '', 10),
    process: Number.parseInt(groups.process ?? '', 10),
    knowledge: groups.knowledge === undefined ? 0 : Number.parseInt(groups.knowledge, 10)
  }
  if (Object.values(observed).some((value) => !Number.isSafeInteger(value)))
    return { state: 'unsafe', issues: ['README.md capability counts are not safe integers.'] }

  const matching =
    observed.total === expected.total &&
    observed.governance === expected.governance &&
    observed.process === expected.process &&
    observed.knowledge === expected.knowledge &&
    (groups.knowledgeClause ?? '') === knowledgeClause(expected.knowledge) &&
    groups.afterGovernance === afterGovernance(expected.knowledge)
  if (matching) return { state: 'matching', issues: [], observed }

  const replacement = `${expected.total}${groups.afterTotal}${expected.governance}${afterGovernance(expected.knowledge)}${expected.process}${groups.afterProcess}${knowledgeClause(expected.knowledge)}`
  const merged = `${readme.slice(0, match.index)}${replacement}${readme.slice(match.index + match[0].length)}`
  return { state: 'stale', issues: [], observed, merged }
}
