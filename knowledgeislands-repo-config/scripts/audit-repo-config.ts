#!/usr/bin/env bun
/**
 * Mechanical auditor for the Knowledge Islands repo-configuration standard.
 *
 *   bun scripts/audit-repo-config.ts [tree-path]   # default: cwd — enumerate repos from a tree
 *   bun scripts/audit-repo-config.ts --org <org>   # enumerate every repo in a GitHub org
 *
 * Everything is checked **against GitHub** (no working checkout needed): file
 * presence via the git-tree API, settings via `gh repo view`, security/Actions via
 * `gh api`. The tree path / `--org` only decide *which* repos to look at — local-tree
 * mode reads each dir's `origin` and audits the github.com ones under their real
 * GitHub identity; `--org` lists the org (and so catches repos not cloned locally).
 *
 * The standard has three layers (see references/repo-config-standard.md):
 *   1. FILES   — README, LICENSE, .gitignore, .editorconfig, and .ki-config.toml
 *                (the repo's declared config), all present on the default branch.
 *   2. GITHUB  — default branch, license, squash-only + linear, auto-delete-branch,
 *                Issues on / Wiki+Projects off, non-empty description, visibility
 *                (matches the value DECLARED in .ki-config.toml — not the name),
 *                and (public) the standard topic set. `main` is open by default;
 *                branch protection is an overridable check (.ki-config.toml checks).
 *   3. DEEPER  — Dependabot alerts + security updates; secret scanning + push
 *                protection (public); Actions allowed-actions = all.
 *
 * Each repo's `.ki-config.toml` declares its `visibility` and, in a
 * `[knowledgeislands-repo-config.checks]` sub-table, per-repo overrides — one
 * boolean per overridable check (`true` = enforce, `false` = don't). A check it
 * omits takes the org default (CHECK_DEFAULTS), so a fully-conforming repo writes
 * no overrides; `branch-protection` defaults off, so `main` is open unless opted in.
 *
 * READ-ONLY: never mutates a repo. Bringing outliers into line is the skill's APPLY
 * mode. Judgment items the script can't make (does the description match the repo's
 * purpose / sync with package.json) are left to the skill's AUDIT mode.
 *
 * Requires `gh` authenticated against the org. No npm dependencies — Bun/Node only.
 * Exit code is non-zero if any repo has a FAIL.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── the standard (keep in sync with references/repo-config-standard.md) ──────
const DEFAULT_BRANCH = 'main'
const LICENSE_KEY = 'mit'
const TOPICS = ['mcp', 'model-context-protocol', 'claude', 'typescript', 'bun']
const REQUIRED_CHECK = 'build'
const ALLOWED_ACTIONS = 'all'
// Overridable checks and the org default for each — `true` = enforced by default.
// A repo overrides any of these per-repo in [knowledgeislands-repo-config.checks];
// a check it omits takes the default here, so a fully-conforming repo writes none.
// (The other checks — file presence, default branch, license, description, merge,
// delete-branch, visibility, Dependabot — are bedrock: always enforced, no override.)
// `branch-protection` defaults OFF, so `main` is open unless a repo opts in.
const CHECK_DEFAULTS: Record<string, boolean> = {
  'branch-protection': false, // protect `main` (PR + build check + linear history)
  wiki: true, //                Wiki disabled
  projects: true, //            Projects disabled
  issues: true, //              Issues enabled
  topics: true, //              (public) carries the standard topic set
  'secret-scanning': true, //   (public) secret scanning on
  'push-protection': true //    (public) secret-scanning push protection on
}
const KI_CONFIG = '.ki-config.toml'
// Required root files. Each entry is one or more acceptable paths (first found wins).
const REQUIRED_FILES: [check: string, paths: string[]][] = [
  ['readme', ['README.md']],
  ['license-file', ['LICENSE', 'LICENSE.md']],
  ['gitignore', ['.gitignore']],
  ['editorconfig', ['.editorconfig']],
  ['ki-config', [KI_CONFIG]]
]

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// `note` is informational (a per-repo override in effect) — printed, never counted.
type Level = 'fail' | 'warn' | 'note'
type Finding = { level: Level; check: string; msg: string }
const mk = () => {
  const f: Finding[] = []
  return {
    f,
    fail: (check: string, msg: string) => void f.push({ level: 'fail', check, msg }),
    warn: (check: string, msg: string) => void f.push({ level: 'warn', check, msg }),
    note: (check: string, msg: string) => void f.push({ level: 'note', check, msg })
  }
}

function gh(args: string[]): string {
  return execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
}
const ghOk = (apiPath: string): boolean => {
  try {
    gh(['api', apiPath])
    return true
  } catch {
    return false
  }
}
const ghJSON = (apiPath: string): unknown => JSON.parse(gh(['api', apiPath]))
// File content as raw text, or null on 404.
const ghRaw = (nwo: string, path: string): string | null => {
  try {
    return gh(['api', `repos/${nwo}/contents/${path}`, '-H', 'Accept: application/vnd.github.raw'])
  } catch {
    return null
  }
}
// Set of the repo's root-level paths (one call), for presence checks.
function rootPaths(nwo: string, branch: string): Set<string> {
  try {
    const t = ghJSON(`repos/${nwo}/git/trees/${branch}`) as { tree?: { path: string }[] }
    return new Set((t.tree ?? []).map((e) => e.path))
  } catch {
    return new Set()
  }
}

const topicNames = (t: unknown): string[] => (Array.isArray(t) ? t.map((x) => (typeof x === 'string' ? x : (x?.name ?? x?.topic?.name))).filter(Boolean) : [])

// `.ki-config.toml` is a shared per-repo file; each skill reads its own [table].
// This skill owns the [knowledgeislands-repo-config] table. The default block
// (written by `--init`) is the authoritative key list — authoring a repo emits it.
const KI_SECTION = 'knowledgeislands-repo-config'
const KI_DEFAULT = `[${KI_SECTION}]
visibility = "private"   # "public" | "private" — must match the repo's actual GitHub visibility

# Per-repo check overrides — true = enforce, false = don't. Omit any check to take
# the org default; a repo that fully conforms needs nothing here.
# [${KI_SECTION}.checks]
# branch-protection = true   # default off — protect \`main\` on this repo
# wiki = false               # default on  — allow this repo's Wiki
`

// Minimal parser for the constrained schema: `[table]` headers (incl. the dotted
// `[...checks]` sub-table), flat `key = "string"` and `key = true|false` on a single
// line, `#` comments. NOT a full TOML parser. Returns this skill's config, or null
// if the file has no [knowledgeislands-repo-config] table at all.
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

type Repo = {
  nameWithOwner: string
  visibility: 'PUBLIC' | 'PRIVATE'
  isArchived: boolean
  defaultBranchRef: { name: string } | null
  mergeCommitAllowed: boolean
  squashMergeAllowed: boolean
  rebaseMergeAllowed: boolean
  deleteBranchOnMerge: boolean
  hasIssuesEnabled: boolean
  hasProjectsEnabled: boolean
  hasWikiEnabled: boolean
  repositoryTopics: unknown
  licenseInfo: { key: string } | null
  description: string
}
const REPO_FIELDS =
  'nameWithOwner,visibility,isArchived,defaultBranchRef,mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed,deleteBranchOnMerge,hasIssuesEnabled,hasProjectsEnabled,hasWikiEnabled,repositoryTopics,licenseInfo,description'

function auditRepo(r: Repo, files: Set<string>, ki: KiConfig | null): Finding[] {
  const { f, fail, warn, note } = mk()
  if (r.isArchived) {
    warn('archived', 'repo is archived — skipping remaining checks')
    return f
  }

  // ── layer 1: files (presence on the default branch) ──
  for (const [check, paths] of REQUIRED_FILES) {
    if (!paths.some((p) => files.has(p))) fail(check, `no ${paths.join(' / ')}`)
  }

  // ── layer 2: core GitHub ──
  if (r.defaultBranchRef?.name !== DEFAULT_BRANCH) fail('default-branch', `default branch is "${r.defaultBranchRef?.name ?? '?'}" (want ${DEFAULT_BRANCH})`)
  if (r.licenseInfo?.key !== LICENSE_KEY) fail('license', `license is "${r.licenseInfo?.key ?? 'none'}" (want ${LICENSE_KEY})`)
  if (!r.description?.trim()) fail('description', 'description is empty')
  if (r.mergeCommitAllowed || r.rebaseMergeAllowed || !r.squashMergeAllowed)
    fail('merge', `merge methods M/S/R = ${r.mergeCommitAllowed ? 'M' : '-'}/${r.squashMergeAllowed ? 'S' : '-'}/${r.rebaseMergeAllowed ? 'R' : '-'} (want -/S/-)`)
  if (!r.deleteBranchOnMerge) fail('delete-branch', 'auto-delete head branch on merge is off')

  // visibility: declared in .ki-config.toml, checked against live GitHub
  const declared = ki?.visibility?.toUpperCase()
  if (!ki) fail('visibility', `cannot verify visibility — ${KI_CONFIG} has no [${KI_SECTION}] table (run --init)`)
  else if (declared !== 'PUBLIC' && declared !== 'PRIVATE') fail('visibility', `${KI_CONFIG} does not declare a valid \`visibility\` (got ${JSON.stringify(ki.visibility)})`)
  else if (declared !== r.visibility) fail('visibility', `visibility is ${r.visibility} but ${KI_CONFIG} declares ${declared}`)

  // per-repo overrides: a check's effective state is its [..checks] value, else the
  // org default. Surface every active override as a note, and WARN a key that names
  // no overridable check (it would otherwise silently do nothing).
  const enforced = (id: string): boolean => ki?.checks[id] ?? CHECK_DEFAULTS[id] ?? true
  for (const [id, v] of Object.entries(ki?.checks ?? {})) {
    if (!(id in CHECK_DEFAULTS)) warn('checks', `"${id}" is not an overridable check (overridable: ${Object.keys(CHECK_DEFAULTS).join(', ')})`)
    else if (v !== CHECK_DEFAULTS[id]) note(id, `override: ${v ? 'enforced' : 'not enforced'} for this repo (org default: ${CHECK_DEFAULTS[id] ? 'on' : 'off'})`)
  }

  if (enforced('issues') && !r.hasIssuesEnabled) fail('issues', 'Issues are disabled')
  if (enforced('wiki') && r.hasWikiEnabled) fail('wiki', 'Wiki is enabled (want off)')
  if (enforced('projects') && r.hasProjectsEnabled) fail('projects', 'Projects are enabled (want off)')

  if (r.visibility === 'PUBLIC' && enforced('topics')) {
    const missing = TOPICS.filter((t) => !new Set(topicNames(r.repositoryTopics)).has(t))
    if (missing.length) fail('topics', `missing topics: ${missing.join(', ')}`)
  }

  // branch-protection: default OFF — `main` is open unless this repo sets it true.
  if (enforced('branch-protection')) {
    let bp: { required_pull_request_reviews?: unknown; required_status_checks?: { contexts?: string[] }; required_linear_history?: { enabled?: boolean } } | null
    try {
      bp = ghJSON(`repos/${r.nameWithOwner}/branches/${DEFAULT_BRANCH}/protection`) as typeof bp
    } catch {
      bp = null
    }
    if (!bp) fail('branch-protection', `no branch protection on ${DEFAULT_BRANCH}`)
    else {
      if (bp.required_pull_request_reviews == null) fail('branch-protection', 'does not require a pull request')
      if (!(bp.required_status_checks?.contexts ?? []).includes(REQUIRED_CHECK)) fail('branch-protection', `required checks omit "${REQUIRED_CHECK}"`)
      if (bp.required_linear_history?.enabled !== true) fail('branch-protection', 'does not require linear history')
    }
  }

  // ── layer 3: deeper GitHub ──
  if (!ghOk(`repos/${r.nameWithOwner}/vulnerability-alerts`)) fail('dependabot-alerts', 'Dependabot alerts are off')
  try {
    if ((ghJSON(`repos/${r.nameWithOwner}/automated-security-fixes`) as { enabled?: boolean }).enabled !== true) fail('dependabot-updates', 'Dependabot security updates are off')
  } catch {
    warn('dependabot-updates', 'could not read automated-security-fixes')
  }
  if (r.visibility === 'PUBLIC' && (enforced('secret-scanning') || enforced('push-protection'))) {
    try {
      const sa = (ghJSON(`repos/${r.nameWithOwner}`) as { security_and_analysis?: { secret_scanning?: { status?: string }; secret_scanning_push_protection?: { status?: string } } })
        .security_and_analysis
      if (enforced('secret-scanning') && sa?.secret_scanning?.status !== 'enabled') fail('secret-scanning', 'secret scanning is off')
      if (enforced('push-protection') && sa?.secret_scanning_push_protection?.status !== 'enabled') fail('push-protection', 'secret-scanning push protection is off')
    } catch {
      warn('secret-scanning', 'could not read security_and_analysis')
    }
  }
  try {
    const al = (ghJSON(`repos/${r.nameWithOwner}/actions/permissions`) as { allowed_actions?: string }).allowed_actions
    if (al && al !== ALLOWED_ACTIONS) warn('actions', `allowed_actions is "${al}" (standard: ${ALLOWED_ACTIONS})`)
  } catch {
    /* not always readable */
  }
  return f
}

