#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-dotfiles-chezmoi rubric. */
import { resolve } from 'node:path'
import { createChezmoiContextFactory } from './rubric/contexts/chezmoi.ts'
import { KI_DOTFILES_CHEZMOI_FAMILY_CODES, KI_DOTFILES_CHEZMOI_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/conform.ts [repo-path] [--dry-run] [--reporter jsonl|terminal] [--reporter-levels levels]\n')
  process.exit(0)
}

let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
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
  concern: KI_DOTFILES_CHEZMOI_RUBRIC.concern,
  target,
  rubric: KI_DOTFILES_CHEZMOI_RUBRIC,
  subjects: [
    {
      familyCodes: KI_DOTFILES_CHEZMOI_FAMILY_CODES,
      context: createChezmoiContextFactory({ target, dryRun: parsed.arguments.includes('--dry-run') })
    }
  ],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
