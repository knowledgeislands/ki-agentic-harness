#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-kb standard — fixes the subset of audit.ts's
 * findings that are unambiguous and reversible, leaving everything that needs a
 * human call (or that risks inventing KB structure) as a printed manual TODO.
 *
 * Scope: a single target base (default cwd), matching the house conform shape
 * (conform.ts, conform.ts) — `bun conform.ts .` / `ki:kb:conform`.
 * The zone list, staging areas, the `[ki-kb]` / `[ki-kb.zones]` config schema and
 * its parser, and the `KI_DEFAULT` opt-in marker template are kept in lockstep
 * with audit.ts (same source of truth, copied rather than imported so each
 * script stays valid standalone per the composition-only rule).
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                           # print the plan, mutate nothing
 *
 * Fixes:
 *   - Config marker: when `.ki-config.toml` has no `[ki-kb]` table at all, appends
 *     the bare opt-in marker (audit.ts's `--init` template) — never overwrites
 *     an existing table, never edits its contents (that's CONFIG-1/2/3, judgment).
 *   - ZONE-2 (missing same-name zone index note): scaffolds an empty index note
 *     stub — `<zone>/<zone>.md` — but ONLY inside a zone folder that ALREADY
 *     EXISTS. Zone folders themselves are never created; which folders a base
 *     uses (and any `[ki-kb.zones]` alias) is a judgment call about KB structure,
 *     not something this script guesses.
 *   - ZONE-3 (missing root memory index): scaffolds an empty `Admin/MEMORY.md`
 *     stub — but ONLY when the Admin zone folder already exists, for the same
 *     reason.
 *
 * Deliberately NEVER touches (judgment — printed as manual TODOs instead):
 *   - MEM-2 (no CLAUDE.md/AGENTS.md anchor, or an anchor that doesn't name the
 *     MEMORY index / scope-before-work rule) — anchor prose is authored, not
 *     templated.
 *   - Any note's frontmatter CONTENT (NOTE-1 required keys, NOTE-1a unterminated
 *     fences, NOTE-1b non-snake_case keys) — repairing a note's frontmatter risks
 *     guessing values that belong to the author, never auto-fixed here.
 *   - CONFIG-1/2/3 (unrecognised key, redundant self-alias, non-canonical zone
 *     key) — once a `[ki-kb]` table exists, its contents are judgment.
 *   - Admin/Governance, Admin/Operations, Charter.md, Conformance.md scaffolding —
 *     these subdivisions are opt-in and their content (scope, purpose, owner,
 *     adopted-skill table) is authored, not templated.
 *   - Zone/staging folder creation itself, and any `[ki-kb.zones]` alias — never
 *     guessed by this script.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on
 * an unrecoverable error (target path not a directory); findings/fixes never
 * fail the run.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const ZONES = ['Calendar', 'Pillars', 'Resources', 'Streams', 'Admin']
const MEMORY_INDEX = 'MEMORY.md'
const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'ki-kb'
const ZONES_SECTION = `${KI_SECTION}.zones`

// Same opt-in marker audit.ts's `--init` emits.
const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: declaring this table opts the base into the kb standard.
# The keys below are optional; a base on the canonical zone names (${ZONES.join(' / ')})
# with no frontmatter contract and no extra pre-flight declares just the bare table header.
[${KI_SECTION}]
# Frontmatter keys every note that HAS frontmatter must carry (extra keys are free).
# Omit to leave required frontmatter as a judgment call. Keys must be snake_case.
# required_frontmatter = ["tags", "status", "author"]
#
# Notes (paths or globs, relative to the base) to read before drafting — the
# base-specific pre-flight. Omit for none beyond the memory cascade.
# preflight = ["Pillars/<Pillar>/Profiles", "Admin/Conventions.md"]

# [${ZONES_SECTION}]
# canonical zone or staging area = this base's local folder. Resolve every zone
# reference through it; for a rename in progress, drop the line once the folder
# reaches its canonical name.
# Pillars = "<local folder name>"
`

// Same minimal parser as audit.ts — a full TOML parser is unnecessary for
// this constrained schema, and only this skill's own table(s) are read.
type KiKb = { keys: Record<string, string>; zones: Record<string, string> }
function parseKiKb(text: string): KiKb | null {
  let section = ''
  let seen = false
  const out: KiKb = { keys: {}, zones: {} }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) continue
    const header = line.match(/^\[(.+)\]$/)
    if (header) {
      section = (header[1] as string).trim()
      if (section === KI_SECTION || section === ZONES_SECTION) seen = true
      continue
    }
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    const rawVal = line.slice(eq + 1).trim()
    const unquote = (s: string): string => s.replace(/^["']|["']$/g, '')
    if (section === KI_SECTION && key !== 'required_frontmatter' && key !== 'preflight') out.keys[key] = unquote(rawVal)
    else if (section === ZONES_SECTION) out.zones[unquote(key)] = unquote(rawVal)
  }
  return seen ? out : null
}

const isDir = (p: string): boolean => existsSync(p) && statSync(p).isDirectory()
const isFile = (p: string): boolean => existsSync(p) && statSync(p).isFile()

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  if (!isDir(target)) {
    console.error(paint(C.red, `not a directory: ${target}`))
    process.exit(1)
    return
  }

  const kiPath = join(target, KI_CONFIG)
  const kiText = existsSync(kiPath) ? readFileSync(kiPath, 'utf8') : ''
  const ki = kiText ? parseKiKb(kiText) : null
  const zoneOf = (z: string): string => ki?.zones[z] ?? z

  console.log(paint(C.dim, `target: ${target}${dryRun ? '   (dry run)' : ''}\n`))

  const manualTodos: string[] = []

  // ── a) config marker: append the bare [ki-kb] opt-in table if entirely absent ──
  console.log(paint(C.cyan, `${KI_CONFIG} [${KI_SECTION}] marker`))
  if (ki) {
    console.log(`  ${paint(C.dim, `[${KI_SECTION}] table already present — leaving contents untouched (CONFIG-1/2/3 are judgment)`)}`)
  } else {
    console.log(`  ${paint(C.green, 'append')} ${KI_CONFIG} [${KI_SECTION}] opt-in marker`)
    if (!dryRun) writeFileSync(kiPath, kiText ? `${kiText.replace(/\n*$/, '\n\n')}${KI_DEFAULT}` : KI_DEFAULT)
  }

  // ── b) zone index notes (ZONE-2) — only inside a zone folder that already exists ──
  console.log(`\n${paint(C.cyan, 'zone index notes (ZONE-2)')}`)
  let zoneFixes = 0
  for (const z of ZONES) {
    const folder = zoneOf(z)
    const zoneDir = join(target, folder)
    if (!isDir(zoneDir)) {
      console.log(`  ${paint(C.dim, `${folder}/ absent — zone folder creation is a judgment call, not scaffolded here`)}`)
      continue
    }
    const indexPath = join(zoneDir, `${folder}.md`)
    if (isFile(indexPath)) continue
    console.log(`  ${paint(C.green, 'write')} ${folder}/${folder}.md`)
    if (!dryRun) writeFileSync(indexPath, `# ${folder}\n`)
    zoneFixes++
  }
  if (zoneFixes === 0) console.log(`  ${paint(C.dim, 'nothing to scaffold')}`)

  // ── c) root memory index (ZONE-3) — only inside an existing Admin/ folder ──
  console.log(`\n${paint(C.cyan, 'root memory index (ZONE-3)')}`)
  const adminFolder = zoneOf('Admin')
  const adminDir = join(target, adminFolder)
  if (!isDir(adminDir)) {
    console.log(`  ${paint(C.dim, `${adminFolder}/ absent — zone folder creation is a judgment call, not scaffolded here`)}`)
  } else {
    const memoryPath = join(adminDir, MEMORY_INDEX)
    if (isFile(memoryPath)) {
      console.log(`  ${paint(C.dim, 'nothing to scaffold')}`)
    } else {
      console.log(`  ${paint(C.green, 'write')} ${adminFolder}/${MEMORY_INDEX}`)
      if (!dryRun) {
        mkdirSync(dirname(memoryPath), { recursive: true })
        writeFileSync(memoryPath, `# MEMORY\n\n## Active Pillars\n\n<!-- list active Pillars here -->\n`)
      }
    }
  }

  // ── judgment items — never guessed, always surfaced ──
  manualTodos.push('MEM-2 — CLAUDE.md / AGENTS.md anchor prose: name the MEMORY index / scope-before-work rule at the base root.')
  manualTodos.push(
    'NOTE-1 / NOTE-1a / NOTE-1b — per-note frontmatter content (required keys, unterminated fences, non-snake_case keys): repair by hand, never guessed.'
  )
  manualTodos.push('CONFIG-1 / CONFIG-2 / CONFIG-3 — once a [ki-kb] table exists, its keys/aliases are judgment, not auto-fixed.')
  manualTodos.push(
    'Admin/Governance/, Admin/Operations/, Charter.md, Conformance.md — opt-in subdivisions; create and author only when that concern is active.'
  )
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  for (const todo of manualTodos) console.log(`  - ${todo}`)
  console.log(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts .` (or `ki:kb:audit`) to confirm findings clear.')}`
  )
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
