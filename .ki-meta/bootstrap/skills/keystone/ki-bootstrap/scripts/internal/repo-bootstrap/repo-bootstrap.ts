#!/usr/bin/env bun
/**
 * ki-bootstrap chain engine — the mechanical half of EDUCATE, and the start of the
 * bootstrap chain (ADR-KI-HARNESS-006). Brings a target repo under Knowledge
 * Islands governance so it governs itself with `./.ki-meta/bin/ki-audit` and
 * **zero skills installed** — and with **no `package.json` of its own** (dotfiles,
 * KB, tap): for every skill in the resolved set it reads the skill's declared
 * `ki-vendors:` unit(s) (SKILL.md frontmatter — `resolve.ts#vendorUnit`; falls back to
 * filename-convention discovery with a WARN if undeclared) and vendors either a
 * *copy* of the checker file (SCRIPT-7 — copies, not symlinks) or a generated thin
 * command-wrapper into the target's `.ki-meta/checkers/<skill>/` (named by verb:
 * `audit.ts`/`conform.ts`), plus a rendered HELP snapshot (`help.md`). It then writes
 * a `.ki-meta/bin/aggregate.ts` that discovers and fans out over those copies, the
 * four `package.json`-free entry points `.ki-meta/bin/{ki-audit, ki-conform, ki-educate,
 * ki-help}`, and stamps `.ki-meta/manifest.json` (harness ref + per-file hashes) so
 * `ki-educate` can re-run this chain at the same ref later.
 *
 * Remote transport (ADR-KI-HARNESS-006): the public `repo-bootstrap.sh` is the
 * zero-install `curl | sh` entry point — cd into the repo and pipe it to sh; it
 * fetches the source tarball and runs this engine from the extracted tree (Bun
 * cannot execute a module over HTTP, and the POSIX entry point does not assume
 * bun is even installed):
 *   curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh
 * Everything after `sh -s --` ripples through to this engine; repo-bootstrap.sh injects
 * the cwd target and `--ref main` only when absent. Where bun is already installed,
 * the bunx form runs this engine as the package bin directly (pin a sha — bunx
 * caches floating git refs):
 *   bunx github:knowledgeislands/ki-agentic-harness#<sha> <target> --ref <sha>
 * The public route is the only code path that acquires source. The vendored
 * `.ki-meta/bin/ki-educate` wrapper subsequently runs a retained local engine and
 * catalogue; it never downloads a newer revision. Skill sources are read from the
 * engine's own working tree; `--ref` supplies the ref when that tree has no `.git`
 * (a tarball extract), and the engine resolves it to a concrete SHA before recording
 * it in the manifest.
 *
 * Bootstrap's one job is to build `.ki-meta/` — vendor each resolved skill's
 * mechanical unit + HELP snapshot, write the `bin/` wrappers, stamp the manifest.
 * It never touches `package.json` (the `ki:*` convenience keys are ki-engineering's
 * to wire, as sugar over these bins). Re-running it is the single idempotent way to
 * bring a target up to date — no separate legacy/tracking modes.
 *
 * Harness-shaped targets only: when the resolved set includes `ki-harness` (the
 * target authors and operates its own skills/ tree), the engine additionally
 * vendors the two cross-skill operational scripts (skill-graph, skill-help)
 * into `.ki-meta/bin/`, each manifest-hashed like every other vendored
 * file. These are engine-level, not per-skill `ki-vendors:` units — the same class as
 * the aggregate runner and bin wrappers (ADR-KI-HARNESS-008). A non-harness repo
 * has no skills/ tree to operate on and never receives them.
 *
 * Usage: bun repo-bootstrap.ts <target-repo> [--seed <skill>] [--ref <ref>] [--dry-run] [--verbose]
 */

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmodSync,
  closeSync,
  cpSync,
  existsSync,
  fstatSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
  rmSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { educatorLauncher } from '../../shared/educator.ts'
import {
  assertExplicitDependencies,
  DependencyDeclarationError,
  dependsOnOf,
  resolveSet,
  type SharedModule,
  type SharedModulePayload,
  SKILLS_ROOT,
  SkillResolutionError,
  sharedDependenciesOf,
  sharedModulePayload,
  sharedModulesOf,
  skillDir,
  VENDOR_MODES,
  vendorModesOf,
  vendorUnit
} from './resolve.ts'

const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

const VENDOR_DIR = '.ki-meta' // relative to the target repo root (dot-prefixed, generated-not-authored)
const CHECKERS_DIR = 'checkers'
const EDUCATORS_DIR = 'educators'
const BOOTSTRAP_DIR = 'bootstrap'
const RETIRED_CHECKERS_DIR = 'skills'
const REPO_SLUG = 'knowledgeislands/ki-agentic-harness'

// Cross-skill operational scripts a harness-shaped target needs to run its own
// skills/ tree: validate/render the `ki-depends-on:` graph, render HELP, install skills.
// Vendored into .ki-meta/bin/ ONLY when the resolved set includes ki-harness —
// engine-level, not per-skill `ki-vendors:` units (ADR-KI-HARNESS-008). Their
// canonical home is skills/keystone/ki-bootstrap/scripts/.
const HARNESS_BIN_SCRIPTS = ['skill-graph.ts', 'skill-help.ts'] as const

// The current harness ref — recorded in the manifest so `ki-educate` can re-run the
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
const SKILLS_ROOT_FOR_REF = resolve(import.meta.dirname, '..', '..', '..', '..', '..', '..')

