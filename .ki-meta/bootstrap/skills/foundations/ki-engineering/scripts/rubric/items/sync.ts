import { mechanical } from './common.ts'

export const SYNC_1 = mechanical('SYNC-1', 'dependency synchronisation passes', '`bunx syncpack format --check` exits clean.', 'FAIL')
export const SYNC = [SYNC_1] as const
