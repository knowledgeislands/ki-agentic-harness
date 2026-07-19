#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { KI_KB_RUBRIC } from './rubric/items/index.ts'
import { renderRubric } from './rubric/publish.ts'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const AUDIT = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')
const CONFORM = join(dirname(fileURLToPath(import.meta.url)), 'conform.ts')
const RUBRIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
const fixture = (): string => mkdtempSync(join(tmpdir(), 'ki-kb-audit-'))
const run = (root: string) => {
  const result = spawnSync(process.execPath, [AUDIT, root], { encoding: 'utf8' })
  return { status: result.status, parsed: parseCheckerJsonl(result.stdout) }
}
const findings = (output: ReturnType<typeof run>) =>
  output.parsed.records.filter(
    (record) => typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  ) as Array<Record<string, unknown>>

describe('ki-kb structured audit', () => {
  test('emits one not-applicable result for an irrelevant directory', () => {
    const root = fixture()
    try {
      const output = run(root)
      expect(output.status).toBe(0)
      expect(output.parsed.errors).toEqual([])
      expect(findings(output).filter((finding) => finding.code === 'ZONE-1' && finding.level === 'NOT_APPLICABLE')).toHaveLength(1)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('runs the complete audit for a declared but incomplete base', () => {
    const root = fixture()
    writeFileSync(join(root, '.ki-config.toml'), '[ki-kb]\n')
    try {
      const output = run(root)
      expect(output.status).toBe(1)
      expect(output.parsed.errors).toEqual([])
      expect(findings(output).some((finding) => finding.code === 'ZONE-1' && finding.level === 'FAIL')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('detects produced output outside outbound staging', () => {
    const root = fixture()
    for (const zone of ['Calendar', 'Pillars', 'Resources', 'Streams', 'Admin']) {
      mkdirSync(join(root, zone), { recursive: true })
      writeFileSync(join(root, zone, `${zone}.md`), `# ${zone}\n`)
    }
    writeFileSync(join(root, 'Admin', 'MEMORY.md'), '# MEMORY\n')
    writeFileSync(join(root, '.ki-config.toml'), '[ki-kb]\n')
    writeFileSync(join(root, 'Calendar', 'digest.md'), '---\ntype: session-digest\n---\n')
    try {
      const output = run(root)
      expect(findings(output).some((finding) => finding.code === 'ZONE-5' && finding.level === 'FAIL')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('conform dry-run does not write its absent config marker', () => {
    const root = fixture()
    try {
      const result = spawnSync(process.execPath, [CONFORM, root, '--dry-run'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(existsSync(join(root, '.ki-config.toml'))).toBe(false)
      expect(parseCheckerJsonl(result.stdout).errors).toEqual([])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('generated rubric exactly matches the structured catalogue', () => {
    expect(readFileSync(RUBRIC, 'utf8')).toBe(renderRubric(KI_KB_RUBRIC))
  })
})
