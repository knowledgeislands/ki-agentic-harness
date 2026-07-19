#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createHarnessContext, type HarnessRubricContext } from './rubric/contexts/harness.ts'
import { KI_HARNESS_RUBRIC } from './rubric/items/index.ts'
import { type CheckerResult, type CheckerStatusTracker, runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const usage = `Usage: bun scripts/conform.ts [harness-path] [--dry-run] [--reporter=terminal] [--reporter-levels=all]

Apply safe mechanical remediation to one Knowledge Islands agentic harness.
With no reporter the command emits the canonical JSONL checker response.
`

type HarnessContextFactory = (target: string, dryRun: boolean) => HarnessRubricContext

/** The checker validates the complete catalogue and execution plan before invoking this context factory. */
export const runHarnessConform = (
  target: string,
  dryRun: boolean,
  rubric: RubricDefinition<HarnessRubricContext> = KI_HARNESS_RUBRIC,
  contextFactory: HarnessContextFactory = createHarnessContext,
  statusTracker?: CheckerStatusTracker
): CheckerResult =>
  runChecker({
    mode: 'conform',
    concern: rubric.concern,
    target,
    rubric,
    subjects: [{ familyCodes: rubric.families.map((family) => family.code), context: () => contextFactory(target, dryRun) }],
    statusTracker
  })

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

  const target = resolve(targets[0] ?? '.')
  const result = runHarnessConform(
    target,
    parsed.arguments.includes('--dry-run'),
    KI_HARNESS_RUBRIC,
    createHarnessContext,
    createTerminalStatusTracker({
      mode: parsed.progress,
      interactive: Boolean(process.stderr.isTTY),
      write: (line) => process.stderr.write(line)
    })
  )
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
