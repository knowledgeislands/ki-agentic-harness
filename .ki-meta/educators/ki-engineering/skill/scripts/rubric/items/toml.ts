import { mechanical } from './common.ts'

export const TOML_1 = mechanical('TOML-1', 'engineering selector table', 'A `[ki-engineering]` table is present.', 'WARN')
export const TOML_2 = mechanical(
  'TOML-2',
  'engineering configuration validates down',
  'Every key under `[ki-engineering]` is known to the checker; an unknown key is drift.',
  'WARN'
)
export const TOML = [TOML_1, TOML_2] as const
