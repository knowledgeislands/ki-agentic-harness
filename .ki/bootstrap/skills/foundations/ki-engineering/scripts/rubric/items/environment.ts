import { judgment, mechanical } from './common.ts'

export const ENV_1 = mechanical(
  'ENV-1',
  'environment example template',
  'Environment-capable repos commit an `.env*.example` template; no environment capability is not applicable.',
  'WARN'
)
export const ENV_2 = mechanical(
  'ENV-2',
  'development NODE_ENV confinement',
  '`NODE_ENV=development` appears only in dev or inspect scripts, never start, build, or test.',
  'FAIL'
)
export const ENV_3 = judgment(
  'ENV-3',
  'real environment files are protected',
  'Real non-example `.env.*` files are gitignored and the loader has the Node parity call.',
  'Are real environment files ignored and is the loader Node-parity-safe?'
)
export const ENV_4 = judgment(
  'ENV-4',
  'XDG paths are honoured',
  'Config, data, cache, and state paths honour the matching `$XDG_*` variable before falling back to the specification default.',
  'Do config, data, cache, and state paths honour the appropriate XDG environment variable?'
)
export const ENV = [ENV_1, ENV_2, ENV_3, ENV_4] as const
