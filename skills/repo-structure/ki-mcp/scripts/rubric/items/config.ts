import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { McpRubricContext } from '../contexts/mcp.ts'
import { outcomes, result } from './common.ts'

export const CFG_1 = {
  code: 'CFG-1',
  title: 'Injected configuration surface',
  description:
    'config/index.ts exports loadConfig, loads .env through process.loadEnvFile, and refers to ACCESS_LEVELS, ACCESS_LEVEL_RANK, and AuditLogMode; ambient process.env reads elsewhere are surfaced.',
  sources: ['standards.md#config-injection'],
  mechanical: {
    level: 'WARN' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        const source = context.read('src', 'config', 'index.ts')
        const checks: AuditOutcome[] = []
        if (!source) checks.push({ status: 'VIOLATION', message: 'src/config/index.ts is missing.', subject: 'src/config/index.ts' })
        else {
          checks.push({
            status: /export\s+(async\s+)?function\s+loadConfig|export\s+const\s+loadConfig/.test(source) ? 'PASS' : 'VIOLATION',
            message: 'config/index.ts must export loadConfig.',
            subject: 'src/config/index.ts'
          })
          checks.push({
            status: source.includes('process.loadEnvFile') ? 'PASS' : 'VIOLATION',
            message: 'config/index.ts should call process.loadEnvFile.',
            subject: 'src/config/index.ts'
          })
          if (/loadEnvFile\(\s*[`'"]\.\.?\//.test(source))
            checks.push({
              status: 'VIOLATION',
              message: 'loadEnvFile uses a cwd-relative path; resolve from import.meta.url.',
              subject: 'src/config/index.ts'
            })
          for (const symbol of ['ACCESS_LEVELS', 'ACCESS_LEVEL_RANK', 'AuditLogMode'])
            checks.push({
              status: source.includes(symbol) ? 'PASS' : 'VIOLATION',
              message: `config/index.ts ${source.includes(symbol) ? 'references' : 'is missing'} ${symbol}.`,
              subject: 'src/config/index.ts'
            })
        }
        const offenders: string[] = []
        const walk = (directory: string): void => {
          for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const full = join(directory, entry.name)
            if (entry.isDirectory()) {
              if (!['node_modules', 'dist', 'config'].includes(entry.name)) walk(full)
            } else if (
              entry.name.endsWith('.ts') &&
              !entry.name.endsWith('.test.ts') &&
              !full.endsWith('mcp-server/index.ts') &&
              !full.endsWith('cli/cli.ts')
            ) {
              const hit = readFileSync(full, 'utf8')
                .split('\n')
                .some((line) => {
                  const index = line.indexOf('process.env')
                  if (index === -1 || line.trimStart().startsWith('//') || line.slice(0, index).includes('//')) return false
                  return !/(?:=\s*|\.\.\.)process\.env(?![\w.[])/.test(line)
                })
              if (hit) offenders.push(full.replace(`${context.root}/`, ''))
            }
          }
        }
        if (context.isDir('src')) walk(join(context.root, 'src'))
        checks.push({
          status: offenders.length ? 'VIOLATION' : 'PASS',
          message: offenders.length
            ? `process.env read outside config/: ${offenders.join(', ')}.`
            : 'No process.env reads outside config/.',
          subject: 'src'
        })
        return outcomes(checks)
      }
    }
  },
  judgment: {
    prompt:
      'Verify loadConfig(env?) is the only environmental reader, no module-level config singleton exists, config is the first argument of every main/utils entry point, Config contains the standard audit and access fields, and tests use literal config rather than environment mutation.'
  }
} as const

export const UTIL_1 = {
  code: 'UTIL-1',
  title: 'Shared audit logging helper',
  description: 'utils/audit-log.ts is present as the shared audit-log helper.',
  sources: ['standards.md#audit-logging'],
  mechanical: {
    level: 'FAIL' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) =>
        outcomes(
          ['access-level.ts', 'annotations.ts', 'audit-log.ts'].map((file) => ({
            status: context.exists('src', 'utils', file) ? 'PASS' : 'VIOLATION',
            message: context.exists('src', 'utils', file) ? `utils/${file} is present.` : `Shared utils/${file} is missing.`,
            subject: `src/utils/${file}`
          }))
        )
    }
  },
  judgment: {
    prompt: 'Verify audit logging never captures secrets and tool errors are errorResult envelopes so the audit wrapper sees them.'
  }
} as const

export const TEST_1 = {
  code: 'TEST-1',
  title: 'MCP coverage exclusions',
  description:
    'When a Vitest config exists, coverage excludes mcp-server/index.ts, tools wiring, utils/annotations.ts, and src/generated/.',
  sources: ['standards.md#testing'],
  mechanical: {
    level: 'WARN' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        if (!context.vitestFile) return result('NOT_APPLICABLE', 'No Vitest configuration is present.')
        const source = context.read(context.vitestFile)
        return outcomes(
          [
            ['mcp-server/index.ts', /mcp-server\/index\.ts/],
            ['tools/**/index.ts', /tools\/\*\*(?:\/index\.ts)?|tools\/\*\/index\.ts/],
            ['utils/annotations.ts', /utils\/annotations\.ts/],
            ['src/generated/**', /generated\/\*\*/]
          ].map(([label, pattern]) => ({
            status: (pattern as RegExp).test(source) ? 'PASS' : 'VIOLATION',
            message: (pattern as RegExp).test(source) ? `Coverage excludes ${label}.` : `Coverage should exclude ${label}.`,
            subject: context.vitestFile as string
          }))
        )
      }
    }
  }
} as const
export const CONFIG = [CFG_1, UTIL_1, TEST_1] as const
export const CFG = [CFG_1] as const
export const UTIL = [UTIL_1] as const
export const TEST = [TEST_1] as const
