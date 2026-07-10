#!/usr/bin/env bun
/**
 * Run-based behavioural test for `lint-skills.ts`.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**` and names the harness as the
 * "run, not unit-tested" case for skill `scripts/`. So this spawns the real linter
 * against throwaway skill directories and asserts on its output — matching the
 * convention `link-skills.test.ts` set.
 *
 * Covers the SHAPE-8 mechanical footer check: a checker whose source omits the
 * remediation footer (or names another skill's CONFORM) must WARN; a checker that
 * ships the footer naming its own skill must not.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LINTER = join(dirname(fileURLToPath(import.meta.url)), 'lint-skills.ts')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

/** Build a throwaway skill dir named `name`, holding a checker whose source is `checkerSrc`. */
function fixture(name: string, checkerSrc: string): { base: string; dir: string } {
  const base = mkdtempSync(join(tmpdir(), 'ki-skills-test-'))
  const dir = join(base, name)
  mkdirSync(join(dir, 'scripts'), { recursive: true })
  const skillMd = [
    '---',
    `name: ${name}`,
    'description: A throwaway fixture skill used only to exercise the SHAPE-8 footer check in the linter.',
    '---',
    '',
    '# Fixture',
    '',
    'Body.',
    ''
  ].join('\n')
  writeFileSync(join(dir, 'SKILL.md'), skillMd)
  writeFileSync(join(dir, 'scripts', `audit-${name}.ts`), checkerSrc)
  return { base, dir }
}

function run(dir: string): string {
  const res = spawnSync('bun', [LINTER, dir], { encoding: 'utf8' })
  return `${res.stdout ?? ''}${res.stderr ?? ''}`
}

const withFooter = (skill: string) =>
  `console.log('→ to address: run /${skill} CONFORM   (judgment criteria: references/audit-rubric.md)')\n`

// ── Checker ships the footer naming its own skill → no SHAPE-8 warn ──
{
  const { base, dir } = fixture('ki-fixture-good', withFooter('ki-fixture-good'))
  try {
    check('own-skill footer → no SHAPE-8 warn', !run(dir).includes('SHAPE-8'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Checker ships no footer at all → SHAPE-8 WARN ──
{
  const { base, dir } = fixture('ki-fixture-nofooter', "console.log('done')\n")
  try {
    const out = run(dir)
    check('missing footer → SHAPE-8 warn', out.includes('SHAPE-8'))
    check('missing footer → names the gap', out.includes('ships no remediation footer'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Checker footer names a different skill → SHAPE-8 WARN ──
{
  const { base, dir } = fixture('ki-fixture-wrong', withFooter('ki-other-skill'))
  try {
    const out = run(dir)
    check('foreign-skill footer → SHAPE-8 warn', out.includes('SHAPE-8'))
    check('foreign-skill footer → flags the wrong skill', out.includes('not its own skill'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31mlint-skills.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mlint-skills.test.ts: all checks passed\x1b[0m')
