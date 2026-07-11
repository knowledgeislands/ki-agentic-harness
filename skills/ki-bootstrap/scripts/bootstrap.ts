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
 * `audit.ts`/`conform.ts`), plus a rendered HELP snapshot (`help.md`). It then writes
 * a `.ki-meta/bin/aggregate.ts` that discovers and fans out over those copies, the
 * four `package.json`-free entry points `.ki-meta/bin/{ki-audit, ki-conform, ki-init,
 * ki-help}`, and stamps `.ki-meta/manifest.json` (harness ref + per-file hashes) so
 * `ki-init` can re-run this chain at the same ref later.
 *
 * Remote transport (ADR-KI-HARNESS-007): the sibling `bootstrap.sh` is the
 * zero-install `curl | sh` entry point — cd into the repo and pipe it to sh; it
 * fetches the source tarball and runs this engine from the extracted tree (Bun
 * cannot execute a module over HTTP, and the POSIX entry point does not assume
 * bun is even installed):
 *   curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/ki-bootstrap/scripts/bootstrap.sh | sh
 * Everything after `sh -s --` ripples through to this engine; bootstrap.sh injects
 * the cwd target and `--ref main` only when absent. Where bun is already installed,
 * the bunx form runs this engine as the package bin directly (pin a sha — bunx
 * caches floating git refs):
 *   bunx github:knowledgeislands/ki-agentic-harness#<sha> <target> --ref <sha>
 * The vendored `.ki-meta/bin/ki-init` wrapper pipes the same script at the
 * manifest's recorded ref. Skill sources are always read from the engine's own
 * working tree; `--ref` records the ref in the manifest when that tree has no
 * `.git` (a tarball extract).
 *
 * Bootstrap's one job is to build `.ki-meta/` — vendor each resolved skill's
 * mechanical unit + HELP snapshot, write the `bin/` wrappers, stamp the manifest.
 * It never touches `package.json` (the `ki:*` convenience keys are ki-engineering's
 * to wire, as sugar over these bins). Re-running it is the single idempotent way to
 * bring a target up to date — no separate legacy/tracking modes.
 *
 * Usage: bun bootstrap.ts <target-repo> [--all] [--ref <ref>] [--dry-run]
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chmodSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { resolveSet, SKILLS_ROOT, skillDir, vendorUnit } from './resolve.ts'

const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const VENDOR_DIR = '.ki-meta' // relative to the target repo root (dot-prefixed, generated-not-authored)

