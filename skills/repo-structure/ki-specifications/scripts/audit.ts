#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createSpecificationsContext } from './rubric/contexts/specifications.ts'
import { KI_SPECIFICATIONS_FAMILY_CODES, KI_SPECIFICATIONS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(
    'Usage: bun scripts/audit.ts [target] [--reporter jsonl|terminal]\n\nAudit a KI Specifications repository structure.\n'
  )
  process.exit(0)
}
let parsed: ReturnType<typeof parseReporterArguments>
try {
  parsed = parseReporterArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const unknown = parsed.arguments.find((argument) => argument.startsWith('-'))
const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
if (unknown || targets.length > 1) {
  process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : 'audit accepts at most one target'}\n`)
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const result = runChecker({
  mode: 'audit',
  concern: KI_SPECIFICATIONS_RUBRIC.concern,
  target,
  rubric: KI_SPECIFICATIONS_RUBRIC,
  subjects: [{ familyCodes: KI_SPECIFICATIONS_FAMILY_CODES, context: () => createSpecificationsContext({ target, dryRun: true }) }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
