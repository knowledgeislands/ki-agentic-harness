#!/usr/bin/env bun
/**
 * ki-bootstrap chain engine — the mechanical half of INIT, and the start of the
 * bootstrap chain (ADR-KI-HARNESS-006). Brings a target repo under Knowledge
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
 * Remote transport (ADR-KI-HARNESS-006): the sibling `bootstrap.sh` is the
 * zero-install `curl | sh` entry point — cd into the repo and pipe it to sh; it
 * fetches the source tarball and runs this engine from the extracted tree (Bun
 * cannot execute a module over HTTP, and the POSIX entry point does not assume
 * bun is even installed):
 *   curl -fsSL https://raw.githubusercontent.com/knowledgeislands/ki-agentic-harness/main/skills/keystone/ki-bootstrap/scripts/bootstrap.sh | sh
 * Everything after `sh -s --` ripples through to this engine; bootstrap.sh injects
 * the cwd target and `--ref main` only when absent. Where bun is already installed,
 * the bunx form runs this engine as the package bin directly (pin a sha — bunx
 * caches floating git refs):
 *   bunx github:knowledgeislands/ki-agentic-harness#<sha> <target> --ref <sha>
 * The vendored `.ki-meta/bin/ki-init` wrapper pipes the same script at `main` by
 * default (or the `--ref` passed). Skill sources are always read from the engine's
 * own working tree; `--ref` supplies the ref when that tree has no `.git` (a tarball
 * extract), and the engine resolves it to a concrete SHA before recording it in the
 * manifest.
 *
 * Bootstrap's one job is to build `.ki-meta/` — vendor each resolved skill's
 * mechanical unit + HELP snapshot, write the `bin/` wrappers, stamp the manifest.
 * It never touches `package.json` (the `ki:*` convenience keys are ki-engineering's
 * to wire, as sugar over these bins). Re-running it is the single idempotent way to
 * bring a target up to date — no separate legacy/tracking modes.
 *
 * Harness-shaped targets only: when the resolved set includes `ki-harness` (the
 * target authors and operates its own skills/ tree), the engine additionally
 * vendors the three cross-skill operational scripts (skill-graph, skill-help,
 * sync-skills) into `.ki-meta/bin/`, each manifest-hashed like every other vendored
 * file. These are engine-level, not per-skill `vendors:` units — the same class as
 * the aggregate runner and bin wrappers (ADR-KI-HARNESS-008). A non-harness repo
 * has no skills/ tree to operate on and never receives them.
 *
 * Usage: bun bootstrap.ts <target-repo> [--seed <skill>] [--ref <ref>] [--dry-run]
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chmodSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { resolveSet, SKILLS_ROOT, SkillResolutionError, skillDir, vendorModesOf, vendorUnit } from './resolve.ts'

const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const VENDOR_DIR = '.ki-meta' // relative to the target repo root (dot-prefixed, generated-not-authored)
const REPO_SLUG = 'knowledgeislands/ki-agentic-harness'

// Cross-skill operational scripts a harness-shaped target needs to run its own
// skills/ tree: validate/render the `implies:` graph, render HELP, install skills.
// Vendored into .ki-meta/bin/ ONLY when the resolved set includes ki-harness —
// engine-level, not per-skill `vendors:` units (ADR-KI-HARNESS-008). Their
// canonical home is skills/keystone/ki-bootstrap/scripts/.
const HARNESS_BIN_SCRIPTS = ['skill-graph.ts', 'skill-help.ts', 'sync-skills.ts'] as const

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
const SKILLS_ROOT_FOR_REF = resolve(import.meta.dirname, '..', '..', '..', '..')

// Resolve a possibly-symbolic ref (a branch like `main`, a tag, a short SHA) to the
// concrete 40-hex commit SHA, so the manifest always records an immutable point even
// when the chain was invoked with `--ref main`. This is the record/policy split:
// `ki-init` defaults its *policy* to the moving `main` (always fetch latest), while the
// manifest keeps an exact *record* of what was actually applied. Best-effort: a full
// SHA passes through untouched, and any failure (git absent, offline) falls back to the
// ref as given — offline-safe, never fatal, matching harnessRef().
function resolveRef(ref: string): string {
  if (/^[0-9a-f]{40}$/.test(ref) || ref === 'unknown') return ref
  try {
    const out = execFileSync('git', ['ls-remote', `https://github.com/${REPO_SLUG}.git`, ref], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    const sha = out.split('\n')[0]?.split('\t')[0]?.trim()
    return sha && /^[0-9a-f]{40}$/.test(sha) ? sha : ref
  } catch {
    return ref
  }
}

// The aggregate runner vendored into every target — discovers the vendored checkers
// under its sibling `../skills/` dir (an allowlist: only that dir is scanned, so `bin/`
// and the report dirs are never mistaken for skills) and fans out over them for the
// given verb. It reads the filesystem, not `package.json`, so it works in a repo that
// has no `package.json` at all, and stays correct as skills are vendored in or out.
// The `init` verb is the local re-sync prompt — it execs the sibling `ki-init`
// wrapper, which re-runs the remote chain at `main` (or a passed `--ref`)
// (ADR-KI-HARNESS-006's Consequences: "INIT vendors nothing per skill... the
// aggregate init verb is instead the local re-sync prompt").
const AGGREGATE_RUNNER = `#!/usr/bin/env bun
// Vendored by ki-bootstrap. Runs each vendored skill checker under ../skills/ in
// sequence for the given verb — no package.json required.
// Usage: bun .ki-meta/bin/aggregate.ts <audit|conform|init|help>
import { execFileSync, spawnSync } from 'node:child_process'
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
if (verb === 'refresh') {
  // REFRESH's write target is always a skill's own canonical files under skills/<name>/
  // in ki-agentic-harness — this vendored runner is by construction never running
  // there, so refresh is always out of scope here. Say so explicitly instead of
  // silently falling through the pattern match below to a bare exit(0).
  console.error(
    '\\x1b[33m⚠️  REFRESH is harness-only\\x1b[0m — it edits only its own canonical\\n' +
      "files, which live in ki-agentic-harness. Run it there, or use ki-kb's\\n" +
      'IMPROVE mode for a pattern recurring across bases.'
  )
  process.exit(3)
}
// Vendored copies are named by verb (audit.ts / conform.ts) — the skill dir already
// carries the identity.
const pattern = verb === 'audit' ? /^(audit|lint)\\.ts$/ : verb === 'conform' ? /^conform\\.ts$/ : null
if (!pattern) process.exit(0)
const skillsDir = join(binDir, '..', 'skills')
if (!existsSync(skillsDir)) process.exit(0)
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

// Unified severity ladder — most audit-*.ts/lint-*.ts checkers normalize findings to
// { level, area, msg } and, under --json, wrap them as
// { concern, target, generatedAt, summary, findings }. A couple of outliers (e.g.
// ki-housekeeping) emit a bare findings array with { id, severity: <0-6>, message }
// instead — SEV_BY_NUM and the field fallbacks below absorb that variant too.
// Every icon must occupy two display columns so the level column aligns. Most are
// Emoji_Presentation=Yes glyphs (genuinely 2 cols everywhere); ⚠️/ℹ️ have narrow base
// chars that VS16 does NOT widen under wcwidth-style terminals (VS Code/xterm.js counts
// them 1 col), so they carry an explicit trailing space to make up the second column.
// NA uses 🚫 (a 2-col circle-slash) in place of the 1-col ⊘.
const ICON = { FAIL: '\\u274c', WARN: '\\u26a0\\ufe0f ', POLISH: '\\u2728', ADVISORY: '\\ud83e\\udded', INFO: '\\u2139\\ufe0f ', NA: '\\ud83d\\udeab', PASS: '\\u2705' }
const SEV_BY_NUM = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'NA', 'PASS']
// The recap splits real violations (FAIL/WARN/POLISH — the checker decided a criterion
// is broken) from ADVISORY (always-on judgment reminders the checker cannot decide). A
// genuine failure must never be buried under the unconditional reminders.
const FAILURE_LEVELS = ['FAIL', 'WARN', 'POLISH']
const RECAP_LEVELS = ['FAIL', 'WARN', 'POLISH', 'ADVISORY']
const verbed = verb === 'conform' ? 'conformed' : 'audited'
// Render one finding row: icon status [code] file msg (ref). file/ref shown only when
// the finding carries them (structured fields — most checkers only populate them once
// swept). full=false trims msg to its first line (recap rows stay one-line).
// Fixed-width short level tags (fail/warn/pol/adv/info/na/pass) keep the [code] column
// aligned at a tight 4-wide field — without them "advisory" would force an 8-wide pad.
// Icons are each two display columns (sub-width glyphs ⊘/⚠️/ℹ️ carry a trailing space),
// so [code] lands in a constant column across both body and recap rows.
const SHORT = { FAIL: 'fail', WARN: 'warn', POLISH: 'pol', ADVISORY: 'adv', INFO: 'info', NA: 'na', PASS: 'pass' }
const findingLine = (icon, level, code, file, msg, ref, skill, full) =>
  '  ' + icon + ' ' + (SHORT[level] || level.toLowerCase()).padEnd(4) +
  (skill ? ' ' + skill.padEnd(20) : '') +
  ' \\x1b[2m[' + code + ']\\x1b[0m' +
  (file ? ' \\x1b[36m' + file + '\\x1b[0m' : '') +
  ' ' + (full ? msg : String(msg).split('\\n')[0]) +
  (ref ? ' \\x1b[2m(' + ref + ')\\x1b[0m' : '')
let failed = 0
const recap = []
const unstructured = []
const extraArgs = process.argv.slice(3).filter((a) => a !== '--json')
for (const skill of skills) {
  const dir = join(skillsDir, skill)
  const script = readdirSync(dir).find((f) => pattern.test(f))
  if (!script) continue
  const key = 'ki:' + skill.replace(/^ki-/, '') + ':' + verb
  console.log('\\n\\x1b[36m==> ' + key + '\\x1b[0m')
  const scriptPath = join(dir, script)
  // Both verbs render through the same structured path: run --json, parse the wrapper,
  // render uniform rows, accumulate the recap. A checker (still) without --json support
  // falls back to its native display. For conform this means --json also drives the
  // writes (a conform without --json just runs its normal write pass and streams prose).
  // Flags after the verb (e.g. --dry-run) forward through to every child script —
  // conform's write pass must be skippable aggregate-wide, not just per-skill.
  const res = spawnSync('bun', [scriptPath, '.', ...extraArgs, '--json'], { encoding: 'utf8' })
  let parsed = null
  try {
    parsed = JSON.parse(res.stdout ?? '')
  } catch {
    parsed = null
  }
  const findingsArr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.findings) ? parsed.findings : null
  if (!findingsArr) {
    // no --json support (or a crash, or a shape we don't recognise) — fall back to
    // this checker's native display.
    process.stdout.write(res.stdout ?? '')
    process.stderr.write(res.stderr ?? '')
    unstructured.push(skill)
  } else {
    const counts = {}
    for (const raw of findingsArr) {
      const level =
        typeof raw.level === 'string'
          ? raw.level.toUpperCase()
          : typeof raw.severity === 'number'
            ? SEV_BY_NUM[raw.severity] ?? 'INFO'
            : typeof raw.severity === 'string'
              ? raw.severity.toUpperCase()
              : 'INFO'
      const area = String(raw.area ?? raw.criterion ?? raw.check ?? raw.id ?? '?')
      const msg = String(raw.msg ?? raw.message ?? '')
      const ref = raw.ref ? String(raw.ref) : ''
      const file = raw.file ? String(raw.file) : ''
      const icon = ICON[level] ?? ''
      console.log(findingLine(icon, level, area, file, msg, ref, '', true))
      counts[level] = (counts[level] ?? 0) + 1
      if (RECAP_LEVELS.includes(level)) recap.push({ skill, level, code: area, msg, ref, file })
    }
    const wrapperSummary = !Array.isArray(parsed) ? parsed?.summary : null
    const s = wrapperSummary ?? {
      fail: counts.FAIL ?? 0,
      warn: counts.WARN ?? 0,
      polish: counts.POLISH ?? 0,
      pass: counts.PASS ?? 0,
      advisory: counts.ADVISORY ?? 0,
      na: counts.NA ?? 0
    }
    // Icon prefixes the label; the KEY=n tokens stay byte-identical so CHK-005 parses.
    const sicon = (s.fail ?? 0) ? ICON.FAIL : (s.warn ?? 0) ? ICON.WARN : (s.polish ?? 0) ? ICON.POLISH : (s.advisory ?? 0) ? ICON.ADVISORY : ICON.PASS
    console.log(
      '  ' + sicon + ' \\x1b[2msummary: FAIL=' +
        (s.fail ?? 0) +
        ' WARN=' +
        (s.warn ?? 0) +
        ' POLISH=' +
        (s.polish ?? 0) +
        ' PASS=' +
        (s.pass ?? 0) +
        ' ADVISORY=' +
        (s.advisory ?? 0) +
        ' NA=' +
        (s.na ?? 0) +
        '\\x1b[0m'
    )
  }
  if ((res.status ?? 0) !== 0) failed++
}
console.log('\\n\\x1b[36m==> recap\\x1b[0m')
const fails = recap.filter((r) => FAILURE_LEVELS.includes(r.level))
const reminders = recap.filter((r) => r.level === 'ADVISORY')
if (fails.length === 0) {
  console.log('  \\x1b[32m\\u2705 no FAIL / WARN / POLISH across ' + verbed + ' skills\\x1b[0m')
} else {
  console.log('  \\x1b[1mfailures & warnings\\x1b[0m')
  for (const level of FAILURE_LEVELS)
    for (const h of fails.filter((r) => r.level === level))
      console.log(findingLine(ICON[level], level, h.code, h.file, h.msg, h.ref, h.skill, false))
}
if (reminders.length) {
  console.log('  \\x1b[1mjudgment reminders (always on — read & assess)\\x1b[0m')
  for (const h of reminders) console.log(findingLine(ICON.ADVISORY, 'ADVISORY', h.code, h.file, h.msg, h.ref, h.skill, false))
}
const count = (l) => recap.filter((r) => r.level === l).length
const ticon = count('FAIL') ? ICON.FAIL : count('WARN') ? ICON.WARN : count('POLISH') ? ICON.POLISH : ICON.PASS
console.log(
  '  ' + ticon + ' \\x1b[2mtotals: FAIL=' + count('FAIL') + ' WARN=' + count('WARN') + ' POLISH=' + count('POLISH') + ' ADVISORY=' + count('ADVISORY') + '\\x1b[0m'
)
if (unstructured.length) {
  console.log('  \\x1b[2m(no structured output — see native output above for: ' + unstructured.join(', ') + ')\\x1b[0m')
}
process.exit(failed > 0 ? 1 : 0)
`

// The package.json-free entry point vendored into every target: a tiny wrapper that
// cd's to the repo root and runs the vendored aggregate. It lives under .ki-meta/bin/ so
// the whole generated surface is dot-prefixed — off the repo's own bin/ and auto-ignored
// by dotfile managers (chezmoi). Usage: ./.ki-meta/bin/ki-audit [verb].
const BIN_KI_AUDIT = `#!/bin/sh
# Vendored by ki-bootstrap — the package.json-free entry to a repo's self-check.
# Usage: ./.ki-meta/bin/ki-audit [audit|conform|init|help] [--dry-run ...]   (default verb: audit)
set -eu
case "\${1:-}" in
  -h|--help)
    echo "usage: ki-audit [audit|conform|init|help] [--dry-run ...]   (default verb: audit)"
    echo "  runs each vendored skill checker under .ki-meta/skills/ for the given verb."
    echo "  audit    read-only self-check (the default verb)"
    echo "  conform  apply the mechanical fixes (same as ./.ki-meta/bin/ki-conform)"
    echo "  init     re-sync the vendored scripts from the harness (same as ./.ki-meta/bin/ki-init)"
    echo "  help     list governed skills, or show one skill's HELP (same as ./.ki-meta/bin/ki-help)"
    exit 0
    ;;
esac
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
verb="\${1:-audit}"
[ $# -gt 0 ] && shift
exec bun ".ki-meta/bin/aggregate.ts" "$verb" "$@"
`

// The conform twin — same runner, verb pinned, so the write pass is a first-class
// entry beside ki-audit rather than an argument to it. Flags (e.g. --dry-run) still
// forward through — the verb is pinned, not the whole argument list.
const BIN_KI_CONFORM = `#!/bin/sh
# Vendored by ki-bootstrap — apply the mechanical fixes across the vendored set.
# Usage: ./.ki-meta/bin/ki-conform [--dry-run]
set -eu
case "\${1:-}" in
  -h|--help)
    echo "usage: ki-conform [--dry-run]"
    echo "  applies each vendored skill's mechanical fixes across .ki-meta/skills/."
    echo "  --dry-run  report what would change without writing."
    exit 0
    ;;
esac
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
exec bun ".ki-meta/bin/aggregate.ts" conform "$@"
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

// The re-bootstrap wrapper: bare, it re-runs the chain at `main` — always pulling the
// latest harness — while `--ref <ref>` pins to a specific commit/tag. It pipes the
// sibling `bootstrap.sh` entry point at that ref through bash, so the transport
// (tarball fetch, temp-dir extract, prerequisite checks) is implemented exactly once.
// Requires a ref that ships `bootstrap.sh` — true for every ref a current engine can
// have stamped. The exact commit last applied is not baked in here (it would just
// duplicate — and drift from — the manifest): `.ki-meta/manifest.json` is the sole
// record of what was applied, and the engine resolves whatever ref ran to a concrete
// SHA before writing it there (see resolveRef).
// Network-requiring and idempotent; never invoked automatically (only via `ki-init`
// or the aggregate's `init` verb).
function binKiInit(): string {
  return `#!/bin/sh
# Vendored by ki-bootstrap — re-runs the remote INIT chain to refresh this repo's
# vendored scripts. Usage: ./.ki-meta/bin/ki-init [--ref <ref>] [--dry-run] [--help]
set -eu
DEFAULT_REF="main"
REPO="knowledgeislands/ki-agentic-harness"
ref="$DEFAULT_REF"
pass=""
while [ $# -gt 0 ]; do
  case "$1" in
    --ref) ref="$2"; shift 2 ;;
    --help|-h)
      echo "usage: ki-init [--ref <ref>] [--dry-run]"
      echo "  re-runs the remote bootstrap chain against this repo at <ref> (default: main — the latest harness)."
      echo "  the exact commit last applied is recorded in .ki-meta/manifest.json."
      exit 0
      ;;
    *) pass="$pass $1"; shift ;;
  esac
done
root="$(cd "$(dirname "$0")/../.." && pwd)"
echo "re-bootstrapping $root from $REPO@$ref"
curl -fsSL "https://raw.githubusercontent.com/$REPO/$ref/skills/keystone/ki-bootstrap/scripts/bootstrap.sh" | sh -s -- "$root" --ref "$ref"$pass
`
}

interface VendoredFile {
  rel: string
  abs: string
}

// The universal modes that vendor a COPIED per-skill script. `init` is NOT here: its
// per-skill `scripts/init.ts` is a harness-relative seed delegator (it resolves the
// engine via ../../ki-bootstrap) so a verbatim copy into a target's .ki-meta would be
// a broken path — INIT is instead the aggregate `ki:init` re-sync (ADR-KI-HARNESS-007).
// `help` renders a snapshot below; `refresh` is harness-only and never vendored.
const SCRIPT_MODES = ['audit', 'conform'] as const

function vendorSkill(target: string, skill: string, dryRun: boolean, manifestFiles: Record<string, string>): void {
  const declared = vendorModesOf(skill)
  // Which script modes to copy: the skill's declared list ∩ {audit, conform}, or — for
  // a skill still on filename-convention discovery (no `vendors:`) — both, as before.
  const scriptModes = SCRIPT_MODES.filter((m) => !declared || declared.includes(m))
  const destDir = join(target, VENDOR_DIR, 'skills', skill)
  const written: VendoredFile[] = []

  for (const mode of scriptModes) {
    const unit = vendorUnit(skill, mode)
    if (unit) written.push(...vendorOne(destDir, mode, unit, dryRun))
  }
  // Nothing vendored (no audit/conform resolvable) — skip the skill entirely, matching
  // the old `if (!audit) return` guard so bare non-governance dirs are ignored.
  if (written.length === 0) return

  // HELP snapshot — rendered from the skill's SKILL.md at vendor time, the one
  // moment the sources are guaranteed present, so `.ki-meta/bin/ki-help` answers
  // offline in a target that has no SKILL.md files. This resolves
  // ADR-KI-HARNESS-006's former open question by rendered snapshot; drift is
  // covered by the manifest hash like every other vendored file.
  const helpAbs = join(destDir, 'help.md')
  try {
    const help = execFileSync('bun', [join(skillDir('ki-bootstrap'), 'scripts', 'skill-help.ts'), skill], {
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
// (ADR-KI-HARNESS-006 — "even a skill whose mechanical gate is a shared command...
// yields a unit runnable in a non-engineering, no-package.json repo").
function vendorOne(
  destDir: string,
  mode: 'audit' | 'conform',
  unit: { kind: 'file'; path: string } | { kind: 'command'; command: string },
  dryRun: boolean
): VendoredFile[] {
  const destFile = `${mode}.ts`
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

function scaffoldRepoConfig(target: string, dryRun: boolean): void {
  const repoInit = join(skillDir('ki-repo'), 'scripts', 'init.ts')
  try {
    execFileSync('bun', [repoInit, target, '--scaffold-config-only', ...(dryRun ? ['--dry-run'] : [])], { stdio: 'inherit' })
  } catch (error) {
    process.exit((error as { status?: number }).status ?? 1)
  }
}

function resolvedSetOrExit(target: string, seeds: string[]): string[] {
  try {
    return resolveSet(target, false, seeds)
  } catch (error) {
    if (!(error instanceof SkillResolutionError)) throw error
    console.error(`${'\x1b[31m'}FAIL${RESET}  [BOOT-9] ${error.message} — reconcile .ki-config.toml or the explicit --seed value`)
    process.exit(1)
  }
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

  // No `package.json` is ever required or touched — a repo self-governs through the
  // vendored `.ki-meta/` runner and its `bin/` wrappers alone (dotfiles, KB, tap, or
  // code repo alike). The `ki:*` convenience keys are ki-engineering's to wire, as
  // sugar over these same bins. Vendoring is always coverage-scoped (`.ki-config.toml`
  // + baseline + implies + explicit --seed) — `--all` is a linking concept only, never a
  // vendoring one (ADR-KI-HARNESS-007).
  let set = resolvedSetOrExit(target, seeds)

  // ki-repo owns the file-level contract and foundation-marker scaffold. Once
  // initial resolution proves every declared/seeded root valid, compose that leg
  // before any .ki-meta mutation, then re-resolve against the converged config.
  // Bare bootstrap with no config/seed resolves no ki-repo and remains empty-set.
  if (set.includes('ki-repo')) {
    scaffoldRepoConfig(target, dryRun)
    set = resolvedSetOrExit(target, seeds)
  }
  console.log(`${DIM}bootstrap ${target} — skills: ${set.join(', ')}${RESET}`)

  const manifestFiles: Record<string, string> = {}
  for (const skill of set) vendorSkill(target, skill, dryRun, manifestFiles)

  // Vendor the aggregate runner + the package.json-free entry points — both under
  // .ki-meta/ so the whole generated surface is dot-prefixed (off the repo's own bin/,
  // auto-ignored by chezmoi).
  const ref = resolveRef(refOverride ?? harnessRef())
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
    writeFileSync(join(target, initBinRel), binKiInit())
    chmodSync(join(target, initBinRel), 0o755)
    writeFileSync(join(target, helpBinRel), BIN_KI_HELP)
    chmodSync(join(target, helpBinRel), 0o755)
    manifestFiles[aggRel] = sha256File(join(target, aggRel))
    // Harness-shaped targets additionally get the cross-skill scripts that operate
    // on the whole skills/ tree — engine-level, manifest-hashed like every vendored
    // file, gated on ki-harness membership (ADR-KI-HARNESS-008).
    if (set.includes('ki-harness')) {
      for (const name of HARNESS_BIN_SCRIPTS) {
        const rel = join(VENDOR_DIR, 'bin', name)
        cpSync(join(skillDir('ki-bootstrap'), 'scripts', name), join(target, rel))
        manifestFiles[rel] = sha256File(join(target, rel))
      }
      console.log(`${GREEN}bin${RESET} ${DIM}→ ${VENDOR_DIR}/bin/{${HARNESS_BIN_SCRIPTS.join(', ')}} (harness cross-skill scripts)${RESET}`)
    }
    writeFileSync(join(target, manifestRel), `${JSON.stringify({ ref, files: manifestFiles }, null, 2)}\n`)
  }
  console.log(
    `${GREEN}runner${RESET} ${DIM}→ ${aggRel}, ${auditBinRel}, ${conformBinRel}, ${initBinRel}, ${helpBinRel}, ${manifestRel}${RESET}`
  )
}

main()
