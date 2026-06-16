#!/usr/bin/env bun
// Lint Agent Skills against the MECHANICAL criteria of the knowledgeislands-skills rubric.
//
// This is the deterministic half of the rubric (see ../references/audit-rubric.md). The
// JUDGMENT half — description quality, altitude, progressive-disclosure sensibility,
// standard-vs-extension shape — needs a model and is NOT checked here. Run this first,
// then apply the judgment criteria by reading.
//
// Usage:
//   bun scripts/lint-skills.ts [path ...]   # a skill dir, or a dir containing skills
//   bun run skills:lint                      # (from the arcadia-skills repo root)
//
// A path containing SKILL.md is treated as one skill; otherwise its immediate
// subdirectories that contain a SKILL.md are each linted. Defaults to the current dir.
// Exits non-zero if any FAIL is reported (WARN never fails the run).
//
// With >= 2 skills in scope it also runs a cross-skill collision pass (COLL-1):
// two descriptions declaring the same quoted trigger phrase are WARNed.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

type Severity = 'fail' | 'warn'
type Finding = { severity: Severity; criterion: string; message: string }

// --- limits (from references/agent-skills-standard.md §16 — keep in sync) ----------------------
const NAME_MAX = 64
const DESC_MAX = 1024
const COMPAT_MIN = 1
const COMPAT_MAX = 500
const BODY_MAX_LINES = 500
const BODY_MAX_TOKENS = 5000 // estimated as chars/4
const TOC_LINE_THRESHOLD = 100
const RESERVED = ['anthropic', 'claude']

// --- minimal frontmatter parser --------------------------------------------
// Handles top-level scalar keys and `>`/`|` block scalars. Nested maps (e.g.
// `metadata:`) are recorded as present with an empty value; that is all the
// mechanical checks need. Avoids a YAML dependency so the script stays portable.
type Frontmatter = { keys: Map<string, string>; present: Set<string>; raw: string | null }

function parseFrontmatter(content: string): Frontmatter {
  const keys = new Map<string, string>()
  const present = new Set<string>()
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return { keys, present, raw: null }
  const block = m[1] as string
  const lines = block.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      i++
      continue
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):(.*)$/) // column-0 top-level key
    if (!kv) {
      i++
      continue
    }
    const key = kv[1] as string
    const rest = (kv[2] as string).trim()
    present.add(key)
    if (rest === '>' || rest === '|' || rest.startsWith('> ') || rest.startsWith('| ') || /^[>|][-+]?\d*\s*$/.test(rest)) {
      const folded = rest[0] === '>'
      const collected: string[] = []
      i++
      // Block body = subsequent indented lines (blank lines belong to it too).
      // Stops at the next column-0 key.
      while (i < lines.length) {
        const l = lines[i] as string
        if (l.trim() !== '' && !/^\s/.test(l)) break
        if (l.trim() !== '') collected.push(l.trim())
        i++
      }
      keys.set(key, folded ? collected.join(' ') : collected.join('\n'))
      continue
    }
    if (rest === '') {
      // bare key — could head a nested map; skip its indented children
      i++
      while (i < lines.length && /^\s+\S/.test(lines[i] as string)) i++
      keys.set(key, '')
      continue
    }
    keys.set(key, stripQuotes(rest))
    i++
  }
  return { keys, present, raw: block }
}

function stripQuotes(s: string): string {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1)
  return t
}

const hasXmlTag = (s: string): boolean => /<\/?[a-zA-Z][^>]*>/.test(s)

// Remove fenced code blocks and inline code spans, so text-pattern checks don't
// fire on documentation/examples (e.g. a description that names `<app>` as a
// placeholder, or a rubric that quotes `[[wikilink]]` syntax to forbid it).
const stripCode = (md: string): string => md.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

// --- markdown link extraction ----------------------------------------------
// Returns relative link targets (skips http/https/mailto/# anchors). Strips the
// CommonMark angle-bracket form and any #anchor suffix.
function relativeLinkTargets(md: string): string[] {
  const out: string[] = []
  const re = /\[[^\]]*\]\(([^)]+)\)/g
  let m: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((m = re.exec(md)) !== null) {
    let target = (m[1] as string).trim()
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1).trim()
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith('mailto:') || target.startsWith('#')) continue
    const hash = target.indexOf('#')
    if (hash !== -1) target = target.slice(0, hash)
    if (target) out.push(target)
  }
  return out
}

