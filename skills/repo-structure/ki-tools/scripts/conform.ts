#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createToolsContext } from './rubric/contexts/tools.ts'
import { KI_TOOLS_FAMILY_CODES, KI_TOOLS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(
    'Usage: bun scripts/conform.ts [target] [--dry-run] [--reporter jsonl|terminal]\n\nApply safe executable-bit and marker fixes.\n'
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
const unknown = parsed.arguments.find((argument) => argument.startsWith('-') && argument !== '--dry-run')
const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
if (unknown || targets.length > 1) {
  process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : 'conform accepts at most one target'}\n`)
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const dryRun = parsed.arguments.includes('--dry-run')
const result = runChecker({
  mode: 'conform',
  concern: KI_TOOLS_RUBRIC.concern,
  target,
  rubric: KI_TOOLS_RUBRIC,
  subjects: [{ familyCodes: KI_TOOLS_FAMILY_CODES, context: () => createToolsContext({ target, dryRun }) }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
