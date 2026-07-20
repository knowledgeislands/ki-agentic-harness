import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const conform = join(scripts, 'conform.ts')

const fixture = (): { root: string; index: string } => {
  const root = mkdtempSync(join(tmpdir(), 'ki-decision-record-conform-'))
  const decisions = join(root, 'docs', 'decisions')
  mkdirSync(decisions, { recursive: true })
  const file = 'ADR-TEST-001-indexing.md'
  writeFileSync(
    join(decisions, file),
    '# ADR-TEST-001: Indexing\n\n## Context\n\nContext.\n\n## Decision\n\nWe index.\n\n## Consequences\n\nDiscoverable.\n'
  )
  const index = join(decisions, 'README.md')
  writeFileSync(index, '# Decisions\n')
  return { root, index }
}

const findings = (stdout: string): Array<{ code?: string; level?: string }> =>
  stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { record: string; code?: string; level?: string })
    .filter((record) => record.record === 'finding')

describe('decision-record conform', () => {
  test('dry-run plans and actual run applies a missing index entry', () => {
    const { root, index } = fixture()
    try {
      const before = readFileSync(index, 'utf8')
      const dryRun = spawnSync(process.execPath, [conform, root, '--dry-run'], { encoding: 'utf8' })
      expect(dryRun.status).toBe(0)
      expect(findings(dryRun.stdout)).toContainEqual(expect.objectContaining({ code: 'INDEX-2', level: 'FIXED' }))
      expect(readFileSync(index, 'utf8')).toBe(before)

      const applied = spawnSync(process.execPath, [conform, root], { encoding: 'utf8' })
      expect(applied.status).toBe(0)
      expect(findings(applied.stdout)).toContainEqual(expect.objectContaining({ code: 'INDEX-2', level: 'FIXED' }))
      expect(readFileSync(index, 'utf8')).toContain('[ADR-TEST-001]')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
