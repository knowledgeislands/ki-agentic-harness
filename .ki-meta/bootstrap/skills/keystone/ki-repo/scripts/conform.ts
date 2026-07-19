#!/usr/bin/env bun
import { createConformContext, type RepoRubricContext } from './rubric/contexts/contexts.ts'
import { KI_REPO_FAMILY_CODES, KI_REPO_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const usage = `Usage: bun scripts/conform.ts [repo-path] [--dry-run] [--scaffold-config-only] [--reporter=terminal] [--reporter-levels=all]

Apply the safe mechanical ki-repo remediations to one repository.
With no reporter the command emits the canonical JSONL checker response.
`

type ConformContextFactory = (arguments_: readonly string[]) => { target: string; context: RepoRubricContext }

/** Validate the complete checker plan before the context factory may perform any write. */
export const createValidatedConformContext = (
  arguments_: readonly string[],
  rubric: RubricDefinition<RepoRubricContext> = KI_REPO_RUBRIC,
  contextFactory: ConformContextFactory = createConformContext
): ReturnType<ConformContextFactory> => {
  const familyCodes = rubric.families.map((family) => family.code)
  const preflightContext: RepoRubricContext = {
    mode: 'conform',
    outcomes: () => [{ status: 'NOT_APPLICABLE', message: 'non-mutating checker-plan preflight' }]
  }
  runChecker({
    mode: 'conform',
    concern: rubric.concern,
    target: 'ki-repo:conform-preflight',
    rubric,
    subjects: [{ familyCodes, context: () => preflightContext }]
  })
  return contextFactory(arguments_)
}

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
  const unknownOptions = parsed.arguments.filter(
    (argument) => argument.startsWith('-') && argument !== '--dry-run' && argument !== '--scaffold-config-only'
  )
  if (unknownOptions.length > 0) {
    process.stderr.write(`error: unknown option: ${unknownOptions[0]}\n`)
    process.exit(2)
  }
  const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
  if (targets.length > 1) {
    process.stderr.write('error: conform accepts at most one target\n')
    process.exit(2)
  }

  const prepared = createValidatedConformContext(parsed.arguments)
  const result = runChecker({
    mode: 'conform',
    concern: KI_REPO_RUBRIC.concern,
    target: prepared.target,
    rubric: KI_REPO_RUBRIC,
    subjects: [{ familyCodes: KI_REPO_FAMILY_CODES, context: () => prepared.context }],
    statusTracker: createTerminalStatusTracker({
      mode: parsed.progress,
      interactive: Boolean(process.stderr.isTTY),
      write: (line) => process.stderr.write(line)
    })
  })

  process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
  process.exit(result.exitCode)
}

if (import.meta.main) main()