// Resolve a possibly-symbolic ref (a branch like `main`, a tag, a short SHA) to the
// concrete 40-hex commit SHA, so the manifest always records an immutable point even
// when the chain was invoked with `--ref main`. This is the record/policy split:
// `ki-educate` defaults its *policy* to the moving `main` (always fetch latest), while the
// manifest keeps an exact *record* of what was actually applied. Best-effort: a full
// SHA passes through untouched, and any failure (git absent, offline) falls back to the
// ref as given — offline-safe, never fatal, matching harnessRef().
function resolveRef(ref: string): string {
  if (process.env.KI_BOOTSTRAP_OFFLINE === '1') return ref
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
// under its sibling `../checkers/` dir (an allowlist: only that dir is scanned, so `bin/`
// and the report dirs are never mistaken for skills) and fans out over them for the
// given verb. It reads the filesystem, not `package.json`, so it works in a repo that
// has no `package.json` at all, and stays correct as skills are vendored in or out.
// The `educate` verb delegates to the sibling `ki-educate` wrapper. With no selected
// skill that is the whole-set re-bootstrap; with a skill it dispatches that skill's
// local educator payload under ../educators/.
const AGGREGATE_RUNNER = `#!/usr/bin/env bun
// Vendored by ki-bootstrap. Runs each vendored skill checker under ../checkers/ in
// sequence for the given verb — no package.json required.
// Usage: bun .ki-meta/bin/aggregate.ts <audit|conform|educate|help> [options]
import { execFileSync, spawnSync } from 'node:child_process'
import { closeSync, existsSync, lstatSync, mkdtempSync, openSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const verb = process.argv[2]
if (!verb) {
  console.error('Usage: bun .ki-meta/bin/aggregate.ts <audit|conform|educate|help> [options]')
  process.exit(2)
}
const helpRequested = process.argv.slice(3).some((argument) => argument === '-h' || argument === '--help')
if (helpRequested && (verb === 'audit' || verb === 'conform')) {
  const isConform = verb === 'conform'
  process.stdout.write(
    [
      'Usage: bun .ki-meta/bin/aggregate.ts ' + verb + ' [options]',
      '',
      isConform
        ? 'Apply each vendored skill checker\\'s safe mechanical fixes.'
        : 'Audit each vendored skill checker and render one combined report.',
      '',
      'Options:',
      '  --skill <ki-skill>        Run one vendored skill checker.',
      '  --progress <mode>          Progress display: auto, always, or never (default: auto).',
      '  --reporter-levels <levels> Render comma-separated levels or all.',
      ...(isConform ? ['  --dry-run                 Report changes without writing them.'] : []),
      '  -h, --help                Show this help and exit.'
    ].join('\\n') + '\\n'
  )
  process.exit(0)
}
const binDir = dirname(fileURLToPath(import.meta.url))
if (verb === 'educate' || verb === 'help') {
  // educate: whole-set re-bootstrap or a selected target-local educator payload.
  // help: the vendored HELP snapshots. Both exec the sibling wrapper.
  execFileSync(join(binDir, verb === 'educate' ? 'ki-educate' : 'ki-help'), process.argv.slice(3), { stdio: 'inherit' })
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
if (verb !== 'audit' && verb !== 'conform') process.exit(0)
const checkersDir = join(binDir, '..', 'checkers')
if (!existsSync(checkersDir)) process.exit(0)
let checkers = readdirSync(checkersDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

// The aggregate is the sole terminal renderer. Each checker is invoked normally and
// must emit the canonical JSONL stream. A malformed stream is a clear aggregate
// failure: the runner never falls back to a checker's legacy prose or wrapper format.
// Every icon must occupy two display columns so the level column aligns. Most are
// Emoji_Presentation=Yes glyphs (genuinely 2 cols everywhere); ⚠️/ℹ️ have narrow base
// chars that VS16 does NOT widen under wcwidth-style terminals (VS Code/xterm.js counts
// them 1 col), so they carry an explicit trailing space to make up the second column.
// NOT_APPLICABLE uses 🚫 (a 2-col circle-slash) in place of the 1-col ⊘.
const ICON = { FAIL: '\\u274c', WARN: '\\u26a0\\ufe0f ', FIXED: '\\u2705', INFO: '\\u2139\\ufe0f ', NOT_APPLICABLE: '\\ud83d\\udeab', PASS: '\\u2705' }
const LEVELS = ['FAIL', 'WARN', 'FIXED', 'INFO', 'NOT_APPLICABLE', 'PASS']
const PROGRESS_MODES = ['auto', 'always', 'never']
const SUMMARY_KEYS = ['fail', 'warn', 'fixed', 'info', 'notApplicable', 'pass']
const RUN_KEYS = ['version', 'runId', 'record', 'mode', 'concern', 'target', 'generatedAt']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DEFAULT_REPORTER_LEVELS = new Set(verb === 'conform' ? ['FAIL', 'WARN', 'FIXED'] : ['FAIL', 'WARN'])
const verbed = verb === 'conform' ? 'conformed' : 'audited'
const runCheckerProcess = (scriptPath, childArgs) => {
  // Bun truncates piped spawn output at roughly 700 KiB even when maxBuffer is
  // raised. Capture through regular files so large canonical JSONL streams stay
  // complete, then remove the private temporary directory immediately.
  const captureDir = mkdtempSync(join(tmpdir(), 'ki-aggregate-'))
  const stdoutPath = join(captureDir, 'stdout')
  const stderrPath = join(captureDir, 'stderr')
  const stdoutFd = openSync(stdoutPath, 'w', 0o600)
  const stderrFd = openSync(stderrPath, 'w', 0o600)
  let result
  try {
    result = spawnSync('bun', [scriptPath, '.', ...childArgs], { stdio: ['ignore', stdoutFd, stderrFd] })
  } finally {
    closeSync(stdoutFd)
    closeSync(stderrFd)
  }
  try {
    return { ...result, stdout: readFileSync(stdoutPath, 'utf8'), stderr: readFileSync(stderrPath, 'utf8') }
  } finally {
    rmSync(captureDir, { recursive: true, force: true })
  }
}
// Render one finding row: icon status [title (code)] subject — message. full=false
// trims the message to its first line so recap rows remain one-line.
const SHORT = { FAIL: 'fail', WARN: 'warn', FIXED: 'fixed', INFO: 'info', NOT_APPLICABLE: 'na', PASS: 'pass' }
const parseReporterOptions = (args) => {
  let levels = DEFAULT_REPORTER_LEVELS
  let skill
  let progress = 'auto'
  const childArgs = []
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    let value
    if (arg === '--reporter-levels') value = args[++index]
    else if (arg.startsWith('--reporter-levels=')) value = arg.slice('--reporter-levels='.length)
    else if (arg === '--progress') {
      progress = args[++index]
      if (!PROGRESS_MODES.includes(progress)) throw new Error('--progress accepts ' + PROGRESS_MODES.join(', '))
      continue
    } else if (arg.startsWith('--progress=')) {
      progress = arg.slice('--progress='.length)
      if (!PROGRESS_MODES.includes(progress)) throw new Error('--progress accepts ' + PROGRESS_MODES.join(', '))
      continue
    }
    else if (arg === '--skill') {
      skill = args[++index]
      if (!skill || !/^ki-[a-z0-9-]+$/.test(skill)) throw new Error('--skill requires one canonical ki-* skill name')
      continue
    } else if (arg.startsWith('--skill=')) {
      skill = arg.slice('--skill='.length)
      if (!/^ki-[a-z0-9-]+$/.test(skill)) throw new Error('--skill requires one canonical ki-* skill name')
      continue
    } else {
      childArgs.push(arg)
      continue
    }
    if (!value) throw new Error('--reporter-levels requires one or more comma-separated levels')
    const requested = value.toUpperCase() === 'ALL' ? LEVELS : value.split(',').map((level) => level.trim().toUpperCase())
    if (!requested.length || requested.some((level) => !LEVELS.includes(level)))
      throw new Error('--reporter-levels accepts comma-separated values from ' + LEVELS.join(', ') + ', or all')
    levels = new Set(requested)
  }
  return { levels, skill, progress, childArgs }
}
const progressBar = (completed, total) => {
  const width = 12
  if (total <= 0) return '[' + '.'.repeat(width) + ']'
  const clamped = Math.max(0, Math.min(completed, total))
  const filled = clamped === total ? width : Math.floor((clamped / total) * width)
  return '[' + '#'.repeat(filled) + '.'.repeat(width - filled) + ']'
}
const createProgressTracker = (mode, total) => {
  const interactive = Boolean(process.stderr.isTTY)
  if (mode === 'never' || (mode === 'auto' && !interactive)) return { start: () => {}, active: () => {}, complete: () => {} }
  const write = (completed, state, skill) => {
    const prefix = verb.toUpperCase() + ' ' + progressBar(completed, total) + ' ' + completed + '/' + total
    const detail = state === 'start' ? 'starting' : state === 'complete' ? 'complete' : skill + ' (' + (total - completed) + ' remaining)'
    process.stderr.write((interactive ? '\\r\\x1b[2K' : '') + prefix + ' ' + detail + (interactive && state !== 'complete' ? '' : '\\n'))
  }
  return { start: () => write(0, 'start'), active: (completed, skill) => write(completed, 'active', skill), complete: () => write(total, 'complete') }
}
const findingLine = (icon, level, code, title, subject, msg, skill, full) =>
  '  ' + icon + ' ' + (SHORT[level] || level.toLowerCase()).padEnd(4) +
  (skill ? ' ' + skill.padEnd(20) : '') +
  ' \\x1b[2m[' + title + ' (' + code + ')]\\x1b[0m' +
  (subject ? ' \\x1b[36m' + subject + '\\x1b[0m' : '') +
  ' — ' + (full ? msg : String(msg).split('\\n')[0])

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const parseJsonl = (output) => {
  const events = []
  const errors = []
  for (const [index, raw] of output.split(/\\r?\\n/).entries()) {
    const line = raw.trim()
    if (!line) continue
    try {
      events.push(JSON.parse(line))
    } catch {
      errors.push('line ' + (index + 1) + ' is not valid JSON')
    }
  }
  return { events, errors }
}
const validateReport = (events, exitCode, expectedMode) => {
  const errors = []
  if (events.length < 2) return ['report must contain meta and summary records']
  const meta = events[0]
  const summary = events.at(-1)
  if (!isRecord(meta) || meta.record !== 'meta') errors.push('first record must be meta')
  if (!isRecord(summary) || summary.record !== 'summary') errors.push('last record must be summary')
  if (!isRecord(meta)) return errors
  if (meta.version !== 1) errors.push('meta version must be 1')
  if (!nonEmptyString(meta.runId) || !UUID.test(meta.runId)) errors.push('meta runId must be a UUID')
  if (meta.mode !== expectedMode) errors.push('meta mode must be ' + expectedMode)
  if (!nonEmptyString(meta.concern) || !nonEmptyString(meta.target)) errors.push('meta concern and target must be non-empty')
  if (!nonEmptyString(meta.generatedAt) || Number.isNaN(Date.parse(meta.generatedAt))) errors.push('meta generatedAt must be an ISO timestamp')
  const counts = { fail: 0, warn: 0, fixed: 0, info: 0, notApplicable: 0, pass: 0 }
  let hasFailure = false
  for (const [index, event] of events.entries()) {
    const label = 'record ' + (index + 1)
    if (!isRecord(event)) {
      errors.push(label + ' must be an object')
      continue
    }
    const record = event.record
    if (record !== 'meta' && record !== 'finding' && record !== 'summary') {
      errors.push(label + ' has an invalid record kind')
      continue
    }
    const permitted =
      record === 'meta' ? RUN_KEYS : record === 'finding' ? [...RUN_KEYS, 'level', 'code', 'title', 'message', 'subject'] : [...RUN_KEYS, 'summary']
    for (const key of Object.keys(event)) if (!permitted.includes(key)) errors.push(label + ' has unknown field: ' + key)
    if (event.version !== 1 || event.runId !== meta.runId || event.mode !== meta.mode || event.concern !== meta.concern || event.target !== meta.target || event.generatedAt !== meta.generatedAt)
      errors.push(label + ' must carry the meta run identity')
    if (index > 0 && index < events.length - 1 && record !== 'finding') {
      errors.push(label + ' must be a finding record')
      continue
    }
    if (record !== 'finding') continue
    if (!LEVELS.includes(event.level)) errors.push(label + ' has an invalid finding level')
    if (expectedMode === 'audit' && event.level === 'FIXED') errors.push(label + ' audit finding cannot be FIXED')
    if (!nonEmptyString(event.code) || !nonEmptyString(event.title) || !nonEmptyString(event.message))
      errors.push(label + ' must carry a code, title, and message')
    if (event.subject !== undefined && !nonEmptyString(event.subject)) errors.push(label + ' subject must be non-empty when present')
    if (LEVELS.includes(event.level)) {
      const key = event.level === 'NOT_APPLICABLE' ? 'notApplicable' : event.level.toLowerCase()
      counts[key]++
    }
    if (event.level === 'FAIL') hasFailure = true
  }
  if (isRecord(summary) && summary.record === 'summary') {
    if (!isRecord(summary.summary)) errors.push('summary record must carry a summary object')
    else {
      for (const key of SUMMARY_KEYS) {
        if (!Number.isInteger(summary.summary[key]) || summary.summary[key] < 0 || summary.summary[key] !== counts[key])
          errors.push('summary ' + key + ' does not match findings')
      }
      const judgment = summary.summary.judgment
      if (!isRecord(judgment) || !Number.isInteger(judgment.unevaluated) || judgment.unevaluated < 0)
        errors.push('summary judgment.unevaluated must be a non-negative integer')
      else for (const key of Object.keys(judgment)) if (key !== 'unevaluated') errors.push('summary judgment has unknown key: ' + key)
      for (const key of Object.keys(summary.summary))
        if (![...SUMMARY_KEYS, 'judgment'].includes(key)) errors.push('summary has unknown key: ' + key)
    }
  }
  if ((exitCode !== 0) !== hasFailure) errors.push('exit status must be non-zero if and only if a FAIL finding exists')
  return errors
}

let failed = false
const reports = []
const reportErrors = []
let reporter
try {
  reporter = parseReporterOptions(process.argv.slice(3))
} catch (error) {
  console.error('error: ' + error.message)
  process.exit(2)
}
if (reporter.skill) {
  if (!checkers.includes(reporter.skill)) {
    console.error('error: no vendored checker for ' + reporter.skill)
    process.exit(2)
  }
  checkers = [reporter.skill]
}
const progress = createProgressTracker(reporter.progress, checkers.length)
progress.start()
let completed = 0
for (const skill of checkers) {
  progress.active(completed, skill)
  const dir = join(checkersDir, skill)
  const entry = 'scripts/' + verb + '.ts'
  const scriptPath = join(dir, entry)
  if (!existsSync(scriptPath)) {
    failed = true
    reportErrors.push({ skill, errors: ['checker entry is missing: ' + entry] })
    completed += 1
    continue
  }
  const scriptStat = lstatSync(scriptPath)
  if (!scriptStat.isFile() || scriptStat.isSymbolicLink()) {
    failed = true
    reportErrors.push({ skill, errors: ['checker entry is unsafe: ' + entry] })
    completed += 1
    continue
  }
  // The renderer consumes --reporter-levels itself. All other flags (for example
  // --dry-run) forward to every child, whose canonical JSONL stays complete.
  const res = runCheckerProcess(scriptPath, reporter.childArgs)
  const parsed = parseJsonl(res.stdout ?? '')
  const errors = [...parsed.errors, ...validateReport(parsed.events, res.status ?? 1, verb)]
  if (res.error) errors.push('process failed to start: ' + res.error.message)
  if ((res.stderr ?? '').trim()) errors.push('checker wrote to stderr: ' + (res.stderr ?? '').trim().split('\\n')[0])
  if (errors.length) {
    failed = true
    reportErrors.push({ skill, errors })
    completed += 1
    continue
  }
  const findings = parsed.events.slice(1, -1)
  reports.push({ skill, key: 'ki:' + skill.replace(/^ki-/, '') + ':' + verb, findings, summary: parsed.events.at(-1).summary })
  if ((res.status ?? 0) !== 0) failed = true
  completed += 1
}
progress.complete()
for (const report of reports) {
  const visible = report.findings.filter((finding) => reporter.levels.has(finding.level))
  if (!visible.length) continue
  console.log('\\n\\x1b[36m==> ' + report.key + '\\x1b[0m')
  for (const finding of visible) {
    const level = finding.level
    console.log(
      findingLine(
        ICON[level],
        level,
        finding.code,
        finding.title,
        finding.subject ?? '',
        finding.message,
        '',
        true
      )
    )
  }
  const summary = report.summary
  const sicon = summary.fail ? ICON.FAIL : summary.warn ? ICON.WARN : ICON.PASS
  console.log(
    '  ' + sicon + ' \\x1b[2msummary: FAIL=' + summary.fail + ' WARN=' + summary.warn + ' FIXED=' + summary.fixed +
    ' JUDGMENT_UNEVALUATED=' + summary.judgment.unevaluated + '\\x1b[0m'
  )
}
console.log('\\n\\x1b[36m==> recap\\x1b[0m')
const allFindings = reports.flatMap((report) =>
  report.findings.map((finding) => ({
    skill: report.skill,
    level: finding.level,
    code: finding.code,
    title: finding.title,
    msg: finding.message,
    subject: finding.subject ?? ''
  }))
)
const recap = allFindings.filter((finding) => reporter.levels.has(finding.level))
if (recap.length === 0) {
  console.log('  \\x1b[32m\\u2705 no ' + [...reporter.levels].join(' / ') + ' findings across ' + verbed + ' skills\\x1b[0m')
} else {
  console.log('  \\x1b[1mselected findings\\x1b[0m')
  for (const level of LEVELS)
    for (const h of recap.filter((finding) => finding.level === level))
      console.log(findingLine(ICON[level], level, h.code, h.title, h.subject, h.msg, h.skill, false))
}
const count = (level) => allFindings.filter((finding) => finding.level === level).length
const ticon = count('FAIL') ? ICON.FAIL : count('WARN') ? ICON.WARN : ICON.PASS
const suppressed = LEVELS.filter((level) => !reporter.levels.has(level))
const suppressedCounts = suppressed.map((level) => level + '=' + count(level)).join(' ')
const judgmentUnevaluated = reports.reduce((total, report) => total + report.summary.judgment.unevaluated, 0)
console.log(
  '  ' +
    ticon +
    ' \\x1b[2mtotals: FAIL=' +
    count('FAIL') +
    ' WARN=' +
    count('WARN') +
    ' FIXED=' +
    count('FIXED') +
    ' JUDGMENT_UNEVALUATED=' +
    judgmentUnevaluated +
    (suppressed.length ? ' (suppressed: ' + suppressedCounts + ')' : ' (all levels shown)') +
    '\\x1b[0m'
)
if (reportErrors.length) {
  console.log('  \\x1b[1minvalid checker reports\\x1b[0m')
  for (const item of reportErrors) {
    const shown = item.errors.slice(0, 3)
    const remaining = item.errors.length - shown.length
    console.log('  ' + ICON.FAIL + ' fail ' + item.skill + ': ' + shown.join('; ') + (remaining ? '; +' + remaining + ' more' : ''))
  }
}
process.exit(failed ? 1 : 0)
`

// The package.json-free entry point vendored into every target: a tiny wrapper that
// cd's to the repo root and runs the vendored aggregate. It lives under .ki-meta/bin/ so
// the whole generated surface is dot-prefixed — off the repo's own bin/ and auto-ignored
// by dotfile managers (chezmoi). Usage: ./.ki-meta/bin/ki-audit [verb] [--progress=<mode>] [--reporter-levels=<levels>].
const BIN_KI_AUDIT = `#!/bin/sh
# Vendored by ki-bootstrap — the package.json-free entry to a repo's self-check.
# Usage: ./.ki-meta/bin/ki-audit [audit|conform|educate|help] [--dry-run ...] [--progress=<auto|always|never>] [--reporter-levels=<levels>]
set -eu
case "\${1:-}" in
  -h|--help)
    echo "Usage: ki-audit [command] [options]"
    echo
    echo "Run vendored skill checks for this repository."
    echo
    echo "Commands:"
    echo "  audit      Run read-only checks (default)."
    echo "  conform    Apply safe mechanical fixes."
    echo "  educate    Refresh governance material."
    echo "  help       List governed skills or show one skill's help."
    echo
    echo "Options:"
    echo "  --skill <ki-skill>        Run one vendored skill checker."
    echo "  --dry-run                 Report changes without writing them."
    echo "  --progress <mode>         Progress display: auto, always, or never (default: auto)."
    echo "  --reporter-levels <levels> Render comma-separated levels or all."
    echo "  -h, --help                Show this help and exit."
    exit 0
    ;;
esac
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root"
verb="audit"
case "\${1:-}" in
  audit|conform|educate|help|refresh)
    verb="$1"
    shift
    ;;
esac
exec bun ".ki-meta/bin/aggregate.ts" "$verb" "$@"
`

// The conform twin — same runner, verb pinned, so the write pass is a first-class
// entry beside ki-audit rather than an argument to it. Flags (e.g. --dry-run) still
// forward through — the verb is pinned, not the whole argument list.
const BIN_KI_CONFORM = `#!/bin/sh
# Vendored by ki-bootstrap — apply the mechanical fixes across the vendored set.
# Usage: ./.ki-meta/bin/ki-conform [--dry-run] [--progress=<auto|always|never>] [--reporter-levels=<levels>]
set -eu
case "\${1:-}" in
  -h|--help)
    echo "Usage: ki-conform [options]"
    echo
    echo "Apply each vendored skill's safe mechanical fixes."
    echo
    echo "Options:"
    echo "  --skill <ki-skill>        Run one vendored skill checker."
    echo "  --dry-run                 Report changes without writing them."
    echo "  --progress <mode>         Progress display: auto, always, or never (default: auto)."
    echo "  --reporter-levels <levels> Render comma-separated levels or all."
    echo "  -h, --help                Show this help and exit."
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
# Vendored by ki-bootstrap — each governed skill's HELP snapshot, materialised from
# its SKILL.md at vendor time (re-synced by ki-educate).
# Usage: ./.ki-meta/bin/ki-help [skill]    (no argument: list the governed skills)
set -eu
meta="$(cd "$(dirname "$0")/.." && pwd)"
if [ $# -eq 0 ]; then
  echo "governed skills (./.ki-meta/bin/ki-help <skill>):"
  for d in "$meta"/checkers/*/; do
    s="$(basename "$d")"
    [ -f "$d/help.md" ] && echo "  $s"
  done
  exit 0
fi
f="$meta/checkers/$1/help.md"
if [ ! -f "$f" ]; then
  echo "no help vendored for '$1'" >&2
  exit 1
fi
cat "$f"
`

// The `ki-educate` wrapper has two distinct local dispatch paths. Bare, it refreshes
// the retained current whole-set catalogue; with one safe skill name it runs exactly
// that local educator payload. The payload is generated below rather than copied from
// a skill's source entrypoint, so it remains self-contained in the target repository.
function shellLiteral(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`
}

function binKiInit(ref: string): string {
  return `#!/bin/sh
# Vendored by ki-bootstrap — run the local whole-set coordinator, or one local educator.
# Usage: ./.ki-meta/bin/ki-educate [skill] [--dry-run] [--verbose] [--help]
set -eu
root="$(cd "$(dirname "$0")/../.." && pwd)"
ref=${shellLiteral(ref)}
case "\${1:-}" in
  --help|-h)
    echo "usage: ki-educate [skill] [--dry-run] [--verbose]"
    echo "  without a skill, refreshes the current governed set from local bootstrap material."
    echo "  with a skill, refreshes only that skill's local checker and educator payloads."
    echo "  use https://knowledgeislands.info/harness/bootstrap to acquire a newer harness revision."
    exit 0
    ;;
esac
if [ $# -gt 0 ] && [ "\${1#-}" = "$1" ]; then
  skill="$1"
  shift
  case "$skill" in ki-*) ;; *) echo "unsafe educator skill name: $skill" >&2; exit 2 ;; esac
  case "$skill" in *[!a-z0-9_-]*) echo "unsafe educator skill name: $skill" >&2; exit 2 ;; esac
  educator="$root/.ki-meta/educators/$skill/educate.ts"
  if [ ! -f "$educator" ] || [ -L "$educator" ]; then
    echo "no safe educator vendored for '$skill' — run https://knowledgeislands.info/harness/bootstrap to repair the local harness" >&2
    exit 1
  fi
  exec bun "$educator" "$root" "$@"
