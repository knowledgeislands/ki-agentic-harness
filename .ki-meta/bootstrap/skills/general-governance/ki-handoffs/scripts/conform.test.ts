import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { runHandoffsConform } from './conform.ts'
import type { HandoffsRubricContext } from './rubric/contexts/handoffs.ts'
import { KI_HANDOFFS_RUBRIC } from './rubric/items/index.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const conform = resolve(import.meta.dir, 'conform.ts')
const withoutReadiness = `---
handoff: true
tier: haiku
---

## Decisions

Locked: use the approved implementation.

Escalate: none.
`

describe('ki-handoffs CONFORM wrapper', () => {
  test('shows useful help without mutating a target', () => {
    const result = spawnSync('bun', [conform, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
  })

  test('dry-run reports readiness normalization without writing', async () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-conform-'))
    const file = join(root, 'plan.md')
    try {
      writeFileSync(file, withoutReadiness)
      const result = spawnSync('bun', [conform, root, '--dry-run'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(await Bun.file(file).text()).toBe(withoutReadiness)
      expect(result.stdout).toContain('"code":"HAND-3"')
      expect(result.stdout).toContain('"level":"FIXED"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('adds only readiness: pending', async () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-conform-'))
    const file = join(root, 'plan.md')
    try {
      writeFileSync(file, withoutReadiness)
      const result = spawnSync('bun', [conform, root], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      const updated = await Bun.file(file).text()
      expect(updated).toContain('tier: haiku')
      expect(updated).toContain('readiness: pending')
      expect(updated).toContain('Locked: use the approved implementation.')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('invalid catalogue planning prevents context-factory writes', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-handoffs-invalid-plan-'))
    const marker = join(root, 'should-not-exist')
    try {
      const family = KI_HANDOFFS_RUBRIC.families[0]
      const invalidRubric = {
        ...KI_HANDOFFS_RUBRIC,
        families: [family, family]
      } as unknown as RubricDefinition<HandoffsRubricContext>
      expect(() =>
        runHandoffsConform(root, false, invalidRubric, () => {
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