// ── discovery ────────────────────────────────────────────────────────────────
type Target = { label: string; nameWithOwner: string | null; note?: string }
const GH_REMOTE = /github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/
const gitOrigin = (dir: string): string | null => {
  try {
    return execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}
function repoDirsUnder(path: string): string[] {
  if (existsSync(join(path, '.git'))) return [path]
  return readdirSync(path, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
    .map((e) => join(path, e.name))
    .filter((d) => existsSync(join(d, '.git')))
    .sort()
}
function localTargets(path: string): Target[] {
  const abs = resolve(path)
  const dirs = repoDirsUnder(abs)
  if (dirs.length === 0) {
    console.error(paint(C.red, `no git repos found at ${abs}`))
    process.exit(2)
  }
  return dirs.map((dir) => {
    const label = dir.split('/').pop() ?? dir
    const m = gitOrigin(dir)?.match(GH_REMOTE)
    return m ? { label, nameWithOwner: `${m[1]}/${m[2]}` } : { label, nameWithOwner: null, note: 'origin not on github.com' }
  })
}
function orgTargets(org: string): Target[] {
  const repos: { nameWithOwner: string }[] = JSON.parse(gh(['repo', 'list', org, '--limit', '200', '--json', 'nameWithOwner']))
  return repos.map((r) => ({ label: r.nameWithOwner, nameWithOwner: r.nameWithOwner })).sort((a, b) => a.label.localeCompare(b.label))
}

// ── run ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
// `--init` prints the default [knowledgeislands-repo-config] block for a new repo's
// .ki-config.toml (authoring creates the keys; the author edits the values).
if (argv.includes('--init')) {
  process.stdout.write(KI_DEFAULT)
  process.exit(0)
}
const orgIdx = argv.indexOf('--org')
let targets: Target[]
let scope: string
try {
  if (orgIdx !== -1) {
    const org = argv[orgIdx + 1]
    if (!org) {
      console.error('usage: audit-repo-config.ts --org <org>')
      process.exit(2)
    }
    scope = `org ${org}`
    targets = orgTargets(org)
  } else {
    const path = argv.find((a) => !a.startsWith('-')) ?? '.'
    scope = `tree ${resolve(path)}`
    targets = localTargets(path)
  }
} catch (e) {
  console.error(paint(C.red, 'failed to enumerate repos — is gh installed and authenticated? (gh auth status)'))
  console.error(String((e as Error).message ?? e).split('\n')[0])
  process.exit(2)
}

console.log(paint(C.dim, `scope: ${scope}`))
console.log(
  paint(
    C.dim,
    `standard: files(README,LICENSE,.gitignore,.editorconfig,${KI_CONFIG}) · github(main,mit,squash-only,del-branch,issues,no-wiki/projects,desc,visibility) · public+(topics) · deeper(dependabot;secret-scanning;actions=all) · overridable via [..checks]: ${Object.keys(CHECK_DEFAULTS).join(',')}`
  )
)

let totalFails = 0
let totalWarns = 0
let ghSkipped = 0
for (const t of targets) {
  if (!t.nameWithOwner) {
    ghSkipped++
    console.log(`\n${paint(C.dim, 'SKIP')}  ${paint(C.cyan, t.label)} ${paint(C.dim, `— ${t.note}`)}`)
    continue
  }
  let findings: Finding[]
  try {
    const r = JSON.parse(gh(['repo', 'view', t.nameWithOwner, '--json', REPO_FIELDS])) as Repo
    const branch = r.defaultBranchRef?.name ?? DEFAULT_BRANCH
    const files = rootPaths(t.nameWithOwner, branch)
    const kiText = files.has(KI_CONFIG) ? ghRaw(t.nameWithOwner, KI_CONFIG) : null
    const ki = kiText != null ? parseKiConfig(kiText) : null
    // overrides are applied inside auditRepo: a not-enforced check simply does not fail
    // and is reported as a `note`. No post-filtering here.
    findings = auditRepo(r, files, ki)
  } catch {
    findings = [{ level: 'fail', check: 'access', msg: `could not read ${t.nameWithOwner} via gh (missing repo or insufficient scope)` }]
  }
  const fails = findings.filter((x) => x.level === 'fail')
  const warns = findings.filter((x) => x.level === 'warn')
  const notes = findings.filter((x) => x.level === 'note')
  totalFails += fails.length
  totalWarns += warns.length
  const stamp = fails.length ? paint(C.red, 'FAIL') : warns.length ? paint(C.yellow, 'WARN') : paint(C.green, 'PASS')
  console.log(`\n${stamp}  ${paint(C.cyan, t.nameWithOwner)}`)
  for (const x of fails) console.log(`  ${paint(C.red, 'fail')} ${paint(C.dim, `[${x.check}]`)} ${x.msg}`)
  for (const x of warns) console.log(`  ${paint(C.yellow, 'warn')} ${paint(C.dim, `[${x.check}]`)} ${x.msg}`)
  for (const x of notes) console.log(`  ${paint(C.dim, `note [${x.check}] ${x.msg}`)}`)
  if (fails.length + warns.length === 0) console.log(paint(C.dim, '  conforms'))
}

console.log(
  `\n${paint(C.cyan, 'summary')}: ${targets.length} repo(s), ${paint(C.red, `${totalFails} fail`)}, ${paint(C.yellow, `${totalWarns} warn`)}${ghSkipped ? paint(C.dim, `, ${ghSkipped} not on github.com`) : ''}`
)
console.log(paint(C.dim, 'mechanical checks only — judgment items (description matches purpose & synced with package.json) are the skill’s AUDIT mode.'))
process.exit(totalFails > 0 ? 1 : 0)
