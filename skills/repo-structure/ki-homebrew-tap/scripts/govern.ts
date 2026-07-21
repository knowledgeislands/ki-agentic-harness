#!/usr/bin/env bun
/** The single governed entrypoint for ki-homebrew-tap. */

import { resolve } from 'node:path'
import { createHomebrewTapContext } from './rubric/contexts/homebrew-tap.ts'
import { KI_HOMEBREW_TAP_FAMILY_CODES, KI_HOMEBREW_TAP_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern ki-homebrew-tap through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_HOMEBREW_TAP_RUBRIC.concern,
  rubric: KI_HOMEBREW_TAP_RUBRIC,
  familyCodes: (_mode, options) => {
    const context = createHomebrewTapContext({ target: options.target, dryRun: options.dryRun })
    return context.applicable ? KI_HOMEBREW_TAP_FAMILY_CODES : ['CONFIG']
  },
  context: (_mode, options) => () => createHomebrewTapContext({ target: options.target, dryRun: options.dryRun })
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
      educate: (arguments_) => runSkillEducator({ skill: 'ki-homebrew-tap', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
