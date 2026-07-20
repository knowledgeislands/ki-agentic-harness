#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-engineering rubric. */
import { resolve } from 'node:path'
import { createEngineeringContextFactory } from './rubric/contexts/engineering.ts'
import { KI_ENGINEERING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/conform.ts [target] [--dry-run] [--reporter jsonl|terminal] [--reporter-levels levels]\n')
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
if (unknown.length || targets.length > 1) {
  process.stderr.write(`error: ${unknown.length ? `unknown option: ${unknown[0]}` : 'conform accepts at most one target'}\n`)
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const result = runChecker({
  mode: 'conform',
  concern: KI_ENGINEERING_RUBRIC.concern,
  target,
  rubric: KI_ENGINEERING_RUBRIC,
  subjects: [
    {
      familyCodes: KI_ENGINEERING_RUBRIC.families.map((family) => family.code),
      context: createEngineeringContextFactory({ target, dryRun: parsed.arguments.includes('--dry-run') })
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
