import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { PluginsContext } from '../contexts/plugins.ts'
import { inactive, judgment, mechanical, result } from './shared.ts'

const org = 'Knowledge Islands'
const active = (context: PluginsContext, run: () => ReturnType<typeof result>) => inactive(context) ?? run()
const formatted = (raw: string, value: Record<string, unknown> | null) => Boolean(value) && raw === `${JSON.stringify(value, null, 2)}\n`

export const PLUG_1 = mechanical('PLUG-1', 'marketplace manifest', '`.claude-plugin/marketplace.json` exists and parses.', 'FAIL', (c) =>
  active(c, () =>
    result(
      Boolean(c.marketplace.raw && c.marketplace.value),
      'marketplace manifest parses',
      'marketplace manifest is missing or invalid JSON',
      c.marketplaceFile
    )
  )
)
export const PLUG_2 = mechanical(
  'PLUG-2',
  'marketplace ownership',
  '`owner.name` is `Knowledge Islands`; `plugins` lists exactly one entry.',
  'FAIL',
  (c) =>
    active(c, () => {
      const entries = Array.isArray(c.marketplace.value?.plugins) ? c.marketplace.value.plugins : []
      return result(
        (c.marketplace.value?.owner as { name?: unknown } | undefined)?.name === org && entries.length === 1,
        'marketplace ownership and single-plugin shape are canonical',
        'marketplace owner or plugin count is invalid',
        c.marketplaceFile
      )
    }),
  (c) => {
    const state = c.conformMarketplaceOwner()
    return [
      {
        status: state === 'fixed' ? 'FIXED' : state === 'canonical' ? 'PASS' : 'VIOLATION',
        message:
          state === 'fixed'
            ? 'marketplace owner corrected'
            : state === 'canonical'
              ? 'marketplace owner is canonical'
              : 'marketplace manifest is unavailable',
        subject: c.marketplaceFile
      }
    ]
  }
)
export const PLUG_3 = mechanical(
  'PLUG-3',
  'plugin entry',
  'The plugin entry has `name`, `source = ./<name>`, and a description; the source directory exists.',
  'FAIL',
  (c) =>
    active(c, () => {
      const entries = Array.isArray(c.marketplace.value?.plugins) ? (c.marketplace.value.plugins as Record<string, unknown>[]) : []
      const entry = entries.length === 1 ? entries[0] : null
      return result(
        Boolean(entry && c.pluginName && entry.source === `./${c.pluginName}` && c.pluginDescription && c.isDir(c.pluginName)),
        'plugin entry and source directory agree',
        'plugin entry is incomplete or its source directory is absent',
        c.marketplaceFile
      )
    })
)
export const PLUG_4 = mechanical(
  'PLUG-4',
  'manifest formatting',
  'Plugin JSON manifests use two spaces and a trailing newline.',
  'WARN',
  (c) =>
    active(c, () => {
      const documents = [
        [c.marketplaceFile, c.marketplace],
        [c.pluginFile, c.plugin]
      ] as const
      const invalid = documents
        .filter(([file, document]) => file && document.raw && !formatted(document.raw, document.value))
        .map(([file]) => file)
      return result(
        invalid.length === 0,
        'plugin manifests use canonical JSON formatting',
        `non-canonical JSON formatting: ${invalid.join(', ')}`,
        invalid[0]
      )
    }),
  (c) => {
    const fixed = c.conformJsonFormatting()
    return [
      {
        status: fixed.length ? 'FIXED' : 'PASS',
        message: fixed.length ? `formatted ${fixed.join(', ')}` : 'plugin manifests use canonical JSON formatting',
        subject: fixed[0]
      }
    ]
  }
)
export const PLUG_5 = mechanical(
  'PLUG-5',
  'plugin manifest',
  '`<plugin>/.claude-plugin/plugin.json` exists, parses, and its name matches the source directory.',
  'FAIL',
  (c) =>
    active(c, () =>
      result(
        Boolean(c.pluginFile && c.plugin.value && c.plugin.value.name === c.pluginName),
        'plugin manifest parses and matches its directory',
        'plugin manifest is missing, invalid, or names another plugin',
        c.pluginFile || c.marketplaceFile
      )
    )
)
export const PLUG_6 = mechanical('PLUG-6', 'plugin author', '`author.name` is `Knowledge Islands`.', 'FAIL', (c) =>
  active(c, () =>
    result(
      (c.plugin.value?.author as { name?: unknown } | undefined)?.name === org,
      'plugin author is canonical',
      'plugin author must be Knowledge Islands',
      c.pluginFile
    )
  )
)
export const PLUG_7 = mechanical(
  'PLUG-7',
  'plugin version and description',
  '`version` is semver and `description` matches the marketplace entry.',
  'WARN',
  (c) =>
    active(c, () =>
      result(
        typeof c.plugin.value?.version === 'string' &&
          /^\d+\.\d+\.\d+/.test(c.plugin.value.version) &&
          c.plugin.value.description === c.pluginDescription,
        'plugin version and description agree',
        'plugin version is invalid or description has drifted',
        c.pluginFile
      )
    ),
  (c) => {
    const fixed = c.conformPluginAgreement()
    return [
      {
        status: fixed.length ? 'FIXED' : 'PASS',
        message: fixed.length ? `repaired plugin ${fixed.join(' and ')}` : 'plugin version and description agree',
        subject: c.pluginFile || c.marketplaceFile
      }
    ]
  }
)
export const PLUG_8 = mechanical('PLUG-8', 'projected skills', '`<plugin>/skills/*` each carries a `SKILL.md`.', 'FAIL', (c) =>
  active(c, () =>
    result(
      c.projectedSkillCount > 0 && c.projectedSkillsWithoutManifest.length === 0,
      `${c.projectedSkillCount} projected skills carry SKILL.md`,
      c.projectedSkillCount === 0
        ? 'projected skills are absent'
        : `skills without SKILL.md: ${c.projectedSkillsWithoutManifest.join(', ')}`,
      c.pluginName ? `${c.pluginName}/skills` : undefined
    )
  )
)
export const PLUG_9 = mechanical('PLUG-9', 'flattened agents', '`<plugin>/agents/*.md` are flat files.', 'FAIL', (c) =>
  active(c, () =>
    result(
      c.agentCount > 0 && c.nestedAgentDirectories.length === 0,
      `${c.agentCount} flattened agents present`,
      c.nestedAgentDirectories.length ? `nested agent directories: ${c.nestedAgentDirectories.join(', ')}` : 'projected agents are absent',
      c.pluginName ? `${c.pluginName}/agents` : undefined
    )
  )
)
export const PLUG_10 = mechanical('PLUG-10', 'MCP deferral', 'No `.mcp.json` appears in the plugin.', 'WARN', (c) =>
  active(c, () => result(c.mcpFiles.length === 0, 'MCP payload remains deferred', `unexpected MCP payloads: ${c.mcpFiles.join(', ')}`))
)
export const PLUG_11 = judgment(
  'PLUG-11',
  'projection freshness',
  'The projected skill and agent set matches the current harness.',
  'Does the projected skill and agent set match the current harness without stale or missing entries?'
)
export const PLUG_12 = judgment(
  'PLUG-12',
  'projection reproducibility',
  'Re-running `ki:binding:build-plugin` leaves no diff.',
  'Is the complete projection byte-for-byte reproducible from the current harness?'
)
export const PLUG_13 = mechanical(
  'PLUG-13',
  'repository scaffold',
  '`LICENSE`, `README.md`, `.gitignore`, and `CLAUDE.md` are present.',
  'FAIL',
  (c) =>
    active(c, () => {
      const missing = ['LICENSE', 'README.md', '.gitignore', 'CLAUDE.md'].filter((file) => !c.has(file))
      return result(missing.length === 0, 'repository scaffold is complete', `missing scaffold files: ${missing.join(', ')}`, missing[0])
    })
)
export const PLUG_14 = mechanical(
  'PLUG-14',
  'generated-content warning',
  '`CLAUDE.md` states the generated-not-hand-edited invariant.',
  'WARN',
  (c) =>
    active(c, () => {
      const content = c.read('CLAUDE.md')
      return result(
        /generated/i.test(content) && /hand-?edit|hand-?maintain/i.test(content),
        'CLAUDE.md states the generated-content invariant',
        'CLAUDE.md does not clearly forbid hand-editing generated content',
        'CLAUDE.md'
      )
    })
)
export const PLUG_15 = mechanical(
  'PLUG-15',
  'governance declaration',
  'Applicable repositories declare `[ki-plugins]` and no unknown keys.',
  'WARN',
  (c) =>
    active(c, () =>
      result(
        Boolean(c.configTable) && Object.keys(c.configTable ?? {}).length === 0,
        '[ki-plugins] declaration is canonical',
        c.malformedConfig
          ? '.ki-config.toml is malformed'
          : !c.configTable
            ? '[ki-plugins] declaration is absent'
            : `unknown [ki-plugins] keys: ${Object.keys(c.configTable).join(', ')}`,
        '.ki-config.toml'
      )
    )
)
export const PLUG_16 = judgment(
  'PLUG-16',
  'projection documentation',
  '`README.md` and `CLAUDE.md` describe the projection model without drift and the licence exception remains deliberate.',
  'Do the repository documents accurately describe the projection, generated-content boundary, and deliberate licence exception?'
)

export const PLUG = [
  PLUG_1,
  PLUG_2,
  PLUG_3,
  PLUG_4,
  PLUG_5,
  PLUG_6,
  PLUG_7,
  PLUG_8,
  PLUG_9,
  PLUG_10,
  PLUG_11,
  PLUG_12,
  PLUG_13,
  PLUG_14,
  PLUG_15,
  PLUG_16
] as const satisfies readonly RubricItem<PluginsContext>[]
