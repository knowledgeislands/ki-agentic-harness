import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PackagesContext } from '../contexts/packages.ts'

const SOURCE = 'standards-package-repositories.md#declaration'

const CONFIG_1: RubricItem<PackagesContext> = {
  code: 'CONFIG-1',
  title: 'the declaration names the vendored package',
  description: 'The `package` key names a physical folder under `packages/`, the tree consumers vendor.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Set `package` in `[skills.ki-repo-packages]` to the folder under `packages/` that consumers copy.'
    },
    audit: {
      phase: 'INSPECT',
      run: ({ packageName, packageState }) => [
        packageState === 'physical'
          ? { status: 'PASS', message: `The vendored package is packages/${packageName}/.`, subject: '.ki.toml' }
          : {
              status: 'VIOLATION',
              message:
                packageState === 'unset'
                  ? 'The declaration does not name the vendored package.'
                  : packageState === 'invalid'
                    ? 'The `package` key is not a single folder name.'
                    : `packages/${packageName}/ is not a physical folder.`,
              subject: '.ki.toml'
            }
      ]
    }
  }
}

const CONFIG_2: RubricItem<PackagesContext> = {
  code: 'CONFIG-2',
  title: 'the declaration has no unknown keys',
  description: 'Every key in `[skills.ki-repo-packages]` other than `package` is unknown and surfaced.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: { class: 'diagnostic', guidance: 'Remove the unknown key; `package` is the only setting.' },
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
  description: 'The overlay declaration that names the vendored package.',
  standard: 'standards-package-repositories.md',
  selectContext: (context) => context,
  items: [CONFIG_1, CONFIG_2]
}
