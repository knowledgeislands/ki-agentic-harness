import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const educate = resolve(import.meta.dir, 'educate.ts')

test('ki-handoffs EDUCATE exposes help without running repository bootstrap', () => {
  const result = spawnSync('bun', [educate, '--help'], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('Usage: bun scripts/educate.ts')
  expect(result.stdout).toContain('--dry-run')
  expect(result.stderr).toBe('')
})
