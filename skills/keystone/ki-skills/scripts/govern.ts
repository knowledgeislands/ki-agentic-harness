#!/usr/bin/env bun
/** The single governed entrypoint for ki-skills. */

import { resolve } from 'node:path'
import type { KiSkillsRubricContext } from './rubric/contexts/contexts.ts'
import { createKiSkillsSubjects, KI_SKILLS_SUBJECT_FAMILIES } from './rubric/contexts/subjects.ts'
import { KI_SKILLS_RUBRIC } from './rubric/items/index.ts'
import type { CheckerEvaluationSubject, CheckerExecutionOptions, CheckerPlan, CheckerResult } from './shared/checker.ts'
import { defineGovernedChecker, runGovernedCli } from './shared/govern.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'

export type GovernCheckMode = 'audit' | 'conform'

export type GovernCheckOptions = CheckerExecutionOptions & {
  roots?: readonly string[]
  footprint?: boolean
  refreshStatus?: boolean
}

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern Agent Skills through one standard entrypoint.

Commands:
  audit [target ...]      Run read-only mechanical checks.
  conform [target]        Apply safe mechanical fixes.
  educate [target]        Refresh ki-skills' local governed payload.
  help                    Show this help.
`

const auditUsage = `Usage: bun scripts/govern.ts audit [target ...] [options]

Audit Agent Skills against the mechanical aspects of the ki-skills rubric.

Options:
  --footprint                  Include optional token-footprint measurements.
  --refresh-status             Report source-refresh status.
  --progress <mode>            Progress: auto (default), always, or never.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`

const conformUsage = `Usage: bun scripts/govern.ts conform [target] [options]

Apply safe mechanical fixes from the ki-skills rubric.

Options:
  --dry-run                    Report changes without writing them.
  --progress <mode>            Progress: auto (default), always, or never.
  --reporter <reporter>        Output reporter: jsonl (default) or terminal.
  --reporter-levels <levels>   Terminal levels: comma-separated values or all.
  -h, --help                   Show this help and exit.
`

const auditInput = ({ roots, target, footprint = false, refreshStatus = false, statusTracker }: GovernCheckOptions) => {
  const scope = createKiSkillsSubjects({
    mode: 'audit',
    roots: roots ?? [target],
    reportTarget: resolve(target),
    footprint,
    refreshStatus
  })
  const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
    familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
    context,
    ...(subject ? { subject } : {})
  }))
  return {
    mode: 'audit' as const,
    concern: 'skills',
    target: resolve(target),
    rubric: KI_SKILLS_RUBRIC,
    subjects,
    statusTracker
  }
}

const conformInput = ({ target, dryRun, statusTracker }: GovernCheckOptions) => {
  const reportTarget = resolve(target)
  const scope = createKiSkillsSubjects({
    mode: 'conform',
    roots: [target],
    reportTarget,
    dryRun
  })
  const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
    familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
    context,
    ...(subject ? { subject } : {})
  }))
  return {
    input: {
      mode: 'conform' as const,
      concern: 'skills',
      target: reportTarget,
      rubric: KI_SKILLS_RUBRIC,
      subjects,
      statusTracker
    },
    persist: scope.persist
  }
}

const governed = defineGovernedChecker<GovernCheckOptions>({
  audit: auditInput,
  conform: conformInput
})

/** Build the no-side-effect work count used by direct and aggregate progress renderers. */
export const plan = (mode: GovernCheckMode, options: GovernCheckOptions): CheckerPlan => governed.plan(mode, options)

/** Execute the structured checker for direct use or an in-process aggregate call. */
export const check = (mode: GovernCheckMode, options: GovernCheckOptions): CheckerResult => governed.check(mode, options)

const options = (mode: GovernCheckMode, arguments_: readonly string[]): GovernCheckOptions => {
  const allowed = mode === 'audit' ? ['--footprint', '--refresh-status'] : ['--dry-run']
  const unknownOptions = arguments_.filter((argument) => argument.startsWith('-') && !allowed.includes(argument))
  if (unknownOptions.length > 0) throw new Error(`unknown option: ${unknownOptions[0]}`)
  const targets = arguments_.filter((argument) => !argument.startsWith('-'))
  if (mode === 'audit')
    return {
      target: resolve('.'),
      roots: targets,
      dryRun: false,
      footprint: arguments_.includes('--footprint'),
      refreshStatus: arguments_.includes('--refresh-status')
    }
  if (targets.length > 1) throw new Error('conform accepts at most one target')
  return { target: targets[0] ?? '.', dryRun: arguments_.includes('--dry-run') }
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void => {
  runGovernedCli(
    {
      usage,
      auditUsage,
      conformUsage,
      checker: governed,
      options,
      educate: (arguments_) => runSkillEducator({ skill: 'ki-skills', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )
}

if (import.meta.main) main()
