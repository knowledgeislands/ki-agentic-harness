#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-harness standard — an honest normalize-only
 * conform. The harness standard governs the five-part *container*, and almost
 * everything audit.ts flags needs a human call (authoring a CLAUDE.md, choosing
 * a package.json script's command string, deciding whether a name/dir mismatch
 * is fixed by renaming the directory or editing the frontmatter). Those are
 * never guessed — they print as manual TODOs. Only two normalizations are
 * unambiguous and reversible, and this script applies just those.
 *
 * Scope: a single harness root (default cwd), matching the house conform shape
 * (audit.ts / conform.ts) — `bun conform.ts .` / `ki:harness:conform`. The
 * five-part list, the root-file set, the TOML-table regex, and the required
 * package.json script families are kept in lockstep with audit.ts (same source
 * of truth, copied rather than imported so each script stays valid standalone,
 * per the composition-only rule).
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                       # print the plan, mutate nothing
 *
 * Fixes (unambiguous, reversible):
 *   - LAY-1 / LAY-2: a missing part directory (or a present one lacking a
 *     README.md) is created from the canonical five-part template — the five
 *     names are fixed, and a shelf README is house boilerplate. A manual TODO is
 *     printed for every stub so the operator fleshes out real shelf content.
 *   - CONFIG-1: when `.ki-config.toml` exists but has no `[ki-harness]` table,
 *     a keyless `[ki-harness]` table is appended. The standard states the table
 *     presence alone is the declaration (no per-harness keys are defined), so
 *     this is a complete fix, not a stub.
 *
 * Deliberately NEVER touches (judgment → manual TODOs):
 *   - LAY-3 / LAY-4 / LAY-5 (CLAUDE.md / ROADMAP.md / .ki-config.toml missing) —
 *     authoring whole orientation / config files is judgment.
 *   - PKG-1..4 (missing scripts) — the command string each script runs is
 *     repo-specific and can't be guessed.
 *   - CONFIG-2 ([ki-repo] table) — its contents are owned by `ki-repo` and may
 *     require keys; presence alone is not enough to author safely here.
 *   - SKILLS-1 (name/dir mismatch) and SKILLS-2 (duplicate names) — which side
 *     is authoritative is a naming decision, never auto-resolved.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on
 * an unrecoverable error; findings/fixes never fail the run.
 */

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const PARTS = ['skills', 'agents', 'mcp', 'evals', 'hooks'] as const
const ROOT_FILES = ['CLAUDE.md', 'ROADMAP.md', '.ki-config.toml', 'package.json'] as const
const PKG1_SCRIPT = 'ki:skills:link:project'
const PKG2_SCRIPT = 'ki:skills:lint'
const PKG3_SCRIPTS = ['ki:lint:check', 'ki:lint:types', 'ki:lint:md', 'ki:lint:md:check']
const PKG4_SCRIPTS = ['ki:skills:link:global', 'ki:skills:status', 'ki:skills:unlink', 'ki:skills:refresh-status', 'ki:codegen', 'ki:eval']

function hasTomlTable(toml: string, table: string): boolean {
  const escaped = table.replace(/-/g, '\\-')
  return new RegExp(`^\\[${escaped}\\]`, 'm').test(toml)
}

