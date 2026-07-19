#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-bootstrap rubric. */

import { resolve } from 'node:path'
import { createBootstrapContextFactory } from './rubric/contexts/bootstrap.ts'
import { KI_BOOTSTRAP_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/conform.ts [target] [options]

Apply safe repository-bootstrap fixes and report remaining governed state.

Options:
  --dry-run                    Report changes without writing them.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`)
  process.exit(0)
}

let parsedReporter: ReturnType<typeof parseReporterArguments>
try {
  parsedReporter = parseReporterArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}

const unknown = parsedReporter.arguments.filter((argument) => argument.startsWith('-') && argument !== '--dry-run')
const targets = parsedReporter.arguments.filter((argument) => !argument.startsWith('-'))
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
  concern: KI_BOOTSTRAP_RUBRIC.concern,
  target,
  rubric: KI_BOOTSTRAP_RUBRIC,
  subjects: [
    {
      familyCodes: ['BOOT'],
      context: createBootstrapContextFactory({ target, dryRun: parsedReporter.arguments.includes('--dry-run') })
    }
  ]
})

process.stdout.write(
  renderCheckerResult(result, {
    ...parsedReporter.options,
    colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR)
  })
)
process.exit(result.exitCode)
