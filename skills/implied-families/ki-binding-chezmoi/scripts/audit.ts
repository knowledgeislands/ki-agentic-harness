#!/usr/bin/env bun
import { resolve } from 'node:path'
import { createBindingChezMoiContext } from './rubric/contexts/binding-chezmoi.ts'
import { KI_BINDING_CHEZMOI_FAMILY_CODES, KI_BINDING_CHEZMOI_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/audit.ts [chezmoi-repo] [--reporter jsonl|terminal]\n')
  process.exit(0)
}
let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${String(error)}\n`)
  process.exit(2)
}
const paths = parsed.arguments.filter((arg) => !arg.startsWith('-'))
if (paths.length > 1 || parsed.arguments.some((arg) => arg.startsWith('-'))) {
  process.stderr.write('error: audit accepts at most one chezmoi repository path\n')
  process.exit(2)
}
const repo = paths[0] ? resolve(paths[0]) : undefined
const result = runChecker({
  mode: 'audit',
  concern: KI_BINDING_CHEZMOI_RUBRIC.concern,
  target: repo ?? resolve('.'),
  rubric: KI_BINDING_CHEZMOI_RUBRIC,
  subjects: [{ familyCodes: KI_BINDING_CHEZMOI_FAMILY_CODES, context: () => createBindingChezMoiContext(repo) }],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
