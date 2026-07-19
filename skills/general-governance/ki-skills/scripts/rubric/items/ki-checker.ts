import type { RubricItem } from '../../lib/rubric.ts'
import type { KiCheckerRubricContext } from '../contexts/contexts.ts'

export const KI_CHECKER_1: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-1',
  title: 'governance checkers receive the repository root and scope themselves',
  description:
    'A governance `audit`/`conform` is invoked with the **repo root** (`bun .ki-meta/checkers/<skill>/scripts/audit.ts .`), not its own content sub-directory. It must therefore **resolve its own scope under the arg** (`docs/features`, `docs/roadmap`, `docs/decisions`, `memory/`, …) and emit a single `NA` + stop when that scope is absent — rather than treating the arg as its sub-directory (which scans the whole repo and flags unrelated files, e.g. `ROADMAP.md`) or scanning the root and vacuously passing on zero files. Mirrors `ki-engineering` (no `package.json` → NA) and `ki-website-cloudflare` (no `wrangler` → NA). This is what makes the coverage-scoped aggregate `ki:audit` (ADR-KI-HARNESS-007) a clean gate.',
  sources: ['KI'],
  judgment: {
    prompt: 'Does a governance checker receive the repository root, resolve its own scope, and stop with one NA when that scope is absent?'
  }
}

export const KI_CHECKER_2: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-2',
  title: 'skill script imports remain inside the vendored payload',
  description:
    "A skill's `scripts/**/*.ts` files contain no static `from`, dynamic `import()`, or CommonJS `require()` relative import that resolves outside that skill's own `scripts/` directory. `ki-bootstrap` vendors a skill's mechanical unit as a standalone payload into every governed repo's `.ki-meta/checkers/<skill>/` ([ADR-KI-HARNESS-006](../../../../docs/decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md)); no sibling skill directory or other source file is implicitly available. The payload may only import files packaged within its own `scripts/` directory.",
  sources: ['KI'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ imports }) => {
        const violations = imports
          .filter((entry) => !entry.resolvesInsideScripts)
          .map((entry) => ({
            status: 'VIOLATION' as const,
            message: `\`scripts/${entry.entry}\` imports \`${entry.specifier}\`, which resolves outside its own scripts directory — package the required module locally before importing it`
          }))
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'skill script imports remain inside the vendored payload' }]
      }
    }
  }
}

export const KI_CHECKER_3: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-3',
  title: 'ki-skills is the self-governing checker-contract root',
  description:
    "`ki-skills` is the self-governing checker-contract root: it declares `checker-modules: [rubric, checker]`, ships its canonical rubric and checker modules under `scripts/lib/`, and declares no `checker-dependencies:` entry. Its canonical checker therefore runs from its own shipped files without a dependency on itself or another skill. Other skills may declare only offered checker modules, which bootstrap copies from the provider's `scripts/lib/` into their local `scripts/vendored/<provider>/` namespace; that declaration is implementation packaging, not `depends-on:` or composition.",
  sources: ['ADR-KI-HARNESS-SKILLS-012'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ rootSkill, checkerModules, checkerDependencies, rubricModuleExists, checkerModuleExists }) => {
        if (!rootSkill) return [{ status: 'NOT_APPLICABLE', message: 'the audited skill is not the checker-contract root' }]
        const violations = []
        for (const module of ['rubric', 'checker'])
          if (!checkerModules.includes(module))
            violations.push({
              status: 'VIOLATION' as const,
              message: `\`ki-skills\` must expose \`${module}\` under \`checker-modules:\``
            })
        if (!rubricModuleExists)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` must ship `scripts/lib/rubric.ts` from its own files'
          })
        if (!checkerModuleExists)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` must ship `scripts/lib/checker.ts` from its own files'
          })
        if (checkerDependencies.length > 0)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` is the checker-contract root and must not declare `checker-dependencies:`'
          })
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'ki-skills is the self-governing checker-contract root' }]
      }
    }
  }
}

export const KI_CHECKER = [KI_CHECKER_1, KI_CHECKER_2, KI_CHECKER_3] as const
