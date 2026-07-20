/**
 * Programmatic contract for a governed checker entrypoint.
 *
 * A skill owns the construction of its checker input. This module keeps the
 * aggregate-facing plan/check lifecycle uniform without taking ownership of
 * that skill-specific configuration or its safe CONFORM persistence.
 */

import {
  type CheckerExecutionOptions,
  type CheckerInput,
  type CheckerPlan,
  type CheckerResult,
  planChecker,
  runChecker
} from './checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './reporter.ts'

export type GovernCheckMode = 'audit' | 'conform'

export type GovernedCheckOptions = CheckerExecutionOptions

export type GovernedConformOperation = {
  input: CheckerInput<any>
  persist?: () => void
}

export type GovernedCheckerDefinition<Options extends GovernedCheckOptions> = {
  audit: (options: Options) => CheckerInput<any>
  conform: (options: Options) => GovernedConformOperation
}

export type GovernedCliDefinition<Options extends GovernedCheckOptions> = {
  usage: string
  auditUsage: string
  conformUsage: string
  checker: {
    check: (mode: GovernCheckMode, options: Options) => CheckerResult
  }
  options: (mode: GovernCheckMode, arguments_: readonly string[]) => Options
  educate: (arguments_: readonly string[]) => void
}

/**
 * Build the side-effect-free plan/check pair that a governed entrypoint
 * exports. A CONFORM check reaches its skill-owned persist callback after the
 * checker has finished; planning never mutates target state.
 */
export const defineGovernedChecker = <Options extends GovernedCheckOptions>(
  definition: GovernedCheckerDefinition<Options>
): {
  plan: (mode: GovernCheckMode, options: Options) => CheckerPlan
  check: (mode: GovernCheckMode, options: Options) => CheckerResult
} => ({
  plan: (mode, options) => {
    if (mode === 'audit') {
      if (options.dryRun) throw new Error('audit does not accept --dry-run')
      return planChecker(definition.audit(options))
    }
    return planChecker(definition.conform(options).input)
  },
  check: (mode, options) => {
    if (mode === 'audit') {
      if (options.dryRun) throw new Error('audit does not accept --dry-run')
      return runChecker(definition.audit(options))
    }
    const operation = definition.conform(options)
    const result = runChecker(operation.input)
    operation.persist?.()
    return result
  }
})

/** Run the standard per-skill command grammar around a skill-owned checker definition. */
export const runGovernedCli = <Options extends GovernedCheckOptions>(
  definition: GovernedCliDefinition<Options>,
  argv: readonly string[] = process.argv.slice(2)
): void => {
  const [command, ...arguments_] = argv
  if (!command || ['-h', '--help', 'help', '?'].includes(command)) {
    process.stdout.write(definition.usage)
    return
  }
  if (command === 'audit' && arguments_.some((argument) => argument === '-h' || argument === '--help')) {
    process.stdout.write(definition.auditUsage)
    return
  }
  if (command === 'conform' && arguments_.some((argument) => argument === '-h' || argument === '--help')) {
    process.stdout.write(definition.conformUsage)
    return
  }
  try {
    if (command === 'educate') definition.educate(arguments_)
    else if (command === 'audit' || command === 'conform') {
      const parsed = parseCheckerArguments(arguments_)
      const options = definition.options(command, parsed.arguments)
      const result = definition.checker.check(command, {
        ...options,
        statusTracker: createTerminalStatusTracker({
          mode: parsed.progress,
          interactive: Boolean(process.stderr.isTTY),
          write: (line) => process.stderr.write(line)
        })
      })
      process.stdout.write(
        renderCheckerResult(result, {
          ...parsed.options,
          colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR)
        })
      )
      process.exitCode = result.exitCode
    } else throw new Error(`unknown command: ${command}`)
  } catch (error) {
    process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 2
  }
}
