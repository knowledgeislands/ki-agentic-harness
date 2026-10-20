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

test('GATE-1 passes a hook that runs the focused harness audit check-only on staged content', () => {
  const root = repository('#!/bin/sh\nki repo audit --repo "$root" --skill ki-repo-harness --staged || exit 1\n')
  expect(status(root)?.status).toBe('PASS')
})

test('GATE-1 passes both canonical hooks, which run the audit through the quiet_audit helper', () => {
  for (const variant of ['package', 'no-package']) {
    const hook = readFileSync(join(import.meta.dir, '../../../assets/githooks', variant, 'pre-commit'), 'utf8')
    expect(status(repository(hook))?.status).toBe('PASS')
  }
})

test('GATE-1 rejects a helper that audits a different skill or rewrites', () => {
  const helper = 'quiet_audit() {\n  ki repo audit --repo "$root" --staged "$@"\n}\n'
  expect(status(repository(`#!/bin/sh\n${helper}quiet_audit --skill ki-repo-harness-extra || exit 1\n`))?.status).toBe(
    'VIOLATION'
  )
  expect(
    status(
      repository(
        '#!/bin/sh\nquiet_audit() {\n  ki repo audit --staged --fix "$@"\n}\nquiet_audit --skill ki-repo-harness\n'
      )
    )?.status
  ).toBe('VIOLATION')
})

test('GATE-1 rejects a missing harness audit, a rewriting gate and a commented-out audit', () => {
  expect(status(repository('#!/bin/sh\nki repo audit --repo "$root" --staged || exit 1\n'))?.message).toContain(
    'does not run `ki repo audit --skill ki-repo-harness --staged`'
  )
  expect(
    status(
      repository('#!/bin/sh\nki repo audit --skill ki-repo-harness --staged\nki repo conform --skill ki-repo-harness\n')
    )?.message
  ).toContain('must be check-only')
  expect(status(repository('#!/bin/sh\n# ki repo audit --skill ki-repo-harness --staged\n'))?.status).toBe('VIOLATION')
})

test('GATE-1 rejects a symlinked hook or hook directory', () => {
  const linkedHook = repository()
  mkdirSync(join(linkedHook, '.githooks'))
  writeFileSync(join(linkedHook, 'gate.sh'), 'ki repo audit --skill ki-repo-harness --staged\n')
  symlinkSync(join(linkedHook, 'gate.sh'), join(linkedHook, '.githooks', 'pre-commit'))
  expect(status(linkedHook)?.message).toContain('not a safe regular file')

  const linkedDirectory = repository()
  mkdirSync(join(linkedDirectory, 'elsewhere'))
  symlinkSync(join(linkedDirectory, 'elsewhere'), join(linkedDirectory, '.githooks'))
  expect(status(linkedDirectory)?.message).toContain('symbolic link')
})
