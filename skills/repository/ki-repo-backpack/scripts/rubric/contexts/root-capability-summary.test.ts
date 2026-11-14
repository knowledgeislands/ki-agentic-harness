import { expect, test } from 'bun:test'
import type { CapabilityCounts } from './capability-publication.ts'
import { prepareRootCapabilitySummary } from './root-capability-summary.ts'

const expected: CapabilityCounts = { total: 60, governance: 50, process: 10, knowledge: 0 }
const claim = (counts = expected): string =>
  `- **Skills** ([\`skills/\`](skills)) — ${counts.total} reusable [Agent Skills](https://agentskills.io/specification): ${counts.governance} governance skills that hold standards and ${counts.process} process skills that drive workflows. Keep this prose.\n`

test('matching, absent, and stale summaries are classified', () => {
  expect(prepareRootCapabilitySummary(claim(), expected, [])).toEqual({
    state: 'matching',
    issues: [],
    observed: expected
  })
  expect(prepareRootCapabilitySummary('# Harness\n\nSkills are documented below.\n', expected, [])).toEqual({
    state: 'absent',
    issues: []
  })

  const stale = prepareRootCapabilitySummary(
    claim({ total: 57, governance: 48, process: 9, knowledge: 0 }),
    expected,
    []
  )
  expect(stale).toEqual({
    state: 'stale',
    issues: [],
    observed: { total: 57, governance: 48, process: 9, knowledge: 0 },
    merged: claim()
  })
})

test('incomplete and ambiguous numeric summaries are diagnostic', () => {
  expect(
    prepareRootCapabilitySummary(
      '- **Skills** — 60 reusable [Agent Skills](https://agentskills.io/specification): see the catalogue.\n',
      expected,
      []
    )
  ).toEqual({
    state: 'incomplete',
    issues: [
      'README.md contains a numeric Agent Skills claim without the complete total, governance, process and any knowledge count shape.'
    ]
  })

  expect(prepareRootCapabilitySummary(`${claim()}${claim()}`, expected, [])).toEqual({
    state: 'ambiguous',
    issues: ['README.md contains more than one numeric Agent Skills capability claim.']
  })
})

test('a numeric summary cannot be checked against malformed capability evidence', () => {
  expect(prepareRootCapabilitySummary(claim(), undefined, ['skills/example/SKILL.md has invalid frontmatter'])).toEqual(
    {
      state: 'unsafe',
      issues: ['skills/example/SKILL.md has invalid frontmatter']
    }
  )
})

test('repair changes only the three numeric tokens', () => {
  const original = claim({ total: 1, governance: 2, process: 3, knowledge: 0 })
  const draft = prepareRootCapabilitySummary(original, expected, [])
  expect(draft.merged?.replaceAll(/\d+/g, '#')).toBe(original.replaceAll(/\d+/g, '#'))
})

test('a knowledge count joins the claim once the harness publishes a knowledge skill', () => {
  const withKnowledge: CapabilityCounts = { total: 61, governance: 50, process: 10, knowledge: 1 }
  const draft = prepareRootCapabilitySummary(claim(), withKnowledge, [])
  expect(draft.state).toBe('stale')
  const merged =
    '- **Skills** ([`skills/`](skills)) — 61 reusable [Agent Skills](https://agentskills.io/specification): 50 governance skills that hold standards, 10 process skills that drive workflows and 1 knowledge skill that holds a body of knowledge. Keep this prose.\n'
  expect(draft.merged).toBe(merged)
  expect(prepareRootCapabilitySummary(merged, withKnowledge, [])).toEqual({
    state: 'matching',
    issues: [],
    observed: withKnowledge
  })
})
