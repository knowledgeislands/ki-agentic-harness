#!/usr/bin/env bun
/**
 * Run-based behavioural test for `link-skills.ts --check`.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**` and names the harness as
 * the "run, not unit-tested" case for skill `scripts/`. So rather than a vitest suite
 * this spawns the real CLI against throwaway `.ki-config.toml` fixtures and asserts on
 * its exit code and output — matching that convention and sidestepping the script's
 * CLI-on-import shape.
 *
 * Covers the orphaned-table regression: a `[ki-*]` table declared in `.ki-config.toml`
 * that resolves to no skill in the harness (e.g. left behind by a rename) must be a
 * BOOT-1 FAIL with a non-zero exit — while a repo whose tables all resolve stays clean.
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LINKER = join(dirname(fileURLToPath(import.meta.url)), 'link-skills.ts')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

/** Build a throwaway repo whose `.ki-config.toml` holds the given `[ki-*]` tables. */
function fixture(tables: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'ki-boot-linktest-'))
  writeFileSync(join(dir, '.ki-config.toml'), `${tables.map((t) => `[${t}]`).join('\n')}\n`)
  return dir
}

function runCheck(dir: string): { code: number; out: string } {
  const res = spawnSync('bun', [LINKER, '--check', dir], { encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

// ── Stale: a declared table that resolves to no harness skill → BOOT-1 FAIL ──
const stale = fixture(['ki-kb', 'ki-websites-11ty'])
try {
  const { code, out } = runCheck(stale)
  check('stale table → non-zero exit', code !== 0)
  check('stale table → reports FAIL', /FAIL/.test(out))
  check('stale table → cites BOOT-1', out.includes('BOOT-1'))
  check('stale table → names the orphaned table', out.includes('ki-websites-11ty'))
} finally {
  rmSync(stale, { recursive: true, force: true })
}

// ── Control: every declared table resolves → no orphan FAIL, exit 0 ──
const clean = fixture(['ki-kb'])
try {
  const { code, out } = runCheck(clean)
  check('clean tables → exit 0', code === 0)
  check('clean tables → no orphan FAIL line', !out.includes('ki-websites-11ty'))
} finally {
  rmSync(clean, { recursive: true, force: true })
}

// ── No package.json → BOOT-2/BOOT-5 are N/A (not WARN) ──
const noPkg = fixture(['ki-kb'])
try {
  const { out } = runCheck(noPkg)
  check('no package.json → no BOOT-2 line', !out.includes('BOOT-2'))
  check('no package.json → no BOOT-5 line', !out.includes('BOOT-5'))
} finally {
  rmSync(noPkg, { recursive: true, force: true })
}

// ── package.json present but scriptless → BOOT-2/BOOT-5 WARN again ──
const withPkg = fixture(['ki-kb'])
try {
  writeFileSync(join(withPkg, 'package.json'), '{\n  "name": "t",\n  "scripts": {}\n}\n')
  const { out } = runCheck(withPkg)
  check('package.json present → BOOT-2 warns', out.includes('BOOT-2'))
  check('package.json present → BOOT-5 warns', out.includes('BOOT-5'))
} finally {
  rmSync(withPkg, { recursive: true, force: true })
}

if (failed) {
  console.log('\n\x1b[31mlink-skills.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mlink-skills.test.ts: all checks passed\x1b[0m')
