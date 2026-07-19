import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const AUDIT = resolve(import.meta.dirname, 'audit.ts')
const fixtures: string[] = []
const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-feature-definitions-audit-'))
  fixtures.push(root)
  return root
}
const createValidCorpus = (root: string): void => {
  const features = join(root, 'docs', 'features')
  mkdirSync(features, { recursive: true })
  writeFileSync(
    join(features, 'index.md'),
    '# Features\n\n| Area | Prefix | File |\n| --- | --- | --- |\n| Authentication | `AUTH` | `authentication.md` |\n'
  )
  writeFileSync(
    join(features, 'authentication.md'),
    '# Authentication\n\n### AUTH-001 — sign in\n\nThe system MUST accept a valid sign-in.\n\n_Verify:_ `sign-in.test.ts`\n'
  )
}
const run = (root: string, ...args: string[]) => Bun.spawnSync(['bun', AUDIT, root, ...args], { stdout: 'pipe', stderr: 'pipe' })
const records = (output: Uint8Array): Array<Record<string, unknown>> =>
  new TextDecoder()
    .decode(output)
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as Record<string, unknown>)

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('ki-feature-definitions AUDIT', () => {
  test('emits the canonical JSONL result and counts judgment without synthetic findings', () => {
    const root = fixture()
    createValidCorpus(root)
    const result = run(root)
    const output = records(result.stdout)
    const findings = output.filter((record) => record.record === 'finding')
    const summary = output.at(-1)?.summary as { pass: number; judgment: { unevaluated: number } }
    expect(result.exitCode).toBe(0)
    expect(output[0]?.record).toBe('meta')
    expect(output.at(-1)?.record).toBe('summary')
    expect(findings).toHaveLength(9)
    expect(findings.every((finding) => finding.level === 'PASS')).toBe(true)
    expect(summary).toEqual(expect.objectContaining({ pass: 9, judgment: { unevaluated: 6 } }))
  })

  test('reports a missing index as INDEX-1 FAIL', () => {
    const root = fixture()
    mkdirSync(join(root, 'docs', 'features'), { recursive: true })
    const result = run(root)
    const finding = records(result.stdout).find((record) => record.code === 'INDEX-1')
    expect(result.exitCode).toBe(1)
    expect(finding?.level).toBe('FAIL')
  })

  test('uses the terminal reporter only when requested', () => {
    const root = fixture()
    createValidCorpus(root)
    const result = run(root, '--reporter=terminal')
    const output = new TextDecoder().decode(result.stdout)
    expect(result.exitCode).toBe(0)
    expect(output).toContain('No FAIL / WARN findings.')
    expect(output).toContain('JUDGMENT_UNEVALUATED=6')
  })
})
