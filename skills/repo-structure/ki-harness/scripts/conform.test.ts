import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { runHarnessConform } from './conform.ts'
import type { HarnessRubricContext } from './rubric/contexts/harness.ts'
import { KI_HARNESS_RUBRIC } from './rubric/items/index.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const conform = resolve(import.meta.dir, 'conform.ts')

describe('ki-harness CONFORM wrapper', () => {
  test('shows help without mutating a target', () => {
    const result = spawnSync('bun', [conform, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
  })

  test('dry-run reports fixes without writing', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-harness-conform-'))
    try {
      writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\n')
      const result = spawnSync('bun', [conform, root, '--dry-run'], { encoding: 'utf8' })
      expect(result.status).toBe(1)
      expect(existsSync(join(root, 'skills'))).toBe(false)
      expect(existsSync(join(root, '.ki-config.toml'))).toBe(true)
      expect(Bun.file(join(root, '.ki-config.toml')).text()).resolves.toBe('[ki-repo]\n')
      expect(result.stdout).toContain('"record":"meta"')
      expect(result.stdout).toContain('"level":"FIXED"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('applies only the declared safe fixes', async () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-harness-conform-'))
    try {
      writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\n')
      const result = spawnSync('bun', [conform, root], { encoding: 'utf8' })
      expect(result.status).toBe(1)
      for (const part of ['skills', 'agents', 'mcp', 'evals', 'hooks']) expect(existsSync(join(root, part, 'README.md'))).toBe(true)
      expect(await Bun.file(join(root, '.ki-config.toml')).text()).toContain('[ki-harness]')
      expect(existsSync(join(root, 'CLAUDE.md'))).toBe(false)
      expect(existsSync(join(root, 'ROADMAP.md'))).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('invalid catalogue planning prevents context-factory writes', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-harness-invalid-plan-'))
    const marker = join(root, 'should-not-exist')
    try {
      const firstFamily = KI_HARNESS_RUBRIC.families[0]
      const invalidRubric = {
        ...KI_HARNESS_RUBRIC,
        families: [firstFamily, firstFamily, ...KI_HARNESS_RUBRIC.families.slice(1)]
      } as unknown as RubricDefinition<HarnessRubricContext>

      expect(() =>
        runHarnessConform(root, false, invalidRubric, () => {
          writeFileSync(marker, 'unsafe write')
          throw new Error('context factory should not run')
        })
      ).toThrow('invalid rubric catalogue')
      expect(existsSync(marker)).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
