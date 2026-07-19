import { judgment } from './common.ts'

export const BUN_1 = judgment(
  'BUN-1',
  'Node environment-loading parity',
  'Where the repo loads `.env`, `loadConfig` (or equivalent) calls `process.loadEnvFile()` in a try/catch for Node parity.',
  'Where `.env` is loaded, does the loader call `process.loadEnvFile()` safely?'
)
export const BUN = [BUN_1] as const
