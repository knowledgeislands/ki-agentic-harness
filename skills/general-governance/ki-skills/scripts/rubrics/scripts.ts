import type { RubricItem } from '../lib/rubric/rubric.ts'

export const SCRIPT_1: RubricItem = {
  code: 'SCRIPT-1',
  title: 'scripts handle expected errors',
  description: 'Scripts handle expected error cases rather than deferring them to an agent.',
  sources: ['BP'],
  judgment: { prompt: 'Do scripts handle expected errors rather than punting them to an agent?' }
}

export const SCRIPT_2: RubricItem = {
  code: 'SCRIPT-2',
  title: 'scripts explain configuration values',
  description: 'Scripts avoid unexplained magic numbers and justify configuration values.',
  sources: ['BP'],
  judgment: { prompt: 'Are configuration values justified rather than unexplained magic numbers?' }
}

export const SCRIPT_3: RubricItem = {
  code: 'SCRIPT-3',
  title: 'runtime dependencies and MCP tools are explicit',
  description: 'Scripts verify required packages and use fully qualified MCP tool names.',
  sources: ['BP'],
  judgment: { prompt: 'Are runtime dependencies verified and MCP tools fully qualified?' }
}

export const SCRIPT_4: RubricItem = {
  code: 'SCRIPT-4',
  title: 'deterministic reusable logic is pre-written',
  description: 'Deterministic work used repeatedly is implemented as code rather than regenerated as instructions.',
  sources: ['BP'],
  judgment: { prompt: 'Is deterministic, frequently reused logic pre-written rather than regenerated each run?' }
}

export const SCRIPT_5: RubricItem = {
  code: 'SCRIPT-5',
  title: 'validation errors are actionable',
  description: 'Validation scripts describe the problem and valid options.',
  sources: ['BP'],
  judgment: { prompt: 'Do validation errors name the problem and valid options?' }
}

export const SCRIPT_6: RubricItem = {
  code: 'SCRIPT-6',
  title: 'batch and destructive work is planned and validated first',
  description: 'Batch or destructive operations use a plan, validation, and execution sequence.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Do batch or destructive operations plan and validate before execution?' }
}

export const SCRIPT_7: RubricItem = {
  code: 'SCRIPT-7',
  title: 'target-repository scripts are copied',
  description: 'Scripts installed into a target repository are copied, not linked to an external source.',
  sources: ['BP'],
  judgment: { prompt: 'Are target-repository scripts copied rather than symlinked or referenced outside the repository?' }
}

export const SCRIPTS: readonly RubricItem[] = [SCRIPT_1, SCRIPT_2, SCRIPT_3, SCRIPT_4, SCRIPT_5, SCRIPT_6, SCRIPT_7]