const hasWikilink = (md: string): boolean => /\[\[[^\]]+\]\]/.test(md)
const hasBackslashLink = (md: string): boolean => /\[[^\]]*\]\([^)]*\\[^)]*\)/.test(md)

function listMarkdownFiles(dir: string): string[] {
  const out: string[] = []
  const walk = (d: string): void => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue
      const p = join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) out.push(p)
    }
  }
  walk(dir)
  return out
}

function hasTableOfContents(md: string): boolean {
  const head = md.split(/\r?\n/).slice(0, 40).join('\n').toLowerCase()
  if (/^#{1,3}\s+(table of )?contents\b/m.test(head)) return true
  const linkListItems = (head.match(/^\s*[-*]\s+\[[^\]]+\]\(/gm) || []).length
  return linkListItems >= 3
}

// --- the lint --------------------------------------------------------------
function lintSkill(skillDir: string): Finding[] {
  const f: Finding[] = []
  const fail = (criterion: string, message: string): void => void f.push({ severity: 'fail', criterion, message })
  const warn = (criterion: string, message: string): void => void f.push({ severity: 'warn', criterion, message })

  const skillMd = join(skillDir, 'SKILL.md')
  if (!existsSync(skillMd)) {
    fail('LAY-1', 'SKILL.md is missing')
    return f
  }
  const content = readFileSync(skillMd, 'utf8')
  const dirName = basename(skillDir)

  // --- frontmatter ---
  const fm = parseFrontmatter(content)
  if (fm.raw === null) {
    fail('LAY-1/NAME-1', 'No YAML frontmatter block (--- ... ---) at the top of SKILL.md')
    return f
  }
  const name = fm.keys.get('name')
  const desc = fm.keys.get('description')

  // name (NAME-1–NAME-7 mechanical)
  if (!name) fail('NAME-1', '`name` is missing from frontmatter')
  else {
    if (name.length > NAME_MAX) fail('NAME-2', `\`name\` is ${name.length} chars (max ${NAME_MAX})`)
    if (!/^[a-z0-9-]+$/.test(name)) fail('NAME-3', `\`name\` "${name}" must be lowercase letters, digits, and hyphens only`)
    if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) fail('NAME-4', `\`name\` "${name}" must not start/end with a hyphen or contain "--"`)
    if (name !== dirName) fail('NAME-5', `\`name\` "${name}" does not match the directory name "${dirName}"`)
    if (hasXmlTag(name)) fail('NAME-6', '`name` contains an XML tag')
    for (const r of RESERVED) if (name.includes(r)) fail('NAME-6', `\`name\` contains the reserved word "${r}"`)
  }

  // description (DESC-1–DESC-3 mechanical)
  if (!desc || desc.trim() === '') fail('DESC-1', '`description` is missing or empty')
  else {
    if (desc.length > DESC_MAX) fail('DESC-2', `\`description\` is ${desc.length} chars (max ${DESC_MAX})`)
    if (hasXmlTag(stripCode(desc))) fail('DESC-3', '`description` contains an XML tag')
  }

  // compatibility (OPT-1 mechanical)
  const compat = fm.keys.get('compatibility')
  if (compat !== undefined && (compat.length < COMPAT_MIN || compat.length > COMPAT_MAX)) fail('OPT-1', `\`compatibility\` is ${compat.length} chars (must be ${COMPAT_MIN}–${COMPAT_MAX})`)

  // --- body size (SIZE-1/SIZE-2 soft → WARN) ---
  const body = content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) || [''])[0].length)
  const bodyLines = body.split(/\r?\n/).length
  if (bodyLines > BODY_MAX_LINES) warn('SIZE-1', `SKILL.md body is ${bodyLines} lines (recommended < ${BODY_MAX_LINES}) — split into references/`)
  const estTokens = Math.round(body.length / 4)
  if (estTokens > BODY_MAX_TOKENS) warn('SIZE-2', `SKILL.md body is ~${estTokens} tokens (recommended < ${BODY_MAX_TOKENS})`)

  // --- links & wikilinks across all markdown (LAY-4, LINK-1, LINK-2, REF-3) ---
  for (const file of listMarkdownFiles(skillDir)) {
    const md = readFileSync(file, 'utf8')
    const text = stripCode(md) // exclude code blocks/spans from text-pattern checks
    const rel = file.slice(skillDir.length + 1)
    if (hasWikilink(text)) fail('LINK-1', `${rel}: uses Obsidian wikilinks ([[...]]) — use relative markdown links`)
    if (hasBackslashLink(text)) fail('LAY-4', `${rel}: a link target uses backslashes — use forward slashes`)
    for (const target of relativeLinkTargets(text)) {
      const resolved = resolve(dirname(file), target)
      if (!existsSync(resolved)) fail('LINK-2', `${rel}: broken relative link → "${target}"`)
    }
    // ToC on long reference files (not SKILL.md itself)
    if (basename(file) !== 'SKILL.md') {
      const lineCount = md.split(/\r?\n/).length
      if (lineCount > TOC_LINE_THRESHOLD && !hasTableOfContents(md)) warn('REF-3', `${rel}: ${lineCount} lines but no table of contents near the top`)
    }
  }

  // --- composition-only: flag endorsement of the retired extension pattern (SHAPE-2 heuristic) ---
  // Composition is the sole sanctioned inter-skill relationship; the base-coupled
  // extension pattern is retired (a base declares differences in .ki-config / CLAUDE.md,
  // it does not ship a <base>-kb skill that takes the shared modes). Keyed on ENDORSEMENT
  // phrasing, not the bare word "extension" — the meta-skills must be free to name the
  // retired pattern in order to forbid it. Scans the SKILL.md body only (not reference
  // files, which legitimately define the rule). WARN for the [J] reviewer to confirm.
  const endorsesExtension = [/\bprefer that (extension )?skill\b/i, /delegat\w*[^.\n]*\bmodes?\b[^.\n]*\bback\b/i, /\bextends this one\b/i].some((re) => re.test(stripCode(body)))
  if (endorsesExtension)
    warn(
      'SHAPE-2',
      'endorses the retired base-coupled extension pattern (ship/"prefer" an extension skill, "delegates the modes back", "extends this one") — relationships are composition only; declare base differences in .ki-config / CLAUDE.md, per SHAPE-2'
    )

  // --- behaviour-changing skills must anchor their gate (SHAPE-7 heuristic) ---
  // A skill that installs a gate / standing rule can't rely on its own description
  // to fire (skills load on demand). Strong gate phrasing in the body, without an
  // always-on anchor (CLAUDE.md/AGENTS.md) AND a checker that verifies it, is a
  // candidate gap — WARN for the [J] reviewer to confirm. Conservative by design:
  // keyed on strong phrasing, not the bare word "gate".
  const strongGate = /do not edit[^.\n]*directly|go through (a )?proposal|standing directive|installing the gate/i.test(stripCode(body))
  if (strongGate) {
    const bodyAnchors = /CLAUDE\.md|AGENTS\.md|always-loaded|installing the gate|\banchor/i.test(body)
    const scriptsDir = join(skillDir, 'scripts')
    const checkerAnchors = existsSync(scriptsDir) && readdirSync(scriptsDir).some((n) => n.endsWith('.ts') && /CLAUDE\.md|AGENTS\.md/.test(readFileSync(join(scriptsDir, n), 'utf8')))
    if (!(bodyAnchors && checkerAnchors))
      warn(
        'SHAPE-7',
        'reads as behaviour-changing (a gate / standing rule) but does not evidence an always-on anchor verified by its checker — anchor it in CLAUDE.md/AGENTS.md and check the anchor, per SHAPE-7'
      )
  }

  return f
}

