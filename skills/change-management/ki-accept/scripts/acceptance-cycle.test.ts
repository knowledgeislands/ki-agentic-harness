import { expect, test } from 'bun:test'
import {
  type AcceptanceCycleInput,
  evaluateAcceptanceCycle,
  REVIEW_PACKET_HEADINGS
} from './internal/acceptance-cycle.ts'

const input = (overrides: Partial<AcceptanceCycleInput> = {}): AcceptanceCycleInput => ({
  adapter: { kind: 'local', adapter: 'roadmap', root: 'docs/roadmap' },
  item: {
    kind: 'delivery',
    id: 'KI-HARNESS-001',
    canonical: true,
    pathWithinRoot: true,
    status: 'awaiting-review',
    stepsComplete: true,
    deliveryEvidencePresent: true,
    reviewHeadings: REVIEW_PACKET_HEADINGS
  },
  authority: { kind: 'human', explicitApproval: true },
  housekeeping: { kind: 'none' },
  ...overrides
})

const cancelItem = (overrides: Partial<Extract<AcceptanceCycleInput['item'], { kind: 'cancel' }>> = {}) => ({
  kind: 'cancel' as const,
  id: 'KI-HARNESS-002',
  canonical: true,
  pathWithinRoot: true,
  status: 'triage' as const,
  resolution: 'rejected' as const,
  cancellationEvidence: 'The concern is no longer applicable.',
  targetId: null,
  ...overrides
})

test('accepts one canonical awaiting-review record with explicit human authority without writes', () => {
  expect(evaluateAcceptanceCycle(input())).toEqual({
    kind: 'accept',
    transition: 'awaiting-review-to-done',
    templateUpdate: null,
    writes: false
  })
})

test('accepts an approval-bound named batch closure and reconciles one successful housekeeping run', () => {
  expect(
    evaluateAcceptanceCycle(
      input({
        authority: {
          kind: 'batch',
          approved: true,
          payloadMatchesApproval: true,
          runMatchesApproval: true,
          closureItemIds: ['KI-HARNESS-001']
        },
        housekeeping: {
          kind: 'accepted',
          activeRun: 'KI-HARNESS-001',
          itemId: 'KI-HARNESS-001',
          templateMatches: true,
          scheduledFor: '2026-08-12',
          completedOn: '2026-08-15',
          reviewedRevision: { ref: 'a'.repeat(40), verified: true }
        }
      })
    )
  ).toEqual({
    kind: 'accept',
    transition: 'awaiting-review-to-done',
    templateUpdate: { lastRun: '2026-08-15', lastRunRef: 'a'.repeat(40), activeRun: null },
    writes: false
  })
})

test('housekeeping completion requires actual completion and verified reviewed-revision evidence', () => {
  const accepted = {
    kind: 'accepted' as const,
    activeRun: 'KI-HARNESS-001',
    itemId: 'KI-HARNESS-001',
    templateMatches: true,
    scheduledFor: '2026-08-12',
    completedOn: '2026-08-15',
    commitThreshold: 100,
    reviewedRevision: { ref: 'a'.repeat(40), verified: true }
  }
  for (const housekeeping of [
    { ...accepted, completedOn: null },
    { ...accepted, completedOn: '2026-02-30' },
    { ...accepted, reviewedRevision: null },
    { ...accepted, reviewedRevision: { ref: 'a'.repeat(40), verified: false } },
    { ...accepted, reviewedRevision: { ref: 'HEAD', verified: true } },
    { ...accepted, itemId: 'wrong-id' }
  ])
    expect(evaluateAcceptanceCycle(input({ housekeeping }))).toMatchObject({ kind: 'stop', writes: false })
  expect(
    evaluateAcceptanceCycle(
      input({ housekeeping: { ...accepted, commitThreshold: undefined, reviewedRevision: null } })
    )
  ).toMatchObject({
    kind: 'accept',
    templateUpdate: { lastRun: '2026-08-15', lastRunRef: null, activeRun: null },
    writes: false
  })
})

