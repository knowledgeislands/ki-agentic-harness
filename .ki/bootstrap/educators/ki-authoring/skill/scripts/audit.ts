#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-authoring rubric. */

import { resolve } from 'node:path'
import { createAuthoringContextFactory } from './rubric/contexts/authoring.ts'
import { KI_AUTHORING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
// OWN-1 audits the three files declared in frontmatter: .prettierrc.json,
// .editorconfig, and .markdownlint-cli2.jsonc. Their typed execution lives in
// the structured OWN rubric family.
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/audit.ts [target] [options]

Audit Markdown and TOML authoring conventions.

Options:
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
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const unknown = parsed.arguments.filter((argument) => argument.startsWith('-'))
const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
if (unknown.length > 0) {
  process.stderr.write(`error: unknown option: ${unknown[0]}\n`)
  process.exit(2)
}
if (targets.length > 1) {
  process.stderr.write('error: audit accepts at most one target\n')
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const result = runChecker({
  mode: 'audit',
  concern: KI_AUTHORING_RUBRIC.concern,
  target,
  rubric: KI_AUTHORING_RUBRIC,
  subjects: [{ familyCodes: ['MD', 'OWN', 'TOML', 'SYNC'], context: createAuthoringContextFactory({ target }) }],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
