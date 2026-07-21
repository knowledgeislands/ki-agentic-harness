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

export type SharedModule = {
  provider: string
  module: string
}

// A module name is an extension-free logical identifier. Its provider can publish
// either `scripts/shared/<module>.ts` or a `scripts/shared/<module>/` directory
// containing a self-contained local closure. The consumer preserves that shape
// below `scripts/vendored/<provider>/`.
export type SharedModulePayload = {
  source: string
  kind: 'file' | 'directory'
  targetName: string
}

const SHARED_MODULE = /^(ki-[A-Za-z0-9_-]+):([A-Za-z0-9_-]+)$/

function parseSharedModule(value: string, field: string, skill: string): SharedModule {
  const match = value.match(SHARED_MODULE)
  if (!match) throw new Error(`${skill} declares invalid ${field} entry: ${value}`)
  return { provider: match[1] as string, module: match[2] as string }
}

// A provider declares modules it publishes; a consumer declares exact provider:module
// requirements. This is deliberately independent of `ki-depends-on:`: support modules are
// copied implementation, never a governance-coverage or mode-composition edge.
export function sharedModulesOf(skill: string): string[] {
  return flowListFrontmatter(skill, 'ki-shared-modules')
}

export function sharedDependenciesOf(skill: string): SharedModule[] {
  return flowListFrontmatter(skill, 'ki-shared-dependencies').map((value) => parseSharedModule(value, 'ki-shared-dependencies', skill))
}

function assertSafeSharedModuleTree(path: string): void {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink()) throw new Error(`shared module payload contains symlink: ${path}`)
  if (stat.isFile()) return
  if (!stat.isDirectory()) throw new Error(`shared module payload contains unsafe entry: ${path}`)
  for (const entry of readdirSync(path)) assertSafeSharedModuleTree(join(path, entry))
}

// Exported for focused fixture tests. It deliberately resolves only the physical
// shape; `sharedModulePayload` below owns the provider declaration check.
export function sharedModulePayloadAt(module: string, modulesDir: string): SharedModulePayload {
  const file = join(modulesDir, `${module}.ts`)
  const directory = join(modulesDir, module)
  const filePresent = existsSync(file)
  const directoryPresent = existsSync(directory)
  if (filePresent === directoryPresent) {
    const state = filePresent ? 'ambiguous (both file and directory exist)' : 'missing'
    throw new Error(`shared module payload is ${state}: ${module}`)
  }
  const source = filePresent ? file : directory
  assertSafeSharedModuleTree(source)
  const kind = filePresent ? 'file' : 'directory'
  return { source, kind, targetName: filePresent ? `${module}.ts` : module }
}

export function sharedModulePayload(module: SharedModule): SharedModulePayload {
  const modules = sharedModulesOf(module.provider)
  if (!modules.includes(module.module)) throw new Error(`${module.provider} does not declare shared module: ${module.module}`)
  try {
    return sharedModulePayloadAt(module.module, join(skillDir(module.provider), 'scripts', 'shared'))
  } catch (error) {
    throw new Error(`shared module payload is missing or unsafe: ${module.provider}:${module.module}`, { cause: error })
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

/** A governed capability has one canonical, importable entrypoint. */
export function governScript(skill: string): string | null {
  const path = join(skillDir(skill), 'scripts', 'govern.ts')
  return existsSync(path) ? path : null
}

/** EDUCATE remains a separate bootstrap payload, not part of aggregate checking. */
export function educatorScript(skill: string): string | null {
  const path = join(skillDir(skill), 'scripts', 'educate.ts')
  return existsSync(path) ? path : null
}
