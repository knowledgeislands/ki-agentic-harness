# Audit rubric — the common engineering layer

Line-by-line criteria for auditing a Knowledge Islands TS/Bun repo against [the engineering standard](engineering-standard.md). Each is
tagged **🔧 mechanical** (enforced by [`../scripts/audit-engineering.ts`](../scripts/audit-engineering.ts) — capture its output, don't
re-derive) or **judgment** (assess by reading). Run the checker first, then apply the judgment items. Severity: **FAIL** (ship-stopper) ·
**WARN** (should-fix divergence) · **POLISH** (minor / cosmetic) — the shared ladder, defined in `knowledgeislands-engineering`'s
[`enforcement-framework.md`](enforcement-framework.md) §2.

Capability conditionals only apply when the repo has the marker (tests / compiled build / env / CLI); a repo without the capability is not
graded on it, and the checker reports it as N/A, not a failure.

## Core — package.json & toolchain pinning (§1)

- [ ] 🔧 WARN — `"type": "module"`.
- [ ] 🔧 WARN — `"packageManager"` starts with `bun@` (pinned patch).
- [ ] 🔧 WARN — `"engines.node"` floor is `>= 22`.
- [ ] 🔧 WARN — a root `mise.toml` pins both `node` and `bun` under `[tools]`.
- [ ] 🔧 WARN — the `mise.toml` `bun` version **equals** the `packageManager` Bun version (the drift pair).
- [ ] 🔧 POLISH — no legacy single-tool pin file (`.node-version`, `.nvmrc`, `.bun-version`) lingers beside `mise.toml` (warn).
- [ ] 🔧 WARN — where the repo has `.github/workflows/ci.yml`, it installs the toolchain via `jdx/mise-action` and hardcodes no
      `bun-version:` / `node-version:`.
- [ ] 🔧 WARN — that `ci.yml` runs the common gate steps `bun run lint:check`, `bun run lint:types`, and `bun run lint:md:check` (plus
      `bun run test:coverage` where the repo has tests). `lint:md:check` is the Markdown gate; a following `test:smoke` step is the MCP
      delta (asserted by `audit-mcp.ts`, not here).

## Core — script families (§2)

- [ ] 🔧 WARN — the full `lint:*` family is present and **exact-matches** the canonical values: `lint:check`, `lint:fix`, `lint:format`,
      `lint:md`, `lint:md:check`, `lint:package`, `lint:types`.
- [ ] 🔧 WARN — the full `deps:*` family is present and exact-matches: `deps:missing`, `deps:unused`, `deps:update`.
- [ ] 🔧 WARN — `clean` and `prepare` are present (`prepare` = `husky`; `clean` removes `node_modules`, and `dist` where the repo builds).
- [ ] judgment POLISH — repo-specific scripts beyond the families are fine; the checker must not flag them. Just confirm none shadow a
      family name with a divergent definition.

## Core — Bun vs Node (§3)

- [ ] 🔧 FAIL — **no script value contains `bun test`** (it would invoke Bun's runner, not vitest).
- [ ] judgment WARN — where the repo loads `.env`, `loadConfig` (or equivalent) calls `process.loadEnvFile()` in a try/catch for Node
      parity.

## Core — tsconfig.json (§4)

- [ ] 🔧 WARN — `tsconfig.json` present.
- [ ] 🔧 WARN — base compiler options match the shared set (es2024 target/lib, nodenext module & resolution, full `strict` + the
      `noUnused*`/`noImplicit*`/`noFallthrough*` family, `verbatimModuleSyntax`, `isolatedModules`, `skipLibCheck`, `noEmit`).
- [ ] judgment WARN — no per-repo loosening of `strict` or the `noUnused*`/`noImplicit*` flags.

## Core — biome.json & prettier config (§5)

- [ ] 🔧 WARN — `biome.json` present.
- [ ] 🔧 WARN — matches the shared config (formatter 2-space / lineWidth 200; JS single quotes, `semicolons: asNeeded`, no trailing commas;
      `preset: recommended` with `noExplicitAny: off`; `organizeImports: on`; git VCS + `useIgnoreFile`).
- [ ] 🔧 WARN — `.prettierrc.json` present (Prettier backs `lint:md`).
- [ ] 🔧 WARN — it matches the shared shape: `proseWrap: always`, `printWidth: 140`, `semi: false`, `singleQuote: true`,
      `trailingComma: none`, and the `*.md` markdown override.

## Capability: tests (§6) — marker: `vitest.config.*` or a `test` script

> Executable helper scripts (`scripts/`, eval harnesses, a skill's bundled `audit-*.ts` / `lint-*.ts` checkers) are tooling, not shipped
> `src/` — coverage is scoped to `src/**` and never matches them. A repo whose only TypeScript is such scripts does not trigger this
> capability; its lack of tests is conformant, not a gap. Do not flag it. (§6)

- [ ] 🔧 WARN — `test` = `vitest run`; `test:coverage` = `vitest run --coverage`; `test:watch` = `vitest`.
- [ ] 🔧 FAIL — vitest coverage thresholds are **100%** on all four metrics (lines/functions/branches/ statements).
- [ ] 🔧 WARN — coverage `include` is `src/**/*.ts` and `exclude` drops `src/**/*.test.ts`. (The _additional_ excludes are artifact-specific
      — not graded here; the artifact skill grades them.)
- [ ] judgment WARN — tests are co-located (`src/**/*.test.ts`) and actually reach the 100% bar.

## Capability: compiled build & CLI (§7) — marker: `tsconfig.build.json` or a `tsc` build

- [ ] 🔧 WARN — `build` = `tsc -p tsconfig.build.json` (optionally `&& chmod …`); `files` includes `dist`.
- [ ] 🔧 WARN — `tsconfig.build.json` extends the base and sets `noEmit:false`, `declaration` + `declarationMap`, `outDir`/`rootDir`,
      `allowImportingTsExtensions:false`, `noUncheckedIndexedAccess:true`, excludes `**/*.test.ts`.
- [ ] 🔧 WARN — **CLI chmod rule**: `build` chmods `dist/cli/cli.js` **iff** `src/cli/` exists; it chmods **no other path** (in particular
      not a server/mcp-server bin). No dangling chmod, no missing chmod.

## Capability: env config (§8) — marker: `.env*.example` or `process.loadEnvFile`

- [ ] 🔧 WARN — a committed `.env*.example` template exists.
- [ ] 🔧 WARN — `NODE_ENV=development` appears only in dev/inspect scripts, never in `start`/`build`/`test`.
- [ ] judgment WARN — real `.env.*` (non-`.example`) is gitignored; the loader has the Node parity call.

## Core — `.ki-config.toml` (§9)

- [ ] 🔧 WARN — a `[knowledgeislands-engineering]` table is present (the selector for this layer).
- [ ] 🔧 WARN — every key under it is one the checker knows (validate-down); an unknown key is drift.

## Reporting

Produce findings grouped by severity, each row `severity · file:line-or-field · what · fix`. Lead with any **FAIL** (a `bun test`, a
sub-100% coverage threshold). Close with a one-line verdict (compliant / minor drift / blockers) and name the **artifact-skill audit that
must also run** for the repo to be fully clean (e.g. "+ `audit-mcp.ts` for the MCP delta").
