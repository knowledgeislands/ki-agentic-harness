import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { McpRubricContext } from '../contexts/mcp.ts'
import { outcomes } from './common.ts'

const registrations = (source: string): string[] => {
  const callers = new Set(['registerTool'])
  for (const match of source.matchAll(/(?:const|let)\s+(\w+)\s*=\s*(?:[\w.]+\.)?registerTool\b/g)) callers.add(match[1] as string)
  const expression = new RegExp(`\\b(?:${[...callers].join('|')})\\(\\s*['"]([a-z0-9_]+)['"]`, 'g')
  return [...source.matchAll(expression)].map((match) => match[1] as string)
}

export const TOOL_1 = {
  code: 'TOOL-1',
  title: 'MCP tool surface',
  description:
    'Registered tool names use snake-case app/resource/action forms; structured output declares outputSchema; and group registration order is stable.',
  sources: ['standards.md#tool-naming', 'standards.md#tool-results'],
  mechanical: {
    level: 'WARN' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        const names = context.toolFiles.flatMap((file) => registrations(readFileSync(file, 'utf8')))
        const checks: AuditOutcome[] = []
        if (!names.length)
          checks.push({ status: 'VIOLATION', message: 'No registerTool(...) calls found; verify tool registration.', subject: 'src/tools' })
        else {
          const invalid = names.filter((name) => !/^[a-z0-9]+(_[a-z0-9]+){1,}$/.test(name))
          checks.push({
            status: 'PASS',
            message: `Registered tools (${names.length}): ${[...names].sort().join(', ')}.`,
            subject: 'src/tools'
          })
          checks.push({
            status: invalid.length ? 'VIOLATION' : 'PASS',
            message: invalid.length
              ? `Names not matching the documented form: ${invalid.join(', ')}.`
              : 'All tool names use the documented form.',
            subject: 'src/tools'
          })
        }
        const source = context.toolFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
        const structured = /\bstructuredContent\b/.test(source)
        const json = /\bjsonResult\b/.test(source)
        const schema = /\boutputSchema\b/.test(source)
        if (structured)
          checks.push({
            status: schema ? 'PASS' : 'VIOLATION',
            message: schema
              ? 'structuredContent is paired with outputSchema.'
              : 'Tools return structuredContent but declare no outputSchema.',
            subject: 'src/tools'
          })
        if (json && !schema)
          checks.push({ status: 'VIOLATION', message: 'Tools use jsonResult but declare no outputSchema.', subject: 'src/tools' })
        if (context.isDir('src', 'tools'))
          for (const entry of readdirSync(join(context.root, 'src', 'tools'), { withFileTypes: true })) {
            const file = join(context.root, 'src', 'tools', entry.name, 'index.ts')
            if (!entry.isDirectory() || !context.exists('src', 'tools', entry.name, 'index.ts')) continue
            const group = [...readFileSync(file, 'utf8').matchAll(/server\.registerTool\(\s*['"]([^'"]+)['"]/g)].map(
              (match) => match[1] as string
            )
            if (group.length > 1) {
              const ascending = [...group].sort()
              const descending = [...ascending].reverse()
              checks.push({
                status:
                  JSON.stringify(group) === JSON.stringify(ascending) || JSON.stringify(group) === JSON.stringify(descending)
                    ? 'PASS'
                    : 'VIOLATION',
                message: `Tool registration order is ${JSON.stringify(group) === JSON.stringify(ascending) || JSON.stringify(group) === JSON.stringify(descending) ? 'deterministic' : 'not alphabetical; verify intentional stability'} (${group.join(', ')}).`,
                subject: `src/tools/${entry.name}/index.ts`
              })
            }
          }
        return outcomes(checks)
      }
    }
  },
  judgment: {
    prompt:
      'Review plural/singular resource choices, CLI mirroring and README catalogues; confirm the annotation-driven access gate, annotation presets, dry-run defaults, read default, audit/error envelopes, path and subprocess hardening, bounded schemas, error aggregation, output sanitisation, and the applicable OAuth security requirements. Optional metadata remains opt-in.'
  }
} as const
export const TOOLS = [TOOL_1] as const
export const TOOL = [TOOL_1] as const
