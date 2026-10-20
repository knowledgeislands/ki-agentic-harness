import { expect, test } from 'bun:test'
import { resolve } from 'node:path'
import { cleanEvidence, createGitSession } from './git.ts'

const record = (path: string, overrides: Record<string, unknown> = {}) => ({
  label: '.',
  path,
  state: 'clean',
  bare: false,
  branch: 'main',
  detached: false,
  upstream: { state: 'tracking', name: 'origin/main', ahead: 0, behind: 0 },
  changes: { staged: 0, modified: 0, untracked: 0, conflicted: 0 },
  stashes: 0,
  last_commit_age_days: 0,
  last_fetch_age_days: 2,
  worktrees: { linked: 0, prunable: 0, detached: 0 },
  default_branch: 'origin/main',
  obsolete_branches: [],
  findings: [],
  ...overrides
})

const overview = (...repositories: unknown[]) => ({
  tool: 'mgit',
  command: 'overview',
  version: '0.18.0',
  stale_days: 30,
  repositories
})

test('the Git session exposes a dedicated publication subject and immutable review subject', () => {
  const session = createGitSession({
    mode: 'audit',
    repository: '.',
    userHome: '/unused',
    configuration: {}
  })

  expect(session.subjects).toHaveLength(2)
  expect(session.subjects[0]?.families).toEqual(['RUBRIC'])
  expect(session.subjects[1]?.families).toEqual(['COMMIT', 'BRANCH', 'HYGIENE', 'CLEAN', 'LOCK'])
  expect(session.subjects[1]?.subject).toBe(resolve('.'))
  expect(session.subjects[1]?.context()).toEqual({
    rubric: { publication: undefined },
    repository: resolve('.'),
    mode: 'audit',
    clean: { state: 'unavailable', reason: 'the host supplied no `mgit overview` facts' }
  })
  expect(session.proposal()).toEqual({ writes: [] })
})

test('the session selects this repository from a host-supplied mgit overview', () => {
  const session = createGitSession({
    mode: 'audit',
    repository: '.',
    userHome: '/unused',
    configuration: {},
    gitOverview: overview(record('/elsewhere'), record(resolve('.'), { stashes: 2 }))
  })
  const clean = session.subjects[1]?.context().clean

  expect(clean?.state).toBe('available')
  if (clean?.state === 'available') {
    expect(clean.staleDays).toBe(30)
    expect(clean.facts.stashes).toBe(2)
    expect(clean.facts.lastFetchAgeDays).toBe(2)
    expect(clean.facts.worktrees).toEqual({ linked: 0, prunable: 0, detached: 0 })
  }
})

test('clean-down evidence fails closed on documents it cannot trust', () => {
  const here = resolve('.')
  const reason = (value: unknown) => {
    const evidence = cleanEvidence(value, here)
    return evidence.state === 'unavailable' ? evidence.reason : 'available'
  }

  expect(reason({ tool: 'git-almanac', command: 'overview' })).toContain('not an `mgit overview --json` document')
  expect(reason({ tool: 'mgit', command: 'overview', repositories: [] })).toContain('malformed')
  expect(reason(overview(record('/elsewhere')))).toContain('does not cover this repository')
  expect(reason(overview({ label: '.', path: here, state: 'failed', error: 'cannot read status' }))).toBe(
    '`mgit overview` could not read this repository: cannot read status'
  )
  expect(reason(overview(record(here, { upstream: { state: 'odd' } })))).toContain('upstream facts are malformed')
  expect(reason(overview(record(here, { obsolete_branches: [{ name: 'x' }] })))).toContain('branch list is malformed')
  expect(reason(overview(record(here, { stashes: -1 })))).toContain('stash or fetch facts are malformed')
})

test('a checkout without repository-wide facts keeps its own facts', () => {
  const here = resolve('.')
  const { worktrees: _omitted, ...rest } = record(here)
  const evidence = cleanEvidence(overview(rest), here)

  expect(evidence.state).toBe('available')
  if (evidence.state === 'available') expect(evidence.facts.worktrees).toBeUndefined()
})
