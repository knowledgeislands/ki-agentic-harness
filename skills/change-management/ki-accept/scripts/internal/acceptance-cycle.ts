import { workIdentifier, workIdentifierSource } from '../shared/work-identifiers.ts'

export const REVIEW_PACKET_HEADINGS = [
  'Delivered',
  'Change Summary',
  'Verification',
  'Outstanding concerns',
  'Post-change review',
  'Mini recap'
] as const

const WORK_ITEM_ID_RE = workIdentifier()
const EMBEDDED_WORK_ITEM_ID_RE = new RegExp(`(?<![A-Z0-9-])${workIdentifierSource()}(?![A-Z0-9-])`, 'g')
const LINK_RE = /\]\(|https?:\/\//

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
      /** The selected repository's `repo_code` and declared issuing areas, which bound a local target. */
      repository: { code: string; areas: readonly string[] }
      /** A same-repository replacing record, for duplicate, merged or superseded. */
      targetId: string | null
      /** The repository holding replacing work elsewhere, named in plain words instead of a target. */
      replacementRepository: string | null
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
      replacementRepository: string | null
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

/** An identifier names a record of this repository: its code and, when areas are declared, one declared area. */
const isLocalIdentifier = (id: string, repository: { code: string; areas: readonly string[] }): boolean => {
  if (!id.startsWith(`${repository.code}-`)) return false
  const rest = id.slice(repository.code.length + 1)
  if (!repository.areas.length) return /^\d{3,}$/.test(rest)
  const [area, serial, ...extra] = rest.split('-')
  return repository.areas.includes(area as string) && /^\d{3,}$/.test(serial ?? '') && !extra.length
}

type CancelItem = Extract<AcceptanceCycleItem, { kind: 'cancel' }>

/** Why a targeted resolution's replacement is not acceptable, or null when it is. */
const targetedReplacementProblem = (item: CancelItem): string | null => {
  const { resolution, targetId, replacementRepository, repository, cancellationEvidence } = item
  if (targetId !== null) {
    if (!targetId.trim()) return `${resolution} cancellation target must not be empty`
    if (!WORK_ITEM_ID_RE.test(targetId))
      return `${resolution} cancellation target must be a canonical work-item identifier`
    if (targetId === item.id) return `${resolution} cancellation target must differ from the cancelled record`
    if (!isLocalIdentifier(targetId, repository))
      return `${resolution} cancellation target must name a record in this repository; name another repository's work in plain words in ## Cancelled`
    if (replacementRepository !== null)
      return `${resolution} cancellation names either a target record in this repository or another repository, not both`
    return null
  }
  if (!replacementRepository?.trim())
    return `${resolution} cancellation must name a target record in this repository or the repository holding the replacing work`
  if (replacementRepository.trim().toUpperCase() === repository.code)
    return `${resolution} cancellation of work in this repository must name its target record`
  if (!cancellationEvidence.toLowerCase().includes(replacementRepository.trim().toLowerCase()))
    return `${resolution} cancellation evidence must name the repository holding the replacing work`
  const foreignIds = [...cancellationEvidence.matchAll(EMBEDDED_WORK_ITEM_ID_RE)].filter(
    ([id]) => !isLocalIdentifier(id, repository)
  )
  if (foreignIds.length || LINK_RE.test(cancellationEvidence))
    return `${resolution} cancellation evidence must describe another repository's work in plain words, with no identifier or link`
  return null
}

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
      reason: `selected ${adapter.adapter} adapter cannot accept`,
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
    if (!TARGETED_RESOLUTIONS.has(item.resolution)) {
      if (item.targetId !== null)
        return { kind: 'stop', reason: `${item.resolution} cancellation must not name a target record`, writes: false }
      if (item.replacementRepository !== null)
        return {
          kind: 'stop',
          reason: `${item.resolution} cancellation must not name a replacing repository`,
          writes: false
        }
    } else {
      const problem = targetedReplacementProblem(item)
      if (problem) return { kind: 'stop', reason: problem, writes: false }
    }
    return {
      kind: 'cancel',
      transition: 'open-to-cancelled',
      resolution: item.resolution,
      targetId: item.targetId,
      replacementRepository: item.replacementRepository,
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
