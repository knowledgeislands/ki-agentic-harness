<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — engineering standards

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from the in-memory catalogue.

## PKG — PKG engineering rules

Stable engineering criteria preserved from the engineering standard.

- **PKG-1 [M] — module package type** — `"type": "module"`. (standards.md)
- **PKG-2 [M] — Bun package-manager pin** — `"packageManager"` starts with `bun@` (pinned patch). (standards.md)
- **PKG-3 [M] — Node engine floor** — `"engines.node"` floor is `>= 22`. (standards.md)
- **PKG-4 [M] — closed package coverage manifest** — Every top-level `package.json` key is in the engineering coverage manifest; an unknown key is drift. This is also the criterion for an unparseable `package.json`. (standards.md)
- **PKG-5 [M] — toolchain dependencies declared** — The toolchain devDependencies `@biomejs/biome`, `knip`, `prettier`, `husky`, `lint-staged`, `markdownlint-cli2`, `syncpack`, and `typescript` are declared rather than implied. (standards.md)
- **PKG-6 [M] — lint-staged fan-out** — `lint-staged` is present and fans out to Biome on code and Prettier plus `markdownlint-cli2 --no-globs` on staged Markdown only. (standards.md)

## MISE — MISE engineering rules

Stable engineering criteria preserved from the engineering standard.

- **MISE-1 [M] — root toolchain pin** — A root `mise.toml` pins both `node` and `bun` under `[tools]`. (standards.md)
- **MISE-2 [M] — Bun pin drift pair** — The `mise.toml` Bun version equals the `packageManager` Bun version. (standards.md)
- **MISE-3 [M] — no legacy tool pins** — No legacy `.node-version`, `.nvmrc`, or `.bun-version` file lingers beside `mise.toml`. (standards.md)

## CI — CI engineering rules

Stable engineering criteria preserved from the engineering standard.

- **CI-1 [M] — CI installs the declared toolchain** — Where `.github/workflows/ci.yml` exists, it uses `jdx/mise-action` and hardcodes no Bun or Node version. (standards.md)
- **CI-2 [M] — CI runs the canonical gates** — `ci.yml` runs `bun run ki:audit`, then `bun run test` when tests exist, and does not reference retired `ki:verify`. (standards.md)

## SCR — SCR engineering rules

Stable engineering criteria preserved from the engineering standard.

- **SCR-1 [M] — ki script naming law** — Every script is a permitted bare lifecycle idiom or carries the `ki:` prefix; a bare non-idiom name is drift. (standards.md)
- **SCR-2 [M] — aggregate audit and conform entrypoints** — Both `ki:audit` and `ki:conform` fan out over the vendored per-skill modes. (standards.md)
- **SCR-3 [M] — retired script families absent** — Retired `ki:lint:*`, `ki:deps:*`, `ki:knip`, `ki:verify`, and per-skill lint keys are absent. (standards.md)
- **SCR-4 [M] — derived checker entrypoints** — Every checker payload in `.ki-meta/checkers/<skill>/` is reachable through derived `ki:<suffix>:audit` and `ki:<suffix>:conform` keys. (standards.md)
- **SCR-5 [M] — lifecycle clean and prepare scripts** — `clean` removes `node_modules` (and `dist` where built), and `prepare` is `husky`. (standards.md)
- **SCR-6 [M] — no direct Bun test runner** — No script value contains `bun test`; use `bun run test` so the governed package script runs. (standards.md)
- **SCR-7 [M] — runner-neutral test and build entrypoints** — Test-capable repos expose bare `test`; compiled repos expose bare `build`; neither is appended to aggregate entrypoints. (standards.md)
- **SCR-8 [J] — repo-specific scripts retain clear ownership** — Repo-specific scripts beyond the governance surface are valid only when an owning skill governs them and they do not shadow a governed entrypoint.
  - _Review prompt:_ Do repo-specific scripts have a clear owner and avoid divergent shadows of governed entrypoints? (standards.md)

## BUN — BUN engineering rules

Stable engineering criteria preserved from the engineering standard.

- **BUN-1 [J] — Node environment-loading parity** — Where the repo loads `.env`, `loadConfig` (or equivalent) calls `process.loadEnvFile()` in a try/catch for Node parity.
  - _Review prompt:_ Where `.env` is loaded, does the loader call `process.loadEnvFile()` safely? (standards.md)

## TSC — TSC engineering rules

Stable engineering criteria preserved from the engineering standard.

- **TSC-1 [M] — type-check passes** — `tsc --noEmit` exits clean at the root, or each declared workspace has a clean `tsc --noEmit -p <workspace>/tsconfig.json`. (standards.md)
- **TSC-2 [M] — universal TypeScript invariants** — `tsconfig.json` exists with strict, NodeNext, noEmit, isolatedModules, esModuleInterop, and skipLibCheck invariants. (standards.md)
- **TSC-3 [J] — strictness is not weakened** — No repo loosens `strict` or the `noUnused*` and `noImplicit*` flags.
  - _Review prompt:_ Does the effective TypeScript configuration preserve the required strictness flags? (standards.md)