test('cancels any explicitly approved open record without delivery evidence or writes', () => {
  for (const status of ['triage', 'draft', 'ready', 'in-progress', 'awaiting-review'] as const)
    expect(evaluateAcceptanceCycle(input({ item: cancelItem({ status }) }))).toEqual({
      kind: 'cancel',
      transition: 'open-to-cancelled',
      resolution: 'rejected',
      targetId: null,
      writes: false
    })
  expect(evaluateAcceptanceCycle(input({ item: cancelItem({ resolution: 'obsolete' }) }))).toMatchObject({
    kind: 'cancel',
    resolution: 'obsolete'
  })
  for (const resolution of ['duplicate', 'merged', 'superseded'] as const)
    expect(
      evaluateAcceptanceCycle(
        input({ item: cancelItem({ resolution, targetId: '5GE-P2-001', cancellationEvidence: 'Owned there.' }) })
      )
    ).toEqual({ kind: 'cancel', transition: 'open-to-cancelled', resolution, targetId: '5GE-P2-001', writes: false })
})

test('requires an open record, exact human authority and complete cancellation evidence', () => {
  for (const status of ['done', 'cancelled'] as const)
    expect(evaluateAcceptanceCycle(input({ item: cancelItem({ status }) }))).toMatchObject({
      kind: 'stop',
      reason: `only an open record can be cancelled, not ${status}`
    })
  expect(
    evaluateAcceptanceCycle(
      input({
        item: cancelItem(),
        authority: {
          kind: 'batch',
          approved: true,
          payloadMatchesApproval: true,
          runMatchesApproval: true,
          closureItemIds: ['KI-HARNESS-002']
        }
      })
    )
  ).toMatchObject({ kind: 'stop', reason: 'exact explicit human approval is required for cancellation' })
  expect(
    evaluateAcceptanceCycle(input({ item: cancelItem(), authority: { kind: 'human', explicitApproval: false } }))
  ).toMatchObject({ kind: 'stop', reason: 'exact explicit human approval is required for cancellation' })
  expect(evaluateAcceptanceCycle(input({ item: cancelItem({ cancellationEvidence: ' ' }) }))).toMatchObject({
    kind: 'stop',
    reason: 'cancellation evidence is required'
  })
  expect(evaluateAcceptanceCycle(input({ item: cancelItem({ targetId: 'KI-HARNESS-001' }) }))).toMatchObject({
    kind: 'stop',
    reason: 'rejected cancellation must not name a target record'
  })
  for (const resolution of ['duplicate', 'merged', 'superseded'] as const) {
    expect(evaluateAcceptanceCycle(input({ item: cancelItem({ resolution, targetId: null }) }))).toMatchObject({
      kind: 'stop',
      reason: `${resolution} cancellation must name its target record`
    })
    expect(
      evaluateAcceptanceCycle(input({ item: cancelItem({ resolution, targetId: 'not-canonical' }) }))
    ).toMatchObject({
      kind: 'stop',
      reason: `${resolution} cancellation target must be a canonical work-item identifier`
    })
    expect(
      evaluateAcceptanceCycle(input({ item: cancelItem({ resolution, targetId: 'KI-HARNESS-002' }) }))
    ).toMatchObject({
      kind: 'stop',
      reason: `${resolution} cancellation target must differ from the cancelled record`
    })
  }
  expect(
    evaluateAcceptanceCycle(
      input({
        item: cancelItem(),
        housekeeping: { kind: 'disposition', activeRun: 'KI-HARNESS-002', itemId: 'KI-HARNESS-002' }
      })
    )
  ).toMatchObject({ kind: 'stop', reason: 'cancellation cannot reconcile housekeeping state' })
})

