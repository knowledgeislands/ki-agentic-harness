import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const audit = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')
const educate = join(dirname(fileURLToPath(import.meta.url)), 'educate.ts')
const fixtures: string[] = []
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-tools-'))
  fixtures.push(root)
  return root
}
afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true })
})
const run = (root: string) => Bun.spawnSync(['bun', audit, root])
const records = (result: ReturnType<typeof run>) =>
  parseCheckerJsonl(new TextDecoder().decode(result.stdout)).records as Array<Record<string, any>>
test('irrelevant repository reports exactly one not-applicable finding', () => {
  const result = run(fixture())
  const output = records(result)
  expect(result.exitCode).toBe(0)
  expect(output.filter((record) => record.record === 'finding')).toHaveLength(1)
  expect(output[1]?.level).toBe('NOT_APPLICABLE')
})
test('declared incomplete repository runs full audit and fails TOOL-BIN', () => {
  const root = fixture()
  writeFileSync(join(root, '.ki-config.toml'), '[ki-tools]\n')
  const result = run(root)
  expect(result.exitCode).toBe(1)
  expect(records(result).some((record) => record.code === 'TOOL-BIN' && record.level === 'FAIL')).toBe(true)
})
test('complete shell shape preserves capability checks', () => {
  const root = fixture()
  mkdirSync(join(root, 'bin'))
  writeFileSync(join(root, 'bin', 'demo'), '#!/bin/sh\n# --version\n', { mode: 0o755 })
  writeFileSync(join(root, '.ki-config.toml'), '[ki-tools]\n')
  const result = run(root)
  expect(records(result).some((record) => record.code === 'SHELL-LINT')).toBe(true)
})
test('audit and educate expose help', () => {
  for (const command of [audit, educate]) {
    const result = Bun.spawnSync(['bun', command, '--help'])
    expect(result.exitCode).toBe(0)
    expect(new TextDecoder().decode(result.stdout)).toContain('Usage:')
  }
})