fi
engine="$root/.ki-meta/bootstrap/skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts"
if [ ! -f "$engine" ] || [ -L "$engine" ]; then
  echo "local bootstrap material is missing or unsafe — run https://knowledgeislands.info/harness/bootstrap to repair it" >&2
  exit 1
fi
for argument in "$@"; do
  case "$argument" in
    --ref|--ref=*)
      echo "a harness revision is acquired only through https://knowledgeislands.info/harness/bootstrap" >&2
      exit 2
      ;;
    --dry-run|--verbose) ;;
    *) echo "unsupported whole-set ki-educate argument: $argument" >&2; exit 2 ;;
  esac
done
exec env KI_BOOTSTRAP_OFFLINE=1 bun "$engine" "$root" --ref "$ref" "$@"
`
}

interface VendoredFile {
  rel: string
  abs: string
}

type EntrySnapshot =
  | { kind: 'directory'; dev: number; ino: number; mode: number; uid: number }
  | { kind: 'file'; dev: number; ino: number; mode: number; uid: number; bytes: Buffer }

type OwnedSnapshot = Map<string, EntrySnapshot>

interface PublishedEntry {
  rel: string
  after: EntrySnapshot
  before?: QuarantinedEntry
}

interface QuarantinedEntry {
  rel: string
  expected: EntrySnapshot
  path: string
  movedPath: string
}

interface CreatedDirectory {
  rel: string
  identity: EntrySnapshot & { kind: 'directory' }
}

class RollbackConflictError extends Error {}

function lstatOrNull(path: string): ReturnType<typeof lstatSync> | null {
  try {
    return lstatSync(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

function snapshotEntry(path: string): EntrySnapshot {
  const stat = lstatSync(path)
  const common = { dev: stat.dev, ino: stat.ino, mode: stat.mode & 0o777, uid: stat.uid }
  if (stat.isSymbolicLink()) throw new Error(`unsafe symlink entry: ${path}`)
  if (stat.isDirectory()) return { kind: 'directory', ...common }
  if (stat.isFile()) return { kind: 'file', ...common, bytes: readFileSync(path) }
  throw new Error(`unsafe non-file entry: ${path}`)
}

function sameSnapshot(a: EntrySnapshot | undefined, b: EntrySnapshot | undefined, identity = true): boolean {
  if (!a || !b || a.kind !== b.kind || a.mode !== b.mode || a.uid !== b.uid) return a === b
  if (identity && (a.dev !== b.dev || a.ino !== b.ino)) return false
  return a.kind === 'directory' || (b.kind === 'file' && a.bytes.equals(b.bytes))
}

function snapshotTree(metaDir: string, rel: string, out: OwnedSnapshot): void {
  const abs = join(metaDir, rel)
  const snap = snapshotEntry(abs)
  out.set(rel, snap)
  if (snap.kind !== 'directory') return
  for (const name of readdirSync(abs).sort()) snapshotTree(metaDir, join(rel, name), out)
}

function snapshotOwned(metaDir: string): OwnedSnapshot {
  const out: OwnedSnapshot = new Map()
  for (const rel of [CHECKERS_DIR, EDUCATORS_DIR, BOOTSTRAP_DIR, RETIRED_CHECKERS_DIR, 'bin', 'manifest.json']) {
    if (lstatOrNull(join(metaDir, rel))) snapshotTree(metaDir, rel, out)
  }
  return out
}

// A pre-checker-layout `.ki-meta/skills/` tree is removed only when the manifest
// proves that every file is the generated payload it claims to be. This is a
// deliberately one-way current-state migration: a stale, hand-edited, or unsafe
// legacy tree remains untouched and makes EDUCATE fail rather than being guessed at.
function validateRetiredCheckerLayout(metaDir: string): void {
  const retired = join(metaDir, RETIRED_CHECKERS_DIR)
  if (!lstatOrNull(retired)) return

  const manifestPath = join(metaDir, 'manifest.json')
  const manifestEntry = lstatOrNull(manifestPath)
  if (!manifestEntry || manifestEntry.isSymbolicLink() || !manifestEntry.isFile()) {
    throw new Error(`cannot safely migrate ${VENDOR_DIR}/${RETIRED_CHECKERS_DIR}: manifest.json is missing or unsafe`)
  }

  let files: Record<string, string>
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8')) as { files?: unknown }
    if (!parsed.files || typeof parsed.files !== 'object' || Array.isArray(parsed.files)) throw new Error('files is not an object')
    files = parsed.files as Record<string, string>
  } catch (error) {
    throw new Error(`cannot safely migrate ${VENDOR_DIR}/${RETIRED_CHECKERS_DIR}: manifest.json is invalid (${(error as Error).message})`)
  }

  const tree = new Map<string, EntrySnapshot>()
  snapshotTree(metaDir, RETIRED_CHECKERS_DIR, tree)
  const expected = Object.entries(files)
    .filter(([rel]) => rel.startsWith(`${VENDOR_DIR}/${RETIRED_CHECKERS_DIR}/`))
    .map(([rel, hash]) => [rel.slice(VENDOR_DIR.length + 1), hash] as const)
    .sort(([a], [b]) => a.localeCompare(b))
  const actualFiles = [...tree.entries()].filter(([, entry]) => entry.kind === 'file').sort(([a], [b]) => a.localeCompare(b))
  const expectedDirectories = new Set<string>([RETIRED_CHECKERS_DIR])
  for (const [rel] of expected) {
    let parent = dirname(rel)
    while (parent !== '.' && parent !== RETIRED_CHECKERS_DIR) {
      expectedDirectories.add(parent)
      parent = dirname(parent)
    }
  }
  const actualDirectories = [...tree.entries()]
    .filter(([, entry]) => entry.kind === 'directory')
    .map(([rel]) => rel)
    .sort()

  if (expected.length !== actualFiles.length || JSON.stringify(actualDirectories) !== JSON.stringify([...expectedDirectories].sort())) {
    throw new Error(`cannot safely migrate ${VENDOR_DIR}/${RETIRED_CHECKERS_DIR}: manifest tree does not match the retired payload`)
  }
  for (const [[rel, hash], [actualRel, entry]] of expected.map((value, index) => [value, actualFiles[index]] as const)) {
    if (
      rel !== actualRel ||
      entry.kind !== 'file' ||
      !/^[0-9a-f]{64}$/.test(hash) ||
      createHash('sha256').update(entry.bytes).digest('hex') !== hash
    ) {
      throw new Error(`cannot safely migrate ${VENDOR_DIR}/${RETIRED_CHECKERS_DIR}: manifest mismatch at ${rel}`)
    }
  }
}

function sameOwnedSnapshot(a: OwnedSnapshot, b: OwnedSnapshot): boolean {
  if (a.size !== b.size) return false
  for (const [rel, before] of a) if (!sameSnapshot(before, b.get(rel))) return false
  return true
}

function assertCurrent(metaDir: string, rel: string, expected: EntrySnapshot | undefined): void {
  const path = join(metaDir, rel)
  const current = lstatOrNull(path) ? snapshotEntry(path) : undefined
  if (!sameSnapshot(expected, current)) throw new Error(`destination changed before publication: ${join(VENDOR_DIR, rel)}`)
}

function physicalTarget(path: string): { path: string; identity: EntrySnapshot & { kind: 'directory' } } {
  const canonical = realpathSync(resolve(path))
  const identity = snapshotEntry(canonical)
  if (identity.kind !== 'directory') throw new Error(`target must resolve to a real directory: ${path}`)
  return { path: canonical, identity }
}

function establishMeta(
  target: string,
  targetIdentity: EntrySnapshot & { kind: 'directory' }
): { path: string; created?: EntrySnapshot & { kind: 'directory' } } {
  if (!exactIdentity(target, targetIdentity) || realpathSync(target) !== target) {
    throw new Error('physical target changed before .ki-meta establishment')
  }
  const metaDir = join(target, VENDOR_DIR)
  const existing = lstatOrNull(metaDir)
  if (!existing) {
    if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_RACE_META_CREATE === '1') mkdirSync(metaDir)
    mkdirSync(metaDir, { mode: 0o755 })
    const created = snapshotEntry(metaDir)
    try {
      if (created.kind !== 'directory' || realpathSync(metaDir) !== metaDir || dirname(metaDir) !== target) {
        throw new Error(`${VENDOR_DIR} was not created as the expected real directory`)
      }
    } catch (error) {
      if (created.kind === 'directory' && exactIdentity(metaDir, created) && readdirSync(metaDir).length === 0) rmdirSync(metaDir)
      throw error
    }
    if (!exactIdentity(target, targetIdentity)) throw new Error('physical target changed during .ki-meta establishment')
    validateMetaPrivacy(metaDir)
    return { path: metaDir, created }
  }
  const current = snapshotEntry(metaDir)
  if (current.kind !== 'directory' || realpathSync(metaDir) !== metaDir || dirname(metaDir) !== target) {
    throw new Error(`${VENDOR_DIR} must be a real directory directly beneath the physical target`)
  }
  if (!exactIdentity(target, targetIdentity)) throw new Error('physical target changed during .ki-meta validation')
  validateMetaPrivacy(metaDir)
  return { path: metaDir }
}

function validateMetaPrivacy(metaDir: string): void {
  const stat = lstatSync(metaDir)
  const getuid = process.getuid
  if (typeof getuid === 'function' && stat.uid !== getuid.call(process)) {
    throw new Error(`${VENDOR_DIR} must be owned by the current user before creating private transaction state`)
  }
  if ((stat.mode & 0o022) !== 0) throw new Error(`${VENDOR_DIR} must not be writable by group or other users`)
}

function exactIdentity(path: string, expected: EntrySnapshot): boolean {
  const current = lstatOrNull(path)
  if (!current) return false
  const snap = snapshotEntry(path)
  return snap.kind === expected.kind && snap.dev === expected.dev && snap.ino === expected.ino
}

function cleanupExact(path: string, expected: EntrySnapshot, recursive = false): void {
  if (!exactIdentity(path, expected)) throw new Error(`refusing cleanup after identity change: ${path}`)
  if (recursive) rmSync(path, { recursive: true })
  else if (expected.kind === 'directory') rmdirSync(path)
  else unlinkSync(path)
}

function acquireLock(metaDir: string): { path: string; identity: EntrySnapshot & { kind: 'file' } } {
  const path = join(metaDir, '.bootstrap.lock')
  const fd = openSync(path, 'wx', 0o600)
  const stat = fstatSync(fd)
  const identity: EntrySnapshot & { kind: 'file' } = {
    kind: 'file',
    dev: stat.dev,
    ino: stat.ino,
    mode: stat.mode & 0o777,
    uid: stat.uid,
    bytes: Buffer.alloc(0)
  }
  closeSync(fd)
  if (!exactIdentity(path, identity)) throw new Error('bootstrap lock changed during acquisition')
  return { path, identity }
}

function createStaging(metaDir: string): { path: string; identity: EntrySnapshot & { kind: 'directory' } } {
  const forcedSuffix = process.env.NODE_ENV === 'test' ? process.env.KI_BOOTSTRAP_TEST_STAGING_SUFFIX : undefined
  const path = forcedSuffix ? join(metaDir, `.bootstrap-staging-${forcedSuffix}`) : mkdtempSync(join(metaDir, '.bootstrap-staging-'))
  if (forcedSuffix) mkdirSync(path, { mode: 0o700 })
  chmodSync(path, 0o700)
  const identity = snapshotEntry(path)
  if (identity.kind !== 'directory') throw new Error('bootstrap staging entry is not a directory')
  return { path, identity }
}

function validateGeneration(staging: string, journal: OwnedSnapshot, manifestFiles: Record<string, string>): OwnedSnapshot {
  const topLevel = readdirSync(staging).sort()
  if (JSON.stringify(topLevel) !== JSON.stringify(['bin', BOOTSTRAP_DIR, CHECKERS_DIR, EDUCATORS_DIR, 'manifest.json'].sort())) {
    throw new Error(`candidate generation has unexpected top-level entries: ${topLevel.join(', ')}`)
  }
  const tree = new Map<string, EntrySnapshot>()
  for (const rel of [CHECKERS_DIR, EDUCATORS_DIR, BOOTSTRAP_DIR, 'bin', 'manifest.json']) {
    if (!lstatOrNull(join(staging, rel))) throw new Error(`candidate generation is missing ${rel}`)
    snapshotTree(staging, rel, tree)
  }
  if (!sameOwnedSnapshot(journal, tree)) throw new Error('candidate generation changed after creation journal entry')
  for (const [manifestRel, expectedHash] of Object.entries(manifestFiles)) {
    const rel = manifestRel.startsWith(`${VENDOR_DIR}/`) ? manifestRel.slice(VENDOR_DIR.length + 1) : manifestRel
    const entry = tree.get(rel)
    if (entry?.kind !== 'file' || createHash('sha256').update(entry.bytes).digest('hex') !== expectedHash) {
      throw new Error(`candidate generation hash mismatch: ${manifestRel}`)
    }
  }
  return tree
}

function restoreSnapshot(path: string, before: EntrySnapshot & { kind: 'file' }): void {
  const temp = join(dirname(path), `.bootstrap-restore-${process.pid}-${Math.random().toString(16).slice(2)}`)
  const fd = openSync(temp, 'wx', 0o600)
  try {
    writeFileSync(fd, before.bytes)
    fsyncSync(fd)
    chmodSync(temp, before.mode)
  } finally {
    closeSync(fd)
  }
  try {
    renameSync(temp, path)
  } finally {
    if (lstatOrNull(temp)) unlinkSync(temp)
  }
}

function maybeInjectPublicationFailure(count: number): void {
  if (process.env.NODE_ENV !== 'test') return
  const after = Number(process.env.KI_BOOTSTRAP_TEST_FAIL_AFTER ?? '')
  if (Number.isInteger(after) && after > 0 && count === after) throw new Error(`injected publication failure after ${count}`)
}

function copyRegularFile(source: string, destination: string): void {
  const before = snapshotEntry(source)
  if (before.kind !== 'file') throw new Error(`source is not a regular file: ${source}`)
  cpSync(source, destination)
  const after = snapshotEntry(destination)
  if (after.kind !== 'file' || !before.bytes.equals(after.bytes)) throw new Error(`copied source changed during read: ${source}`)
}

function copyRegularTree(
  generationRoot: string,
  source: string,
  destination: string,
  destinationRel: string,
  journal: OwnedSnapshot
): VendoredFile[] {
  const copied: VendoredFile[] = []

  const copyEntry = (sourcePath: string, destinationPath: string, rel: string): void => {
    const stat = lstatSync(sourcePath)
    if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) throw new Error(`unsafe vendored payload entry: ${sourcePath}`)
    if (stat.isFile()) {
      copyRegularFile(sourcePath, destinationPath)
      recordGenerated(journal, generationRoot, rel)
      copied.push({ rel: `${VENDOR_DIR}/${rel}`, abs: destinationPath })
      return
    }
    mkdirSync(destinationPath)
    recordGenerated(journal, generationRoot, rel)
    for (const name of readdirSync(sourcePath).sort()) {
      copyEntry(join(sourcePath, name), join(destinationPath, name), join(rel, name))
    }
  }

  copyEntry(source, destination, destinationRel)
  return copied
}

function vendorSharedModulePayload(
  generationRoot: string,
  destDir: string,
  skill: string,
  module: SharedModule,
  payload: SharedModulePayload,
  journal: OwnedSnapshot,
  ownModule = false
): VendoredFile[] {
  const vendorRoot = ownModule ? join(destDir, 'shared') : join(destDir, 'vendored', module.provider)
  const vendorRootRel = ownModule
    ? join(CHECKERS_DIR, skill, 'scripts', 'shared')
    : join(CHECKERS_DIR, skill, 'scripts', 'vendored', module.provider)
  const target = join(vendorRoot, payload.targetName)
  const targetRel = join(vendorRootRel, payload.targetName)

  mkdirSync(vendorRoot, { recursive: true })
  if (!ownModule) recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'scripts', 'vendored'))
  recordGenerated(journal, generationRoot, vendorRootRel)
  return copyRegularTree(generationRoot, payload.source, target, targetRel, journal)
}

function recordGenerated(journal: OwnedSnapshot, staging: string, rel: string): void {
  journal.set(rel, snapshotEntry(join(staging, rel)))
  if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_FAIL_BUILD_AFTER_REL === rel) {
    throw new Error(`injected candidate-build failure after ${rel}`)
  }
}

function hashJournalFile(journal: OwnedSnapshot, rel: string): string {
  const entry = journal.get(rel)
  if (entry?.kind !== 'file') throw new Error(`creation journal is missing regular file: ${rel}`)
  return createHash('sha256').update(entry.bytes).digest('hex')
}

// The universal modes that vendor a COPIED per-skill script. `educate` is NOT here: its
// per-skill `scripts/educate.ts` is a harness-relative seed delegator (it resolves the
// engine via ../../ki-bootstrap) so a verbatim copy into a target's .ki-meta would be
// a broken path — EDUCATE is instead the aggregate `ki:educate` re-sync (ADR-KI-HARNESS-007).
// `help` renders a snapshot below; `refresh` is harness-only and never vendored.
const SCRIPT_MODES = ['audit', 'conform'] as const

function vendorEducator(
  generationRoot: string,
  skill: string,
  manifestFiles: Record<string, string>,
  journal: OwnedSnapshot,
  showActions: boolean
): void {
  const declared = vendorModesOf(skill)
  if (!declared?.includes('educate')) return
  const rel = join(EDUCATORS_DIR, skill)
  const abs = join(generationRoot, rel)
  recordGenerated(journal, generationRoot, EDUCATORS_DIR)
  mkdirSync(abs)
  recordGenerated(journal, generationRoot, rel)
  const written = copyRegularTree(generationRoot, skillDir(skill), join(abs, 'skill'), join(rel, 'skill'), journal)
  const moduleRel = join(rel, 'educator.ts')
  const moduleAbs = join(generationRoot, moduleRel)
  copyRegularFile(join(skillDir('ki-bootstrap'), 'scripts', 'shared', 'educator.ts'), moduleAbs)
  recordGenerated(journal, generationRoot, moduleRel)
  written.push({ rel: `${VENDOR_DIR}/${moduleRel}`, abs: moduleAbs })
  const launcherRel = join(rel, 'educate.ts')
  const launcherAbs = join(generationRoot, launcherRel)
  writeFileSync(launcherAbs, educatorLauncher(skill))
  recordGenerated(journal, generationRoot, launcherRel)
  written.push({ rel: `${VENDOR_DIR}/${launcherRel}`, abs: launcherAbs })
  for (const file of written) manifestFiles[file.rel] = hashJournalFile(journal, file.rel.slice(VENDOR_DIR.length + 1))
  if (showActions) console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${VENDOR_DIR}/${rel} (self-contained educator payload)${RESET}`)
}

