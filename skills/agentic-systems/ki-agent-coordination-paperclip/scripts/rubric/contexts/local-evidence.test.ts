import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { linkageOutcomes, worktreeBaseOutcomes } from './local-evidence.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const git = (cwd: string, ...args: string[]) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Fixture',
      GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
      GIT_COMMITTER_NAME: 'Fixture',
      GIT_COMMITTER_EMAIL: 'fixture@example.invalid'
    }
  }).trim()

const repository = (adapter = 'roadmap') => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'coord-evidence-')))
  roots.push(root)
  git(root, 'init', '--quiet', '--initial-branch=main')
  writeFileSync(join(root, '.ki.toml'), `[skills.ki-work]\nadapter = "${adapter}"\n`)
  mkdirSync(join(root, 'docs/roadmap'), { recursive: true })
  return root
}

const commit = (root: string, message: string) => {
  git(root, 'add', '-A')
  git(root, 'commit', '--quiet', '--allow-empty', '-m', message)
  return git(root, 'rev-parse', 'HEAD')
}

const link = (id: string, relation: string) =>
  [
    '    - authority: http://127.0.0.1:3100',
    '      scope: company',
    `      id: task-${id}`,
    `      key: KIS-${id}`,
    `      url: http://127.0.0.1:3100/KIS/issues/KIS-${id}`,
    `      relation: ${relation}`
  ].join('\n')

const record = (root: string, id: string, baseline: string | null, links: readonly string[]) =>
  writeFileSync(
    join(root, 'docs/roadmap', `${id}-fixture.md`),
    [
      '---',
      `id: ${id}`,
      `baseline_ref: ${baseline ?? 'null'}`,
      ...(links.length ? ['task_links:', '  paperclip:', ...links] : []),
      '---',
      '',
      `# ${id}`,
      ''
    ].join('\n')
  )

const statuses = (outcomes: readonly { status: string }[]) => outcomes.map(({ status }) => status)

test('a resolving governing triple passes and says the plane side was not evaluated', () => {
  const root = repository()
  record(root, 'X-GOV-001', null, [])
  const base = commit(root, 'record')
  record(root, 'X-GOV-001', base, [link('1', 'implementation')])
  commit(root, 'link')
  const outcomes = linkageOutcomes(root)
  expect(statuses(outcomes)).toEqual(['PASS'])
  expect(outcomes[0]?.message).toContain('1 governing Paperclip task link and 1 baseline triple')
  expect(outcomes[0]?.message).toContain('coordination plane side was not evaluated')
})

test('a record with only evaluation links passes without a governing claim', () => {
  const root = repository()
  record(root, 'X-GOV-001', null, [link('1', 'evaluation'), link('2', 'related')])
  commit(root, 'record')
  expect(statuses(linkageOutcomes(root))).toEqual(['PASS'])
})

