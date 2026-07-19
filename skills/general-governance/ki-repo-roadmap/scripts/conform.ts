#!/usr/bin/env bun
/** Safe-write CONFORM entry point for the structured repository-roadmap rubric. */
import { resolve } from 'node:path'
import { createRoadmapContextFactory } from './rubric/contexts/roadmap.ts'
import { KI_REPO_ROADMAP_FAMILY_CODES, KI_REPO_ROADMAP_RUBRIC } from './rubric/items/index.ts'
import { runChecker } from './vendored/ki-skills/checker.ts'
import { parseReporterArguments, renderCheckerResult } from './vendored/ki-skills/reporter.ts'

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write('Usage: bun scripts/conform.ts [repo] [--dry-run] [--reporter=jsonl|terminal] [--reporter-levels=all]\n')
  process.exit(0)
}
try {
  const parsed = parseReporterArguments(argv)
  const unknown = parsed.arguments.filter((argument) => argument.startsWith('-') && argument !== '--dry-run')
  const targets = parsed.arguments.filter((argument) => !argument.startsWith('-'))
  if (unknown.length || targets.length > 1) throw new Error(unknown.length ? `unknown option: ${unknown[0]}` : 'conform accepts at most one target')
  const target = resolve(targets[0] ?? '.')
  const result = runChecker({ mode: 'conform', concern: KI_REPO_ROADMAP_RUBRIC.concern, target, rubric: KI_REPO_ROADMAP_RUBRIC, subjects: [{ familyCodes: KI_REPO_ROADMAP_FAMILY_CODES, context: createRoadmapContextFactory({ target, dryRun: parsed.arguments.includes('--dry-run') }) }] })
  process.stdout.write(renderCheckerResult(result, { ...parsed.options, colour: Boolean(process.stdout.isTTY && !process.env.NO_COLOR) }))
  process.exit(result.exitCode)
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(2)
}
