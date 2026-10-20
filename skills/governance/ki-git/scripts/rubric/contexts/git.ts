import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import type { RubricContextOptions, RubricMode, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

/** The clean-down stale threshold the standard fixes, in days. */
export const STALE_DAYS = 30

export type ObsoleteBranch = {
  name: string
  scope: 'local' | 'remote'
  reasons: readonly string[]
  ageDays: number | null
  automation: boolean
}

/** One repository's read-only Git facts, as `mgit overview --json` publishes them. */
export type GitFacts = {
  bare: boolean
  branch: string | null
  upstream: { state: 'none' | 'gone' | 'tracking'; name: string | null; ahead: number; behind: number }
  changes: { staged: number; untracked: number }
  stashes: number
  lastFetchAgeDays: number | null
  /** Repository-wide facts, which `mgit` reports only for the first selected checkout of a repository. */
  worktrees?: { linked: number; prunable: number; detached: number }
  obsoleteBranches: readonly ObsoleteBranch[]
}

/**
 * The clean-down evidence for one repository. The host composes it from the
 * `mgit overview --json` document it supplies as `gitOverview`; this catalogue
 * never runs Git or `mgit` itself.
 */
export type GitCleanEvidence =
  | { state: 'unavailable'; reason: string }
  | { state: 'available'; staleDays: number; facts: GitFacts }

export type GitRubricContext = {
  rubric?: RubricPublicationContext
  repository: string
  mode: RubricMode
  clean: GitCleanEvidence
}

/** Host options, with the optional estate overview the `ki` host may compose from `mgit overview --json`. */
export type GitSessionOptions = RubricContextOptions & { gitOverview?: unknown }

type Json = Record<string, unknown>

const isObject = (value: unknown): value is Json => typeof value === 'object' && value !== null && !Array.isArray(value)
const isCount = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0
const isAge = (value: unknown): value is number | null => value === null || isCount(value)

const canonical = (path: string): string => {
  try {
    return realpathSync(path)
  } catch {
    return resolve(path)
  }
}

const parseBranch = (value: unknown): ObsoleteBranch | undefined => {
  if (!isObject(value)) return undefined
  const { name, scope, reasons, age_days, automation } = value
  if (typeof name !== 'string' || (scope !== 'local' && scope !== 'remote')) return undefined
  if (!Array.isArray(reasons) || !reasons.every((reason) => typeof reason === 'string')) return undefined
  if (!isAge(age_days) || typeof automation !== 'boolean') return undefined
  return { name, scope, reasons, ageDays: age_days, automation }
}

const parseFacts = (record: Json): GitFacts | string => {
  const { bare, branch, upstream, changes, stashes, last_fetch_age_days, worktrees, obsolete_branches } = record
  if (typeof bare !== 'boolean' || (branch !== null && typeof branch !== 'string'))
    return 'its branch facts are malformed'
  if (
    !isObject(upstream) ||
    !['none', 'gone', 'tracking'].includes(upstream.state as string) ||
    (upstream.name !== null && typeof upstream.name !== 'string') ||
    !isCount(upstream.ahead) ||
    !isCount(upstream.behind)
  )
    return 'its upstream facts are malformed'
  if (!isObject(changes) || !isCount(changes.staged) || !isCount(changes.untracked))
    return 'its working-tree facts are malformed'
  if (!isCount(stashes) || !isAge(last_fetch_age_days)) return 'its stash or fetch facts are malformed'
  if (
    worktrees !== undefined &&
    (!isObject(worktrees) || !isCount(worktrees.linked) || !isCount(worktrees.prunable) || !isCount(worktrees.detached))
  )
    return 'its worktree facts are malformed'
  const branches = Array.isArray(obsolete_branches) ? obsolete_branches.map(parseBranch) : undefined
  if (!branches || branches.some((item) => item === undefined)) return 'its branch list is malformed'
  return {
    bare,
    branch,
    upstream: {
      state: upstream.state as GitFacts['upstream']['state'],
      name: upstream.name as string | null,
      ahead: upstream.ahead,
      behind: upstream.behind
    },
    changes: { staged: changes.staged, untracked: changes.untracked },
    stashes,
    lastFetchAgeDays: last_fetch_age_days,
    ...(worktrees === undefined
      ? {}
      : {
          worktrees: {
            linked: worktrees.linked as number,
            prunable: worktrees.prunable as number,
            detached: worktrees.detached as number
          }
        }),
    obsoleteBranches: branches as ObsoleteBranch[]
  }
}

/** Select and validate this repository's facts from an `mgit overview --json` document, failing closed. */
export const cleanEvidence = (overview: unknown, repository: string): GitCleanEvidence => {
  if (overview === undefined) return { state: 'unavailable', reason: 'the host supplied no `mgit overview` facts' }
  if (!isObject(overview) || overview.tool !== 'mgit' || overview.command !== 'overview')
    return { state: 'unavailable', reason: 'the supplied facts are not an `mgit overview --json` document' }
  if (!isCount(overview.stale_days) || !Array.isArray(overview.repositories))
    return { state: 'unavailable', reason: 'the `mgit overview` document is malformed' }
  const target = canonical(repository)
  const record = overview.repositories.find(
    (item): item is Json => isObject(item) && typeof item.path === 'string' && canonical(item.path) === target
  )
  if (!record) return { state: 'unavailable', reason: 'the `mgit overview` document does not cover this repository' }
  if (record.state === 'failed')
    return {
      state: 'unavailable',
      reason: `\`mgit overview\` could not read this repository${typeof record.error === 'string' ? `: ${record.error}` : ''}`
    }
  const facts = parseFacts(record)
  if (typeof facts === 'string')
    return { state: 'unavailable', reason: `this repository's \`mgit overview\` record: ${facts}` }
  return { state: 'available', staleDays: overview.stale_days, facts }
}

export const createGitSession = ({
  mode,
  repository,
  publication,
  gitOverview
}: GitSessionOptions): RubricSession<GitRubricContext> => {
  const root = resolve(repository)
  const context: GitRubricContext = {
    rubric: { publication },
    repository: root,
    mode,
    clean: cleanEvidence(gitOverview, root)
  }
  return {
    subjects: [
      { families: ['RUBRIC'], context: () => context },
      {
        families: ['COMMIT', 'BRANCH', 'HYGIENE', 'CLEAN', 'LOCK'],
        subject: context.repository,
        context: () => context
      }
    ],
    proposal: () => ({ writes: [] })
  }
}
