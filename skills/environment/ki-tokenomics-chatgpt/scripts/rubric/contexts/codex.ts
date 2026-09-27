import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import type {
  AuditOutcome,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

const physical = (path: string): boolean => existsSync(path) && !lstatSync(path).isSymbolicLink()
const result = (status: AuditOutcome['status'], message: string, subject?: string): AuditOutcome => ({
  status,
  message,
  ...(subject ? { subject } : {})
})
const toml = (root: string, path: string, label: string): AuditOutcome => {
  if (!physical(path) || !lstatSync(path).isFile())
    return result('NOT_APPLICABLE', `${label} is absent or non-physical.`, relative(root, path))
  try {
    const value = Bun.TOML.parse(readFileSync(path, 'utf8'))
    return value && typeof value === 'object' && !Array.isArray(value)
      ? result(
          'PASS',
          `${label} is a directly observed parseable source; values are not reported.`,
          relative(root, path)
        )
      : result('VIOLATION', `${label} must contain a TOML table.`, relative(root, path))
  } catch {
    return result('VIOLATION', `${label} is malformed.`, relative(root, path))
  }
}
const directory = (root: string, path: string, label: string): AuditOutcome => {
  if (!physical(path) || !lstatSync(path).isDirectory())
    return result('NOT_APPLICABLE', `${label} is absent or non-physical.`, relative(root, path))
  const count = readdirSync(path, { withFileTypes: true }).filter((entry) => !entry.isSymbolicLink()).length
  return result('PASS', `Observed ${count} physical entry(s) in ${label}.`, relative(root, path))
}
export type CodexEvidenceContext = {
  readonly surfaces: readonly AuditOutcome[]
  readonly unavailable: readonly AuditOutcome[]
}
export type CodexRubricContext = { readonly rubric: RubricPublicationContext; readonly codex: CodexEvidenceContext }
export const createCodexSession = ({
  repository,
  publication
}: RubricContextOptions): RubricSession<CodexRubricContext> => {
  const repo = resolve(repository)
  const context: CodexRubricContext = {
    rubric: { publication },
    codex: {
      surfaces: [
        toml(repo, join(repo, '.codex', 'config.toml'), 'Trusted project Codex configuration'),
        directory(repo, join(repo, '.codex', 'agents'), 'Project custom-agent source directory'),
        directory(repo, join(repo, '.agents', 'skills'), 'Repository agent-skills directory'),
        physical(join(repo, 'AGENTS.md')) && lstatSync(join(repo, 'AGENTS.md')).isFile()
          ? result('PASS', 'Selected repository AGENTS.md is a directly observed physical source.', 'AGENTS.md')
          : result('NOT_APPLICABLE', 'Selected repository AGENTS.md is absent or non-physical.', 'AGENTS.md')
      ],
      unavailable: [
        'Effective model and profile',
        'Loaded instruction hierarchy',
        'Active MCP tools and server instructions',
        'Trust and permission state',
        'Memory use',
        'Transcript and compaction state',
        'Billing and tool-schema token metrics'
      ].map((fact) =>
        result('NOT_APPLICABLE', `${fact} are unavailable without separately authorised session evidence.`)
      )
    }
  }
  return {
    subjects: [
      { families: ['SURF', 'NA'], subject: repo, context: () => context },
      { families: ['RUBRIC'], subject: repo, context: () => context }
    ],
    proposal: () => ({ writes: [] })
  }
}
