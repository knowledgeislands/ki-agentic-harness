#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createLiveArtifactsContext } from './rubric/contexts/live-artifacts.ts'
import { KI_KB_LIVE_ARTIFACTS_FAMILY_CODES, KI_KB_LIVE_ARTIFACTS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(
    'Usage: bun scripts/audit.ts [base-path] [--threshold-hours <n>] [--reporter jsonl|terminal]\n\nAudit Knowledge Islands live artifact pairs.\n'
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
const remaining: string[] = []
let thresholdHours = 24
for (let index = 0; index < parsed.arguments.length; index++) {
  const argument = parsed.arguments[index] as string
  if (argument === '--threshold-hours') {
    const value = parsed.arguments[++index]
    if (!value) {
      process.stderr.write('error: --threshold-hours requires a value\n')
      process.exit(2)
    }
    thresholdHours = Number(value)
  } else if (argument.startsWith('--threshold-hours=')) {
    thresholdHours = Number(argument.slice('--threshold-hours='.length))
  } else {
    remaining.push(argument)
  }
}
if (
  !Number.isFinite(thresholdHours) ||
  thresholdHours < 0 ||
  remaining.some((argument) => argument.startsWith('-')) ||
  remaining.length > 1
) {
  process.stderr.write('error: audit accepts one target and a non-negative --threshold-hours value\n')
  process.exit(2)
}
const target = resolve(remaining[0] ?? '.')
const context = createLiveArtifactsContext({ target, dryRun: true, thresholdHours })
const result = runChecker({
  mode: 'audit',
  concern: KI_KB_LIVE_ARTIFACTS_RUBRIC.concern,
  target,
  rubric: KI_KB_LIVE_ARTIFACTS_RUBRIC,
  subjects: [{ familyCodes: KI_KB_LIVE_ARTIFACTS_FAMILY_CODES, context: () => context }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
