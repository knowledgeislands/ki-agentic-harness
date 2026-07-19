#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured Decision Records rubric. */

import { resolve } from 'node:path'
import { createDecisionRecordsContextFactory } from './rubric/contexts/decision-records.ts'
import { DECISION_RECORDS_FAMILY_CODES, KI_DECISION_RECORDS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/conform.ts [target] [options]

Apply safe Decision Record index fixes.

Options:
  --dry-run                    Report changes without writing them.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`)
  process.exit(0)
}
let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const unknown = parsed.arguments.filter((argument) => argument.startsWith('-') && argument !== '--dry-run')
const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
if (unknown.length > 0) {
  process.stderr.write(`error: unknown option: ${unknown[0]}\n`)
  process.exit(2)
}
if (targets.length > 1) {
  process.stderr.write('error: conform accepts at most one target\n')
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const result = runChecker({
  mode: 'conform',
  concern: KI_DECISION_RECORDS_RUBRIC.concern,
  target,
  rubric: KI_DECISION_RECORDS_RUBRIC,
  subjects: [
    {
      familyCodes: DECISION_RECORDS_FAMILY_CODES,
      context: createDecisionRecordsContextFactory({ target, dryRun: parsed.arguments.includes('--dry-run') })
    }
  ],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
