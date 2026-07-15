#!/usr/bin/env bun
/**
 * ki-bootstrap — wire a repo's project-local skills from its .ki-config.toml.
 *
 * A Knowledge Islands repo's `.claude/skills/` should mirror the skills it declares
 * (`[ki-*]` tables) — including its own foundations `[ki-repo]` + `[ki-authoring]`, which
 * every repo declares explicitly (no injected baseline; a greenfield repo enters via
 * `ki-repo`'s init, `--seed ki-repo`, to scaffold its config). Links are RELATIVE symlinks
 * into the harness's `skills/` — gitignored and regenerated, never committed.
 *
 * Self-locating: invoked through its global symlink
 * (`~/.claude/skills/ki-bootstrap/scripts/link-skills.ts`), `import.meta.url` resolves
 * to its real path inside the harness, from which the sibling skill sources are found.
 *
 * Usage:
 *   bun link-skills.ts [target-repo]   link declared∪baseline into <target>/.claude/skills (default cwd)
 *   --dry-run    print what would change, touch nothing
 *   --check      audit only (no mutation): links match expected and .claude/skills gitignored; exits non-zero on FAIL
 */

import { existsSync, lstatSync, mkdirSync, readdirSync, readlinkSync, realpathSync, rmSync, symlinkSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureGitignore, gitignoresPath, readText, runtimeSkillsDir, targetRuntimes } from './package-scripts.ts'
import { assertResolvableSkills, declaredSkills, SkillResolutionError } from './resolve.ts'

// ── Self-location: find the harness skills/ root through the (possibly symlinked) script path ──
const SELF = realpathSync(fileURLToPath(import.meta.url))
// .../skills/keystone/ki-bootstrap/scripts/link-skills.ts → up to .../skills
const SKILLS_ROOT = resolve(dirname(SELF), '..', '..', '..')

const BOOTSTRAP = 'ki-bootstrap'

// ── ANSI ──
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

// ── Types ──
type Severity = 'FAIL' | 'WARN' | 'PASS'
interface Finding {
  severity: Severity
  criterion: string
  message: string
}

// ── Helpers ──
function isSymlink(p: string): boolean {
  try {
    return lstatSync(p).isSymbolicLink()
  } catch {
    return false
  }
}

