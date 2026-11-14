import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PackagesContext } from '../contexts/packages.ts'

const SOURCE = 'standards-package-repositories.md#declaration'

const CONFIG_1: RubricItem<PackagesContext> = {
  code: 'CONFIG-1',
  title: 'the declaration names the vendored packages',
  description:
    '`package` names the one folder under `packages/` that consumers vendor, or `packages` lists several, one per layer; each is a physical folder.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Set `package`, or `packages` for several, in `[skills.ki-repo-packages]` to the folders under `packages/` that consumers copy.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ declaration, declarationFault, packages }) => {
        if (declaration !== 'named')
          return [
            {
              status: 'VIOLATION',
              message: declarationFault ?? 'The declaration does not name the vendored package.',
              subject: '.ki.toml'
            }
          ]
        return packages.map(({ name, physical }) =>
          physical
            ? { status: 'PASS' as const, message: `The vendored package is packages/${name}/.`, subject: '.ki.toml' }
            : {
                status: 'VIOLATION' as const,
                message: `packages/${name}/ is not a physical folder.`,
                subject: '.ki.toml'
              }
        )
      }
    }
  }
}

const CONFIG_2: RubricItem<PackagesContext> = {
  code: 'CONFIG-2',
  title: 'the declaration has no unknown keys',
  description: 'Every key in `[skills.ki-repo-packages]` other than `package` and `packages` is unknown and surfaced.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Remove the unknown key; `package` or `packages` is the only setting.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ unknownKeys }) =>
        unknownKeys.length
          ? unknownKeys.map((key) => ({
              status: 'VIOLATION' as const,
              message: `Unknown ki-repo-packages key: ${key}`,
              subject: '.ki.toml'
            }))
          : [{ status: 'PASS', message: 'The declaration has no unknown keys.' }]
    }
  }
}

export const CONFIG: RubricFamily<PackagesContext, PackagesContext> = {
  code: 'CONFIG',
  title: 'Package declaration',
  description: 'The overlay declaration that names the vendored packages.',
  standard: 'standards-package-repositories.md',
  selectContext: (context) => context,
  items: [CONFIG_1, CONFIG_2]
}
