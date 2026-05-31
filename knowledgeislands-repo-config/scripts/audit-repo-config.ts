#!/usr/bin/env bun
/**
 * Mechanical auditor for the Knowledge Islands repo-configuration standard.
 *
 *   bun scripts/audit-repo-config.ts [tree-path]   # default: cwd — scan a tree of repos
 *   bun scripts/audit-repo-config.ts --org <org>   # scan every repo in a GitHub org
 *
 * Three layers (see references/repo-config-standard.md):
 *   1. LOCAL  — files every repo should carry: README, LICENSE, .gitignore,
 *               .editorconfig. Checked from disk; runs for every local repo.
 *   2. GITHUB — settings on repos hosted on github.com: default branch, license,
 *               squash-only + linear, auto-delete-branch, Issues on / Wiki+Projects
 *               off, non-empty description, visibility by name prefix, and (public)
 *               topics + branch protection on `main`.
 *   3. DEEPER — security & analysis (secret scanning + push protection on public;
 *               Dependabot alerts + security updates everywhere) and Actions
 *               permissions (allowed-actions = all).
 *
 * LOCAL-TREE mode (default): walk the path for git repos; each gets layer 1, and
 * those whose `origin` is on github.com also get layers 2–3 (owner/name come from
 * the remote, so a repo is checked under its real GitHub identity). A repo not on
 * github.com gets layer 1 only.
 *
 * ORG mode (--org): list the org's repos via `gh` and run layers 2–3 (no local
 * checkout, so layer 1 is skipped) — catches repos that aren't cloned locally.
 *
 * READ-ONLY: never mutates a repo. Bringing outliers into line is the skill's
 * APPLY mode (documented `gh` commands / file additions). Judgment items the script
 * can't make (description matches purpose / synced with package.json, intentional
 * exceptions) are left to the skill's AUDIT mode.
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
const LOCAL_FILES: [label: string, names: string[]][] = [
  ['readme', ['README.md']],
  ['license-file', ['LICENSE', 'LICENSE.md']],
  ['gitignore', ['.gitignore']],
  ['editorconfig', ['.editorconfig']]
]
// Visibility is set by name prefix: arcadia-* private (bases/internal), mcp-* public (open-source servers).
const expectedVisibility = (name: string): 'PUBLIC' | 'PRIVATE' | null => (name.startsWith('mcp-') ? 'PUBLIC' : name.startsWith('arcadia-') ? 'PRIVATE' : null)

const REPO_FIELDS =
  'nameWithOwner,name,visibility,isArchived,defaultBranchRef,mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed,deleteBranchOnMerge,hasIssuesEnabled,hasProjectsEnabled,hasWikiEnabled,repositoryTopics,licenseInfo,description'

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

type Level = 'fail' | 'warn'
type Finding = { level: Level; check: string; msg: string }
const mk = () => {
  const f: Finding[] = []
  return {
    f,
    fail: (check: string, msg: string) => void f.push({ level: 'fail', check, msg }),
    warn: (check: string, msg: string) => void f.push({ level: 'warn', check, msg })
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

const topicNames = (t: unknown): string[] => (Array.isArray(t) ? t.map((x) => (typeof x === 'string' ? x : (x?.name ?? x?.topic?.name))).filter(Boolean) : [])

type Repo = {
  nameWithOwner: string
  name: string
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

// ── layer 1: local files ─────────────────────────────────────────────────────
function localChecks(dir: string): Finding[] {
  const { f, fail } = mk()
  for (const [label, names] of LOCAL_FILES) {
    if (!names.some((n) => existsSync(join(dir, n)))) fail(label, `no ${names.join(' / ')}`)
  }
  return f
}

// ── layer 2: core GitHub settings ─────────────────────────────────────────────
function coreChecks(r: Repo): Finding[] {
  const { f, fail, warn } = mk()
  if (r.defaultBranchRef?.name !== DEFAULT_BRANCH) fail('default-branch', `default branch is "${r.defaultBranchRef?.name ?? '?'}" (want ${DEFAULT_BRANCH})`)
  if (r.licenseInfo?.key !== LICENSE_KEY) fail('license', `license is "${r.licenseInfo?.key ?? 'none'}" (want ${LICENSE_KEY})`)
  if (!r.description?.trim()) fail('description', 'description is empty')
  if (r.mergeCommitAllowed || r.rebaseMergeAllowed || !r.squashMergeAllowed)
    fail('merge', `merge methods M/S/R = ${r.mergeCommitAllowed ? 'M' : '-'}/${r.squashMergeAllowed ? 'S' : '-'}/${r.rebaseMergeAllowed ? 'R' : '-'} (want -/S/-)`)
  if (!r.deleteBranchOnMerge) fail('delete-branch', 'auto-delete head branch on merge is off')
  if (!r.hasIssuesEnabled) fail('issues', 'Issues are disabled')
  if (r.hasWikiEnabled) fail('wiki', 'Wiki is enabled (want off)')
  if (r.hasProjectsEnabled) fail('projects', 'Projects are enabled (want off)')
  const expVis = expectedVisibility(r.name)
  if (expVis && r.visibility !== expVis) fail('visibility', `visibility is ${r.visibility} (name prefix implies ${expVis})`)
  else if (!expVis) warn('visibility', `name has no known prefix (arcadia-* / mcp-*) — visibility ${r.visibility} unchecked`)
  if (r.visibility === 'PUBLIC') {
    const missing = TOPICS.filter((t) => !new Set(topicNames(r.repositoryTopics)).has(t))
    if (missing.length) fail('topics', `missing topics: ${missing.join(', ')}`)
    let bp: { required_pull_request_reviews?: unknown; required_status_checks?: { contexts?: string[] }; required_linear_history?: { enabled?: boolean } } | null
    try {
      bp = ghJSON(`repos/${r.nameWithOwner}/branches/${DEFAULT_BRANCH}/protection`) as typeof bp
    } catch {
      bp = null
    }
    if (!bp) fail('protection', `no branch protection on ${DEFAULT_BRANCH}`)
    else {
      if (bp.required_pull_request_reviews == null) fail('protection', 'does not require a pull request')
      if (!(bp.required_status_checks?.contexts ?? []).includes(REQUIRED_CHECK)) fail('protection', `required checks omit "${REQUIRED_CHECK}"`)
      if (bp.required_linear_history?.enabled !== true) fail('protection', 'does not require linear history')
    }
  }
  return f
}

// ── layer 3: deeper GitHub (security & analysis, Actions) ─────────────────────
function deeperChecks(r: Repo): Finding[] {
  const { f, fail, warn } = mk()
  if (!ghOk(`repos/${r.nameWithOwner}/vulnerability-alerts`)) fail('dependabot-alerts', 'Dependabot alerts are off')
  try {
    if ((ghJSON(`repos/${r.nameWithOwner}/automated-security-fixes`) as { enabled?: boolean }).enabled !== true) fail('dependabot-updates', 'Dependabot security updates are off')
  } catch {
    warn('dependabot-updates', 'could not read automated-security-fixes')
  }
  if (r.visibility === 'PUBLIC') {
    try {
      const sa = (ghJSON(`repos/${r.nameWithOwner}`) as { security_and_analysis?: { secret_scanning?: { status?: string }; secret_scanning_push_protection?: { status?: string } } })
        .security_and_analysis
      if (sa?.secret_scanning?.status !== 'enabled') fail('secret-scanning', 'secret scanning is off')
      if (sa?.secret_scanning_push_protection?.status !== 'enabled') fail('push-protection', 'secret-scanning push protection is off')
    } catch {
      warn('secret-scanning', 'could not read security_and_analysis')
    }
  } // private repos: secret scanning is plan-limited (GHAS) — intentionally not checked
  try {
    const al = (ghJSON(`repos/${r.nameWithOwner}/actions/permissions`) as { allowed_actions?: string }).allowed_actions
    if (al && al !== ALLOWED_ACTIONS) warn('actions', `allowed_actions is "${al}" (standard: ${ALLOWED_ACTIONS})`)
  } catch {
    /* actions perms not always readable; ignore */
  }
  return f
}

