import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

declare const Bun: { YAML: { parse(input: string): unknown }; TOML: { parse(input: string): unknown } }

export type ServerEntry = { name: string; clients?: string[]; url?: string; command?: string }
export type Surface = { token: string; label: string; path: string; format: 'json' | 'toml' }
export type BindingRubricContext = {
  source: string
  sourceState: { kind: 'absent' } | { kind: 'invalid'; message: string } | { kind: 'valid'; entries: readonly ServerEntry[] }
  surfaces: readonly { surface: Surface; serverKeys: ReadonlySet<string> | null }[]
  cowork: {
    base: string
    files: readonly string[]
    status: (path: string) => 'already' | 'unreadable' | 'pending'
    conform: () => RubricOutcomes<ConformOutcome>
  }
  project: string | undefined
  projectCheck: 'not-requested' | 'unavailable' | 'clean' | 'drift'
}

export const RECOGNISED = new Set(['mcporter', 'claude-code', 'claude-desktop', 'chatgpt-codex'])

export const projectPublisherPath = (): string => {
  const self = realpathSync(fileURLToPath(import.meta.url))
  const skillsRoot = resolve(dirname(self), '..', '..', '..', '..', '..')
  return join(skillsRoot, 'keystone', 'ki-bootstrap', 'scripts', 'internal', 'repo-bootstrap', 'publish-project-skills.ts')
}
const HOME = homedir()
const XDG_CONFIG = process.env.XDG_CONFIG_HOME ?? join(HOME, '.config')
const CANONICAL_SOURCE = join(XDG_CONFIG, 'ki', 'mcp-servers.yaml')
const PROJECT_LOCAL_SOURCE = join(process.cwd(), '.ki', 'mcps.yaml')
const COWORK_MARKETPLACE = 'ki-plugins'
const COWORK_REPO = 'knowledgeislands/ki-plugins'
const COWORK_BASE = join(HOME, 'Library', 'Application Support', 'Claude', 'local-agent-mode-sessions')
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

const readJson = (path: string): Record<string, unknown> | null => {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}
const readToml = (path: string): Record<string, unknown> | null => {
  if (!existsSync(path)) return null
  try {
    return Bun.TOML.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}
const surfaceServerKeys = (surface: Surface): Set<string> | null => {
  const config = surface.format === 'toml' ? readToml(surface.path) : readJson(surface.path)
  if (config === null) return null
  const servers = surface.format === 'toml' ? config.mcp_servers : config.mcpServers
  return servers && typeof servers === 'object' ? new Set(Object.keys(servers as Record<string, unknown>)) : new Set()
}
const findCoworkSettings = (directory: string, depth = 0): string[] => {
  if (!existsSync(directory) || depth > 4) return []
  const paths: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'cowork_settings.json' && entry.isFile()) paths.push(join(directory, entry.name))
    else if (entry.isDirectory() && entry.name !== 'cowork_plugins')
      paths.push(...findCoworkSettings(join(directory, entry.name), depth + 1))
  }
  return paths
}
const coworkStatus = (path: string, marketplace: string, plugin: string, repo: string): 'already' | 'unreadable' | 'pending' => {
  const config = readJson(path)
  if (!config) return 'unreadable'
  const enabled = (config.enabledPlugins ?? {}) as Record<string, unknown>
  const marketplaces = (config.extraKnownMarketplaces ?? {}) as Record<string, unknown>
  const registered = (marketplaces[marketplace] as { source?: { repo?: string } })?.source?.repo === repo
  return enabled[`${plugin}@${marketplace}`] === true && registered ? 'already' : 'pending'
}

export const createBindingContext = ({
  sourceOverride,
  project,
  dryRun,
  repo = COWORK_REPO,
  marketplace = COWORK_MARKETPLACE,
  plugin = 'knowledge-islands'
}: {
  sourceOverride?: string
  project?: string
  dryRun: boolean
  repo?: string
  marketplace?: string
  plugin?: string
}): BindingRubricContext => {
  const source = sourceOverride ? resolve(sourceOverride) : ([CANONICAL_SOURCE, PROJECT_LOCAL_SOURCE].find(existsSync) ?? CANONICAL_SOURCE)
  let sourceState: BindingRubricContext['sourceState']
  if (!existsSync(source)) sourceState = { kind: 'absent' }
  else {
    try {
      const parsed = Bun.YAML.parse(readFileSync(source, 'utf8')) as { mcpServers?: unknown }
      if (!parsed || !Array.isArray(parsed.mcpServers)) throw new Error('mcpServers must be a list')
      sourceState = { kind: 'valid', entries: parsed.mcpServers as ServerEntry[] }
    } catch (error) {
      sourceState = { kind: 'invalid', message: error instanceof Error ? error.message : 'unknown parse error' }
    }
  }
  const files = findCoworkSettings(COWORK_BASE)
  const conform = (): RubricOutcomes<ConformOutcome> => {
    if (files.length === 0)
      return [
        {
          status: 'NOT_APPLICABLE',
          message: 'No Cowork settings were found; the Cowork surface is not present on this machine.',
          subject: COWORK_BASE
        }
      ]
    const outcomes: ConformOutcome[] = []
    for (const path of files) {
      const status = coworkStatus(path, marketplace, plugin, repo)
      if (status === 'unreadable') {
        outcomes.push({ status: 'VIOLATION', message: 'Cowork settings cannot be parsed as JSON.', subject: path })
        continue
      }
      if (status === 'already') {
        outcomes.push({ status: 'PASS', message: 'The Cowork plugin is already registered and enabled.', subject: path })
        continue
      }
      if (!dryRun) {
        const config = readJson(path) as Record<string, unknown>
        const enabled = (config.enabledPlugins ?? {}) as Record<string, unknown>
        const marketplaces = (config.extraKnownMarketplaces ?? {}) as Record<string, unknown>
        config.enabledPlugins = { ...enabled, [`${plugin}@${marketplace}`]: true }
        config.extraKnownMarketplaces = { ...marketplaces, [marketplace]: { source: { source: 'github', repo } } }
        writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`)
      }
      outcomes.push({
        status: 'FIXED',
        message: `The Cowork plugin ${dryRun ? 'would be' : 'was'} registered and enabled; relaunch Cowork to apply it.`,
        subject: path
      })
    }
    return outcomes as RubricOutcomes<ConformOutcome>
  }
  const bootstrap = projectPublisherPath()
  const projectCheck = !project
    ? 'not-requested'
    : !existsSync(bootstrap)
      ? 'unavailable'
      : spawnSync('bun', [bootstrap, resolve(project), '--check'], { encoding: 'utf8' }).status === 0
        ? 'clean'
        : 'drift'
  return {
    source,
    sourceState,
    surfaces: SURFACES.map((surface) => ({ surface, serverKeys: surfaceServerKeys(surface) })),
    cowork: { base: COWORK_BASE, files, status: (path) => coworkStatus(path, marketplace, plugin, repo), conform },
    project,
    projectCheck
  }
}
