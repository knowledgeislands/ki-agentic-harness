# Audit rubric — the common engineering layer

Line-by-line criteria for auditing a Knowledge Islands TS/Bun repo against [the engineering standard](engineering-standard.md). Each is tagged **🔧 mechanical**
(enforced by [`../scripts/audit-engineering.ts`](../scripts/audit-engineering.ts) — capture its output, don't re-derive) or **judgment** (assess by reading).
Run the checker first, then apply the judgment items. Severity: **B** blocker · **S** standard · **P** polish — see [the framework](enforcement-framework.md).

Capability conditionals only apply when the repo has the marker (tests / compiled build / env / CLI); a repo without the capability is not graded on it, and the
checker reports it as N/A, not a failure.

## Core — package.json metadata (§1)

- [ ] 🔧 S — `"type": "module"`.
- [ ] 🔧 S — `"packageManager"` starts with `bun@` (pinned patch).
- [ ] 🔧 S — `"engines.node"` floor is `>= 22`.

## Core — script families (§2)

- [ ] 🔧 S — the full `lint:*` family is present and **exact-matches** the canonical values: `lint:check`, `lint:fix`, `lint:format`, `lint:md`, `lint:package`,
      `lint:types`.
- [ ] 🔧 S — the full `deps:*` family is present and exact-matches: `deps:missing`, `deps:unused`, `deps:update`.
- [ ] 🔧 S — `clean` and `prepare` are present (`prepare` = `husky`; `clean` removes `node_modules`, and `dist` where the repo builds).
- [ ] judgment P — repo-specific scripts beyond the families are fine; the checker must not flag them. Just confirm none shadow a family name with a divergent
      definition.

## Core — Bun vs Node (§3)

- [ ] 🔧 B — **no script value contains `bun test`** (it would invoke Bun's runner, not vitest).
- [ ] judgment S — where the repo loads `.env`, `loadConfig` (or equivalent) calls `process.loadEnvFile()` in a try/catch for Node parity.

## Core — tsconfig.json (§4)

- [ ] 🔧 S — `tsconfig.json` present.
- [ ] 🔧 S — base compiler options match the shared set (es2024 target/lib, nodenext module & resolution, full `strict` + the
      `noUnused*`/`noImplicit*`/`noFallthrough*` family, `verbatimModuleSyntax`, `isolatedModules`, `skipLibCheck`, `noEmit`).
- [ ] judgment S — no per-repo loosening of `strict` or the `noUnused*`/`noImplicit*` flags.

## Core — biome.json (§5)

- [ ] 🔧 S — `biome.json` present.
- [ ] 🔧 S — matches the shared config (formatter 2-space / lineWidth 200; JS single quotes, `semicolons: asNeeded`, no trailing commas; `preset: recommended`
      with `noExplicitAny: off`; `organizeImports: on`; git VCS + `useIgnoreFile`).

## Capability: tests (§6) — marker: `vitest.config.*` or a `test` script

- [ ] 🔧 S — `test` = `vitest run`; `test:coverage` = `vitest run --coverage`; `test:watch` = `vitest`.
- [ ] 🔧 B — vitest coverage thresholds are **100%** on all four metrics (lines/functions/branches/ statements).
- [ ] 🔧 S — coverage `include` is `src/**/*.ts` and `exclude` drops `src/**/*.test.ts`. (The _additional_ excludes are artifact-specific — not graded here; the
      artifact skill grades them.)
- [ ] judgment S — tests are co-located (`src/**/*.test.ts`) and actually reach the 100% bar.

## Capability: compiled build & CLI (§7) — marker: `tsconfig.build.json` or a `tsc` build

- [ ] 🔧 S — `build` = `tsc -p tsconfig.build.json` (optionally `&& chmod …`); `files` includes `dist`.
- [ ] 🔧 S — `tsconfig.build.json` extends the base and sets `noEmit:false`, `declaration` + `declarationMap`, `outDir`/`rootDir`,
      `allowImportingTsExtensions:false`, `noUncheckedIndexedAccess:true`, excludes `**/*.test.ts`.
- [ ] 🔧 S — **CLI chmod rule**: `build` chmods `dist/cli/cli.js` **iff** `src/cli/` exists; it chmods **no other path** (in particular not a server/mcp-server
      bin). No dangling chmod, no missing chmod.

## Capability: env config (§8) — marker: `.env*.example` or `process.loadEnvFile`

- [ ] 🔧 S — a committed `.env*.example` template exists.
- [ ] 🔧 S — `NODE_ENV=development` appears only in dev/inspect scripts, never in `start`/`build`/`test`.
- [ ] judgment S — real `.env.*` (non-`.example`) is gitignored; the loader has the Node parity call.

## Core — `.ki-config.toml` (§9)

- [ ] 🔧 S — a `[knowledgeislands-engineering]` table is present (the selector for this layer).
- [ ] 🔧 S — every key under it is one the checker knows (validate-down); an unknown key is drift.

## Reporting

Produce findings grouped by severity, each row `severity · file:line-or-field · what · fix`. Lead with any **B** (a `bun test`, a sub-100% coverage threshold).
Close with a one-line verdict (compliant / minor drift / blockers) and name the **artifact-skill audit that must also run** for the repo to be fully clean (e.g.
"+ `audit-mcp.ts` for the MCP delta").
