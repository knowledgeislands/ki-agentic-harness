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
import { ensureGitignore, gitignoresPath, readText } from './package-scripts.ts'

// ── Self-location: find the harness skills/ root through the (possibly symlinked) script path ──
const SELF = realpathSync(fileURLToPath(import.meta.url))
// .../skills/ki-bootstrap/scripts/link-skills.ts → up to .../skills
const SKILLS_ROOT = resolve(dirname(SELF), '..', '..')

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

function discoverSkills(): string[] {
  if (!existsSync(SKILLS_ROOT)) return []
  return readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(SKILLS_ROOT, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort()
}

// Declared `[ki-<skill>]` top-level tables (sub-tables like `.checks` / `.zones` are ignored).
function declaredSkills(kiConfigText: string): string[] {
  const out: string[] = []
  for (const m of kiConfigText.matchAll(/^\[ki-([a-z0-9-]+)\][ \t]*$/gm)) out.push(`ki-${m[1]}`)
  return out
}

function expectedSet(available: string[], kiConfigText: string): string[] {
  const want = new Set(declaredSkills(kiConfigText))
  want.delete(BOOTSTRAP) // the keystone is installed globally; never duplicated project-local
  return [...want].filter((s) => available.includes(s)).sort()
}

// Declared `[ki-*]` tables that resolve to no discoverable skill in the harness —
// almost always a table left behind by an upstream rename/removal. `expectedSet`
// silently filters these out; here we surface them. The bootstrap keystone (declared
// nowhere, installed globally) is excluded, so only genuinely unresolvable declarations
// are flagged.
function orphanSkills(available: string[], kiConfigText: string): string[] {
  return declaredSkills(kiConfigText)
    .filter((s) => s !== BOOTSTRAP && !available.includes(s))
    .sort()
}

// ── Link (mutate) ──
function cmdLink(target: string, set: string[], dryRun: boolean): void {
  const claudeSkills = join(target, '.claude', 'skills')
  if (!existsSync(claudeSkills)) {
    console.log(`${DIM}creating ${claudeSkills}${RESET}`)
    if (!dryRun) mkdirSync(claudeSkills, { recursive: true })
  }

  for (const skill of set) {
    const source = join(SKILLS_ROOT, skill)
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

  ensureGitignore(target, '.claude/skills', dryRun)
}

// ── Check (audit only) ──
function cmdCheck(target: string, set: string[], orphans: string[]): number {
  const findings: Finding[] = []
  const claudeSkills = join(target, '.claude', 'skills')

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
      message: `.claude/skills matches declared coverage (${set.length} skill${set.length === 1 ? '' : 's'})`
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
    gitignoresPath(readText(join(target, '.gitignore')), '.claude/skills')
      ? { severity: 'PASS', criterion: 'BOOT-3', message: '.claude/skills/ is gitignored' }
      : { severity: 'WARN', criterion: 'BOOT-3', message: '.claude/skills/ is not gitignored — generated links would be committed' }
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
const orphans = orphanSkills(available, kiConfigText)
const setLabel = 'declared'
console.log(
  `\n  ${DIM}target:${RESET} ${target}   ${DIM}skills source:${RESET} ${SKILLS_ROOT}   ${DIM}set:${RESET} ${setLabel} (${set.length})\n`
)

if (checkOnly) {
  process.exit(cmdCheck(target, set, orphans))
}
cmdLink(target, set, dryRun)
if (dryRun) console.log(`\n  ${YELLOW}(dry run — nothing changed)${RESET}`)
