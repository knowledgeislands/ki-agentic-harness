import { judgment, mechanical } from './shared.ts'
export const TOOL_1 = mechanical('TOOL-1', 'Compression tooling is detected', 'Configured context-compression tooling is detected.')
export const TOOL_2 = mechanical('TOOL-2', 'Compression expectation is honoured', 'The declared Headroom expectation is honoured.', 'FAIL')
export const TOOL_3 = judgment('TOOL-3', 'Compression setup is optimal', 'Where present, is the compression setup optimal?')
export const TOOL_4 = mechanical(
  'TOOL-4',
  'Learned captures are local',
  'The Headroom learned block contains no cross-repository captures.'
)
export const TOOL_5 = mechanical('TOOL-5', 'Proxy traffic is attributed', 'Local Headroom proxy traffic is attributed to the repository.')
export const TOOL = [TOOL_1, TOOL_2, TOOL_3, TOOL_4, TOOL_5] as const
