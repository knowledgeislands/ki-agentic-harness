import { describe, expect, test } from 'bun:test'
import { matchingRoadmapItems, validateCandidate, validateCandidateSet } from './candidate-contract.ts'

const validCandidate = {
  title: 'Extract duplicate-scan helper',
  evidence: ['scripts/a.ts and scripts/b.ts repeat the same scan'],
  disposition: 'extract-script',
  roadmap: { treatment: 'new-item' }
}

describe('ki-skills candidate contract', () => {
  test('accepts an evidenced candidate with an allowed disposition and new-item treatment', () => {
    expect(validateCandidate(validCandidate)).toEqual([])
  })

  test('rejects missing evidence and unsupported dispositions', () => {
    expect(validateCandidate({ ...validCandidate, evidence: [], disposition: 'make-a-plugin' })).toEqual([
      'evidence must contain at least one non-empty string',
      'disposition must be one of: keep-as-guidance, move-to-reference, extract-script, new-skill, new-agent-or-hook, not-worth-formalising'
    ])
  })

  test('requires an existing-item amendment to name a qualified locator and forbids locators elsewhere', () => {
    expect(validateCandidate({ ...validCandidate, roadmap: { treatment: 'amend-existing-item' } })).toEqual([
      'an amendment requires a qualified roadmap locator'
    ])
    expect(validateCandidate({ ...validCandidate, roadmap: { treatment: 'new-item', locator: 'foundation-tooling/example' } })).toEqual([
      'only an amendment may name a roadmap locator'
    ])
  })

  test('surfaces exact normalised-title matches as reconciliation prompts', () => {
    expect(
      matchingRoadmapItems('Review and extract evolvable skill capabilities', [
        {
          locator: 'foundation-tooling/review-and-extract-evolvable-skill-capabilities',
          title: 'Review & Extract Evolvable Skill Capabilities'
        },
        { locator: 'foundation-tooling/build-the-cli', title: 'Build the CLI' }
      ])
    ).toEqual([
      {
        locator: 'foundation-tooling/review-and-extract-evolvable-skill-capabilities',
        title: 'Review & Extract Evolvable Skill Capabilities'
      }
    ])
  })

  test('rejects a malformed document before any route can be proposed', () => {
    expect(
      validateCandidateSet({ candidates: [{ ...validCandidate, roadmap: { treatment: 'amend-existing-item', locator: 'not/a/locator' } }] })
    ).toEqual(['candidates[0]: an amendment requires a qualified roadmap locator'])
  })
})