// Skills live one or two levels under SKILLS_ROOT — either flat (skills/<name>,
// tolerated as a migration leftover) or clustered (skills/<cluster>/<name>).
// Memoized so every by-name source lookup below stays O(1) after the first call.
let skillIndexCache: Map<string, string> | null = null
function skillIndex(): Map<string, string> {
  if (skillIndexCache) return skillIndexCache
  const idx = new Map<string, string>()
  if (existsSync(SKILLS_ROOT)) {
    for (const entry of readdirSync(SKILLS_ROOT, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const clusterDir = join(SKILLS_ROOT, entry.name)
      if (existsSync(join(clusterDir, 'SKILL.md'))) {
        idx.set(entry.name, clusterDir)
        continue
      }
      for (const sub of readdirSync(clusterDir, { withFileTypes: true })) {
        if (!sub.isDirectory()) continue
        const skillPath = join(clusterDir, sub.name)
        if (existsSync(join(skillPath, 'SKILL.md'))) idx.set(sub.name, skillPath)
      }
    }
  }
  skillIndexCache = idx
  return idx
}

function discoverSkills(): string[] {
  return [...skillIndex().keys()].sort()
}

function expectedSet(available: string[], kiConfigText: string): string[] {
  const want = new Set(declaredSkills(kiConfigText))
  want.delete(BOOTSTRAP) // the keystone is installed globally; never duplicated project-local
  return [...want].filter((s) => available.includes(s)).sort()
}

// ── Link (mutate) ──
// `skillsSubdir` is the runtime's project-local skills dir (e.g. `.claude/skills`
// for Claude Code, `.agents/skills` for Codex) — the entry point loops the runtimes.
function cmdLink(target: string, set: string[], dryRun: boolean, skillsSubdir: string): void {
  const claudeSkills = join(target, skillsSubdir)
  if (!existsSync(claudeSkills)) {
    console.log(`${DIM}creating ${claudeSkills}${RESET}`)
    if (!dryRun) mkdirSync(claudeSkills, { recursive: true })
  }

  for (const skill of set) {
    const source = skillIndex().get(skill) ?? join(SKILLS_ROOT, skill)
    const linkPath = join(claudeSkills, skill)
    const rel = relative(claudeSkills, source)
    if (isSymlink(linkPath) && resolve(dirname(linkPath), readlinkSync(linkPath)) === resolve(source)) {
      console.log(`${DIM}ok    ${skill}${RESET}`)
      continue
    }
    if (existsSync(linkPath) && !isSymlink(linkPath)) {
      console.log(`${YELLOW}skip  ${skill}${RESET} ${DIM}(a real file/dir is in the way)${RESET}`)
      continue
    }
    if (!dryRun) {
      if (isSymlink(linkPath)) rmSync(linkPath)
      symlinkSync(rel, linkPath, 'dir')
    }
    console.log(`${GREEN}link  ${RESET}${skill} -> ${DIM}${rel}${RESET}`)
  }

  // Prune ki-* symlinks no longer in the set (a dropped coverage table), plus any
  // dangling symlink regardless of name — covers legacy knowledgeislands-* leftovers.
  if (existsSync(claudeSkills)) {
    for (const name of readdirSync(claudeSkills)) {
      const p = join(claudeSkills, name)
      if (!isSymlink(p)) continue
      const dangling = !existsSync(p)
      if (!dangling && (!name.startsWith('ki-') || set.includes(name))) continue
      const reason = dangling ? 'dangling target' : 'no longer declared'
      console.log(`${YELLOW}prune ${RESET}${name} ${DIM}(${reason})${RESET}`)
      if (!dryRun) rmSync(p)
    }
  }

  ensureGitignore(target, skillsSubdir, dryRun)
}

// ── Check (audit only) ──
function cmdCheck(target: string, set: string[], orphans: string[], skillsSubdir: string): number {
  const findings: Finding[] = []
  const claudeSkills = join(target, skillsSubdir)

  const present = existsSync(claudeSkills)
    ? readdirSync(claudeSkills).filter((n) => n.startsWith('ki-') && isSymlink(join(claudeSkills, n)))
    : []
  const missing = set.filter((s) => !present.includes(s))
  const extra = present.filter((p) => !set.includes(p))
  const broken = present.filter((p) => !existsSync(join(claudeSkills, p)))
  if (missing.length === 0 && extra.length === 0 && broken.length === 0 && orphans.length === 0) {
    findings.push({
      severity: 'PASS',
      criterion: 'BOOT-1',
      message: `${skillsSubdir} matches declared coverage (${set.length} skill${set.length === 1 ? '' : 's'})`
    })
  } else {
    for (const o of orphans)
      findings.push({
        severity: 'FAIL',
        criterion: 'BOOT-1',
        message: `.ki-config.toml declares [${o}] but no such skill exists in the harness — likely renamed or removed upstream; reconcile the [${o}] table by hand (the rename mapping isn't mechanical, so it is not auto-renamed)`
      })
    if (missing.length)
      findings.push({
        severity: 'WARN',
        criterion: 'BOOT-1',
        message: `missing links: ${missing.join(', ')} — run \`ki:skills:link:project\``
      })
    if (extra.length)
      findings.push({ severity: 'WARN', criterion: 'BOOT-1', message: `links not in declared coverage: ${extra.join(', ')}` })
    if (broken.length)
      findings.push({ severity: 'WARN', criterion: 'BOOT-1', message: `dangling links (harness not reachable): ${broken.join(', ')}` })
  }

  // package.json script-key wiring (link:project + per-skill ki:<suffix>:<verb> keys) is
  // out of scope here — it is ki-engineering's concern, as sugar over the vendored
  // .ki-meta/bin/* wrappers. This linker only governs the symlink set and the .gitignore.
  findings.push(
    gitignoresPath(readText(join(target, '.gitignore')), skillsSubdir)
      ? { severity: 'PASS', criterion: 'BOOT-3', message: `${skillsSubdir}/ is gitignored` }
      : { severity: 'WARN', criterion: 'BOOT-3', message: `${skillsSubdir}/ is not gitignored — generated links would be committed` }
  )

  for (const f of findings) {
    if (f.severity === 'PASS') continue
    const badge = f.severity === 'FAIL' ? `${RED}FAIL${RESET}` : `${YELLOW}WARN${RESET}`
    console.log(`  ${badge}  [${f.criterion}]  ${f.message}`)
  }
  const fails = findings.filter((f) => f.severity === 'FAIL').length
  const warns = findings.filter((f) => f.severity === 'WARN').length
  console.log(
    `\n  ${DIM}${findings.filter((f) => f.severity === 'PASS').length} passed${RESET}   ${fails ? `${RED}${fails} failed${RESET}` : `${DIM}0 failed${RESET}`}   ${warns ? `${YELLOW}${warns} warned${RESET}` : `${DIM}0 warned${RESET}`}`
  )
  return fails > 0 ? 1 : 0
}

// ── Entry ──
const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const checkOnly = argv.includes('--check')
const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

const available = discoverSkills()
if (available.length === 0) {
  console.error(
    `${RED}No skills found under ${SKILLS_ROOT}.${RESET} This script self-locates the harness via its own path; if it was copied (not symlinked), that resolution failed.`
  )
  process.exit(1)
}

// Every repo — the harness included — links only its declared coverage (the `.ki-config.toml`
// `[ki-*]` tables, foundations included; no injected baseline). The harness is the authoring
// hub, but a structural skill (ki-mcp, ki-website, …) is exercised against a repo of its type,
// not loaded in the harness — so it links what governs IT, not the whole fleet.
const kiConfigText = readText(join(target, '.ki-config.toml'))
const set = expectedSet(available, kiConfigText)
let orphans: string[] = []
try {
  assertResolvableSkills(declaredSkills(kiConfigText).filter((skill) => skill !== BOOTSTRAP))
} catch (error) {
  if (!(error instanceof SkillResolutionError)) throw error
  orphans = error.unresolved
}
const setLabel = 'declared'
// The runtimes this repo installs skills for — `[ki-harness] target_runtimes`,
// defaulting to ["claude-code"] when absent so existing repos are unchanged.
const runtimes = targetRuntimes(kiConfigText)
console.log(
  `\n  ${DIM}target:${RESET} ${target}   ${DIM}skills source:${RESET} ${SKILLS_ROOT}   ${DIM}set:${RESET} ${setLabel} (${set.length})   ${DIM}runtimes:${RESET} ${runtimes.join(', ')}\n`
)

if (checkOnly) {
  let rc = 0
  for (const rt of runtimes) {
    console.log(`  ${DIM}[${rt}]${RESET}`)
    if (cmdCheck(target, set, orphans, runtimeSkillsDir(rt)) !== 0) rc = 1
  }
  process.exit(rc)
}
if (orphans.length) {
  for (const orphan of orphans)
    console.error(
      `${RED}FAIL${RESET}  [BOOT-1] .ki-config.toml declares [${orphan}] but no such skill exists in the harness — reconcile the table by hand before linking`
    )
  process.exit(1)
}
for (const rt of runtimes) {
  console.log(`  ${DIM}[${rt}]${RESET}`)
  cmdLink(target, set, dryRun, runtimeSkillsDir(rt))
}
if (dryRun) console.log(`\n  ${YELLOW}(dry run — nothing changed)${RESET}`)
