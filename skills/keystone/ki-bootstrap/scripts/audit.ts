#!/usr/bin/env bun
/**
 * ki-bootstrap — BOOT-9: audit a target repo's vendored `.ki-meta/checkers/` set
 * against what it *should* be. BOOT-11 additionally checks direct source copies
 * when the target carries matching canonical skills. Also emits BOOT-10, the always-on reminder that
 * AUDIT's judgmental sweep — ADR-KI-HARNESS-SKILLS-001's AUDIT contract, applied
 * transitively across every governed skill — still needs applying by the agent
 * running this; no mechanical check can decide judgment for it.
 *
 * The mechanical `.ki-meta/bin/ki-audit` self-check runs standalone (no harness, no
 * skills installed) — but it has no way to validate dependency declarations, since
 * the `depends-on:` graph lives in the harness's SKILL.md frontmatter, not anywhere copied
 * into the target. So this check runs from the harness side, the same way
 * re-bootstrapping already does: it validates the explicit declared `[ki-*]` tables
 * and their `depends-on:` contract, then diffs the checker-bearing set
 * it against the target's `.ki-meta/checkers/*` directories. Any drift — stale config,
 * an upstream skill add/remove, a partial re-vendor — surfaces as a WARN rather than
 * silently going unnoticed; `bun skills/keystone/ki-bootstrap/scripts/lib/repo-bootstrap.ts <target>`
 * fixes it by re-vendoring. In a source-bearing harness, a direct source-copy mismatch is
 * a ship-blocking FAIL rather than set drift.
 *
 * Usage: bun audit.ts [target-repo] [--json]   (read-only)
 *   --json   emit the shared CHK-004 finding wrapper instead of prose, so the
 *            aggregate renders BOOT-9/BOOT-10/BOOT-11 structured alongside every other checker.
 * Every repo — the harness included — vendors its own DECLARED coverage (the `.ki-config.toml`
 * `[ki-*]` tables), so `ki:audit` fans out over exactly the
 * skills that govern it. Vendoring is always coverage-scoped; `--all` is a linking concept
 * only (the harness authoring hub links every skill), never a vendoring one (ADR-KI-HARNESS-007).
 */

import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import {
  assertExplicitDependencies,
  checkerScript,
  DependencyDeclarationError,
  resolveSet,
  SkillResolutionError,
  vendorModesOf,
  vendorUnit
} from './lib/resolve.ts'
import {
  type CheckerFinding,
  type CheckerLevel,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

// Unified severity ladder — shared by every KI checker (checker-contract).
const findings: CheckerFinding[] = []
const add = (level: CheckerLevel, code: string, message: string, ref?: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ref, file })
}

const RUBRIC = 'references/rubric.md'

const argv = process.argv.slice(2)
const target = resolve(argv.find((a) => !a.startsWith('--')) ?? '.')
const vendoredRoot = join(target, '.ki-meta', 'checkers')
const educatorsRoot = join(target, '.ki-meta', 'educators')
const retiredRoot = join(target, '.ki-meta', 'skills')

const emitBootstrap = (): never => {
  const all = [...findings, ...judgmentFindingsFromRubric(join(import.meta.dirname, '..', 'references', 'rubric.md'))]
  emitCheckerReporter({ mode: 'audit', concern: 'bootstrap', target, findings: all })
  process.exit(checkerReporterExitCode(all))
}

function expectedResolvedSet(): string[] {
  try {
    const resolved = resolveSet(target, false, [])
    assertExplicitDependencies(target, resolved)
    return resolved
  } catch (error) {
    if (!(error instanceof SkillResolutionError) && !(error instanceof DependencyDeclarationError)) throw error
    add(
      'FAIL',
      'BOOT-9',
      `${error.message} — reconcile the declared .ki-config.toml table before auditing or re-vendoring`,
      RUBRIC,
      '.ki-config.toml'
    )
    return emitBootstrap()
  }
}
const resolved = expectedResolvedSet()

if (existsSync(retiredRoot)) {
  add('WARN', 'BOOT-9', 'retired .ki-meta/skills/ payload is present — re-run EDUCATE to migrate it safely', RUBRIC, '.ki-meta/skills')
}

if (!existsSync(vendoredRoot)) {
  add('NA', 'BOOT-9', 'No vendored checkers are present — nothing to check yet.', RUBRIC, '.ki-meta/checkers')
}

