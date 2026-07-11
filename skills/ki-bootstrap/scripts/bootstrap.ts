#!/usr/bin/env bun
/**
 * ki-bootstrap chain engine — the mechanical half of INIT, and the start of the
 * bootstrap chain (ADR-KI-HARNESS-007). Brings a target repo under Knowledge
 * Islands governance so it governs itself with `./.ki-meta/bin/ki-audit` and
 * **zero skills installed** — and with **no `package.json` of its own** (dotfiles,
 * KB, tap): for every skill in the resolved set it vendors *copies* of the skill's
 * checker scripts (SCRIPT-7 — copies, not symlinks) into the target's
 * `.ki-meta/skills/<skill>/` (named by verb: `audit.ts`/`lint.ts`/`conform.ts`),
 * writes a `.ki-meta/bin/aggregate.ts` that discovers and fans
 * out over those copies, and drops a `.ki-meta/bin/ki-audit` wrapper — the
 * `package.json`-free entry point, dot-prefixed so it never collides with the
 * repo's own `bin/` and is auto-ignored by chezmoi. Where the target *has* a `package.json`, it
 * additionally installs that skill's `ki:<suffix>:{audit,conform}` npm keys and
 * the repo-wide `ki:audit` / `ki:conform` / `ki:init` aggregates as convenience
 * aliases over the same runner.
 *
 * Remote transport (ADR-KI-HARNESS-007): run straight from GitHub with no local
 * install —
 *   bun run https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/<ref>/skills/ki-bootstrap/scripts/bootstrap.ts <target>
 * When run from a raw URL the skill sources are fetched from the same ref; when
 * run locally they are read from the harness working tree.
 *
 * Aggressiveness flags (one chain, three strengths):
 *   (default / --new)  INIT only — vendor + keys + aggregates.
 *   --legacy           INIT, then a full `ki:conform` pass (the migration path).
 *   --tracking         INIT, then `ki:audit` (report drift only).
 *
 * Usage: bun bootstrap.ts <target-repo> [--new | --legacy | --tracking] [--all] [--dry-run]
 */

