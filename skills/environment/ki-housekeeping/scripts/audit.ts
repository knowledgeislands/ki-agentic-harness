#!/usr/bin/env bun
/** Read-only AUDIT entry point for the structured ki-housekeeping rubric. */

import { resolve } from 'node:path'
import { createHousekeepingContext, resolveMemoryDir } from './rubric/contexts/housekeeping.ts'
import { KI_HOUSEKEEPING_FAMILY_CODES, KI_HOUSEKEEPING_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/audit.ts [repo-path] [options]\n\nAudit the Claude Code auto-memory area for a repository.\n\nOptions:\n  --memory-dir <dir>           Audit an explicit memory directory.\n  --reporter <reporter>        Output reporter: jsonl (default) or terminal.\n  --reporter-levels <levels>   Terminal levels: comma-separated values or all.\n  -h, --help                   Show this help and exit.\n`)
  process.exit(0)
}
let parsed!: ReturnType<typeof parseReporterArguments>
try { parsed = parseReporterArguments(argv) } catch (error) { process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`); process.exit(2) }
const memoryAt = parsed.arguments.indexOf('--memory-dir')
const memoryDir = memoryAt === -1 ? undefined : parsed.arguments[memoryAt + 1]
const remaining = parsed.arguments.filter((argument, index) => argument !== '--memory-dir' && index !== memoryAt + 1)
const unknown = remaining.find((argument) => argument.startsWith('-'))
if (unknown || (memoryAt !== -1 && !memoryDir)) { process.stderr.write(`error: ${unknown ? `unknown option: ${unknown}` : '--memory-dir requires a value'}\n`); process.exit(2) }
if (remaining.length > 1) { process.stderr.write('error: audit accepts at most one repository path\n'); process.exit(2) }
const repoRoot = resolve(remaining[0] ?? '.')
const targetMemory = resolve(memoryDir ?? resolveMemoryDir(repoRoot))
const result = runChecker({ mode: 'audit', concern: KI_HOUSEKEEPING_RUBRIC.concern, target: targetMemory, rubric: KI_HOUSEKEEPING_RUBRIC, subjects: [{ familyCodes: KI_HOUSEKEEPING_FAMILY_CODES, context: () => createHousekeepingContext({ repoRoot, memoryDir: targetMemory, dryRun: true }) }] })
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
