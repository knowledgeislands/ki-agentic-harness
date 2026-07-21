#!/usr/bin/env bun
/** The single governed entrypoint for ki-kb-activities. */

import { resolve } from 'node:path'
import { createActivitiesContextFactory } from './rubric/contexts/activities.ts'
import { KI_KB_ACTIVITIES_FAMILY_CODES, KI_KB_ACTIVITIES_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, type GovernedCheckOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

type Options = GovernedCheckOptions & { harness?: string }

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): Options => {
  const at = arguments_.findIndex((argument) => argument === '--harness' || argument.startsWith('--harness='))
  const harness =
    at === -1 ? undefined : arguments_[at]?.startsWith('--harness=') ? arguments_[at]?.slice('--harness='.length) : arguments_[at + 1]
  if (at !== -1 && (!harness || harness.startsWith('-'))) throw new Error('--harness requires a path')
  const allowed = new Set([
    '--harness',
    ...(harness ? [harness, `--harness=${harness}`] : []),
    ...(mode === 'conform' ? ['--dry-run'] : [])
  ])
  const paths = arguments_.filter((argument) => !argument.startsWith('-') && !allowed.has(argument))
  const unknown = arguments_.find((argument) => argument.startsWith('-') && !allowed.has(argument))
  if (unknown) throw new Error(`unknown option: ${unknown}`)
  if (paths.length > 1) throw new Error(`${mode} accepts at most one base path`)
  return {
    target: resolve(paths[0] ?? '.'),
    dryRun: mode === 'conform' && arguments_.includes('--dry-run'),
    harness: harness ? resolve(harness) : undefined
  }
}

const checker = defineStructuredGovernedChecker({
  concern: KI_KB_ACTIVITIES_RUBRIC.concern,
  rubric: KI_KB_ACTIVITIES_RUBRIC,
  familyCodes: KI_KB_ACTIVITIES_FAMILY_CODES,
  context: (_mode, options) => createActivitiesContextFactory(options)
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
      educate: (arguments_) => runSkillEducator({ skill: 'ki-kb-activities', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
