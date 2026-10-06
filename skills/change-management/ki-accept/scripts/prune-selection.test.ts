import { expect, test } from 'bun:test'
import { evaluatePruneSelection, type PruneSelectionInput, pruneCommitMessage } from './internal/prune-selection.ts'

const input = (overrides: Partial<PruneSelectionInput> = {}): PruneSelectionInput => ({
  adapter: 'roadmap',
  root: 'docs/roadmap',
  selectors: ['KI-HARNESS-001-complete.md'],
  completeResolution: true,
  candidates: [
    {
      path: 'KI-HARNESS-001-complete.md',
      id: 'KI-HARNESS-001',
      regularFile: true,
      symlink: false,
      canonical: true,
      status: 'done',
      committedDone: true,
      retainedByCompletionObservationTrade: false
    }
  ],
  ...overrides
})

test('selects only the complete eligible explicit done-record set without writes', () => {
  expect(evaluatePruneSelection(input())).toEqual({
    kind: 'selected',
    paths: ['KI-HARNESS-001-complete.md'],
    commitBoundary: 'prune-only',
    commitMessage: { subject: 'chore(roadmap): prune 1 done work record', body: '- KI-HARNESS-001' },
    writes: false
  })
})

test('groups multiple eligible done records under one prune-only commit boundary', () => {
  const first = input().candidates[0]
  if (!first) throw new Error('fixture must include one prune candidate')
  expect(
    evaluatePruneSelection(
      input({
        selectors: ['KI-HARNESS-00*-complete.md'],
        candidates: [{ ...first, path: 'KI-HARNESS-002-complete.md', id: 'KI-HARNESS-002' }, first]
      })
    )
  ).toEqual({
    kind: 'selected',
    paths: ['KI-HARNESS-002-complete.md', 'KI-HARNESS-001-complete.md'],
    commitBoundary: 'prune-only',
    commitMessage: {
      subject: 'chore(roadmap): prune 2 done work records',
      body: '- KI-HARNESS-001\n- KI-HARNESS-002'
    },
    writes: false
  })
})

test('stops without writes for an invalid root, traversal, incomplete resolution, symlink, non-terminal, or retained trade', () => {
  expect(evaluatePruneSelection(input({ root: 'Streams/Roadmap' }))).toMatchObject({
    kind: 'stop',
    reason: 'selected adapter root is invalid',
    writes: false
  })
  expect(evaluatePruneSelection(input({ selectors: ['../outside.md'] }))).toMatchObject({
    kind: 'stop',
    reason: 'prune selection contains an unsafe path or glob',
    writes: false
  })
  expect(evaluatePruneSelection(input({ completeResolution: false }))).toMatchObject({
    kind: 'stop',
    reason: 'prune selection did not resolve a complete non-empty set',
    writes: false
  })
  expect(evaluatePruneSelection(input({ candidates: [{ ...input().candidates[0], symlink: true }] }))).toMatchObject({
    kind: 'stop',
    reason: 'KI-HARNESS-001-complete.md is not a regular canonical work record',
    writes: false
  })
  expect(
    evaluatePruneSelection(input({ candidates: [{ ...input().candidates[0], status: 'awaiting-review' }] }))
  ).toMatchObject({
    kind: 'stop',
    reason: 'KI-HARNESS-001-complete.md is not done',
    writes: false
  })
  expect(
    evaluatePruneSelection(input({ candidates: [{ ...input().candidates[0], committedDone: false }] }))
  ).toMatchObject({
    kind: 'stop',
    reason: 'KI-HARNESS-001-complete.md has not landed as done',
    writes: false
  })
  expect(
    evaluatePruneSelection(input({ candidates: [{ ...input().candidates[0], committedDone: 'unknown' }] }))
  ).toMatchObject({
    kind: 'stop',
    reason: 'KI-HARNESS-001-complete.md has uncertain committed done evidence',
    writes: false
  })
  expect(
    evaluatePruneSelection(
      input({ candidates: [{ ...input().candidates[0], retainedByCompletionObservationTrade: true }] })
    )
  ).toMatchObject({
    kind: 'stop',
    reason: 'KI-HARNESS-001-complete.md is retained by an unresolved completion-observation trade',
    writes: false
  })
  expect(
    evaluatePruneSelection(
      input({ candidates: [{ ...input().candidates[0], retainedByCompletionObservationTrade: 'unknown' }] })
    )
  ).toMatchObject({
    kind: 'stop',
    reason: 'KI-HARNESS-001-complete.md has uncertain completion-observation trade evidence',
    writes: false
  })
})

test('the standardised prune commit message counts records and lists identifiers in order', () => {
  expect(pruneCommitMessage(['KI-HARNESS-GOV-010', 'KI-HARNESS-CLI-002', 'KI-HARNESS-GOV-003'])).toEqual({
    subject: 'chore(roadmap): prune 3 done work records',
    body: '- KI-HARNESS-CLI-002\n- KI-HARNESS-GOV-003\n- KI-HARNESS-GOV-010'
  })
})
