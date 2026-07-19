#!/usr/bin/env bun
import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const EDUCATE = join(dirname(fileURLToPath(import.meta.url)), 'educate.ts')
const temporaryDirectories: string[] = []

const temporaryTarget = (): string => {
  const target = mkdtempSync(join(tmpdir(), 'ki-skills-educate-'))
  temporaryDirectories.push(target)
  return target
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('ki-skills EDUCATE shows help without invoking bootstrap', () => {
  const result = spawnSync('bun', [EDUCATE, '-h'], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('Usage: bun scripts/educate.ts')
  expect(result.stdout).toContain('Aggregate runners remain owned by ki-bootstrap')
})

test('ki-skills EDUCATE refreshes only its own local payloads', () => {
  const target = temporaryTarget()
  const result = spawnSync('bun', [EDUCATE, target], { encoding: 'utf8' })

  expect(result.status).toBe(0)
  expect(result.stdout).toContain('EDUCATE complete — ki-skills')
  expect(existsSync(join(target, '.ki-meta', 'checkers', 'ki-skills', 'scripts', 'audit.ts'))).toBe(true)
  expect(existsSync(join(target, '.ki-meta', 'educators', 'ki-skills', 'scripts', 'educate.ts'))).toBe(true)
  expect(existsSync(join(target, '.ki-meta', 'bin'))).toBe(false)
})
