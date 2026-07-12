#!/usr/bin/env bun
/**
 * ki-bootstrap — CONFORM: bring a repo's project-local wiring into line.
 *
 * The mechanical half of Mode CONFORM — the verb-named counterpart to
 * `audit.ts` (AUDIT) and `init.ts` (INIT). Composes the two linkers in
 * write mode — `link-skills.ts`, then `link-agents.ts` — which create/prune the
 * relative symlinks under `.claude/skills/` / `.claude/agents/`, write the
 * matching `.gitignore` lines, and (where a `package.json` exists) scaffold the
 * `ki:skills:link:project` / `ki:agents:link:project` and per-skill
 * `ki:<suffix>:<verb>` keys — then re-runs both `--check` audits to confirm.
 *
 * Vendored-set drift is NEVER fixed here: per the drift contract
 * (ADR-KI-HARNESS-006) CONFORM only advises. `audit.ts` runs read-only
 * at the end, and any drift it reports is repaired by re-running INIT
 * (`./.ki-meta/bin/ki-init`, or `bun skills/ki-bootstrap/scripts/init.ts`).
 *
 * NEVER touches (judgment → manual): the declared coverage itself (the
 * `.ki-config.toml` `[ki-*]` tables — BOOT-4, ki-repo's coverage cascade) and a
 * declared table resolving to no harness skill (BOOT-1 FAIL — an upstream
 * rename/removal to reconcile by hand).
 *
 * Usage: bun conform.ts [target-repo] [--dry-run]
 *   --dry-run  preview both linkers' changes, touch nothing
 *
 * Every repo — the harness included — links its declared coverage (`.ki-config.toml`
 * `[ki-*]` tables + the ki-repo/ki-authoring baseline); there is no all-skills mode
 * (ADR-KI-HARNESS-007). Vendoring is likewise always coverage-scoped.
 */

import { spawnSync } from 'node:child_process'
import { join, resolve } from 'node:path'

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const target = resolve(argv.find((a) => !a.startsWith('--')) ?? '.')

function run(script: string, args: string[]): number {
  const r = spawnSync('bun', [join(import.meta.dirname, script), target, ...args], { stdio: 'inherit' })
  return r.status ?? 1
}

const flags = dryRun ? ['--dry-run'] : []
let failed = 0

// 1. Link — skills, then agents (write mode; --dry-run previews).
if (run('link-skills.ts', flags) !== 0) failed++
if (run('link-agents.ts', flags) !== 0) failed++

// 2. Re-run the checks to confirm (skipped on a preview — nothing changed).
if (!dryRun) {
  if (run('link-skills.ts', ['--check']) !== 0) failed++
  if (run('link-agents.ts', ['--check']) !== 0) failed++
}

// 3. Advisory only — never re-vendors (ADR-KI-HARNESS-006's drift contract). The
// vendored-set audit is always coverage-scoped (`--all` is a linking concept only —
// vendoring follows .ki-config coverage, ADR-KI-HARNESS-007), so it is never forwarded here.
if (run('audit.ts', []) !== 0) {
  console.log(
    'vendored-set drift is INIT’s to repair — re-run `./.ki-meta/bin/ki-init` (or `bun skills/ki-bootstrap/scripts/init.ts <target>`)'
  )
}

process.exit(failed > 0 ? 1 : 0)
