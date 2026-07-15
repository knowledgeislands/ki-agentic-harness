#!/usr/bin/env bun
/** Run-based profile, linkage, projection, dependency, KB, and safe-write tests. */
import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const AUDIT = join(HERE, 'audit.ts')
const CONFORM = join(HERE, 'conform.ts')
const INIT = join(HERE, 'init.ts')
let failed = false

function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function fixture(): string {
  return mkdtempSync(join(tmpdir(), 'ki-project-roadmap-test-'))
}

function run(script: string, root: string, args: string[] = []): { code: number; out: string } {
  const result = spawnSync(process.execPath, [script, root, ...args], { encoding: 'utf8' })
  return { code: result.status ?? 1, out: `${result.stdout ?? ''}${result.stderr ?? ''}` }
}

function roadmap(title: string, items: Partial<Record<'Blocking' | 'Next' | 'Soon' | 'Waiting for' | 'Future', string[]>> = {}): string {
  const lines = [`# ${title}`, '']
  for (const horizon of ['Blocking', 'Next', 'Soon', 'Waiting for', 'Future'] as const) {
    lines.push(`## ${horizon}`, '')
    for (const item of items[horizon] ?? []) lines.push(`### ${item}`, '', `${item} details.`, '')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

function plan(id: string, title: string, locator: string, blocks = '—', blockedBy = '—', status = 'open'): string {
  return [
    '---',
    `id: '${id}'`,
    `title: ${title}`,
    `status: ${status}`,
    `roadmap: ${locator}`,
    `blocks: ${blocks}`,
    `blocked-by: ${blockedBy}`,
    '---',
    '',
    `# ${title}`,
    '',
    '## Context',
    '',
    'Context.',
    '',
    '## Current state',
    '',
    'Current.',
    '',
    '## Steps',
    '',
    '1. Run the check.',
    '',
    '## Files touched',
    '',
    '- `ROADMAP.md`',
    '',
    '## Verify',
    '',
    'Run the audit and confirm exit zero.',
    '',
    '## Dependencies / blocks',
    '',
    'As declared.',
    ''
  ].join('\n')
}

function thematicFixture(): string {
  const root = fixture()
  for (const theme of ['hooks', 'runtime']) mkdirSync(join(root, 'docs', 'roadmap', theme, 'plans'), { recursive: true })
  writeFileSync(join(root, 'docs', 'roadmap', 'hooks', 'ROADMAP.md'), roadmap('Hooks roadmap', { Blocking: ['Harden hook linking'] }))
  writeFileSync(join(root, 'docs', 'roadmap', 'runtime', 'ROADMAP.md'), roadmap('Runtime roadmap', { Next: ['Add runtime parity'] }))
  writeFileSync(
    join(root, 'docs', 'roadmap', 'hooks', 'plans', '001-harden-hook-linking.md'),
    plan('001', 'Harden hook linking', 'hooks/harden-hook-linking', '002')
  )
  writeFileSync(
    join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md'),
    plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
  )
  return root
}

// Simple profile: INIT is dry-run safe, creates once, and AUDIT accepts it.
{
  const root = fixture()
  try {
    const dry = run(INIT, root, ['--dry-run'])
    check('simple INIT dry-run exits zero', dry.code === 0)
    check('simple INIT dry-run writes nothing', !existsSync(join(root, 'ROADMAP.md')))
    const created = run(INIT, root)
    check('simple INIT creates ROADMAP.md', created.code === 0 && existsSync(join(root, 'ROADMAP.md')))
    const before = readFileSync(join(root, 'ROADMAP.md'), 'utf8')
    check('simple AUDIT passes', run(AUDIT, root).code === 0)
    run(INIT, root)
    check('simple INIT never clobbers existing roadmap', readFileSync(join(root, 'ROADMAP.md'), 'utf8') === before)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Horizon structure is exact and ordered.
{
  const root = fixture()
  try {
    writeFileSync(join(root, 'ROADMAP.md'), '# Roadmap\n\n## Next\n\n## Blocking\n')
    const result = run(AUDIT, root)
    check('malformed horizons fail', result.code !== 0 && result.out.includes('ROAD-1'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// KB off-ramp: no artifact is NA; project artifacts fail; INIT never writes.
{
  const root = fixture()
  try {
    writeFileSync(join(root, '.ki-config.toml'), '["ki-repo"]\nrepo_type = "kb"\n')
    const clean = run(AUDIT, root)
    check('KB without project artifacts reports off-ramp', clean.code === 0 && clean.out.includes('ki-kb-streams'))
    run(INIT, root)
    check('KB INIT writes nothing', !existsSync(join(root, 'ROADMAP.md')))
    writeFileSync(join(root, 'ROADMAP.md'), roadmap('Wrong KB roadmap'))
    const invalid = run(AUDIT, root)
    check('KB project artifact fails scope', invalid.code !== 0 && invalid.out.includes('SCOPE-1'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Thematic generation, qualified locators, global dependencies, and exact drift checks.
{
  const root = thematicFixture()
  try {
    mkdirSync(join(root, 'docs', 'roadmap', 'docs'), { recursive: true })
    writeFileSync(
      join(root, 'docs', 'roadmap', 'docs', 'ROADMAP.md'),
      roadmap('Docs roadmap', { Soon: ['Allow `printWidth` via `.ki-config.toml`'] })
    )
    const dry = run(CONFORM, root, ['--dry-run'])
    check('thematic CONFORM dry-run exits zero', dry.code === 0)
    check(
      'thematic CONFORM dry-run writes no projections',
      !existsSync(join(root, 'ROADMAP.md')) && !existsSync(join(root, 'docs', 'roadmap', 'README.md'))
    )
    const conformed = run(CONFORM, root)
    check(
      'thematic CONFORM generates both projections',
      conformed.code === 0 && existsSync(join(root, 'ROADMAP.md')) && existsSync(join(root, 'docs', 'roadmap', 'README.md'))
    )
    const audited = run(AUDIT, root)
    check('valid thematic profile audits cleanly', audited.code === 0 && !/FAIL \(/.test(audited.out))
    check('theme without active plans needs no plans directory', !existsSync(join(root, 'docs', 'roadmap', 'docs', 'plans')))
    check(
      'root is a compact linked projection',
      readFileSync(join(root, 'ROADMAP.md'), 'utf8').includes('hooks/ROADMAP.md#harden-hook-linking')
    )
    check(
      'root links use rendered Markdown heading anchors',
      readFileSync(join(root, 'ROADMAP.md'), 'utf8').includes('docs/ROADMAP.md#allow-printwidth-via-ki-configtoml')
    )
    check('global index renders dependency edge', readFileSync(join(root, 'docs', 'roadmap', 'README.md'), 'utf8').includes('001 ──► 002'))
    writeFileSync(join(root, 'ROADMAP.md'), '# drift\n')
    const drift = run(AUDIT, root)
    check('projection drift fails exactly', drift.code !== 0 && drift.out.includes('PROJ-1'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Invalid locator and non-near horizon are mechanical failures.
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    writeFileSync(path, plan('002', 'Add runtime parity', 'hooks/missing-item', '—', '001'))
    const result = run(AUDIT, root)
    check('unresolved cross-theme locator fails', result.code !== 0 && result.out.includes('PLAN-2'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    writeFileSync(join(root, 'docs', 'roadmap', 'runtime', 'ROADMAP.md'), roadmap('Runtime roadmap', { Soon: ['Add runtime parity'] }))
    const result = run(AUDIT, root)
    check('plan linked outside Blocking/Next fails', result.code !== 0 && result.out.includes('plans exist only in Blocking or Next'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Duplicate global ids and dependency cycles are rejected.
{
  const root = thematicFixture()
  try {
    const runtimePlans = join(root, 'docs', 'roadmap', 'runtime', 'plans')
    rmSync(join(runtimePlans, '002-add-runtime-parity.md'))
    writeFileSync(join(runtimePlans, '001-add-runtime-parity.md'), plan('001', 'Add runtime parity', 'runtime/add-runtime-parity'))
    const duplicate = run(AUDIT, root)
    check('duplicate global id fails', duplicate.code !== 0 && duplicate.out.includes('global id 001'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const hooks = join(root, 'docs', 'roadmap', 'hooks', 'plans', '001-harden-hook-linking.md')
    const runtime = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    writeFileSync(hooks, plan('001', 'Harden hook linking', 'hooks/harden-hook-linking', '002', '002'))
    writeFileSync(runtime, plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '001', '001'))
    const cycle = run(AUDIT, root)
    check('dependency cycle fails', cycle.code !== 0 && cycle.out.includes('dependency cycle'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Plan frontmatter, dependency fields, and body structure fail closed.
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const original = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
    writeFileSync(path, original.replace("id: '002'", 'id: 002').concat("\nid: '002'\n"))
    const result = run(AUDIT, root)
    check('quoted id must occur in frontmatter, not the body', result.code !== 0 && result.out.includes('id must be quoted in frontmatter'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const original = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
    writeFileSync(path, original.replace('title: Add runtime parity', 'title: Add runtime parity\ntitle: Duplicate title'))
    const result = run(AUDIT, root)
    check('duplicate frontmatter keys fail', result.code !== 0 && result.out.includes("duplicate frontmatter key 'title'"))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const original = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
    writeFileSync(path, original.replace('status: open', 'status: open\nowner: nobody'))
    const result = run(AUDIT, root)
    check('unexpected frontmatter keys fail', result.code !== 0 && result.out.includes('frontmatter has unexpected field(s): owner'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
for (const field of ['id', 'title', 'status', 'roadmap']) {
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const original = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
    writeFileSync(path, original.replace(new RegExp(`^${field}:.*$`, 'm'), `${field}:`))
    const result = run(AUDIT, root)
    check(`empty ${field} fails`, result.code !== 0 && result.out.includes(`frontmatter field '${field}' must not be empty`))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    writeFileSync(path, plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '002, 002', '001'))
    const result = run(AUDIT, root)
    check('duplicate dependency ids fail', result.code !== 0 && result.out.includes('blocks contains duplicate id(s): 002'))
    check('self dependencies fail', result.code !== 0 && result.out.includes('plan 002 must not depend on itself'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const original = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
    writeFileSync(path, original.replace('## Current state', '## Verify first'))
    const result = run(AUDIT, root)
    check(
      'plan body requires the exact ordered core H2 sections',
      result.code !== 0 && result.out.includes('body must contain each core H2 exactly once')
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
for (const section of ['Steps', 'Verify']) {
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const original = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
    const next = section === 'Steps' ? 'Files touched' : 'Dependencies / blocks'
    writeFileSync(path, original.replace(new RegExp(`(## ${section})[\\s\\S]*?(?=## ${next})`), `$1\n\n`))
    const result = run(AUDIT, root)
    check(`plan body rejects empty ${section}`, result.code !== 0 && result.out.includes(`body section '${section}' must not be empty`))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const path = join(root, 'docs', 'roadmap', 'runtime', 'plans', '002-add-runtime-parity.md')
    const composed = plan('002', 'Add runtime parity', 'runtime/add-runtime-parity', '—', '001')
      .replace('blocked-by: 001', 'blocked-by: 001\nhandoff: true\ntier: sonnet\nreadiness: pending')
      .concat('\n## Decisions\n\nLocked: use the thematic layout.\n\nEscalate: none.\n')
    writeFileSync(path, composed)
    run(CONFORM, root)
    check('composed handoff fields and extension sections remain valid', run(AUDIT, root).code === 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Generated outputs never follow symlinks.
{
  const root = thematicFixture()
  const outside = fixture()
  try {
    const sentinel = join(outside, 'sentinel.md')
    writeFileSync(sentinel, 'do not replace\n')
    symlinkSync(sentinel, join(root, 'ROADMAP.md'))
    const result = run(CONFORM, root)
    check('CONFORM refuses symlink output', result.code !== 0 && result.out.includes('SAFE-1'))
    check('CONFORM leaves symlink target byte-identical', readFileSync(sentinel, 'utf8') === 'do not replace\n')
  } finally {
    rmSync(root, { recursive: true, force: true })
    rmSync(outside, { recursive: true, force: true })
  }
}

// Dangling generated-output symlinks are entries and must never be replaced.
{
  const root = fixture()
  try {
    const path = join(root, 'ROADMAP.md')
    symlinkSync(join(root, 'missing-roadmap'), path)
    const result = run(INIT, root)
    check('INIT refuses a dangling ROADMAP symlink', result.code !== 0 && result.out.includes('SAFE-1'))
    check('INIT leaves a dangling ROADMAP symlink in place', lstatSync(path).isSymbolicLink())
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const path = join(root, 'ROADMAP.md')
    symlinkSync(join(root, 'missing-roadmap'), path)
    const result = run(CONFORM, root)
    check('CONFORM refuses a dangling root projection symlink', result.code !== 0 && result.out.includes('SAFE-1'))
    check('CONFORM leaves a dangling root projection symlink in place', lstatSync(path).isSymbolicLink())
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
{
  const root = thematicFixture()
  try {
    const initial = run(CONFORM, root)
    const path = join(root, 'docs', 'roadmap', 'README.md')
    rmSync(path)
    symlinkSync(join(root, 'missing-index'), path)
    const result = run(CONFORM, root)
    check('CONFORM dangling-index fixture starts canonical', initial.code === 0)
    check('CONFORM refuses a dangling generated-index symlink', result.code !== 0 && result.out.includes('SAFE-1'))
    check('CONFORM leaves a dangling generated-index symlink in place', lstatSync(path).isSymbolicLink())
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31mproject-roadmap.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mproject-roadmap.test.ts: all checks passed\x1b[0m')
