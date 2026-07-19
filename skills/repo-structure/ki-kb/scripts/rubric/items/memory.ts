import { judgment, mechanical } from './common.ts'

export const MEM_1 = judgment(
  'MEM-1',
  'active-Pillar memory accuracy',
  'Admin/MEMORY.md lists the Pillars actually active in the base.',
  'Does the memory index accurately list active Pillars?'
)
export const MEM_2 = mechanical(
  'MEM-2',
  'always-loaded memory cascade anchor',
  'Root CLAUDE.md or AGENTS.md anchors the memory cascade before substantive work.',
  'WARN'
)
export const MEM = [MEM_1, MEM_2] as const