## BIO — BIO engineering rules

Stable engineering criteria preserved from the engineering standard.

- **BIO-1 [M] — Biome read-only gate passes** — `bunx @biomejs/biome check` exits clean. (standards.md)
- **BIO-2 [M] — Biome shared configuration** — `biome.json` exists and matches the shared formatter, JavaScript formatter, linter, and import-organisation field set. (standards.md)

## KNIP — KNIP engineering rules

Stable engineering criteria preserved from the engineering standard.

- **KNIP-1 [M] — Knip configuration exists** — `knip.json` exists with per-repo entry points and ignores. (standards.md)
- **KNIP-2 [M] — Knip gate passes** — `bunx knip` exits clean. (standards.md)

## SYNC — SYNC engineering rules

Stable engineering criteria preserved from the engineering standard.

- **SYNC-1 [M] — dependency synchronisation passes** — `bunx syncpack format --check` exits clean. (standards.md)

## DEPS — DEPS engineering rules

Stable engineering criteria preserved from the engineering standard.

- **DEPS-1 [M] — dependencies are current** — `bun outdated` reports no available updates; available updates are reviewed through `ki:engineering:conform`. (standards.md)

## GEN — GEN engineering rules

Stable engineering criteria preserved from the engineering standard.

- **GEN-1 [M] — generated surfaces share exclusions** — Known generated or vendored surfaces have matching Biome, Knip, and Markdown exclusions; no such surface is not applicable. (standards.md)

## TEST — TEST engineering rules

Stable engineering criteria preserved from the engineering standard.

- **TEST-1 [M] — test capability and Vitest profile** — Test-capable repos expose bare `test`; a recognised root Vitest config requires the canonical test, coverage, and watch scripts, while no capability is not applicable. (standards.md)
- **TEST-2 [M] — Vitest coverage thresholds** — Under the Vitest profile, coverage thresholds are exactly 100% for lines, functions, branches, and statements. (standards.md)
- **TEST-3 [M] — Vitest test-source exclusion** — Under the Vitest profile, coverage excludes `src/**/*.test.ts`. (standards.md)
- **TEST-4 [M] — Vitest monorepo scoping** — Under the Vitest profile, workspace repos scope include, exclude, and reportsDirectory to the workspace rather than a flat root. (standards.md)
- **TEST-5 [M] — Vitest coverage command passes** — Under the Vitest profile, `bun run test:coverage` exits clean when the companion script exists. (standards.md)
- **TEST-6 [J] — tests are colocated and genuinely complete** — Under the Vitest profile, tests are colocated with the source they cover and genuinely reach the 100% bar.
  - _Review prompt:_ Are tests colocated with their source and does their coverage evidence substantiate the 100% claim? (standards.md)

## BUILD — BUILD engineering rules

Stable engineering criteria preserved from the engineering standard.

- **BUILD-1 [M] — compiled-build shape** — `build` is `tsc -p tsconfig.build.json` (optionally with CLI chmod), `files` includes the scoped `dist`, and repos without compiled build are not applicable. (standards.md)
- **BUILD-2 [M] — build TypeScript configuration** — `tsconfig.build.json` extends the base with the required emit, declaration, output, import, index-access, and test-exclusion settings. (standards.md)
- **BUILD-3 [M] — compiled shared TypeScript base** — Compiled repos set the richer shared TypeScript base: es2024 target, verbatimModuleSyntax, and noUnusedLocals. (standards.md)
- **BUILD-4 [M] — CLI chmod iff rule** — `build` chmods `dist/cli/cli.js` iff `src/cli/` exists and chmods no other path. (standards.md)

## ENV — ENV engineering rules

Stable engineering criteria preserved from the engineering standard.

- **ENV-1 [M] — environment example template** — Environment-capable repos commit an `.env*.example` template; no environment capability is not applicable. (standards.md)
- **ENV-2 [M] — development NODE_ENV confinement** — `NODE_ENV=development` appears only in dev or inspect scripts, never start, build, or test. (standards.md)
- **ENV-3 [J] — real environment files are protected** — Real non-example `.env.*` files are gitignored and the loader has the Node parity call.
  - _Review prompt:_ Are real environment files ignored and is the loader Node-parity-safe? (standards.md)
- **ENV-4 [J] — XDG paths are honoured** — Config, data, cache, and state paths honour the matching `$XDG_*` variable before falling back to the specification default.
  - _Review prompt:_ Do config, data, cache, and state paths honour the appropriate XDG environment variable? (standards.md)

## TOML — TOML engineering rules

Stable engineering criteria preserved from the engineering standard.

- **TOML-1 [M] — engineering selector table** — A `[ki-engineering]` table is present. (standards.md)
- **TOML-2 [M] — engineering configuration validates down** — Every key under `[ki-engineering]` is known to the checker; an unknown key is drift. (standards.md)
