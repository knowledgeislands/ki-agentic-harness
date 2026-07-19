const PROCESS_ITEMS = [
  {
    code: 'PROC-1',
    title: 'Representative in-lane evaluation',
    description: 'The agent is exercised on representative in-lane tasks.',
    sources: ['standards.md#11-process--evaluation', 'BP', 'COM1'],
    judgment: { prompt: 'Exercised on representative in-lane tasks — does it stay in lane, ground itself, and defer correctly?' }
  },
  {
    code: 'PROC-2',
    title: 'Cross-model evaluation',
    description: 'The agent is tested across the models it will run under.',
    sources: ['standards.md#11-process--evaluation', 'BP'],
    judgment: { prompt: 'Tested across the models it will run under.' }
  }
] as const

export const PROC_1 = PROCESS_ITEMS[0]
export const PROC_2 = PROCESS_ITEMS[1]
export const PROCESS = [PROC_1, PROC_2] as const