function parseFrontmatterName(content: string): string | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return null
  const nameMatch = (match[1] as string).match(/^name:\s*(.+)$/m)
  return nameMatch ? (nameMatch[1] as string).trim() : null
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const root = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  if (!(await exists(root))) {
    console.error(paint(C.red, `harness root not found: ${root}`))
    process.exit(1)
    return
  }

  console.log(paint(C.dim, `target: ${root}${dryRun ? '   (dry run)' : ''}\n`))

  const manualTodos: string[] = []

  // ── a) five-part directories + shelf READMEs (LAY-1 / LAY-2) ──
  console.log(paint(C.cyan, 'five-part layout (skills/ agents/ mcp/ evals/ hooks/)'))
  let layFixes = 0
  for (const part of PARTS) {
    const dir = join(root, part)
    const dirExists = await exists(dir)
    if (!dirExists) {
      console.log(`  ${paint(C.green, 'mkdir')} ${part}/`)
      if (!dryRun) await mkdir(dir, { recursive: true })
      layFixes++
    }
    const readme = join(dir, 'README.md')
    if (!(await exists(readme))) {
      const stub = `# \`${part}/\`\n\nEmpty shelf — no ${part} yet. TODO: describe what this part holds and its status.\n`
      console.log(`  ${paint(C.green, 'write')} ${part}/README.md ${paint(C.dim, '(shelf stub)')}`)
      if (!dryRun) await writeFile(readme, stub)
      manualTodos.push(`${part}/README.md — flesh out the shelf stub with real status / contents`)
      layFixes++
    }
  }
  if (layFixes === 0) console.log(`  ${paint(C.dim, 'nothing to create')}`)

  // ── b) keyless [ki-harness] table (CONFIG-1) ──
  console.log(`\n${paint(C.cyan, '.ki-config.toml [ki-harness] table')}`)
  const tomlPath = join(root, '.ki-config.toml')
  if (!(await exists(tomlPath))) {
    console.log(`  ${paint(C.dim, 'no .ki-config.toml — see manual TODOs (LAY-5)')}`)
  } else {
    const toml = await readFile(tomlPath, 'utf8')
    if (hasTomlTable(toml, 'ki-harness')) {
      console.log(`  ${paint(C.dim, '[ki-harness] already present')}`)
    } else {
      console.log(`  ${paint(C.green, 'append')} [ki-harness]  ${paint(C.dim, '(keyless — presence is the declaration)')}`)
      if (!dryRun) await writeFile(tomlPath, `${toml.replace(/\n*$/, '\n')}\n[ki-harness]\n`)
    }
    if (!hasTomlTable(toml, 'ki-repo')) {
      manualTodos.push('.ki-config.toml: CONFIG-2 — no [ki-repo] table; its contents are owned by ki-repo, add by hand')
    }
  }

  // ── surface the judgment findings as manual TODOs (never guessed) ──

  // LAY-3/4/5 — missing root files
  for (const file of ROOT_FILES) {
    if (file === 'package.json') continue // covered by the PKG scan below
    if (!(await exists(join(root, file)))) {
      manualTodos.push(`${file} — missing at root; author by hand (LAY-3/4/5)`)
    }
  }

  // PKG-1..4 — missing package.json scripts
  const pkgPath = join(root, 'package.json')
  if (!(await exists(pkgPath))) {
    manualTodos.push('package.json — missing at root; author it with the required script families (PKG-1..4)')
  } else {
    let scripts: Record<string, unknown> = {}
    try {
      const parsed = JSON.parse(await readFile(pkgPath, 'utf8')) as { scripts?: Record<string, unknown> }
      scripts = parsed.scripts ?? {}
    } catch {
      manualTodos.push('package.json — could not be parsed as JSON; fix it by hand')
    }
    const missing = [PKG1_SCRIPT, PKG2_SCRIPT, ...PKG3_SCRIPTS, ...PKG4_SCRIPTS].filter((s) => !(s in scripts))
    if (missing.length > 0) {
      manualTodos.push(`package.json — add scripts (command strings are repo-specific, not guessed): ${missing.join(', ')}`)
    }
  }

  // SKILLS-1/2 — name/dir mismatch and duplicates
  const skillsDir = join(root, 'skills')
  if (await exists(skillsDir)) {
    const names = new Map<string, string[]>()
    for (const entry of await readdir(skillsDir)) {
      const skillMd = join(skillsDir, entry, 'SKILL.md')
      if (!(await exists(skillMd))) continue
      const declared = parseFrontmatterName(await readFile(skillMd, 'utf8'))
      if (declared === null) {
        manualTodos.push(`skills/${entry}/SKILL.md — no parseable name: frontmatter (SKILLS-1)`)
        continue
      }
      if (declared !== entry) {
        manualTodos.push(`skills/${entry} — name: '${declared}' != dir '${entry}' (SKILLS-1); rename dir OR edit frontmatter — your call`)
      }
      const seen = names.get(declared) ?? []
      seen.push(entry)
      names.set(declared, seen)
    }
    for (const [name, dirs] of names) {
      if (dirs.length > 1) {
        manualTodos.push(`Duplicate name: '${name}' in ${dirs.map((d) => `skills/${d}`).join(', ')} (SKILLS-2)`)
      }
    }
  }

  // ── judgment items — never guessed, always surfaced ──
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  if (manualTodos.length === 0) {
    console.log(`  ${paint(C.dim, 'none')}`)
  } else {
    for (const todo of manualTodos) console.log(`  - ${todo}`)
  }
  console.log(`  - CLAUDE.md coverage/freshness (CLAUDE-1..5) and ROADMAP.md discipline (ROAD-1..3) are prose judgment — read the rubric.`)
  console.log(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts` (or `ki:harness:audit`) to confirm findings clear.')}`
  )
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
