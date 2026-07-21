#!/usr/bin/env bun
/** The single governed entrypoint for ki-handoffs. */

import { resolve } from 'node:path'
import { createHandoffsContext } from './rubric/contexts/handoffs.ts'
import { KI_HANDOFFS_FAMILY_CODES, KI_HANDOFFS_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern handoff readiness through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_HANDOFFS_RUBRIC.concern,
  rubric: KI_HANDOFFS_RUBRIC,
  familyCodes: KI_HANDOFFS_FAMILY_CODES,
  context: (_mode, options) => () => createHandoffsContext(options.target, options.dryRun)
})

export const plan = checker.plan
export const check = checker.check

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage,
      auditUsage: 'Usage: bun scripts/govern.ts audit [target] [options]\n',
      conformUsage: 'Usage: bun scripts/govern.ts conform [target] [--dry-run] [options]\n',
      checker,
      options: parseSingleTargetOptions,
      educate: (arguments_) => runSkillEducator({ skill: 'ki-handoffs', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
