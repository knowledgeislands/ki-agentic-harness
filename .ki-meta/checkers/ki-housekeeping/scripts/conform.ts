#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-housekeeping rubric. */

import { resolve } from 'node:path'
import { createHousekeepingContext, resolveMemoryDir } from './rubric/contexts/housekeeping.ts'
import { KI_HOUSEKEEPING_FAMILY_CODES, KI_HOUSEKEEPING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { createTerminalStatusTracker, parseCheckerArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(
    `Usage: bun scripts/conform.ts [repo-path] [options]\n\nSafely align existing memory names and append unindexed memories.\n\nOptions:\n  --memory-dir <dir>           Conform an explicit memory directory.\n  --dry-run                    Report changes without writing them.\n  --reporter <reporter>        Output reporter: jsonl (default) or terminal.\n  --reporter-levels <levels>   Terminal levels: comma-separated values or all.\n  -h, --help                   Show this help and exit.\n`
  )
  process.exit(0)
}
let parsed!: ReturnType<typeof parseCheckerArguments>
try {
  parsed = parseCheckerArguments(argv)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
const memoryAt = parsed.arguments.indexOf('--memory-dir')
const memoryDir = memoryAt === -1 ? undefined : parsed.arguments[memoryAt + 1]
const dryRun = parsed.arguments.includes('--dry-run')
const remaining = parsed.arguments.filter(
  (argument, index) => argument !== '--memory-dir' && index !== memoryAt + 1 && argument !== '--dry-run'
)
const unknown = remaining.find((argument) => argument.startsWith('-'))
if (unknown || (memoryAt !== -1 && !memoryDir)) {
  process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : '--memory-dir requires a value'}\n`)
  process.exit(2)
}
if (remaining.length > 1) {
  process.stderr.write('error: conform accepts at most one repository path\n')
  process.exit(2)
}
const repoRoot = resolve(remaining[0] ?? '.')
const targetMemory = resolve(memoryDir ?? resolveMemoryDir(repoRoot))
const result = runChecker({
  mode: 'conform',
  concern: KI_HOUSEKEEPING_RUBRIC.concern,
  target: targetMemory,
  rubric: KI_HOUSEKEEPING_RUBRIC,
  subjects: [
    { familyCodes: KI_HOUSEKEEPING_FAMILY_CODES, context: () => createHousekeepingContext({ repoRoot, memoryDir: targetMemory, dryRun }) }
  ],
  statusTracker: createTerminalStatusTracker({
    mode: parsed.progress,
    interactive: Boolean(process.stderr.isTTY),
    write: (line) => process.stderr.write(line)
  })
})
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
