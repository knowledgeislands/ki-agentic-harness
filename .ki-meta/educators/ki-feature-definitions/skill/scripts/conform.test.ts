import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const CONFORM = resolve(import.meta.dirname, 'conform.ts')
const fixtures: string[] = []
const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-feature-definitions-conform-'))
  fixtures.push(root)
  const features = join(root, 'docs', 'features')
  mkdirSync(features, { recursive: true })
  writeFileSync(join(features, 'index.md'), '| Prefix | File |\n| --- | --- |\n| `AUTH` | `authentication.md` |\n')
  writeFileSync(
    join(features, 'authentication.md'),
    '# Authentication\n\n### AUTH-001 - sign in\n\nThe system MUST accept a valid sign-in.\n\n_Verify:_ `sign-in.test.ts`\n'
  )
  return root
}
const run = (root: string, ...args: string[]) => Bun.spawnSync(['bun', CONFORM, root, ...args], { stdout: 'pipe', stderr: 'pipe' })
const records = (output: Uint8Array): Array<Record<string, unknown>> =>
  new TextDecoder()
    .decode(output)
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as Record<string, unknown>)

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('ki-feature-definitions CONFORM', () => {
  test('dry-run reports the safe fix without writing', () => {
    const root = fixture()
    const path = join(root, 'docs', 'features', 'authentication.md')
    const before = readFileSync(path, 'utf8')
    const result = run(root, '--dry-run')
    const finding = records(result.stdout).find((record) => record.code === 'ID-1')
    expect(result.exitCode).toBe(0)
    expect(finding?.level).toBe('FIXED')
    expect(readFileSync(path, 'utf8')).toBe(before)
  })

  test('normalises a safe near-miss separator', () => {
    const root = fixture()
    const path = join(root, 'docs', 'features', 'authentication.md')
    const result = run(root)
    const finding = records(result.stdout).find((record) => record.code === 'ID-1')
    expect(result.exitCode).toBe(0)
    expect(finding?.level).toBe('FIXED')
    expect(readFileSync(path, 'utf8')).toContain('### AUTH-001 — sign in')
  })

  test('rejects unsupported arguments before writing', () => {
    const root = fixture()
    const path = join(root, 'docs', 'features', 'authentication.md')
    const before = readFileSync(path, 'utf8')
    const result = run(root, '--unknown')
    expect(result.exitCode).toBe(2)
    expect(new TextDecoder().decode(result.stderr)).toContain('unknown option')
    expect(readFileSync(path, 'utf8')).toBe(before)
  })
})
