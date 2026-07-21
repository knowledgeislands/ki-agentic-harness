#!/usr/bin/env bun
/** The single governed entrypoint for ki-repo. */

import { resolve } from 'node:path'
import { createAuditContext, createConformContext, type RepoRubricContext } from './rubric/contexts/contexts.ts'
import { KI_REPO_FAMILY_CODES, KI_REPO_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import type { CheckerInput } from './vendored/ki-skills/checker.ts'
import {
  type CheckerExecutionOptions,
  type CheckerPlan,
  type CheckerResult,
  planChecker,
  runChecker
} from './vendored/ki-skills/checker.ts'
import { runGovernedCli } from './vendored/ki-skills/govern.ts'
import { parseCheckerArguments } from './vendored/ki-skills/reporter.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

type RepoOptions = CheckerExecutionOptions & { arguments_: readonly string[] }
type ConformContextFactory = (arguments_: readonly string[]) => { target: string; context: RepoRubricContext }

const usage = `Usage: bun scripts/govern.ts <audit|conform|educate|help> [options]

Govern repositories through one standard entrypoint.
`

const conformInput = (
  prepared: ReturnType<ConformContextFactory>,
  statusTracker?: RepoOptions['statusTracker']
): CheckerInput<RepoRubricContext> => ({
  mode: 'conform',
  concern: KI_REPO_RUBRIC.concern,
  target: prepared.target,
  rubric: KI_REPO_RUBRIC,
  subjects: [{ familyCodes: KI_REPO_FAMILY_CODES, context: () => prepared.context }],
  statusTracker
})

const validateConformContext = (
  arguments_: readonly string[],
  rubric: RubricDefinition<RepoRubricContext> = KI_REPO_RUBRIC,
  contextFactory: ConformContextFactory = createConformContext
): ReturnType<ConformContextFactory> => {
  const preflightContext: RepoRubricContext = {
    mode: 'conform',
    outcomes: () => [{ status: 'NOT_APPLICABLE', message: 'non-mutating checker-plan preflight' }]
  }
  planChecker({
    mode: 'conform',
    concern: rubric.concern,
    target: 'ki-repo:conform-preflight',
    rubric,
    subjects: [{ familyCodes: rubric.families.map((family) => family.code), context: () => preflightContext }]
  })
  return contextFactory(arguments_)
}

const auditInput = (options: RepoOptions): CheckerInput<RepoRubricContext> => {
  const prepared = createAuditContext(options.arguments_)
  if (prepared.educate !== undefined) throw new Error('use `govern educate` instead of `audit --educate`')
  return {
    mode: 'audit',
    concern: KI_REPO_RUBRIC.concern,
    target: prepared.target,
    rubric: KI_REPO_RUBRIC,
    subjects: [{ familyCodes: KI_REPO_FAMILY_CODES, context: () => prepared.context }],
    statusTracker: options.statusTracker
  }
}

export const plan = (mode: 'audit' | 'conform', options: RepoOptions): CheckerPlan => {
  if (mode === 'audit') return planChecker(auditInput(options))
  const preflightContext: RepoRubricContext = {
    mode: 'conform',
    outcomes: () => [{ status: 'NOT_APPLICABLE', message: 'non-mutating checker-plan preflight' }]
  }
  return planChecker({
    mode: 'conform',
    concern: KI_REPO_RUBRIC.concern,
    target: options.target,
    rubric: KI_REPO_RUBRIC,
    subjects: [{ familyCodes: KI_REPO_FAMILY_CODES, context: () => preflightContext }]
  })
}

export const check = (mode: 'audit' | 'conform', options: RepoOptions): CheckerResult => {
  if (mode === 'audit') return runChecker(auditInput(options))
  return runChecker(conformInput(validateConformContext(options.arguments_), options.statusTracker))
}

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): RepoOptions => {
  const valueAt = arguments_.indexOf('--org')
  const org = valueAt < 0 ? undefined : arguments_[valueAt + 1]
  const allowed = mode === 'audit' ? ['--org', '--educate'] : ['--dry-run', '--scaffold-config-only']
  if (valueAt >= 0 && (!org || org.startsWith('-'))) throw new Error('--org requires a value')
  const paths = arguments_.filter((argument, index) => !argument.startsWith('-') && !(valueAt >= 0 && index === valueAt + 1))
  const unknown = arguments_.find(
    (argument, index) => argument.startsWith('-') && !allowed.includes(argument) && !(valueAt >= 0 && index === valueAt + 1)
  )
  if (unknown) throw new Error(`unknown option: ${unknown}`)
  if (mode === 'conform' && paths.length > 1) throw new Error('conform accepts at most one target')
  return {
    target: resolve(paths[0] ?? '.'),
    dryRun: mode === 'conform' && arguments_.includes('--dry-run'),
    arguments_
  }
}

export const main = (argv: readonly string[] = process.argv.slice(2)): void => {
  const [command, ...arguments_] = argv
  if (command === 'audit' && arguments_.includes('--educate')) {
    try {
      const parsed = parseCheckerArguments(arguments_)
      const prepared = createAuditContext(parsed.arguments)
      if (prepared.educate === undefined) throw new Error('audit --educate did not produce a template')
      process.stdout.write(prepared.educate)
    } catch (error) {
      process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`)
      process.exitCode = 2
    }
    return
  }
  runGovernedCli(
    {
      usage,
      auditUsage: 'Usage: bun scripts/govern.ts audit [tree-path] [--org <org>] [options]\n',
      conformUsage: 'Usage: bun scripts/govern.ts conform [repo-path] [--dry-run] [--scaffold-config-only] [options]\n',
      checker: { check },
      options,
      educate: (arguments_) => runSkillEducator({ skill: 'ki-repo', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )
}

if (import.meta.main) main()
