import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CodexContext, CodexDefinition } from '../contexts/agents.ts'

const STANDARD = 'standards-codex-subagents.md'
const fields = new Set([
  'name',
  'description',
  'developer_instructions',
  'model',
  'model_reasoning_effort',
  'sandbox_mode',
  'mcp_servers',
  'skills'
])
const blocked = (context: CodexContext): readonly AuditOutcome[] | null => {
  if (context.unsafePath)
    return [
      {
        status: 'VIOLATION',
        message: 'The Codex source path is unreadable, non-physical, or a symbolic link.',
        subject: context.unsafePath
      }
    ]
  if (context.rootState === 'absent')
    return [
      {
        status: 'NOT_APPLICABLE',
        message:
          'No candidate Codex source payload exists at .codex/agents/. Publication and activation remain unavailable.',
        subject: '.codex/agents'
      }
    ]
  if (context.rootState === 'unsafe')
    return [{ status: 'VIOLATION', message: '.codex/agents is not a physical directory.', subject: '.codex/agents' }]
  if (!context.definition)
    return [
      {
        status: 'NOT_APPLICABLE',
        message: 'No physical Codex source definition is available.',
        subject: '.codex/agents'
      }
    ]
  return null
}
const source = (definition: CodexDefinition): string => definition.file
const CODEX_1: RubricItem<CodexContext> = {
  code: 'CODEX-1',
  title: 'Parseable physical TOML',
  description: 'Each candidate is a physical TOML file with a parseable root table.',
  sources: [`${STANDARD}#source-format`, 'CODEX'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Repair the candidate source through its owner; do not publish it from this audit.'
    },
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const unavailable = blocked(context)
        if (unavailable) return unavailable
        const definition = context.definition as CodexDefinition
        return [
          {
            status: definition.parseError ? 'VIOLATION' : 'PASS',
            message: definition.parseError
              ? `TOML does not parse: ${definition.parseError}`
              : 'Physical TOML source shape is valid.',
            subject: source(definition)
          }
        ]
      }
    }
  }
}
const CODEX_2: RubricItem<CodexContext> = {
  code: 'CODEX-2',
  title: 'Required Codex fields',
  description: 'name, description, and developer_instructions are non-empty strings.',
  sources: [`${STANDARD}#required-fields`, 'CODEX'],
  mechanical: {
    level: 'FAIL',
    remediation: { class: 'diagnostic', guidance: 'Add the required Codex fields through the source-payload owner.' },
    audit: {
      phase: 'PRIMARY',
      run: (context) => {
        const unavailable = blocked(context)
        if (unavailable || !context.definition || context.definition.parseError)
          return unavailable ?? [{ status: 'NOT_APPLICABLE', message: 'Malformed TOML cannot provide field evidence.' }]
        const missing = ['name', 'description', 'developer_instructions'].filter((field) => {
          const value = context.definition?.values.get(field)
          return typeof value !== 'string' || !value.trim()
        })
        return [
          {
            status: missing.length ? 'VIOLATION' : 'PASS',
            message: missing.length
              ? `Codex source requires non-empty string ${missing.join(', ')}.`
              : 'Required Codex fields are present.',
            subject: source(context.definition)
          }
        ]
      }
    }
  }
}
const CODEX_3: RubricItem<CodexContext> = {
  code: 'CODEX-3',
  title: 'Supported custom-agent keys',
  description: 'The root table contains only documented custom-agent projection keys.',
  sources: [`${STANDARD}#supported-keys`, 'CODEX'],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Remove or route an unsupported key through the source-payload owner.'
    },
    audit: {
      phase: 'PRIMARY',
      run: (context) => {
        const unavailable = blocked(context)
        if (unavailable || !context.definition || context.definition.parseError)
          return unavailable ?? [{ status: 'NOT_APPLICABLE', message: 'Malformed TOML cannot provide key evidence.' }]
        const unsupported = [...context.definition.values.keys()].filter((key) => !fields.has(key))
        return [
          {
            status: unsupported.length ? 'VIOLATION' : 'PASS',
            message: unsupported.length
              ? `Unsupported Codex keys: ${unsupported.join(', ')}.`
              : 'All keys are supported custom-agent projection keys.',
            subject: source(context.definition)
          }
        ]
      }
    }
  }
}
const CODEX_4: RubricItem<CodexContext> = {
  code: 'CODEX-4',
  title: 'Unique source names',
  description: 'Candidate source definitions do not duplicate a declared name.',
  sources: [`${STANDARD}#source-format`],
  mechanical: {
    level: 'FAIL',
    remediation: { class: 'diagnostic', guidance: 'Resolve the duplicate through the source-payload owner.' },
    audit: {
      phase: 'DERIVED',
      run: (context) => {
        const unavailable = blocked(context)
        if (unavailable || !context.definition || context.definition.parseError) return unavailable ?? []
        const name = context.definition.values.get('name')
        const duplicates =
          typeof name === 'string'
            ? context.definitions.filter((candidate) => candidate.values.get('name') === name).length
            : 0
        return [
          {
            status: duplicates > 1 ? 'VIOLATION' : 'PASS',
            message: duplicates > 1 ? `Codex source name "${name}" is duplicated.` : 'Codex source name is unique.',
            subject: source(context.definition)
          }
        ]
      }
    }
  }
}
export const CODEX: RubricFamily<CodexContext, CodexContext> = {
  code: 'CODEX',
  title: 'Runtime binding — Codex TOML source projection',
  description: 'Native TOML source shape only; no host publication or activation assurance.',
  standard: STANDARD,
  selectContext: (context) => context,
  items: [CODEX_1, CODEX_2, CODEX_3, CODEX_4]
}
