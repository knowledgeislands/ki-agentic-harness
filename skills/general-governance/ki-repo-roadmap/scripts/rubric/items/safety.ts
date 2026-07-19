import { mechanical } from './common.ts'
export const SAFE_1 = mechanical('SAFE-1', 'safe mechanics', 'CONFORM and EDUCATE refuse symlink output paths, support dry-run, avoid clobbering authored files, and write generated files atomically.', 'FAIL', true)
export const SAFE = [SAFE_1] as const
