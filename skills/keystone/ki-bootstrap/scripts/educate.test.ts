#!/usr/bin/env bun
import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const EDUCATE = join(dirname(fileURLToPath(import.meta.url)), 'educate.ts')
const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('ki-bootstrap EDUCATE exposes help without running repository bootstrap', () => {
  const result = spawnSync('bun', [EDUCATE, '--help'], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('Usage: bun scripts/educate.ts')
  expect(result.stdout).toContain('aggregate runners')
  expect(result.stderr).toBe('')
})

test('ki-bootstrap EDUCATE invokes its owned repository educator directly', () => {
  const target = mkdtempSync(join(tmpdir(), 'ki-bootstrap-educate-'))
  temporaryDirectories.push(target)

  const result = spawnSync('bun', [EDUCATE, target, '--dry-run'], { encoding: 'utf8' })

  expect(result.status).toBe(0)
  expect(result.stdout).toContain('EDUCATE ')
  expect(result.stdout).toContain('0 governed skills')
  expect(result.stdout).toContain('runner')
  expect(existsSync(join(target, '.ki'))).toBe(false)
})
