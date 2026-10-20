import { afterEach, expect, test } from 'bun:test'
import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

const temporaryDirectories: string[] = []
const repositoryRoot = resolve(import.meta.dir, '..')
const hook = join(repositoryRoot, '.githooks', 'pre-commit')

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const write = (repository: string, path: string, content: string): void => {
  const target = join(repository, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

const executable = (repository: string, path: string, body: string): void => {
  write(repository, path, `#!/bin/sh\n${body}\n`)
  chmodSync(join(repository, path), 0o755)
}

// The hook refuses unless its package tools sit in node_modules/.bin and `ki` is on PATH, so each
// fixture installs stand-ins that record their arguments, with the repository root masked.
const fixture = (kiExit = 0) => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-pre-commit-'))
  temporaryDirectories.push(repository)
  const capture = join(repository, 'calls')
  for (const tool of ['lint-staged', 'syncpack', 'biome', 'rumdl'])
    executable(repository, join('node_modules', '.bin', tool), `printf '${tool} %s\\n' "$*" >> '${capture}'`)
  executable(
    repository,
    'test-bin/ki',
    `printf 'ki %s\\n' "$*" | sed 's|--repo [^ ]*|--repo ROOT|' >> '${capture}'\nexit ${kiExit}`
  )
  write(repository, '.gitignore', 'node_modules/\ntest-bin/\ncalls\n')
  execFileSync('git', ['init', '-q'], { cwd: repository })
  execFileSync('git', ['add', '.gitignore'], { cwd: repository })
  const run = (path = `${join(repository, 'test-bin')}:${process.env.PATH ?? ''}`) =>
    spawnSync('/bin/sh', [hook], { cwd: repository, encoding: 'utf8', env: { ...process.env, PATH: path } })
  const calls = (): string[] => readFileSync(capture, 'utf8').trim().split('\n')
  return { repository, run, calls }
}

test('the hook runs the staged lint, the Syncpack check and the focused harness audit, quietly first', () => {
  const { run, calls } = fixture()
  expect(run().status).toBe(0)
  expect(calls()).toEqual([
    'lint-staged --quiet',
    'syncpack format --check',
    'ki repo audit --repo ROOT --staged --concise --progress never --reporter-levels FAIL --skill ki-repo-harness'
  ])
})

test('a failing concise audit is run again in full so its findings print', () => {
  const { run, calls } = fixture(1)
  expect(run().status).not.toBe(0)
  expect(calls().slice(2)).toEqual([
    'ki repo audit --repo ROOT --staged --concise --progress never --reporter-levels FAIL --skill ki-repo-harness',
    'ki repo audit --repo ROOT --staged --skill ki-repo-harness'
  ])
})

test('an empty index exits before the refusal, so a missing tool does not block it', () => {
  const { repository, run } = fixture()
  execFileSync('git', ['rm', '-q', '--cached', '.gitignore'], { cwd: repository })
  rmSync(join(repository, 'node_modules'), { recursive: true, force: true })
  expect(run('/usr/bin:/bin').status).toBe(0)
})

test('a missing ki refuses before any gate runs', () => {
  const { run } = fixture()
  const result = run('/usr/bin:/bin')
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('not on PATH: ki')
  expect(result.stderr).toContain('--no-verify')
})
