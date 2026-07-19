#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createHandoffsContext } from './rubric/contexts/handoffs.ts'
import { KI_HANDOFFS_FAMILY_CODES, KI_HANDOFFS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const usage = `Usage: bun scripts/audit.ts [directory-or-file] [options]

Audit the handoff-readiness delta for Markdown artifacts with handoff: true.

Options:
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`

const main = (): never => {
  const arguments_ = process.argv.slice(2)
  if (arguments_.some((argument) => argument === '-h' || argument === '--help')) {
    process.stdout.write(usage)
    process.exit(0)
  }

  let parsed: ReturnType<typeof parseReporterArguments>
  try {
    parsed = parseReporterArguments(arguments_)
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

  const targetArgument = parsed.arguments[0] ?? '.'
  const target = resolve(targetArgument)
  const result = runChecker({
    mode: 'audit',
    concern: KI_HANDOFFS_RUBRIC.concern,
    target,
    rubric: KI_HANDOFFS_RUBRIC,
    subjects: [{ familyCodes: KI_HANDOFFS_FAMILY_CODES, context: () => createHandoffsContext(targetArgument, true) }]
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
