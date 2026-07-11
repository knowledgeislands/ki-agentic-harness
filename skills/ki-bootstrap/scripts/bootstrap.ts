#!/usr/bin/env bun
/**
 * ki-bootstrap chain engine — the mechanical half of INIT, and the start of the
 * bootstrap chain (ADR-KI-HARNESS-007). Brings a target repo under Knowledge
 * Islands governance so it governs itself with `./.ki-meta/bin/ki-audit` and
 * **zero skills installed** — and with **no `package.json` of its own** (dotfiles,
 * KB, tap): for every skill in the resolved set it reads the skill's declared
 * `vendors:` unit(s) (SKILL.md frontmatter — `resolve.ts#vendorUnit`; falls back to
 * filename-convention discovery with a WARN if undeclared) and vendors either a
 * *copy* of the checker file (SCRIPT-7 — copies, not symlinks) or a generated thin
 * command-wrapper into the target's `.ki-meta/skills/<skill>/` (named by verb:
 * `audit.ts`/`conform.ts`), writes a `.ki-meta/bin/aggregate.ts` that discovers and
 * fans out over those copies, drops a `.ki-meta/bin/ki-audit` wrapper — the
 * `package.json`-free entry point — and a `.ki-meta/bin/ki-init` wrapper that
 * re-runs this chain at the ref recorded in the vendoring manifest. Where the
 * target *has* a `package.json`, it additionally installs that skill's
 * `ki:<suffix>:{audit,conform}` npm keys and the repo-wide `ki:audit` /
 * `ki:conform` / `ki:init` aggregates as convenience aliases over the same runner.
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
import { createHash } from 'node:crypto'
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { ensureScripts } from './package-scripts.ts'
import { resolveSet, scriptKey, skillDir, vendorUnit } from './resolve.ts'

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

// The current harness ref — recorded in the manifest so `ki-init` can re-run the
// chain at the same point later. Falls back to 'unknown' when not in a git
// checkout (e.g. fetched over HTTP without a .git dir) — offline-safe, never fatal.
function harnessRef(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: SKILLS_ROOT_FOR_REF, encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}
const SKILLS_ROOT_FOR_REF = resolve(import.meta.dirname, '..', '..', '..')

// The aggregate runner vendored into every target — discovers the vendored checkers
// under its sibling `../skills/` dir (an allowlist: only that dir is scanned, so `bin/`
// and the report dirs are never mistaken for skills) and fans out over them for the
// given verb. It reads the filesystem, not `package.json`, so it works in a repo that
// has no `package.json` at all, and stays correct as skills are vendored in or out.
// The `init` verb is the local re-sync prompt — it execs the sibling `ki-init`
// wrapper, which re-runs the remote chain at the manifest's recorded ref
// (ADR-KI-HARNESS-007's Consequences: "INIT vendors nothing per skill... the
// aggregate init verb is instead the local re-sync prompt").
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
const binDir = dirname(fileURLToPath(import.meta.url))
if (verb === 'init') {
  // The local re-sync prompt: re-run the remote chain at the manifest's ref.
  execFileSync(join(binDir, 'ki-init'), process.argv.slice(3), { stdio: 'inherit' })
  process.exit(0)
}
// Vendored copies are named by verb (audit.ts / conform.ts) — the skill dir already
// carries the identity.
const pattern = verb === 'audit' ? /^audit\\.ts$/ : verb === 'conform' ? /^conform\\.ts$/ : null
if (!pattern) process.exit(0)
const skillsDir = join(binDir, '..', 'skills')
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

// The re-bootstrap wrapper: re-runs the remote chain one-liner at the ref recorded
// in the manifest (ADR-KI-HARNESS-007) — `--ref <ref>` overrides to move forward.
// Network-requiring and idempotent; never invoked automatically (only via `ki-init`
// or the aggregate's `init` verb).
function binKiInit(ref: string): string {
  return `#!/usr/bin/env bash
# Vendored by ki-bootstrap — re-runs the remote INIT chain to refresh this repo's
# vendored scripts. Usage: ./.ki-meta/bin/ki-init [--ref <ref>] [--help]
set -euo pipefail
DEFAULT_REF="${ref}"
REPO="knowledgeislands/ki-agentic-harness"
ref="$DEFAULT_REF"
while [ $# -gt 0 ]; do
  case "$1" in
    --ref) ref="$2"; shift 2 ;;
    --help|-h)
      echo "usage: ki-init [--ref <ref>]"
      echo "  re-runs the remote bootstrap chain against this repo at <ref> (default: the ref recorded in .ki-meta/manifest.json, ${ref})"
      exit 0
      ;;
    *) shift ;;
  esac
done
root="$(cd "$(dirname "\${BASH_SOURCE[0]}")/../.." && pwd)"
url="https://raw.githubusercontent.com/$REPO/$ref/skills/ki-bootstrap/scripts/bootstrap.ts"
echo "re-bootstrapping $root from $url"
exec bun run "$url" "$root"
`
}

interface VendoredFile {
  rel: string
  abs: string
}

function vendorSkill(target: string, skill: string, dryRun: boolean, manifestFiles: Record<string, string>): Array<[string, string]> {
  const keys: Array<[string, string]> = []
  const audit = vendorUnit(skill, 'audit')
  if (!audit) return keys
  const destDir = join(target, VENDOR_DIR, 'skills', skill)
  const written: VendoredFile[] = []

  written.push(...vendorOne(destDir, 'audit', audit, dryRun))
  keys.push([scriptKey(skill, 'audit'), `bun ${VENDOR_DIR}/skills/${skill}/audit.ts .`])

  const conform = vendorUnit(skill, 'conform')
  if (conform) {
    written.push(...vendorOne(destDir, 'conform', conform, dryRun))
    keys.push([scriptKey(skill, 'conform'), `bun ${VENDOR_DIR}/skills/${skill}/conform.ts .`])
  }

  for (const f of written) {
    if (!dryRun) manifestFiles[f.rel] = sha256File(f.abs)
  }
  return keys
}

// Vendors one declared unit: a checker FILE is copied as-is; a COMMAND is wrapped
// in a thin generated script so it runs with no package.json in the target
// (ADR-KI-HARNESS-007 — "even a skill whose mechanical gate is a shared command...
// yields a unit runnable in a non-engineering, no-package.json repo").
function vendorOne(
  destDir: string,
  verb: 'audit' | 'conform',
  unit: { kind: 'file'; path: string } | { kind: 'command'; command: string },
  dryRun: boolean
): VendoredFile[] {
  const destFile = `${verb}.ts`
  const rel = `${VENDOR_DIR}/skills/${destDir.split('/').pop()}/${destFile}`
  const abs = join(destDir, destFile)
  if (unit.kind === 'file') {
    const skill = destDir.split('/').pop() as string
    console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${rel} (file)${RESET}`)
    if (!dryRun) {
      mkdirSync(destDir, { recursive: true })
      cpSync(join(skillDir(skill), unit.path), abs)
    }
  } else {
    const skill = destDir.split('/').pop() as string
    console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${rel} (command wrapper)${RESET}`)
    if (!dryRun) {
      mkdirSync(destDir, { recursive: true })
      writeFileSync(abs, commandWrapper(unit.command))
    }
  }
  return [{ rel, abs }]
}

// A generated command wrapper — no package.json required. Runs the declared
// command with the target repo (arg 1, defaulting to '.') as cwd.
function commandWrapper(command: string): string {
  return `#!/usr/bin/env bun
// Generated by ki-bootstrap from a \`vendors:\` command declaration. Do not edit —
// re-run INIT to regenerate.
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const target = resolve(process.argv[2] ?? '.')
try {
  execFileSync('bash', ['-c', ${JSON.stringify('COMMAND_PLACEHOLDER')}], { cwd: target, stdio: 'inherit' })
} catch (err) {
  process.exit((err as { status?: number }).status ?? 1)
}
`.replace('COMMAND_PLACEHOLDER', command.replace(/\\/g, '\\\\').replace(/"/g, '\\"'))
}

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
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
  const manifestFiles: Record<string, string> = {}
  for (const skill of set) keys.push(...vendorSkill(target, skill, dryRun, manifestFiles))

  // Vendor the aggregate runner + the package.json-free entry points — both under
  // .ki-meta/ so the whole generated surface is dot-prefixed (off the repo's own bin/,
  // auto-ignored by chezmoi).
  const ref = harnessRef()
  const aggRel = join(VENDOR_DIR, 'bin', 'aggregate.ts')
  const auditBinRel = join(VENDOR_DIR, 'bin', 'ki-audit')
  const initBinRel = join(VENDOR_DIR, 'bin', 'ki-init')
  const manifestRel = join(VENDOR_DIR, 'manifest.json')
  if (!dryRun) {
    mkdirSync(join(target, VENDOR_DIR, 'bin'), { recursive: true })
    writeFileSync(join(target, aggRel), AGGREGATE_RUNNER)
    writeFileSync(join(target, auditBinRel), BIN_KI_AUDIT)
    chmodSync(join(target, auditBinRel), 0o755)
    writeFileSync(join(target, initBinRel), binKiInit(ref))
    chmodSync(join(target, initBinRel), 0o755)
    manifestFiles[aggRel] = sha256File(join(target, aggRel))
    writeFileSync(join(target, manifestRel), `${JSON.stringify({ ref, files: manifestFiles }, null, 2)}\n`)
  }
  console.log(`${GREEN}runner${RESET} ${DIM}→ ${aggRel}, ${auditBinRel}, ${initBinRel}, ${manifestRel}${RESET}`)

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
  // CONFORM here fans out over each skill's own vendored `conform.ts` — it never
  // re-syncs the vendored *copies themselves* (that would be circular: in a
  // bootstrapped-only repo the local copies are the only source present). Re-syncing
  // the copies is `ki-init`'s job, surfaced as an advisory by the repo standard's
  // integrity checker when they've drifted from the manifest.
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
