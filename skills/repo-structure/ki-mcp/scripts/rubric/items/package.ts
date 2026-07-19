import { execSync } from 'node:child_process'
import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { McpRubricContext } from '../contexts/mcp.ts'
import { outcomes, result } from './common.ts'

const MAIN = 'dist/mcp-server/index.js'
const scripts = (context: McpRubricContext): Record<string, string> => (context.packageJson?.scripts ?? {}) as Record<string, string>
export const PKG_1 = {
  code: 'PKG-1',
  title: 'MCP package entry points',
  description: 'package.json has the MCP main and bin target plus ., ./config, and ./package.json exports.',
  sources: ['standards.md#packagejson'],
  mechanical: {
    level: 'FAIL' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        if (!context.packageJson) return result('VIOLATION', 'Package manifest is missing or unparseable.', 'package.json')
        const pkg = context.packageJson
        const bin = (pkg.bin ?? {}) as Record<string, string>
        const exports_ = (pkg.exports ?? {}) as Record<string, unknown>
        return outcomes([
          {
            status: pkg.main === MAIN ? 'PASS' : 'VIOLATION',
            message:
              pkg.main === MAIN
                ? `main = ${JSON.stringify(MAIN)}.`
                : `main should be ${JSON.stringify(MAIN)}, got ${JSON.stringify(pkg.main)}.`,
            subject: 'package.json'
          },
          {
            status: Object.values(bin).includes(MAIN) ? 'PASS' : 'VIOLATION',
            message: Object.values(bin).includes(MAIN) ? `bin maps to ${MAIN}.` : `bin must map to ${MAIN}.`,
            subject: 'package.json'
          },
          ...['.', './config', './package.json'].map(
            (key) =>
              ({
                status: exports_[key] === undefined ? 'VIOLATION' : 'PASS',
                message: exports_[key] === undefined ? `exports missing ${JSON.stringify(key)}.` : `exports has ${JSON.stringify(key)}.`,
                subject: 'package.json'
              }) as AuditOutcome
          )
        ])
      }
    },
    conform: { phase: 'PRIMARY' as const, run: (context: McpRubricContext) => context.ensurePackageShape() }
  }
} as const
export const SCR_1 = {
  code: 'SCR-1',
  title: 'MCP scripts',
  description:
    'MCP server scripts are present, typed-client generation is required, auth-server scripts are paired, and record/replay scripts travel together.',
  sources: ['standards.md#packagejson'],
  mechanical: {
    level: 'FAIL' as const,
    overrideLevels: ['WARN'] as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        if (!context.packageJson) return result('VIOLATION', 'Package manifest is missing or unparseable.', 'package.json')
        const defined = scripts(context)
        const checks: AuditOutcome[] = ['ki:server:mcp:dev', 'ki:server:mcp:inspect', 'ki:server:mcp:start'].map((name) =>
          defined[name]
            ? ({ status: 'PASS', message: `${name} is present.`, subject: 'package.json' } as AuditOutcome)
            : ({
                status: 'VIOLATION',
                level: 'WARN',
                message: `MCP script ${JSON.stringify(name)} is missing.`,
                subject: 'package.json'
              } as AuditOutcome)
        )
        checks.push({
          status: defined['ki:generate:client'] ? 'PASS' : 'VIOLATION',
          message: defined['ki:generate:client'] ? 'ki:generate:client is present.' : 'MCP script ki:generate:client is missing.',
          subject: 'package.json'
        })
        if (context.isDir('src', 'auth-server'))
          for (const name of ['ki:server:auth:dev', 'ki:server:auth:start'])
            checks.push({
              status: defined[name] ? 'PASS' : 'VIOLATION',
              message: defined[name] ? `${name} is present.` : `src/auth-server requires ${name}.`,
              subject: 'package.json'
            })
        const paired = Boolean(defined['ki:test:record']) === Boolean(defined['ki:test:replay'])
        checks.push(
          paired
            ? { status: 'PASS', message: 'Record/replay scripts are paired.', subject: 'package.json' }
            : {
                status: 'VIOLATION',
                level: 'WARN',
                message: 'ki:test:record and ki:test:replay must be defined together.',
                subject: 'package.json'
              }
        )
        return outcomes(checks)
      }
    },
    conform: { phase: 'DERIVED' as const, run: (context: McpRubricContext) => context.regenerateClient() }
  },
  judgment: {
    prompt:
      'Verify generated typed-client files are committed and current; where generation fails, repair the server registration/build and rerun the explicit generation command.'
  }
} as const
export const CI_1 = {
  code: 'CI-1',
  title: 'MCP smoke CI',
  description: 'When ki:test:smoke is defined, ci.yml invokes it after the common engineering gate.',
  sources: ['standards.md#packagejson'],
  mechanical: {
    level: 'FAIL' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) =>
        !scripts(context)['ki:test:smoke']
          ? result('NOT_APPLICABLE', 'No MCP smoke script is defined.')
          : result(
              context.read('.github', 'workflows', 'ci.yml').includes('bun run ki:test:smoke') ? 'PASS' : 'VIOLATION',
              'ci.yml must run bun run ki:test:smoke.',
              '.github/workflows/ci.yml'
            )
    }
  }
} as const
export const CI_2 = {
  code: 'CI-2',
  title: 'MCP smoke execution',
  description: 'When ki:test:smoke is defined, it exits successfully.',
  sources: ['standards.md#packagejson'],
  mechanical: {
    level: 'FAIL' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        if (!scripts(context)['ki:test:smoke']) return result('NOT_APPLICABLE', 'No MCP smoke script is defined.')
        try {
          execSync('bun run ki:test:smoke', { cwd: context.root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
          return result('PASS', 'ki:test:smoke exits 0.', 'package.json')
        } catch (error) {
          const detail = ((error as { stderr?: string; stdout?: string }).stderr ?? (error as { stdout?: string }).stdout ?? '').trim()
          return result('VIOLATION', detail ? `ki:test:smoke failed: ${detail}` : 'ki:test:smoke failed.', 'package.json')
        }
      }
    }
  }
} as const
export const PACKAGE = [PKG_1, SCR_1, CI_1, CI_2] as const
export const PKG = [PKG_1] as const
export const SCR = [SCR_1] as const
export const CI = [CI_1, CI_2] as const
