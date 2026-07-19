import { judgment, mechanical } from './shared.ts'
export const MCP_1 = mechanical('MCP-1', 'MCP servers are enumerated', 'Configured MCP servers are enumerated across layers.')
export const MCP_2 = judgment('MCP-2', 'MCP servers are used', 'Is each configured server used by the work done here?')
export const MCP_3 = judgment('MCP-3', 'MCP tool sets are minimal', 'Are broad server tool sets curated or dynamically discovered?')
export const MCP = [MCP_1, MCP_2, MCP_3] as const
