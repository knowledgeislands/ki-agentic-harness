#!/usr/bin/env bun
/** The single governed entrypoint for ki-repo-roadmap. */

import { createRoadmapContextFactory } from './rubric/contexts/roadmap.ts'
import { KI_REPO_ROADMAP_FAMILY_CODES, KI_REPO_ROADMAP_RUBRIC } from './rubric/items/index.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern repository roadmaps through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_REPO_ROADMAP_RUBRIC.concern,
  rubric: KI_REPO_ROADMAP_RUBRIC,
  familyCodes: KI_REPO_ROADMAP_FAMILY_CODES,
  context: (_mode, options) => createRoadmapContextFactory({ target: options.target, dryRun: options.dryRun })
})

export const plan = checker.plan
export const check = checker.check

const educate = (arguments_: readonly string[]): void => {
  const result = Bun.spawnSync(['bun', `${import.meta.dir}/educate.ts`, ...arguments_])
  process.stdout.write(result.stdout.toString())
  process.stderr.write(result.stderr.toString())
  if (result.exitCode !== 0) process.exitCode = result.exitCode
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage,
      auditUsage: 'Usage: bun scripts/govern.ts audit [repo] [options]\n',
      conformUsage: 'Usage: bun scripts/govern.ts conform [repo] [--dry-run] [options]\n',
      checker,
      options: parseSingleTargetOptions,
      educate
    },
    argv
  )

if (import.meta.main) main()
