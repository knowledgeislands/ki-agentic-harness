import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { EngineeringRubricContext } from '../contexts/engineering.ts'

type Code = `${string}-${number}`
type MechanicalSpec = {
  readonly type: 'mechanical'
  readonly level: 'FAIL' | 'WARN'
  readonly overrideLevels?: readonly ('FAIL' | 'WARN')[]
}
type JudgmentSpec = { readonly type: 'judgment'; readonly prompt: string }
type Spec = {
  readonly code: Code
  readonly title: string
  readonly description: string
  readonly sources: readonly ['standards.md']
  readonly aspect: MechanicalSpec | JudgmentSpec
}
const source = ['standards.md'] as const
const mechanical = (
  code: Code,
  title: string,
  description: string,
  level: MechanicalSpec['level'],
  overrideLevels?: MechanicalSpec['overrideLevels']
): Spec => ({
  code,
  title,
  description,
  sources: source,
  aspect: { type: 'mechanical', level, ...(overrideLevels ? { overrideLevels } : {}) }
})
const judgment = (code: Code, title: string, description: string, prompt: string): Spec => ({
  code,
  title,
  description,
  sources: source,
  aspect: { type: 'judgment', prompt }
})

// This catalogue is the canonical transcription of the former authored rubric.
const specs: readonly Spec[] = [
  mechanical('PKG-1', 'module package type', '`"type": "module"`.', 'WARN'),
  mechanical('PKG-2', 'Bun package-manager pin', '`"packageManager"` starts with `bun@` (pinned patch).', 'WARN'),
  mechanical('PKG-3', 'Node engine floor', '`"engines.node"` floor is `>= 22`.', 'WARN'),
  mechanical(
    'PKG-4',
    'closed package coverage manifest',
    'Every top-level `package.json` key is in the engineering coverage manifest; an unknown key is drift. This is also the criterion for an unparseable `package.json`.',
    'FAIL'
  ),
  mechanical(
    'PKG-5',
    'toolchain dependencies declared',
    'The toolchain devDependencies `@biomejs/biome`, `knip`, `prettier`, `husky`, `lint-staged`, `markdownlint-cli2`, `syncpack`, and `typescript` are declared rather than implied.',
    'FAIL'
  ),
  mechanical(
    'PKG-6',
    'lint-staged fan-out',
    '`lint-staged` is present and fans out to Biome on code and Prettier plus `markdownlint-cli2 --no-globs` on staged Markdown only.',
    'FAIL',
    ['WARN']
  ),
  mechanical('MISE-1', 'root toolchain pin', 'A root `mise.toml` pins both `node` and `bun` under `[tools]`.', 'WARN'),
  mechanical('MISE-2', 'Bun pin drift pair', 'The `mise.toml` Bun version equals the `packageManager` Bun version.', 'WARN'),
  mechanical(
    'MISE-3',
    'no legacy tool pins',
    'No legacy `.node-version`, `.nvmrc`, or `.bun-version` file lingers beside `mise.toml`.',
    'WARN'
  ),
  mechanical(
    'CI-1',
    'CI installs the declared toolchain',
    'Where `.github/workflows/ci.yml` exists, it uses `jdx/mise-action` and hardcodes no Bun or Node version.',
    'WARN'
  ),
  mechanical(
    'CI-2',
    'CI runs the canonical gates',
    '`ci.yml` runs `bun run ki:audit`, then `bun run test` when tests exist, and does not reference retired `ki:verify`.',
    'FAIL',
    ['WARN']
  ),
  mechanical(
    'SCR-1',
    'ki script naming law',
    'Every script is a permitted bare lifecycle idiom or carries the `ki:` prefix; a bare non-idiom name is drift.',
    'FAIL'
  ),
  mechanical(
    'SCR-2',
    'aggregate audit and conform entrypoints',
    'Both `ki:audit` and `ki:conform` fan out over the vendored per-skill modes.',
    'FAIL'
  ),
  mechanical(
    'SCR-3',
    'retired script families absent',
    'Retired `ki:lint:*`, `ki:deps:*`, `ki:knip`, `ki:verify`, and per-skill lint keys are absent.',
    'FAIL'
  ),
  mechanical(
    'SCR-4',
    'derived checker entrypoints',
    'Every checker payload in `.ki-meta/checkers/<skill>/` is reachable through derived `ki:<suffix>:audit` and `ki:<suffix>:conform` keys.',
    'FAIL'
  ),
  mechanical(
    'SCR-5',
    'lifecycle clean and prepare scripts',
    '`clean` removes `node_modules` (and `dist` where built), and `prepare` is `husky`.',
    'FAIL',
    ['WARN']
  ),
  mechanical(
    'SCR-6',
    'no direct Bun test runner',
    'No script value contains `bun test`; use `bun run test` so the governed package script runs.',
    'FAIL'
  ),
  mechanical(
    'SCR-7',
    'runner-neutral test and build entrypoints',
    'Test-capable repos expose bare `test`; compiled repos expose bare `build`; neither is appended to aggregate entrypoints.',
    'FAIL'
  ),
  judgment(
    'SCR-8',
    'repo-specific scripts retain clear ownership',
    'Repo-specific scripts beyond the governance surface are valid only when an owning skill governs them and they do not shadow a governed entrypoint.',
    'Do repo-specific scripts have a clear owner and avoid divergent shadows of governed entrypoints?'
  ),
  judgment(
    'BUN-1',
    'Node environment-loading parity',
    'Where the repo loads `.env`, `loadConfig` (or equivalent) calls `process.loadEnvFile()` in a try/catch for Node parity.',
    'Where `.env` is loaded, does the loader call `process.loadEnvFile()` safely?'
  ),
  mechanical(
    'TSC-1',
    'type-check passes',
    '`tsc --noEmit` exits clean at the root, or each declared workspace has a clean `tsc --noEmit -p <workspace>/tsconfig.json`.',
    'FAIL'
  ),
  mechanical(
    'TSC-2',
    'universal TypeScript invariants',
    '`tsconfig.json` exists with strict, NodeNext, noEmit, isolatedModules, esModuleInterop, and skipLibCheck invariants.',
    'FAIL'
  ),
  judgment(
    'TSC-3',
    'strictness is not weakened',
    'No repo loosens `strict` or the `noUnused*` and `noImplicit*` flags.',
    'Does the effective TypeScript configuration preserve the required strictness flags?'
  ),
  mechanical('BIO-1', 'Biome read-only gate passes', '`bunx @biomejs/biome check` exits clean.', 'FAIL'),
  mechanical(
    'BIO-2',
    'Biome shared configuration',
    '`biome.json` exists and matches the shared formatter, JavaScript formatter, linter, and import-organisation field set.',
    'FAIL',
    ['WARN']
  ),
  mechanical('KNIP-1', 'Knip configuration exists', '`knip.json` exists with per-repo entry points and ignores.', 'FAIL'),
  mechanical('KNIP-2', 'Knip gate passes', '`bunx knip` exits clean.', 'FAIL'),
  mechanical('SYNC-1', 'dependency synchronisation passes', '`bunx syncpack format --check` exits clean.', 'FAIL'),
  mechanical(
    'DEPS-1',
    'dependencies are current',
    '`bun outdated` reports no available updates; available updates are reviewed through `ki:engineering:conform`.',
    'WARN'
  ),
  mechanical(
    'GEN-1',
    'generated surfaces share exclusions',
    'Known generated or vendored surfaces have matching Biome, Knip, and Markdown exclusions; no such surface is not applicable.',
    'FAIL'
  ),
  mechanical(
    'TEST-1',
    'test capability and Vitest profile',
    'Test-capable repos expose bare `test`; a recognised root Vitest config requires the canonical test, coverage, and watch scripts, while no capability is not applicable.',
    'WARN',
    ['FAIL']
  ),
  mechanical(
    'TEST-2',
    'Vitest coverage thresholds',
    'Under the Vitest profile, coverage thresholds are exactly 100% for lines, functions, branches, and statements.',
    'FAIL'
  ),
  mechanical('TEST-3', 'Vitest test-source exclusion', 'Under the Vitest profile, coverage excludes `src/**/*.test.ts`.', 'WARN'),
  mechanical(
    'TEST-4',
    'Vitest monorepo scoping',
    'Under the Vitest profile, workspace repos scope include, exclude, and reportsDirectory to the workspace rather than a flat root.',
    'WARN'
  ),
  mechanical(
    'TEST-5',
    'Vitest coverage command passes',
    'Under the Vitest profile, `bun run test:coverage` exits clean when the companion script exists.',
    'FAIL'
  ),
  judgment(
    'TEST-6',
    'tests are colocated and genuinely complete',
    'Under the Vitest profile, tests are colocated with the source they cover and genuinely reach the 100% bar.',
    'Are tests colocated with their source and does their coverage evidence substantiate the 100% claim?'
  ),
  mechanical(
    'BUILD-1',
    'compiled-build shape',
    '`build` is `tsc -p tsconfig.build.json` (optionally with CLI chmod), `files` includes the scoped `dist`, and repos without compiled build are not applicable.',
    'FAIL'
  ),
  mechanical(
    'BUILD-2',
    'build TypeScript configuration',
    '`tsconfig.build.json` extends the base with the required emit, declaration, output, import, index-access, and test-exclusion settings.',
    'WARN'
  ),
  mechanical(
    'BUILD-3',
    'compiled shared TypeScript base',
    'Compiled repos set the richer shared TypeScript base: es2024 target, verbatimModuleSyntax, and noUnusedLocals.',
    'WARN'
  ),
  mechanical('BUILD-4', 'CLI chmod iff rule', '`build` chmods `dist/cli/cli.js` iff `src/cli/` exists and chmods no other path.', 'FAIL', [
    'WARN'
  ]),
  mechanical(
    'ENV-1',
    'environment example template',
    'Environment-capable repos commit an `.env*.example` template; no environment capability is not applicable.',
    'WARN'
  ),
  mechanical(
    'ENV-2',
    'development NODE_ENV confinement',
    '`NODE_ENV=development` appears only in dev or inspect scripts, never start, build, or test.',
    'FAIL'
  ),
  judgment(
    'ENV-3',
    'real environment files are protected',
    'Real non-example `.env.*` files are gitignored and the loader has the Node parity call.',
    'Are real environment files ignored and is the loader Node-parity-safe?'
  ),
  judgment(
    'ENV-4',
    'XDG paths are honoured',
    'Config, data, cache, and state paths honour the matching `$XDG_*` variable before falling back to the specification default.',
    'Do config, data, cache, and state paths honour the appropriate XDG environment variable?'
  ),
  mechanical('TOML-1', 'engineering selector table', 'A `[ki-engineering]` table is present.', 'WARN'),
  mechanical(
    'TOML-2',
    'engineering configuration validates down',
    'Every key under `[ki-engineering]` is known to the checker; an unknown key is drift.',
    'WARN'
  )
]

