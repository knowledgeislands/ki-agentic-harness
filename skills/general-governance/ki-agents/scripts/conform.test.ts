import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { runAgentsConform } from './conform.ts'
import type { AgentsRubricContext } from './rubric/contexts/agents.ts'
import { KI_AGENTS_RUBRIC } from './rubric/items/index.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const conform = resolve(import.meta.dir, 'conform.ts')
const definition = `---\nname: wrong-name\ndescription: Owns review. Use for review requests.\nmodel: inherit\n---\n\n# Role\n\nReview the requested agent.\n`

describe('ki-agents CONFORM wrapper', () => {
  test('shows useful help without mutating a target', () => {
    const result = spawnSync('bun', [conform, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
  })

  test('dry-run reports the safe name fix without writing', async () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-conform-'))
    const file = join(root, 'expected-name.md')
    try {
      writeFileSync(file, definition)
      const result = spawnSync('bun', [conform, root, '--dry-run'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(await Bun.file(file).text()).toBe(definition)
      expect(result.stdout).toContain('"code":"LAY-3"')
      expect(result.stdout).toContain('"level":"FIXED"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('applies only the declared filename-alignment fix', async () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-conform-'))
    const file = join(root, 'expected-name.md')
    try {
      writeFileSync(file, definition)
      const result = spawnSync('bun', [conform, root], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      const updated = await Bun.file(file).text()
      expect(updated).toContain('name: expected-name')
      expect(updated).toContain('description: Owns review. Use for review requests.')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('invalid catalogue planning prevents context-factory writes', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-invalid-plan-'))
    const marker = join(root, 'should-not-exist')
    try {
      const firstFamily = KI_AGENTS_RUBRIC.families[0]
      const invalidRubric = {
        ...KI_AGENTS_RUBRIC,
        families: [firstFamily, firstFamily, ...KI_AGENTS_RUBRIC.families.slice(1)]
      } as unknown as RubricDefinition<AgentsRubricContext>
      expect(() =>
        runAgentsConform(root, false, invalidRubric, () => {
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
