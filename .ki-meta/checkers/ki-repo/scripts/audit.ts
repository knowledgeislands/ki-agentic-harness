#!/usr/bin/env bun
import { createAuditContext } from './rubric/contexts/contexts.ts'
import { KI_REPO_FAMILY_CODES, KI_REPO_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const usage = `Usage: bun scripts/audit.ts [tree-path] [--org <org>] [--reporter=terminal] [--reporter-levels=all]

Audit one repository, a local tree of repositories, or every repository in a GitHub organisation.
With no reporter the command emits the canonical JSONL checker response.
`

const rawArguments = process.argv.slice(2)
if (rawArguments.some((argument) => ['-h', '--help', 'help', '?'].includes(argument))) {
  process.stdout.write(usage)
  process.exit(0)
}
let parsed: ReturnType<typeof parseReporterArguments>
try {
  parsed = parseReporterArguments(rawArguments)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const unknownOptions = parsed.arguments.filter(
  (argument, index, arguments_) =>
    argument.startsWith('-') && argument !== '--educate' && argument !== '--org' && arguments_[index - 1] !== '--org'
)
if (unknownOptions.length > 0) {
  process.stderr.write(`error: unknown option: ${unknownOptions[0]}\n`)
  process.exit(2)
}

const prepared = createAuditContext(parsed.arguments)
if (prepared.educate !== undefined) {
  process.stdout.write(prepared.educate)
  process.exit(0)
}

const result = runChecker({
  mode: 'audit',
  concern: KI_REPO_RUBRIC.concern,
  target: prepared.target,
  rubric: KI_REPO_RUBRIC,
  subjects: [{ familyCodes: KI_REPO_FAMILY_CODES, context: () => prepared.context }]
})

process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
