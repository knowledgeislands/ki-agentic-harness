#!/usr/bin/env bun
/** Focused contract tests for the canonical checker-reporter JSONL builder. */
import {
  buildCheckerReporterEvents,
  CHECKER_LEVELS,
  type CheckerFinding,
  checkerReporterExitCode,
  parseCheckerReporterJsonl,
  validateCheckerReporterEvents
} from './checker-reporter.ts'

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

const events = buildCheckerReporterEvents({ mode: 'audit', concern: 'fixture', target: '/fixture', findings })
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
check('exit status → M FAIL returns non-zero', checkerReporterExitCode(findings) === 1)
check('exit status → J advisory alone returns zero', checkerReporterExitCode([findings[2] as CheckerFinding]) === 0)
check('canonical run → validator accepts complete JSONL event stream', validateCheckerReporterEvents(events, 1).length === 0)

const encoded = events.map((event) => JSON.stringify(event)).join('\n')
const parsed = parseCheckerReporterJsonl(`${encoded}\n`)
check('JSONL parser → accepts one event object per non-empty line', parsed.errors.length === 0 && parsed.events.length === events.length)
check('JSONL parser → reports non-JSON output', parseCheckerReporterJsonl('{"record":"meta"}\nnot-json\n').errors.length === 1)

const badSummary = structuredClone(events) as unknown[]
const summaryRecord = badSummary.at(-1) as { summary: { fail: number } }
summaryRecord.summary.fail = 0
check(
  'validator → rejects a summary that disagrees with findings',
  validateCheckerReporterEvents(badSummary, 1).some((error) => error.includes('summary fail'))
)

const badJudgment = structuredClone(events) as unknown[]
const judgmentRecord = badJudgment.find((event) => (event as { type?: string }).type === 'J') as { level: string }
judgmentRecord.level = 'WARN'
check(
  'validator → rejects a non-advisory J finding',
  validateCheckerReporterEvents(badJudgment, 1).some((error) => error.includes('J finding must be ADVISORY'))
)

const missingCitation = structuredClone(events) as unknown[]
const failRecord = missingCitation.find((event) => (event as { level?: string }).level === 'FAIL') as { ref?: string }
delete failRecord.ref
check(
  'validator → rejects a failure without a criterion citation',
  validateCheckerReporterEvents(missingCitation, 1).some((error) => error.includes('FAIL M finding must cite'))
)

let rejectedEmptyCode = false
try {
  buildCheckerReporterEvents({
    mode: 'audit',
    concern: 'fixture',
    target: '/fixture',
    findings: [{ type: 'M', level: 'FAIL', code: '', message: 'missing code' }]
  })
} catch {
  rejectedEmptyCode = true
}
check('validation → empty finding code is rejected', rejectedEmptyCode)

let rejectedMissingCitation = false
try {
  buildCheckerReporterEvents({
    mode: 'audit',
    concern: 'fixture',
    target: '/fixture',
    findings: [{ type: 'M', level: 'WARN', code: 'RULE-4', message: 'missing citation' }]
  })
} catch {
  rejectedMissingCitation = true
}
check('validation → non-passing mechanical findings require citations', rejectedMissingCitation)

if (failed) process.exit(1)
console.log('\n\x1b[32mchecker-reporter.test.ts: all checks passed\x1b[0m')
