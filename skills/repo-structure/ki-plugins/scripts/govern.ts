#!/usr/bin/env bun
/** The single governed entrypoint for ki-plugins. */

import { resolve } from 'node:path'
import { createPluginsContextFactory } from './rubric/contexts/plugins.ts'
import { KI_PLUGINS_FAMILY_CODES, KI_PLUGINS_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern ki-plugins through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_PLUGINS_RUBRIC.concern,
  rubric: KI_PLUGINS_RUBRIC,
  familyCodes: KI_PLUGINS_FAMILY_CODES,
  context: (_mode, options) => createPluginsContextFactory({ target: options.target, dryRun: options.dryRun })
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
      educate: (arguments_) => runSkillEducator({ skill: 'ki-plugins', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
