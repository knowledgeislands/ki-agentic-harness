#!/usr/bin/env bun
/** Focused contract tests for the canonical checker-reporter JSONL builder. */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  buildCheckerReporterEvents,
  CHECKER_LEVELS,
  type CheckerFinding,
  checkerReporterExitCode,
  judgmentFindingsFromRubric,
  parseCheckerReporterJsonl,
  rubricCriteriaFromMarkdown,
  validateCheckerReporterEvents,
  validateCheckerReporterRubric
} from './checker-reporter.ts'

let failed = false
const check = (label: string, condition: boolean): void => {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

const findings: CheckerFinding[] = [
  { type: 'M', level: 'FAIL', code: 'RULE-1', message: 'required file is absent', subject: 'README.md' },
  { type: 'M', level: 'PASS', code: 'RULE-2', message: 'normal form is present' },
  { type: 'J', level: 'ADVISORY', code: 'RULE-3', message: 'review the authored explanation' }
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
check('summary → every ladder level is present', summary?.record === 'summary' && CHECKER_LEVELS.every((level) => level.toLowerCase() in summary.summary))
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

const rubricFixture = mkdtempSync(join(tmpdir(), 'ki-checker-rubric-'))
try {
  const rubric = join(rubricFixture, 'rubric.md')
  writeFileSync(
    rubric,
    '- **RULE-1 [M]** Mechanical requirement\n- **MD-table [J]** Table judgment\n- **JUDGMENT [M + J]** Review both halves\n- **[J] DEC-1** Alternate rubric ordering\n- [ ] **WEB-2** [M] WARN — Rendered title form\n- [ ] [M] WARN — `KI-SHAPE-12`: Multi-segment code form\n- **legacy label [M]** `` `LEGACY-1` `` Legacy rubric form\n'
  )
  const judgmentCodes = judgmentFindingsFromRubric(rubric).map((finding) => finding.code)
  check('judgment prompts → accepts both rubric tag orders and named codes', judgmentCodes.join(',') === 'DEC-1,JUDGMENT,MD-table')

  const criteria = rubricCriteriaFromMarkdown(readFileSync(rubric, 'utf8'))
  check(
    'rubric parser → resolves titles and M/J types from established bullet forms',
    criteria.get('RULE-1')?.title === 'Mechanical requirement' &&
      criteria.get('JUDGMENT')?.types.has('M') === true &&
      criteria.get('JUDGMENT')?.types.has('J') === true &&
      criteria.get('WEB-2')?.title === 'Rendered title form' &&
      criteria.get('KI-SHAPE-12')?.title === 'Multi-segment code form' &&
      criteria.get('LEGACY-1')?.title === 'legacy label'
  )
  const rubricEvents = buildCheckerReporterEvents({
    mode: 'audit',
    concern: 'fixture',
    target: '/fixture',
    findings: [
      { type: 'M', level: 'PASS', code: 'RULE-1', message: 'normal form is present' },
      { type: 'M', level: 'WARN', code: 'WEB-2', message: 'required field is absent' },
      { type: 'J', level: 'ADVISORY', code: 'MD-table', message: 'review the authored table' },
      { type: 'J', level: 'ADVISORY', code: 'JUDGMENT', message: 'review the combined criterion' },
      { type: 'J', level: 'ADVISORY', code: 'DEC-1', message: 'review the alternate ordering' }
    ]
  })
  check('rubric validator → accepts resolved codes, types, and complete J prompts', validateCheckerReporterRubric(rubricEvents, criteria).length === 0)

  const unknownCode = structuredClone(rubricEvents) as unknown[]
  const unknownRecord = unknownCode.find(
    (event) => (event as { record?: string; type?: string }).record === 'finding' && (event as { type?: string }).type === 'M'
  ) as {
    code: string
  }
  unknownRecord.code = 'UNKNOWN-1'
  check(
    'rubric validator → rejects an emitted code absent from the rubric',
    validateCheckerReporterRubric(unknownCode, criteria).some((error) => error.includes('does not resolve'))
  )

  const repeatedTitle = structuredClone(rubricEvents) as unknown[]
  const repeatedRecord = repeatedTitle.find((event) => (event as { code?: string }).code === 'WEB-2') as { message: string }
  repeatedRecord.message = 'Rendered title form is missing'
  check(
    'rubric validator → rejects a message that repeats the rendered title',
    validateCheckerReporterRubric(repeatedTitle, criteria).some((error) => error.includes('repeats its rubric title'))
  )
} finally {
  rmSync(rubricFixture, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('\n\x1b[32mchecker-reporter.test.ts: all checks passed\x1b[0m')
