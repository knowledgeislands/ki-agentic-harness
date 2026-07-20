import { mechanical } from './common.ts'

export const BIO_1 = mechanical('BIO-1', 'Biome read-only gate passes', '`bunx @biomejs/biome check` exits clean.', 'FAIL')
export const BIO_2 = mechanical(
  'BIO-2',
  'Biome shared configuration',
  '`biome.json` exists and matches the shared formatter, JavaScript formatter, linter, and import-organisation field set.',
  'FAIL',
  ['WARN']
)
export const BIO = [BIO_1, BIO_2] as const