function ensureCandidateDirectory(staging: string, rel: string, journal: OwnedSnapshot): void {
  const path = join(staging, rel)
  if (!existsSync(path)) mkdirSync(path)
  recordGenerated(journal, staging, rel)
}

function manifestCopiedFiles(manifestFiles: Record<string, string>, journal: OwnedSnapshot, files: readonly VendoredFile[]): void {
  for (const file of files) manifestFiles[file.rel] = hashJournalFile(journal, file.rel.slice(VENDOR_DIR.length + 1))
}

function bootstrapCatalogueSkills(set: readonly string[]): string[] {
  const retained = new Set(set)
  const pending = [...retained]
  while (pending.length > 0) {
    const skill = pending.pop()
    if (!skill) continue
    for (const { provider } of sharedDependenciesOf(skill)) {
      if (retained.has(provider)) continue
      retained.add(provider)
      pending.push(provider)
    }
  }
  return [...retained].sort()
}

function vendorBootstrapPayload(
  generationRoot: string,
  set: readonly string[],
  manifestFiles: Record<string, string>,
  journal: OwnedSnapshot,
  showActions: boolean
): void {
  ensureCandidateDirectory(generationRoot, BOOTSTRAP_DIR, journal)
  ensureCandidateDirectory(generationRoot, join(BOOTSTRAP_DIR, 'skills'), journal)
  ensureCandidateDirectory(generationRoot, join(BOOTSTRAP_DIR, 'skills', 'keystone'), journal)

  const bootstrapSource = skillDir('ki-bootstrap')
  const bootstrapDestination = join(BOOTSTRAP_DIR, 'skills', 'keystone', 'ki-bootstrap')
  ensureCandidateDirectory(generationRoot, bootstrapDestination, journal)
  const bootstrapSkill = join(bootstrapDestination, 'SKILL.md')
  copyRegularFile(join(bootstrapSource, 'SKILL.md'), join(generationRoot, bootstrapSkill))
  recordGenerated(journal, generationRoot, bootstrapSkill)
  manifestFiles[join(VENDOR_DIR, bootstrapSkill)] = hashJournalFile(journal, bootstrapSkill)
  ensureCandidateDirectory(generationRoot, join(bootstrapDestination, 'scripts'), journal)
  ensureCandidateDirectory(generationRoot, join(bootstrapDestination, 'scripts', 'internal'), journal)
  manifestCopiedFiles(
    manifestFiles,
    journal,
    copyRegularTree(
      generationRoot,
      join(bootstrapSource, 'scripts', 'internal', 'repo-bootstrap'),
      join(generationRoot, bootstrapDestination, 'scripts', 'internal', 'repo-bootstrap'),
      join(bootstrapDestination, 'scripts', 'internal', 'repo-bootstrap'),
      journal
    )
  )
  ensureCandidateDirectory(generationRoot, join(bootstrapDestination, 'scripts', 'shared'), journal)
  const sharedEducatorRel = join(bootstrapDestination, 'scripts', 'shared', 'educator.ts')
  copyRegularFile(join(bootstrapSource, 'scripts', 'shared', 'educator.ts'), join(generationRoot, sharedEducatorRel))
  recordGenerated(journal, generationRoot, sharedEducatorRel)
  manifestFiles[join(VENDOR_DIR, sharedEducatorRel)] = hashJournalFile(journal, sharedEducatorRel)

  for (const skill of bootstrapCatalogueSkills(set)) {
    if (skill === 'ki-bootstrap') continue
    const source = skillDir(skill)
    const sourceRel = relative(SKILLS_ROOT, source)
    const destination = join(BOOTSTRAP_DIR, 'skills', sourceRel)
    const cluster = dirname(sourceRel)
    ensureCandidateDirectory(generationRoot, join(BOOTSTRAP_DIR, 'skills', cluster), journal)
    manifestCopiedFiles(
      manifestFiles,
      journal,
      copyRegularTree(generationRoot, source, join(generationRoot, destination), destination, journal)
    )
  }

  if (set.includes('ki-agents')) {
    ensureCandidateDirectory(generationRoot, join(BOOTSTRAP_DIR, 'agents'), journal)
    const agentsSource = join(SKILLS_ROOT, '..', 'agents', 'governance')
    manifestCopiedFiles(
      manifestFiles,
      journal,
      copyRegularTree(
        generationRoot,
        agentsSource,
        join(generationRoot, BOOTSTRAP_DIR, 'agents', 'governance'),
        join(BOOTSTRAP_DIR, 'agents', 'governance'),
        journal
      )
    )
  }

  if (showActions)
    console.log(
      `${GREEN}vendor${RESET} bootstrap ${DIM}→ ${VENDOR_DIR}/${BOOTSTRAP_DIR} (local whole-set coordinator and source catalogue)${RESET}`
    )
}

