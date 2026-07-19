import { mechanical } from './common.ts'

export const BUILD_1 = mechanical(
  'BUILD-1',
  'compiled-build shape',
  '`build` is `tsc -p tsconfig.build.json` (optionally with CLI chmod), `files` includes the scoped `dist`, and repos without compiled build are not applicable.',
  'FAIL'
)
export const BUILD_2 = mechanical(
  'BUILD-2',
  'build TypeScript configuration',
  '`tsconfig.build.json` extends the base with the required emit, declaration, output, import, index-access, and test-exclusion settings.',
  'WARN'
)
export const BUILD_3 = mechanical(
  'BUILD-3',
  'compiled shared TypeScript base',
  'Compiled repos set the richer shared TypeScript base: es2024 target, verbatimModuleSyntax, and noUnusedLocals.',
  'WARN'
)
export const BUILD_4 = mechanical(
  'BUILD-4',
  'CLI chmod iff rule',
  '`build` chmods `dist/cli/cli.js` iff `src/cli/` exists and chmods no other path.',
  'FAIL',
  ['WARN']
)
export const BUILD = [BUILD_1, BUILD_2, BUILD_3, BUILD_4] as const
