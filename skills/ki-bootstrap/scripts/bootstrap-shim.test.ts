#!/usr/bin/env bun
/**
 * Run-based behavioural test for the legacy `bootstrap.sh` back-compat shim.
 *
 * ki-bootstrap moved from `skills/ki-bootstrap/scripts/` to
 * `skills/keystone/ki-bootstrap/scripts/` in the cluster reorg (commit 72e3a26). A
 * pre-reorg vendored `ki-init` still fetches the old raw URL by name, so this file
 * must physically exist and re-exec the canonical engine — this asserts that exec
 * chain without a live network hop, via the `KI_BOOTSTRAP_LOCAL_ROOT` test hook.
 */
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SHIM = join(dirname(fileURLToPath(import.meta.url)), 'bootstrap.sh')
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

const res = spawnSync('sh', [SHIM, '--dry-run', join(REPO_ROOT), '--ref', 'main'], {
  encoding: 'utf8',
  env: { ...process.env, KI_BOOTSTRAP_LOCAL_ROOT: REPO_ROOT }
})
const out = `${res.stdout ?? ''}${res.stderr ?? ''}`

check('legacy shim exec chain → exit 0', res.status === 0)
check('legacy shim exec chain → reaches the canonical engine (dry-run vendor output)', /vendor|runner/.test(out))

if (failed) {
  console.log('\n\x1b[31mbootstrap-shim.test.ts: failures\x1b[0m')
  console.log(out)
  process.exit(1)
}
console.log('\n\x1b[32mbootstrap-shim.test.ts: all checks passed\x1b[0m')
