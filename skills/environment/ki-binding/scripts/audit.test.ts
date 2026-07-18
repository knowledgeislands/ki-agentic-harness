#!/usr/bin/env bun
/** Focused canonical-reporter tests for the ki-binding checkers. */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parseCheckerReporterJsonl,
  rubricCriteriaFromFile,
  validateCheckerReporterEvents,
  validateCheckerReporterRubric
} from './vendored/ki-skills/checker-reporter.ts'

const scripts = dirname(fileURLToPath(import.meta.url))
const rubric = rubricCriteriaFromFile(join(scripts, '..', 'references', 'rubric.md'))
let failed = false

type Run = { code: number; findings: Array<{ code: string; level: string; type: string }> }

function check(label: string, condition: boolean): void {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${label}`)
  if (!condition) failed = true
}

function run(script: string, args: string[]): Run {
  const result = spawnSync(process.execPath, [join(scripts, script), ...args], { encoding: 'utf8' })
  const parsed = parseCheckerReporterJsonl(result.stdout)
  const events = parsed.events
  const errors = [
    ...parsed.errors,
    ...validateCheckerReporterEvents(events, result.status ?? 1),
    ...validateCheckerReporterRubric(events, rubric)
  ]
  if (errors.length) throw new Error(`invalid canonical checker stream: ${errors.join('; ')}`)
  const findings = events.filter(
    (event): event is { record: 'finding'; code: string; level: string; type: string } =>
      typeof event === 'object' && event !== null && (event as { record?: unknown }).record === 'finding'
  )
  return { code: result.status ?? 1, findings }
}

const fixture = mkdtempSync(join(tmpdir(), 'ki-binding-checker-'))
try {
  const validSource = join(fixture, 'mcp-servers.yaml')
  writeFileSync(validSource, 'mcpServers: []\n')

  const audit = run('audit.ts', ['--source', validSource])
  check('AUDIT accepts a valid source', audit.code === 0)
  check(
    'AUDIT emits BIND-5 as one judgment advisory',
    audit.findings.filter((finding) => finding.code === 'BIND-5' && finding.type === 'J').length === 1
  )

  const missing = run('audit.ts', ['--source', join(fixture, 'absent.yaml')])
  check(
    'AUDIT fails when the source is absent',
    missing.code !== 0 && missing.findings.some((finding) => finding.code === 'BIND-2' && finding.level === 'FAIL')
  )

  const conform = run('conform.ts', ['--dry-run'])
  check('CONFORM dry-run does not fail for pending changes', conform.code === 0)
  check(
    'CONFORM emits BIND-5 as one judgment advisory',
    conform.findings.filter((finding) => finding.code === 'BIND-5' && finding.type === 'J').length === 1
  )
} finally {
  rmSync(fixture, { recursive: true, force: true })
}

if (failed) process.exit(1)