test('stops without writes for unsupported adapters, invalid evidence, and unapproved closure', () => {
  expect(
    evaluateAcceptanceCycle(input({ adapter: { kind: 'unresolved', reason: 'missing declaration' } }))
  ).toMatchObject({
    kind: 'stop',
    reason: 'selected adapter is unresolved: missing declaration',
    writes: false
  })
  expect(
    evaluateAcceptanceCycle(input({ adapter: { kind: 'remote-execution-unavailable', adapter: 'linear' } }))
  ).toMatchObject({
    kind: 'stop',
    reason: 'selected linear adapter cannot accept',
    writes: false
  })
  const delivery = input().item
  if (delivery.kind !== 'delivery') throw new Error('expected delivery fixture')
  for (const item of [
    { ...delivery, canonical: false },
    { ...delivery, pathWithinRoot: false },
    { ...delivery, status: 'in-progress' as const },
    { ...delivery, stepsComplete: false },
    { ...delivery, deliveryEvidencePresent: false },
    { ...delivery, reviewHeadings: ['Delivered'] }
  ])
    expect(evaluateAcceptanceCycle(input({ item }))).toMatchObject({ kind: 'stop', writes: false })
  expect(evaluateAcceptanceCycle(input({ authority: { kind: 'human', explicitApproval: false } }))).toMatchObject({
    kind: 'stop',
    reason: 'explicit human or approval-bound named batch closure authority is required',
    writes: false
  })
  expect(
    evaluateAcceptanceCycle(
      input({
        authority: {
          kind: 'batch',
          approved: true,
          payloadMatchesApproval: true,
          runMatchesApproval: false,
          closureItemIds: ['KI-HARNESS-001']
        }
      })
    )
  ).toMatchObject({ kind: 'stop', writes: false })
})

test('advances last-run only for accepted completion and requires an explicit recovery action for a non-successful run', () => {
  const accepted = {
    kind: 'accepted' as const,
    activeRun: 'wrong-id',
    itemId: 'KI-HARNESS-001',
    templateMatches: true,
    scheduledFor: '2026-08-12',
    completedOn: '2026-08-15',
    reviewedRevision: { ref: 'a'.repeat(40), verified: true }
  }
  expect(evaluateAcceptanceCycle(input({ housekeeping: accepted }))).toMatchObject({
    kind: 'stop',
    reason: 'linked housekeeping completion evidence is incomplete',
    writes: false
  })
  for (const outcome of ['failed', 'abandoned', 'superseded'] as const)
    expect(
      evaluateAcceptanceCycle(
        input({
          housekeeping: { kind: 'non-successful', outcome, activeRun: 'KI-HARNESS-001', itemId: 'KI-HARNESS-001' }
        })
      )
    ).toMatchObject({
      kind: 'stop',
      reason: 'non-successful housekeeping work retains its active link pending explicit disposition or replacement',
      writes: false
    })
  expect(
    evaluateAcceptanceCycle(
      input({ housekeeping: { kind: 'disposition', activeRun: 'KI-HARNESS-001', itemId: 'KI-HARNESS-001' } })
    )
  ).toEqual({
    kind: 'clear-housekeeping-link',
    templateUpdate: { activeRun: null, lastRunUnchanged: true },
    writes: false
  })
  expect(
    evaluateAcceptanceCycle(
      input({
        housekeeping: {
          kind: 'replacement',
          activeRun: 'KI-HARNESS-001',
          itemId: 'KI-HARNESS-001',
          replacementRun: 'KI-HARNESS-002',
          replacementMatches: true
        }
      })
    )
  ).toEqual({
    kind: 'replace-housekeeping-link',
    templateUpdate: { activeRun: 'KI-HARNESS-002', lastRunUnchanged: true },
    writes: false
  })
  expect(
    evaluateAcceptanceCycle(
      input({
        housekeeping: {
          kind: 'replacement',
          activeRun: 'KI-HARNESS-001',
          itemId: 'KI-HARNESS-001',
          replacementRun: 'KI-HARNESS-001',
          replacementMatches: true
        }
      })
    )
  ).toMatchObject({ kind: 'stop', reason: 'housekeeping replacement evidence is incomplete', writes: false })
})
