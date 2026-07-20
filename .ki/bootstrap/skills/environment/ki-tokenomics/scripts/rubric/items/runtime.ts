import { judgment, mechanical } from './shared.ts'
export const RUN_1 = judgment('RUN-1', 'Prompt caching is effective', 'Is the stable prefix cacheable and being hit?')
export const RUN_2 = judgment('RUN-2', 'Model type matches work value', 'Does the declared model type match the work value?')
export const RUN_3 = judgment('RUN-3', 'Conversation growth is controlled', 'Are compaction and sub-agent fan-out proportionate?')
export const RUN_4 = judgment('RUN-4', 'Tool verbosity is controlled', 'Are raw tool results prevented from bloating context?')
export const RUN_5 = mechanical('RUN-5', 'Pinned model is reported', 'A default model pinned in settings is reported.')
export const RUN = [RUN_1, RUN_2, RUN_3, RUN_4, RUN_5] as const
