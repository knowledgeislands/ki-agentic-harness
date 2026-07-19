import type { RubricItem } from '../../shared/rubric.ts'
import type { KiCheckerRubricContext } from '../contexts/contexts.ts'

export const KI_CHECKER_1: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-1',
  title: 'governance checkers receive the repository root and scope themselves',
  description:
    'A governance `audit`/`conform` is invoked with the **repo root** (`bun .ki-meta/checkers/<skill>/scripts/audit.ts .`), not its own content sub-directory. It must therefore **resolve its own scope under the arg** (`docs/features`, `docs/roadmap`, `docs/decisions`, `memory/`, …) and emit a single `NOT_APPLICABLE` result, then stop, when that scope is absent — rather than treating the arg as its sub-directory (which scans the whole repo and flags unrelated files, e.g. `ROADMAP.md`) or scanning the root and vacuously passing on zero files. Mirrors `ki-engineering` (no `package.json` → `NOT_APPLICABLE`) and `ki-website-cloudflare` (no `wrangler` → `NOT_APPLICABLE`). This is what makes the coverage-scoped aggregate `ki:audit` (ADR-KI-HARNESS-007) a clean gate.',
  sources: ['KI'],
  judgment: {
    prompt:
      'Does a governance checker receive the repository root, resolve its own scope, and stop with one NOT_APPLICABLE result when that scope is absent?'
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
    "`ki-skills` is the self-governing checker-contract root: it declares `checker-modules: [rubric, checker, reporter]`, ships its canonical rubric, checker, and reporter modules under `scripts/shared/`, and declares no `ki-checker-dependencies:` entry. Its canonical checker and direct human reporter therefore run from its own shipped files without a dependency on itself or another skill. Other skills may declare only offered checker modules, which bootstrap copies from the provider's `scripts/shared/` into their local `scripts/vendored/<provider>/` namespace; that declaration is implementation packaging, not `ki-depends-on:` or composition.",
  sources: ['ADR-KI-HARNESS-SKILLS-012'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ rootSkill, checkerModules, checkerDependencies, rubricModuleExists, checkerModuleExists, reporterModuleExists }) => {
        if (!rootSkill) return [{ status: 'NOT_APPLICABLE', message: 'the audited skill is not the checker-contract root' }]
        const violations = []
        for (const module of ['rubric', 'checker', 'reporter'])
          if (!checkerModules.includes(module))
            violations.push({
              status: 'VIOLATION' as const,
              message: `\`ki-skills\` must expose \`${module}\` under \`checker-modules:\``
            })
        if (!rubricModuleExists)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` must ship `scripts/shared/rubric.ts` from its own files'
          })
        if (!checkerModuleExists)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` must ship `scripts/shared/checker.ts` from its own files'
          })
        if (!reporterModuleExists)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` must ship `scripts/shared/reporter.ts` from its own files'
          })
        if (checkerDependencies.length > 0)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`ki-skills` is the checker-contract root and must not declare `ki-checker-dependencies:`'
          })
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'ki-skills is the self-governing checker-contract root' }]
      }
    }
  }
}

export const KI_CHECKER_4: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-4',
  title: 'structured rubric items follow the uniform family layout',
  description:
    '`scripts/rubric/items/index.ts` is catalogue wiring only. Each family collection is imported from one semantic family module; that module individually exports every stable rule and one ordered family collection. Rule definitions and execution callbacks do not live in the catalogue index.',
  sources: ['rubric-authoring.md#rubric-families-and-items'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ structuredRubricRequired, itemsIndexExists, itemsIndexDefinesRules, familyModules }) => {
        if (!structuredRubricRequired)
          return [{ status: 'NOT_APPLICABLE', message: 'the skill does not declare the structured checker contract' }]
        const violations = []
        if (!itemsIndexExists) violations.push({ status: 'VIOLATION' as const, message: '`scripts/rubric/items/index.ts` is missing' })
        if (itemsIndexDefinesRules)
          violations.push({
            status: 'VIOLATION' as const,
            message: '`scripts/rubric/items/index.ts` defines rule execution instead of catalogue wiring only'
          })
        if (itemsIndexExists && familyModules.length === 0)
          violations.push({ status: 'VIOLATION' as const, message: 'the rubric catalogue defines no imported family collections' })
        for (const family of familyModules) {
          if (family.source === null)
            violations.push({
              status: 'VIOLATION' as const,
              message: `family collection \`${family.collection}\` is not imported from an existing local family module`
            })
          else {
            if (!family.exportsOrderedCollection)
              violations.push({
                status: 'VIOLATION' as const,
                message: `family module for \`${family.collection}\` does not export its ordered collection`
              })
            if (family.individuallyExportedRules === 0)
              violations.push({
                status: 'VIOLATION' as const,
                message: `family module for \`${family.collection}\` does not individually export its rubric rules`
              })
          }
        }
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'structured rubric items follow the uniform family layout' }]
      }
    }
  }
}

export const KI_CHECKER_5: RubricItem<KiCheckerRubricContext> = {
  code: 'KI-CHECKER-5',
  title: 'shared and internal script packaging is explicit',
  description:
    'Private implementation belongs under `scripts/internal/`; cross-skill modules belong under `scripts/shared/`, whose non-test entries must exactly match `checker-modules:`.',
  sources: ['KI'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ checkerModules, legacyLibPresent, sharedModules }) => {
        const violations = []
        if (legacyLibPresent)
          violations.push({ status: 'VIOLATION' as const, message: 'classify `scripts/lib/` contents as shared or internal' })
        const declared = [...new Set(checkerModules)].sort()
        const published = [...new Set(sharedModules)].sort()
        if (declared.join('\n') !== published.join('\n'))
          violations.push({
            status: 'VIOLATION' as const,
            message: `\`scripts/shared/\` must exactly publish \`checker-modules:\` (declared: ${declared.join(', ') || 'none'}; published: ${published.join(', ') || 'none'})`
          })
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'shared and internal script packaging is explicit' }]
      }
    }
  }
}

export const KI_CHECKER = [KI_CHECKER_1, KI_CHECKER_2, KI_CHECKER_3, KI_CHECKER_4, KI_CHECKER_5] as const
