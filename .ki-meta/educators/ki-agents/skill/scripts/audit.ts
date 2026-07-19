#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createAgentsContext } from './rubric/contexts/agents.ts'
import { KI_AGENTS_FAMILY_CODES, KI_AGENTS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const usage = `Usage: bun scripts/audit.ts [agent-or-directory ...] [options]

Audit one agent definition or an agent set. Directories are walked recursively.

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

  const roots = parsed.arguments.length > 0 ? parsed.arguments : ['.']
  const target = resolve(roots[0] as string)
  const result = runChecker({
    mode: 'audit',
    concern: KI_AGENTS_RUBRIC.concern,
    target,
    rubric: KI_AGENTS_RUBRIC,
    subjects: [{ familyCodes: KI_AGENTS_FAMILY_CODES, context: () => createAgentsContext(roots, true) }]
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
