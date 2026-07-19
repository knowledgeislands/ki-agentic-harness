#!/usr/bin/env bun
/** Run-based behavioural tests for the safe ki-skills CONFORM callbacks. */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const CONFORM = join(SCRIPT_DIR, 'conform.ts')
const AUDIT = join(SCRIPT_DIR, 'audit.ts')
let failed = false

function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function run(script: string, target: string): { output: string; status: number | null } {
  const result = spawnSync('bun', [script, target], { encoding: 'utf8' })
  return { output: `${result.stdout ?? ''}${result.stderr ?? ''}`, status: result.status }
}

function writeConformableFixture(): { base: string; dir: string } {
  const base = mkdtempSync(join(tmpdir(), 'ki-skills-conform-'))
  const dir = join(base, 'ki-fixture-conform')
  mkdirSync(join(dir, 'references'), { recursive: true })
  mkdirSync(join(dir, 'scripts'), { recursive: true })
  writeFileSync(join(dir, 'references', 'standards.md'), '# Fixture standards\n')
  writeFileSync(
    join(dir, 'SKILL.md'),
    [
      '---',
      'name: ki-fixture-conform',
      'depends-on: []',
      'vendors: { audit: scripts/audit-fixture.ts }',
      'description: Audits fixture skills against a local standard.',
      "argument-hint: 'audit <target> | conform <target>'",
      '---',
      '',
      '# Fixture',
      '',
      '[safe link](references\\standards.md)',
      '',
      'Literal text C:\\temp remains outside a link.',
      '',
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
      'Prepare the artifact.',
      '',
      '### Mode REFRESH',
      '',
      'In ki-agentic-harness only, stop and redirect vendored use to the harness.',
      ''
    ].join('\n')
  )
  for (const script of ['educate.ts', 'audit.ts', 'conform.ts'])
    writeFileSync(
      join(dir, 'scripts', script),
      "import { emitCheckerReporter } from './lib/checker-reporter.ts'\nemitCheckerReporter({})\n"
    )
  return { base, dir }
}

{
  const { base, dir } = writeConformableFixture()
  try {
    const result = run(CONFORM, dir)
    const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8')
    check('conform completes successfully', result.status === 0)
    check('rewrites only backslash markdown link targets', skill.includes('[safe link](references/standards.md)'))
    check('leaves non-link backslashes untouched', skill.includes('Literal text C:\\temp remains outside a link.'))
    check('replaces legacy vendor map with the current uniform declaration', skill.includes('vendors: [educate, audit, conform, help]'))
    check('does not retain a legacy vendor map', !skill.includes('vendors: {'))
    check(
      'repairs HELP and missing universal verbs',
      skill.includes("argument-hint: 'audit <target> | conform <target> | help | educate | refresh'")
    )
    const audited = run(AUDIT, dir)
    check('final audit has no failing mechanical finding', audited.status === 0)
    check(
      'final audit has no LAY-4/KI-SHAPE-11/12/15 finding',
      !/"code":"(?:LAY-4|KI-SHAPE-11|KI-SHAPE-12|KI-SHAPE-15)"/.test(audited.output)
    )
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

{
  const { base, dir } = writeConformableFixture()
  try {
    rmSync(join(dir, 'scripts'), { recursive: true, force: true })
    mkdirSync(join(dir, 'scripts'))
    writeFileSync(join(dir, 'scripts', 'audit-fixture.ts'), '// legacy checker\n')
    const result = run(CONFORM, dir)
    const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8')
    check(
      'missing bare scripts produce a vendor advisory',
      result.output.includes('cannot declare uniform `vendors:` until bare script(s) exist')
    )
    check('missing bare scripts preserve the existing declaration', skill.includes('vendors: { audit: scripts/audit-fixture.ts }'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

if (failed) process.exit(1)
console.log('\n\x1b[32mconform.test.ts: all checks passed\x1b[0m')
