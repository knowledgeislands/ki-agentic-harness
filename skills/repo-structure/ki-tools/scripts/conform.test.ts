import { afterEach, expect, test } from 'bun:test'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const conform = join(dirname(fileURLToPath(import.meta.url)), 'conform.ts')
const fixtures: string[] = []
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-tools-conform-'))
  fixtures.push(root)
  mkdirSync(join(root, 'bin'))
  writeFileSync(join(root, 'bin', 'demo'), '#!/bin/sh\n')
  chmodSync(join(root, 'bin', 'demo'), 0o644)
  writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\n')
  return root
}
afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true })
})
test('dry-run reports fixes without writing', () => {
  const root = fixture()
  const result = Bun.spawnSync(['bun', conform, root, '--dry-run'])
  expect(result.exitCode).toBe(0)
  expect(statSync(join(root, 'bin', 'demo')).mode & 0o111).toBe(0)
  expect(readFileSync(join(root, '.ki-config.toml'), 'utf8')).not.toContain('[ki-tools]')
})
test('write fixes executable bit and marker', () => {
  const root = fixture()
  const result = Bun.spawnSync(['bun', conform, root])
  expect(result.exitCode).toBe(0)
  expect(statSync(join(root, 'bin', 'demo')).mode & 0o111).not.toBe(0)
  expect(readFileSync(join(root, '.ki-config.toml'), 'utf8')).toContain('[ki-tools]')
})
test('help exits cleanly', () => {
  const result = Bun.spawnSync(['bun', conform, '--help'])
  expect(result.exitCode).toBe(0)
  expect(new TextDecoder().decode(result.stdout)).toContain('Usage:')
})
