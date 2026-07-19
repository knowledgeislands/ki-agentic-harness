#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-binding rubric. */
import { resolve } from 'node:path'
import { createBindingContext } from './rubric/contexts/binding.ts'
import { KI_BINDING_FAMILY_CODES, KI_BINDING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/audit.ts [project] [options]

Audit cross-surface MCP, skill, and Cowork-plugin binding.

Options:
  --source <path>              Use an explicit mcp-servers.yaml source.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`)
  process.exit(0)
}
let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\\n`)
  process.exit(2)
}
const sourceAt = parsed.arguments.indexOf('--source')
const source = sourceAt === -1 ? undefined : parsed.arguments[sourceAt + 1]
const remaining = parsed.arguments.filter((argument, index) => argument !== '--source' && index !== sourceAt + 1)
const unknown = remaining.find((argument) => argument.startsWith('-'))
if (unknown || (sourceAt !== -1 && (!source || source.startsWith('-'))) || remaining.length > 1) {
  process.stderr.write(
    `error: ${unknown ? `unknown option: ${unknown}` : sourceAt !== -1 && (!source || source.startsWith('-')) ? '--source requires a path' : 'audit accepts at most one project path'}\\n`
  )
  process.exit(2)
}
const project = remaining[0] ? resolve(remaining[0]) : undefined
const context = () => createBindingContext({ sourceOverride: source, project, dryRun: true })
const result = runChecker({
  mode: 'audit',
  concern: KI_BINDING_RUBRIC.concern,
  target: project ?? resolve(source ?? '.'),
  rubric: KI_BINDING_RUBRIC,
  subjects: [{ familyCodes: KI_BINDING_FAMILY_CODES, context }],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
