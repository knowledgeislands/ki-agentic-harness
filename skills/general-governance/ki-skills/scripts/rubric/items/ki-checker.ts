import type { RubricItem } from '../../lib/rubric/rubric.ts'
import type { KiCheckerRubricContext } from '../contexts/contexts.ts'

export const KI_CHECKER_1: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-1',
  title: 'governance checkers receive the repository root and scope themselves',
  description: 'A governance checker accepts the repository root, resolves its own scope, and reports one NA finding when absent.',
  sources: ['KI'],
  judgment: {
    prompt: 'Does a governance checker receive the repository root, resolve its own scope, and stop with one NA when that scope is absent?'
  }
}

export const KI_CHECKER_2: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-2',
  title: 'skill script imports remain inside the vendored payload',
  description: 'A skill script never imports a relative path that resolves outside its own scripts directory.',
  sources: ['KI'],
  audit: ({ imports }) =>
    imports
      .filter((entry) => !entry.resolvesInsideScripts)
      .map((entry) => ({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: KI_CHECKER_2.code,
        message: `\`scripts/${entry.entry}\` imports \`${entry.specifier}\`, which resolves outside its own scripts directory — package the required module locally before importing it`
      }))
}

export const KI_CHECKER_3: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-3',
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
        code: KI_CHECKER_3.code,
        message: '`ki-skills` must expose `checker-reporter` under `checker-modules:`'
      })
    if (!reporterModuleExists)
      findings.push({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: KI_CHECKER_3.code,
        message: '`ki-skills` must ship `scripts/lib/checker-reporter.ts` from its own files'
      })
    if (checkerDependencies.length > 0)
      findings.push({
        type: 'M' as const,
        level: 'FAIL' as const,
        code: KI_CHECKER_3.code,
        message: '`ki-skills` is the checker-contract root and must not declare `checker-dependencies:`'
      })
    return findings
  }
}

export const KI_CHECKER: readonly RubricItem<KiCheckerRubricContext>[] = [KI_CHECKER_1, KI_CHECKER_2, KI_CHECKER_3]
