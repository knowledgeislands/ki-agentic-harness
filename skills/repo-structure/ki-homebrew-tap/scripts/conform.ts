#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createHomebrewTapContext } from './rubric/contexts/homebrew-tap.ts'
import { KI_HOMEBREW_TAP_FAMILY_CODES, KI_HOMEBREW_TAP_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(
    'Usage: bun scripts/conform.ts [target] [--dry-run] [--reporter jsonl|terminal]\n\nAdd the safe KI Homebrew tap identity marker when possible.\n'
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
const unknown = parsed.arguments.find((argument) => argument.startsWith('-') && argument !== '--dry-run')
const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
if (unknown || targets.length > 1) {
  process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : 'conform accepts at most one target'}\n`)
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const dryRun = parsed.arguments.includes('--dry-run')
const context = createHomebrewTapContext({ target, dryRun })
const result = runChecker({
  mode: 'conform',
  concern: KI_HOMEBREW_TAP_RUBRIC.concern,
  target,
  rubric: KI_HOMEBREW_TAP_RUBRIC,
  subjects: [{ familyCodes: context.applicable ? KI_HOMEBREW_TAP_FAMILY_CODES : ['CONFIG'], context: () => context }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
