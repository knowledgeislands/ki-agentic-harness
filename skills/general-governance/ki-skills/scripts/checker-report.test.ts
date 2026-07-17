#!/usr/bin/env bun
/** Focused contract tests for the canonical checker-report JSONL builder. */
import { buildCheckerReportEvents, CHECKER_LEVELS, type CheckerFinding, checkerExitCode } from './checker-report.ts'

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

const findings: CheckerFinding[] = [
  { type: 'M', level: 'FAIL', code: 'RULE-1', message: 'required file is absent', ref: 'references/rubric.md', file: 'README.md' },
  { type: 'M', level: 'PASS', code: 'RULE-2', message: 'normal form is present' },
  { type: 'J', level: 'ADVISORY', code: 'RULE-3', message: 'review the authored explanation', ref: 'references/rubric.md' }
]

const events = buildCheckerReportEvents({ mode: 'audit', concern: 'fixture', target: '/fixture', findings })
const meta = events[0]
const summary = events.at(-1)

check('JSONL order → meta first', meta?.record === 'meta')
check('JSONL order → summary last', summary?.record === 'summary')
check(
  'run identity → every record shares the same UUID',
  events.every((event) => event.runId === meta?.runId && /^[0-9a-f-]{36}$/i.test(event.runId))
)
check(
  'summary → every ladder level is present',
  summary?.record === 'summary' && CHECKER_LEVELS.every((level) => level.toLowerCase() in summary.summary)
)
check(
  'summary → counts the typed findings exactly',
  summary?.record === 'summary' && summary.summary.fail === 1 && summary.summary.pass === 1 && summary.summary.advisory === 1
)
check('exit status → M FAIL returns non-zero', checkerExitCode(findings) === 1)
check('exit status → J advisory alone returns zero', checkerExitCode([findings[2] as CheckerFinding]) === 0)

let rejectedEmptyCode = false
try {
  buildCheckerReportEvents({
    mode: 'audit',
    concern: 'fixture',
    target: '/fixture',
    findings: [{ type: 'M', level: 'FAIL', code: '', message: 'missing code' }]
  })
} catch {
  rejectedEmptyCode = true
}
check('validation → empty finding code is rejected', rejectedEmptyCode)

if (failed) process.exit(1)
console.log('\n\x1b[32mchecker-report.test.ts: all checks passed\x1b[0m')
