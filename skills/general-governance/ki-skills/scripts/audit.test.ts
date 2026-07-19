#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
/** Run-based contract tests for the canonical JSONL AUDIT wrapper. */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './lib/checker.ts'

const AUDIT = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')

const run = (target: string, ...args: string[]): { output: string; status: number | null } => {
  const result = spawnSync('bun', [AUDIT, target, ...args], { encoding: 'utf8' })
  return { output: `${result.stdout ?? ''}${result.stderr ?? ''}`, status: result.status }
}

const fixture = (): { base: string; dir: string } => {
  const base = mkdtempSync(join(tmpdir(), 'ki-skills-audit-'))
  const dir = join(base, 'ki-fixture-audit')
  mkdirSync(join(dir, 'scripts'), { recursive: true })
  writeFileSync(
    join(dir, 'SKILL.md'),
    [
      '---',
      'name: ki-fixture-audit',
      'description: A fixture for canonical JSONL audit coverage.',
      'depends-on: []',
      '---',
      '',
      '# Fixture',
      ''
    ].join('\n')
  )
  writeFileSync(
    join(dir, 'scripts', 'audit.ts'),
    "if (process.argv.includes('-h') || process.argv.includes('--help')) process.stdout.write('Usage: bun scripts/audit.ts <target>\\n')\n"
  )
  return { base, dir }
}

describe('ki-skills AUDIT wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [AUDIT, '-h'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
    expect(result.stdout).toContain('--footprint')
    expect(result.stdout).toContain('--reporter <reporter>')
    expect(result.stdout).toContain('--reporter-levels <levels>')
    expect(result.stdout).not.toContain('"record"')
  })

  test('renders a direct terminal report without changing checker execution', () => {
    const { base, dir } = fixture()
    try {
      const result = run(dir, '--reporter=terminal', '--reporter-levels=all')
      expect(result.output).toContain('PASS')
      expect(result.output).toContain('SKILL.md exists at the skill root (LAY-1)')
      expect(result.output).toContain('Summary: FAIL=')
      expect(result.output).not.toContain('"record"')
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  test('rejects reporter levels without a terminal reporter', () => {
    const result = spawnSync('bun', [AUDIT, '--reporter-levels=all'], { encoding: 'utf8' })
    expect(result.status).toBe(2)
    expect(result.stderr).toContain('--reporter-levels requires --reporter=terminal')
  })

  test('rejects unknown options', () => {
    const result = spawnSync('bun', [AUDIT, '--footprit'], { encoding: 'utf8' })
    expect(result.status).toBe(2)
    expect(result.stderr).toContain('unknown option: --footprit')
  })

  test('emits the canonical JSONL contract for a valid skill', () => {
    const { base, dir } = fixture()
    try {
      const result = run(dir)
      const parsed = parseCheckerJsonl(result.output)
      const findings = parsed.records.filter(
        (record): record is Record<string, unknown> =>
          typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
      )
      const summary = parsed.records.at(-1) as { record?: unknown; summary?: { judgment?: { unevaluated?: unknown } } } | undefined

      expect(parsed.errors).toEqual([])
      expect(parsed.records.length).toBeGreaterThanOrEqual(2)
      expect(findings.every((finding) => ['level', 'code', 'title', 'message'].every((key) => typeof finding[key] === 'string'))).toBe(true)
      expect(findings.some((finding) => finding.level === 'J')).toBe(false)
      expect(typeof summary?.summary?.judgment?.unevaluated).toBe('number')
      expect(findings.some((finding) => finding.code === 'LAY-1' && finding.level === 'PASS')).toBe(true)
      expect(findings.some((finding) => finding.code === 'OPT-1' && finding.level === 'NOT_APPLICABLE')).toBe(true)
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  test('returns LAY-1 FAIL when SKILL.md is missing', () => {
    const base = mkdtempSync(join(tmpdir(), 'ki-skills-audit-'))
    const dir = join(base, 'missing-skill')
    mkdirSync(dir)
    try {
      const result = run(dir)
      const parsed = parseCheckerJsonl(result.output)
      expect(result.status).toBe(1)
      expect(
        parsed.records.some(
          (record) => (record as { code?: unknown; level?: unknown }).code === 'LAY-1' && (record as { level?: unknown }).level === 'FAIL'
        )
      ).toBe(true)
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  test('returns SCRIPT-8 FAIL when a top-level script has no useful help', () => {
    const { base, dir } = fixture()
    writeFileSync(join(dir, 'scripts', 'audit.ts'), 'void 0\n')
    try {
      const result = run(dir)
      const parsed = parseCheckerJsonl(result.output)
      expect(result.status).toBe(1)
      expect(
        parsed.records.some(
          (record) =>
            (record as { code?: unknown; level?: unknown; subject?: unknown }).code === 'SCRIPT-8' &&
            (record as { level?: unknown }).level === 'FAIL' &&
            (record as { subject?: unknown }).subject === 'scripts/audit.ts'
        )
      ).toBe(true)
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })
})
