#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createHarnessContext } from './rubric/contexts/harness.ts'
import { KI_HARNESS_FAMILY_CODES, KI_HARNESS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const usage = `Usage: bun scripts/audit.ts [harness-path] [--reporter=terminal] [--reporter-levels=all]

Audit one Knowledge Islands agentic harness.
With no reporter the command emits the canonical JSONL checker response.
`

const main = (): never => {
  const rawArguments = process.argv.slice(2)
  if (rawArguments.some((argument) => ['-h', '--help', 'help', '?'].includes(argument))) {
    process.stdout.write(usage)
    process.exit(0)
  }

  let parsed: ReturnType<typeof parseCheckerArguments>
  try {
    parsed = parseCheckerArguments(rawArguments)
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(2)
  }

  const unknownOption = parsed.arguments.find((argument) => argument.startsWith('-'))
  if (unknownOption) {
    process.stderr.write(`error: unknown option: ${unknownOption}\n`)
    process.exit(2)
  }
  if (parsed.arguments.length > 1) {
    process.stderr.write('error: audit accepts at most one target\n')
    process.exit(2)
  }

  const target = resolve(parsed.arguments[0] ?? '.')
  const result = runChecker({
    mode: 'audit',
    concern: KI_HARNESS_RUBRIC.concern,
    target,
    rubric: KI_HARNESS_RUBRIC,
    subjects: [{ familyCodes: KI_HARNESS_FAMILY_CODES, context: () => createHarnessContext(target, true) }],
    statusTracker: createTerminalStatusTracker({
      mode: parsed.progress,
      interactive: Boolean(process.stderr.isTTY),
      write: (line) => process.stderr.write(line)
    })
  })

  process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
  process.exit(result.exitCode)
}

if (import.meta.main) {
  try {
    main()
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(2)
  }
}
