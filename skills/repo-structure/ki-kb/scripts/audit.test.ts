#!/usr/bin/env bun
/** Focused applicability tests for the ki-kb checker. */
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
const RUBRIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
let failed = false

function check(label: string, condition: boolean): void {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${label}`)
  if (!condition) failed = true
}

function fixture(): string {
  return mkdtempSync(join(tmpdir(), 'ki-kb-applicability-'))
}

type Run = { code: number; errors: string[]; findings: unknown[]; summary: { fail: number; na: number } }

function run(root: string): Run {
  const result = spawnSync(process.execPath, [AUDIT, root], { encoding: 'utf8' })
  const parsed = parseCheckerReporterJsonl(result.stdout)
  const events = parsed.events
  const summary = (events.at(-1) as { summary?: { fail?: number; na?: number } } | undefined)?.summary
  const findings = events.filter((event) => (event as { record?: string }).record === 'finding')
  return {
    code: result.status ?? 1,
    errors: [
      ...parsed.errors,
      ...validateCheckerReporterEvents(events, result.status ?? 1),
      ...validateCheckerReporterRubric(events, rubricCriteriaFromFile(RUBRIC))
    ],
    findings,
    summary: { fail: summary?.fail ?? -1, na: summary?.na ?? -1 }
  }
}

for (const [label, arrange, assert] of [
  [
    'absent and irrelevant reports one NA',
    (_root: string) => {},
    (r: ReturnType<typeof run>) => r.errors.length === 0 && r.code === 0 && r.summary.na === 1 && r.findings.length > 1
  ],
  [
    'multiline string lookalike remains irrelevant',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-repo]\nnote = """\n[ki-kb]\n"""\n'),
    (r: ReturnType<typeof run>) => r.errors.length === 0 && r.code === 0 && r.summary.na === 1 && r.findings.length > 1
  ],
  [
    'quoted declaration but incomplete runs the full audit',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '["ki-kb"]\n'),
    (r: ReturnType<typeof run>) => r.errors.length === 0 && r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ],
  [
    'malformed config fails closed into the full audit',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-kb\n'),
    (r: ReturnType<typeof run>) => r.errors.length === 0 && r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ],
  [
    'declared but incomplete runs the full audit',
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-kb]\n'),
    (r: ReturnType<typeof run>) => r.errors.length === 0 && r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
  ],
  [
    'structural marker without declaration runs the full audit',
    (root: string) => mkdirSync(join(root, 'Admin')),
    (r: ReturnType<typeof run>) => r.errors.length === 0 && r.code !== 0 && r.summary.fail > 0 && r.summary.na === 0
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
