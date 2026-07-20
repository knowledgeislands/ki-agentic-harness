import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const audit = resolve(import.meta.dir, 'audit.ts')
const supportingScripts = {
  'ki:skills:copy:project': 'true',
  'ki:skills:audit': 'true',
  'ki:skills:link:global': 'true',
  'ki:skills:refresh-status': 'true',
  'ki:eval': 'true'
}

const fixture = (scripts: Record<string, string> = supportingScripts): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-harness-audit-'))
  for (const part of ['skills', 'agents', 'mcp', 'evals', 'hooks']) {
    mkdirSync(join(root, part))
    writeFileSync(join(root, part, 'README.md'), `# ${part}\n`)
  }
  writeFileSync(join(root, 'CLAUDE.md'), '# Fixture\n')
  writeFileSync(join(root, 'ROADMAP.md'), '# Roadmap\n')
  writeFileSync(join(root, '.ki-config.toml'), '[ki-harness]\n\n[ki-repo]\n')
  writeFileSync(join(root, 'package.json'), `${JSON.stringify({ scripts }, null, 2)}\n`)
  return root
}

const findings = (output: string): Record<string, unknown>[] =>
  parseCheckerJsonl(output).records.filter(
    (record): record is Record<string, unknown> =>
      typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  )

describe('ki-harness AUDIT wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [audit, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
    expect(result.stdout).not.toContain('"record"')
  })

  test('emits canonical JSONL without the retired PKG-3 rule', () => {
    const root = fixture()
    try {
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const summary = parsed.records.at(-1) as { summary?: { judgment?: { unevaluated?: unknown } } } | undefined
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(findings(result.stdout).some((finding) => finding.code === 'PKG-3')).toBe(false)
      expect(summary?.summary?.judgment?.unevaluated).toBe(10)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('does not restore retired or engineering-owned package rules', () => {
    const root = fixture({ ...supportingScripts, 'ki:lint:check': 'true', 'ki:lint:types': 'true', 'ki:codegen': 'true' })
    try {
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(findings(result.stdout).some((finding) => finding.code === 'PKG-3')).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('reports required package scripts when package.json is absent', () => {
    const root = fixture()
    try {
      unlinkSync(join(root, 'package.json'))
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const resultFindings = findings(result.stdout)
      expect(result.status).toBe(1)
      expect(resultFindings.some((finding) => finding.code === 'PKG-1' && finding.level === 'FAIL')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'PKG-2' && finding.level === 'FAIL')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'PKG-3')).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('renders a terminal view from the same checker result', () => {
    const root = fixture()
    try {
      const result = spawnSync('bun', [audit, root, '--reporter=terminal', '--reporter-levels=all'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('Summary: FAIL=')
      expect(result.stdout).not.toContain('"record"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
