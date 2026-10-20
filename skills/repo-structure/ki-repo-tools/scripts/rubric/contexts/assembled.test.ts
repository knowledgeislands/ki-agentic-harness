import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectAssembled, parseAssembled } from './assembled.ts'

const temporary: string[] = []
afterEach(() => {
  for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true })
})
const directory = (): string => {
  const path = mkdtempSync(join(tmpdir(), 'assembled-test-'))
  temporary.push(path)
  return path
}
const fixture = () => {
  const root = directory()
  const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' })
  git('init', '-q')
  mkdirSync(join(root, 'scripts'))
  mkdirSync(join(root, 'src'))
  mkdirSync(join(root, 'bin'))
  const program = join(root, 'scripts/check')
  writeFileSync(program, '#!/bin/sh\n[ "$1" = --check ] && cmp -s src/a bin/demo\n')
  chmodSync(program, 0o755)
  writeFileSync(join(root, 'src/a'), 'original\n')
  writeFileSync(join(root, 'bin/demo'), 'original\n')
  const declaration = (check = ['scripts/check', '--check']) => {
    writeFileSync(
      join(root, '.ki.toml'),
      `[skills.ki-repo-tools]\nassembled = [{ artifact = "bin/demo", sources = ["src/a"], check = ${JSON.stringify(check)} }]\n`
    )
  }
  declaration()
  git('add', '--', '.ki.toml', 'scripts/check', 'src/a', 'bin/demo')
  const inspect = () => inspectAssembled(root, undefined)
  const status = () => inspect()[0]?.status
  return { root, git, program, declaration, inspect, status }
}

test('assembly reads the declaration, checker and all inputs from the same index', () => {
  const { root, git, program, declaration, inspect, status } = fixture()
  expect(status()).toBe('PASS')
  writeFileSync(join(root, 'src/a'), 'changed\n')
  git('add', '--', 'src/a')
  // All three unstaged changes would let a working-tree check conceal the staged mismatch.
  writeFileSync(join(root, 'bin/demo'), 'changed\n')
  writeFileSync(program, '#!/bin/sh\nexit 0\n')
  declaration(['scripts/check', '--other'])
  expect(status()).toBe('VIOLATION')
  expect(inspect().map((outcome) => outcome.subject)).toEqual(['bin/demo', 'src/a', '.ki.toml', 'scripts/check'])
  git('add', '--', 'bin/demo')
  expect(status()).toBe('PASS')
  // Inverse proof: an unstaged mismatch and failing checker cannot reject a consistent index.
  writeFileSync(join(root, 'bin/demo'), 'unstaged\n')
  writeFileSync(program, '#!/bin/sh\nexit 1\n')
  expect(status()).toBe('PASS')
})

test('assembly refuses untracked and non-executable checks and tracked symlinks', () => {
  const { root, git, program, inspect, status } = fixture()
  git('rm', '-q', '--cached', '--', 'scripts/check')
  expect(inspect()[0]?.message).toContain('git-tracked executable regular file')
  chmodSync(program, 0o644)
  git('add', '--', 'scripts/check')
  expect(status()).toBe('VIOLATION')
  rmSync(program)
  symlinkSync('../src/a', program)
  git('add', '--', 'scripts/check')
  expect(status()).toBe('VIOLATION')
  expect(readFileSync(join(root, 'src/a'), 'utf8')).toBe('original\n')
})

test('assembly refuses a checker whose working-tree parent symlink escapes the repository', () => {
  const { root, program, status } = fixture()
  const outside = directory()
  writeFileSync(join(outside, 'check'), '#!/bin/sh\nexit 0\n')
  chmodSync(join(outside, 'check'), 0o755)
  renameSync(join(root, 'scripts'), join(root, 'saved-scripts'))
  symlinkSync(outside, join(root, 'scripts'))
  expect(existsSync(program)).toBe(true)
  expect(status()).toBe('VIOLATION')
})

test('assembly refuses indexed inputs that escape through symlinks', () => {
  const { root, git, status } = fixture()
  const outside = directory()
  writeFileSync(join(outside, 'a'), 'original\n')
  git('rm', '-q', '--cached', '--', 'src/a')
  rmSync(join(root, 'src'), { recursive: true })
  symlinkSync(outside, join(root, 'src'))
  git('add', '--', 'src')
  expect(status()).toBe('VIOLATION')
})

test('assembly passes arguments literally, clears hook Git redirects and removes its disposable checkout', () => {
  const { root, git, program, declaration, status } = fixture()
  const outside = directory()
  const observed = join(outside, 'observed')
  const sentinel = join(outside, 'must-not-exist')
  const literal = `$(touch ${sentinel})`
  writeFileSync(
    program,
    '#!/bin/sh\n[ -z "${GIT_INDEX_FILE:-}" ] || exit 1\n[ "$2" = "$3" ] || exit 1\nprintf "%s" "$PWD" > "$1"\n'
  )
  declaration(['scripts/check', observed, literal, literal])
  git('add', '--', '.ki.toml', 'scripts/check')
  const originalIndex = process.env.GIT_INDEX_FILE
  process.env.GIT_INDEX_FILE = join(root, '.git/index')
  const before = readFileSync(process.env.GIT_INDEX_FILE)
  try {
    expect(status()).toBe('PASS')
    expect(readFileSync(process.env.GIT_INDEX_FILE)).toEqual(before)
  } finally {
    if (originalIndex === undefined) delete process.env.GIT_INDEX_FILE
    else process.env.GIT_INDEX_FILE = originalIndex
  }
  const snapshot = readFileSync(observed, 'utf8')
  expect(snapshot).not.toBe(root)
  expect(existsSync(snapshot)).toBe(false)
  expect(existsSync(sentinel)).toBe(false)
})

test('assembly diagnoses unindexed declarations and validates repository-relative programs', () => {
  const root = directory()
  expect(inspectAssembled(root, undefined)).toEqual([])
  expect(inspectAssembled(root, [{ artifact: 'bin/demo' }])[0]?.status).toBe('VIOLATION')
  for (const program of ['/bin/true', '../escape', 'scripts/../../escape', 'bad\0name']) {
    expect(typeof parseAssembled([{ artifact: 'bin/demo', sources: ['src/a'], check: [program] }])).toBe('string')
  }
})

test('assembly snapshots raw index blobs without invoking checkout filters', () => {
  const { root, git, status } = fixture()
  const sentinel = join(directory(), 'filter-must-not-run')
  git('config', 'filter.unsafe.smudge', `touch ${sentinel}`)
  writeFileSync(join(root, '.gitattributes'), '* filter=unsafe\n')
  git('add', '--', '.gitattributes')
  expect(status()).toBe('PASS')
  expect(existsSync(sentinel)).toBe(false)
})
