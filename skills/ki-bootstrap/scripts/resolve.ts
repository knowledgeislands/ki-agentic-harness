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
// the `implies:` graph. A per-skill `scripts/bootstrap.ts` delegator seeds itself.
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

export function scriptKey(skill: string, verb: string): string {
  return `ki:${skill.replace(/^ki-/, '')}:${verb}`
}
