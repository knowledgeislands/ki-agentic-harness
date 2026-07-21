#!/usr/bin/env bun

/** The single governed entrypoint for ki-bootstrap. */

import { educateRepository } from './internal/repo-bootstrap/repo-bootstrap.ts'
import { createBootstrapContextFactory } from './rubric/contexts/bootstrap.ts'
import { KI_BOOTSTRAP_RUBRIC } from './rubric/items/index.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern repository bootstrap through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_BOOTSTRAP_RUBRIC.concern,
  rubric: KI_BOOTSTRAP_RUBRIC,
  familyCodes: ['BOOT'],
  context: (_mode, options) => createBootstrapContextFactory({ target: options.target, dryRun: options.dryRun })
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
      educate: (arguments_) => educateRepository([...arguments_])
    },
    argv
  )

if (import.meta.main) main()