// The current harness ref — recorded in the manifest so `ki-init` can re-run the
// chain at the same point later. Falls back to 'unknown' when not in a git
// checkout (e.g. fetched over HTTP without a .git dir) — offline-safe, never fatal.
function harnessRef(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: SKILLS_ROOT_FOR_REF,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'] // no stderr noise from a .git-less tarball/bunx extract
    }).trim()
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
// Usage: bun .ki-meta/bin/aggregate.ts <audit|conform|init|help>
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const verb = process.argv[2]
if (!verb) {
  console.error('usage: aggregate.ts <audit|conform|init|help>')
  process.exit(2)
}
const binDir = dirname(fileURLToPath(import.meta.url))
if (verb === 'init' || verb === 'help') {
  // init: the local re-sync prompt (re-run the remote chain at the manifest's ref).
  // help: the vendored HELP snapshots. Both exec the sibling wrapper.
  execFileSync(join(binDir, verb === 'init' ? 'ki-init' : 'ki-help'), process.argv.slice(3), { stdio: 'inherit' })
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
const BIN_KI_AUDIT = `#!/bin/sh
# Vendored by ki-bootstrap — the package.json-free entry to a repo's self-check.
# Usage: ./.ki-meta/bin/ki-audit [audit|conform|init|help]   (default: audit)
set -eu
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
exec bun ".ki-meta/bin/aggregate.ts" "\${1:-audit}"
`

// The conform twin — same runner, verb pinned, so the write pass is a first-class
// entry beside ki-audit rather than an argument to it.
const BIN_KI_CONFORM = `#!/bin/sh
# Vendored by ki-bootstrap — apply the mechanical fixes across the vendored set.
# Usage: ./.ki-meta/bin/ki-conform
set -eu
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
exec bun ".ki-meta/bin/aggregate.ts" conform
`

// The vendored HELP surface: pure POSIX shell over the per-skill help.md snapshots
// the engine renders at vendor time — readable even on a machine without bun.
const BIN_KI_HELP = `#!/bin/sh
# Vendored by ki-bootstrap — each governed skill's HELP block, rendered from its
# SKILL.md at vendor time (re-synced by ki-init).
# Usage: ./.ki-meta/bin/ki-help [skill]    (no argument: list the governed skills)
set -eu
meta="$(cd "$(dirname "$0")/.." && pwd)"
if [ $# -eq 0 ]; then
  echo "governed skills (./.ki-meta/bin/ki-help <skill>):"
  for d in "$meta"/skills/*/; do
    s="$(basename "$d")"
    [ -f "$d/help.md" ] && echo "  $s"
  done
  exit 0
fi
f="$meta/skills/$1/help.md"
if [ ! -f "$f" ]; then
  echo "no help vendored for '$1'" >&2
  exit 1
fi
cat "$f"
`

// The re-bootstrap wrapper: re-runs the chain at the ref recorded in the manifest
// (ADR-KI-HARNESS-007) — `--ref <ref>` overrides to move forward. It pipes the
// sibling `bootstrap.sh` entry point at that ref through bash, so the transport
// (tarball fetch, temp-dir extract, prerequisite checks) is implemented exactly
// once. Requires a ref that ships `bootstrap.sh` — true for every ref a current
// engine can have stamped.
// Network-requiring and idempotent; never invoked automatically (only via `ki-init`
// or the aggregate's `init` verb).
function binKiInit(ref: string): string {
  return `#!/bin/sh
# Vendored by ki-bootstrap — re-runs the remote INIT chain to refresh this repo's
# vendored scripts. Usage: ./.ki-meta/bin/ki-init [--ref <ref>] [--dry-run] [--help]
set -eu
DEFAULT_REF="${ref}"
REPO="knowledgeislands/ki-agentic-harness"
ref="$DEFAULT_REF"
pass=""
while [ $# -gt 0 ]; do
  case "$1" in
    --ref) ref="$2"; shift 2 ;;
    --help|-h)
      echo "usage: ki-init [--ref <ref>] [--dry-run]"
      echo "  re-runs the remote bootstrap chain against this repo at <ref> (default: the ref recorded in .ki-meta/manifest.json, ${ref})"
      exit 0
      ;;
    *) pass="$pass $1"; shift ;;
  esac
done
root="$(cd "$(dirname "$0")/../.." && pwd)"
echo "re-bootstrapping $root from $REPO@$ref"
curl -fsSL "https://raw.githubusercontent.com/$REPO/$ref/skills/ki-bootstrap/scripts/bootstrap.sh" | sh -s -- "$root" --ref "$ref"$pass
`
}

interface VendoredFile {
  rel: string
  abs: string
}

function vendorSkill(target: string, skill: string, dryRun: boolean, manifestFiles: Record<string, string>): void {
  const audit = vendorUnit(skill, 'audit')
  if (!audit) return
  const destDir = join(target, VENDOR_DIR, 'skills', skill)
  const written: VendoredFile[] = []

  written.push(...vendorOne(destDir, 'audit', audit, dryRun))

  const conform = vendorUnit(skill, 'conform')
  if (conform) {
    written.push(...vendorOne(destDir, 'conform', conform, dryRun))
  }

  // HELP snapshot — rendered from the skill's SKILL.md at vendor time, the one
  // moment the sources are guaranteed present, so `.ki-meta/bin/ki-help` answers
  // offline in a target that has no SKILL.md files. This resolves
  // ADR-KI-HARNESS-007's former open question by rendered snapshot; drift is
  // covered by the manifest hash like every other vendored file.
  const helpAbs = join(destDir, 'help.md')
  try {
    const help = execFileSync('bun', [join(SKILLS_ROOT, '..', 'scripts', 'skill-help.ts'), skill], {
      cwd: join(SKILLS_ROOT, '..'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${VENDOR_DIR}/skills/${skill}/help.md (help snapshot)${RESET}`)
    if (!dryRun) {
      mkdirSync(destDir, { recursive: true })
      writeFileSync(helpAbs, help)
      written.push({ rel: `${VENDOR_DIR}/skills/${skill}/help.md`, abs: helpAbs })
    }
  } catch {
    console.log(`${DIM}warn: no help snapshot for ${skill} (renderer unavailable)${RESET}`)
  }

  for (const f of written) {
    if (!dryRun) manifestFiles[f.rel] = sha256File(f.abs)
  }
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
  // Pull the value-taking flags out first so their values are not mistaken for
  // the positional target: `--seed <skill>` (repeatable — a per-skill delegator
  // passes `--seed <self>`) and `--ref <ref>` (passed by `ki-init` so a tarball
  // extract with no .git still stamps the manifest with the ref it ran at).
  const seeds: string[] = []
  const rest: string[] = []
  let refOverride: string | undefined
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--seed' && argv[i + 1]) {
      seeds.push(argv[++i])
    } else if (argv[i] === '--ref' && argv[i + 1]) {
      refOverride = argv[++i]
    } else {
      rest.push(argv[i])
    }
  }
  const positional = rest.filter((a) => !a.startsWith('--'))
  const target = resolve(positional[0] ?? '.')
  const dryRun = rest.includes('--dry-run')
  const all = rest.includes('--all')

  // No `package.json` is ever required or touched — a repo self-governs through the
  // vendored `.ki-meta/` runner and its `bin/` wrappers alone (dotfiles, KB, tap, or
  // code repo alike). The `ki:*` convenience keys are ki-engineering's to wire, as
  // sugar over these same bins.
  const set = resolveSet(target, all, seeds)
  console.log(`${DIM}bootstrap ${target} — skills: ${set.join(', ')}${RESET}`)

  const manifestFiles: Record<string, string> = {}
  for (const skill of set) vendorSkill(target, skill, dryRun, manifestFiles)

  // Vendor the aggregate runner + the package.json-free entry points — both under
  // .ki-meta/ so the whole generated surface is dot-prefixed (off the repo's own bin/,
  // auto-ignored by chezmoi).
  const ref = refOverride ?? harnessRef()
  const aggRel = join(VENDOR_DIR, 'bin', 'aggregate.ts')
  const auditBinRel = join(VENDOR_DIR, 'bin', 'ki-audit')
  const conformBinRel = join(VENDOR_DIR, 'bin', 'ki-conform')
  const initBinRel = join(VENDOR_DIR, 'bin', 'ki-init')
  const helpBinRel = join(VENDOR_DIR, 'bin', 'ki-help')
  const manifestRel = join(VENDOR_DIR, 'manifest.json')
  if (!dryRun) {
    mkdirSync(join(target, VENDOR_DIR, 'bin'), { recursive: true })
    writeFileSync(join(target, aggRel), AGGREGATE_RUNNER)
    writeFileSync(join(target, auditBinRel), BIN_KI_AUDIT)
    chmodSync(join(target, auditBinRel), 0o755)
    writeFileSync(join(target, conformBinRel), BIN_KI_CONFORM)
    chmodSync(join(target, conformBinRel), 0o755)
    writeFileSync(join(target, initBinRel), binKiInit(ref))
    chmodSync(join(target, initBinRel), 0o755)
    writeFileSync(join(target, helpBinRel), BIN_KI_HELP)
    chmodSync(join(target, helpBinRel), 0o755)
    manifestFiles[aggRel] = sha256File(join(target, aggRel))
    writeFileSync(join(target, manifestRel), `${JSON.stringify({ ref, files: manifestFiles }, null, 2)}\n`)
  }
  console.log(
    `${GREEN}runner${RESET} ${DIM}→ ${aggRel}, ${auditBinRel}, ${conformBinRel}, ${initBinRel}, ${helpBinRel}, ${manifestRel}${RESET}`
  )
}

main()
