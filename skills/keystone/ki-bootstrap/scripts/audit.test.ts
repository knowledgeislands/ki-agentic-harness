import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const AUDIT = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')

const fixture = (config = '[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n'): string => {
  const target = mkdtempSync(join(tmpdir(), 'ki-bootstrap-audit-'))
  writeFileSync(join(target, '.ki-config.toml'), config)
  return target
}

describe('ki-bootstrap AUDIT wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [AUDIT, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
    expect(result.stdout).toContain('--reporter <reporter>')
    expect(result.stdout).not.toContain('"record"')
  })

  test('emits canonical JSONL and counts judgment without synthetic findings', () => {
    const target = fixture()
    try {
      const result = spawnSync('bun', [AUDIT, target], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const findings = parsed.records.filter(
        (record): record is Record<string, unknown> =>
          typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
      )
      const summary = parsed.records.at(-1) as { summary?: { judgment?: { unevaluated?: unknown } } } | undefined

      expect(parsed.errors).toEqual([])
      expect(findings.some((finding) => finding.code === 'BOOT-9')).toBe(true)
      expect(findings.some((finding) => finding.code === 'BOOT-10')).toBe(false)
      expect(summary?.summary?.judgment?.unevaluated).toBe(2)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('uses an outcome-level FAIL for an unresolvable declaration', () => {
    const target = fixture('[ki-repo]\nsupported_runtimes = ["claude-code"]\n[ki-does-not-exist]\n')
    try {
      const result = spawnSync('bun', [AUDIT, target], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      expect(result.status).toBe(1)
      expect(
        parsed.records.some(
          (record) =>
            (record as { record?: unknown; code?: unknown; level?: unknown }).record === 'finding' &&
            (record as { code?: unknown }).code === 'BOOT-9' &&
            (record as { level?: unknown }).level === 'FAIL'
        )
      ).toBe(true)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('renders a terminal view without changing the checker', () => {
    const target = fixture()
    try {
      const result = spawnSync('bun', [AUDIT, target, '--reporter=terminal', '--reporter-levels=all'], { encoding: 'utf8' })
      expect(result.stdout).toContain('BOOT-9')
      expect(result.stdout).toContain('Summary: FAIL=')
      expect(result.stdout).not.toContain('"record"')
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })
})
