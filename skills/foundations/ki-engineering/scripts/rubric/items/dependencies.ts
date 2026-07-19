import { mechanical } from './common.ts'

export const DEPS_1 = mechanical(
  'DEPS-1',
  'dependencies are current',
  '`bun outdated` reports no available updates; available updates are reviewed through `ki:engineering:conform`.',
  'WARN'
)
export const DEPS = [DEPS_1] as const
