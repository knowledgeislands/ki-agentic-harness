import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectCommitGate } from './commit-gate.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const repository = (hook?: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-repo-harness-gate-'))
  roots.push(root)
  if (hook !== undefined) {
    mkdirSync(join(root, '.githooks'))
    writeFileSync(join(root, '.githooks', 'pre-commit'), hook)
  }
  return root
}

const status = (root: string) => inspectCommitGate(root).hook[0]

test('GATE-1 is not applicable without a committed pre-commit hook', () => {
  expect(status(repository())?.status).toBe('NOT_APPLICABLE')
})

test('GATE-1 passes both canonical hooks and any hook that runs only check-only staged lints', () => {
  for (const variant of ['package', 'no-package']) {
    const hook = readFileSync(join(import.meta.dir, '../../../assets/githooks', variant, 'pre-commit'), 'utf8')
    expect(status(repository(hook))?.status).toBe('PASS')
  }
  expect(
    status(repository('#!/bin/sh\nlint-staged --quiet || exit 1\nsyncpack format --check || exit 1\n'))?.status
  ).toBe('PASS')
})

test('GATE-1 rejects an audit, conform, repair or rewrite at commit time, commented lines ignored', () => {
  for (const line of [
    'ki repo audit --repo "$root" --skill ki-repo-harness --staged || exit 1',
    'quiet_audit --skill ki-repo-harness || exit 1',
    'ki repo conform --skill ki-repo-harness',
    'KI_REPO_OFFLINE=1 ki repo repair --repo "$root"',
    'biome check --write . || exit 1',
    'rumdl check --fix || exit 1'
  ]) {
    const outcome = status(repository(`#!/bin/sh\nlint-staged --quiet || exit 1\n${line}\n`))
    expect(outcome?.status, line).toBe('VIOLATION')
    expect(outcome?.message, line).toContain('check-only')
  }
  expect(status(repository('#!/bin/sh\n# ki repo audit --skill ki-repo-harness --staged\n'))?.status).toBe('PASS')
})

test('GATE-1 rejects a symlinked hook or hook directory', () => {
  const linkedHook = repository()
  mkdirSync(join(linkedHook, '.githooks'))
  writeFileSync(join(linkedHook, 'gate.sh'), 'lint-staged --quiet || exit 1\n')
  symlinkSync(join(linkedHook, 'gate.sh'), join(linkedHook, '.githooks', 'pre-commit'))
  expect(status(linkedHook)?.message).toContain('not a safe regular file')

  const linkedDirectory = repository()
  mkdirSync(join(linkedDirectory, 'elsewhere'))
  symlinkSync(join(linkedDirectory, 'elsewhere'), join(linkedDirectory, '.githooks'))
  expect(status(linkedDirectory)?.message).toContain('symbolic link')
})
