#!/usr/bin/env bun
/** The single governed entrypoint for ki-kb-live-artifacts. */

import { resolve } from 'node:path'
import { createLiveArtifactsContext } from './rubric/contexts/live-artifacts.ts'
import { KI_KB_LIVE_ARTIFACTS_FAMILY_CODES, KI_KB_LIVE_ARTIFACTS_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, type GovernedCheckOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

type Options = GovernedCheckOptions & { thresholdHours?: number }

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): Options => {
  const at = arguments_.findIndex((argument) => argument === '--threshold-hours' || argument.startsWith('--threshold-hours='))
  const raw =
    at === -1
      ? undefined
      : arguments_[at]?.startsWith('--threshold-hours=')
        ? arguments_[at]?.slice('--threshold-hours='.length)
        : arguments_[at + 1]
  const thresholdHours = raw === undefined ? undefined : Number(raw)
  if (mode === 'conform' && at !== -1) throw new Error('unknown option: --threshold-hours')
  if (raw !== undefined && (!Number.isFinite(thresholdHours) || (thresholdHours as number) < 0))
    throw new Error('--threshold-hours requires a non-negative number')
  const allowed = new Set([
    '--threshold-hours',
    ...(raw ? [raw, `--threshold-hours=${raw}`] : []),
    ...(mode === 'conform' ? ['--dry-run'] : [])
  ])
  const targets = arguments_.filter((argument) => !argument.startsWith('-') && !allowed.has(argument))
  const unknown = arguments_.find((argument) => argument.startsWith('-') && !allowed.has(argument))
  if (unknown) throw new Error(`unknown option: ${unknown}`)
  if (targets.length > 1) throw new Error(`${mode} accepts at most one target`)
  return { target: resolve(targets[0] ?? '.'), dryRun: mode === 'conform' && arguments_.includes('--dry-run'), thresholdHours }
}

const checker = defineStructuredGovernedChecker({
  concern: KI_KB_LIVE_ARTIFACTS_RUBRIC.concern,
  rubric: KI_KB_LIVE_ARTIFACTS_RUBRIC,
  familyCodes: KI_KB_LIVE_ARTIFACTS_FAMILY_CODES,
  context: (_mode, options) => () => createLiveArtifactsContext(options)
})

export const plan = checker.plan
export const check = checker.check

export const main = (argv: readonly string[] = process.argv.slice(2)): void =>
  runGovernedCli(
    {
      usage: `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]\n`,
      auditUsage: `Usage: bun scripts/govern.ts audit [target] [options]\n`,
      conformUsage: `Usage: bun scripts/govern.ts conform [target] [--dry-run] [options]\n`,
      checker,
      options,
      educate: (arguments_) =>
        runSkillEducator({ skill: 'ki-kb-live-artifacts', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
