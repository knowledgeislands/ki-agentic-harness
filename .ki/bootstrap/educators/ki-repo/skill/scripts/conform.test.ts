import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createValidatedConformContext } from './conform.ts'
import type { RepoRubricContext } from './rubric/contexts/contexts.ts'
import { KI_REPO_RUBRIC } from './rubric/items/index.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const script = resolve(import.meta.dir, 'conform.ts')

describe('ki-repo conform entry point', () => {
  test('exposes command help without mutating a target', () => {
    const result = spawnSync('bun', [script, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/conform.ts')
  })

  test('dry-run reports the plan without writing', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-repo-conform-'))
    try {
      expect(spawnSync('git', ['-C', root, 'init', '-q']).status).toBe(0)
      const result = spawnSync('bun', [script, root, '--dry-run'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(existsSync(join(root, '.ki-config.toml'))).toBe(false)
      expect(existsSync(join(root, '.gitignore'))).toBe(false)
      const records = result.stdout
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line) as { record: string })
      expect(records[0]?.record).toBe('meta')
      expect(records.at(-1)?.record).toBe('summary')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('invalid catalogue or planning prevents the context factory from writing', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-repo-invalid-plan-'))
    const marker = join(root, 'should-not-exist')
    try {
      const firstFamily = KI_REPO_RUBRIC.families[0]
      const invalidRubric = {
        ...KI_REPO_RUBRIC,
        families: [firstFamily, firstFamily, ...KI_REPO_RUBRIC.families.slice(1)]
      } as unknown as RubricDefinition<RepoRubricContext>
      expect(() =>
        createValidatedConformContext([], invalidRubric, () => {
          writeFileSync(marker, 'unsafe write')
          return {
            target: root,
            context: { mode: 'conform', outcomes: () => [{ status: 'PASS', message: 'unexpected' }] }
          }
        })
      ).toThrow('invalid rubric catalogue')
      expect(existsSync(marker)).toBe(false)

      const firstItem = firstFamily.items[0]
      const invalidPhaseRubric = {
        ...KI_REPO_RUBRIC,
        families: [
          {
            ...firstFamily,
            items: [
              {
                ...firstItem,
                mechanical: {
                  ...firstItem.mechanical,
                  conform: { ...firstItem.mechanical?.conform, phase: 'INVALID_PHASE' }
                }
              },
              ...firstFamily.items.slice(1)
            ]
          },
          ...KI_REPO_RUBRIC.families.slice(1)
        ]
      } as unknown as RubricDefinition<RepoRubricContext>
      expect(() =>
        createValidatedConformContext([], invalidPhaseRubric, () => {
          writeFileSync(marker, 'unsafe write')
          return {
            target: root,
            context: { mode: 'conform', outcomes: () => [{ status: 'PASS', message: 'unexpected' }] }
          }
        })
      ).toThrow('unknown phase')
      expect(existsSync(marker)).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
