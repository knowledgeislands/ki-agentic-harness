#!/usr/bin/env bun
// Audit Agent Skills against the mechanical half of the codified ki-skills rubric.
//
// Usage:
//   bun scripts/audit.ts [path ...]
//   bun scripts/audit.ts <skill> --footprint
//   bun scripts/audit.ts skills --refresh-status

import { resolve } from 'node:path'
import { type CheckerEvaluationSubject, runChecker } from './lib/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './lib/reporter.ts'
import type { KiSkillsRubricContext } from './rubric/contexts/contexts.ts'
import { createKiSkillsSubjects } from './rubric/contexts/subjects.ts'
import { KI_SKILLS_RUBRIC, KI_SKILLS_SUBJECT_FAMILIES } from './rubric/items/index.ts'

const rawArgv = process.argv.slice(2)
if (rawArgv.includes('-h') || rawArgv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/audit.ts [target ...] [options]

Audit Agent Skills against the mechanical aspects of the ki-skills rubric.

Options:
  --footprint                  Include optional token-footprint measurements.
  --refresh-status             Report source-refresh status.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`)
  process.exit(0)
}
let parsedReporter: ReturnType<typeof parseReporterArguments>
try {
  parsedReporter = parseReporterArguments(rawArgv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const argv = parsedReporter.arguments
const unknownOptions = argv.filter((argument) => argument.startsWith('-') && argument !== '--footprint' && argument !== '--refresh-status')
if (unknownOptions.length > 0) {
  process.stderr.write(`error: unknown option: ${unknownOptions[0]}\n`)
  process.exit(2)
}
const roots = argv.filter((argument) => !argument.startsWith('-'))
const reportTarget = resolve('.')
const scope = createKiSkillsSubjects({
  mode: 'audit',
  roots,
  reportTarget,
  footprint: argv.includes('--footprint'),
  refreshStatus: argv.includes('--refresh-status')
})
const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
  familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
  context,
  ...(subject ? { subject } : {})
}))

const result = runChecker({
  mode: 'audit',
  concern: 'skills',
  target: reportTarget,
  rubric: KI_SKILLS_RUBRIC,
  subjects
})

process.stdout.write(
  renderCheckerResult(result, {
    ...parsedReporter.options,
    colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR)
  })
)
process.exit(result.exitCode)
