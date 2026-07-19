#!/usr/bin/env bun
/** Mechanical CONFORM entry point for the structured ki-skills rubric. */

import { resolve } from 'node:path'
import { type CheckerEvaluationSubject, runChecker } from './lib/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './lib/reporter.ts'
import type { KiSkillsRubricContext } from './rubric/contexts/contexts.ts'
import { createKiSkillsSubjects, KI_SKILLS_SUBJECT_FAMILIES } from './rubric/contexts/subjects.ts'
import { KI_SKILLS_RUBRIC } from './rubric/items/index.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/conform.ts [target] [options]

Apply safe mechanical fixes from the ki-skills rubric.

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
const modeArguments = parsedReporter.arguments
const unknownOptions = modeArguments.filter((argument) => argument.startsWith('-') && argument !== '--dry-run')
if (unknownOptions.length > 0) {
  process.stderr.write(`error: unknown option: ${unknownOptions[0]}\n`)
  process.exit(2)
}
const targets = modeArguments.filter((argument) => !argument.startsWith('-'))
if (targets.length > 1) {
  process.stderr.write('error: conform accepts at most one target\n')
  process.exit(2)
}
const target = targets[0] ?? '.'
const reportTarget = resolve(target)
const scope = createKiSkillsSubjects({
  mode: 'conform',
  roots: [target],
  reportTarget,
  dryRun: modeArguments.includes('--dry-run')
})
const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
  familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
  context,
  ...(subject ? { subject } : {})
}))

const result = runChecker({
  mode: 'conform',
  concern: 'skills',
  target: reportTarget,
  rubric: KI_SKILLS_RUBRIC,
  subjects
})

scope.persist()
process.stdout.write(
  renderCheckerResult(result, {
    ...parsedReporter.options,
    colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR)
  })
)
process.exit(result.exitCode)
