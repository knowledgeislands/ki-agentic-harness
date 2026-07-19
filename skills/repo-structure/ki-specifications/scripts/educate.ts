#!/usr/bin/env bun
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL = 'ki-specifications'
if (process.argv.slice(2).some((argument) => argument === '-h' || argument === '--help')) {
  process.stdout.write('Usage: bun scripts/educate.ts <target-repo> [--ref <ref>] [--dry-run]\n\nBootstrap ki-specifications into a target repository.\n')
  process.exit(0)
}
const engine = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'ki-bootstrap', 'scripts', 'lib', 'repo-bootstrap.ts')
execFileSync('bun', [engine, ...process.argv.slice(2), '--seed', SKILL], { stdio: 'inherit' })