// ── discovery ────────────────────────────────────────────────────────────────
type Target = { label: string; dir?: string; nameWithOwner: string | null; note?: string }
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
    const origin = gitOrigin(dir)
    const m = origin?.match(GH_REMOTE)
    if (!m) return { label, dir, nameWithOwner: null, note: origin ? `origin not on github.com (${origin})` : 'no origin remote' }
    return { label, dir, nameWithOwner: `${m[1]}/${m[2]}` }
  })
}

function orgTargets(org: string): Target[] {
  const repos: { nameWithOwner: string }[] = JSON.parse(gh(['repo', 'list', org, '--limit', '200', '--json', 'nameWithOwner']))
  return repos.map((r) => ({ label: r.nameWithOwner, nameWithOwner: r.nameWithOwner })).sort((a, b) => a.label.localeCompare(b.label))
}

// ── run ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
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
    scope = `org ${org} (GitHub layers only — no local checkout)`
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
    'standard: local(README,LICENSE,.gitignore,.editorconfig) · github(main,mit,squash-only,del-branch,issues,no-wiki/projects,desc) · public+(topics,protection) · deeper(dependabot;secret-scanning public;actions=all)'
  )
)

let totalFails = 0
let totalWarns = 0
let ghSkipped = 0
for (const t of targets) {
  const findings: Finding[] = []
  if (t.dir) findings.push(...localChecks(t.dir))
  if (t.nameWithOwner) {
    try {
      const cfg = JSON.parse(gh(['repo', 'view', t.nameWithOwner, '--json', REPO_FIELDS])) as Repo
      findings.push(...coreChecks(cfg), ...deeperChecks(cfg))
    } catch {
      findings.push({ level: 'fail', check: 'access', msg: `could not read ${t.nameWithOwner} via gh (missing repo or insufficient scope)` })
    }
  } else if (t.dir) {
    ghSkipped++
    findings.push({ level: 'warn', check: 'github', msg: `${t.note} — GitHub layers skipped` })
  }
  const fails = findings.filter((x) => x.level === 'fail')
  const warns = findings.filter((x) => x.level === 'warn')
  totalFails += fails.length
  totalWarns += warns.length
  const stamp = fails.length ? paint(C.red, 'FAIL') : warns.length ? paint(C.yellow, 'WARN') : paint(C.green, 'PASS')
  console.log(`\n${stamp}  ${paint(C.cyan, t.nameWithOwner ?? t.label)}`)
  for (const x of findings) console.log(`  ${x.level === 'fail' ? paint(C.red, 'fail') : paint(C.yellow, 'warn')} ${paint(C.dim, `[${x.check}]`)} ${x.msg}`)
  if (findings.length === 0) console.log(paint(C.dim, '  conforms'))
}

console.log(
  `\n${paint(C.cyan, 'summary')}: ${targets.length} repo(s), ${paint(C.red, `${totalFails} fail`)}, ${paint(C.yellow, `${totalWarns} warn`)}${ghSkipped ? paint(C.dim, `, ${ghSkipped} not on github.com`) : ''}`
)
console.log(paint(C.dim, 'mechanical checks only — judgment items (description matches purpose & synced with package.json, intentional exceptions) are the skill’s AUDIT mode.'))
process.exit(totalFails > 0 ? 1 : 0)
