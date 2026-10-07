export const REVIEW_PACKET_HEADINGS = [
  'Delivered',
  'Change Summary',
  'Verification',
  'Outstanding concerns',
  'Post-change review',
  'Mini recap'
] as const

const WORK_ITEM_ID_RE = /^[A-Z0-9][A-Z0-9-]{1,23}-\d{3,}$/

export type AcceptanceAdapter =
  | { kind: 'local'; adapter: 'roadmap' | 'kb-streams'; root: 'docs/roadmap' | 'Streams/Roadmap' }
  | { kind: 'remote-execution-unavailable'; adapter: 'github-issues' | 'linear' }
  | { kind: 'unresolved'; reason: string }

export type ClosureAuthority =
  | { kind: 'human'; explicitApproval: boolean }
  | {
      kind: 'batch'
      approved: boolean
      payloadMatchesApproval: boolean
      runMatchesApproval: boolean
      closureItemIds: readonly string[]
    }

export type HousekeepingCompletion =
  | { kind: 'none' }
  | {
      kind: 'accepted'
      activeRun: string | null
      itemId: string
      templateMatches: boolean
      scheduledFor: string | null
      completedOn: string | null
      reviewedRevision: { ref: string; verified: boolean } | null
      commitThreshold?: number
    }
  | {
      kind: 'non-successful'
      outcome: 'failed' | 'abandoned' | 'superseded'
      activeRun: string | null
      itemId: string
    }
  | { kind: 'disposition'; activeRun: string | null; itemId: string }
  | {
      kind: 'replacement'
      activeRun: string | null
      itemId: string
      replacementRun: string
      replacementMatches: boolean
    }

export type CancelResolution = 'obsolete' | 'rejected' | 'duplicate' | 'merged' | 'superseded'

const TARGETED_RESOLUTIONS: ReadonlySet<CancelResolution> = new Set(['duplicate', 'merged', 'superseded'])
const OPEN_STATUSES: ReadonlySet<string> = new Set(['triage', 'draft', 'ready', 'in-progress', 'awaiting-review'])

export type AcceptanceCycleItem =
  | {
      kind: 'delivery'
      id: string
      canonical: boolean
      pathWithinRoot: boolean
      status: 'triage' | 'draft' | 'ready' | 'in-progress' | 'awaiting-review' | 'done' | 'cancelled'
      stepsComplete: boolean
      deliveryEvidencePresent: boolean
      reviewHeadings: readonly string[]
    }
  | {
      kind: 'cancel'
      id: string
      canonical: boolean
      pathWithinRoot: boolean
      status: 'triage' | 'draft' | 'ready' | 'in-progress' | 'awaiting-review' | 'done' | 'cancelled'
      resolution: CancelResolution
      cancellationEvidence: string
      targetId: string | null
    }

export type AcceptanceCycleInput = {
  adapter: AcceptanceAdapter
  item: AcceptanceCycleItem
  authority: ClosureAuthority
  housekeeping: HousekeepingCompletion
}

export type AcceptanceCycleOutcome =
  | { kind: 'accept'; transition: 'awaiting-review-to-done'; templateUpdate: null; writes: false }
  | {
      kind: 'accept'
      transition: 'awaiting-review-to-done'
      templateUpdate: { lastRun: string; lastRunRef: string | null; activeRun: null }
      writes: false
    }
  | { kind: 'clear-housekeeping-link'; templateUpdate: { activeRun: null; lastRunUnchanged: true }; writes: false }
  | {
      kind: 'replace-housekeeping-link'
      templateUpdate: { activeRun: string; lastRunUnchanged: true }
      writes: false
    }
  | {
      kind: 'cancel'
      transition: 'open-to-cancelled'
      resolution: CancelResolution
      targetId: string | null
      writes: false
    }
  | { kind: 'stop'; reason: string; writes: false }

const matchesReviewPacket = (headings: readonly string[]): boolean =>
  headings.length === REVIEW_PACKET_HEADINGS.length &&
  headings.every((heading, index) => heading === REVIEW_PACKET_HEADINGS[index])

const closureAuthorised = (authority: ClosureAuthority, itemId: string): boolean =>
  authority.kind === 'human'
    ? authority.explicitApproval
    : authority.approved &&
      authority.payloadMatchesApproval &&
      authority.runMatchesApproval &&
      authority.closureItemIds.includes(itemId)

