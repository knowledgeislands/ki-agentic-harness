#!/usr/bin/env bun
/**
 * ki-bootstrap — BOOT-9: audit a target repo's vendored `.ki-meta/skills/` set
 * against what it *should* be.
 *
 * The mechanical `.ki-meta/bin/ki-audit` self-check runs standalone (no harness, no
 * skills installed) — but it has no way to re-derive the expected set, since the
 * `implies:` graph lives in the harness's SKILL.md frontmatter, not anywhere copied
 * into the target. So this check runs from the harness side, the same way
 * re-bootstrapping already does: it resolves the expected set the same way
 * `bootstrap.ts` does (baseline ∪ declared `[ki-*]` tables ∪ the transitive
 * `implies:` closure, restricted to skills that actually carry a checker) and diffs
 * it against the target's `.ki-meta/skills/*` directories. Any drift — stale config,
 * an upstream skill add/remove, a partial re-vendor — surfaces as a WARN rather than
 * silently going unnoticed; `bun skills/ki-bootstrap/scripts/bootstrap.ts <target>`
 * fixes it by re-vendoring.
 *
 * Usage: bun audit-vendored.ts [target-repo] [--all]   (read-only)
 * `--all` matches how the target was bootstrapped — the harness itself vendors every
 * skill (`bootstrap.ts . --all`), not just its own declared coverage.
 */

import { existsSync, readdirSync, realpathSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { checkerScript, resolveSet, SKILLS_ROOT } from './resolve.ts'

const YELLOW = '\x1b[33m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const argv = process.argv.slice(2)
const target = resolve(argv.find((a) => !a.startsWith('--')) ?? '.')
// The harness itself vendors every skill (`bootstrap.ts . --all`), same auto-detection
// link-skills.ts uses, so `--all` need not be typed by hand for the common case.
const all = argv.includes('--all') || realpathSync(target) === realpathSync(join(SKILLS_ROOT, '..'))
const vendoredRoot = join(target, '.ki-meta', 'skills')

if (!existsSync(vendoredRoot)) {
  console.log(`${DIM}no .ki-meta/skills/ under ${target} — nothing to check (not yet bootstrapped)${RESET}`)
  process.exit(0)
}

// Only skills with a discoverable checker are ever vendored (vendorSkill() in
// bootstrap.ts is a no-op for skills without one), so restrict the expectation to those.
const expected = resolveSet(target, all, []).filter((s) => checkerScript(s) !== null)
const actual = readdirSync(vendoredRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

const missing = expected.filter((s) => !actual.includes(s))
const extra = actual.filter((s) => !expected.includes(s))

console.log(`\n  ${DIM}target:${RESET} ${target}   ${DIM}expected:${RESET} ${expected.length}   ${DIM}vendored:${RESET} ${actual.length}\n`)

if (missing.length === 0 && extra.length === 0) {
  console.log(
    `  ${DIM}PASS${RESET}  [BOOT-9]  .ki-meta/skills/ matches the expected resolved set (${expected.length} skill${expected.length === 1 ? '' : 's'})`
  )
  process.exit(0)
}

if (missing.length)
  console.log(
    `  ${YELLOW}WARN${RESET}  [BOOT-9]  missing from .ki-meta/skills/: ${missing.join(', ')} — re-run \`bun skills/ki-bootstrap/scripts/bootstrap.ts ${target}\``
  )
if (extra.length)
  console.log(
    `  ${YELLOW}WARN${RESET}  [BOOT-9]  vendored but no longer expected: ${extra.join(', ')} — a dropped table or upstream implies change; re-bootstrap to prune`
  )

console.log('→ to address: run /ki-bootstrap CONFORM   (re-vendor: bun skills/ki-bootstrap/scripts/bootstrap.ts <target>)')

// Drift here is always conformable by re-vendoring (WARN, never FAIL) — mirrors BOOT-1.
process.exit(0)
