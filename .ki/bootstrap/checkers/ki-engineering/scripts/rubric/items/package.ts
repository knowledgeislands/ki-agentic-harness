import { mechanical } from './common.ts'

export const PKG_1 = mechanical('PKG-1', 'module package type', '`"type": "module"`.', 'WARN')
export const PKG_2 = mechanical('PKG-2', 'Bun package-manager pin', '`"packageManager"` starts with `bun@` (pinned patch).', 'WARN')
export const PKG_3 = mechanical('PKG-3', 'Node engine floor', '`"engines.node"` floor is `>= 22`.', 'WARN')
export const PKG_4 = mechanical(
  'PKG-4',
  'closed package coverage manifest',
  'Every top-level `package.json` key is in the engineering coverage manifest; an unknown key is drift. This is also the criterion for an unparseable `package.json`.',
  'FAIL'
)
export const PKG_5 = mechanical(
  'PKG-5',
  'toolchain dependencies declared',
  'The toolchain devDependencies `@biomejs/biome`, `knip`, `prettier`, `husky`, `lint-staged`, `markdownlint-cli2`, `syncpack`, and `typescript` are declared rather than implied.',
  'FAIL'
)
export const PKG_6 = mechanical(
  'PKG-6',
  'lint-staged fan-out',
  '`lint-staged` is present and fans out to Biome on code and Prettier plus `markdownlint-cli2 --no-globs` on staged Markdown only.',
  'FAIL',
  ['WARN']
)
export const PKG = [PKG_1, PKG_2, PKG_3, PKG_4, PKG_5, PKG_6] as const
