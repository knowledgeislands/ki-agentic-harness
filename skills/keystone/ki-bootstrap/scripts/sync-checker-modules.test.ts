#!/usr/bin/env bun
/** Direct source-payload regression for declared checker-module copies. */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = new URL('./lib/sync-checker-modules.ts', import.meta.url)
const result = spawnSync('bun', [fileURLToPath(script), '--check'], { encoding: 'utf8' })
const output = `${result.stdout ?? ''}${result.stderr ?? ''}`

if (result.status !== 0 || !output.includes('checker module payloads are current')) {
  console.error(output)
  process.exit(1)
}

console.log('sync-checker-modules.test.ts: all checks passed')
