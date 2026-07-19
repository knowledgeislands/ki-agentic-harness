#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const scripts = dirname(fileURLToPath(import.meta.url))
const audit = join(scripts, 'audit.ts')
const conform = join(scripts, 'conform.ts')
const fixture = () => mkdtempSync(join(tmpdir(), 'ki-kb-activities-'))
const activities = (target: string) => join(target, 'Admin', 'Operations', 'Activities')

describe('ki-kb-activities structured checker', () => {
  test('top-level commands expose help without running work', () => {
    for (const [file, flag] of [
      [audit, '--help'],
      [conform, '--help'],
      [join(scripts, 'educate.ts'), '--help']
    ] as const) {
      const result = spawnSync('bun', [file, flag], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('Usage: bun scripts/')
    }
  })

  test('audit reports required activity frontmatter and judgment summary', () => {
    const target = fixture()
    try {
      mkdirSync(activities(target), { recursive: true })
      writeFileSync(join(activities(target), 'Example.md'), '---\nstatus: active\nrealization: manual\n---\n\n# Example\n')
      writeFileSync(join(activities(target), 'Activities.md'), '# Activities\n\n- [Example](Example.md)\n')
      const result = spawnSync('bun', [audit, target], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const summary = parsed.records.at(-1) as { summary?: { fail?: number; warn?: number; judgment?: { unevaluated?: number } } }
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(summary.summary?.fail).toBe(0)
      expect(summary.summary?.warn).toBe(0)
      expect(summary.summary?.judgment?.unevaluated).toBe(6)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('conform safely creates the index and appends missing activity links', () => {
    const target = fixture()
    try {
      mkdirSync(activities(target), { recursive: true })
      writeFileSync(join(activities(target), 'Example.md'), '---\nstatus: active\nrealization: manual\n---\n\n# Example\n')
      const result = spawnSync('bun', [conform, target], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(result.stdout).toContain('FIXED')
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })
})
