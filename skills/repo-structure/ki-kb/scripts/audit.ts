#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createKbContext } from './rubric/contexts/kb.ts'
import { KI_KB_FAMILY_CODES, KI_KB_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

// The structured context verifies the target base's CLAUDE.md / AGENTS.md memory-cascade anchor.
const usage = 'Usage: bun scripts/audit.ts [base-path] [--reporter=terminal] [--reporter-levels=all]\n'
const argv = process.argv.slice(2)
if (argv.some((argument) => ['-h', '--help', 'help', '?'].includes(argument))) {
  process.stdout.write(usage)
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
if (unknown || parsed.arguments.length > 1) {
  process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : 'audit accepts at most one target'}\n`)
  process.exit(2)
}
const target = resolve(parsed.arguments[0] ?? '.')
const result = runChecker({
  mode: 'audit',
  concern: KI_KB_RUBRIC.concern,
  target,
  rubric: KI_KB_RUBRIC,
  subjects: [{ familyCodes: KI_KB_FAMILY_CODES, context: () => createKbContext(target, true) }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
