#!/usr/bin/env bun
/** The single governed entrypoint for ki-feature-definitions. */

import { resolve } from 'node:path'
import { createFeatureDefinitionsContextFactory } from './rubric/contexts/feature-definitions.ts'
import { FEATURE_DEFINITIONS_FAMILY_CODES, KI_FEATURE_DEFINITIONS_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern ki-feature-definitions through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_FEATURE_DEFINITIONS_RUBRIC.concern,
  rubric: KI_FEATURE_DEFINITIONS_RUBRIC,
  familyCodes: FEATURE_DEFINITIONS_FAMILY_CODES,
  context: (_mode, options) => createFeatureDefinitionsContextFactory({ target: options.target, dryRun: options.dryRun })
})

export const plan = checker.plan
export const check = checker.check

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage,
      auditUsage: `Usage: bun scripts/govern.ts audit [target] [options]\n`,
      conformUsage: `Usage: bun scripts/govern.ts conform [target] [--dry-run] [options]\n`,
      checker,
      options: parseSingleTargetOptions,
      educate: (arguments_) =>
        runSkillEducator({ skill: 'ki-feature-definitions', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
