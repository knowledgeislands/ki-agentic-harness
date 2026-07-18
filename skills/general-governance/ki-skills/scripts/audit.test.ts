#!/usr/bin/env bun
/**
 * Run-based behavioural test for `audit.ts`.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**` and names the harness as the
 * "run, not unit-tested" case for skill `scripts/`. So this spawns the real linter
 * against throwaway skill directories and asserts on its output — matching the
 * convention `link-skills.test.ts` set.
 *
 * Covers the SHAPE-8 mechanical reporter check: a checker that does not import
 * and emit its local canonical reporter must WARN.
 *
 * Also covers SHAPE-12 (universal mode vocabulary in `argument-hint` + the
 * `vendors:` frontmatter declaration) and SHAPE-13 (the `## Operating modes`
 * wrapper, `### Mode <NAME>` headings / `| Mode |` dispatch table, hint ⊆ body),
 * including the process-skill exemption.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCheckerReporterJsonl, validateCheckerReporterEvents } from './checker-reporter.ts'

const LINTER = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')
const SKILL_ROOT = dirname(LINTER)

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
    'description: A throwaway fixture skill used only to exercise the SHAPE-8 reporter check in the linter.',
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

function runResult(dir: string): { output: string; status: number | null } {
  const res = spawnSync('bun', [LINTER, dir], { encoding: 'utf8' })
  return { output: `${res.stdout ?? ''}${res.stderr ?? ''}`, status: res.status }
}

function run(dir: string): string {
  return runResult(dir).output
}

function hasMechanicalFinding(output: string, code: string): boolean {
  return output.split(/\r?\n/).some((line) => {
    try {
      const event = JSON.parse(line) as { type?: string; code?: string }
      return event.type === 'M' && event.code === code
    } catch {
      return false
    }
  })
}

const withReporter = "import { emitCheckerReporter } from './checker-reporter.ts'\nemitCheckerReporter({})\n"

// ── ROOT-1: ki-skills owns the checker contract without a self-dependency ─────
{
  const result = runResult(SKILL_ROOT)
  const parsed = parseCheckerReporterJsonl(result.output)
  check('checker-contract root → no ROOT-1 fail', !result.output.includes('ROOT-1'))
  check(
    'checker-contract root → emits one valid canonical JSONL run',
    parsed.errors.length === 0 && validateCheckerReporterEvents(parsed.events, result.status ?? 1).length === 0
  )
  check(
    'checker-contract root → emits cited J review prompts',
    parsed.events.some((event) => {
      const finding = event as { type?: string; level?: string; ref?: string }
      return finding.type === 'J' && finding.level === 'ADVISORY' && finding.ref === 'references/rubric.md'
    })
  )
}

{
  const { base, dir } = fixture('ki-skills', withReporter)
  try {
    check('missing checker-contract root declaration → ROOT-1 fail', run(dir).includes('ROOT-1'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Checker imports and emits its local reporter → no SHAPE-8 warn ──
{
  const { base, dir } = fixture('ki-fixture-good', withReporter)
  try {
    check('local reporter → no SHAPE-8 warn', !hasMechanicalFinding(run(dir), 'SHAPE-8'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Checker ships no reporter → SHAPE-8 WARN ──
{
  const { base, dir } = fixture('ki-fixture-noreporter', "console.log('done')\n")
  try {
    const out = run(dir)
    check('missing reporter → SHAPE-8 warn', hasMechanicalFinding(out, 'SHAPE-8'))
    check('missing reporter → names the gap', out.includes('does not import and emit its local canonical checker reporter'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Legacy terminal output is not a reporter → SHAPE-8 WARN ──
{
  const { base, dir } = fixture('ki-fixture-legacy-output', "console.log('legacy terminal output')\n")
  try {
    const out = run(dir)
    check('legacy output → SHAPE-8 warn', hasMechanicalFinding(out, 'SHAPE-8'))
    check('legacy output → flags the missing reporter', out.includes('canonical checker reporter'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── SCRIPT-9: cross-skill relative imports in scripts/*.ts ─────────────────────

// ── Same-directory import stays inside scripts/ → no SCRIPT-9 fail ──
{
  const { base, dir } = fixture('ki-fixture-samedir-import', "import { helper } from './helper.ts'\nhelper()\n")
  try {
    check('same-directory import → no SCRIPT-9 fail', !run(dir).includes('SCRIPT-9'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Dynamic import climbing out of scripts/ → SCRIPT-9 FAIL ──
{
  const { base, dir } = fixture('ki-fixture-dynamic-cross-skill-import', "await import('../references/helper.ts')\n")
  try {
    check('dynamic cross-scripts import → SCRIPT-9 fail', run(dir).includes('SCRIPT-9'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── CommonJS require climbing out of scripts/ → SCRIPT-9 FAIL ──
{
  const { base, dir } = fixture('ki-fixture-require-cross-skill-import', "require('../references/helper.ts')\n")
  try {
    check('require cross-scripts import → SCRIPT-9 fail', run(dir).includes('SCRIPT-9'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── A nested script module is subject to the same boundary → SCRIPT-9 FAIL ──
{
  const { base, dir } = fixture('ki-fixture-vendored-cross-skill-import', withReporter)
  try {
    const supportDir = join(dir, 'scripts', 'vendored', 'ki-skills')
    mkdirSync(supportDir, { recursive: true })
    writeFileSync(join(supportDir, 'checker-reporter.ts'), "import { helper } from '../../../../../other-skill/scripts/helper.ts'\n")
    check('nested script escape → SCRIPT-9 fail', run(dir).includes('SCRIPT-9'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Relative import climbs out of the skill's own directory → SCRIPT-9 FAIL ──
{
  const { base, dir } = fixture(
    'ki-fixture-cross-skill-import',
    "import { helper } from '../../ki-other-skill/scripts/helper.ts'\nhelper()\n"
  )
  try {
    const out = run(dir)
    check('cross-skill import → SCRIPT-9 fail', out.includes('SCRIPT-9'))
    check('cross-skill import → names the offending import', out.includes('ki-other-skill'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── SHAPE-12 / SHAPE-13 fixtures ──────────────────────────────────────────────

/** Build a throwaway skill dir from full frontmatter fields + body markdown. */
function modeFixture(
  name: string,
  opts: { dependsOn?: string; desc?: string; hint?: string; vendors?: string; body: string }
): { base: string; dir: string } {
  const base = mkdtempSync(join(tmpdir(), 'ki-skills-test-'))
  const dir = join(base, name)
  mkdirSync(join(dir, 'scripts'), { recursive: true })
  const fm = ['---', `name: ${name}`]
  if (opts.dependsOn !== undefined) fm.push(`depends-on: ${opts.dependsOn}`)
  if (opts.vendors) fm.push(`vendors: ${opts.vendors}`)
  fm.push(`description: ${opts.desc ?? 'A throwaway fixture skill used only to exercise the SHAPE-12/13 mode checks in the linter.'}`)
  if (opts.hint) fm.push(`argument-hint: '${opts.hint}'`)
  fm.push('---', '', `# Fixture`, '', opts.body, '')
  writeFileSync(join(dir, 'SKILL.md'), fm.join('\n'))
  writeFileSync(join(dir, 'scripts', `audit-${name}.ts`), withReporter)
  return { base, dir }
}

