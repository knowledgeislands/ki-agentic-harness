import { judgment, mechanical } from './common.ts'

export const TSC_1 = mechanical(
  'TSC-1',
  'type-check passes',
  '`tsc --noEmit` exits clean at the root, or each declared workspace has a clean `tsc --noEmit -p <workspace>/tsconfig.json`.',
  'FAIL'
)
export const TSC_2 = mechanical(
  'TSC-2',
  'universal TypeScript invariants',
  '`tsconfig.json` exists with strict, NodeNext, noEmit, isolatedModules, esModuleInterop, and skipLibCheck invariants.',
  'FAIL'
)
export const TSC_3 = judgment(
  'TSC-3',
  'strictness is not weakened',
  'No repo loosens `strict` or the `noUnused*` and `noImplicit*` flags.',
  'Does the effective TypeScript configuration preserve the required strictness flags?'
)
export const TSC = [TSC_1, TSC_2, TSC_3] as const
