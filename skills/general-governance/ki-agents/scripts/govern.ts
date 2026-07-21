#!/usr/bin/env bun
/** The single governed entrypoint for ki-agents. */

import { resolve } from 'node:path'
import { createAgentsContext } from './rubric/contexts/agents.ts'
import { KI_AGENTS_FAMILY_CODES, KI_AGENTS_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, type GovernedCheckOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

type AgentsOptions = GovernedCheckOptions & { roots: readonly string[] }

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern agent definitions through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_AGENTS_RUBRIC.concern,
  rubric: KI_AGENTS_RUBRIC,
  familyCodes: KI_AGENTS_FAMILY_CODES,
  context: (_mode, options: AgentsOptions) => () => createAgentsContext(options.roots, options.dryRun)
})

export const plan = checker.plan
export const check = checker.check

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): AgentsOptions => {
  const allowed = mode === 'conform' ? ['--dry-run'] : []
  const unknown = arguments_.find((argument) => argument.startsWith('-') && !allowed.includes(argument))
  if (unknown) throw new Error(`unknown option: ${unknown}`)
  const roots = arguments_.filter((argument) => !argument.startsWith('-'))
  if (mode === 'conform' && roots.length > 1) throw new Error('conform accepts at most one target')
  const selected = mode === 'audit' ? (roots.length > 0 ? roots : ['.']) : [roots[0] ?? 'agents']
  return { target: resolve(selected[0] as string), roots: selected, dryRun: mode === 'conform' && arguments_.includes('--dry-run') }
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage,
      auditUsage: 'Usage: bun scripts/govern.ts audit [agent-or-directory ...] [options]\n',
      conformUsage: 'Usage: bun scripts/govern.ts conform [agent-or-directory] [--dry-run] [options]\n',
      checker,
      options,
      educate: (arguments_) => runSkillEducator({ skill: 'ki-agents', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
