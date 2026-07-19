import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const AUDIT = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')

describe('ki-authoring AUDIT wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [AUDIT, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
    expect(result.stdout).toContain('--reporter <reporter>')
    expect(result.stdout).not.toContain('"record"')
  })

  test('emits canonical JSONL and counts judgment without synthetic findings', () => {
    const target = mkdtempSync(join(tmpdir(), 'ki-authoring-audit-'))
    try {
      const result = spawnSync('bun', [AUDIT, target], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const findings = parsed.records.filter(
        (record): record is Record<string, unknown> =>
          typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
      )
      const summary = parsed.records.at(-1) as { summary?: { judgment?: { unevaluated?: unknown } } } | undefined
      expect(parsed.errors).toEqual([])
      expect(findings.some((finding) => finding.code === 'MD-table')).toBe(false)
      expect(findings.some((finding) => finding.code === 'TOML-keys')).toBe(false)
      expect(summary?.summary?.judgment?.unevaluated).toBe(9)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('renders a terminal view without changing the checker response', () => {
    const target = mkdtempSync(join(tmpdir(), 'ki-authoring-terminal-'))
    try {
      const result = spawnSync('bun', [AUDIT, target, '--reporter=terminal', '--reporter-levels=all'], { encoding: 'utf8' })
      expect(result.stdout).toContain('MD-mech')
      expect(result.stdout).toContain('Summary: FAIL=')
      expect(result.stdout).not.toContain('"record"')
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })
})
