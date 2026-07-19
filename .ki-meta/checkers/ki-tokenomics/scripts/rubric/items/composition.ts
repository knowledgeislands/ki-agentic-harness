import { judgment, mechanical } from './shared.ts'
export const COMP_1 = mechanical('COMP-1', 'Layers are read and reported', 'Both configuration layers are read and reported.', 'WARN')
export const COMP_2 = mechanical('COMP-2', 'Costs are attributed', 'Every cost is attributed to its configuration layer.', 'WARN')
export const COMP_3 = judgment('COMP-3', 'Recommendations land in the right layer', 'Does each recommendation account for where the cost lives?')
export const COMP = [COMP_1, COMP_2, COMP_3] as const
