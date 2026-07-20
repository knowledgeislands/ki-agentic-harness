#!/usr/bin/env bun
/** The single governed entrypoint for ki-skills. */

import { resolve } from 'node:path'
import type { KiSkillsRubricContext } from './rubric/contexts/contexts.ts'
import { createKiSkillsSubjects, KI_SKILLS_SUBJECT_FAMILIES } from './rubric/contexts/subjects.ts'
import { KI_SKILLS_RUBRIC } from './rubric/items/index.ts'
import {
  type CheckerEvaluationSubject,
  type CheckerExecutionOptions,
  type CheckerPlan,
  type CheckerResult,
  planChecker,
  runChecker
} from './shared/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './shared/reporter.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'

export type GovernCheckMode = 'audit' | 'conform'

export type GovernCheckOptions = CheckerExecutionOptions & {
  roots?: readonly string[]
  footprint?: boolean
  refreshStatus?: boolean
}

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern Agent Skills through one standard entrypoint.

Commands:
  audit [target ...]      Run read-only mechanical checks.
  conform [target]        Apply safe mechanical fixes.
  educate [target]        Refresh ki-skills' local governed payload.
  help                    Show this help.
`

const auditUsage = `Usage: bun scripts/govern.ts audit [target ...] [options]

Audit Agent Skills against the mechanical aspects of the ki-skills rubric.

Options:
  --footprint                  Include optional token-footprint measurements.
  --refresh-status             Report source-refresh status.
  --progress <mode>            Progress: auto (default), always, or never.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`

const conformUsage = `Usage: bun scripts/govern.ts conform [target] [options]

Apply safe mechanical fixes from the ki-skills rubric.

Options:
  --dry-run                    Report changes without writing them.
  --progress <mode>            Progress: auto (default), always, or never.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`

const auditInput = ({ roots, target, footprint = false, refreshStatus = false, statusTracker }: GovernCheckOptions) => {
  const scope = createKiSkillsSubjects({
    mode: 'audit',
    roots: roots ?? [target],
    reportTarget: resolve(target),
    footprint,
    refreshStatus
  })
  const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
    familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
    context,
    ...(subject ? { subject } : {})
  }))
  return {
    mode: 'audit' as const,
    concern: 'skills',
    target: resolve(target),
    rubric: KI_SKILLS_RUBRIC,
    subjects,
    statusTracker
  }
}

const conformInput = ({ target, dryRun, statusTracker }: GovernCheckOptions) => {
  const reportTarget = resolve(target)
  const scope = createKiSkillsSubjects({
    mode: 'conform',
    roots: [target],
    reportTarget,
    dryRun
  })
  const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
    familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
    context,
    ...(subject ? { subject } : {})
  }))
  return {
    input: {
      mode: 'conform' as const,
      concern: 'skills',
      target: reportTarget,
      rubric: KI_SKILLS_RUBRIC,
      subjects,
      statusTracker
    },
    persist: scope.persist
  }
}

/** Build the no-side-effect work count used by direct and aggregate progress renderers. */
export const plan = (mode: GovernCheckMode, options: GovernCheckOptions): CheckerPlan => {
  if (mode === 'audit') {
    if (options.dryRun) throw new Error('audit does not accept --dry-run')
    return planChecker(auditInput(options))
  }
  return planChecker(conformInput(options).input)
}

/** Execute the structured checker for direct use or an in-process aggregate call. */
export const check = (mode: GovernCheckMode, options: GovernCheckOptions): CheckerResult => {
  if (mode === 'audit') {
    if (options.dryRun) throw new Error('audit does not accept --dry-run')
    return runChecker(auditInput(options))
  }
  const checker = conformInput(options)
  const result = runChecker(checker.input)
  checker.persist()
  return result
}

const writeResult = (result: CheckerResult, parsed: ReturnType<typeof parseCheckerArguments>): void => {
  process.stdout.write(
    renderCheckerResult(result, {
      ...parsed.options,
      colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR)
    })
  )
  process.exitCode = result.exitCode
}

const audit = (argv: readonly string[]): void => {
  const parsed = parseCheckerArguments(argv)
  const unknownOptions = parsed.arguments.filter(
    (argument) => argument.startsWith('-') && argument !== '--footprint' && argument !== '--refresh-status'
  )
  if (unknownOptions.length > 0) throw new Error(`unknown option: ${unknownOptions[0]}`)
  const roots = parsed.arguments.filter((argument) => !argument.startsWith('-'))
  writeResult(
    check('audit', {
      target: resolve('.'),
      roots,
      dryRun: false,
      footprint: argv.includes('--footprint'),
      refreshStatus: argv.includes('--refresh-status'),
      statusTracker: createTerminalStatusTracker({
        mode: parsed.progress,
        interactive: Boolean(process.stderr.isTTY),
        write: (line) => process.stderr.write(line)
      })
    }),
    parsed
  )
}

const conform = (argv: readonly string[]): void => {
  const parsed = parseCheckerArguments(argv)
  const unknownOptions = parsed.arguments.filter((argument) => argument.startsWith('-') && argument !== '--dry-run')
  if (unknownOptions.length > 0) throw new Error(`unknown option: ${unknownOptions[0]}`)
  const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
  if (targets.length > 1) throw new Error('conform accepts at most one target')
  writeResult(
    check('conform', {
      target: targets[0] ?? '.',
      dryRun: parsed.arguments.includes('--dry-run'),
      statusTracker: createTerminalStatusTracker({
        mode: parsed.progress,
        interactive: Boolean(process.stderr.isTTY),
        write: (line) => process.stderr.write(line)
      })
    }),
    parsed
  )
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void => {
  const [command, ...arguments_] = argv
  if (!command || ['-h', '--help', 'help', '?'].includes(command)) {
    process.stdout.write(usage)
    return
  }
  if (command === 'audit' && arguments_.some((argument) => argument === '-h' || argument === '--help')) {
    process.stdout.write(auditUsage)
    return
  }
  if (command === 'conform' && arguments_.some((argument) => argument === '-h' || argument === '--help')) {
    process.stdout.write(conformUsage)
    return
  }
  try {
    if (command === 'audit') audit(arguments_)
    else if (command === 'conform') conform(arguments_)
    else if (command === 'educate') runSkillEducator({ skill: 'ki-skills', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    else throw new Error(`unknown command: ${command}`)
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 2
  }
}

if (import.meta.main) main()