function vendorSkill(
  generationRoot: string,
  skill: string,
  dryRun: boolean,
  manifestFiles: Record<string, string>,
  journal?: OwnedSnapshot,
  showActions = false
): void {
  const declared = vendorModesOf(skill)
  // Which script modes to copy: the skill's declared list ∩ {audit, conform}, or — for
  // a skill still on filename-convention discovery (no `ki-vendors:`) — both, as before.
  const scriptModes = SCRIPT_MODES.filter((m) => !declared || declared.includes(m))
  const destDir = join(generationRoot, CHECKERS_DIR, skill)
  const scriptsDir = join(destDir, 'scripts')
  const written: VendoredFile[] = []

  for (const mode of scriptModes) {
    const unit = vendorUnit(skill, mode)
    if (unit) written.push(...vendorOne(generationRoot, scriptsDir, skill, mode, unit, dryRun, journal, showActions))
  }
  // Nothing vendored (no audit/conform resolvable) — skip the skill entirely, matching
  // the old `if (!audit) return` guard so bare non-governance dirs are ignored.
  if (written.length === 0) return

  // A structured checker keeps its skill-specific catalogue, contexts, and
  // publication logic beneath scripts/rubric/. Copy that tree beside the mode
  // entry points: the shared rubric/checker/reporter modules alone cannot make
  // an audit standalone when audit.ts imports its own rubric implementation.
  const internalRubricSource = join(skillDir(skill), 'scripts', 'rubric')
  if (existsSync(internalRubricSource)) {
    const internalRubricRel = join(CHECKERS_DIR, skill, 'scripts', 'rubric')
    const internalRubricAbs = join(generationRoot, internalRubricRel)
    if (showActions)
      console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${VENDOR_DIR}/${internalRubricRel} (internal rubric payload)${RESET}`)
    if (!dryRun) {
      if (!journal) throw new Error('candidate generation requires a creation journal')
      written.push(...copyRegularTree(generationRoot, internalRubricSource, internalRubricAbs, internalRubricRel, journal))
    }
  }

  // Checker reports resolve both their own judgment prompts and aggregate titles from
  // the emitting skill's rubric. Copy that metadata with the runnable payload so the
  // footprint remains standalone rather than reaching back into harness source.
  const rubricSource = join(skillDir(skill), 'references', 'rubric.md')
  if (existsSync(rubricSource)) {
    const rubricRel = join(CHECKERS_DIR, skill, 'references', 'rubric.md')
    const rubricAbs = join(generationRoot, rubricRel)
    if (showActions) console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${VENDOR_DIR}/${rubricRel} (rubric metadata)${RESET}`)
    if (!dryRun) {
      if (!journal) throw new Error('candidate generation requires a creation journal')
      mkdirSync(dirname(rubricAbs), { recursive: true })
      recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'references'))
      copyRegularFile(rubricSource, rubricAbs)
      recordGenerated(journal, generationRoot, rubricRel)
      written.push({ rel: `${VENDOR_DIR}/${rubricRel}`, abs: rubricAbs })
    }
  }

  // A provider's own checker imports its module locally, not through a declared
  // self-dependency. Copy that payload beside its audit/conform copies so the root
  // remains self-governing after vendoring.
  for (const moduleName of sharedModulesOf(skill)) {
    const module = { provider: skill, module: moduleName }
    const payload = sharedModulePayload(module)
    const rel = `${VENDOR_DIR}/${CHECKERS_DIR}/${skill}/scripts/shared/${payload.targetName}`
    if (showActions) console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${rel} (owned shared module payload)${RESET}`)
    if (!dryRun) {
      if (!journal) throw new Error('candidate generation requires a creation journal')
      written.push(...vendorSharedModulePayload(generationRoot, scriptsDir, skill, module, payload, journal, true))
    }
  }

  for (const module of sharedDependenciesOf(skill)) {
    const payload = sharedModulePayload(module)
    const rel = `${VENDOR_DIR}/${CHECKERS_DIR}/${skill}/scripts/vendored/${module.provider}/${payload.targetName}`
    if (showActions) console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${rel} (shared module payload)${RESET}`)
    if (!dryRun) {
      if (!journal) throw new Error('candidate generation requires a creation journal')
      written.push(...vendorSharedModulePayload(generationRoot, scriptsDir, skill, module, payload, journal))
    }
  }

  // HELP snapshot — rendered from the skill's SKILL.md at vendor time, the one
  // moment the sources are guaranteed present, so `.ki-meta/bin/ki-help` answers
  // offline in a target that has no SKILL.md files. This resolves
  // ADR-KI-HARNESS-006's former open question by rendered snapshot; drift is
  // covered by the manifest hash like every other vendored file.
  const helpAbs = join(destDir, 'help.md')
  const helpEnv = process.env.KI_BOOTSTRAP_TEST_HELP_PATH ? { ...process.env, PATH: process.env.KI_BOOTSTRAP_TEST_HELP_PATH } : process.env
  const help = execFileSync('bun', [join(skillDir('ki-bootstrap'), 'scripts', 'internal', 'repo-bootstrap', 'skill-help.ts'), skill], {
    cwd: join(SKILLS_ROOT, '..'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    env: helpEnv
  })
  if (showActions)
    console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${VENDOR_DIR}/${CHECKERS_DIR}/${skill}/help.md (help snapshot)${RESET}`)
  if (!dryRun) {
    mkdirSync(destDir, { recursive: true })
    if (journal) recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill))
    writeFileSync(helpAbs, help)
    if (journal) recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'help.md'))
    written.push({ rel: `${VENDOR_DIR}/${CHECKERS_DIR}/${skill}/help.md`, abs: helpAbs })
  }

  for (const f of written) {
    if (!dryRun) {
      if (!journal) throw new Error('candidate generation requires a creation journal')
      manifestFiles[f.rel] = hashJournalFile(journal, f.rel.slice(VENDOR_DIR.length + 1))
    }
  }
}

// Vendors one declared unit: a checker FILE is copied as-is; a COMMAND is wrapped
// in a thin generated script so it runs with no package.json in the target
// (ADR-KI-HARNESS-006 — "even a skill whose mechanical gate is a shared command...
// yields a unit runnable in a non-engineering, no-package.json repo").
function vendorOne(
  generationRoot: string,
  destDir: string,
  skill: string,
  mode: 'audit' | 'conform',
  unit: { kind: 'file'; path: string } | { kind: 'command'; command: string },
  dryRun: boolean,
  journal?: OwnedSnapshot,
  showActions = false
): VendoredFile[] {
  const destFile = `${mode}.ts`
  const rel = `${VENDOR_DIR}/${CHECKERS_DIR}/${skill}/scripts/${destFile}`
  const abs = join(destDir, destFile)
  if (unit.kind === 'file') {
    if (showActions) console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${rel} (file)${RESET}`)
    if (!dryRun) {
      mkdirSync(destDir, { recursive: true })
      if (journal) {
        recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill))
        recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'scripts'))
      }
      copyRegularFile(join(skillDir(skill), unit.path), abs)
      if (journal) recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'scripts', destFile))
    }
  } else {
    if (showActions) console.log(`${GREEN}vendor${RESET} ${skill} ${DIM}→ ${rel} (command wrapper)${RESET}`)
    if (!dryRun) {
      mkdirSync(destDir, { recursive: true })
      if (journal) {
        recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill))
        recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'scripts'))
      }
      writeFileSync(abs, commandWrapper(unit.command))
      if (journal) recordGenerated(journal, generationRoot, join(CHECKERS_DIR, skill, 'scripts', destFile))
    }
  }
  return [{ rel, abs }]
}

