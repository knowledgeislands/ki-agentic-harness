#!/usr/bin/env bun
/**
 * Mechanical checker for a Knowledge Islands knowledge base.
 *
 *   bun scripts/audit-kb.ts [base-path]   # audit a base (default: cwd)
 *   bun scripts/audit-kb.ts --init        # print the default [knowledgeislands-kb] block
 *
 * This is the mechanical half of the skill's Mode AUDIT — the deterministic
 * layer the judgment pass (note routing, frontmatter quality, memory-index
 * accuracy) builds on. It checks two things against a base directory:
 *
 *   1. ZONE LAYOUT — the five zones (Calendar, Pillars, Resources, Streams,
 *      Admin) are present, each carries a same-name index note, and the root
 *      memory index Admin/MEMORY.md exists. `+` and `-` are inbound/outbound
 *      staging, not zones, so they carry no same-name index — reported only
 *      informationally. Zone folders are resolved THROUGH the zone alias below,
 *      so a base mid-rename is audited at its real folder.
 *
 *   2. CONFIG TABLE — the base's `.ki-config.toml` `[knowledgeislands-kb]`
 *      table, validated DOWN (this skill's own keys only) per the shared-file
 *      contract owned by `knowledgeislands-repo`: warn on a key it does not
 *      recognise, advise dropping a zone mapped to its own canonical name, and
 *      never read another skill's table. The only keys are the
 *      `[knowledgeislands-kb.zones]` aliases (`Pillars = "Matters"`), a
 *      transitional override for a base part-way through renaming a zone folder.
 *
 * READ-ONLY: never mutates the base. `--init` writes nothing — it prints the
 * default block to stdout for the author to paste into the base's config.
 * No npm dependencies — Bun/Node built-ins only. Exit code is non-zero on any FAIL.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── the structure model (keep in sync with ../SKILL.md + the reference) ──────
// The five index-carrying zones, in canonical order.
const ZONES = ['Calendar', 'Pillars', 'Resources', 'Streams', 'Admin'] as const
// Inbound / outbound staging — NOT zones; exempt from the same-name index rule.
const STAGING = ['+', '-']
// The root memory index lives in the Admin zone (resolved through any alias).
const MEMORY_INDEX = 'MEMORY.md'

const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'knowledgeislands-kb'
const ZONES_SECTION = `${KI_SECTION}.zones`

// The default block `--init` emits. Nothing here is mandatory: a base on the
// canonical zone names needs no [knowledgeislands-kb] table at all, so the whole
// block is a commented template the author uncomments only to declare an alias.
const KI_DEFAULT = `# ${KI_SECTION} reads this table only when the base diverges from the canonical
# zone names during a migration. A base on the canonical names
# (${ZONES.join(' / ')}) needs no table here.
#
# [${ZONES_SECTION}]
# canonical zone = this base's local folder. Resolve every zone reference
# through it; drop the line once the folder is renamed to the canonical name.
# Pillars = "Matters"
`

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// `note` is informational (an alias in effect, staging presence) — printed, never counted.
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

const isDir = (p: string): boolean => existsSync(p) && statSync(p).isDirectory()
const isFile = (p: string): boolean => existsSync(p) && statSync(p).isFile()

// Minimal parser for the constrained schema: `[table]` headers (incl. the dotted
// `[knowledgeislands-kb.zones]` sub-table), flat `key = "value"` / `key = true|false`
// on one line, `#` comments. NOT a full TOML parser, and it reads ONLY this skill's
// tables — another skill's `[table]` is ignored entirely (validate down, ignore
// across). Returns null if the file has no `[knowledgeislands-kb…]` table at all.
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
    const val = line
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (section === KI_SECTION) out.keys[key] = val
    else if (section === ZONES_SECTION) out.zones[key] = val
  }
  return seen ? out : null
}

function auditBase(base: string, ki: KiKb | null): Finding[] {
  const { f, fail, warn, note } = mk()
  const zoneOf = (z: string): string => ki?.zones[z] ?? z

  // ── config table: validate this skill's own table, DOWN ──
  if (ki) {
    for (const key of Object.keys(ki.keys)) {
      warn('config', `[${KI_SECTION}] has no scalar key "${key}" — the only keys are zone aliases under [${ZONES_SECTION}]`)
    }
    for (const [zone, folder] of Object.entries(ki.zones)) {
      if (!(ZONES as readonly string[]).includes(zone)) warn('config', `[${ZONES_SECTION}] "${zone}" is not a canonical zone (one of: ${ZONES.join(', ')})`)
      else if (folder === zone) note('config', `[${ZONES_SECTION}] ${zone} = "${folder}" restates the canonical name — drop it`)
      else note('config', `alias in effect: ${zone} zone resolves to ${folder}/`)
    }
  }

  // ── zone layout (resolved through any alias) ──
  const present = ZONES.filter((z) => isDir(join(base, zoneOf(z))))
  if (present.length === 0) {
    fail('base', `no Knowledge Islands zone folders found at ${base} — not a KB base, or wrong path`)
    return f
  }
  for (const z of ZONES) {
    const folder = zoneOf(z)
    if (!isDir(join(base, folder))) {
      fail('zone', `zone ${z} missing (expected ${folder}/)`)
      continue
    }
    if (!isFile(join(base, folder, `${folder}.md`))) warn('index', `${folder}/ has no same-name index note (${folder}/${folder}.md)`)
  }

  // ── root memory index (in the Admin zone) ──
  const adminFolder = zoneOf('Admin')
  if (isDir(join(base, adminFolder)) && !isFile(join(base, adminFolder, MEMORY_INDEX))) fail('memory', `root memory index ${adminFolder}/${MEMORY_INDEX} is missing (lists the active Pillars)`)

  // ── staging (informational only) ──
  for (const s of STAGING) note('staging', `${s}/ ${isDir(join(base, s)) ? 'present' : 'absent'} (staging, not a zone)`)

  return f
}

// ── run ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
if (argv.includes('--init')) {
  process.stdout.write(KI_DEFAULT)
  process.exit(0)
}

const base = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')
if (!isDir(base)) {
  console.error(paint(C.red, `not a directory: ${base}`))
  process.exit(2)
}

const kiPath = join(base, KI_CONFIG)
const ki = isFile(kiPath) ? parseKiKb(readFileSync(kiPath, 'utf8')) : null

console.log(paint(C.dim, `base: ${base}`))
console.log(paint(C.dim, `standard: zones(${ZONES.join(',')}) + staging(${STAGING.join(',')}) · same-name index per zone · Admin/${MEMORY_INDEX} · [${KI_SECTION}.zones] aliases`))

const findings = auditBase(base, ki)
const fails = findings.filter((x) => x.level === 'fail')
const warns = findings.filter((x) => x.level === 'warn')
const notes = findings.filter((x) => x.level === 'note')
const stamp = fails.length ? paint(C.red, 'FAIL') : warns.length ? paint(C.yellow, 'WARN') : paint(C.green, 'PASS')
console.log(`\n${stamp}  ${paint(C.cyan, base.split('/').pop() ?? base)}`)
for (const x of fails) console.log(`  ${paint(C.red, 'fail')} ${paint(C.dim, `[${x.check}]`)} ${x.msg}`)
for (const x of warns) console.log(`  ${paint(C.yellow, 'warn')} ${paint(C.dim, `[${x.check}]`)} ${x.msg}`)
for (const x of notes) console.log(`  ${paint(C.dim, `note [${x.check}] ${x.msg}`)}`)
if (fails.length + warns.length === 0) console.log(paint(C.dim, '  conforms'))

console.log(`\n${paint(C.cyan, 'summary')}: ${paint(C.red, `${fails.length} fail`)}, ${paint(C.yellow, `${warns.length} warn`)}`)
console.log(paint(C.dim, 'mechanical checks only — apply the judgment criteria (note routing, frontmatter, memory-index accuracy) by reading.'))
process.exit(fails.length > 0 ? 1 : 0)
