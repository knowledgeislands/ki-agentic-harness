import { judgment, mechanical } from './common.ts'
export const STREAM_1 = mechanical('STREAM-1', 'Focus folders', 'Folders directly under Streams are canonical Focus folders.', 'WARN')
export const STREAM_2 = mechanical('STREAM-2', 'Focus indexes', 'Each present Focus carries a same-name index note.', 'WARN')
export const STREAM_3 = mechanical(
  'STREAM-3',
  'proposal suffix',
  'Full proposals use the Proposal suffix while lightweight streams do not.',
  'WARN'
)
export const STREAM_4 = judgment(
  'STREAM-4',
  'Focus index ordering',
  'Focus indexes carry correctly ordered Streams tables and one category convention.',
  'Are index tables current, ordered, and consistently categorised?'
)
export const STREAM_5 = judgment(
  'STREAM-5',
  'Focus placement',
  'Each stream sits under its real attention Focus.',
  'Do sampled streams match their actual attention Focus?'
)
export const STREAM = [STREAM_1, STREAM_2, STREAM_3, STREAM_4, STREAM_5] as const
