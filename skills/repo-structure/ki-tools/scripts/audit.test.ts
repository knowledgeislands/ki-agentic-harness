#!/usr/bin/env bun
/** Focused applicability tests for the ki-tools checker. */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parseCheckerReporterJsonl,
  rubricCriteriaFromFile,
  validateCheckerReporterEvents,
  validateCheckerReporterRubric
} from './vendored/ki-skills/checker-reporter.ts'

const AUDIT = join(dirname(fileURLToPath(import.meta.url)), 'audit.ts')
let failed = false

function check(label: string, condition: boolean): void {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${label}`)
  if (!condition) failed = true
}

function fixture(): string {
  return mkdtempSync(join(tmpdir(), 'ki-tools-applicability-'))
}

function run(root: string): { code: number; findings: Array<{ level: string; code: string }>; summary: { fail: number; na: number } } {
  const result = spawnSync(process.execPath, [AUDIT, root], { encoding: 'utf8' })
  const parsed = parseCheckerReporterJsonl(result.stdout)
  const events = parsed.events
  const rubric = rubricCriteriaFromFile(join(dirname(AUDIT), '..', 'references', 'rubric.md'))
  const errors = [
    ...parsed.errors,
    ...validateCheckerReporterEvents(events, result.status ?? 1),
    ...validateCheckerReporterRubric(events, rubric)
  ]
  if (errors.length) throw new Error(`invalid canonical checker stream: ${errors.join('; ')}`)
  const findingEvents = events.filter(
    (event): event is { record: 'finding'; level: string; code: string } =>
      typeof event === 'object' && event !== null && (event as { record?: unknown }).record === 'finding'
  )
  const summary = events.at(-1) as { summary: { fail: number; na: number } }
  return { code: result.status ?? 1, findings: findingEvents, summary: summary.summary }
}

for (const [label, arrange, assert] of [
  [
    'absent and irrelevant reports one NA',
    (_root: string) => {},
    (r: ReturnType<typeof run>) => r.code === 0 && r.summary.na === 1 && r.findings.some((finding) => finding.code === 'CONFIG')
  ],
  [
    'multiline string lookalike remains irrelevant',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\nnote = """\n[ki-tools]\n"""\n'),
    (r: ReturnType<typeof run>) => r.code === 0 && r.summary.na === 1 && r.findings.some((finding) => finding.code === 'CONFIG')
  ],
  [
    'quoted declaration but incomplete runs the full audit',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '["ki-tools"]\n'),
    (r: ReturnType<typeof run>) => r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ],
  [
    'malformed config fails closed into the full audit',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-tools\n'),
    (r: ReturnType<typeof run>) => r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ],
  [
    'declared but incomplete runs the full audit',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-tools]\n'),
    (r: ReturnType<typeof run>) => r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ],
  [
    'structural marker without declaration runs the full audit',
    (root: string) => mkdirSync(join(root, 'bin')),
    (r: ReturnType<typeof run>) => r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ]
] as const) {
  const root = fixture()
  try {
    arrange(root)
    check(label, assert(run(root)))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

if (failed) process.exit(1)
