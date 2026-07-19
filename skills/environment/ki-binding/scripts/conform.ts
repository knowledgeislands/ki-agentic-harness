#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-binding rubric. */
import { resolve } from 'node:path'
import { createBindingContext } from './rubric/contexts/binding.ts'
import { KI_BINDING_FAMILY_CODES, KI_BINDING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/conform.ts [project] [options]

Register and enable the KI Cowork plugin where Cowork settings exist.

Options:
  --dry-run                    Report changes without writing them.
  --repo <owner/repo>           Marketplace repository.
  --marketplace <name>          Marketplace name.
  --plugin <name>               Plugin name.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`)
  process.exit(0)
}
let parsed: ReturnType<typeof parseReporterArguments>
try {
  parsed = parseReporterArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\\n`)
  process.exit(2)
}
const dryRun = parsed.arguments.includes('--dry-run')
const valueOptions = ['--repo', '--marketplace', '--plugin']
const option = (name: string): string | undefined => {
  const index = parsed.arguments.indexOf(name)
  return index === -1 ? undefined : parsed.arguments[index + 1]
}
const missing = valueOptions.find((name) => parsed.arguments.includes(name) && (!option(name) || option(name)?.startsWith('-')))
const remaining = parsed.arguments.filter(
  (argument, index) =>
    argument !== '--dry-run' && !valueOptions.includes(argument) && !valueOptions.includes(parsed.arguments[index - 1] ?? '')
)
const unknown = remaining.find((argument) => argument.startsWith('-'))
if (unknown || missing || remaining.length > 1) {
  process.stderr.write(
    `error: ${unknown ? `unknown option: ${unknown}` : missing ? `${missing} requires a value` : 'conform accepts at most one project path'}\\n`
  )
  process.exit(2)
}
const project = remaining[0] ? resolve(remaining[0]) : undefined
const context = () =>
  createBindingContext({ project, dryRun, repo: option('--repo'), marketplace: option('--marketplace'), plugin: option('--plugin') })
const result = runChecker({
  mode: 'conform',
  concern: KI_BINDING_RUBRIC.concern,
  target: project ?? resolve('.'),
  rubric: KI_BINDING_RUBRIC,
  subjects: [{ familyCodes: KI_BINDING_FAMILY_CODES, context }]
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
