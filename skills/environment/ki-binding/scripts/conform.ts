#!/usr/bin/env bun
/**
 * Conform the Cowork binding by registering and enabling the KI plugin.
 *
 * Every invocation emits canonical checker-reporter JSONL. `--dry-run` is the
 * only non-writing mode; it reports the pending changes without applying them.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type Status = 'already' | 'conformed' | 'would-conform' | 'unreadable'
type Result = { path: string; status: Status }

const argv = process.argv.slice(2)
const flag = (name: string): boolean => argv.includes(name)
const opt = (name: string): string | undefined => {
  const index = argv.indexOf(name)
  return index >= 0 ? argv[index + 1] : undefined
}
const supportedOptions = new Set(['--dry-run', '--repo', '--marketplace', '--plugin'])
const unsupportedOptions = argv.filter((argument) => argument.startsWith('--') && !supportedOptions.has(argument))
const missingValueOption = ['--repo', '--marketplace', '--plugin'].find((option) => {
  const value = opt(option)
  return argv.includes(option) && (!value || value.startsWith('--'))
})
const dryRun = flag('--dry-run')
const repo = opt('--repo') ?? 'knowledgeislands/ki-plugins'
const marketplace = opt('--marketplace') ?? 'ki-plugins'
const plugin = opt('--plugin') ?? 'knowledge-islands'
const pluginKey = `${plugin}@${marketplace}`
const base = join(homedir(), 'Library', 'Application Support', 'Claude', 'local-agent-mode-sessions')
const VALUE_OPTIONS = new Set(['--repo', '--marketplace', '--plugin'])
const positional = argv.find((argument, index) => !argument.startsWith('-') && !VALUE_OPTIONS.has(argv[index - 1] ?? ''))
const target = positional ? resolve(positional) : base
const BIND_REF = 'references/standards.md'
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const RUBRIC = existsSync(join(SCRIPT_DIR, 'references', 'rubric.md'))
  ? join(SCRIPT_DIR, 'references', 'rubric.md')
  : join(SCRIPT_DIR, '..', 'references', 'rubric.md')

const findings: CheckerFinding[] = []
const add = (level: Level, code: string, message: string, ref?: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })
}
const finish = (): never => {
  findings.push(...judgmentFindingsFromRubric(RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'binding', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

if (unsupportedOptions.length || missingValueOption) {
  const message = missingValueOption
    ? `The ${missingValueOption} option needs a value.`
    : `Unsupported option(s): ${unsupportedOptions.join(', ')}. Use --dry-run for a non-writing CONFORM preview.`
  add('FAIL', 'BIND-4', message, BIND_REF)
  finish()
}

function findSettings(directory: string, depth = 0): string[] {
  if (!existsSync(directory) || depth > 4) return []
  const paths: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'cowork_settings.json' && entry.isFile()) paths.push(join(directory, entry.name))
    else if (entry.isDirectory() && entry.name !== 'cowork_plugins') paths.push(...findSettings(join(directory, entry.name), depth + 1))
  }
  return paths
}

const results: Result[] = []
for (const path of findSettings(base)) {
  let config: Record<string, unknown>
  try {
    config = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    results.push({ path, status: 'unreadable' })
    continue
  }

  const enabled = (config.enabledPlugins ?? {}) as Record<string, unknown>
  const marketplaces = (config.extraKnownMarketplaces ?? {}) as Record<string, unknown>
  const pluginEnabled = enabled[pluginKey] === true
  const marketplaceRegistered = (marketplaces[marketplace] as { source?: { repo?: string } })?.source?.repo === repo
  if (pluginEnabled && marketplaceRegistered) {
    results.push({ path, status: 'already' })
    continue
  }

  if (dryRun) {
    results.push({ path, status: 'would-conform' })
    continue
  }

  config.enabledPlugins = { ...enabled, [pluginKey]: true }
  config.extraKnownMarketplaces = { ...marketplaces, [marketplace]: { source: { source: 'github', repo } } }
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`)
  results.push({ path, status: 'conformed' })
}

if (results.length === 0) {
  add('INFO', 'BIND-4', 'No Cowork settings were found; the Cowork surface is not present on this machine.', BIND_REF, base)
}
for (const result of results) {
  if (result.status === 'already') add('PASS', 'BIND-4', 'The Cowork plugin is already registered and enabled.', BIND_REF, result.path)
  else if (result.status === 'conformed')
    add('POLISH', 'BIND-4', 'The Cowork plugin was registered and enabled; relaunch Cowork to apply it.', BIND_REF, result.path)
  else if (result.status === 'would-conform')
    add('POLISH', 'BIND-4', 'The Cowork plugin would be registered and enabled; relaunch Cowork after applying.', BIND_REF, result.path)
  else add('FAIL', 'BIND-4', 'Cowork settings cannot be parsed as JSON.', BIND_REF, result.path)
}

finish()
