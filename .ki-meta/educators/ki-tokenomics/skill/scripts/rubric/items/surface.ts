import { judgment, mechanical } from './shared.ts'
export const SURF_1 = mechanical(
  'SURF-1',
  'Instruction files and imports are measured',
  'Each instruction file resolves imports and reports its size.',
  'FAIL'
)
export const SURF_2 = mechanical('SURF-2', 'Memory indices are measured', 'Memory indices and locatable memory files are measured.')
export const SURF_3 = mechanical(
  'SURF-3',
  'Skill descriptions are measured',
  'Installed-skill descriptions are counted and summed per layer.'
)
export const SURF_4 = judgment(
  'SURF-4',
  'Standing instruction earns its cost',
  'Does each large instruction or memory entry earn its standing token cost?'
)
export const SURF = [SURF_1, SURF_2, SURF_3, SURF_4] as const