// Only skills with a discoverable checker are ever vendored (vendorSkill() in
// repo-bootstrap.ts is a no-op for skills without one), so restrict the expectation to those.
const expected = resolved.filter((s) => checkerScript(s) !== null)
const actual = existsSync(vendoredRoot)
  ? readdirSync(vendoredRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  : []

const missing = expected.filter((s) => !actual.includes(s))
const extra = actual.filter((s) => !expected.includes(s))

if (missing.length === 0 && extra.length === 0) {
  add(
    'PASS',
    'BOOT-9',
    `Vendored skill set matches the expected resolved set (${expected.length} skill${expected.length === 1 ? '' : 's'}).`,
    RUBRIC,
    '.ki-meta/checkers'
  )
}

function targetSkillDir(skill: string): string | null {
  const root = join(target, 'skills')
  if (!existsSync(root)) return null
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const direct = join(root, entry.name)
    if (entry.name === skill && existsSync(join(direct, 'SKILL.md'))) return direct
    const nested = join(direct, skill)
    if (existsSync(join(nested, 'SKILL.md'))) return nested
  }
  return null
}

const drifted: string[] = []
let checked = 0
for (const skill of expected) {
  const localSkill = targetSkillDir(skill)
  if (!localSkill) continue
  for (const mode of ['audit', 'conform'] as const) {
    const unit = vendorUnit(skill, mode)
    if (unit?.kind !== 'file') continue
    const source = join(localSkill, unit.path)
    checked += 1
    const vendored = join(vendoredRoot, skill, 'scripts', `${mode}.ts`)
    if (!existsSync(source) || !lstatSync(source).isFile()) {
      drifted.push(`${skill}/${mode}.ts (canonical source missing or not a regular file)`)
      continue
    }
    if (!existsSync(vendored) || !lstatSync(vendored).isFile()) {
      drifted.push(`${skill}/${mode}.ts (vendored copy missing or not a regular file)`)
      continue
    }
    if (!readFileSync(source).equals(readFileSync(vendored))) drifted.push(`${skill}/${mode}.ts`)
  }
}
if (checked === 0) {
  add(
    'NA',
    'BOOT-11',
    'canonical skill sources are not inside the target repo; source-copy integrity is not applicable',
    RUBRIC,
    '.ki-meta/checkers'
  )
} else if (drifted.length) {
  add(
    'FAIL',
    'BOOT-11',
    `canonical source/vendor integrity mismatch: ${drifted.join(', ')} — restore or format sources, then re-bootstrap before committing`,
    RUBRIC,
    '.ki-meta/checkers'
  )
} else {
  add(
    'PASS',
    'BOOT-11',
    `${checked} direct file-kind vendor unit${checked === 1 ? '' : 's'} match canonical source byte-for-byte`,
    RUBRIC,
    '.ki-meta/checkers'
  )
}

if (missing.length)
  add(
    'WARN',
    'BOOT-9',
    `missing from .ki-meta/checkers/: ${missing.join(', ')} — re-run \`bun skills/keystone/ki-bootstrap/scripts/lib/repo-bootstrap.ts ${target}\``,
    RUBRIC,
    '.ki-meta/checkers'
  )
if (extra.length)
  add(
    'WARN',
    'BOOT-9',
    `vendored but no longer expected: ${extra.join(', ')} — a dropped table or upstream dependency change; re-bootstrap to prune`,
    RUBRIC,
    '.ki-meta/checkers'
  )

const expectedEducators = resolved.filter((skill) => vendorModesOf(skill)?.includes('educate'))
const actualEducators = existsSync(educatorsRoot)
  ? readdirSync(educatorsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : []
const missingEducators = expectedEducators.filter((skill) => !actualEducators.includes(skill))
const extraEducators = actualEducators.filter((skill) => !expectedEducators.includes(skill))
const unsafeEducators = expectedEducators.filter((skill) => {
  const payload = join(educatorsRoot, skill, 'educate.ts')
  if (!existsSync(payload)) return false
  const stat = lstatSync(payload)
  return !stat.isFile() || stat.isSymbolicLink()
})

if (missingEducators.length === 0 && extraEducators.length === 0 && unsafeEducators.length === 0) {
  add(
    'PASS',
    'BOOT-12',
    `Vendored educator set matches the expected resolved set (${expectedEducators.length} skill${expectedEducators.length === 1 ? '' : 's'}).`,
    RUBRIC,
    '.ki-meta/educators'
  )
}
if (missingEducators.length)
  add(
    'WARN',
    'BOOT-12',
    `missing from .ki-meta/educators/: ${missingEducators.join(', ')} — re-run bootstrap to restore standalone EDUCATE payloads`,
    RUBRIC,
    '.ki-meta/educators'
  )
if (extraEducators.length)
  add(
    'WARN',
    'BOOT-12',
    `vendored educators no longer expected: ${extraEducators.join(', ')} — re-bootstrap to prune`,
    RUBRIC,
    '.ki-meta/educators'
  )
if (unsafeEducators.length)
  add(
    'WARN',
    'BOOT-12',
    `unsafe educator payload(s): ${unsafeEducators.join(', ')} — re-bootstrap to restore regular target-local launchers`,
    RUBRIC,
    '.ki-meta/educators'
  )

// Drift here is always conformable by re-vendoring (WARN, never FAIL) — mirrors BOOT-1.
emitBootstrap()
