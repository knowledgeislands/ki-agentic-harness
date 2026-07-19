import type { AuditOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { SpecificationsContext } from '../contexts/specifications.ts'

const SOURCE = ['standards.md'] as const
const many = (values: AuditOutcome[]): RubricOutcomes<AuditOutcome> => values as RubricOutcomes<AuditOutcome>

export const SPEC_1: RubricItem<SpecificationsContext> = {
  code: 'SPEC-1',
  title: 'repository identity marker',
  description: '`.ki-config.toml` declares a keyless `[ki-specifications]` table. Unknown keys WARN because the marker has no options yet.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    overrideLevels: ['FAIL'],
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.targetExists)
          return [{ status: 'NOT_APPLICABLE', message: 'The marker cannot be inspected because the target is not a directory.' }]
        if (!context.applicable)
          return [
            {
              status: 'NOT_APPLICABLE',
              message: 'ki-specifications is not applicable: no declaration or core structural marker is present.'
            }
          ]
        if (context.malformed) return [{ status: 'VIOLATION', message: '.ki-config.toml is malformed.', subject: '.ki-config.toml' }]
        if (!context.table)
          return [{ status: 'VIOLATION', message: '[ki-specifications] is absent from .ki-config.toml.', subject: '.ki-config.toml' }]
        const keys = Object.keys(context.table)
        return [
          keys.length === 0
            ? { status: 'PASS', message: 'The keyless [ki-specifications] marker is present.', subject: '.ki-config.toml' }
            : { status: 'VIOLATION', message: `The keyless marker contains unknown keys: ${keys.join(', ')}.`, subject: '.ki-config.toml' }
        ]
      }
    },
    conform: { phase: 'PRIMARY', run: (context) => context.conformMarker() }
  }
}

export const SPEC_2: RubricItem<SpecificationsContext> = {
  code: 'SPEC-2',
  title: 'authority areas',
  description: '`proposals/`, `specifications/`, and `schemas/` exist as directories. Their absence FAILs.',
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.targetExists) return [{ status: 'VIOLATION', message: 'Audit target must be an existing directory.' }]
        if (!context.applicable) return [{ status: 'NOT_APPLICABLE', message: 'ki-specifications is not applicable.' }]
        return many(
          context.core.map(({ path, exists }) =>
            exists
              ? { status: 'PASS', message: `${path}/ is present.`, subject: path }
              : { status: 'VIOLATION', message: `${path}/ is absent.`, subject: path }
          )
        )
      }
    },
    conform: {
      phase: 'PRIMARY',
      run: () => [{ status: 'NOT_APPLICABLE', message: 'Directory creation requires real content and remains manual.' }]
    }
  }
}

export const SPEC_3: RubricItem<SpecificationsContext> = {
  code: 'SPEC-3',
  title: 'supporting areas',
  description: '`templates/`, `examples/`, `docs/`, and `tooling/` exist as directories. Their absence WARNs.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.applicable) return [{ status: 'NOT_APPLICABLE', message: 'ki-specifications is not applicable.' }]
        return many(
          context.supporting.map(({ path, exists }) =>
            exists
              ? { status: 'PASS', message: `${path}/ is present.`, subject: path }
              : { status: 'VIOLATION', message: `${path}/ is absent.`, subject: path }
          )
        )
      }
    },
    conform: {
      phase: 'PRIMARY',
      run: () => [{ status: 'NOT_APPLICABLE', message: 'Directory creation requires real content and remains manual.' }]
    }
  }
}

export const SPEC_J1: RubricItem<SpecificationsContext> = {
  code: 'SPEC-J1',
  title: 'minimal floor',
  description: 'Every asserted structure has proved stable enough to govern across time.',
  sources: SOURCE,
  judgment: { prompt: 'Has every asserted structure proved stable enough to govern across time?' }
}
export const SPEC_J2: RubricItem<SpecificationsContext> = {
  code: 'SPEC-J2',
  title: 'authority boundary',
  description: 'The skill checks repository shape without claiming canonical ownership of normative specification meaning.',
  sources: SOURCE,
  judgment: { prompt: 'Does the skill preserve the authority boundary around normative specification meaning?' }
}
export const SPEC = [SPEC_1, SPEC_2, SPEC_3, SPEC_J1, SPEC_J2] as const
