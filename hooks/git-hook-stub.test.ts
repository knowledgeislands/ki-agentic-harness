import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const repositoryRoot = resolve(import.meta.dir, '..')
const temporaryDirectories: string[] = []
const identity = {
  GIT_AUTHOR_NAME: 'Hook Test',
  GIT_AUTHOR_EMAIL: 'hook@example.invalid',
  GIT_COMMITTER_NAME: 'Hook Test',
  GIT_COMMITTER_EMAIL: 'hook@example.invalid'
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const git = (cwd: string, ...args: string[]) =>
  spawnSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, ...identity } })

const executable = (path: string, body: string): void => {
  writeFileSync(path, `#!/bin/sh\n${body}\n`)
  chmodSync(path, 0o755)
}

// A primary checkout carrying the committed stubs and stand-in Husky hooks, bound the way
// `prepare` binds it, plus a linked worktree that has never been installed.
const repositoryWithWorktree = (preCommit = 'exit 0', commitMessage = 'exit 0') => {
  const base = mkdtempSync(join(tmpdir(), 'ki-git-hook-stub-'))
  temporaryDirectories.push(base)
  const primary = join(base, 'primary')
  mkdirSync(join(primary, '.githooks'), { recursive: true })
  mkdirSync(join(primary, '.husky'))
  git(primary, 'init', '--quiet', '--initial-branch=main')
  for (const hook of ['pre-commit', 'commit-msg']) {
    copyFileSync(join(repositoryRoot, '.githooks', hook), join(primary, '.githooks', hook))
    chmodSync(join(primary, '.githooks', hook), 0o755)
  }
  writeFileSync(join(primary, '.husky', 'pre-commit'), `${preCommit}\n`)
  writeFileSync(join(primary, '.husky', 'commit-msg'), `${commitMessage}\n`)
  git(primary, 'add', '.')
  expect(git(primary, 'commit', '--quiet', '--no-verify', '-m', 'chore: seed').status).toBe(0)
  git(primary, 'config', 'core.hooksPath', '.githooks')
  const worktree = join(base, 'worktree')
  expect(git(primary, 'worktree', 'add', '--quiet', worktree, '-b', 'task').status).toBe(0)
  return { primary, worktree }
}

const install = (root: string, tools: readonly string[]): void => {
  mkdirSync(join(root, 'node_modules', '.bin'), { recursive: true })
  for (const tool of tools) executable(join(root, 'node_modules', '.bin', tool), 'exit 0')
}

const commit = (root: string) => {
  writeFileSync(join(root, 'change.txt'), `${Math.random()}\n`)
  git(root, 'add', 'change.txt')
  return git(root, 'commit', '-m', 'chore: change')
}

const head = (root: string): string => git(root, 'rev-parse', 'HEAD').stdout.trim()

test('the shared hooks path resolves the committed stubs from a linked worktree', () => {
  const { worktree } = repositoryWithWorktree()
  expect(git(worktree, 'config', 'core.hooksPath').stdout.trim()).toBe('.githooks')
})

test('a working tree without the gate tooling refuses the commit and names the activation step', () => {
  const { worktree } = repositoryWithWorktree()
  const before = head(worktree)
  const result = commit(worktree)

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('lint-staged syncpack tsc')
  expect(result.stderr).toContain('bun install')
  expect(result.stderr).toContain('--no-verify')
  expect(head(worktree)).toBe(before)
})

test('commit-msg refuses on its own missing tool once pre-commit can run', () => {
  const { worktree } = repositoryWithWorktree()
  install(worktree, ['lint-staged', 'syncpack', 'tsc'])
  const before = head(worktree)
  const result = commit(worktree)

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('commitlint')
  expect(result.stderr).toContain('bun install')
  expect(head(worktree)).toBe(before)
})

test('with the tooling installed the stubs delegate to the Husky hooks unchanged', () => {
  const { worktree } = repositoryWithWorktree(
    'command -v lint-staged >/dev/null || exit 1',
    'grep -q "^chore: change$" "$1" || exit 1'
  )
  install(worktree, ['lint-staged', 'syncpack', 'tsc', 'commitlint'])
  const before = head(worktree)

  expect(commit(worktree).status).toBe(0)
  expect(head(worktree)).not.toBe(before)
})

test('a failing Husky gate still refuses the commit through the stub', () => {
  const { worktree } = repositoryWithWorktree('echo staged check failed >&2; exit 1')
  install(worktree, ['lint-staged', 'syncpack', 'tsc', 'commitlint'])
  const before = head(worktree)
  const result = commit(worktree)

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('staged check failed')
  expect(head(worktree)).toBe(before)
})
