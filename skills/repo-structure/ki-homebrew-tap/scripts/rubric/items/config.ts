import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { HomebrewTapContext } from '../contexts/homebrew-tap.ts'

const SOURCE = ['standards.md'] as const

export const CONFIG_1: RubricItem<HomebrewTapContext> = {
  code: 'CONFIG-1',
  title: 'identity marker',
  description: '`.ki-config.toml` contains a keyless `[ki-homebrew-tap]` marker with no unknown keys.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    overrideLevels: ['FAIL'],
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        if (!context.targetExists) return [{ status: 'VIOLATION', level: 'FAIL', message: 'Audit target must be an existing directory.' }]
        if (!context.applicable)
          return [{ status: 'NOT_APPLICABLE', message: 'No tap declaration or Formula/ structural marker is present.' }]
        if (context.config === 'malformed')
          return [{ status: 'VIOLATION', message: '.ki-config.toml is malformed.', subject: '.ki-config.toml' }]
        if (context.config !== 'present')
          return [{ status: 'VIOLATION', message: '[ki-homebrew-tap] is absent from .ki-config.toml.', subject: '.ki-config.toml' }]
        return [
          context.configKeys.length === 0
            ? { status: 'PASS', message: 'The keyless [ki-homebrew-tap] marker is present.', subject: '.ki-config.toml' }
            : {
                status: 'VIOLATION',
                message: `The keyless marker contains unknown keys: ${context.configKeys.join(', ')}.`,
                subject: '.ki-config.toml'
              }
        ]
      }
    },
    conform: { phase: 'PRIMARY', run: (context) => context.conformMarker() }
  }
}

export const CONFIG = [CONFIG_1] as const