import { execFileSync } from 'node:child_process'
import { chmodSync, cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { ensureScripts } from './package-scripts.ts'
import { checkerScript, conformScript, resolveSet, scriptKey, skillDir } from './resolve.ts'

const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const VENDOR_DIR = '.ki-meta' // relative to the target repo root (dot-prefixed, generated-not-authored)

interface Mode {
  postConform: boolean
  postAudit: boolean
}

function parseMode(argv: string[]): Mode {
  if (argv.includes('--legacy')) return { postConform: true, postAudit: false }
  if (argv.includes('--tracking')) return { postConform: false, postAudit: true }
  return { postConform: false, postAudit: false } // --new / default
}

// The aggregate runner vendored into every target — discovers the vendored checkers
// under its sibling `../skills/` dir (an allowlist: only that dir is scanned, so `bin/`
// and the report dirs are never mistaken for skills) and fans out over them for the
// given verb. It reads the filesystem, not `package.json`, so it works in a repo that
// has no `package.json` at all, and stays correct as skills are vendored in or out.
const AGGREGATE_RUNNER = `#!/usr/bin/env bun
// Vendored by ki-bootstrap. Runs each vendored skill checker under ../skills/ in
// sequence for the given verb — no package.json required.
// Usage: bun .ki-meta/bin/aggregate.ts <audit|conform|init>
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const verb = process.argv[2]
if (!verb) {
  console.error('usage: aggregate.ts <audit|conform|init>')
  process.exit(2)
}
// Vendored copies are named by verb (audit.ts / lint.ts / conform.ts) — the skill dir
// already carries the identity. audit → the checker; conform → the conform script; init
// has no vendored scripts (no-op).
const pattern = verb === 'audit' ? /^(audit|lint)\\.ts$/ : verb === 'conform' ? /^conform\\.ts$/ : null
if (!pattern) process.exit(0)
const skillsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
if (!existsSync(skillsDir)) process.exit(0)
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()
let failed = 0
for (const skill of skills) {
  const dir = join(skillsDir, skill)
  const script = readdirSync(dir).find((f) => pattern.test(f))
  if (!script) continue
  const key = 'ki:' + skill.replace(/^ki-/, '') + ':' + verb
  console.log('\\n\\x1b[36m==> ' + key + '\\x1b[0m')
  try {
    execFileSync('bun', [join(dir, script), '.'], { stdio: 'inherit' })
  } catch {
    failed++
  }
}
process.exit(failed > 0 ? 1 : 0)
`

// The package.json-free entry point vendored into every target: a tiny wrapper that
// cd's to the repo root and runs the vendored aggregate. It lives under .ki-meta/bin/ so
// the whole generated surface is dot-prefixed — off the repo's own bin/ and auto-ignored
// by dotfile managers (chezmoi). Usage: ./.ki-meta/bin/ki-audit [verb].
const BIN_KI_AUDIT = `#!/usr/bin/env bash
# Vendored by ki-bootstrap — the package.json-free entry to a repo's self-check.
# Usage: ./.ki-meta/bin/ki-audit [audit|conform|init]   (default: audit)
set -euo pipefail
root="$(cd "$(dirname "\${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
exec bun ".ki-meta/bin/aggregate.ts" "\${1:-audit}"
`

function vendorSkill(target: string, skill: string, dryRun: boolean): Array<[string, string]> {
  const keys: Array<[string, string]> = []
  const checker = checkerScript(skill)
  if (!checker) return keys
  const destDir = join(target, VENDOR_DIR, 'skills', skill)
  // Vendored copies are named by verb — the skill dir already carries the identity, so
  // `audit-repo.ts` → `audit.ts`, `lint-skills.ts` → `lint.ts`, `conform-repo.ts` → `conform.ts`.
  const checkerDest = `${checker.verb}.ts`
  const relChecker = `${VENDOR_DIR}/skills/${skill}/${checkerDest}`
  if (!dryRun) {
    mkdirSync(destDir, { recursive: true })
    cpSync(join(skillDir(skill), 'scripts', checker.file), join(destDir, checkerDest))
  }
  console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${relChecker}${RESET}`)
  // Vendored checker keys are always the `:audit` verb, regardless of whether the
  // source script is audit-*.ts or lint-*.ts — so the `ki:audit` aggregate (which
  // fans out over `:audit` keys) catches every skill's checker uniformly.
  keys.push([scriptKey(skill, 'audit'), `bun ${relChecker} .`])
  const conform = conformScript(skill)
  if (conform) {
    const relConform = `${VENDOR_DIR}/skills/${skill}/conform.ts`
    if (!dryRun) cpSync(join(skillDir(skill), 'scripts', conform), join(destDir, 'conform.ts'))
    keys.push([scriptKey(skill, 'conform'), `bun ${relConform} .`])
  }
  return keys
}

function main(): void {
  const argv = process.argv.slice(2)
  // Pull `--seed <skill>` (repeatable) out first so its value is not mistaken for
  // the positional target. A per-skill delegator passes `--seed <self>`.
  const seeds: string[] = []
  const rest: string[] = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--seed' && argv[i + 1]) {
      seeds.push(argv[++i])
    } else {
      rest.push(argv[i])
    }
  }
  const positional = rest.filter((a) => !a.startsWith('--'))
  const target = resolve(positional[0] ?? '.')
  const dryRun = rest.includes('--dry-run')
  const all = rest.includes('--all')
  const mode = parseMode(rest)

  // No `package.json` is required — a repo self-governs through the vendored
  // `.ki-meta/` runner and `.ki-meta/bin/ki-audit` alone (dotfiles, KB, tap). Where a
  // package.json *does* exist we additionally splice the `ki:*` convenience keys.
  const hasPackageJson = existsSync(join(target, 'package.json'))

  const set = resolveSet(target, all, seeds)
  console.log(`${DIM}bootstrap ${target} — skills: ${set.join(', ')}${RESET}`)

  const keys: Array<[string, string]> = []
  for (const skill of set) keys.push(...vendorSkill(target, skill, dryRun))

  // Vendor the aggregate runner + the package.json-free entry point — both under
  // .ki-meta/ so the whole generated surface is dot-prefixed (off the repo's own bin/,
  // auto-ignored by chezmoi).
  const aggRel = join(VENDOR_DIR, 'bin', 'aggregate.ts')
  const binRel = join(VENDOR_DIR, 'bin', 'ki-audit')
  if (!dryRun) {
    mkdirSync(join(target, VENDOR_DIR, 'bin'), { recursive: true })
    writeFileSync(join(target, aggRel), AGGREGATE_RUNNER)
    writeFileSync(join(target, binRel), BIN_KI_AUDIT)
    chmodSync(join(target, binRel), 0o755)
  }
  console.log(`${GREEN}runner${RESET} ${DIM}→ ${aggRel}, ${binRel}${RESET}`)

  // Additive convenience: where a package.json exists, wire the repo-wide aggregate
  // keys over the same runner. Without one, `./.ki-meta/bin/ki-audit` is the entry point.
  if (hasPackageJson) {
    keys.push(['ki:audit', `bun ${aggRel} audit`])
    keys.push(['ki:conform', `bun ${aggRel} conform`])
    keys.push(['ki:init', `bun ${aggRel} init`])
    ensureScripts(target, keys, dryRun)
  }

  if (dryRun) return
  // Post-INIT passes run the vendored runner directly (not `bun run ki:*`), so they
  // work whether or not the target has a package.json. The verb is held in a variable
  // so a bare 'conform'/'audit' arg isn't mistaken for a CLI binary by static analysis.
  const postVerb = mode.postConform ? 'conform' : mode.postAudit ? 'audit' : null
  if (postVerb) {
    console.log(`${DIM}${mode.postConform ? '--legacy' : '--tracking'}: running ${postVerb}${RESET}`)
    try {
      execFileSync('bun', [aggRel, postVerb], { cwd: target, stdio: 'inherit' })
    } catch {
      /* the runner surfaces its own findings / drift */
    }
  }
}

main()