// --- cross-skill collision (COLL-1 mechanical) -----------------------------
// A description's "triggers" are its quoted phrases. Two skills declaring the
// SAME trigger compete at selection time — WARN (an off-ramp in the prose, which
// the model judges per COLL-2, can make it acceptable, so never FAIL). Only runs
// when >= 2 skills are in scope; point the linter at the repo to get the set.
function triggerPhrases(desc: string): string[] {
  const out = new Set<string>()
  const re = /"([^"]{2,})"/g
  let m: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((m = re.exec(desc)) !== null) {
    const t = (m[1] as string).toLowerCase().replace(/\s+/g, ' ').trim()
    if (t) out.add(t)
  }
  return [...out]
}

function collisionFindings(dirs: string[]): Finding[] {
  if (dirs.length < 2) return []
  const byPhrase = new Map<string, Set<string>>()
  for (const dir of dirs) {
    const skillMd = join(dir, 'SKILL.md')
    if (!existsSync(skillMd)) continue
    const desc = parseFrontmatter(readFileSync(skillMd, 'utf8')).keys.get('description') ?? ''
    for (const phrase of triggerPhrases(desc)) {
      if (!byPhrase.has(phrase)) byPhrase.set(phrase, new Set())
      byPhrase.get(phrase)?.add(basename(dir))
    }
  }
  const out: Finding[] = []
  for (const [phrase, skills] of byPhrase) {
    if (skills.size > 1)
      out.push({ severity: 'warn', criterion: 'COLL-1', message: `trigger "${phrase}" is shared by ${[...skills].sort().join(', ')} — confirm each names the other as an off-ramp (COLL-2)` })
  }
  return out.sort((a, b) => a.message.localeCompare(b.message))
}

