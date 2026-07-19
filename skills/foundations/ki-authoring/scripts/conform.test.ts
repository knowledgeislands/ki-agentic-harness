import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const CONFORM = join(dirname(fileURLToPath(import.meta.url)), 'conform.ts')

describe('ki-authoring CONFORM wrapper', () => {
  test('shows help without running the checker', () => {
    const result = spawnSync('bun', [CONFORM, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
    expect(result.stdout).toContain('--dry-run')
  })

  test('dry-run reports owned-file fixes without persistence', () => {
    const target = mkdtempSync(join(tmpdir(), 'ki-authoring-conform-'))
    try {
      const result = spawnSync('bun', [CONFORM, target, '--dry-run'], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      expect(parsed.errors).toEqual([])
      expect(
        parsed.records.some(
          (record) =>
            (record as { record?: unknown; code?: unknown; level?: unknown }).record === 'finding' &&
            (record as { code?: unknown }).code === 'OWN-1' &&
            (record as { level?: unknown }).level === 'FIXED'
        )
      ).toBe(true)
      expect(() => readFileSync(join(target, '.prettierrc.json'), 'utf8')).toThrow()
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
