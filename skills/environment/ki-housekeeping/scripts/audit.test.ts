import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const scripts = dirname(fileURLToPath(import.meta.url))
const audit = join(scripts, 'audit.ts')
const conform = join(scripts, 'conform.ts')
const educate = join(scripts, 'educate.ts')

describe('ki-housekeeping structured checker', () => {
  test('EDUCATE exposes help without invoking bootstrap', () => {
    const result = spawnSync('bun', [educate, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/educate.ts')
  })

  test('emits canonical JSONL and counts judgment without synthetic findings', () => {
    const memory = mkdtempSync(join(tmpdir(), 'ki-housekeeping-audit-'))
    try {
      writeFileSync(join(memory, 'MEMORY.md'), '# Memory\n')
      const result = spawnSync('bun', [audit, '.', '--memory-dir', memory], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const summary = parsed.records.at(-1) as { summary?: { judgment?: { unevaluated?: number } } }
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(parsed.records.some((record) => (record as { code?: string }).code === 'DOC-1')).toBe(false)
      expect(summary.summary?.judgment?.unevaluated).toBe(7)
    } finally {
      rmSync(memory, { recursive: true, force: true })
    }
  })

  test('reports foreign learned paths as IDX-6 WARN', () => {
    const memory = mkdtempSync(join(tmpdir(), 'ki-housekeeping-foreign-'))
    try {
      writeFileSync(
        join(memory, 'MEMORY.md'),
        '<!-- headroom:learn:start -->\n/Users/x/knowledgeislands/other-island\n<!-- headroom:learn:end -->\n'
      )
      const target = join(tmpdir(), 'this-island')
      const result = spawnSync('bun', [audit, target, '--memory-dir', memory], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('"code":"IDX-6"')
      expect(result.stdout).toContain('"level":"WARN"')
    } finally {
      rmSync(memory, { recursive: true, force: true })
    }
  })

  test('conform dry-run plans safe name and index repairs without writing', () => {
    const memory = mkdtempSync(join(tmpdir(), 'ki-housekeeping-conform-'))
    try {
      writeFileSync(join(memory, 'MEMORY.md'), '# Memory\n')
      writeFileSync(join(memory, 'sample.md'), '---\nname: wrong\ndescription: sample\nmetadata:\n  type: reference\n---\n')
      const result = spawnSync('bun', [conform, '.', '--memory-dir', memory, '--dry-run'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('"code":"IDX-3"')
      expect(result.stdout).toContain('"code":"FM-2"')
      expect(result.stdout).toContain('"level":"FIXED"')
      expect(result.stdout).not.toContain('name: sample')
    } finally {
      rmSync(memory, { recursive: true, force: true })
    }
  })
})
