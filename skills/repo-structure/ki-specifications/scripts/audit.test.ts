#!/usr/bin/env bun
import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')
const educate = join(dirname(fileURLToPath(import.meta.url)), 'educate.ts')
const fixtures: string[] = []
const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-specifications-'))
  fixtures.push(root)
  writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\n\n[ki-specifications]\n')
  for (const path of ['proposals', 'specifications', 'schemas', 'templates', 'examples', 'docs', 'tooling']) mkdirSync(join(root, path))
  return root
}

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true })
})
test('clean structure emits canonical passing JSONL', () => {
  const result = spawnSync('bun', [script, fixture()], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('"record":"summary"')
  expect(result.stdout).toContain('"level":"PASS"')
})
test('missing core area fails SPEC-2', () => {
  const root = fixture()
  rmdirSync(join(root, 'schemas'))
  const result = spawnSync('bun', [script, root], { encoding: 'utf8' })
  expect(result.status).toBe(1)
  expect(result.stdout).toContain('"code":"SPEC-2"')
})
test('public commands expose help without action', () => {
  for (const command of [script, educate]) {
    const result = spawnSync('bun', [command, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage:')
  }
})
