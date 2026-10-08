import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { hookEvidence } from './hooks.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const repository = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-repo-hooks-'))
  roots.push(root)
  execFileSync('git', ['init', '--quiet', root])
  return root
}

const git = (root: string, ...args: string[]): void => {
  execFileSync('git', ['-C', root, ...args], { stdio: 'ignore' })
}

const addHook = (root: string, mode = 0o755): void => {
  mkdirSync(join(root, '.githooks'), { recursive: true })
  writeFileSync(join(root, '.githooks', 'pre-commit'), '#!/bin/sh\nki repo audit\n')
  chmodSync(join(root, '.githooks', 'pre-commit'), mode)
  git(root, 'add', '.githooks/pre-commit')
}

const local = {}

test('HOOK-1 warns without a committed hook and HOOK-2 has nothing to bind', () => {
  const evidence = hookEvidence(repository(), local)
  expect(evidence.hook1[0]?.status).toBe('VIOLATION')
  expect(evidence.hook1[0]?.message).toContain('no committed .githooks/pre-commit')
  expect(evidence.hook2[0]?.status).toBe('NOT_APPLICABLE')
})

test('HOOK-1 rejects an untracked, non-executable or unsafe hook', () => {
  const untracked = repository()
  mkdirSync(join(untracked, '.githooks'))
  writeFileSync(join(untracked, '.githooks', 'pre-commit'), '#!/bin/sh\n')
  expect(hookEvidence(untracked, local).hook1[0]?.message).toContain('is not tracked')

  const plain = repository()
  addHook(plain, 0o644)
  expect(hookEvidence(plain, local).hook1[0]?.message).toContain('without executable mode')

  const linked = repository()
  mkdirSync(join(linked, '.githooks'))
  writeFileSync(join(linked, 'gate.sh'), '#!/bin/sh\n')
  symlinkSync(join(linked, 'gate.sh'), join(linked, '.githooks', 'pre-commit'))
  expect(hookEvidence(linked, local).hook1[0]?.message).toContain('not a safe regular file')
})

test('an executable tracked hook passes HOOK-1 and HOOK-2 names the exact binding step until bound', () => {
  const root = repository()
  addHook(root)
  const unbound = hookEvidence(root, local)
  expect(unbound.hook1[0]?.status).toBe('PASS')
  expect(unbound.hook2[0]?.status).toBe('VIOLATION')
  expect(unbound.hook2[0]?.message).toContain('git config core.hooksPath .githooks')

  git(root, 'config', 'core.hooksPath', '.husky/_')
  expect(hookEvidence(root, local).hook2[0]?.message).toContain('".husky/_"')

  git(root, 'config', 'core.hooksPath', '.githooks')
  expect(hookEvidence(root, local).hook2[0]?.status).toBe('PASS')
})

test('HOOK-2 is not applicable in CI without a local binding, but still judges a wrong one', () => {
  const root = repository()
  addHook(root)
  expect(hookEvidence(root, { CI: 'true' }).hook2[0]?.status).toBe('NOT_APPLICABLE')
  git(root, 'config', 'core.hooksPath', 'elsewhere')
  expect(hookEvidence(root, { CI: 'true' }).hook2[0]?.status).toBe('VIOLATION')
})
