#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createAgentsContext, type AgentsRubricContext } from './rubric/contexts/agents.ts'
import { KI_AGENTS_RUBRIC } from './rubric/items/index.ts'
import { runChecker, type CheckerResult } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const usage = `Usage: bun scripts/conform.ts [agent-or-directory] [options]

Apply the safe mechanical name-alignment fix to one agent definition or agent set.

Options:
  --dry-run                    Report changes without writing them.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`

type AgentsContextFactory = (roots: readonly string[], dryRun: boolean) => AgentsRubricContext

/** The checker validates the complete catalogue and execution plan before invoking this context factory. */
export const runAgentsConform = (
  target: string,
  dryRun: boolean,
  rubric: RubricDefinition<AgentsRubricContext> = KI_AGENTS_RUBRIC,
  contextFactory: AgentsContextFactory = createAgentsContext
): CheckerResult =>
  runChecker({
    mode: 'conform',
    concern: rubric.concern,
    target: resolve(target),
    rubric,
    subjects: [{ familyCodes: rubric.families.map((family) => family.code), context: () => contextFactory([target], dryRun) }]
  })

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
  const unknownOption = parsed.arguments.find((argument) => argument.startsWith('-') && argument !== '--dry-run')
  if (unknownOption) {
    process.stderr.write(`error: unknown option: ${unknownOption}\n`)
    process.exit(2)
  }
  const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
  if (targets.length > 1) {
    process.stderr.write('error: conform accepts at most one target\n')
    process.exit(2)
  }

  const target = targets[0] ?? 'agents'
  const result = runAgentsConform(target, parsed.arguments.includes('--dry-run'))
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
