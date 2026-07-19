import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const audit = resolve(import.meta.dir, 'audit.ts')
const valid = `---
handoff: true
tier: sonnet
readiness: 2026-07-19
---

## Decisions

Locked: use the accepted checker model.

Escalate: none.
`

const findings = (output: string): Record<string, unknown>[] =>
  parseCheckerJsonl(output).records.filter(
    (record): record is Record<string, unknown> =>
      typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  )

describe('ki-handoffs AUDIT wrapper', () => {
  test('shows useful help without running the checker', () => {
    const result = spawnSync('bun', [audit, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
    expect(result.stdout).toContain('--reporter <reporter>')
    expect(result.stdout).not.toContain('"record"')
  })

  test('emits canonical JSONL and counts the five judgment checks', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-audit-'))
    try {
      writeFileSync(join(root, 'plan.md'), valid)
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const summary = parsed.records.at(-1) as { summary?: { judgment?: { unevaluated?: unknown } } } | undefined
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(summary?.summary?.judgment?.unevaluated).toBe(5)
      expect(findings(result.stdout).some((finding) => finding.level === 'ADVISORY')).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('preserves the marker failure and warning severities', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-audit-'))
    try {
      writeFileSync(join(root, 'plan.md'), '---\nhandoff: true\ntier: cheap\n---\n\n# Work\n')
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const resultFindings = findings(result.stdout)
      expect(result.status).toBe(1)
      expect(resultFindings.some((finding) => finding.code === 'HAND-1' && finding.level === 'FAIL')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'HAND-2' && finding.level === 'FAIL')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'HAND-3' && finding.level === 'WARN')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('ignores artifacts that do not opt into handoff governance', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-audit-'))
    try {
      writeFileSync(join(root, 'note.md'), '# Ordinary note\n')
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(findings(result.stdout).filter((finding) => finding.level === 'NOT_APPLICABLE')).toHaveLength(3)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('renders the same result through the terminal reporter', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-audit-'))
    try {
      writeFileSync(join(root, 'plan.md'), valid)
      const result = spawnSync('bun', [audit, root, '--reporter=terminal', '--reporter-levels=all'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('Summary: FAIL=')
      expect(result.stdout).not.toContain('"record"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
