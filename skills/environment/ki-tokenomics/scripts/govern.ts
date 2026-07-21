#!/usr/bin/env bun
/** The single governed entrypoint for ki-tokenomics. */

import { resolve } from 'node:path'
import { createTokenomicsContext } from './rubric/contexts/tokenomics.ts'
import { KI_TOKENOMICS_FAMILY_CODES, KI_TOKENOMICS_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, type GovernedCheckOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

type TokenomicsOptions = GovernedCheckOptions & { noUser: boolean; userDir?: string }

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern tokenomics through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_TOKENOMICS_RUBRIC.concern,
  rubric: KI_TOKENOMICS_RUBRIC,
  familyCodes: KI_TOKENOMICS_FAMILY_CODES,
  context: (mode, options: TokenomicsOptions) => () =>
    createTokenomicsContext({
      target: options.target,
      noUser: options.noUser,
      userDir: options.userDir,
      dryRun: mode === 'audit' || options.dryRun,
      mode
    })
})

export const plan = checker.plan
export const check = checker.check

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): TokenomicsOptions => {
  const userAt = arguments_.indexOf('--user')
  const userDir = userAt < 0 ? undefined : arguments_[userAt + 1]
  const allowed = mode === 'conform' ? ['--user', '--no-user', '--dry-run'] : ['--user', '--no-user']
  const remaining = arguments_.filter(
    (argument, index) => argument !== '--user' && index !== userAt + 1 && argument !== '--no-user' && argument !== '--dry-run'
  )
  const unknown = remaining.find((argument) => argument.startsWith('-') && !allowed.includes(argument))
  if (unknown || (userAt >= 0 && !userDir)) throw new Error(unknown ? `unknown option: ${unknown}` : '--user requires a value')
  if (remaining.length > 1) throw new Error(`${mode} accepts at most one target`)
  return {
    target: resolve(remaining[0] ?? '.'),
    dryRun: mode === 'conform' && arguments_.includes('--dry-run'),
    noUser: arguments_.includes('--no-user'),
    ...(userDir ? { userDir } : {})
  }
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage,
      auditUsage: 'Usage: bun scripts/govern.ts audit [target] [--no-user] [--user <dir>] [options]\n',
      conformUsage: 'Usage: bun scripts/govern.ts conform [target] [--no-user] [--user <dir>] [--dry-run] [options]\n',
      checker,
      options,
      educate: (arguments_) => runSkillEducator({ skill: 'ki-tokenomics', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
