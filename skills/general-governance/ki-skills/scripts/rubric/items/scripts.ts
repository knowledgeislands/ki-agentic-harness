import type { RubricItem } from '../../lib/rubric.ts'

export const SCRIPT_1: RubricItem<unknown> = {
  code: 'SCRIPT-1',
  title: 'scripts handle expected errors',
  description: 'Scripts handle expected errors (missing file, permissions) rather than punt to Claude.',
  sources: ['BP'],
  judgment: { prompt: 'Do scripts handle expected errors rather than punting them to an agent?' }
}

export const SCRIPT_2: RubricItem<unknown> = {
  code: 'SCRIPT-2',
  title: 'scripts explain configuration values',
  description: 'No unexplained magic numbers — every config value is justified.',
  sources: ['BP'],
  judgment: { prompt: 'Are configuration values justified rather than unexplained magic numbers?' }
}

export const SCRIPT_3: RubricItem<unknown> = {
  code: 'SCRIPT-3',
  title: 'runtime dependencies and MCP tools are explicit',
  description: 'Required packages are listed/verified for the runtime; MCP tools use fully-qualified `ServerName:tool_name`.',
  sources: ['BP'],
  judgment: { prompt: 'Are runtime dependencies verified and MCP tools fully qualified?' }
}

export const SCRIPT_4: RubricItem<unknown> = {
  code: 'SCRIPT-4',
  title: 'deterministic reusable logic is pre-written',
  description: 'Deterministic, frequently-reused logic is pre-written, not regenerated each run.',
  sources: ['BP'],
  judgment: { prompt: 'Is deterministic, frequently reused logic pre-written rather than regenerated each run?' }
}

export const SCRIPT_5: RubricItem<unknown> = {
  code: 'SCRIPT-5',
  title: 'validation errors are actionable',
  description: 'Validation scripts are verbose — errors name the problem and the valid options.',
  sources: ['BP'],
  judgment: { prompt: 'Do validation errors name the problem and valid options?' }
}

export const SCRIPT_6: RubricItem<unknown> = {
  code: 'SCRIPT-6',
  title: 'batch and destructive work is planned and validated first',
  description: 'Plan-validate-execute for batch/destructive ops.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Do batch or destructive operations plan and validate before execution?' }
}

export const SCRIPT_7: RubricItem<unknown> = {
  code: 'SCRIPT-7',
  title: 'target-repository scripts are copied',
  description:
    "Scripts installed into a target repo's `scripts/` directory are **copies**, not symlinks or out-of-repo references — the target repo must be autonomous.",
  sources: ['BP'],
  judgment: { prompt: 'Are target-repository scripts copied rather than symlinked or referenced outside the repository?' }
}

export const SCRIPTS = [SCRIPT_1, SCRIPT_2, SCRIPT_3, SCRIPT_4, SCRIPT_5, SCRIPT_6, SCRIPT_7] as const
