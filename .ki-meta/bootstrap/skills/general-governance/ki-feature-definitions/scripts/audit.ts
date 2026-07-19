#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured Feature Definitions rubric. */

import { resolve } from 'node:path'
import { createFeatureDefinitionsContextFactory } from './rubric/contexts/feature-definitions.ts'
import { FEATURE_DEFINITIONS_FAMILY_CODES, KI_FEATURE_DEFINITIONS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/audit.ts [target] [options]

Audit a docs/features corpus against the Feature Definitions rubric.

Options:
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`)
  process.exit(0)
}

let parsed: ReturnType<typeof parseReporterArguments>
try {
  parsed = parseReporterArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const unknown = parsed.arguments.filter((argument) => argument.startsWith('-'))
const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
if (unknown.length > 0) {
  process.stderr.write(`error: unknown option: ${unknown[0]}\n`)
  process.exit(2)
}
if (targets.length > 1) {
  process.stderr.write('error: audit accepts at most one target\n')
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const result = runChecker({
  mode: 'audit',
  concern: KI_FEATURE_DEFINITIONS_RUBRIC.concern,
  target,
  rubric: KI_FEATURE_DEFINITIONS_RUBRIC,
  subjects: [{ familyCodes: FEATURE_DEFINITIONS_FAMILY_CODES, context: createFeatureDefinitionsContextFactory({ target }) }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