test('an unknown revision fails once, naming the record and the failed part', () => {
  const root = repository()
  record(root, 'X-GOV-001', 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', [link('1', 'implementation')])
  commit(root, 'record')
  const outcomes = linkageOutcomes(root)
  expect(statuses(outcomes)).toEqual(['VIOLATION'])
  expect(outcomes[0]?.subject).toBe('docs/roadmap/X-GOV-001-fixture.md')
  expect(outcomes[0]?.message).toContain('is not a commit in the local object store')
})

test('a revision that is not an ancestor of HEAD fails once', () => {
  const root = repository()
  record(root, 'X-GOV-001', null, [])
  commit(root, 'record')
  git(root, 'checkout', '--quiet', '-b', 'side')
  const side = commit(root, 'side')
  git(root, 'checkout', '--quiet', 'main')
  record(root, 'X-GOV-001', side, [link('1', 'implementation')])
  commit(root, 'link')
  const outcomes = linkageOutcomes(root)
  expect(statuses(outcomes)).toEqual(['VIOLATION'])
  expect(outcomes[0]?.message).toContain('is not an ancestor of HEAD')
})

test('a revision without the record fails once', () => {
  const root = repository()
  const base = commit(root, 'empty')
  record(root, 'X-GOV-001', base, [link('1', 'implementation')])
  commit(root, 'record')
  const outcomes = linkageOutcomes(root)
  expect(statuses(outcomes)).toEqual(['VIOLATION'])
  expect(outcomes[0]?.message).toContain('contains no record for X-GOV-001 under docs/roadmap')
})

test('a delivery task claimed as governing by two records fails once, naming both', () => {
  const root = repository()
  record(root, 'X-GOV-001', null, [link('1', 'implementation')])
  record(root, 'X-GOV-002', null, [link('1', 'implementation')])
  commit(root, 'records')
  const outcomes = linkageOutcomes(root)
  expect(statuses(outcomes)).toEqual(['VIOLATION'])
  expect(outcomes[0]?.message).toContain('docs/roadmap/X-GOV-001-fixture.md, docs/roadmap/X-GOV-002-fixture.md')
})

test('a remote work adapter and a repository without links are not applicable', () => {
  const remote = repository('linear')
  record(remote, 'X-GOV-001', null, [link('1', 'implementation')])
  expect(statuses(linkageOutcomes(remote))).toEqual(['NOT_APPLICABLE'])
  const unlinked = repository()
  record(unlinked, 'X-GOV-001', null, [])
  expect(statuses(linkageOutcomes(unlinked))).toEqual(['NOT_APPLICABLE'])
})

test('the primary working tree is not a linked worktree', () => {
  const root = repository()
  commit(root, 'base')
  expect(statuses(worktreeBaseOutcomes(root))).toEqual(['NOT_APPLICABLE'])
})

test('a linked worktree at the destination tip passes and a stale one fails with its behind count', () => {
  const root = repository()
  commit(root, 'base')
  const worktree = join(realpathSync(mkdtempSync(join(tmpdir(), 'coord-worktree-'))), 'task')
  roots.push(worktree)
  git(root, 'worktree', 'add', '--quiet', '-b', 'task', worktree, 'main')
  expect(statuses(worktreeBaseOutcomes(worktree))).toEqual(['PASS', 'PASS'])
  commit(root, 'advance one')
  commit(root, 'advance two')
  const outcomes = worktreeBaseOutcomes(worktree)
  expect(statuses(outcomes)).toEqual(['PASS', 'VIOLATION'])
  expect(outcomes[1]?.message).toContain('behind main')
  expect(outcomes[1]?.message).toContain('by 2 commits')
})

test('a linked worktree inside the Git common directory fails the location assertion', () => {
  const root = repository()
  commit(root, 'base')
  const worktree = join(root, '.git/paperclip-worktrees/task')
  git(root, 'worktree', 'add', '--quiet', '-b', 'task', worktree, 'main')
  const outcomes = worktreeBaseOutcomes(worktree)
  expect(statuses(outcomes)).toEqual(['VIOLATION', 'PASS'])
  expect(outcomes[0]?.message).toContain('working tree and Git common directory')
  expect(outcomes[0]?.subject).toBe(worktree)
})

test('the audit is read-only and depends only on the selected checkout', () => {
  const root = repository()
  record(root, 'X-GOV-001', null, [link('1', 'implementation')])
  commit(root, 'record')
  const worktree = join(realpathSync(mkdtempSync(join(tmpdir(), 'coord-worktree-'))), 'sibling')
  roots.push(worktree)
  git(root, 'worktree', 'add', '--quiet', '-b', 'sibling', worktree, 'main')
  const snapshot = () => [
    git(root, 'rev-parse', 'HEAD'),
    git(root, 'status', '--porcelain'),
    git(root, 'worktree', 'list', '--porcelain')
  ]
  const before = snapshot()
  const first = [linkageOutcomes(root), worktreeBaseOutcomes(root)]
  expect(snapshot()).toEqual(before)
  record(worktree, 'X-GOV-002', null, [link('1', 'implementation')])
  commit(worktree, 'sibling claim')
  expect([linkageOutcomes(root), worktreeBaseOutcomes(root)]).toEqual(first)
})
