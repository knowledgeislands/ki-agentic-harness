#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-engineering rubric. */
import { resolve } from 'node:path'
import { createEngineeringContextFactory } from './rubric/contexts/engineering.ts'
import { KI_ENGINEERING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/audit.ts [target] [--reporter jsonl|terminal] [--reporter-levels levels]\n')
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
if (unknown.length || targets.length > 1) {
  process.stderr.write(`error: ${unknown.length ? `unknown option: ${unknown[0]}` : 'audit accepts at most one target'}\n`)
  process.exit(2)
}
const result = runChecker({
  mode: 'audit',
  concern: KI_ENGINEERING_RUBRIC.concern,
  target: resolve(targets[0] ?? '.'),
  rubric: KI_ENGINEERING_RUBRIC,
  subjects: [
    {
      familyCodes: KI_ENGINEERING_RUBRIC.families.map((family) => family.code),
      context: createEngineeringContextFactory({ target: resolve(targets[0] ?? '.') })
    }
  ]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
