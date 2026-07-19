import { mechanical } from './common.ts'

export const MISE_1 = mechanical('MISE-1', 'root toolchain pin', 'A root `mise.toml` pins both `node` and `bun` under `[tools]`.', 'WARN')
export const MISE_2 = mechanical(
  'MISE-2',
  'Bun pin drift pair',
  'The `mise.toml` Bun version equals the `packageManager` Bun version.',
  'WARN'
)
export const MISE_3 = mechanical(
  'MISE-3',
  'no legacy tool pins',
  'No legacy `.node-version`, `.nvmrc`, or `.bun-version` file lingers beside `mise.toml`.',
  'WARN'
)
export const MISE = [MISE_1, MISE_2, MISE_3] as const
