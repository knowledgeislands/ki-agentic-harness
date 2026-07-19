import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const command = join(dirname(fileURLToPath(import.meta.url)), 'conform.ts')
const fixtures: string[] = []
const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-specifications-conform-'))
  fixtures.push(root)
  writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\n')
  return root
}
afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true })
})
test('dry-run reports the marker without writing', () => {
  const root = fixture()
  const result = Bun.spawnSync(['bun', command, root, '--dry-run'])
  expect(result.exitCode).toBe(0)
  expect(new TextDecoder().decode(result.stdout)).toContain('"level":"FIXED"')
  expect(readFileSync(join(root, '.ki-config.toml'), 'utf8')).toBe('[ki-repo]\n')
})
test('write adds only the marker and remains successful without empty directories', () => {
  const root = fixture()
  mkdirSync(join(root, 'unrelated'))
  const result = Bun.spawnSync(['bun', command, root])
  expect(result.exitCode).toBe(0)
  expect(readFileSync(join(root, '.ki-config.toml'), 'utf8')).toContain('[ki-specifications]')
})
test('help exits without requiring a target', () => {
  const result = Bun.spawnSync(['bun', command, '--help'])
  expect(result.exitCode).toBe(0)
  expect(new TextDecoder().decode(result.stdout)).toContain('Usage:')
})
