#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
/** Run-based contract tests for the canonical JSONL CONFORM wrapper. */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './lib/checker.ts'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const CONFORM = join(SCRIPT_DIR, 'conform.ts')
const AUDIT = join(SCRIPT_DIR, 'audit.ts')

const run = (script: string, target: string, ...args: string[]): { output: string; status: number | null } => {
  const result = spawnSync('bun', [script, target, ...args], { encoding: 'utf8' })
  return { output: `${result.stdout ?? ''}${result.stderr ?? ''}`, status: result.status }
}

const findings = (output: string): readonly Record<string, unknown>[] =>
  parseCheckerJsonl(output).records.filter(
    (record): record is Record<string, unknown> =>
      typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  )

const fixture = (): { base: string; dir: string } => {
  const base = mkdtempSync(join(tmpdir(), 'ki-skills-conform-'))
  const dir = join(base, 'ki-fixture-conform')
  mkdirSync(join(dir, 'references'), { recursive: true })
  mkdirSync(join(dir, 'scripts'), { recursive: true })
  writeFileSync(join(dir, 'references', 'standards.md'), '# Fixture standards\n')
  writeFileSync(
    join(dir, 'SKILL.md'),
    [
      '---',
      'name: ki-fixture-conform',
      'depends-on: []',
      'vendors: { audit: scripts/audit-fixture.ts }',
      'description: Audits fixture skills against a local standard.',
      "argument-hint: 'audit <target> | conform <target>'",
      '---',
      '',
      '# Fixture',
      '',
      '[safe link](references\\standards.md)',
      '',
      'Literal text C:\\temp remains outside a link.',
      '',
      '## Operating modes',
      '',
      'Invoked as `help` it explains itself and stops.',
      '',
      '### Mode AUDIT',
      '',
      '### Mode CONFORM',
      '',
      '### Mode EDUCATE',
      '',
      '### Mode REFRESH',
      ''
    ].join('\n')
  )
  for (const name of ['educate.ts', 'audit.ts', 'conform.ts'])
    writeFileSync(
      join(dir, 'scripts', name),
      `if (process.argv.includes('-h') || process.argv.includes('--help')) process.stdout.write('Usage: bun scripts/${name} <target>\\n')\n`
    )
  return { base, dir }
}

describe('ki-skills CONFORM wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [CONFORM, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
    expect(result.stdout).toContain('--dry-run')
    expect(result.stdout).toContain('--reporter <reporter>')
    expect(result.stdout).toContain('--reporter-levels <levels>')
    expect(result.stdout).not.toContain('"record"')
  })

  test('renders FIXED outcomes for a direct terminal report', () => {
    const { base, dir } = fixture()
    try {
      const result = run(CONFORM, dir, '--reporter=terminal')
      expect(result.status).toBe(0)
      expect(result.output).toContain('FIXED')
      expect(result.output).toContain('Summary: FAIL=0')
      expect(result.output).not.toContain('"record"')
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  test('repairs safe drift and leaves no failing audit finding', () => {
    const { base, dir } = fixture()
    try {
      const result = run(CONFORM, dir)
      const repaired = readFileSync(join(dir, 'SKILL.md'), 'utf8')
      const conformFindings = findings(result.output)

      expect(parseCheckerJsonl(result.output).errors).toEqual([])
      expect(conformFindings.some((finding) => finding.level === 'FIXED')).toBe(true)
      expect({ status: result.status, failures: conformFindings.filter((finding) => finding.level === 'FAIL') }).toEqual({
        status: 0,
        failures: []
      })
      expect(repaired).toContain('[safe link](references/standards.md)')
      expect(repaired).toContain('Literal text C:\\temp remains outside a link.')
      expect(repaired).toContain('vendors: [educate, audit, conform, help]')
      expect(run(AUDIT, dir).status).toBe(0)
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  test('dry-run reports repairs without persisting them', () => {
    const { base, dir } = fixture()
    try {
      const before = readFileSync(join(dir, 'SKILL.md'), 'utf8')
      const result = run(CONFORM, dir, '--dry-run')
      expect(findings(result.output).some((finding) => finding.level === 'FIXED')).toBe(true)
      expect(readFileSync(join(dir, 'SKILL.md'), 'utf8')).toBe(before)
      expect({ status: result.status, failures: findings(result.output).filter((finding) => finding.level === 'FAIL') }).toEqual({
        status: 0,
        failures: []
      })
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  for (const [suffix, skillMd] of [
    ['missing-frontmatter', '# Fixture\n'],
    ['non-mapping-frontmatter', '---\n- not\n- a mapping\n---\n\n# Fixture\n']
  ] as const)
    test(`${suffix} uses FM-1 audit fallback without dependent name checks`, () => {
      const base = mkdtempSync(join(tmpdir(), 'ki-skills-conform-'))
      const dir = join(base, `ki-fixture-${suffix}`)
      mkdirSync(dir)
      writeFileSync(join(dir, 'SKILL.md'), skillMd)
      try {
        const result = run(CONFORM, dir)
        const output = findings(result.output)
        expect(result.status).toBe(1)
        expect(output.some((finding) => finding.code === 'FM-1' && finding.level === 'FAIL')).toBe(true)
        expect(output.some((finding) => finding.code === 'NAME-1')).toBe(false)
      } finally {
        rmSync(base, { recursive: true, force: true })
      }
    })
})
