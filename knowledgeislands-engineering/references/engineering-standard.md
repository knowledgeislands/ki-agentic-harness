# The Knowledge Islands engineering standard

The shared **engineering toolchain** every Knowledge Islands TypeScript/Bun repo conforms to — the common layer the artifact-type skills
(`knowledgeislands-mcp`, and future ones) build on rather than restate. It is the build/test twin of `knowledgeislands-authoring` (which owns _how we write_);
this owns _how we build, lint, and test_.

This file is the **normative, quotable** standard. The checkable items live in [the rubric](audit-rubric.md); the mechanical checks are in
[`../scripts/audit-engineering.ts`](../scripts/audit-engineering.ts); the meta-standard for how this (and any) standard is defined and enforced is
[the enforcement framework](enforcement-framework.md).

## Contents

- [Scope, layers, and composition](#scope-layers-and-composition)
- [1. package.json & toolchain pinning (core)](#1-packagejson--toolchain-pinning-core)
- [2. The script families (core)](#2-the-script-families-core)
- [3. Bun vs Node (core)](#3-bun-vs-node-core)
- [4. tsconfig.json (core + profiled)](#4-tsconfigjson-core--profiled)
- [5. biome.json (core)](#5-biomejson-core)
- [6. Testing (capability: the repo ships tests)](#6-testing-capability-the-repo-ships-tests)
- [7. Compiled build & CLI](#7-compiled-build--cli-capability-the-repo-compiles-to-dist)
- [8. .env discipline](#8-env-discipline-capability-the-repo-reads-env-config)
- [9. .ki-config.toml](#9-ki-configtoml--knowledgeislands-engineering-core)

## Scope, layers, and composition

The standard applies to any repo carrying a `[knowledgeislands-engineering]` table in its `.ki-config.toml` (§9) — today the 10 TS/Bun repos under
`knowledgeislands/`. It is split into:

- **Core** — the baseline every such repo MUST meet, unconditionally (§1–§5).
- **Capability conditionals** — common rules that fire only when the repo opts into a capability, detected by a marker in the repo (§6–§8). A repo with no tests
  is not required to have a test script; a repo that _does_ ship tests must use vitest with 100% coverage. The conditional is still _common_ engineering policy
  — it just doesn't apply where the capability is absent.

**Artifact-specific rules are NOT here.** Anything meaningful only for one artifact type — the MCP coverage-exclude list, `bin → dist/mcp-server/index.js`,
`server:mcp:*` scripts, `exports` per `main/<concern>` — lives in that artifact's skill (e.g. `knowledgeislands-mcp`). A repo is fully audited by **composing**
this standard's checker with the artifact skill's checker (run `engineering:audit` for the common layer, then e.g. `audit-mcp.ts` for the MCP delta); the
checkers compose by being run in sequence, never by importing each other.

The capability markers, and what each unlocks:

| Capability     | Marker in the repo                                              | Adds (this standard)                       |
| -------------- | --------------------------------------------------------------- | ------------------------------------------ |
| Tests          | `vitest.config.*` present, or a `test` script                   | §6 — vitest runner + 100% coverage         |
| Compiled build | `tsconfig.build.json` present, or `build` is a `tsc` invocation | §7 — `build`/`files`/`tsconfig.build.json` |
| Env config     | `.env*.example` present, or `process.loadEnvFile` used          | §8 — `.env` discipline + `NODE_ENV`-in-dev |
| CLI binary     | `src/cli/` present                                              | §7 — `build` chmods `dist/cli/cli.js`      |

## 1. package.json & toolchain pinning (core)

In package.json:

- `"type": "module"`.
- `"packageManager": "bun@1.3.x"` (pinned patch; bump in one place on the house Bun upgrade).
- `"engines": { "node": ">=22.0.0" }` — `dist/` runs under Node ≥ 22 even though install/dev use Bun.

Repos that publish a compiled library/server add `"main"`, `"files": ["dist"]`, `"bin"`, and `"exports"` — but the _shape_ of those is artifact-specific (§7
covers only the build mechanics).

**Toolchain pin (`mise.toml`).** Every repo carries a root `mise.toml` with a `[tools]` table pinning both the **node** and **bun** versions — the actual
runtimes [mise](https://mise.jdx.dev/) puts on `PATH` when you `cd` in, and that CI installs via `jdx/mise-action`, so the dev shell and CI resolve
byte-identically. Two rules:

- The pinned **`bun` MUST equal the `packageManager` Bun version** above. Bun is named in both files, so they are the standing drift pair — the checker compares
  them. (`node` is pinned _exactly_ here even though `engines.node` only states a `>= 22` floor.)
- `mise.toml` is the **single** toolchain pin. No legacy single-tool file — `.node-version`, `.nvmrc`, `.bun-version` — may linger beside it; each is redundant
  and can silently diverge, so the checker warns on any it finds.

Where the repo has CI (`.github/workflows/ci.yml`), the workflow installs the toolchain through `jdx/mise-action` and pins **no** version itself (no
`bun-version:` / `node-version:`) — a hardcoded version there bypasses `mise.toml` and is drift.

## 2. The script families (core)

Two prefixed families are **required, verbatim, in every repo** — they are byte-identical across all 10 today, so the checker exact-matches them. Copy, never
paraphrase:

```jsonc
"lint:check":   "bunx @biomejs/biome check",
"lint:fix":     "bunx @biomejs/biome check --write --unsafe",
"lint:format":  "bunx @biomejs/biome format --write",
"lint:md":      "bunx prettier --write \"**/*.md\" --ignore-path .gitignore && bunx markdownlint-cli2",
"lint:package": "bunx syncpack format",
"lint:types":   "tsc --noEmit",
"deps:missing": "bunx depcheck --json | bunx node-jq --sort-keys '.' | bunx node-jq '.missing | keys | .[]' | xargs bun add -D",
"deps:unused":  "bunx depcheck --json | bunx node-jq --sort-keys '.' | bunx node-jq '.devDependencies[]' | xargs bun remove",
"deps:update":  "bun update --latest",
"clean":        "rm -rf {dist,node_modules}",   // a repo with no dist may use "rm -rf node_modules"
"prepare":      "husky"
```

- `lint:*` — the full six. `lint:check`/`lint:fix`/`lint:format` are Biome; `lint:md` is Prettier + markdownlint-cli2; `lint:package` is syncpack; `lint:types`
  is `tsc --noEmit`.
- `deps:*` — the full three. They were "optional" in the older MCP standard; promoted to **required** here because they are universal across the repo set and
  the point is consistency.
- A repo MAY add any number of **repo-specific scripts** (`eval`, `skills:*`, `repo:audit`, `server:auth:*`, `dev:css`, …). Extra scripts are never drift; the
  checker is permissive about them and strict only about the required families.

## 3. Bun vs Node (core)

Install and dev use **Bun (≥ 1.3)**; the compiled `dist/` runs under **Node (≥ 22)** — that is what a consumer launches. Two standing traps:

- **No `bun test`, anywhere.** `bun run test` runs vitest; bare `bun test` silently invokes Bun's own runner. No script value may contain `bun test`; the test
  script (where present, §6) is `vitest run`.
- **`.env` parity.** Bun auto-loads `.env.${NODE_ENV}`; Node does not, so a repo that loads `.env` files calls `process.loadEnvFile()` (wrapped in try/catch —
  Bun has no such API and throws `TypeError`). `NODE_ENV=development` is set **only** by dev/inspect scripts, so production ignores `.env.*` and config must
  come from the launcher's environment (§8).

## 4. tsconfig.json (core + profiled)

`tsconfig.json` is present in every repo. Two tiers, because a web/JS repo legitimately differs from a Node/TS-server repo:

- **Universal invariants (core, all 10 repos):** `strict: true`; `module` & `moduleResolution` `nodenext`; `noEmit: true`; `isolatedModules: true`;
  `esModuleInterop: true`; `skipLibCheck: true`; `forceConsistentCasingInFileNames: true`. These hold even for the 11ty web repo.
- **The shared Node/TS base (compiled-TS profile — §7):** repos that compile TS to `dist/` (they carry `tsconfig.build.json`) additionally match the
  byte-identical base the `mcp-*` repos share: `target`/`lib` `es2024`, `moduleDetection: force`, `types: ["node", "vitest/globals"]`,
  `allowImportingTsExtensions`, `verbatimModuleSyntax`, full `noUnusedLocals` / `noUnusedParameters` / `noImplicitReturns` / `noImplicitOverride` /
  `noFallthroughCasesInSwitch`, `include: ["**/*.ts"]`, `exclude: ["node_modules", "dist"]`. A web repo (esnext, `allowJs`, JSX) is exempt from this base.

## 5. biome.json (core)

Present and matching the shared config: git VCS + `useIgnoreFile`; formatter `indentStyle: space`, `indentWidth: 2`, `lineWidth: 200`; JS formatter
`quoteStyle: single`, `semicolons: asNeeded`, `trailingCommas: none`; linter `preset: recommended` with `suspicious.noExplicitAny: off`;
`assist.source.organizeImports: on`. The `$schema` pins the Biome version — bump it on the house Biome upgrade.

## 6. Testing (capability: the repo ships tests)

When a repo has a `vitest.config.*` (or a `test` script):

- `"test": "vitest run"`, `"test:coverage": "vitest run --coverage"`, `"test:watch": "vitest"`.
- `vitest.config.ts`: `globals: true`, `environment: 'node'`, `include: ['src/**/*.test.ts']`, `fileParallelism: false`, v8 coverage with **100% thresholds on
  all four metrics** (lines / functions / branches / statements). Tests are co-located (`src/**/*.test.ts`).
- The coverage `exclude` list always drops `src/**/*.test.ts`; **which other modules are excluded is artifact-specific** (e.g. an MCP excludes
  `mcp-server/index.ts`, `tools/**`, `utils/annotations.ts`) and is owned by that artifact's skill, not here.

## 7. Compiled build & CLI (capability: the repo compiles to `dist/`)

When a repo ships a compiled `dist/` (it has `tsconfig.build.json`, or `build` is a `tsc` call):

- `"build": "tsc -p tsconfig.build.json"`. `"files": ["dist"]`.
- `tsconfig.build.json` extends `tsconfig.json`: `noEmit: false`, `declaration` + `declarationMap`, `outDir: ./dist`, `rootDir: ./src`,
  `allowImportingTsExtensions: false`, `noUncheckedIndexedAccess: true`, `exclude: [..., "**/*.test.ts"]`.
- **CLI chmod rule.** `build` appends `&& chmod +x dist/cli/cli.js` **iff** `src/cli/` exists, and chmods **nothing else** — in particular **not** a
  server/`mcp-server` bin. (Package managers set `+x` on `bin` targets at install, and launchers invoke via `node`, so the entry bin needs no chmod; the
  executable CLI does.) A `build` that chmods a path with no matching `src/` dir, or omits the chmod while `src/cli/` exists, is drift.

A non-`tsc` build (e.g. arcadia-website's 11ty `build`) is outside this section — the repo compiles by another toolchain; only the families in §2 and the core
(§1–§5) apply.

## 8. .env discipline (capability: the repo reads env config)

When a repo reads environment config (it has `.env*.example`, or calls `process.loadEnvFile`):

- A committed `.env*.example` template; real `.env.*` files are gitignored.
- `NODE_ENV=development` appears **only** in dev/inspect scripts (never in `start`/`build`/`test`).
- The config loader calls `process.loadEnvFile()` inside a try/catch for Node/Bun parity (§3).

The variable **names/prefix** and which vars exist are artifact-specific (e.g. an MCP uses `MCP_<APP>_*` with the shared access-level + audit-log block) and
live in that artifact's skill.

## 9. `.ki-config.toml` — `[knowledgeislands-engineering]` (core)

A governed repo declares a `[knowledgeislands-engineering]` table. Presence marks "the engineering standard applies here" (the selector for the common layer).
Following the `.ki-config.toml` table-per-skill contract (owned by `knowledgeislands-repo`), the table is minimal — capabilities are auto-detected from markers
(above), so no profile field is needed. A repo that deliberately diverges declares it explicitly:

```toml
[knowledgeislands-engineering]
# This repo fully conforms, so it declares no overrides. To diverge from a check,
# add a [knowledgeislands-engineering.checks] table with one boolean per check id
# (false = waive), and say why in a comment.
```

The checker **validates down**: every key under `[knowledgeislands-engineering]` must be one it knows, so a typo or a stale override surfaces rather than
silently doing nothing.
