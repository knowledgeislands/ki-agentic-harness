import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ORG = 'Knowledge Islands'

type JsonDocument = { raw: string; value: Record<string, unknown> | null }

const jsonDocument = (raw: string): JsonDocument => {
  try {
    return { raw, value: JSON.parse(raw) as Record<string, unknown> }
  } catch {
    return { raw, value: null }
  }
}

const table = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

export type PluginsContext = {
  target: string
  dryRun: boolean
  available: boolean
  applicable: boolean
  malformedConfig: boolean
  configTable: Record<string, unknown> | null
  marketplace: JsonDocument
  marketplaceFile: string
  pluginName: string
  pluginDescription: string
  plugin: JsonDocument
  pluginFile: string
  has: (...parts: string[]) => boolean
  read: (...parts: string[]) => string
  isDir: (...parts: string[]) => boolean
  projectedSkillCount: number
  projectedSkillsWithoutManifest: readonly string[]
  agentCount: number
  nestedAgentDirectories: readonly string[]
  mcpFiles: readonly string[]
  conformMarketplaceOwner: () => 'canonical' | 'fixed' | 'unavailable'
  conformJsonFormatting: () => readonly string[]
  conformPluginAgreement: () => readonly string[]
}

export const createPluginsContextFactory = ({ target, dryRun = false }: { target: string; dryRun?: boolean }): (() => PluginsContext) => {
  const root = resolve(target)
  const available = existsSync(root) && statSync(root).isDirectory()
  const at = (...parts: string[]) => join(root, ...parts)
  const has = (...parts: string[]) => existsSync(at(...parts))
  const read = (...parts: string[]) => {
    try {
      return readFileSync(at(...parts), 'utf8')
    } catch {
      return ''
    }
  }
  const isDir = (...parts: string[]) => has(...parts) && statSync(at(...parts)).isDirectory()
  const configRaw = read('.ki-config.toml')
  let config: Record<string, unknown> | null = null
  let malformedConfig = false
  try {
    config = configRaw ? (Bun.TOML.parse(configRaw) as Record<string, unknown>) : {}
  } catch {
    malformedConfig = true
  }
  const configTable = table(config?.['ki-plugins'])
  const marketplaceFile = '.claude-plugin/marketplace.json'
  const marketplace = jsonDocument(read('.claude-plugin', 'marketplace.json'))
  const pluginEntries = Array.isArray(marketplace.value?.plugins) ? (marketplace.value.plugins as Record<string, unknown>[]) : []
  const entry = pluginEntries.length === 1 ? pluginEntries[0] : null
  const pluginName = typeof entry?.name === 'string' ? entry.name : ''
  const pluginDescription = typeof entry?.description === 'string' ? entry.description : ''
  const pluginFile = pluginName ? `${pluginName}/.claude-plugin/plugin.json` : ''
  const plugin = jsonDocument(pluginFile ? read(pluginName, '.claude-plugin', 'plugin.json') : '')
  const applicable = available && (configTable !== null || malformedConfig || Boolean(marketplace.raw))

  const skillRoot = pluginName ? at(pluginName, 'skills') : ''
  const projectedSkills =
    skillRoot && isDir(pluginName, 'skills')
      ? readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      : []
  const projectedSkillsWithoutManifest = projectedSkills
    .filter((entry) => !has(pluginName, 'skills', entry.name, 'SKILL.md'))
    .map((entry) => entry.name)
  const agentRoot = pluginName ? at(pluginName, 'agents') : ''
  const agentEntries =
    agentRoot && isDir(pluginName, 'agents')
      ? readdirSync(agentRoot, { withFileTypes: true }).filter((entry) => !entry.name.startsWith('.'))
      : []
  const nestedAgentDirectories = agentEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  const mcpFiles: string[] = []
  const walk = (directory: string) => {
    if (!existsSync(directory)) return
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue
      const full = join(directory, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name === '.mcp.json') mcpFiles.push(full.replace(`${root}/`, ''))
    }
  }
  if (pluginName) walk(at(pluginName))

  const writeJson = (file: string, value: Record<string, unknown>) => {
    if (!dryRun) writeFileSync(at(file), `${JSON.stringify(value, null, 2)}\n`)
  }
  const conformMarketplaceOwner = (): 'canonical' | 'fixed' | 'unavailable' => {
    if (!marketplace.value) return 'unavailable'
    const owner = table(marketplace.value.owner) ?? {}
    if (owner.name === ORG) return 'canonical'
    marketplace.value.owner = { ...owner, name: ORG }
    writeJson(marketplaceFile, marketplace.value)
    return 'fixed'
  }
  const conformJsonFormatting = (): readonly string[] => {
    const fixed: string[] = []
    for (const [file, document] of [
      [marketplaceFile, marketplace],
      [pluginFile, plugin]
    ] as const) {
      if (!file || !document.value) continue
      if (document.raw !== `${JSON.stringify(document.value, null, 2)}\n`) {
        writeJson(file, document.value)
        fixed.push(file)
      }
    }
    return fixed
  }
  const conformPluginAgreement = (): readonly string[] => {
    if (!plugin.value) return []
    const fixed: string[] = []
    if (pluginDescription && plugin.value.description !== pluginDescription) {
      plugin.value.description = pluginDescription
      fixed.push('description')
    }
    const version = plugin.value.version
    if (typeof version !== 'string' || !/^\d+\.\d+\.\d+/.test(version)) {
      try {
        const packageVersion = (
          JSON.parse(readFileSync(join(import.meta.dir, '..', '..', '..', '..', '..', '..', 'package.json'), 'utf8')) as {
            version?: unknown
          }
        ).version
        if (typeof packageVersion === 'string') {
          plugin.value.version = packageVersion
          fixed.push('version')
        }
      } catch {
        // Missing harness metadata leaves the repair judgmental.
      }
    }
    if (fixed.length) writeJson(pluginFile, plugin.value)
    return fixed
  }

  return () => ({
    target: root,
    dryRun,
    available,
    applicable,
    malformedConfig,
    configTable,
    marketplace,
    marketplaceFile,
    pluginName,
    pluginDescription,
    plugin,
    pluginFile,
    has,
    read,
    isDir,
    projectedSkillCount: projectedSkills.length,
    projectedSkillsWithoutManifest,
    agentCount: agentEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.md')).length,
    nestedAgentDirectories,
    mcpFiles,
    conformMarketplaceOwner,
    conformJsonFormatting,
    conformPluginAgreement
  })
}
