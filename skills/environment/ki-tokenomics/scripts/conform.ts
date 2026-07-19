#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured ki-tokenomics rubric. */
import { resolve } from 'node:path'
import { createTokenomicsContext } from './rubric/contexts/tokenomics.ts'
import { KI_TOKENOMICS_FAMILY_CODES, KI_TOKENOMICS_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'
const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) { process.stdout.write('Usage: bun scripts/conform.ts [target] [--no-user] [--user <dir>] [--dry-run] [--reporter jsonl|terminal]\n'); process.exit(0) }
let parsed: ReturnType<typeof parseReporterArguments>
try { parsed = parseReporterArguments(argv) } catch (error) { process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`); process.exit(2) }
const userAt = parsed.arguments.indexOf('--user'); const userDir = userAt < 0 ? undefined : parsed.arguments[userAt + 1]; const noUser = parsed.arguments.includes('--no-user'); const dryRun = parsed.arguments.includes('--dry-run'); const targets = parsed.arguments.filter((argument, index) => !argument.startsWith('-') && !(userAt >= 0 && index === userAt + 1))
if ((userAt >= 0 && !userDir) || targets.length > 1) { process.stderr.write('error: --user requires a value and conform accepts at most one target\n'); process.exit(2) }
const target = resolve(targets[0] ?? '.')
const result = runChecker({ mode: 'conform', concern: KI_TOKENOMICS_RUBRIC.concern, target, rubric: KI_TOKENOMICS_RUBRIC, subjects: [{ familyCodes: KI_TOKENOMICS_FAMILY_CODES, context: () => createTokenomicsContext({ target, noUser, userDir, dryRun, mode: 'conform' }) }] })
process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
process.exit(result.exitCode)