// --- discovery -------------------------------------------------------------
function discoverSkillDirs(p: string): string[] {
  const abs = resolve(p)
  if (!existsSync(abs)) {
    console.error(paint(C.red, `path not found: ${abs}`))
    return []
  }
  if (existsSync(join(abs, 'SKILL.md'))) return [abs]
  return readdirSync(abs, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'scripts')
    .map((e) => join(abs, e.name))
    .filter((d) => existsSync(join(d, 'SKILL.md')))
    .sort()
}

// --- main ------------------------------------------------------------------
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const roots = args.length ? args : ['.']
const skillDirs = [...new Set(roots.flatMap(discoverSkillDirs))].sort()

if (skillDirs.length === 0) {
  console.error(paint(C.red, 'No skills found (no directory with a SKILL.md).'))
  process.exit(1)
}

// One-line key for the area codes printed below (full catalogue: references/audit-rubric.md).
const LEGEND =
  'area codes — LAY layout · NAME name · DESC description · OPT optional-fm · SIZE size · REF references · BODY content · SCRIPT scripts · LINK linking · SHAPE KI-shape · PROC process · COLL collision · LONG longevity'
console.log(paint(C.dim, LEGEND))

let totalFails = 0
let totalWarns = 0
for (const dir of skillDirs) {
  const findings = lintSkill(dir)
  const fails = findings.filter((x) => x.severity === 'fail')
  const warns = findings.filter((x) => x.severity === 'warn')
  totalFails += fails.length
  totalWarns += warns.length
  const stamp = fails.length ? paint(C.red, 'FAIL') : warns.length ? paint(C.yellow, 'WARN') : paint(C.green, 'PASS')
  console.log(`\n${stamp}  ${paint(C.cyan, basename(dir))}`)
  for (const x of findings) {
    const tag = x.severity === 'fail' ? paint(C.red, 'fail') : paint(C.yellow, 'warn')
    console.log(`  ${tag} ${paint(C.dim, `[${x.criterion}]`)} ${x.message}`)
  }
  if (findings.length === 0) console.log(paint(C.dim, '  all mechanical checks passed'))
}

// cross-skill pass: collision between sibling descriptions (COLL-1)
const collisions = collisionFindings(skillDirs)
if (collisions.length > 0) {
  totalWarns += collisions.length
  console.log(`\n${paint(C.yellow, 'WARN')}  ${paint(C.cyan, 'collision (cross-skill)')}`)
  for (const x of collisions) console.log(`  ${paint(C.yellow, 'warn')} ${paint(C.dim, `[${x.criterion}]`)} ${x.message}`)
}

console.log(`\n${paint(C.cyan, 'summary')}: ${skillDirs.length} skill(s), ${paint(C.red, `${totalFails} fail`)}, ${paint(C.yellow, `${totalWarns} warn`)}`)
console.log(paint(C.dim, 'mechanical checks only — apply the judgment criteria from references/audit-rubric.md by reading.'))
process.exit(totalFails > 0 ? 1 : 0)
