import { judgment } from './common.ts'

export const LINK_1 = judgment(
  'LINK-1',
  'Obsidian note linking',
  'Base note content uses shortest-unique Obsidian wikilinks, with aliased full paths for contents lists.',
  'Do sampled base notes use the prescribed Obsidian wikilink convention?'
)
export const LINK = [LINK_1] as const
