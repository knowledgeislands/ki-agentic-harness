#!/usr/bin/env bun
/** The single governed entrypoint for ki-website-cloudflare. */

import { resolve } from 'node:path'
import { createWebsiteCloudflareContext } from './rubric/contexts/website-cloudflare.ts'
import { KI_WEBSITE_CLOUDFLARE_FAMILY_CODES, KI_WEBSITE_CLOUDFLARE_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern ki-website-cloudflare through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_WEBSITE_CLOUDFLARE_RUBRIC.concern,
  rubric: KI_WEBSITE_CLOUDFLARE_RUBRIC,
  familyCodes: KI_WEBSITE_CLOUDFLARE_FAMILY_CODES,
  context: (_mode, options) => () => createWebsiteCloudflareContext(options.target)
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
        runSkillEducator({ skill: 'ki-website-cloudflare', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
