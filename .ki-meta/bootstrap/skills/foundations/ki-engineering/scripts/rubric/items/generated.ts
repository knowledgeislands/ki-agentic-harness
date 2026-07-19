import { mechanical } from './common.ts'

export const GEN_1 = mechanical(
  'GEN-1',
  'generated surfaces share exclusions',
  'Known generated or vendored surfaces have matching Biome, Knip, and Markdown exclusions; no such surface is not applicable.',
  'FAIL'
)
export const GEN = [GEN_1] as const
