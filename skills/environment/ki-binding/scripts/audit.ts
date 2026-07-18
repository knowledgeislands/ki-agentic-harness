#!/usr/bin/env bun
/**
 * Audit that every run surface agrees with the single MCP source.
 *
 * The checker reads state only and emits canonical checker-reporter JSONL. A
 * renderer applies changes to file-editable surfaces; this checker never does.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

declare const Bun: { YAML: { parse(input: string): unknown }; TOML: { parse(input: string): unknown } }

type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type ServerEntry = { name: string; clients?: string[]; url?: string; command?: string }
type Surface = { token: string; label: string; path: string; format: 'json' | 'toml' }

const argv = process.argv.slice(2)
const opt = (name: string): string | undefined => {
  const index = argv.indexOf(name)
  return index >= 0 ? argv[index + 1] : undefined
}
const supportedOptions = new Set(['--source'])
const unsupportedOptions = argv.filter((argument) => argument.startsWith('--') && !supportedOptions.has(argument))
const sourceValue = opt('--source')
const sourceMissingValue = argv.includes('--source') && (!sourceValue || sourceValue.startsWith('--'))
const project = argv.find((argument, index) => !argument.startsWith('-') && argv[index - 1] !== '--source')
const HOME = homedir()
const XDG_CONFIG = process.env.XDG_CONFIG_HOME ?? join(HOME, '.config')
const CANONICAL_SOURCE = join(XDG_CONFIG, 'ki', 'mcp-servers.yaml')
const PROJECT_LOCAL_SOURCE = join(process.cwd(), '.ki', 'mcps.yaml')
const sourceOverride = sourceValue ?? process.env.KI_MCP_SOURCE
const SOURCE = sourceOverride
  ? resolve(sourceOverride)
  : ([CANONICAL_SOURCE, PROJECT_LOCAL_SOURCE].find((path) => existsSync(path)) ?? CANONICAL_SOURCE)
const TARGET = project ? resolve(project) : SOURCE
const BIND_REF = 'references/standards.md'
const RUBRIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
const SELF = realpathSync(fileURLToPath(import.meta.url))
const SKILLS_ROOT = resolve(dirname(SELF), '..', '..', '..')
const RECOGNISED = new Set(['mcporter', 'claude-code', 'claude-desktop', 'chatgpt-codex'])
const SURFACES: Surface[] = [
  { token: 'claude-code', label: 'Claude Code', path: join(HOME, '.claude.json'), format: 'json' },
  {
    token: 'claude-desktop',
    label: 'Claude Desktop',
    path: join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
    format: 'json'
  },
  { token: 'mcporter', label: 'mcporter', path: join(HOME, '.mcporter', 'mcporter.json'), format: 'json' },
  { token: 'chatgpt-codex', label: 'Codex CLI', path: join(HOME, '.codex', 'config.toml'), format: 'toml' }
]
const COWORK_MARKETPLACE = 'ki-plugins'
const COWORK_PLUGIN_KEY = `knowledge-islands@${COWORK_MARKETPLACE}`
const COWORK_REPO = 'knowledgeislands/ki-plugins'
const COWORK_BASE = join(HOME, 'Library', 'Application Support', 'Claude', 'local-agent-mode-sessions')

const findings: CheckerFinding[] = []
const add = (level: Level, code: string, message: string, ref?: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })
}
const finish = (): never => {
  findings.push(...judgmentFindingsFromRubric(RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'binding', target: TARGET, findings })
  process.exit(checkerReporterExitCode(findings))
}

if (unsupportedOptions.length || sourceMissingValue) {
  const message = sourceMissingValue
    ? 'The --source option needs a path.'
    : `Unsupported option(s): ${unsupportedOptions.join(', ')}. Audit always emits canonical JSONL; remove legacy flags.`
  add('FAIL', 'BIND-2', message, BIND_REF)
  finish()
}

function readJson(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function readToml(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null
  try {
    return Bun.TOML.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function surfaceServerKeys(surface: Surface): Set<string> | null {
  const config = surface.format === 'toml' ? readToml(surface.path) : readJson(surface.path)
  if (config === null) return null
  const servers = surface.format === 'toml' ? config.mcp_servers : config.mcpServers
  return servers && typeof servers === 'object' ? new Set(Object.keys(servers as Record<string, unknown>)) : new Set()
}

function findCoworkSettings(directory: string, depth = 0): string[] {
  if (!existsSync(directory) || depth > 4) return []
  const paths: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'cowork_settings.json' && entry.isFile()) paths.push(join(directory, entry.name))
    else if (entry.isDirectory() && entry.name !== 'cowork_plugins')
      paths.push(...findCoworkSettings(join(directory, entry.name), depth + 1))
  }
  return paths
}

if (!existsSync(SOURCE)) {
  add('FAIL', 'BIND-2', 'The single MCP source is absent; create it or pass --source.', BIND_REF, SOURCE)
  finish()
}

let entries: ServerEntry[] = []
try {
  const parsed = Bun.YAML.parse(readFileSync(SOURCE, 'utf8')) as { mcpServers?: unknown }
  if (!parsed || !Array.isArray(parsed.mcpServers)) throw new Error('mcpServers must be a list')
  entries = parsed.mcpServers as ServerEntry[]
} catch (error) {
  const message = error instanceof Error ? error.message : 'unknown parse error'
  add('FAIL', 'BIND-2', `The single MCP source cannot be parsed: ${message}`, BIND_REF, SOURCE)
  finish()
}

const universe = new Set<string>()
for (const [index, entry] of entries.entries()) {
  const location = entry.name ? `Server ${JSON.stringify(entry.name)}` : `Entry ${index + 1}`
  if (!entry.name) add('WARN', 'BIND-2', `${location} has no name.`, BIND_REF, SOURCE)
  else universe.add(entry.name)
  const clients = entry.clients ?? []
  if (clients.length === 0) add('WARN', 'BIND-2', `${location} targets no surface.`, BIND_REF, SOURCE)
  for (const client of clients)
    if (!RECOGNISED.has(client))
      add('WARN', 'BIND-2', `${location} names unrecognised surface ${JSON.stringify(client)}.`, BIND_REF, SOURCE)
}
if (!findings.some((finding) => finding.code === 'BIND-2'))
  add('PASS', 'BIND-2', `The source is valid with ${entries.length} declared server(s).`, BIND_REF, SOURCE)

for (const surface of SURFACES) {
  const expected = new Set([...universe].filter((name) => entries.find((entry) => entry.name === name)?.clients?.includes(surface.token)))
  const presentAll = surfaceServerKeys(surface)
  if (presentAll === null) {
    add('INFO', 'BIND-1', `${surface.label} configuration is absent or unreadable; this surface was not compared.`, BIND_REF, surface.path)
    continue
  }
  const present = new Set([...presentAll].filter((name) => universe.has(name)))
  const missing = [...expected].filter((name) => !present.has(name)).sort()
  const stray = [...present].filter((name) => !expected.has(name)).sort()
  if (missing.length === 0 && stray.length === 0) {
    add('PASS', 'BIND-1', `${surface.label} agrees with the source (${expected.size} server(s)).`, BIND_REF, surface.path)
    continue
  }
  if (missing.length)
    add(
      'WARN',
      'BIND-1',
      `${surface.label} is missing ${missing.length} expected server(s): ${missing.join(', ')}.`,
      BIND_REF,
      surface.path
    )
  if (stray.length)
    add('WARN', 'BIND-1', `${surface.label} has ${stray.length} stray server(s): ${stray.join(', ')}.`, BIND_REF, surface.path)
}

const coworkFiles = findCoworkSettings(COWORK_BASE)
if (coworkFiles.length === 0) {
  add('INFO', 'BIND-4', 'No Cowork settings were found; the Cowork surface is not present on this machine.', BIND_REF, COWORK_BASE)
} else {
  const unconformed = coworkFiles.filter((path) => {
    const config = readJson(path)
    const enabled = (config?.enabledPlugins ?? {}) as Record<string, unknown>
    const marketplaces = (config?.extraKnownMarketplaces ?? {}) as Record<string, unknown>
    const registered = (marketplaces[COWORK_MARKETPLACE] as { source?: { repo?: string } })?.source?.repo === COWORK_REPO
    return enabled[COWORK_PLUGIN_KEY] !== true || !registered
  })
  if (unconformed.length === 0)
    add('PASS', 'BIND-4', `The Cowork plugin is registered and enabled in all ${coworkFiles.length} workspace(s).`, BIND_REF)
  else
    add(
      'WARN',
      'BIND-4',
      `The Cowork plugin is not registered or enabled in ${unconformed.length}/${coworkFiles.length} workspace(s); run CONFORM then relaunch Cowork.`,
      BIND_REF
    )
}

const bootstrap = join(SKILLS_ROOT, 'keystone', 'ki-bootstrap', 'scripts', 'link-skills.ts')
if (!project) {
  add('INFO', 'BIND-3', 'No project was given, so the project-local skill links were not audited.', BIND_REF)
} else if (!existsSync(bootstrap)) {
  add('INFO', 'BIND-3', 'The ki-bootstrap linker is unavailable, so project-local skill links were not audited.', BIND_REF, bootstrap)
} else {
  const result = spawnSync('bun', [bootstrap, resolve(project), '--check'], { encoding: 'utf8' })
  if (result.status === 0) add('PASS', 'BIND-3', 'The project-local skill links are clean.', BIND_REF, resolve(project))
  else
    add(
      'WARN',
      'BIND-3',
      `The project-local skill linker reported findings (exit ${result.status ?? 'unknown'}); run ki-bootstrap CONFORM.`,
      BIND_REF,
      resolve(project)
    )
}

finish()
