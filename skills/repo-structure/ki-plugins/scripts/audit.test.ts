import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const scripts = dirname(fileURLToPath(import.meta.url))
const audit = join(scripts, 'audit.ts')
const conform = join(scripts, 'conform.ts')
const fixtures: string[] = []
const fixture = () => {
  const target = mkdtempSync(join(tmpdir(), 'ki-plugins-'))
  fixtures.push(target)
  return target
}
afterEach(() => {
  for (const target of fixtures.splice(0)) rmSync(target, { recursive: true, force: true })
})
const run = (target: string) => Bun.spawnSync(['bun', audit, target])
const records = (result: ReturnType<typeof run>) =>
  parseCheckerJsonl(new TextDecoder().decode(result.stdout)).records as Array<Record<string, any>>

test('irrelevant repository reports not-applicable findings', () => {
  const result = run(fixture())
  expect(result.exitCode).toBe(0)
  expect(records(result).some((record) => record.record === 'finding' && record.level === 'NOT_APPLICABLE')).toBe(true)
})

test('declared incomplete repository runs the full audit', () => {
  const target = fixture()
  writeFileSync(join(target, '.ki-config.toml'), '[ki-plugins]\n')
  const result = run(target)
  expect(result.exitCode).toBe(1)
  expect(records(result).some((record) => record.code === 'PLUG-1' && record.level === 'FAIL')).toBe(true)
})

test('marketplace structure activates the audit', () => {
  const target = fixture()
  mkdirSync(join(target, '.claude-plugin'))
  writeFileSync(join(target, '.claude-plugin', 'marketplace.json'), '{}\n')
  expect(run(target).exitCode).toBe(1)
})

test('entry points expose help', () => {
  for (const command of [audit, conform, join(scripts, 'educate.ts')]) {
    const result = Bun.spawnSync(['bun', command, '--help'])
    expect(result.exitCode).toBe(0)
    expect(new TextDecoder().decode(result.stdout)).toContain('Usage:')
  }
})
