#!/usr/bin/env bun
/**
 * Mechanical checker for a Knowledge Islands knowledge base.
 *
 *   bun scripts/audit-kb.ts [base-path]   # audit a base (default: cwd)
 *   bun scripts/audit-kb.ts --init        # print the default [knowledgeislands-kb] block
 *
 * This is the mechanical half of the skill's Mode AUDIT — the deterministic
 * layer the judgment pass (note routing, memory-index accuracy) builds on. It
 * checks three things against a base directory:
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
 *      transitional override for a base part-way through renaming a zone folder,
 *      and an optional `required_frontmatter` array (see point 3).
 *
 *   3. NOTE FRONTMATTER — for every note that HAS a `---` frontmatter block:
 *      the fence must close (well-formed) and its top-level keys must be
 *      snake_case (the house convention) — both base-agnostic. When the base
 *      declares `required_frontmatter = [...]` in its table, those keys must be
 *      present too (extra keys stay free); omitted, required frontmatter is left
 *      to the judgment pass. Whether a note SHOULD carry frontmatter at all is
 *      base/type-specific and stays judgment.
 *
 * READ-ONLY: never mutates the base. `--init` writes nothing — it prints the
 * default block to stdout for the author to paste into the base's config.
 * No npm dependencies — Bun/Node built-ins only. Exit code is non-zero on any FAIL.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
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
const KI_DEFAULT = `# ${KI_SECTION} reads this table for two optional, per-base declarations. A base on
# the canonical zone names (${ZONES.join(' / ')}) with no
# frontmatter contract needs no table here at all.

# [${KI_SECTION}]
# Frontmatter keys every note that HAS frontmatter must carry (extra keys are free).
# Omit to leave required frontmatter as a judgment call. Keys must be snake_case.
# required_frontmatter = ["tags", "status", "author"]

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
type KiKb = { keys: Record<string, string>; zones: Record<string, string>; requiredFrontmatter: string[] | null }
const unquote = (s: string): string => s.replace(/^["']|["']$/g, '')
// `key = ["a", "b"]` → ['a','b']; tolerant of single/double quotes and spacing.
const parseInlineArray = (val: string): string[] => {
  const m = val.match(/^\[(.*)\]$/)
  if (!m) return []
  return (m[1] as string)
    .split(',')
    .map((s) => unquote(s.trim()))
    .filter(Boolean)
}
function parseKiKb(text: string): KiKb | null {
  let section = ''
  let seen = false
  const out: KiKb = { keys: {}, zones: {}, requiredFrontmatter: null }
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
    if (section === KI_SECTION) {
      // `required_frontmatter` is the one recognised scalar key (an array); any
      // other scalar key is unrecognised and warns (CONFIG-1).
      if (key === 'required_frontmatter') out.requiredFrontmatter = parseInlineArray(rawVal)
      else out.keys[key] = unquote(rawVal)
    } else if (section === ZONES_SECTION) out.zones[key] = unquote(rawVal)
  }
  return seen ? out : null
}

// House convention: frontmatter keys are snake_case (lowercase, digits, underscore).
const SNAKE = /^[a-z][a-z0-9_]*$/
// Every *.md under the base, skipping dotdirs (.git, …) and node_modules.
function walkMarkdown(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue
    const p = join(dir, e.name)
    if (e.isDirectory()) walkMarkdown(p, acc)
    else if (e.name.endsWith('.md')) acc.push(p)
  }
  return acc
}
// A note's top-level frontmatter keys + whether the opening `---` fence closes.
// Returns null when the file has no leading `---` fence (no frontmatter — fine).
function frontmatterKeys(text: string): { keys: string[]; terminated: boolean } | null {
  const lines = text.split(/\r?\n/)
  if (lines[0]?.trim() !== '---') return null
  const keys: string[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] as string
    if (line.trim() === '---') return { keys, terminated: true }
    if (/^\s/.test(line)) continue // nested (list item / sub-map) — not a top-level key
    const ci = line.indexOf(':')
    if (ci > 0) keys.push(line.slice(0, ci).trim())
  }
  return { keys, terminated: false }
}
const sampleList = (xs: string[], n = 10): string => xs.slice(0, n).join('; ') + (xs.length > n ? `; …+${xs.length - n} more` : '')

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

  // ── note frontmatter ──
  // Base-agnostic [M]: a note with frontmatter must close its `---` fence and use
  // snake_case keys (the house convention). Base-declared [M]: when the base lists
  // `required_frontmatter` in its [knowledgeislands-kb] table, every note that HAS
  // frontmatter must carry those keys (extra keys stay free). Whether a given note
  // SHOULD have frontmatter at all is base/type-specific — that stays judgment.
  const required = ki?.requiredFrontmatter ?? []
  let scanned = 0
  let withFm = 0
  const unterminated: string[] = []
  const badKeys: string[] = []
  const missingReq: string[] = []
  for (const file of walkMarkdown(base)) {
    scanned++
    const fm = frontmatterKeys(readFileSync(file, 'utf8'))
    if (!fm) continue
    withFm++
    const rel = file.slice(base.length + 1)
    if (!fm.terminated) {
      unterminated.push(rel)
      continue // keys past an unclosed fence aren't trustworthy
    }
    for (const k of fm.keys) if (!SNAKE.test(k)) badKeys.push(`${rel}: "${k}"`)
    for (const r of required) if (!fm.keys.includes(r)) missingReq.push(`${rel} (${r})`)
  }
  if (unterminated.length) fail('frontmatter', `unterminated frontmatter (no closing \`---\`) in ${unterminated.length} note(s): ${sampleList(unterminated)}`)
  if (missingReq.length) fail('frontmatter', `missing required key(s) [${required.join(', ')}] in ${missingReq.length} note(s): ${sampleList(missingReq)}`)
  if (badKeys.length) warn('frontmatter', `non-snake_case frontmatter key(s) in ${badKeys.length} note(s): ${sampleList(badKeys)}`)
  note('frontmatter', `scanned ${scanned} note(s), ${withFm} with frontmatter${required.length ? ` · required keys: ${required.join(', ')}` : ' · no required_frontmatter declared'}`)

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
console.log(
  paint(
    C.dim,
    `standard: zones(${ZONES.join(',')}) + staging(${STAGING.join(',')}) · same-name index per zone · Admin/${MEMORY_INDEX} · [${KI_SECTION}.zones] aliases · frontmatter(well-formed, snake_case keys, declared required)`
  )
)

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
console.log(paint(C.dim, 'mechanical checks only — apply the judgment criteria (note routing, whether a note needs frontmatter, memory-index accuracy) by reading.'))
process.exit(fails.length > 0 ? 1 : 0)
