import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { McpRubricContext } from '../contexts/mcp.ts'
import { outcomes } from './common.ts'

export const LAY_1 = {
  code: 'LAY-1',
  title: 'MCP source layout',
  description: 'src/ contains config/, mcp-server/, tools/, main/, and utils/; an optional cli/ contains cli.ts and index.ts.',
  sources: ['standards.md#canonical-shape'],
  mechanical: {
    level: 'FAIL' as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        const required = ['config', 'mcp-server', 'tools', 'main', 'utils'].map(
          (directory) =>
            ({
              status: context.isDir('src', directory) ? 'PASS' : 'VIOLATION',
              message: context.isDir('src', directory)
                ? `Required directory is present: src/${directory}/.`
                : `Required directory is missing: src/${directory}/.`,
              subject: `src/${directory}`
            }) as AuditOutcome
        )
        const cli = context.isDir('src', 'cli')
          ? ['cli.ts', 'index.ts'].map(
              (file) =>
                ({
                  status: context.exists('src', 'cli', file) ? 'PASS' : 'VIOLATION',
                  message: context.exists('src', 'cli', file)
                    ? `Required CLI file is present: src/cli/${file}.`
                    : `Required CLI file is missing: src/cli/${file}.`,
                  subject: `src/cli/${file}`
                }) as AuditOutcome
            )
          : []
        return outcomes([...required, ...cli])
      }
    }
  },
  judgment: {
    prompt:
      'Review tools/ for thin validation-and-envelope shells, main/ for concern-grouped implementation, no console output in main/utils, and cli/ as a shared-main human shell rather than a second implementation.'
  }
} as const

export const DOC_1 = {
  code: 'DOC-1',
  title: 'MCP root documents',
  description: 'ROADMAP.md is present; CONTRIBUTING.md and SECURITY.md are present; CHANGELOG.md is present and non-empty.',
  sources: ['standards.md#documentation'],
  mechanical: {
    level: 'FAIL' as const,
    overrideLevels: ['WARN'] as const,
    audit: {
      phase: 'INSPECT' as const,
      run: (context: McpRubricContext) => {
        const documents: AuditOutcome[] = context.exists('ROADMAP.md')
          ? [{ status: 'PASS', message: 'MCP roadmap is present.', subject: 'ROADMAP.md' }]
          : [{ status: 'VIOLATION', level: 'WARN', message: 'MCP roadmap is absent.', subject: 'ROADMAP.md' }]
        for (const file of ['CONTRIBUTING.md', 'SECURITY.md'])
          documents.push({
            status: context.exists(file) ? 'PASS' : 'VIOLATION',
            message: context.exists(file) ? 'Required MCP root document is present.' : 'Required MCP root document is missing.',
            subject: file
          })
        const changelog = context.read('CHANGELOG.md').trim()
        documents.push({
          status: changelog ? 'PASS' : 'VIOLATION',
          message: changelog
            ? 'Release history is present and non-empty.'
            : context.exists('CHANGELOG.md')
              ? 'Release history is an empty stub; add a release entry or remove it.'
              : 'Release history is missing.',
          subject: 'CHANGELOG.md'
        })
        return outcomes(documents)
      }
    }
  },
  judgment: {
    prompt: 'Review CLAUDE.md for drift against the code and README setup documentation for current client and configuration instructions.'
  }
} as const
export const LAYOUT = [LAY_1, DOC_1] as const
export const LAY = [LAY_1] as const
export const DOC = [DOC_1] as const
