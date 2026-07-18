#!/usr/bin/env bun
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')
const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-specifications-'))
  writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\n\n[ki-specifications]\n')
  for (const path of ['proposals', 'specifications', 'schemas', 'templates', 'examples', 'docs', 'tooling']) mkdirSync(join(root, path))
  return root
}

const root = fixture()
const clean = spawnSync('bun', [script, root], { encoding: 'utf8' })
if (clean.status !== 0 || !clean.stdout.includes('"level":"PASS"'))
  throw new Error(`clean fixture failed:\n${clean.stdout}\n${clean.stderr}`)

const incomplete = fixture()
rmdirSync(join(incomplete, 'schemas'))
const failed = spawnSync('bun', [script, incomplete], { encoding: 'utf8' })
if (failed.status === 0 || !failed.stdout.includes('"code":"SPEC-2"')) throw new Error(`missing core area did not fail:\n${failed.stdout}`)

process.stdout.write('PASS ki-specifications audit fixtures\n')
