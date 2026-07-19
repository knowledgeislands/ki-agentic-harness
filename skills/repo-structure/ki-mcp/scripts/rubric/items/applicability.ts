import type { McpRubricContext } from '../contexts/mcp.ts'
import { result } from './common.ts'

export const KI_CONFIG = {
  code: 'KI-CONFIG',
  title: 'MCP applicability and declaration',
  description:
    'A repository is applicable when it declares [ki-mcp] or contains src/mcp-server/. Otherwise the audit emits one NOT_APPLICABLE finding and stops; declared keys are rejected because this skill has no configuration options.',
  sources: ['standards.md#applicability'],
  mechanical: {
    level: 'WARN' as const,
    overrideLevels: ['FAIL'] as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        if (!context.rootExists) return result('VIOLATION', `Audit target must be an existing directory: ${context.root}.`, context.root)
        if (!context.applicable)
          return result(
            'NOT_APPLICABLE',
            'ki-mcp not applicable: no [ki-mcp] declaration or src/mcp-server/ structural marker.',
            context.root
          )
        if (context.config === null)
          return result('VIOLATION', 'Shared configuration file is missing; ki-repo owns its creation.', '.ki-config.toml')
        if (!context.configTable)
          return result(
            'VIOLATION',
            'No [ki-mcp] table; add it to mark this repository as governed by the MCP standard.',
            '.ki-config.toml'
          )
        const unknown = Object.keys(context.configTable)
        return unknown.length
          ? result('VIOLATION', `Unknown keys under [ki-mcp]: ${unknown.join(', ')} (validate-down).`, '.ki-config.toml')
          : result('PASS', '[ki-mcp] table is present.', '.ki-config.toml')
      }
    },
    conform: { phase: 'PRIMARY' as const, run: (context: McpRubricContext) => context.ensureMcpConfig() }
  }
} as const
export const APPLICABILITY = [KI_CONFIG] as const
