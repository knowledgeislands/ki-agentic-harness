#!/usr/bin/env bun
/** The single governed entrypoint for ki-binding. */

import { resolve } from 'node:path'
import { createBindingContext } from './rubric/contexts/binding.ts'
import { KI_BINDING_FAMILY_CODES, KI_BINDING_RUBRIC } from './rubric/items/index.ts'
import { runSkillEducator } from './vendored/ki-bootstrap/educator.ts'
import { defineStructuredGovernedChecker, type GovernedCheckOptions, runGovernedCli } from './vendored/ki-skills/govern.ts'

type Options = GovernedCheckOptions & {
  project?: string
  source?: string
  repo?: string
  marketplace?: string
  plugin?: string
}

export const options = (mode: 'audit' | 'conform', arguments_: readonly string[]): Options => {
  const values = (names: readonly string[]): Record<string, string | undefined> => {
    const result: Record<string, string | undefined> = {}
    for (let index = 0; index < arguments_.length; index++) {
      const argument = arguments_[index] as string
      if (!names.includes(argument)) continue
      const value = arguments_[index + 1]
      if (!value || value.startsWith('-')) throw new Error(`${argument} requires a value`)
      result[argument] = value
    }
    return result
  }
  const names = mode === 'audit' ? ['--source'] : ['--repo', '--marketplace', '--plugin']
  const valuesByName = values(names)
  const allowed = new Set([...names, ...Object.values(valuesByName).filter(Boolean), ...(mode === 'conform' ? ['--dry-run'] : [])])
  const paths = arguments_.filter((argument) => !argument.startsWith('-') && !allowed.has(argument))
  const unknown = arguments_.find((argument) => argument.startsWith('-') && !allowed.has(argument))
  if (unknown) throw new Error(`unknown option: ${unknown}`)
  if (paths.length > 1) throw new Error(`${mode} accepts at most one project path`)
  const project = paths[0] ? resolve(paths[0]) : undefined
  const source = valuesByName['--source']
  return {
    target: project ?? resolve(source ?? '.'),
    dryRun: mode === 'conform' && arguments_.includes('--dry-run'),
    project,
    source,
    repo: valuesByName['--repo'],
    marketplace: valuesByName['--marketplace'],
    plugin: valuesByName['--plugin']
  }
}

const checker = defineStructuredGovernedChecker<any, Options>({
  concern: KI_BINDING_RUBRIC.concern,
  rubric: KI_BINDING_RUBRIC,
  familyCodes: KI_BINDING_FAMILY_CODES,
  context: (mode, options) => () =>
    createBindingContext({
      project: options.project,
      sourceOverride: options.source,
      dryRun: options.dryRun,
      ...(mode === 'conform' ? { repo: options.repo, marketplace: options.marketplace, plugin: options.plugin } : {})
    })
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
      educate: (arguments_) => runSkillEducator({ skill: 'ki-binding', source: resolve(import.meta.dirname, '..'), argv: arguments_ })
    },
    argv
  )

if (import.meta.main) main()
