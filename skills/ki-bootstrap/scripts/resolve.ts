/**
 * Set-resolution helpers shared by the INIT chain (`bootstrap.ts`) and the
 * vendored-set alignment checker (`audit-vendored.ts`). Pure, read-only: given a
 * target repo and the harness `skills/` root, computes which skills *should* be
 * vendored — the transitive `implies:` closure of the baseline plus whatever the
 * target's `.ki-config.toml` declares — and locates each skill's checker/conform
 * script. Kept import-only (no top-level side effects) so both callers can use it
 * without triggering the other's CLI behaviour.
 */

import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readText } from './package-scripts.ts'

export const BASELINE = ['ki-repo', 'ki-authoring']
export const BOOTSTRAP = 'ki-bootstrap'

// The harness `skills/` root this engine reads sources from. Local run: the
// working tree two levels up from this file. (Remote-URL sourcing is a documented
// follow-on; the vendored output is identical either way.)
export const SKILLS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

export function skillDir(skill: string): string {
  return join(SKILLS_ROOT, skill)
}

export function isSkill(skill: string): boolean {
  return existsSync(join(skillDir(skill), 'SKILL.md'))
}

// `[ki-<skill>]` top-level tables declared in the target's .ki-config.toml.
export function declaredSkills(kiConfigText: string): string[] {
  const out: string[] = []
  for (const m of kiConfigText.matchAll(/^\[ki-([a-z0-9-]+)\][ \t]*$/gm)) out.push(`ki-${m[1]}`)
  return out
}

// The `implies:` flow list from a skill's SKILL.md frontmatter.
export function impliesOf(skill: string): string[] {
  const md = readText(join(skillDir(skill), 'SKILL.md'))
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return []
  const line = fm[1].split(/\r?\n/).find((l) => /^implies:/.test(l))
  if (!line) return []
  const inner = line
    .replace(/^implies:\s*/, '')
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

// Transitive closure of BASELINE + declared skills (+ explicit --seed skills) over
// the `implies:` graph. A per-skill `scripts/init.ts` delegator seeds itself.
export function resolveSet(target: string, all: boolean, seeds: string[]): string[] {
  const seed = all
    ? readdirSync(SKILLS_ROOT, { withFileTypes: true })
        .filter((e) => e.isDirectory() && isSkill(e.name))
        .map((e) => e.name)
    : [...BASELINE, ...declaredSkills(readText(join(target, '.ki-config.toml'))), ...seeds]
  const seen = new Set<string>()
  const stack = [...seed]
  while (stack.length) {
    const s = stack.pop()
    if (s === undefined || seen.has(s) || !isSkill(s)) continue
    seen.add(s)
    for (const dep of impliesOf(s)) stack.push(dep)
  }
  seen.delete(BOOTSTRAP) // the chain-starter is not vendored into targets
  return [...seen].sort()
}

// A checker/conform source file, excluding co-located test files (`*.test.ts`), which
// would otherwise collide with the single-match discovery below (e.g. `audit-memory.ts`
// + `audit-memory.test.ts`) and silently drop the skill from the vendored set.
export const isSource = (f: string): boolean => !/\.test\.ts$/.test(f)

// A skill's single checker script (audit-*.ts or lint-*.ts) — discovered, not templated.
// This is the migration-fallback path: the primary source is the `vendors:`
// frontmatter declaration below.
export function checkerScript(skill: string): { verb: 'audit' | 'lint'; file: string } | null {
  const dir = join(skillDir(skill), 'scripts')
  if (!existsSync(dir)) return null
  const m = readdirSync(dir).filter((f) => /^(audit|lint)-.*\.ts$/.test(f) && isSource(f))
  if (m.length !== 1) return null
  return { verb: m[0].startsWith('audit-') ? 'audit' : 'lint', file: m[0] }
}

export function conformScript(skill: string): string | null {
  const dir = join(skillDir(skill), 'scripts')
  if (!existsSync(dir)) return null
  const m = readdirSync(dir).filter((f) => /^conform-.*\.ts$/.test(f) && isSource(f))
  return m.length === 1 ? m[0] : null
}

// ── `vendors:` frontmatter (ADR-KI-HARNESS-006) ──────────────────────────────────
// Per-skill declaration, central execution: each governance skill declares its
// vendorable mechanical unit(s) beside `implies:`, in a single-line flow mapping:
//
//   vendors: { audit: scripts/audit-repo.ts, conform: scripts/conform-repo.ts }
//   vendors: { audit: "cmd: bun run ki:lint:md:check" }
//
// A bare `scripts/...` value is a checker FILE, vendored as a copy. A quoted
// `"cmd: ..."` value is a COMMAND, vendored as a generated thin wrapper script (no
// package.json required in the target — the wrapper embeds the command literally).
// Only `audit` and `conform` verbs are recognised (INIT and HELP do not vendor —
// ADR-KI-HARNESS-006's Consequences).
export type VendorUnit = { kind: 'file'; path: string } | { kind: 'command'; command: string }
export type VendorDecl = Partial<Record<'audit' | 'conform', VendorUnit>>

export function vendorsOf(skill: string): VendorDecl | null {
  const md = readText(join(skillDir(skill), 'SKILL.md'))
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return null
  const line = fm[1].split(/\r?\n/).find((l) => /^vendors:/.test(l))
  if (!line) return null
  const inner = line
    .replace(/^vendors:\s*/, '')
    .trim()
    .replace(/^\{/, '')
    .replace(/\}$/, '')
    .trim()
  if (!inner) return null
  const decl: VendorDecl = {}
  // Split on top-level commas, respecting quoted command strings (which may not
  // themselves contain commas today, but this keeps the parse honest either way).
  const parts = inner.match(/(?:[^,"]+|"[^"]*")+/g) ?? []
  for (const raw of parts) {
    const m = raw.trim().match(/^(audit|conform):\s*(.+)$/)
    if (!m) continue
    const verb = m[1] as 'audit' | 'conform'
    let value = m[2].trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    decl[verb] = value.startsWith('cmd:') ? { kind: 'command', command: value.slice(4).trim() } : { kind: 'file', path: value }
  }
  return Object.keys(decl).length ? decl : null
}

// Resolves a skill's vendorable unit for one verb: the declared `vendors:` entry
// if present, else the old filename-convention discovery — printing a WARN (never
// a hard fail) naming the missing declaration, per the ADR's migration fallback.
export function vendorUnit(skill: string, verb: 'audit' | 'conform'): VendorUnit | null {
  const declared = vendorsOf(skill)?.[verb]
  if (declared) return declared
  if (verb === 'audit') {
    const legacy = checkerScript(skill)
    if (!legacy) return null
    console.error(
      `${'\x1b[33m'}WARN${'\x1b[0m'}  ${skill} has no \`vendors:\` declaration — falling back to filename-convention discovery (scripts/${legacy.file}). Add \`vendors: { audit: scripts/${legacy.file} }\` to its SKILL.md frontmatter.`
    )
    return { kind: 'file', path: `scripts/${legacy.file}` }
  }
  const legacy = conformScript(skill)
  if (!legacy) return null
  console.error(
    `${'\x1b[33m'}WARN${'\x1b[0m'}  ${skill} has no \`vendors:\` declaration for conform — falling back to filename-convention discovery (scripts/${legacy}). Add \`vendors: { conform: scripts/${legacy} }\` to its SKILL.md frontmatter.`
  )
  return { kind: 'file', path: `scripts/${legacy}` }
}
