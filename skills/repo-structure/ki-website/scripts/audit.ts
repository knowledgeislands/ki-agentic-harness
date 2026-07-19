#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-website rubric. */
import { resolve } from 'node:path'
import { createWebsiteContextFactory, KI_DEFAULT } from './rubric/contexts/website.ts'
import { KI_WEBSITE_FAMILY_CODES, KI_WEBSITE_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/audit.ts <repo-path> [--reporter jsonl|terminal] [--reporter-levels levels]\n')
  process.exit(0)
}
if (argv.includes('--educate')) {
  process.stdout.write(KI_DEFAULT)
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
if (paths.length !== 1 || parsed.arguments.some((argument) => argument.startsWith('-'))) {
  process.stderr.write('error: audit requires one repository path\n')
  process.exit(2)
}
const target = resolve(paths[0])
const result = runChecker({
  mode: 'audit',
  concern: KI_WEBSITE_RUBRIC.concern,
  target,
  rubric: KI_WEBSITE_RUBRIC,
  subjects: [{ familyCodes: KI_WEBSITE_FAMILY_CODES, context: createWebsiteContextFactory({ target }) }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
