#!/usr/bin/env bun
/** The single governed entrypoint for ki-mcp. */

import { resolve } from 'node:path'
import { createMcpContext } from './rubric/contexts/mcp.ts'
import { KI_MCP_FAMILY_CODES, KI_MCP_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, parseSingleTargetOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern ki-mcp through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_MCP_RUBRIC.concern,
  rubric: KI_MCP_RUBRIC,
  familyCodes: (_mode, options) => {
    const context = createMcpContext(options.target, options.dryRun)
    return context.applicable || !context.rootExists ? KI_MCP_FAMILY_CODES : ['KI']
  },
  context: (_mode, options) => () => createMcpContext(options.target, options.dryRun)
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
      educate: (arguments_) => runSkillEducator({ skill: 'ki-mcp', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
