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

const run = (target: string): { output: string; status: number | null } => {
  const result = spawnSync('bun', [AUDIT, target], { encoding: 'utf8' })
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
  writeFileSync(join(dir, 'scripts', 'audit.ts'), "import { runChecker } from './lib/checker.ts'\nvoid runChecker\n")
  return { base, dir }
}

describe('ki-skills AUDIT wrapper', () => {
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
})
