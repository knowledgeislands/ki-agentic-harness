#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-plugins rubric. */
import { resolve } from 'node:path'
import { createPluginsContextFactory } from './rubric/contexts/plugins.ts'
import { KI_PLUGINS_FAMILY_CODES, KI_PLUGINS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/conform.ts [repo-path] [--dry-run] [--reporter jsonl|terminal] [--reporter-levels levels]\n')
  process.exit(0)
}
let parsed: ReturnType<typeof parseReporterArguments>
try {
  parsed = parseReporterArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const paths = parsed.arguments.filter((argument) => !argument.startsWith('-'))
const unknown = parsed.arguments.filter((argument) => argument.startsWith('-') && argument !== '--dry-run')
if (paths.length > 1 || unknown.length) {
  process.stderr.write(`error: ${unknown[0] ? `unknown option: ${unknown[0]}` : 'conform accepts at most one repository path'}\n`)
  process.exit(2)
}
const target = resolve(paths[0] ?? '.')
const result = runChecker({
  mode: 'conform',
  concern: KI_PLUGINS_RUBRIC.concern,
  target,
  rubric: KI_PLUGINS_RUBRIC,
  subjects: [
    {
      familyCodes: KI_PLUGINS_FAMILY_CODES,
      context: createPluginsContextFactory({ target, dryRun: parsed.arguments.includes('--dry-run') })
    }
  ]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
