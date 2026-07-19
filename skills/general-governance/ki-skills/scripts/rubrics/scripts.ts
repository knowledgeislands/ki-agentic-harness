import type { RubricItem } from '../lib/rubric/rubric.ts'

export type ScriptImport = {
  entry: string
  specifier: string
  resolvesInsideScripts: boolean
}

export type ScriptsRubricContext = {
  imports: readonly ScriptImport[]
  rootSkill: boolean
  checkerModules: readonly string[]
  checkerDependencies: readonly string[]
  reporterModuleExists: boolean
}

export const SCRIPT_1: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-1',
  title: 'scripts handle expected errors',
  description: 'Scripts handle expected error cases rather than deferring them to an agent.',
  sources: ['BP'],
  judgment: { prompt: 'Do scripts handle expected errors rather than punting them to an agent?' }
}

export const SCRIPT_2: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-2',
  title: 'scripts explain configuration values',
  description: 'Scripts avoid unexplained magic numbers and justify configuration values.',
  sources: ['BP'],
  judgment: { prompt: 'Are configuration values justified rather than unexplained magic numbers?' }
}

export const SCRIPT_3: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-3',
  title: 'runtime dependencies and MCP tools are explicit',
  description: 'Scripts verify required packages and use fully qualified MCP tool names.',
  sources: ['BP'],
  judgment: { prompt: 'Are runtime dependencies verified and MCP tools fully qualified?' }
}

export const SCRIPT_4: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-4',
  title: 'deterministic reusable logic is pre-written',
  description: 'Deterministic work used repeatedly is implemented as code rather than regenerated as instructions.',
  sources: ['BP'],
  judgment: { prompt: 'Is deterministic, frequently reused logic pre-written rather than regenerated each run?' }
}

export const SCRIPT_5: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-5',
  title: 'validation errors are actionable',
  description: 'Validation scripts describe the problem and valid options.',
  sources: ['BP'],
  judgment: { prompt: 'Do validation errors name the problem and valid options?' }
}

export const SCRIPT_6: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-6',
  title: 'batch and destructive work is planned and validated first',
  description: 'Batch or destructive operations use a plan, validation, and execution sequence.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Do batch or destructive operations plan and validate before execution?' }
}

export const SCRIPT_7: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-7',
  title: 'target-repository scripts are copied',
  description: 'Scripts installed into a target repository are copied, not linked to an external source.',
  sources: ['BP'],
  judgment: { prompt: 'Are target-repository scripts copied rather than symlinked or referenced outside the repository?' }
}

export const SCRIPT_8: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-8',
  title: 'governance checkers receive the repository root and scope themselves',
  description: 'A governance checker accepts the repository root, resolves its own scope, and reports one NA finding when absent.',
  sources: ['KI'],
  judgment: {
    prompt: 'Does a governance checker receive the repository root, resolve its own scope, and stop with one NA when that scope is absent?'
  }
}

export const SCRIPT_9: RubricItem<ScriptsRubricContext> = {
  code: 'SCRIPT-9',
  title: 'script imports remain inside the skill payload',
  description: 'A skill script never imports a relative path that resolves outside its own scripts directory.',
  sources: ['KI'],
  audit: ({ imports }) =>
    imports
      .filter((entry) => !entry.resolvesInsideScripts)
      .map((entry) => ({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: SCRIPT_9.code,
        message: `\`scripts/${entry.entry}\` imports \`${entry.specifier}\`, which resolves outside its own scripts directory — package the required module locally before importing it`
      }))
}

export const ROOT_1: RubricItem<ScriptsRubricContext> = {
  code: 'ROOT-1',
  title: 'ki-skills is the self-governing checker-contract root',
  description: 'ki-skills provides its canonical reporter from its own vendorable module and declares no checker dependency.',
  sources: ['ADR-KI-HARNESS-SKILLS-012'],
  audit: ({ rootSkill, checkerModules, checkerDependencies, reporterModuleExists }) => {
    if (!rootSkill) return []
    const findings = []
    if (!checkerModules.includes('checker-reporter'))
      findings.push({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: ROOT_1.code,
        message: '`ki-skills` must expose `checker-reporter` under `checker-modules:`'
      })
    if (!reporterModuleExists)
      findings.push({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: ROOT_1.code,
        message: '`ki-skills` must ship `scripts/lib/checker-reporter.ts` from its own files'
      })
    if (checkerDependencies.length > 0)
      findings.push({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: ROOT_1.code,
        message: '`ki-skills` is the checker-contract root and must not declare `checker-dependencies:`'
      })
    return findings
  }
}

export const SCRIPTS: readonly RubricItem<ScriptsRubricContext>[] = [
  SCRIPT_1,
  SCRIPT_2,
  SCRIPT_3,
  SCRIPT_4,
  SCRIPT_5,
  SCRIPT_6,
  SCRIPT_7,
  SCRIPT_8,
  SCRIPT_9,
  ROOT_1
]
