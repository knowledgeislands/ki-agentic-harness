/**
 * Set-resolution helpers shared by the EDUCATE chain (`repo-bootstrap.ts`) and the
 * vendored-set alignment checker (`audit.ts`). Pure, read-only: given a
 * target repo and the harness `skills/` root, computes which skills *should* be
 * vendored — exactly the skills a target declares in `.ki-config.toml` (plus
 * explicit seeds) — and locates each skill's checker/conform
 * script. Kept import-only (no top-level side effects) so both callers can use it
 * without triggering the other's CLI behaviour.
 */

import { existsSync, lstatSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readText } from './runtime-paths.ts'

export const BOOTSTRAP = 'ki-bootstrap'

// The harness `skills/` root this engine reads sources from. Local run: the
// working tree three levels up from this file (scripts/ → ki-bootstrap/ → keystone/
// → skills/). (Remote-URL sourcing is a documented follow-on; the vendored output
// is identical either way.)
export const SKILLS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..')

// Skills live two levels under SKILLS_ROOT (skills/<cluster>/<name>/SKILL.md) —
// built once and memoized so every by-name lookup below stays O(1) after the
// first call. Keyed by bare skill name; callers never need to know a skill's
// cluster.
let skillIndexCache: Map<string, string> | null = null
function skillIndex(): Map<string, string> {
  if (skillIndexCache) return skillIndexCache
  const idx = new Map<string, string>()
  for (const entry of readdirSync(SKILLS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const clusterDir = join(SKILLS_ROOT, entry.name)
    if (existsSync(join(clusterDir, 'SKILL.md'))) {
      idx.set(entry.name, clusterDir) // tolerate a flat leftover during migration
      continue
    }
    for (const sub of readdirSync(clusterDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue
      const skillPath = join(clusterDir, sub.name)
      if (existsSync(join(skillPath, 'SKILL.md'))) idx.set(sub.name, skillPath)
    }
  }
  skillIndexCache = idx
  return idx
}

export class SkillResolutionError extends Error {
  readonly unresolved: string[]

  constructor(unresolved: Iterable<string>) {
    const sorted = [...new Set(unresolved)].sort()
    super(`unresolvable skill root${sorted.length === 1 ? '' : 's'}: ${sorted.join(', ')}`)
    this.name = 'SkillResolutionError'
    this.unresolved = sorted
  }
}

export class DependencyDeclarationError extends Error {
  readonly missing: string[]

  constructor(missing: Iterable<string>) {
    const sorted = [...new Set(missing)].sort()
    super(`missing explicit skill dependenc${sorted.length === 1 ? 'y' : 'ies'}: ${sorted.join(', ')}`)
    this.name = 'DependencyDeclarationError'
    this.missing = sorted
  }
}

export function skillDir(skill: string): string {
  const dir = skillIndex().get(skill)
  if (!dir) throw new SkillResolutionError([skill])
  return dir
}

export function allSkillNames(): string[] {
  return [...skillIndex().keys()].sort()
}

export function isSkill(skill: string): boolean {
  return skillIndex().has(skill)
}

type MultilineDelimiter = '"""' | "'''"

function tripleClose(line: string, delimiter: MultilineDelimiter, from: number): number {
  let at = line.indexOf(delimiter, from)
  while (at !== -1) {
    const backslashes = line.slice(0, at).match(/\\+$/)?.[0].length ?? 0
    if (delimiter === "'''" || backslashes % 2 === 0) return at
    at = line.indexOf(delimiter, at + delimiter.length)
  }
  return -1
}

// Return only physical TOML table-header lines, ignoring comments, ordinary
// strings, and whole lines occupied by multiline basic/literal strings.
function tableHeaderLines(text: string): string[] {
  const headers: string[] = []
  let multiline: MultilineDelimiter | null = null
  for (const raw of text.split(/\r?\n/)) {
    if (multiline) {
      if (tripleClose(raw, multiline, 0) !== -1) multiline = null
      continue
    }
    let code = ''
    let quote: '"' | "'" | null = null
    let escaped = false
    for (let i = 0; i < raw.length; i++) {
      const delimiter = raw.startsWith('"""', i) ? '"""' : raw.startsWith("'''", i) ? "'''" : null
      if (!quote && delimiter) {
        if (tripleClose(raw, delimiter, i + delimiter.length) === -1) multiline = delimiter
        break
      }
      const char = raw[i] as string
      if (!quote && char === '#') break
      code += char
      if (quote === '"') {
        if (!escaped && char === '"') quote = null
        escaped = !escaped && char === '\\'
      } else if (quote === "'") {
        if (char === "'") quote = null
      } else if (char === '"' || char === "'") {
        quote = char
        escaped = false
      }
    }
    const header = code.trim()
    if (header.startsWith('[')) headers.push(header)
  }
  return headers
}

// Skill roots named by exact or dotted TOML tables. Bare and simply-quoted root
// keys are accepted; malformed/noncanonical ki-like names reach resolution and
// fail against the index instead of disappearing. Repeated roots collapse.
export function declaredSkills(kiConfigText: string): string[] {
  const out = new Set<string>()
  for (const header of tableHeaderLines(kiConfigText)) {
    const match = header.match(/^\[\s*(?:"(ki-[^"\\]+)"|'(ki-[^']+)'|(ki-[A-Za-z0-9_-]+))\s*(?:\.|\])/)
    const root = match?.[1] ?? match?.[2] ?? match?.[3]
    if (root) out.add(root)
  }
  return [...out].sort()
}

export function assertResolvableSkills(skills: Iterable<string>): void {
  const unresolved = [...new Set(skills)].filter((skill) => !isSkill(skill))
  if (unresolved.length) throw new SkillResolutionError(unresolved)
}

// The `ki-depends-on:` flow list from a skill's SKILL.md frontmatter. Dependencies
// express a required declared governance capability, never hidden coverage or
// execution order.
export function dependsOnOf(skill: string): string[] {
  const md = readText(join(skillDir(skill), 'SKILL.md'))
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return []
  const line = fm[1].split(/\r?\n/).find((l) => /^ki-depends-on:/.test(l))
  if (!line) return []
  const inner = line
    .replace(/^ki-depends-on:\s*/, '')
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim()
  return inner
    ? inner
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
}

function flowListFrontmatter(skill: string, key: string): string[] {
  const md = readText(join(skillDir(skill), 'SKILL.md'))
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return []
  const line = fm[1].split(/\r?\n/).find((candidate) => candidate.startsWith(`${key}:`))
  if (!line) return []
  const inner = line
    .replace(new RegExp(`^${key}:\\s*`), '')
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim()
  return inner
    ? inner
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []
}

export type CheckerModule = {
  provider: string
  module: string
}

// A module name is an extension-free logical identifier. Its provider can publish
// either `scripts/shared/<module>.ts` or a `scripts/shared/<module>/` directory
// containing a self-contained local closure. The consumer preserves that shape
// below `scripts/vendored/<provider>/`.
export type CheckerModulePayload = {
  source: string
  kind: 'file' | 'directory'
  targetName: string
}

const CHECKER_MODULE = /^(ki-[A-Za-z0-9_-]+):([A-Za-z0-9_-]+)$/

function parseCheckerModule(value: string, field: string, skill: string): CheckerModule {
  const match = value.match(CHECKER_MODULE)
  if (!match) throw new Error(`${skill} declares invalid ${field} entry: ${value}`)
  return { provider: match[1] as string, module: match[2] as string }
}

// A provider declares modules it publishes; a consumer declares exact provider:module
// requirements. This is deliberately independent of `ki-depends-on:`: support modules are
// copied implementation, never a governance-coverage or mode-composition edge.
export function checkerModulesOf(skill: string): string[] {
  return flowListFrontmatter(skill, 'ki-checker-modules')
}

export function checkerDependenciesOf(skill: string): CheckerModule[] {
  return flowListFrontmatter(skill, 'ki-checker-dependencies').map((value) => parseCheckerModule(value, 'ki-checker-dependencies', skill))
}

function assertSafeCheckerModuleTree(path: string): void {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink()) throw new Error(`checker module payload contains symlink: ${path}`)
  if (stat.isFile()) return
  if (!stat.isDirectory()) throw new Error(`checker module payload contains unsafe entry: ${path}`)
  for (const entry of readdirSync(path)) assertSafeCheckerModuleTree(join(path, entry))
}

// Exported for focused fixture tests. It deliberately resolves only the physical
// shape; `checkerModulePayload` below owns the provider declaration check.
export function checkerModulePayloadAt(module: string, modulesDir: string): CheckerModulePayload {
  const file = join(modulesDir, `${module}.ts`)
  const directory = join(modulesDir, module)
  const filePresent = existsSync(file)
  const directoryPresent = existsSync(directory)
  if (filePresent === directoryPresent) {
    const state = filePresent ? 'ambiguous (both file and directory exist)' : 'missing'
    throw new Error(`checker module payload is ${state}: ${module}`)
  }
  const source = filePresent ? file : directory
  assertSafeCheckerModuleTree(source)
  const kind = filePresent ? 'file' : 'directory'
  return { source, kind, targetName: filePresent ? `${module}.ts` : module }
}

export function checkerModulePayload(module: CheckerModule): CheckerModulePayload {
  const modules = checkerModulesOf(module.provider)
  if (!modules.includes(module.module)) throw new Error(`${module.provider} does not declare checker module: ${module.module}`)
  try {
    return checkerModulePayloadAt(module.module, join(skillDir(module.provider), 'scripts', 'shared'))
  } catch (error) {
    throw new Error(`checker module payload is missing or unsafe: ${module.provider}:${module.module}`, { cause: error })
  }
}

// The declared skills (+ explicit --seed skills). Coverage is purely what
// `.ki-config.toml` declares — dependencies are validated by
// `assertExplicitDependencies`, never silently expanded. A per-skill
// `scripts/educate.ts` delegator seeds itself.
export function resolveSet(target: string, all: boolean, seeds: string[]): string[] {
  const seed = all ? allSkillNames() : [...declaredSkills(readText(join(target, '.ki-config.toml'))), ...seeds]
  assertResolvableSkills(seed)
  const selected = new Set(seed)
  selected.delete(BOOTSTRAP) // the chain-starter is not vendored into targets
  return [...selected].sort()
}

export function assertExplicitDependencies(target: string, selected: Iterable<string>): void {
  const declared = new Set(declaredSkills(readText(join(target, '.ki-config.toml'))))
  const missing: string[] = []
  for (const skill of selected) {
    for (const dependency of dependsOnOf(skill)) {
      if (!isSkill(dependency)) missing.push(`${skill} → ${dependency} (unknown skill)`)
      else if (!declared.has(dependency)) missing.push(`${skill} → ${dependency}`)
    }
  }
  if (missing.length) throw new DependencyDeclarationError(missing)
}

// A checker/conform source file, excluding co-located test files (`*.test.ts`), which
// would otherwise collide with the single-match discovery below (e.g. `audit.ts`
// + `audit.test.ts`) and silently drop the skill from the vendored set.
export const isSource = (f: string): boolean => !/\.test\.ts$/.test(f)

// A skill's single legacy checker script (audit-*.ts / lint-*.ts / bare audit.ts) —
// discovered, not templated. Migration fallback only: the primary source is the
// `ki-vendors:` frontmatter declaration below.
export function checkerScript(skill: string): { verb: 'audit'; file: string } | null {
  const dir = join(skillDir(skill), 'scripts')
  if (!existsSync(dir)) return null
  const m = readdirSync(dir).filter((f) => /^(audit\.ts|(audit|lint)-.*\.ts)$/.test(f) && isSource(f))
  if (m.length !== 1) return null
  return { verb: 'audit', file: m[0] }
}

export function conformScript(skill: string): string | null {
  const dir = join(skillDir(skill), 'scripts')
  if (!existsSync(dir)) return null
  const m = readdirSync(dir).filter((f) => /^(conform\.ts|conform-.*\.ts)$/.test(f) && isSource(f))
  return m.length === 1 ? m[0] : null
}

// ── `ki-vendors:` frontmatter (ADR-KI-HARNESS-007) ──────────────────────────────────
// Per-skill declaration, central execution. Every governance skill declares the
// universal modes it vendors as a single-line flow LIST beside `ki-depends-on:`:
//
//   ki-vendors: [educate, audit, conform, help]
//
// Mode → artifact is DERIVED (no override):
//   educate / audit / conform → scripts/<mode>.ts, vendored as a copied file
//   help                   → a rendered SKILL.md snapshot (no script; see repo-bootstrap.ts)
// `refresh` is never vendored (harness-only). During migration two legacy forms are
// still parsed with a WARN: the map form `ki-vendors: { audit: scripts/x.ts, conform:
// scripts/y.ts }` (a bare path is a FILE; a quoted `"cmd: ..."` is a COMMAND), and
// filename-convention discovery when a skill has no `ki-vendors:` line at all.
export const VENDOR_MODES = ['educate', 'audit', 'conform', 'help'] as const
export type VendorMode = (typeof VENDOR_MODES)[number]
export type VendorUnit = { kind: 'file'; path: string } | { kind: 'command'; command: string }

// The raw `ki-vendors:` line's inner text, or null when there is no such line.
function vendorsInner(skill: string): string | null {
  const md = readText(join(skillDir(skill), 'SKILL.md'))
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return null
  const line = fm[1].split(/\r?\n/).find((l) => /^ki-vendors:/.test(l))
  if (!line) return null
  const inner = line.replace(/^ki-vendors:\s*/, '').trim()
  return inner || null
}

// The declared mode list. Handles the new flow-list form directly, and derives the
// list from a legacy map form's keys. null when there is no `ki-vendors:` line.
export function vendorModesOf(skill: string): VendorMode[] | null {
  const inner = vendorsInner(skill)
  if (inner === null) return null
  if (inner.startsWith('[')) {
    return inner
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .split(',')
      .map((s) => s.trim())
      .filter((s): s is VendorMode => (VENDOR_MODES as readonly string[]).includes(s))
  }
  // Legacy map form: keys are the modes.
  const modes: VendorMode[] = []
  for (const raw of inner
    .replace(/^\{/, '')
    .replace(/\}$/, '')
    .match(/(?:[^,"]+|"[^"]*")+/g) ?? []) {
    const m = raw.trim().match(/^(audit|conform):/)
    if (m && !modes.includes(m[1] as VendorMode)) modes.push(m[1] as VendorMode)
  }
  return modes.length ? modes : null
}

// A legacy map form's explicit unit for one verb (audit/conform), or null.
function legacyMapUnit(skill: string, verb: 'audit' | 'conform'): VendorUnit | null {
  const inner = vendorsInner(skill)
  if (inner === null || inner.startsWith('[')) return null
  for (const raw of inner
    .replace(/^\{/, '')
    .replace(/\}$/, '')
    .match(/(?:[^,"]+|"[^"]*")+/g) ?? []) {
    const m = raw.trim().match(/^(audit|conform):\s*(.+)$/)
    if (!m || m[1] !== verb) continue
    let value = m[2].trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    return value.startsWith('cmd:') ? { kind: 'command', command: value.slice(4).trim() } : { kind: 'file', path: value }
  }
  return null
}

// Resolves a skill's vendorable unit for one mode (educate/audit/conform — help never
// vendors a script). Order: derived `scripts/<mode>.ts` from a flow-list declaration,
// else the legacy map's explicit path, else filename-convention discovery — the last
// two printing a WARN (never a hard fail) per the ADR's migration fallback.
export function vendorUnit(skill: string, mode: 'educate' | 'audit' | 'conform'): VendorUnit | null {
  const modes = vendorModesOf(skill)
  const inner = vendorsInner(skill)

  // New flow-list form: pure derivation.
  if (inner?.startsWith('[')) {
    if (!modes?.includes(mode)) return null
    const path = `scripts/${mode}.ts`
    if (!existsSync(join(skillDir(skill), path))) return null
    return { kind: 'file', path }
  }

  // educate has no legacy encoding — only the derived form above.
  if (mode === 'educate') {
    const path = 'scripts/educate.ts'
    return existsSync(join(skillDir(skill), path)) ? { kind: 'file', path } : null
  }

  // Legacy map form.
  const mapped = legacyMapUnit(skill, mode)
  if (mapped) {
    console.error(
      `${'\x1b[33m'}WARN${'\x1b[0m'}  ${skill} uses the legacy \`ki-vendors: { … }\` map — migrate to \`ki-vendors: [educate, audit, conform, help]\` with bare scripts/${mode}.ts.`
    )
    return mapped
  }

  // Filename-convention discovery.
  const legacy = mode === 'audit' ? checkerScript(skill)?.file : conformScript(skill)
  if (!legacy) return null
  console.error(
    `${'\x1b[33m'}WARN${'\x1b[0m'}  ${skill} has no \`ki-vendors:\` declaration for ${mode} — falling back to filename-convention discovery (scripts/${legacy}). Add \`ki-vendors: [educate, audit, conform, help]\` and rename to scripts/${mode}.ts.`
  )
  return { kind: 'file', path: `scripts/${legacy}` }
}