// A generated command wrapper — no package.json required. Runs the declared
// command with the target repo (arg 1, defaulting to '.') as cwd.
function commandWrapper(command: string): string {
  return `#!/usr/bin/env bun
// Generated by ki-bootstrap from a \`ki-vendors:\` command declaration. Do not edit —
// re-run EDUCATE to regenerate.
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

function scaffoldRepoConfig(target: string, targetIdentity: EntrySnapshot & { kind: 'directory' }, dryRun: boolean): void {
  const repoInit = join(skillDir('ki-repo'), 'scripts', 'educate.ts')
  if (!exactIdentity(target, targetIdentity) || realpathSync(target) !== target) {
    throw new Error('physical target changed before repository config scaffold')
  }
  try {
    execFileSync('bun', [repoInit, target, '--scaffold-config-only', ...(dryRun ? ['--dry-run'] : [])], { stdio: 'pipe' })
  } catch (error) {
    const result = error as { stderr?: Buffer | string }
    if (result.stderr) process.stderr.write(result.stderr)
    process.exit((error as { status?: number }).status ?? 1)
  }
  if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_REPLACE_ROOT_AFTER_SCAFFOLD_WITH) {
    renameSync(target, process.env.KI_BOOTSTRAP_TEST_REPLACE_ROOT_AFTER_SCAFFOLD_WITH)
    mkdirSync(target)
  }
  if (!exactIdentity(target, targetIdentity) || realpathSync(target) !== target) {
    throw new Error('physical target changed during repository config scaffold')
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

function assertDependenciesOrExit(target: string, set: string[]): void {
  try {
    assertExplicitDependencies(target, set)
  } catch (error) {
    if (!(error instanceof DependencyDeclarationError)) throw error
    console.error(`${'\x1b[31m'}FAIL${RESET}  [BOOT-9] ${error.message} — declare every dependency in .ki-config.toml`)
    process.exit(1)
  }
}

// A configured root is a target-local governance contract, not merely a name that
// happens to resolve in the harness index. Process skills and the bootstrap
// chain-starter stay globally installed, so they must not appear in a project's
// `.ki-config.toml`: they have no self-contained EDUCATE / AUDIT / CONFORM payload
// to publish. Check this before opening the `.ki-meta` transaction so a malformed
// declaration cannot produce a partial generated footprint.
function assertCompleteCapabilitySetOrExit(set: string[]): void {
  const incomplete: string[] = []
  for (const skill of set) {
    const declared = vendorModesOf(skill)
    const missingModes = VENDOR_MODES.filter((mode) => !declared?.includes(mode))
    const missingPayloads = (['educate', 'audit', 'conform'] as const).filter((mode) => vendorUnit(skill, mode) === null)
    if (missingModes.length || missingPayloads.length) {
      const details = [
        missingModes.length ? `ki-vendors: ${missingModes.join(', ')}` : '',
        missingPayloads.length ? `scripts: ${missingPayloads.map((mode) => `${mode}.ts`).join(', ')}` : ''
      ]
        .filter(Boolean)
        .join('; ')
      incomplete.push(`${skill} (${details})`)
    }
  }
  if (incomplete.length === 0) return
  console.error(
    `\x1b[31mFAIL${RESET}  [CAPABILITY-COMPLETE] declared skill roots must publish EDUCATE, AUDIT, and CONFORM locally: ${incomplete.join(
      ', '
    )} — remove process/global-only tables from .ki-config.toml, or repair the governance skill before EDUCATE`
  )
  process.exit(1)
}

function buildCandidate(
  staging: string,
  set: string[],
  ref: string,
  journal: OwnedSnapshot,
  showActions: boolean
): { files: Record<string, string>; tree: OwnedSnapshot } {
  const manifestFiles: Record<string, string> = {}
  mkdirSync(join(staging, CHECKERS_DIR), { mode: 0o755 })
  recordGenerated(journal, staging, CHECKERS_DIR)
  mkdirSync(join(staging, EDUCATORS_DIR), { mode: 0o755 })
  recordGenerated(journal, staging, EDUCATORS_DIR)
  mkdirSync(join(staging, 'bin'), { mode: 0o755 })
  recordGenerated(journal, staging, 'bin')
  for (const skill of set) {
    vendorSkill(staging, skill, false, manifestFiles, journal, showActions)
    vendorEducator(staging, skill, manifestFiles, journal, showActions)
  }
  vendorBootstrapPayload(staging, set, manifestFiles, journal, showActions)

  const aggregate = join(staging, 'bin', 'aggregate.ts')
  writeFileSync(aggregate, AGGREGATE_RUNNER)
  recordGenerated(journal, staging, join('bin', 'aggregate.ts'))
  writeFileSync(join(staging, 'bin', 'ki-audit'), BIN_KI_AUDIT)
  chmodSync(join(staging, 'bin', 'ki-audit'), 0o755)
  recordGenerated(journal, staging, join('bin', 'ki-audit'))
  writeFileSync(join(staging, 'bin', 'ki-conform'), BIN_KI_CONFORM)
  chmodSync(join(staging, 'bin', 'ki-conform'), 0o755)
  recordGenerated(journal, staging, join('bin', 'ki-conform'))
  writeFileSync(join(staging, 'bin', 'ki-educate'), binKiInit(ref))
  chmodSync(join(staging, 'bin', 'ki-educate'), 0o755)
  recordGenerated(journal, staging, join('bin', 'ki-educate'))
  writeFileSync(join(staging, 'bin', 'ki-help'), BIN_KI_HELP)
  chmodSync(join(staging, 'bin', 'ki-help'), 0o755)
  recordGenerated(journal, staging, join('bin', 'ki-help'))
  manifestFiles[join(VENDOR_DIR, 'bin', 'aggregate.ts')] = hashJournalFile(journal, join('bin', 'aggregate.ts'))

  if (set.includes('ki-harness')) {
    for (const name of HARNESS_BIN_SCRIPTS) {
      const destination = join(staging, 'bin', name)
      copyRegularFile(join(skillDir('ki-bootstrap'), 'scripts', 'internal', 'repo-bootstrap', name), destination)
      recordGenerated(journal, staging, join('bin', name))
      manifestFiles[join(VENDOR_DIR, 'bin', name)] = hashJournalFile(journal, join('bin', name))
    }
    if (showActions)
      console.log(`${GREEN}bin${RESET} ${DIM}→ ${VENDOR_DIR}/bin/{${HARNESS_BIN_SCRIPTS.join(', ')}} (harness cross-skill scripts)${RESET}`)
  }

  writeFileSync(join(staging, 'manifest.json'), `${JSON.stringify({ ref, files: manifestFiles }, null, 2)}\n`)
  recordGenerated(journal, staging, 'manifest.json')
  maybeInjectStagedMutation(staging)
  return { files: manifestFiles, tree: validateGeneration(staging, journal, manifestFiles) }
}

function validateTransactionParents(
  target: string,
  targetIdentity: EntrySnapshot & { kind: 'directory' },
  metaDir: string,
  metaIdentity: EntrySnapshot & { kind: 'directory' },
  lockPath: string,
  lockIdentity: EntrySnapshot & { kind: 'file' }
): void {
  if (!exactIdentity(target, targetIdentity) || realpathSync(target) !== target) {
    throw new Error('physical target changed before publication')
  }
  if (!exactIdentity(metaDir, metaIdentity) || realpathSync(metaDir) !== metaDir || dirname(metaDir) !== target) {
    throw new Error(`${VENDOR_DIR} changed before publication`)
  }
  if (!exactIdentity(lockPath, lockIdentity)) throw new Error('bootstrap lock changed before publication')
}

function validateDestinationShape(metaDir: string, candidate: OwnedSnapshot, includeManifest: boolean): OwnedSnapshot {
  const current = snapshotOwned(metaDir)
  const expectedEntries = [...candidate.entries()].filter(([rel]) => includeManifest || rel !== 'manifest.json')
  const currentEntries = [...current.entries()].filter(([rel]) => includeManifest || rel !== 'manifest.json')
  if (expectedEntries.length !== currentEntries.length) throw new Error('published generation has an unexpected owned-entry set')
  for (const [rel, expected] of expectedEntries) {
    if (!sameSnapshot(expected, current.get(rel), false)) throw new Error(`published generation differs at ${join(VENDOR_DIR, rel)}`)
  }
  return current
}

function validateStagingForCleanup(staging: string, identity: EntrySnapshot, candidate: OwnedSnapshot): void {
  if (!exactIdentity(staging, identity)) throw new Error(`refusing staging cleanup after identity change: ${staging}`)
  const current = new Map<string, EntrySnapshot>()
  for (const name of readdirSync(staging).sort()) snapshotTree(staging, name, current)
  for (const [rel, entry] of current) {
    if (!sameSnapshot(entry, candidate.get(rel))) throw new Error(`refusing staging cleanup after content change: ${rel}`)
  }
}

function cleanupTrustedStaging(staging: string, identity: EntrySnapshot): void {
  cleanupExact(staging, identity, true)
}

function maybeInjectRollbackConflict(metaDir: string): void {
  if (process.env.NODE_ENV !== 'test') return
  const rel = process.env.KI_BOOTSTRAP_TEST_ROLLBACK_CONFLICT_REL
  if (!rel) return
  const destination = join(metaDir, rel)
  const entry = lstatOrNull(destination)
  if (!entry?.isFile() || entry.isSymbolicLink()) return
  writeFileSync(destination, 'third-party rollback conflict\n')
}

function maybeInjectPrePublicationReplacement(metaDir: string): void {
  if (process.env.NODE_ENV !== 'test') return
  const rel = process.env.KI_BOOTSTRAP_TEST_PREPUBLISH_REPLACE_REL
  if (!rel) return
  const destination = join(metaDir, rel)
  const before = snapshotEntry(destination)
  if (before.kind !== 'file') throw new Error(`test replacement is not a regular file: ${rel}`)
  restoreSnapshot(destination, before)
}

function maybeInjectPruneConflict(metaDir: string, rel: string): void {
  if (process.env.NODE_ENV !== 'test' || process.env.KI_BOOTSTRAP_TEST_PRUNE_CONFLICT_REL !== rel) return
  writeFileSync(join(metaDir, rel), 'third-party prune conflict\n')
}

function maybeInjectStagedMutation(staging: string): void {
  if (process.env.NODE_ENV !== 'test') return
  const rel = process.env.KI_BOOTSTRAP_TEST_MUTATE_STAGED_REL
  if (rel) writeFileSync(join(staging, rel), 'third-party staged mutation\n')
}

function maybeInjectLateDestinationMutation(
  metaDir: string,
  phase: 'pre-manifest' | 'between-validation-manifest' | 'post-manifest'
): void {
  if (process.env.NODE_ENV !== 'test') return
  const phaseKey =
    phase === 'pre-manifest'
      ? 'PRE_MANIFEST'
      : phase === 'between-validation-manifest'
        ? 'BETWEEN_VALIDATION_AND_MANIFEST'
        : 'POST_MANIFEST'
  const rel = process.env[`KI_BOOTSTRAP_TEST_LATE_${phaseKey}_REL`]
  if (!rel) return
  const destination = join(metaDir, rel)
  const before = snapshotEntry(destination)
  if (before.kind !== 'file') throw new Error(`test late mutation is not a regular file: ${rel}`)
  restoreSnapshot(destination, before)
}

interface Quarantine {
  path: string
  next: number
  entries: QuarantinedEntry[]
}

function createPrivateSnapshot(path: string, expected: EntrySnapshot & { kind: 'file' }): string {
  const snapshotPath = `${path}.snapshot`
  const fd = openSync(snapshotPath, 'wx', 0o600)
  try {
    writeFileSync(fd, expected.bytes)
    fsyncSync(fd)
    chmodSync(snapshotPath, expected.mode)
  } finally {
    closeSync(fd)
  }
  const privateSnapshot = snapshotEntry(snapshotPath)
  if (!sameSnapshot(expected, privateSnapshot, false)) throw new Error(`private quarantine snapshot differs: ${snapshotPath}`)
  return snapshotPath
}

function createQuarantine(staging: string): Quarantine {
  const path = join(staging, '.quarantine')
  mkdirSync(path, { mode: 0o700 })
  chmodSync(path, 0o700)
  return { path, next: 0, entries: [] }
}

function quarantineExisting(metaDir: string, rel: string, expected: EntrySnapshot, quarantine: Quarantine): QuarantinedEntry {
  const destination = join(metaDir, rel)
  const movedPath = join(quarantine.path, `${String(quarantine.next++).padStart(6, '0')}-${rel.replaceAll('/', '_')}`)
  renameSync(destination, movedPath)
  const entry: QuarantinedEntry = { rel, expected, path: movedPath, movedPath }
  quarantine.entries.push(entry)
  try {
    if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_FAIL_QUARANTINE_SNAPSHOT_REL === rel) {
      throw new Error(`injected post-rename snapshot failure for ${rel}`)
    }
    const moved = snapshotEntry(movedPath)
    const changed = !sameSnapshot(expected, moved) || (moved.kind === 'directory' && readdirSync(movedPath).length > 0)
    if (!changed) {
      if (expected.kind === 'file') entry.path = createPrivateSnapshot(movedPath, expected)
      if (
        process.env.NODE_ENV === 'test' &&
        process.env.KI_BOOTSTRAP_TEST_MUTATE_ALIAS_AFTER_QUARANTINE_REL === rel &&
        process.env.KI_BOOTSTRAP_TEST_MUTATE_ALIAS_PATH
      ) {
        writeFileSync(process.env.KI_BOOTSTRAP_TEST_MUTATE_ALIAS_PATH, 'external hard-link mutation\n')
      }
      return entry
    }
  } catch (error) {
    if (expected.kind === 'file') {
      const moved = lstatOrNull(movedPath)
      if (moved?.isFile() && !moved.isSymbolicLink() && moved.dev === expected.dev && moved.ino === expected.ino) {
        try {
          linkSync(movedPath, destination)
        } catch {
          // Preserve both paths and report the conflict below.
        }
      }
    }
    throw new RollbackConflictError(
      `destination could not be validated after quarantine: ${join(VENDOR_DIR, rel)}; preserved at ${movedPath}; ${(error as Error).message}`
    )
  }
  if (expected.kind === 'file') {
    try {
      linkSync(movedPath, destination)
    } catch {
      // Preserve both paths and report the conflict below.
    }
  }
  throw new RollbackConflictError(`destination changed during quarantine: ${join(VENDOR_DIR, rel)}; preserved at ${movedPath}`)
}

function maybeInjectPostQuarantineRecreation(metaDir: string, rel: string): void {
  if (process.env.NODE_ENV !== 'test' || process.env.KI_BOOTSTRAP_TEST_POST_QUARANTINE_RECREATE_REL !== rel) return
  writeFileSync(join(metaDir, rel), 'third-party post-check replacement\n', { flag: 'wx' })
}

function restoreQuarantined(metaDir: string, entry: QuarantinedEntry): void {
  const destination = join(metaDir, entry.rel)
  if (entry.expected.kind === 'file') {
    linkSync(entry.path, destination)
    return
  }
  mkdirSync(destination, { mode: entry.expected.mode })
  chmodSync(destination, entry.expected.mode)
}

function rollbackPublishedDestination(metaDir: string, item: PublishedEntry, quarantine: Quarantine): void {
  quarantineExisting(metaDir, item.rel, item.after, quarantine)
}

function finalizeTransaction(
  metaDir: string,
  lock: { path: string; identity: EntrySnapshot & { kind: 'file' } },
  staging: { path: string; identity: EntrySnapshot & { kind: 'directory' } },
  quarantine?: Quarantine
): void {
  const privateQuarantine = quarantine ?? createQuarantine(staging.path)
  if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_REPLACE_LOCK_AFTER_CHECK === '1') {
    if (!exactIdentity(lock.path, lock.identity)) throw new RollbackConflictError('bootstrap lock changed before final quarantine')
    restoreSnapshot(lock.path, { ...lock.identity, bytes: Buffer.from('third-party lock replacement\n') })
  }
  quarantineExisting(metaDir, '.bootstrap.lock', lock.identity, privateQuarantine)
  cleanupTrustedStaging(staging.path, staging.identity)
}

function createCleanupStaging(metaDir: string): { path: string; identity: EntrySnapshot & { kind: 'directory' } } {
  const path = mkdtempSync(join(metaDir, '.bootstrap-staging-cleanup-'))
  chmodSync(path, 0o700)
  const identity = snapshotEntry(path)
  if (identity.kind !== 'directory') throw new Error('bootstrap cleanup staging entry is not a directory')
  return { path, identity }
}

function publishCandidate(
  target: string,
  targetIdentity: EntrySnapshot & { kind: 'directory' },
  metaDir: string,
  metaIdentity: EntrySnapshot & { kind: 'directory' },
  lock: { path: string; identity: EntrySnapshot & { kind: 'file' } },
  staging: { path: string; identity: EntrySnapshot & { kind: 'directory' } },
  before: OwnedSnapshot,
  candidate: OwnedSnapshot
): void {
  const published: PublishedEntry[] = []
  const displaced: QuarantinedEntry[] = []
  const createdDirectories: CreatedDirectory[] = []
  const quarantine = createQuarantine(staging.path)
  let publicationCount = 0

  try {
    validateTransactionParents(target, targetIdentity, metaDir, metaIdentity, lock.path, lock.identity)
    if (!sameOwnedSnapshot(before, snapshotOwned(metaDir))) throw new Error('owned bootstrap destinations changed before publication')

    const candidateDirectories = [...candidate.entries()]
      .filter(([, entry]) => entry.kind === 'directory')
      .sort(([a], [b]) => a.split('/').length - b.split('/').length || a.localeCompare(b))
    for (const [rel] of candidateDirectories) {
      const expected = before.get(rel)
      if (expected) {
        if (expected.kind !== 'directory') throw new Error(`owned destination is not a directory: ${join(VENDOR_DIR, rel)}`)
        assertCurrent(metaDir, rel, expected)
        continue
      }
      const destination = join(metaDir, rel)
      mkdirSync(destination, { mode: 0o755 })
      const identity = snapshotEntry(destination)
      if (identity.kind !== 'directory') throw new Error(`failed to create owned directory: ${join(VENDOR_DIR, rel)}`)
      createdDirectories.push({ rel, identity })
    }

    const candidateFiles = [...candidate.entries()]
      .filter(([rel, entry]) => entry.kind === 'file' && rel !== 'manifest.json')
      .sort(([a], [b]) => a.localeCompare(b)) as [string, EntrySnapshot & { kind: 'file' }][]
    for (const [rel, next] of candidateFiles) {
      const old = before.get(rel)
      if (old?.kind === 'directory') throw new Error(`owned destination is not a file: ${join(VENDOR_DIR, rel)}`)
      assertCurrent(metaDir, rel, old)
      const source = join(staging.path, rel)
      const destination = join(metaDir, rel)
      if (old?.kind === 'file' && sameSnapshot(old, next, false)) continue
      let quarantined: QuarantinedEntry | undefined
      if (old) {
        quarantined = quarantineExisting(metaDir, rel, old, quarantine)
        displaced.push(quarantined)
      }
      maybeInjectPostQuarantineRecreation(metaDir, rel)
      linkSync(source, destination)
      published.push({ rel, before: quarantined, after: next })
      assertCurrent(metaDir, rel, next)
      maybeInjectPublicationFailure(++publicationCount)
    }

    const obsoleteFiles = [...before.entries()]
      .filter(
        ([rel, entry]) =>
          entry.kind === 'file' &&
          (rel.startsWith(`${CHECKERS_DIR}/`) ||
            rel.startsWith(`${EDUCATORS_DIR}/`) ||
            rel.startsWith(`${BOOTSTRAP_DIR}/`) ||
            rel.startsWith(`${RETIRED_CHECKERS_DIR}/`) ||
            rel.startsWith('bin/')) &&
          !candidate.has(rel)
      )
      .sort(([a], [b]) => a.localeCompare(b))
    for (const [rel, entry] of obsoleteFiles) {
      maybeInjectPruneConflict(metaDir, rel)
      displaced.push(quarantineExisting(metaDir, rel, entry, quarantine))
    }

    const obsoleteDirectories = [...before.entries()]
      .filter(
        ([rel, entry]) =>
          entry.kind === 'directory' &&
          (rel === CHECKERS_DIR ||
            rel === EDUCATORS_DIR ||
            rel === BOOTSTRAP_DIR ||
            rel === RETIRED_CHECKERS_DIR ||
            rel === 'bin' ||
            rel.startsWith(`${CHECKERS_DIR}/`) ||
            rel.startsWith(`${EDUCATORS_DIR}/`) ||
            rel.startsWith(`${BOOTSTRAP_DIR}/`) ||
            rel.startsWith(`${RETIRED_CHECKERS_DIR}/`) ||
            rel.startsWith('bin/')) &&
          !candidate.has(rel)
      )
      .sort(([a], [b]) => b.split('/').length - a.split('/').length || b.localeCompare(a))
    for (const [rel, entry] of obsoleteDirectories) {
      displaced.push(quarantineExisting(metaDir, rel, entry, quarantine))
    }

    const beforeManifest = snapshotOwned(metaDir)
    maybeInjectLateDestinationMutation(metaDir, 'pre-manifest')
    if (!sameOwnedSnapshot(beforeManifest, snapshotOwned(metaDir))) {
      throw new Error('owned bootstrap destinations changed before manifest publication')
    }
    validateDestinationShape(metaDir, candidate, false)
    validateTransactionParents(target, targetIdentity, metaDir, metaIdentity, lock.path, lock.identity)
    maybeInjectLateDestinationMutation(metaDir, 'between-validation-manifest')

    const nextManifest = candidate.get('manifest.json')
    if (nextManifest?.kind !== 'file') throw new Error('candidate manifest is not a regular file')
    const oldManifest = before.get('manifest.json')
    if (oldManifest?.kind === 'directory') throw new Error('owned manifest destination is not a file')
    assertCurrent(metaDir, 'manifest.json', oldManifest)
    let finalManifestIdentity = oldManifest
    if (!(oldManifest?.kind === 'file' && sameSnapshot(oldManifest, nextManifest, false))) {
      let quarantined: QuarantinedEntry | undefined
      if (oldManifest) {
        quarantined = quarantineExisting(metaDir, 'manifest.json', oldManifest, quarantine)
        displaced.push(quarantined)
      }
      maybeInjectPostQuarantineRecreation(metaDir, 'manifest.json')
      linkSync(join(staging.path, 'manifest.json'), join(metaDir, 'manifest.json'))
      published.push({ rel: 'manifest.json', before: quarantined, after: nextManifest })
      assertCurrent(metaDir, 'manifest.json', nextManifest)
      finalManifestIdentity = nextManifest
      maybeInjectPublicationFailure(++publicationCount)
    }
    const expectedComplete = new Map(beforeManifest)
    if (finalManifestIdentity) expectedComplete.set('manifest.json', finalManifestIdentity)
    else expectedComplete.delete('manifest.json')
    const complete = validateDestinationShape(metaDir, candidate, true)
    if (!sameOwnedSnapshot(expectedComplete, complete)) {
      throw new Error('owned bootstrap destination identities changed during manifest publication')
    }
    maybeInjectLateDestinationMutation(metaDir, 'post-manifest')
    if (!sameOwnedSnapshot(expectedComplete, snapshotOwned(metaDir))) {
      throw new Error('owned bootstrap destinations changed after manifest publication')
    }
    validateTransactionParents(target, targetIdentity, metaDir, metaIdentity, lock.path, lock.identity)
  } catch (error) {
    maybeInjectRollbackConflict(metaDir)
    const conflicts: string[] = error instanceof RollbackConflictError ? [error.message] : []

    for (const item of [...published].reverse()) {
      try {
        rollbackPublishedDestination(metaDir, item, quarantine)
      } catch {
        conflicts.push(join(VENDOR_DIR, item.rel))
      }
    }

    const directories = displaced.filter((item) => item.expected.kind === 'directory').reverse()
    const files = displaced.filter((item) => item.expected.kind === 'file').reverse()
    for (const item of [...directories, ...files]) {
      try {
        restoreQuarantined(metaDir, item)
      } catch {
        conflicts.push(join(VENDOR_DIR, item.rel))
      }
    }

    for (const item of [...createdDirectories].reverse()) {
      try {
        quarantineExisting(metaDir, item.rel, item.identity, quarantine)
      } catch {
        conflicts.push(join(VENDOR_DIR, item.rel))
      }
    }

    if (conflicts.length > 0) {
      throw new RollbackConflictError(`${(error as Error).message}; rollback conflicts: ${[...new Set(conflicts)].join(', ')}`)
    }
    finalizeTransaction(metaDir, lock, staging, quarantine)
    throw error
  }

  finalizeTransaction(metaDir, lock, staging, quarantine)
}

function runBootstrapTransaction(
  target: string,
  targetIdentity: EntrySnapshot & { kind: 'directory' },
  set: string[],
  ref: string,
  showActions: boolean
): void {
  if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_REPLACE_BOUND_ROOT_WITH) {
    renameSync(target, process.env.KI_BOOTSTRAP_TEST_REPLACE_BOUND_ROOT_WITH)
    mkdirSync(target)
  }
  const established = establishMeta(target, targetIdentity)
  const metaIdentity = snapshotEntry(established.path)
  if (metaIdentity.kind !== 'directory') throw new Error(`${VENDOR_DIR} is not a directory`)
  let lock: ReturnType<typeof acquireLock> | undefined
  let staging: ReturnType<typeof createStaging> | undefined
  const buildJournal: OwnedSnapshot = new Map()
  try {
    if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_RACE_META_CLEANUP === '1') {
      writeFileSync(join(established.path, 'third-party-sentinel'), 'preserve me\n')
      writeFileSync(join(established.path, '.bootstrap.lock'), 'third-party lock\n')
    }
    lock = acquireLock(established.path)
    validateRetiredCheckerLayout(established.path)
    const before = snapshotOwned(established.path)
    staging = createStaging(established.path)
    const { tree } = buildCandidate(staging.path, set, ref, buildJournal, showActions)
    maybeInjectPrePublicationReplacement(established.path)
    publishCandidate(target, targetIdentity, established.path, metaIdentity, lock, staging, before, tree)
    lock = undefined
    staging = undefined
  } catch (error) {
    if (error instanceof RollbackConflictError) throw error
    if (staging && exactIdentity(staging.path, staging.identity)) {
      try {
        validateStagingForCleanup(staging.path, staging.identity, buildJournal)
      } catch (cleanupError) {
        throw new RollbackConflictError(`${(error as Error).message}; staging cleanup conflict: ${(cleanupError as Error).message}`)
      }
    }
    if (lock && exactIdentity(lock.path, lock.identity)) {
      const cleanupStaging = staging && exactIdentity(staging.path, staging.identity) ? staging : createCleanupStaging(established.path)
      finalizeTransaction(established.path, lock, cleanupStaging)
    } else if (lock && lstatOrNull(lock.path)) {
      throw new RollbackConflictError(`${(error as Error).message}; bootstrap lock changed before cleanup`)
    }
    throw error
  } finally {
    if (established.created && exactIdentity(established.path, established.created) && readdirSync(established.path).length === 0) {
      rmdirSync(established.path)
    }
  }
}

function publishRuntimeSkillPayloads(target: string, dryRun: boolean, showActions: boolean): void {
  const args = [join(import.meta.dirname, 'publish-project-skills.ts')]
  args.push(target)
  if (dryRun) args.push('--dry-run')
  if (!showActions) args.push('--quiet')
  try {
    execFileSync('bun', args, { stdio: 'inherit' })
  } catch {
    throw new Error('project runtime skill publication failed')
  }
}

// A fresh `ki-repo` seed writes this required declaration. During a dry run there is
// deliberately no `.ki-config.toml` to hand to the publisher, so preview the same
// runtime payload plan without creating a transient target file.
const SCAFFOLDED_SUPPORTED_RUNTIMES = ['claude-code', 'codex']
function previewScaffoldedRuntimePayloads(set: string[]): void {
  for (const runtime of SCAFFOLDED_SUPPORTED_RUNTIMES) {
    for (const skill of set) console.log(`${GREEN}copy${RESET}  [${runtime}] ${skill} ${DIM}(generated runtime payload)${RESET}`)
  }
  console.log(`${GREEN}ignore${RESET} .gitignore ${DIM}(generated runtime payloads)${RESET}`)
}

export const educateRepository = (argv: string[] = process.argv.slice(2)): void => {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('usage: repo-bootstrap.ts <target-repo> [--seed <skill>] [--ref <ref>] [--dry-run] [--verbose]')
    console.log('  vendors the resolved governance set into an atomic .ki-meta generation')
    return
  }
  // Pull the value-taking flags out first so their values are not mistaken for
  // the positional target: `--seed <skill>` (repeatable — a per-skill delegator
  // passes `--seed <self>`) and `--ref <ref>` (passed by `ki-educate` so a tarball
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
  const boundTarget = physicalTarget(positional[0] ?? '.')
  const target = boundTarget.path
  const dryRun = rest.includes('--dry-run')
  const verbose = rest.includes('--verbose')

  // No `package.json` is ever required or touched — a repo self-governs through the
  // vendored `.ki-meta/` runner and its `bin/` wrappers alone (dotfiles, KB, tap, or
  // code repo alike). The `ki:*` convenience keys are ki-engineering's to wire, as
  // sugar over these same bins. Vendoring is always coverage-scoped (`.ki-config.toml`
  // + explicit dependencies + explicit --seed) — `--all` is a linking concept only, never a
  // vendoring one (ADR-KI-HARNESS-007).
  let set = resolvedSetOrExit(target, seeds)

  // ki-repo owns the file-level contract and foundation-marker scaffold. Once
  // initial resolution proves every declared/seeded root valid, compose that leg
  // before any .ki-meta mutation, then re-resolve against the converged config.
  // Bare bootstrap with no config/seed resolves no ki-repo and remains empty-set.
  if (set.includes('ki-repo')) {
    scaffoldRepoConfig(target, boundTarget.identity, dryRun)
    set = dryRun ? [...new Set([...set, ...dependsOnOf('ki-repo')])].sort() : resolvedSetOrExit(target, seeds)
  }
  if (!dryRun) assertDependenciesOrExit(target, set)
  assertCompleteCapabilitySetOrExit(set)
  console.log(`${DIM}EDUCATE ${target} — ${set.length} governed skill${set.length === 1 ? '' : 's'}${RESET}`)
  if (verbose && set.length) console.log(`${DIM}scope: ${set.join(', ')}${RESET}`)

  const ref = resolveRef(refOverride ?? harnessRef())
  const aggRel = join(VENDOR_DIR, 'bin', 'aggregate.ts')
  const auditBinRel = join(VENDOR_DIR, 'bin', 'ki-audit')
  const conformBinRel = join(VENDOR_DIR, 'bin', 'ki-conform')
  const initBinRel = join(VENDOR_DIR, 'bin', 'ki-educate')
  const helpBinRel = join(VENDOR_DIR, 'bin', 'ki-help')
  const manifestRel = join(VENDOR_DIR, 'manifest.json')
  if (dryRun) {
    const manifestFiles: Record<string, string> = {}
    for (const skill of set) {
      vendorSkill(join(target, VENDOR_DIR), skill, true, manifestFiles, undefined, true)
      if (vendorModesOf(skill)?.includes('educate'))
        console.log(
          `${GREEN}vendor${RESET} ${skill} ${DIM}→ ${VENDOR_DIR}/${EDUCATORS_DIR}/${skill} (self-contained educator payload)${RESET}`
        )
    }
    console.log(
      `${GREEN}vendor${RESET} bootstrap ${DIM}→ ${VENDOR_DIR}/${BOOTSTRAP_DIR} (local whole-set coordinator and source catalogue)${RESET}`
    )
  } else runBootstrapTransaction(target, boundTarget.identity, set, ref, verbose)
  // Runtime payloads are separate from `.ki-meta/`: every target receives complete,
  // standalone copies. Deliberate local-author links are a ki-repo concern and are
  // never selected implicitly by repository bootstrap.
  if (set.length) {
    if (dryRun && set.includes('ki-repo') && !existsSync(join(target, '.ki-config.toml'))) previewScaffoldedRuntimePayloads(set)
    else publishRuntimeSkillPayloads(target, dryRun, dryRun || verbose)
  }
  if (dryRun || verbose) {
    console.log(
      `${GREEN}runner${RESET} ${DIM}→ ${aggRel}, ${auditBinRel}, ${conformBinRel}, ${initBinRel}, ${helpBinRel}, ${manifestRel}${RESET}`
    )
  }
  console.log(
    dryRun
      ? `${YELLOW}EDUCATE dry run complete — no files changed${RESET}`
      : `${GREEN}EDUCATE complete — .ki-meta governance and runtime payloads are current${RESET}`
  )
}

if (import.meta.main) educateRepository()
