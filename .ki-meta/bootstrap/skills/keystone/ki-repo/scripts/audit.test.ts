import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { KI_REPO_RUBRIC } from './rubric/items/index.ts'
import { renderRubric } from './rubric/publish.ts'
import { validateRubricCatalogue } from './vendored/ki-skills/rubric.ts'

const script = resolve(import.meta.dir, 'audit.ts')

describe('ki-repo audit entry point', () => {
  test('exposes command help without running the checker', () => {
    const result = spawnSync('bun', [script, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
  })

  test('publishes a valid structured catalogue with exact generated-rubric parity', () => {
    expect(validateRubricCatalogue(KI_REPO_RUBRIC)).toEqual([])
    const published = readFileSync(resolve(import.meta.dir, '../references/rubric.md'), 'utf8')
    expect(renderRubric(KI_REPO_RUBRIC)).toBe(published)
  })

  test('retains the config education output', () => {
    const result = spawnSync('bun', [script, '--educate'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('[ki-repo]')
    expect(result.stdout).toContain('[ki-authoring]')
  })

  test('emits canonical JSONL for a local repository', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-repo-audit-'))
    try {
      expect(spawnSync('git', ['-C', root, 'init', '-q']).status).toBe(0)
      const result = spawnSync('bun', [script, root], { encoding: 'utf8' })
      expect(result.status).toBe(0)
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
})
