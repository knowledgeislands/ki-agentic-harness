import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const CONFORM = join(dirname(fileURLToPath(import.meta.url)), 'conform.ts')
const AUDIT = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')

const fixture = (): string => {
  const target = realpathSync(mkdtempSync(join(tmpdir(), 'ki-bootstrap-conform-')))
  writeFileSync(join(target, '.ki-config.toml'), '[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n')
  return target
}

const findings = (output: string): readonly Record<string, unknown>[] =>
  parseCheckerJsonl(output).records.filter(
    (record): record is Record<string, unknown> =>
      typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  )

describe('ki-bootstrap CONFORM wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [CONFORM, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
    expect(result.stdout).toContain('--dry-run')
    expect(result.stdout).not.toContain('"record"')
  })

  test('dry-run reports planned fixes without persistence', () => {
    const target = fixture()
    const before = readFileSync(join(target, '.ki-config.toml'), 'utf8')
    try {
      const result = spawnSync('bun', [CONFORM, target, '--dry-run'], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(
        parsed.records.some(
          (record) =>
            (record as { record?: unknown; code?: unknown; level?: unknown }).record === 'finding' &&
            (record as { code?: unknown }).code === 'BOOT-1' &&
            (record as { level?: unknown }).level === 'FIXED'
        )
      ).toBe(true)
      expect(readFileSync(join(target, '.ki-config.toml'), 'utf8')).toBe(before)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('agent findings use the shared dry-run and post-publication evidence', () => {
    const target = fixture()
    writeFileSync(join(target, '.ki-config.toml'), '[ki-repo]\nsupported_runtimes = ["claude-code"]\n[ki-authoring]\n[ki-agents]\n')
    try {
      const preview = spawnSync('bun', [CONFORM, target, '--dry-run'], { encoding: 'utf8' })
      const previewFindings = findings(preview.stdout)
      expect(preview.status).toBe(0)
      expect(previewFindings.some((finding) => finding.code === 'BOOT-6' && finding.level === 'FIXED')).toBe(true)
      expect(previewFindings.some((finding) => finding.code === 'BOOT-8' && finding.level === 'FIXED')).toBe(true)
      expect(existsSync(join(target, '.claude', 'agents'))).toBe(false)

      const conformed = spawnSync('bun', [CONFORM, target], { encoding: 'utf8' })
      const conformedFindings = findings(conformed.stdout)
      expect(conformed.status).toBe(0)
      expect(conformedFindings.some((finding) => finding.code === 'BOOT-6' && finding.level === 'FIXED')).toBe(true)
      expect(conformedFindings.some((finding) => finding.code === 'BOOT-8' && finding.level === 'FIXED')).toBe(true)

      const audited = spawnSync('bun', [AUDIT, target], { encoding: 'utf8' })
      const auditFindings = findings(audited.stdout)
      expect(auditFindings.some((finding) => finding.code === 'BOOT-6' && finding.level === 'PASS')).toBe(true)
      expect(auditFindings.some((finding) => finding.code === 'BOOT-8' && finding.level === 'PASS')).toBe(true)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('rejects unknown options and multiple targets before writing', () => {
    const unknown = spawnSync('bun', [CONFORM, '--dry-rnu'], { encoding: 'utf8' })
    expect(unknown.status).toBe(2)
    expect(unknown.stderr).toContain('unknown option: --dry-rnu')

    const extraTargets = ['one', 'two']
    const multiple = spawnSync('bun', [CONFORM, ...extraTargets], { encoding: 'utf8' })
    expect(multiple.status).toBe(2)
    expect(multiple.stderr).toContain('conform accepts at most one target')
  })
})
