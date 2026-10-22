import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { canonicalHooks } from './canonical-hooks.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const fixture = (stage: boolean, auditResult = 0) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-canonical-project-'))
  roots.push(root)
  const bin = join(root, 'bin')
  mkdirSync(bin)
  const log = join(root, 'audit.log')
  writeFileSync(join(bin, 'rumdl'), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
  writeFileSync(join(bin, 'ki'), '#!/bin/sh\nprintf "%s\\n" "$*" >> "$AUDIT_LOG"\nexit "$AUDIT_RESULT"\n', {
    mode: 0o755
  })
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, AUDIT_LOG: log, AUDIT_RESULT: String(auditResult) }
  expect(spawnSync('git', ['init', '-q'], { cwd: root, env }).status).toBe(0)
  writeFileSync(join(root, 'README.md'), '# Project\n')
  if (stage) expect(spawnSync('git', ['add', '--', 'README.md'], { cwd: root, env }).status).toBe(0)
  const hook = join(root, 'pre-commit')
  writeFileSync(hook, canonicalHooks('ki-repo-project', 'no-package')?.['pre-commit'] ?? '')
  return { root, log, hook, env }
}

test('canonical Project gate checks staged repository paths and stays quiet on success', () => {
  const fixtureRun = fixture(true)
  const result = spawnSync('/bin/sh', [fixtureRun.hook], {
    cwd: fixtureRun.root,
    env: fixtureRun.env,
    encoding: 'utf8'
  })
  expect(result.status).toBe(0)
  expect(result.stdout).toBe('')
  const calls = readFileSync(fixtureRun.log, 'utf8').trim().split('\n')
  expect(calls).toHaveLength(1)
  expect(calls[0]).toContain('--skill ki-repo')
  expect(calls[0]).toContain('--staged')
  expect(calls[0]).not.toContain('conform')
})

test('canonical Project gate fails closed and keeps the diagnostic retry staged', () => {
  const fixtureRun = fixture(true, 42)
  const result = spawnSync('/bin/sh', [fixtureRun.hook], { cwd: fixtureRun.root, env: fixtureRun.env })
  expect(result.status).toBe(1)
  const calls = readFileSync(fixtureRun.log, 'utf8').trim().split('\n')
  expect(calls).toHaveLength(2)
  for (const call of calls) {
    expect(call).toContain('--skill ki-repo')
    expect(call).toContain('--staged')
    expect(call).not.toContain('conform')
  }
})

test('empty Project index exits without an audit', () => {
  const fixtureRun = fixture(false)
  const result = spawnSync('/bin/sh', [fixtureRun.hook], { cwd: fixtureRun.root, env: fixtureRun.env })
  expect(result.status).toBe(0)
  expect(existsSync(fixtureRun.log)).toBe(false)
})
