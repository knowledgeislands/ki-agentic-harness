import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { type CodexBindingContext, mismatches } from '../contexts/codex.ts'

const CODEXBIND_1: RubricItem<CodexBindingContext> = {
  code: 'CODEXBIND-1',
  title: 'Codex TOML definition agreement',
  description:
    'A configured Codex target has the complete non-secret source definition for each Codex-targeted server.',
  sources: ['standards-codex-binding.md'],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Review the canonical source and run the native Codex renderer after confirming intended client targets; do not overwrite unrelated application configuration.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ sourceState, target }) => {
        if (sourceState.kind !== 'valid')
          return [
            { status: 'NOT_APPLICABLE', message: 'The canonical source is unavailable, so Codex was not compared.' }
          ]
        if (target.kind === 'unavailable')
          return [
            {
              status: 'INFO',
              message:
                'Codex target evidence is unavailable; definition, registration, activation, and runtime health are unavailable.',
              subject: target.path
            }
          ]
        if (target.kind === 'invalid')
          return [
            {
              status: 'VIOLATION',
              message: 'Codex target is malformed or unsupported for definition comparison.',
              subject: target.path
            }
          ]
        return mismatches(sourceState, target)?.length
          ? [
              {
                status: 'VIOLATION',
                message: 'Codex TOML does not match every targeted full non-secret definition.',
                subject: target.path
              }
            ]
          : [
              {
                status: 'PASS',
                message: 'Codex TOML matches all targeted full non-secret definitions.',
                subject: target.path
              }
            ]
      }
    }
  }
}
const CODEXBIND_J1: RubricItem<CodexBindingContext> = {
  code: 'CODEXBIND-J1',
  title: 'Hosted activation is coordinator-owned',
  description: 'Repository selection and hosted Codex activation are explicitly outside this adapter.',
  sources: ['standards-codex-binding.md'],
  judgment: {
    scope: 'The repository’s declared runtime selection and authorised hosted Codex activation evidence.',
    prompt: 'Has the coordinator declared the adapter and recorded an authorised hosted activation check?',
    outcomes: ['conforming', 'activation unavailable', 'owner decision required'],
    guidance:
      'Route repository selection and hosted activation to the coordinator; configuration evidence alone never proves activation or runtime health.'
  }
}
export const CODEXBIND: RubricFamily<CodexBindingContext, CodexBindingContext> = {
  code: 'CODEXBIND',
  title: 'Codex binding',
  description: 'Codex TOML definition comparison and coordinator-owned activation boundary.',
  standard: 'standards-codex-binding.md',
  selectContext: (context) => context,
  items: [CODEXBIND_1, CODEXBIND_J1]
}
