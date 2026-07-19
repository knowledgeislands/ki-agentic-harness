import { judgment, mechanical } from './shared.ts'
export const CFG_1 = mechanical(
  'CFG-1',
  'Config validates down',
  'The ki-tokenomics configuration table is parsed and validated down.',
  'FAIL'
)
export const CFG_2 = mechanical('CFG-2', 'Education emits defaults', 'Education emits the default configuration keys.')
export const CFG_3 = judgment('CFG-3', 'Configuration is warranted', 'Are budgets and expectations warranted for this environment?')
export const CFG_4 = mechanical('CFG-4', 'Portable model type is declared', 'A portable preferred model type is declared.', 'FAIL')
export const CFG_5 = mechanical(
  'CFG-5',
  'Model bindings are valid',
  'Optional model-tier bindings have valid keys and non-empty values.',
  'FAIL'
)
export const CFG = [CFG_1, CFG_2, CFG_3, CFG_4, CFG_5] as const