export const evaluateAcceptanceCycle = ({
  adapter,
  item,
  authority,
  housekeeping
}: AcceptanceCycleInput): AcceptanceCycleOutcome => {
  if (adapter.kind === 'unresolved')
    return { kind: 'stop', reason: `selected adapter is unresolved: ${adapter.reason}`, writes: false }
  if (adapter.kind === 'remote-execution-unavailable')
    return {
      kind: 'stop',
      reason: `selected ${adapter.adapter} adapter cannot accept pending KI-HARNESS-FND-014`,
      writes: false
    }
  if (!item.canonical || !item.pathWithinRoot)
    return { kind: 'stop', reason: 'work record is not canonical beneath the selected adapter root', writes: false }

  if (item.kind === 'cancel') {
    if (!OPEN_STATUSES.has(item.status))
      return { kind: 'stop', reason: `only an open record can be cancelled, not ${item.status}`, writes: false }
    if (housekeeping.kind !== 'none')
      return { kind: 'stop', reason: 'cancellation cannot reconcile housekeeping state', writes: false }
    if (authority.kind !== 'human' || !authority.explicitApproval)
      return { kind: 'stop', reason: 'exact explicit human approval is required for cancellation', writes: false }
    if (!item.cancellationEvidence.trim())
      return { kind: 'stop', reason: 'cancellation evidence is required', writes: false }
    const targeted = TARGETED_RESOLUTIONS.has(item.resolution)
    if (!targeted && item.targetId !== null)
      return { kind: 'stop', reason: `${item.resolution} cancellation must not name a target record`, writes: false }
    if (targeted && !item.targetId?.trim())
      return { kind: 'stop', reason: `${item.resolution} cancellation must name its target record`, writes: false }
    if (targeted && !WORK_ITEM_ID_RE.test(item.targetId as string))
      return {
        kind: 'stop',
        reason: `${item.resolution} cancellation target must be a canonical work-item identifier`,
        writes: false
      }
    if (targeted && item.targetId === item.id)
      return {
        kind: 'stop',
        reason: `${item.resolution} cancellation target must differ from the cancelled record`,
        writes: false
      }
    return {
      kind: 'cancel',
      transition: 'open-to-cancelled',
      resolution: item.resolution,
      targetId: item.targetId,
      writes: false
    }
  }

  if (housekeeping.kind === 'non-successful')
    return {
      kind: 'stop',
      reason: 'non-successful housekeeping work retains its active link pending explicit disposition or replacement',
      writes: false
    }
  if (housekeeping.kind === 'disposition') {
    if (housekeeping.activeRun !== item.id)
      return { kind: 'stop', reason: 'housekeeping disposition does not name the active run', writes: false }
    return {
      kind: 'clear-housekeeping-link',
      templateUpdate: { activeRun: null, lastRunUnchanged: true },
      writes: false
    }
  }
  if (housekeeping.kind === 'replacement') {
    if (
      housekeeping.activeRun !== item.id ||
      !housekeeping.replacementMatches ||
      housekeeping.replacementRun === item.id
    )
      return { kind: 'stop', reason: 'housekeeping replacement evidence is incomplete', writes: false }
    return {
      kind: 'replace-housekeeping-link',
      templateUpdate: { activeRun: housekeeping.replacementRun, lastRunUnchanged: true },
      writes: false
    }
  }

  if (item.status !== 'awaiting-review')
    return { kind: 'stop', reason: 'work record is not awaiting review', writes: false }
  if (!item.stepsComplete) return { kind: 'stop', reason: 'approved plan steps are incomplete', writes: false }
  if (!item.deliveryEvidencePresent) return { kind: 'stop', reason: 'delivery evidence is incomplete', writes: false }
  if (!matchesReviewPacket(item.reviewHeadings))
    return { kind: 'stop', reason: 'review packet does not match the canonical six-heading schema', writes: false }
  if (!closureAuthorised(authority, item.id))
    return {
      kind: 'stop',
      reason: 'explicit human or approval-bound named batch closure authority is required',
      writes: false
    }

  if (housekeeping.kind === 'accepted') {
    const validDate = (value: string | null): value is string => {
      if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
      const date = new Date(`${value}T00:00:00.000Z`)
      return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value
    }
    const revision = housekeeping.reviewedRevision
    if (
      housekeeping.activeRun !== item.id ||
      housekeeping.itemId !== item.id ||
      !housekeeping.templateMatches ||
      !validDate(housekeeping.scheduledFor) ||
      !validDate(housekeeping.completedOn) ||
      (housekeeping.commitThreshold !== undefined && revision === null) ||
      (revision !== null && (!revision.verified || !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(revision.ref)))
    )
      return { kind: 'stop', reason: 'linked housekeeping completion evidence is incomplete', writes: false }
    return {
      kind: 'accept',
      transition: 'awaiting-review-to-done',
      templateUpdate: { lastRun: housekeeping.completedOn, lastRunRef: revision?.ref ?? null, activeRun: null },
      writes: false
    }
  }
  return { kind: 'accept', transition: 'awaiting-review-to-done', templateUpdate: null, writes: false }
}