const FULL_HINT = 'audit <target> | conform <target> | help | educate <target> | refresh'
const VENDORS = (name: string) => `{ audit: scripts/audit-${name}.ts }`
const CONFORMANT_BODY = [
  '## Operating modes',
  '',
  'Invoked as `help` it explains itself and stops.',
  '',
  '### Mode AUDIT',
  '',
  'Check the artifact.',
  '',
  '### Mode CONFORM',
  '',
  'Fix the artifact.',
  '',
  '### Mode EDUCATE',
  '',
  'Scaffold the artifact.',
  '',
  '### Mode REFRESH',
  '',
  'Re-anchor the standard.'
].join('\n')

// ── SHAPE-17: every skill has an explicit dependency declaration ─────────────
{
  const { base, dir } = modeFixture('ki-fixture-missing-dependencies', {
    hint: FULL_HINT,
    vendors: VENDORS('ki-fixture-missing-dependencies'),
    body: CONFORMANT_BODY
  })
  try {
    const result = runResult(dir)
    check('missing depends-on → SHAPE-17 FAIL', result.status !== 0 && hasMechanicalFinding(result.output, 'SHAPE-17'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

{
  const { base, dir } = modeFixture('ki-fixture-malformed-dependencies', {
    dependsOn: 'ki-authoring',
    hint: FULL_HINT,
    vendors: VENDORS('ki-fixture-malformed-dependencies'),
    body: CONFORMANT_BODY
  })
  try {
    const result = runResult(dir)
    check('non-list depends-on → SHAPE-17 FAIL', result.status !== 0 && hasMechanicalFinding(result.output, 'SHAPE-17'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Conformant wrapper + `### Mode` H3s → no SHAPE-12/13 warns ──
{
  const name = 'ki-fixture-conformant'
  const { base, dir } = modeFixture(name, { hint: FULL_HINT, vendors: VENDORS(name), body: CONFORMANT_BODY })
  try {
    const out = run(dir)
    check('conformant wrapper + H3s → no SHAPE-12', !out.includes('SHAPE-12'))
    check('conformant wrapper + H3s → no SHAPE-13', !out.includes('SHAPE-13'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Conformant `| Mode |` dispatch table → no SHAPE-12/13 warns ──
{
  const name = 'ki-fixture-table'
  const tableBody = [
    '## Operating modes',
    '',
    'Invoked as `help` it explains itself and stops.',
    '',
    '| Mode    | What it does            |',
    '| ------- | ----------------------- |',
    '| AUDIT   | Check the artifact.     |',
    '| CONFORM | Fix the artifact.       |',
    '| EDUCATE    | Scaffold the artifact.  |',
    '| REFRESH | Re-anchor the standard. |'
  ].join('\n')
  const { base, dir } = modeFixture(name, { hint: FULL_HINT, vendors: VENDORS(name), body: tableBody })
  try {
    const out = run(dir)
    check('conformant dispatch table → no SHAPE-12', !out.includes('SHAPE-12'))
    check('conformant dispatch table → no SHAPE-13', !out.includes('SHAPE-13'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Missing `educate` verb in argument-hint → SHAPE-12 WARN ──
{
  const name = 'ki-fixture-noinit'
  const { base, dir } = modeFixture(name, {
    hint: 'audit <target> | conform <target> | help | refresh',
    vendors: VENDORS(name),
    body: CONFORMANT_BODY
  })
  try {
    const out = run(dir)
    check('missing educate verb → SHAPE-12 warn', out.includes('SHAPE-12'))
    check('missing educate verb → names educate', /SHAPE-12[^\n]*educate/.test(out))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Missing `vendors:` declaration → SHAPE-12 WARN ──
{
  const name = 'ki-fixture-novendors'
  const { base, dir } = modeFixture(name, { hint: FULL_HINT, body: CONFORMANT_BODY })
  try {
    const out = run(dir)
    check('missing vendors: → SHAPE-12 warn', /SHAPE-12[^\n]*vendors/.test(out))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Flat `## Mode X` H2 (no wrapper) → SHAPE-13 WARN ──
{
  const name = 'ki-fixture-flath2'
  const flatBody = ['## Mode AUDIT', '', 'Check.', '', '## Mode CONFORM', '', 'Fix.'].join('\n')
  const { base, dir } = modeFixture(name, { hint: FULL_HINT, vendors: VENDORS(name), body: flatBody })
  try {
    const out = run(dir)
    check('flat ## Mode X → SHAPE-13 warn', out.includes('SHAPE-13'))
    check('flat ## Mode X → says demote', out.includes('demote'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Bare `### X` inside the wrapper → SHAPE-13 WARN ──
{
  const name = 'ki-fixture-bareh3'
  const bareBody = CONFORMANT_BODY.replace('### Mode AUDIT', '### AUDIT')
  const { base, dir } = modeFixture(name, { hint: FULL_HINT, vendors: VENDORS(name), body: bareBody })
  try {
    const out = run(dir)
    check('bare ### X → SHAPE-13 warn', /SHAPE-13[^\n]*Mode/.test(out))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Hint verb absent from the Operating-modes body → SHAPE-13 WARN ──
{
  const name = 'ki-fixture-hintsubset'
  const { base, dir } = modeFixture(name, {
    hint: `${FULL_HINT} | optimise <target>`,
    vendors: VENDORS(name),
    body: CONFORMANT_BODY
  })
  try {
    const out = run(dir)
    check('hint verb absent from body → SHAPE-13 warn', /SHAPE-13[^\n]*optimise/.test(out))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Process skill (kind: process) → exempt from SHAPE-12/13 ──
{
  const name = 'ki-fixture-process'
  const { base, dir } = modeFixture(name, {
    desc: 'Drives a lifecycle. A process skill (kind: process, ADR-KI-HARNESS-SKILLS-006) — carries an action, not a standard.',
    hint: 'new <title> | status',
    body: ['## Lifecycle', '', 'new → execute → done.'].join('\n')
  })
  try {
    const out = run(dir)
    check('process skill → no SHAPE-12', !out.includes('SHAPE-12'))
    check('process skill → no SHAPE-13', !out.includes('SHAPE-13'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31maudit.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32maudit.test.ts: all checks passed\x1b[0m')
