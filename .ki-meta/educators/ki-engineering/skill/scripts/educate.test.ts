#!/usr/bin/env bun
import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const EDUCATE = join(dirname(fileURLToPath(import.meta.url)), 'educate.ts')

test('ki-engineering EDUCATE exposes help without running repository bootstrap', () => {
  const result = spawnSync('bun', [EDUCATE, '--help'], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('Usage: bun scripts/educate.ts')
  expect(result.stdout).toContain('ki-engineering')
  expect(result.stderr).toBe('')
})
