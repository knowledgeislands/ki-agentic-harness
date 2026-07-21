#!/usr/bin/env bun
/** The single governed entrypoint for ki-housekeeping. */

import { resolve } from 'node:path'
import { createHousekeepingContext, resolveMemoryDir } from './rubric/contexts/housekeeping.ts'
import { KI_HOUSEKEEPING_FAMILY_CODES, KI_HOUSEKEEPING_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, type GovernedCheckOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

type HousekeepingOptions = GovernedCheckOptions & { memoryDir?: string }

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern Claude Code memory housekeeping through one standard entrypoint.
`

const checker = defineStructuredGovernedChecker({
  concern: KI_HOUSEKEEPING_RUBRIC.concern,
  rubric: KI_HOUSEKEEPING_RUBRIC,
  familyCodes: KI_HOUSEKEEPING_FAMILY_CODES,
  context: (_mode, options: HousekeepingOptions) => {
    const memoryDir = resolve(options.memoryDir ?? resolveMemoryDir(options.target))
    return () => createHousekeepingContext({ repoRoot: options.target, memoryDir, dryRun: options.dryRun })
  }
})

export const plan = checker.plan
export const check = checker.check

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): HousekeepingOptions => {
  const memoryAt = arguments_.indexOf('--memory-dir')
  const memoryDir = memoryAt === -1 ? undefined : arguments_[memoryAt + 1]
  const allowed = mode === 'conform' ? ['--memory-dir', '--dry-run'] : ['--memory-dir']
  const remaining = arguments_.filter(
    (argument, index) => argument !== '--memory-dir' && index !== memoryAt + 1 && argument !== '--dry-run'
  )
  const unknown = remaining.find((argument) => argument.startsWith('-') && !allowed.includes(argument))
  if (unknown || (memoryAt !== -1 && !memoryDir)) throw new Error(unknown ? `unknown option: ${unknown}` : '--memory-dir requires a value')
  if (remaining.length > 1) throw new Error(`${mode} accepts at most one repository path`)
  return {
    target: resolve(remaining[0] ?? '.'),
    dryRun: mode === 'conform' && arguments_.includes('--dry-run'),
    ...(memoryDir ? { memoryDir: resolve(memoryDir) } : {})
  }
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage,
      auditUsage: 'Usage: bun scripts/govern.ts audit [repo-path] [--memory-dir <dir>] [options]\n',
      conformUsage: 'Usage: bun scripts/govern.ts conform [repo-path] [--memory-dir <dir>] [--dry-run] [options]\n',
      checker,
      options,
      educate: (arguments_) => runSkillEducator({ skill: 'ki-housekeeping', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
