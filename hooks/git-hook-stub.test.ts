import { afterAll, afterEach, expect, test } from 'bun:test'
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

// A stand-in `ki` on PATH, so the pre-commit refusal does not depend on the host install.
const stubBin = mkdtempSync(join(tmpdir(), 'ki-git-hook-bin-'))
afterAll(() => rmSync(stubBin, { recursive: true, force: true }))

const executable = (path: string, body: string): void => {
  writeFileSync(path, `#!/bin/sh\n${body}\n`)
  chmodSync(path, 0o755)
}

executable(join(stubBin, 'ki'), 'exit 0')

const git = (cwd: string, ...args: string[]) =>
  spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...identity, PATH: `${stubBin}:${process.env.PATH ?? ''}` }
  })

// A primary checkout carrying the committed hooks, bound the way `prepare` binds it, plus a
// linked worktree that has never been installed.
const repositoryWithWorktree = () => {
  const base = mkdtempSync(join(tmpdir(), 'ki-git-hook-stub-'))
  temporaryDirectories.push(base)
  const primary = join(base, 'primary')
  mkdirSync(join(primary, '.githooks'), { recursive: true })
  git(primary, 'init', '--quiet', '--initial-branch=main')
  for (const hook of ['pre-commit', 'commit-msg']) {
    copyFileSync(join(repositoryRoot, '.githooks', hook), join(primary, '.githooks', hook))
    chmodSync(join(primary, '.githooks', hook), 0o755)
  }
  git(primary, 'add', '.')
  expect(git(primary, 'commit', '--quiet', '--no-verify', '-m', 'chore: seed').status).toBe(0)
  git(primary, 'config', 'core.hooksPath', '.githooks')
  const worktree = join(base, 'worktree')
  expect(git(primary, 'worktree', 'add', '--quiet', worktree, '-b', 'task').status).toBe(0)
  return { primary, worktree }
}

// The package tools the canonical pre-commit refuses without.
const PACKAGE_TOOLS = ['lint-staged', 'syncpack', 'biome', 'rumdl']

const install = (root: string, tools: readonly string[], bodies: Readonly<Record<string, string>> = {}): void => {
  mkdirSync(join(root, 'node_modules', '.bin'), { recursive: true })
  for (const tool of tools) executable(join(root, 'node_modules', '.bin', tool), bodies[tool] ?? 'exit 0')
}

const commit = (root: string) => {
  writeFileSync(join(root, 'change.txt'), `${Math.random()}\n`)
  git(root, 'add', 'change.txt')
  return git(root, 'commit', '-m', 'chore: change')
}

const head = (root: string): string => git(root, 'rev-parse', 'HEAD').stdout.trim()

test('the shared hooks path resolves the committed hooks from a linked worktree', () => {
  const { worktree } = repositoryWithWorktree()
  expect(git(worktree, 'config', 'core.hooksPath').stdout.trim()).toBe('.githooks')
})

test('a working tree without the gate tooling refuses the commit and names the activation step', () => {
  const { worktree } = repositoryWithWorktree()
  const before = head(worktree)
  const result = commit(worktree)

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('lint-staged syncpack biome rumdl')
  expect(result.stderr).toContain('bun install')
  expect(result.stderr).toContain('--no-verify')
  expect(head(worktree)).toBe(before)
})

test('a working tree without ki on PATH still commits: the gate is check-only and needs no ki', () => {
  const { worktree } = repositoryWithWorktree()
  install(worktree, [...PACKAGE_TOOLS, 'commitlint'])
  const before = head(worktree)
  writeFileSync(join(worktree, 'change.txt'), 'change\n')
  git(worktree, 'add', 'change.txt')
  // Only the system directories, which hold git and sh but not ki.
  const result = spawnSync('git', ['commit', '-m', 'chore: change'], {
    cwd: worktree,
    encoding: 'utf8',
    env: { ...process.env, ...identity, PATH: `${join(worktree, 'node_modules', '.bin')}:/usr/bin:/bin` }
  })

  expect(result.status, result.stderr).toBe(0)
  expect(head(worktree)).not.toBe(before)
})

test('commit-msg refuses on its own missing tool once pre-commit can run', () => {
  const { worktree } = repositoryWithWorktree()
  install(worktree, PACKAGE_TOOLS)
  const before = head(worktree)
  const result = commit(worktree)

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('commitlint')
  expect(result.stderr).toContain('bun install')
  expect(head(worktree)).toBe(before)
})

test('with the tooling installed the committed hooks run their gate and the commit lands', () => {
  const { worktree } = repositoryWithWorktree()
  install(worktree, [...PACKAGE_TOOLS, 'commitlint'], {
    'lint-staged': '[ "$1" = --quiet ] || exit 1',
    commitlint: '[ "$1" = --edit ] && grep -q "^chore: change$" "$2" || exit 1'
  })
  const before = head(worktree)

  expect(commit(worktree).status).toBe(0)
  expect(head(worktree)).not.toBe(before)
})

test('a failing gate tool still refuses the commit', () => {
  const { worktree } = repositoryWithWorktree()
  install(worktree, [...PACKAGE_TOOLS, 'commitlint'], {
    'lint-staged': 'echo staged check failed >&2; exit 1'
  })
  const before = head(worktree)
  const result = commit(worktree)

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('staged check failed')
  expect(head(worktree)).toBe(before)
})
