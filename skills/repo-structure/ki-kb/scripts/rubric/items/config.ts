import { mechanical } from './common.ts'

export const CONFIG_1 = mechanical(
  'CONFIG-1',
  'known scalar configuration keys',
  'Only required_frontmatter, preflight, and zones are recognised beneath [ki-kb].',
  'WARN'
)
export const CONFIG_2 = mechanical(
  'CONFIG-2',
  'non-redundant zone aliases',
  'A zone alias does not restate its canonical folder name.',
  'WARN'
)
export const CONFIG_3 = mechanical(
  'CONFIG-3',
  'canonical zone alias keys',
  'Every [ki-kb.zones] key names a canonical zone or staging area.',
  'WARN'
)
export const CONFIG_4 = mechanical(
  'CONFIG-4',
  'KB configuration boundary',
  'The checker reads only the ki-kb table and can append its absent opt-in marker safely.',
  'WARN',
  true
)
export const CONFIG_5 = mechanical(
  'CONFIG-5',
  'declared preflight paths',
  'Literal preflight paths resolve under the base; globs remain runtime-resolved.',
  'WARN'
)
export const CONFIG = [CONFIG_1, CONFIG_2, CONFIG_3, CONFIG_4, CONFIG_5] as const
