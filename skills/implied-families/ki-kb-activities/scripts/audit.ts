#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-kb-activities rubric. */
import { resolve } from 'node:path'
import { createActivitiesContextFactory } from './rubric/contexts/activities.ts'
import { KI_KB_ACTIVITIES_FAMILY_CODES, KI_KB_ACTIVITIES_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/audit.ts [base-path] [--harness path] [--reporter jsonl|terminal] [--reporter-levels levels]\n')
  process.exit(0)
}

let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}

const paths: string[] = []
let harness: string | undefined
for (let index = 0; index < parsed.arguments.length; index++) {
  const argument = parsed.arguments[index] as string
  if (argument === '--harness' || argument.startsWith('--harness=')) {
    const value = argument === '--harness' ? parsed.arguments[++index] : argument.slice('--harness='.length)
    if (!value || value.startsWith('-')) {
      process.stderr.write('error: --harness requires a path\n')
      process.exit(2)
    }
    harness = resolve(value)
  } else if (argument.startsWith('-')) {
    process.stderr.write(`error: unknown option: ${argument}\n`)
    process.exit(2)
  } else {
    paths.push(argument)
  }
}
if (paths.length > 1) {
  process.stderr.write('error: audit accepts at most one base path\n')
  process.exit(2)
}

const target = resolve(paths[0] ?? '.')
const result = runChecker({
  mode: 'audit',
  concern: KI_KB_ACTIVITIES_RUBRIC.concern,
  target,
  rubric: KI_KB_ACTIVITIES_RUBRIC,
  subjects: [{ familyCodes: KI_KB_ACTIVITIES_FAMILY_CODES, context: createActivitiesContextFactory({ target, harness }) }],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
