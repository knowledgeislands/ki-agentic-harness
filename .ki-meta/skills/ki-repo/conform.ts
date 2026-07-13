#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the Knowledge Islands repo standard — the [M] half of
 * references/repo-standard.md's "Applying it" recipe, scripted so it needn't be
 * copy-pasted by hand per repo.
 *
 * Scope: a single target repo (default cwd), matching how ki-bootstrap scaffolds
 * `ki:repo:conform` (`bun .../conform.ts .`) — not an org sweep like
 * audit.ts's `--org`, since conforming mutates and should be reviewed per-repo.
 *
 *   bun scripts/conform.ts [path]      # default: cwd
 *   --dry-run                                # print the plan, run nothing
 *   --json                                   # emit the cited-finding wrapper (audit's shape)
 *
 * Each action records a cited finding on the shared ladder — written/enabled/set → POLISH,
 * already-conformant → PASS, action failed → FAIL, judgment manual-TODO → ADVISORY — so the
 * aggregate renders conform and audit identically. `--json` governs *reporting*, `--dry-run`
 * governs *writing*; the two compose. A single atomic `gh` call that satisfies several fine
 * audit checks (merge+delete-branch, secret-scanning+push-protection) cites the parent code
 * and enumerates the covered checks; audit still emits each fine check with its own code.
 *
 * Every GitHub-settings action reads live state first (the same REST fields `audit.ts` checks,
 * via one `repos/${nwo}` fetch plus a handful of per-setting reads) and only issues a `gh` call
 * when that setting actually differs from the standard — an already-conformant setting records
 * PASS and is never re-written. This matters because a `gh` write is not silently free: it's a
 * live mutation (and, for branch-protection, PUT fully replaces the rule rather than patching
 * it), so skip-when-conformant is the correct behavior, not just a nicety.
 *
 * Applies, via `gh`:
 *   - Layer 2: merge method (squash-only), auto-delete-branch, Wiki/Projects off,
 *     Issues on, topics (public, standard set), branch protection (present-but-off
 *     by default; stripped unless the repo's [ki-repo.checks] opts branch-protection
 *     in, in which case the standard protection set is applied).
 *   - Layer 3: Dependabot alerts + security updates, allow_update_branch, secret
 *     scanning + push protection (public), Actions allowed_actions = all.
 * Scaffolds locally (only when absent, never overwritten):
 *   - .gitignore — from this skill's own template.
 *   - .ki-config.toml's [ki-repo] block — audit.ts's `--init` template.
 * `.editorconfig` is owned by ki-authoring (it backs that skill's own Markdown
 * conform pass), not this skill.
 *
 * Deliberately NEVER touches (judgment — printed as manual TODOs instead):
 *   - README.md content, LICENSE content.
 *   - The GitHub description text, and whether visibility is the right call.
 *   - Whether a [ki-repo.checks] override is warranted for this repo.
 *   - default-branch rename (destructive; a repo not on `main` needs a deliberate,
 *     reviewed rename, not a scripted one).
 *
 * Requires `gh` authenticated with repo-admin scope. No npm dependencies.
 * Exit code is non-zero only on an unrecoverable error (can't resolve nameWithOwner).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── the standard (kept in sync with audit.ts / references/repo-standard.md) ──
const TOPICS = ['mcp', 'model-context-protocol', 'claude', 'typescript', 'bun']
const REQUIRED_CHECK = 'build'
const ALLOWED_ACTIONS = 'all'
// Reference-doc pointers carried on every finding — identical to audit.ts, so a criterion
// cites the same (area, ref) in both. STD is the standard a mechanical action applies;
// RUBRIC is where the judgment (manual-TODO) criteria live.
const STD = 'references/repo-standard.md'
const RUBRIC = 'references/audit-rubric.md'
const CHECK_DEFAULTS: Record<string, boolean> = {
  'branch-protection': false,
  wiki: true,
  projects: true,
  issues: true,
  topics: true,
  'secret-scanning': true,
  'push-protection': true
}
const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'ki-repo'
const KI_DEFAULT = `[${KI_SECTION}]
visibility = "private"   # "public" | "private" — must match the repo's actual GitHub visibility

# Per-repo check overrides — true = enforce, false = don't. Omit any check to take
# the org default; a repo that fully conforms needs nothing here.
# [${KI_SECTION}.checks]
# branch-protection = true   # default off — protect \`main\` on this repo
# wiki = false               # default on  — allow this repo's Wiki
`
const GITIGNORE_DEFAULT = 'node_modules/\n.DS_Store\n.ki-meta/audits/\n.ki-meta/conform/\n'

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const json = argv.includes('--json')
const say = (line: string): void => {
  if (!json) console.log(line)
}

// Collect-then-emit harness (mirrors audit.ts / ki-authoring conform). Each action records
// a cited finding; `say` prints the human line only when not in --json mode, so a direct run
// streams prose while the aggregate consumes the JSON wrapper. `--json` governs *reporting*;
// `--dry-run` governs *writing* — the two compose. Level ladder: written/enabled/set → POLISH,
// already-conformant → PASS, action failed → FAIL, judgment/manual-TODO → ADVISORY.
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
const findings: Finding[] = []
const rec = (level: Level, area: string, msg: string, ref?: string, file?: string): void =>
  void findings.push({ level, area, msg, ref, file })

// `gh()` applies one GitHub setting. `area` is the rubric code it satisfies; when a single
// atomic `gh` call covers several fine audit checks (e.g. merge + delete-branch), `covers`
// enumerates them in the msg while `area` stays the bundle's parent code — audit still emits
// each fine check with its own code. dry-run records the planned action as POLISH.
const gh = (args: string[], area: string, label: string, covers?: string): void => {
  const detail = covers ? `${label} (covers: ${covers})` : label
  if (dryRun) {
    say(`  ${paint(C.dim, '$')} gh ${args.join(' ')}`)
    rec('POLISH', area, `would ${detail}`, STD)
    return
  }
  try {
    execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
    say(`  ${paint(C.green, 'ok')}    ${label}`)
    rec('POLISH', area, detail, STD)
  } catch (e) {
    const m = String((e as Error).message ?? e).split('\n')[0]
    say(`  ${paint(C.red, 'fail')}  ${label} — ${m}`)
    rec('FAIL', area, `${detail} — ${m}`, STD)
  }
}
const ghJSON = (apiPath: string): unknown => JSON.parse(execFileSync('gh', ['api', apiPath], { encoding: 'utf8' }))
const ghOk = (apiPath: string): boolean => {
  try {
    execFileSync('gh', ['api', apiPath], { encoding: 'utf8' })
    return true
  } catch {
    return false
  }
}

// `ghIfNeeded` is `gh()`'s conformance-checked twin: when `already` is true the setting is
// left untouched and recorded PASS; otherwise it delegates to `gh()` as before (which itself
// still records POLISH on write / FAIL on error, dry-run included).
const ghIfNeeded = (already: boolean, args: string[], area: string, label: string, covers?: string): void => {
  if (already) {
    const detail = covers ? `${label} (covers: ${covers})` : label
    say(`  ${paint(C.dim, 'ok')}    ${detail} — already conformant`)
    rec('PASS', area, `${detail} already conformant`, STD)
    return
  }
  gh(args, area, label, covers)
}

// Same minimal parser as audit.ts.
type KiConfig = { visibility?: string; checks: Record<string, boolean> }
const CHECKS_SECTION = `${KI_SECTION}.checks`
function parseKiConfig(text: string): KiConfig | null {
  let section = ''
  let seen = false
  const out: KiConfig = { checks: {} }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) continue
    const header = line.match(/^\[(.+)\]$/)
    if (header) {
      section = (header[1] as string).trim()
      if (section === KI_SECTION || section === CHECKS_SECTION) seen = true
      continue
    }
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    const val = line.slice(eq + 1).trim()
    if (section === KI_SECTION && key === 'visibility') out.visibility = val.replace(/^["']|["']$/g, '')
    else if (section === CHECKS_SECTION && (val === 'true' || val === 'false')) out.checks[key] = val === 'true'
  }
  return seen ? out : null
}

function gitOrigin(dir: string): string | null {
  try {
    return execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}
const GH_REMOTE = /github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/

// ── entry ──
const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

const origin = gitOrigin(target)
const m = origin?.match(GH_REMOTE)
if (!m) {
  console.error(paint(C.red, `${target}: origin is not on github.com (${origin ?? 'no origin'}) — nothing to conform`))
  process.exit(1)
}
const nwo = `${m[1]}/${m[2]}`

const kiPath = join(target, KI_CONFIG)
const kiText = existsSync(kiPath) ? readFileSync(kiPath, 'utf8') : ''
const ki = kiText ? parseKiConfig(kiText) : null
const enforced = (id: string): boolean => ki?.checks[id] ?? CHECK_DEFAULTS[id] ?? true

type RepoInfo = {
  private?: boolean
  has_wiki?: boolean
  has_projects?: boolean
  has_issues?: boolean
  allow_merge_commit?: boolean
  allow_rebase_merge?: boolean
  allow_squash_merge?: boolean
  delete_branch_on_merge?: boolean
  allow_update_branch?: boolean
  security_and_analysis?: {
    secret_scanning?: { status?: string }
    secret_scanning_push_protection?: { status?: string }
  }
}
let repoInfo: RepoInfo
try {
  repoInfo = ghJSON(`repos/${nwo}`) as RepoInfo
} catch {
  console.error(paint(C.red, `could not read repos/${nwo} via gh — is gh authenticated? (gh auth status)`))
  process.exit(1)
}
const isPublic = !repoInfo.private

say(paint(C.dim, `target: ${nwo}   ${isPublic ? 'public' : 'private'}${dryRun ? '   (dry run)' : ''}\n`))

// ── local file scaffolding (only when absent; never overwrite) ──
// A scaffold line cites the presence-check code (audit's `gitignore` / `ki-config`) with
// file = the scaffolded path: written → POLISH, already present → PASS (never overwritten).
// The scaffolded filename is the FIRST argument by contract — ki-skills SHAPE-16 reads
// the leading string literal of each scaffold/syncOwned call cross-skill to check the
// file is declared under `owns:`, so the real path (not the area code) must lead.
function scaffold(name: string, area: string, path: string, content: string): void {
  if (existsSync(path)) {
    rec('PASS', area, `${name} already present`, STD, name)
    return
  }
  rec('POLISH', area, `${name} scaffolded (was missing)`, STD, name)
  say(`  ${paint(C.green, 'write')} ${name}`)
  if (!dryRun) writeFileSync(path, content)
}
scaffold('.gitignore', 'FILES-1', join(target, '.gitignore'), GITIGNORE_DEFAULT)
if (!ki) {
  rec(
    'POLISH',
    'FILES-1',
    `${KI_CONFIG} [${KI_SECTION}] block appended (edit \`visibility\` to match — templated "private")`,
    STD,
    KI_CONFIG
  )
  say(`  ${paint(C.green, 'append')} ${KI_CONFIG} [${KI_SECTION}] block (edit \`visibility\` to match — currently templated "private")`)
  if (!dryRun) writeFileSync(kiPath, kiText ? `${kiText.replace(/\n*$/, '\n\n')}${KI_DEFAULT}` : KI_DEFAULT)
} else {
  rec('PASS', 'FILES-1', `${KI_CONFIG} [${KI_SECTION}] block already present`, STD, KI_CONFIG)
}

// ── Layer 2: core GitHub settings ──
say(`\n${paint(C.cyan, 'layer 2 — core GitHub')}`)
const mergeConformant =
  repoInfo.allow_merge_commit === false &&
  repoInfo.allow_rebase_merge === false &&
  repoInfo.allow_squash_merge === true &&
  repoInfo.delete_branch_on_merge === true
ghIfNeeded(
  mergeConformant,
  [
    'repo',
    'edit',
    nwo,
    '--enable-merge-commit=false',
    '--enable-rebase-merge=false',
    '--enable-squash-merge=true',
    '--delete-branch-on-merge=true'
  ],
  'MERGE-1',
  'squash-only + auto-delete-branch',
  'merge, delete-branch'
)
if (enforced('wiki')) ghIfNeeded(repoInfo.has_wiki === false, ['repo', 'edit', nwo, '--enable-wiki=false'], 'TOGGLE-1', 'Wiki off')
if (enforced('projects'))
  ghIfNeeded(repoInfo.has_projects === false, ['repo', 'edit', nwo, '--enable-projects=false'], 'TOGGLE-1', 'Projects off')
if (enforced('issues')) ghIfNeeded(repoInfo.has_issues === true, ['repo', 'edit', nwo, '--enable-issues=true'], 'TOGGLE-1', 'Issues on')

if (isPublic && enforced('topics')) {
  let currentTopics: string[] = []
  try {
    currentTopics = (ghJSON(`repos/${nwo}/topics`) as { names?: string[] }).names ?? []
  } catch {
    currentTopics = []
  }
  const topicsConformant = TOPICS.every((t) => currentTopics.includes(t))
  const args = ['repo', 'edit', nwo]
  for (const t of TOPICS) args.push('--add-topic', t)
  ghIfNeeded(topicsConformant, args, 'TOPICS-1', `topics: ${TOPICS.join(', ')}`)
}

const branchProtectionOn = ghOk(`repos/${nwo}/branches/main/protection`)
if (enforced('branch-protection') && branchProtectionOn) {
  say(`  ${paint(C.dim, 'ok')}    branch protection on main — already conformant`)
  rec('PASS', 'BP-1', `branch protection on main (opted in via [${CHECKS_SECTION}]) already conformant`, STD)
} else if (!enforced('branch-protection') && !branchProtectionOn) {
  say(`  ${paint(C.dim, 'ok')}    no branch protection on main — already conformant (default: off)`)
  rec('PASS', 'BP-1', 'no branch protection on main already conformant (default: off)', STD)
} else if (enforced('branch-protection')) {
  const body = JSON.stringify({
    required_status_checks: { strict: true, checks: [{ context: REQUIRED_CHECK }] },
    enforce_admins: false,
    required_pull_request_reviews: { required_approving_review_count: 0 },
    restrictions: null,
    required_linear_history: true,
    allow_force_pushes: false,
    allow_deletions: false
  })
  if (dryRun) {
    say(`  ${paint(C.dim, '$')} gh api -X PUT repos/${nwo}/branches/main/protection --input - <<< ${body}`)
    rec('POLISH', 'BP-1', `would set branch protection on main (opted in via [${CHECKS_SECTION}])`, STD)
  } else {
    try {
      execFileSync('gh', ['api', '-X', 'PUT', `repos/${nwo}/branches/main/protection`, '--input', '-'], { input: body, encoding: 'utf8' })
      say(`  ${paint(C.green, 'ok')}    branch protection on main (opted in via [${CHECKS_SECTION}])`)
      rec('POLISH', 'BP-1', `branch protection on main (opted in via [${CHECKS_SECTION}])`, STD)
    } catch (e) {
      const m = String((e as Error).message ?? e).split('\n')[0]
      say(`  ${paint(C.red, 'fail')}  branch protection — ${m}`)
      rec('FAIL', 'BP-1', `branch protection — ${m}`, STD)
    }
  }
} else if (dryRun) {
  say(`  ${paint(C.dim, '$')} gh api -X DELETE repos/${nwo}/branches/main/protection`)
  rec('POLISH', 'BP-1', 'would strip any leftover branch protection (default: off)', STD)
} else {
  try {
    execFileSync('gh', ['api', '-X', 'DELETE', `repos/${nwo}/branches/main/protection`], { encoding: 'utf8' })
    say(`  ${paint(C.green, 'ok')}    strip any leftover branch protection (default: off)`)
    rec('POLISH', 'BP-1', 'stripped leftover branch protection (default: off)', STD)
  } catch (e) {
    const msg = String((e as Error).message ?? e)
    if (!isPublic && /Upgrade to GitHub Pro/.test(msg)) {
      say(`  ${paint(C.dim, 'skip')}  branch protection unavailable on this plan for private repos — nothing to strip`)
      rec('PASS', 'BP-1', 'branch protection unavailable on this plan for private repos — nothing to strip', STD)
    } else {
      say(`  ${paint(C.red, 'fail')}  strip any leftover branch protection (default: off) — ${msg.split('\n')[0]}`)
      rec('FAIL', 'BP-1', `strip any leftover branch protection (default: off) — ${msg.split('\n')[0]}`, STD)
    }
  }
}

// ── Layer 3: deeper GitHub ──
say(`\n${paint(C.cyan, 'layer 3 — deeper GitHub')}`)
ghIfNeeded(
  ghOk(`repos/${nwo}/vulnerability-alerts`),
  ['api', '-X', 'PUT', `repos/${nwo}/vulnerability-alerts`],
  'DEP-1',
  'Dependabot alerts on'
)
let autoSecurityFixesOn = false
try {
  autoSecurityFixesOn = (ghJSON(`repos/${nwo}/automated-security-fixes`) as { enabled?: boolean }).enabled === true
} catch {
  autoSecurityFixesOn = false
}
ghIfNeeded(autoSecurityFixesOn, ['api', '-X', 'PUT', `repos/${nwo}/automated-security-fixes`], 'DEP-1', 'Dependabot security updates on')
ghIfNeeded(
  repoInfo.allow_update_branch === true,
  ['api', '-X', 'PATCH', `repos/${nwo}`, '-F', 'allow_update_branch=true'],
  'DEP-1',
  'always-suggest-updating-PR-branches on'
)
if (isPublic && (enforced('secret-scanning') || enforced('push-protection'))) {
  const sa: Record<string, unknown> = {}
  const covered: string[] = []
  let allConformant = true
  if (enforced('secret-scanning')) {
    sa.secret_scanning = { status: 'enabled' }
    covered.push('secret-scanning')
    if (repoInfo.security_and_analysis?.secret_scanning?.status !== 'enabled') allConformant = false
  }
  if (enforced('push-protection')) {
    sa.secret_scanning_push_protection = { status: 'enabled' }
    covered.push('push-protection')
    if (repoInfo.security_and_analysis?.secret_scanning_push_protection?.status !== 'enabled') allConformant = false
  }
  const body = JSON.stringify({ security_and_analysis: sa })
  // One atomic PATCH bundles both fine checks; cite the parent code, enumerate the covered set.
  const covers = covered.join(', ')
  if (allConformant) {
    say(`  ${paint(C.dim, 'ok')}    secret scanning / push protection (covers: ${covers}) — already conformant`)
    rec('PASS', 'SEC-1', `secret scanning / push protection (covers: ${covers}) already conformant`, STD)
  } else if (dryRun) {
    say(`  ${paint(C.dim, '$')} gh api -X PATCH repos/${nwo} --input - <<< ${body}`)
    rec('POLISH', 'SEC-1', `would set secret scanning / push protection (covers: ${covers})`, STD)
  } else {
    try {
      execFileSync('gh', ['api', '-X', 'PATCH', `repos/${nwo}`, '--input', '-'], { input: body, encoding: 'utf8' })
      say(`  ${paint(C.green, 'ok')}    secret scanning / push protection`)
      rec('POLISH', 'SEC-1', `secret scanning / push protection (covers: ${covers})`, STD)
    } catch (e) {
      const m = String((e as Error).message ?? e).split('\n')[0]
      say(`  ${paint(C.red, 'fail')}  secret scanning / push protection — ${m}`)
      rec('FAIL', 'SEC-1', `secret scanning / push protection (covers: ${covers}) — ${m}`, STD)
    }
  }
}
let actionsConformant = false
try {
  const perms = ghJSON(`repos/${nwo}/actions/permissions`) as { enabled?: boolean; allowed_actions?: string }
  actionsConformant = perms.enabled === true && perms.allowed_actions === ALLOWED_ACTIONS
} catch {
  actionsConformant = false
}
ghIfNeeded(
  actionsConformant,
  // `enabled` is required by the API (422 without it); `allowed_actions` is only honoured when enabled.
  ['api', '-X', 'PUT', `repos/${nwo}/actions/permissions`, '-F', 'enabled=true', '-f', `allowed_actions=${ALLOWED_ACTIONS}`],
  'ACT-1',
  `Actions allowed_actions=${ALLOWED_ACTIONS}`
)

// ── judgment items — never guessed, always surfaced as ADVISORY (the [J] criteria conform
// cannot mechanically settle, routed to a human/model reading). Cite the rubric's Judgment
// section (RUBRIC); audit emits none of these areas, so there is no cross-file conflict.
say(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
rec('ADVISORY', 'FILES-J1', `README.md / LICENSE content: accurate and current for ${nwo}?`, RUBRIC, 'README.md')
rec(
  'ADVISORY',
  'DESCFIT-1',
  `GitHub description: does it actually describe ${nwo}'s purpose? (sync with package.json "description")`,
  RUBRIC
)
rec(
  'ADVISORY',
  'OVR-J1',
  `[${CHECKS_SECTION}] overrides: genuinely warranted per-repo, not waving off real drift (e.g. branch-protection)?`,
  RUBRIC
)
say(`  - README.md content: is it accurate and current for ${nwo}?`)
say(`  - GitHub description text: does it actually describe the repo's purpose? (sync with package.json's "description" once set)`)
say(`  - [${CHECKS_SECTION}] overrides: does this repo genuinely need to diverge from an org default (e.g. branch-protection)?`)
say(`\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts .` (or `ki:repo:audit`) to confirm findings clear.')}`)

if (json) {
  const n = (l: Level): number => findings.filter((f) => f.level === l).length
  const summary = {
    fail: n('FAIL'),
    warn: n('WARN'),
    polish: n('POLISH'),
    advisory: n('ADVISORY'),
    info: n('INFO'),
    na: n('NA'),
    pass: n('PASS')
  }
  process.stdout.write(JSON.stringify({ concern: 'repo', target, generatedAt: new Date().toISOString(), summary, findings }))
}
