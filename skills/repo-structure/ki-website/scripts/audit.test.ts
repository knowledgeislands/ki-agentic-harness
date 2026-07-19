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
const fixture = () => mkdtempSync(join(tmpdir(), 'ki-website-'))

describe('ki-website structured checker', () => {
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

  test('irrelevant targets return mechanical NOT_APPLICABLE results and judgment summary only', () => {
    const target = fixture()
    try {
      const result = spawnSync('bun', [audit, target], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const summary = parsed.records.at(-1) as { summary?: { notApplicable?: number; judgment?: { unevaluated?: number } } }
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(summary.summary?.notApplicable).toBeGreaterThan(0)
      expect(summary.summary?.judgment?.unevaluated).toBe(18)
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })

  test('declaration or structure activates the complete audit', () => {
    for (const arrange of [
      (target: string) => writeFileSync(join(target, '.ki-config.toml'), '[ki-website]\n'),
      (target: string) => {
        mkdirSync(join(target, 'site'), { recursive: true })
        writeFileSync(join(target, 'site', 'eleventy.config.ts'), '')
      }
    ]) {
      const target = fixture()
      try {
        arrange(target)
        const result = spawnSync('bun', [audit, target], { encoding: 'utf8' })
        const parsed = parseCheckerJsonl(result.stdout)
        const summary = parsed.records.at(-1) as { summary?: { fail?: number } }
        expect(parsed.errors).toEqual([])
        expect(result.status).toBe(1)
        expect(summary.summary?.fail).toBeGreaterThan(0)
      } finally {
        rmSync(target, { recursive: true, force: true })
      }
    }
  })

  test('dry-run CONFORM offers only the two safe, declared writes', () => {
    const target = fixture()
    try {
      mkdirSync(join(target, 'site'), { recursive: true })
      writeFileSync(join(target, 'site', 'eleventy.config.ts'), '')
      const result = spawnSync('bun', [conform, target, '--dry-run'], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      expect(parsed.errors).toEqual([])
      expect(result.stdout).toContain('WEB-41')
      expect(result.stdout).toContain('WEB-33')
    } finally {
      rmSync(target, { recursive: true, force: true })
    }
  })
})
