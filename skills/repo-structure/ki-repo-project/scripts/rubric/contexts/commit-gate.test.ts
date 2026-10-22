import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectProjectGate } from './commit-gate.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const fixture = (text?: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-project-gate-'))
  roots.push(root)
  writeFileSync(join(root, '.ki.toml'), '[skills.ki-repo]\nprimary_shape = "ki-repo-project"\n')
  mkdirSync(join(root, '.githooks'))
  if (text !== undefined) writeFileSync(join(root, '.githooks/pre-commit'), text)
  return root
}
test('missing Project hook defers existence to ki-repo', () => {
  expect(inspectProjectGate(fixture())[0]?.status).toBe('NOT_APPLICABLE')
})
test('Project gate accepts focused staged direct and quiet-helper audits', () => {
  for (const text of [
    'ki repo audit --skill ki-repo --staged || exit 1',
    'quiet_audit() {\nki repo audit --staged --concise "$@" && return 0\nki repo audit --staged "$@"\nreturn 1\n}\nquiet_audit --skill ki-repo || exit 1'
  ])
    expect(inspectProjectGate(fixture(text))[0]?.status).toBe('PASS')
})
test('Project gate refuses full audits, a full fallback, wrong skills and mutation', () => {
  for (const text of [
    'ki repo audit --skill ki-repo',
    'quiet_audit() {\nki repo audit --staged "$@"\nki repo audit "$@"\n}\nquiet_audit --skill ki-repo',
    'ki repo audit --skill ki-repo-harness --staged',
    'ki repo audit --skill ki-repo --staged\nki repo conform --skill ki-repo',
    'ki repo audit --skill ki-repo --staged --write'
  ])
    expect(inspectProjectGate(fixture(text))[0]?.status).toBe('VIOLATION')
})
test('Project gate refuses a symlink without following it', () => {
  const root = fixture()
  const outside = join(root, 'outside')
  writeFileSync(outside, 'ki repo audit --skill ki-repo --staged')
  symlinkSync(outside, join(root, '.githooks/pre-commit'))
  expect(inspectProjectGate(root)[0]?.status).toBe('VIOLATION')
})

test('a specialised primary shape retains its own gate even when Project orientation is declared', () => {
  const root = fixture('ki repo audit --skill ki-repo-harness --staged')
  writeFileSync(join(root, '.ki.toml'), '[skills.ki-repo]\nprimary_shape = "ki-repo-harness"\n')
  expect(inspectProjectGate(root)[0]?.status).toBe('NOT_APPLICABLE')
})
