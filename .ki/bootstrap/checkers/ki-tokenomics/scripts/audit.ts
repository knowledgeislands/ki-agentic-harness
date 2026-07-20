#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-tokenomics rubric. */
import { resolve } from 'node:path'
import { createTokenomicsContext } from './rubric/contexts/tokenomics.ts'
import { KI_TOKENOMICS_FAMILY_CODES, KI_TOKENOMICS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/audit.ts [target] [--no-user] [--user <dir>] [--educate] [--reporter jsonl|terminal]\n')
  process.exit(0)
}
if (argv.includes('--educate')) {
  const result = Bun.spawnSync(['bun', `${import.meta.dir}/rubric/contexts/audit-engine.ts`, '--educate'])
  process.stdout.write(result.stdout.toString())
  process.exit(result.exitCode)
}
let parsed: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const userAt = parsed.arguments.indexOf('--user')
const userDir = userAt < 0 ? undefined : parsed.arguments[userAt + 1]
const noUser = parsed.arguments.includes('--no-user')
const targets = parsed.arguments.filter((argument, index) => !argument.startsWith('-') && !(userAt >= 0 && index === userAt + 1))
if ((userAt >= 0 && !userDir) || targets.length > 1) {
  process.stderr.write('error: --user requires a value and audit accepts at most one target\n')
  process.exit(2)
}
const target = resolve(targets[0] ?? '.')
const result = runChecker({
  mode: 'audit',
  concern: KI_TOKENOMICS_RUBRIC.concern,
  target,
  rubric: KI_TOKENOMICS_RUBRIC,
  subjects: [
    {
      familyCodes: KI_TOKENOMICS_FAMILY_CODES,
      context: () => createTokenomicsContext({ target, noUser, userDir, dryRun: true, mode: 'audit' })
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
