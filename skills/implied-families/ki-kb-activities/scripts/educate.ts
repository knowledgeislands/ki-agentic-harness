#!/usr/bin/env bun
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const help =
  'Usage: bun scripts/educate.ts <target-base> [--ref <ref>] [--dry-run]\n\nEducate a base with ki-kb-activities and its declared dependencies.\n'
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  process.stdout.write(help)
  process.exit(0)
}

const engine = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'ki-bootstrap', 'scripts', 'lib', 'repo-bootstrap.ts')
execFileSync('bun', [engine, ...process.argv.slice(2), '--seed', 'ki-kb-activities'], { stdio: 'inherit' })
