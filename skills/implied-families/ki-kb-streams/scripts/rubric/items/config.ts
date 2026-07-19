import { mechanical } from './common.ts'
export const CONFIG_1 = mechanical(
  'CONFIG-1',
  'known Streams configuration',
  'Only process_note and note_type_scheme are recognised under ki-kb-streams.',
  'WARN'
)
export const CONFIG_2 = mechanical('CONFIG-2', 'note type scheme', 'note_type_scheme is type or tags when declared.', 'WARN')
export const CONFIG = [CONFIG_1, CONFIG_2] as const
