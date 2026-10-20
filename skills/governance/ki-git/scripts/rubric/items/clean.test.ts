import { expect, test } from 'bun:test'
import type { AuditOutcome } from '../../shared/rubric.ts'
import type { GitCleanEvidence, GitFacts } from '../contexts/git.ts'
import { CLEAN } from './clean.ts'

const facts = (overrides: Partial<GitFacts> = {}): GitFacts => ({
  bare: false,
  branch: 'main',
  upstream: { state: 'tracking', name: 'origin/main', ahead: 0, behind: 0 },
  changes: { staged: 0, untracked: 0 },
  stashes: 0,
  lastFetchAgeDays: 3,
  worktrees: { linked: 1, prunable: 0, detached: 0 },
  obsoleteBranches: [],
  ...overrides
})

const available = (overrides: Partial<GitFacts> = {}, staleDays = 30): GitCleanEvidence => ({
  state: 'available',
  staleDays,
  facts: facts(overrides)
})

const run = (code: string, evidence: GitCleanEvidence): readonly AuditOutcome[] => {
  const item = CLEAN.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} has no mechanical aspect`)
  return item.mechanical.audit.run(evidence)
}

const statuses = (outcomes: readonly AuditOutcome[]) => outcomes.map((outcome) => outcome.status)

const MECHANICAL = ['CLEAN-2', 'CLEAN-3', 'CLEAN-4', 'CLEAN-5', 'CLEAN-6', 'CLEAN-7']

test('every mechanical clean-down item is a guarded warning beside its disposition judgment', () => {
  expect(CLEAN.items.filter((item) => item.mechanical).map((item) => item.code)).toEqual(MECHANICAL)
  for (const item of CLEAN.items.filter((candidate) => candidate.mechanical)) {
    expect(item.mechanical?.level).toBe('WARN')
    expect(item.mechanical?.remediation.class).toBe('guarded')
    expect(item.judgment).toBeDefined()
  }
  expect(CLEAN.items.find((item) => item.code === 'CLEAN-1')?.mechanical).toBeUndefined()
  expect(CLEAN.items.find((item) => item.code === 'CLEAN-7')?.mechanical?.heuristic).toBeTrue()
})

test('clean-down criteria are unassessed, never passed, without trusted facts', () => {
  const missing: GitCleanEvidence = { state: 'unavailable', reason: 'the host supplied no `mgit overview` facts' }
  for (const code of MECHANICAL)
    expect(run(code, missing)).toEqual([
      { status: 'INFO', message: 'unassessed: the host supplied no `mgit overview` facts' }
    ])
})

test('a clean repository passes every mechanical criterion', () => {
  for (const code of MECHANICAL) expect(statuses(run(code, available()))).toEqual(['PASS'])
})

test('merged and patch-equivalent branches are findings, remote ones with the fetch age', () => {
  const outcomes = run(
    'CLEAN-2',
    available({
      obsoleteBranches: [
        { name: 'feature/done', scope: 'local', reasons: ['merged'], ageDays: 4, automation: false },
        { name: 'feature/squashed', scope: 'local', reasons: ['equivalent', 'gone'], ageDays: 9, automation: false },
        { name: 'origin/automation/release', scope: 'remote', reasons: ['merged'], ageDays: 1, automation: true },
        { name: 'feature/old', scope: 'local', reasons: ['stale'], ageDays: 60, automation: false }
      ]
    })
  )

  expect(outcomes.map((outcome) => outcome.subject)).toEqual([
    'feature/done',
    'feature/squashed',
    'origin/automation/release'
  ])
  expect(statuses(outcomes)).toEqual(['VIOLATION', 'VIOLATION', 'VIOLATION'])
  expect(outcomes[1]?.message).toContain('has no patch the default branch lacks')
  expect(outcomes[2]?.message).toBe(
    'remote branch `origin/automation/release` (automation) is merged into the default branch, as of a fetch 3 days ago'
  )
})

test('stale branches are findings only at the standard threshold', () => {
  const stale = {
    obsoleteBranches: [{ name: 'origin/wip', scope: 'remote', reasons: ['stale'], ageDays: 45, automation: false }]
  } as const

  expect(run('CLEAN-3', available(stale))).toEqual([
    {
      status: 'VIOLATION',
      subject: 'origin/wip',
      message: 'remote branch `origin/wip` has a tip 45 days old, as of a fetch 3 days ago'
    }
  ])
  expect(run('CLEAN-3', available(stale, 14))).toEqual([
    { status: 'INFO', message: 'unassessed: `mgit overview` used a 14-day stale threshold, not the standard’s 30 days' }
  ])
})

test('upstream level covers the checked-out branch and gone local branches', () => {
  const outcomes = run(
    'CLEAN-4',
    available({
      upstream: { state: 'tracking', name: 'origin/main', ahead: 3, behind: 11 },
      obsoleteBranches: [{ name: 'feature/x', scope: 'local', reasons: ['gone'], ageDays: 2, automation: false }]
    })
  )

  expect(outcomes.map((outcome) => outcome.message)).toEqual([
    'checked-out branch `main` is 3 ahead of `origin/main`, as of a fetch 3 days ago',
    'checked-out branch `main` is 11 behind `origin/main`, as of a fetch 3 days ago',
    'local branch `feature/x` tracks a gone upstream'
  ])
  expect(
    statuses(run('CLEAN-4', available({ upstream: { state: 'gone', name: 'origin/x', ahead: 0, behind: 0 } })))
  ).toEqual(['VIOLATION'])
  expect(statuses(run('CLEAN-4', available({ upstream: { state: 'none', name: null, ahead: 0, behind: 0 } })))).toEqual(
    ['INFO']
  )
  expect(statuses(run('CLEAN-4', available({ branch: null })))).toEqual(['PASS'])
})

test('stashes, worktree signals and leftovers are findings', () => {
  expect(run('CLEAN-5', available({ stashes: 2 }))).toEqual([
    { status: 'VIOLATION', message: 'the repository holds 2 stash entries' }
  ])
  expect(
    run('CLEAN-6', available({ worktrees: { linked: 3, prunable: 1, detached: 2 } })).map((o) => o.message)
  ).toEqual(['1 linked worktree is prunable', '2 linked worktrees are detached'])
  expect(run('CLEAN-7', available({ changes: { staged: 1, untracked: 4 } })).map((o) => o.message)).toEqual([
    'the working tree holds 4 untracked paths that are not ignored, a leftover unless a thread is using it',
    'the working tree holds 1 staged entry, a leftover unless a thread is using it'
  ])
  expect(statuses(run('CLEAN-7', available({ bare: true })))).toEqual(['NOT_APPLICABLE'])
})

test('repository-wide criteria stay unassessed for a checkout whose repository was reported elsewhere', () => {
  const secondary = available({ worktrees: undefined })
  for (const code of ['CLEAN-2', 'CLEAN-3', 'CLEAN-5', 'CLEAN-6'])
    expect(run(code, secondary)).toEqual([
      { status: 'INFO', message: 'unassessed: `mgit overview` reported the repository-wide facts for another checkout' }
    ])
  expect(statuses(run('CLEAN-4', secondary))).toEqual(['PASS'])
  expect(statuses(run('CLEAN-7', secondary))).toEqual(['PASS'])
})
