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

// The hook refuses unless its package tools sit in node_modules/.bin, so each fixture installs
// stand-ins that record their arguments. Nothing else is needed: the gate is check-only and
// never calls `ki`, as Kris chose COMMIT-VS-CI a) on 26 October 2026.
const fixture = (lintExit = 0) => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-pre-commit-'))
  temporaryDirectories.push(repository)
  const capture = join(repository, 'calls')
  for (const tool of ['lint-staged', 'syncpack', 'biome', 'rumdl'])
    executable(
      repository,
      join('node_modules', '.bin', tool),
      `printf '${tool} %s\\n' "$*" >> '${capture}'\n${tool === 'lint-staged' ? `exit ${lintExit}` : ''}`
    )
  write(repository, '.gitignore', 'node_modules/\ncalls\n')
  execFileSync('git', ['init', '-q'], { cwd: repository })
  execFileSync('git', ['add', '.gitignore'], { cwd: repository })
  const run = (path = '/usr/bin:/bin') =>
    spawnSync('/bin/sh', [hook], { cwd: repository, encoding: 'utf8', env: { ...process.env, PATH: path } })
  const calls = (): string[] => readFileSync(capture, 'utf8').trim().split('\n')
  return { repository, run, calls }
}

test('the hook runs only the staged lint and the Syncpack check, with ki absent from PATH', () => {
  const { run, calls } = fixture()
  expect(run().status).toBe(0)
  expect(calls()).toEqual(['lint-staged --quiet', 'syncpack format --check'])
})

test('a failing staged lint stops the commit before the Syncpack check', () => {
  const { run, calls } = fixture(1)
  expect(run().status).not.toBe(0)
  expect(calls()).toEqual(['lint-staged --quiet'])
})

test('the committed hook is check-only: no audit, conform, repair, fix or write', () => {
  expect(readFileSync(hook, 'utf8')).not.toMatch(/ki repo (?:audit|conform|repair)|--(?:fix|write)\b|\bbun test\b|\btsc\b/)
})

test('an empty index exits before the refusal, so a missing tool does not block it', () => {
  const { repository, run } = fixture()
  execFileSync('git', ['rm', '-q', '--cached', '.gitignore'], { cwd: repository })
  rmSync(join(repository, 'node_modules'), { recursive: true, force: true })
  expect(run().status).toBe(0)
})

test('a missing package tool refuses before any gate runs', () => {
  const { repository, run } = fixture()
  rmSync(join(repository, 'node_modules', '.bin', 'lint-staged'))
  const result = run()
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('missing from node_modules/.bin: lint-staged')
  expect(result.stderr).toContain('--no-verify')
})
