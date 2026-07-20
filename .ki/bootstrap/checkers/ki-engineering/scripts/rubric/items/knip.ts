import { mechanical } from './common.ts'

export const KNIP_1 = mechanical(
  'KNIP-1',
  'Knip configuration exists',
  '`knip.json` exists with per-repo entry points and ignores.',
  'FAIL'
)
export const KNIP_2 = mechanical('KNIP-2', 'Knip gate passes', '`bunx knip` exits clean.', 'FAIL')
export const KNIP = [KNIP_1, KNIP_2] as const
