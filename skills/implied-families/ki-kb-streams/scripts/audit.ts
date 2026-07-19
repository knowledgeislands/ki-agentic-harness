#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createStreamsContext } from './rubric/contexts/streams.ts'
import { KI_KB_STREAMS_FAMILY_CODES, KI_KB_STREAMS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

// The structured context verifies the target's CLAUDE.md / AGENTS.md Enactment-gate anchor.
const argv = process.argv.slice(2)
if (argv.some((argument) => ['-h', '--help', 'help', '?'].includes(argument))) {
  process.stdout.write('Usage: bun scripts/audit.ts [base-path] [--reporter=terminal]\n')
  process.exit(0)
}
let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
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
  concern: KI_KB_STREAMS_RUBRIC.concern,
  target,
  rubric: KI_KB_STREAMS_RUBRIC,
  subjects: [{ familyCodes: KI_KB_STREAMS_FAMILY_CODES, context: () => createStreamsContext(target, true) }],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