const audit = (code: Code, context: EngineeringRubricContext): RubricOutcomes<AuditOutcome> => {
  const findings = context.auditFindings.filter((finding) => finding.code === code)
  const outcomes = findings.map((finding) => ({
    status:
      finding.level === 'PASS'
        ? ('PASS' as const)
        : finding.level === 'NOT_APPLICABLE'
          ? ('NOT_APPLICABLE' as const)
          : finding.level === 'FAIL' || finding.level === 'WARN'
            ? ('VIOLATION' as const)
            : ('INFO' as const),
    ...(finding.level === 'FAIL' || finding.level === 'WARN' ? { level: finding.level } : {}),
    message: finding.message,
    ...(finding.subject ? { subject: finding.subject } : {})
  }))
  return outcomes.length
    ? (outcomes as unknown as RubricOutcomes<AuditOutcome>)
    : [{ status: 'NOT_APPLICABLE', message: `${code} did not apply to this target` }]
}

const conform = (code: Code, context: EngineeringRubricContext): RubricOutcomes<ConformOutcome> => {
  const findings = context.conformFindings().filter((finding) => finding.code === code)
  const outcomes = findings.map((finding) => ({
    status:
      finding.status === 'FAIL' || finding.status === 'WARN'
        ? ('VIOLATION' as const)
        : finding.status === 'FIXED'
          ? ('FIXED' as const)
          : finding.status === 'NOT_APPLICABLE'
            ? ('NOT_APPLICABLE' as const)
            : finding.status === 'PASS'
              ? ('PASS' as const)
              : ('INFO' as const),
    ...(finding.status === 'FAIL' || finding.status === 'WARN' ? { level: finding.status } : {}),
    message: finding.message,
    ...(finding.subject ? { subject: finding.subject } : {})
  }))
  return outcomes.length
    ? (outcomes as unknown as RubricOutcomes<ConformOutcome>)
    : [{ status: 'NOT_APPLICABLE', message: `${code} has no safe conform action` }]
}

export const ENGINEERING_ITEMS: readonly RubricItem<EngineeringRubricContext>[] = specs.map((spec) =>
  spec.aspect.type === 'judgment'
    ? { code: spec.code, title: spec.title, description: spec.description, sources: spec.sources, judgment: { prompt: spec.aspect.prompt } }
    : {
        code: spec.code,
        title: spec.title,
        description: spec.description,
        sources: spec.sources,
        mechanical: {
          level: spec.aspect.level,
          ...(spec.aspect.overrideLevels ? { overrideLevels: spec.aspect.overrideLevels } : {}),
          audit: { phase: 'INSPECT', run: (context) => audit(spec.code, context) },
          conform: { phase: 'PRIMARY', run: (context) => conform(spec.code, context) }
        }
      }
)
