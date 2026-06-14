---
name: knowledgeislands-engineering
description: >
  The shared engineering toolchain every Knowledge Islands TypeScript/Bun repo conforms to — the common build/lint/test layer the artifact-type skills build on
  rather than restate, the twin of `knowledgeislands-authoring`. Covers package.json metadata, the `lint:*`/`deps:*` script families, the Bun-install/Node-run
  split and the `bun test` trap, `tsconfig`/`biome`/`vitest` shape and 100% coverage, `.env` discipline, and the build/cli-chmod rule — plus the enforcement
  framework (mode shape, rubric tagging, checker contract, `.ki-config.toml` contract) the governance skills follow. Use to audit, conform, or scaffold a repo's
  toolchain, or check script-family / tsconfig / biome consistency. Triggers: "audit our engineering standards", "do the repos' scripts match", "why are
  lint:/deps: scripts inconsistent". For GitHub settings, security, and the `.ki-config.toml` contract use `knowledgeislands-repo`; for Markdown/TOML style use
  `knowledgeislands-authoring`; for MCP server code use `knowledgeislands-mcp`.
argument-hint: 'audit <repo> | conform <repo> | init <repo> | refresh'
---

# Knowledge Islands engineering standard

You are applying the **Knowledge Islands engineering standard** — the shared software-engineering toolchain every TypeScript/Bun repo in this work builds on,
and the **enforcement framework** every governance skill uses to define and check its own standard. It is the build/test twin of `knowledgeislands-authoring`:
that skill owns _how we write_ (Markdown/TOML style); this one owns _how we build, lint, and test_, and _how a standard is enforced_.

This is a **standard, base-agnostic Process skill**. It hard-codes no single repo; it applies to any repo carrying a `[knowledgeislands-engineering]` table in
its `.ki-config.toml` (today the 10 TS/Bun repos under `knowledgeislands/` — the seven `mcp-*` servers plus `arcadia-skills`, `arcadia-principal`,
`arcadia-website`). How it sits alongside the other skills, and where it must not overlap them, is documented once in the arcadia-skills `README.md`.

## What this skill owns

1. **The common toolchain** — the baseline every TS/Bun repo meets, plus capability conditionals that fire only when a repo opts into a capability. The full,
   quotable standard is [the engineering standard](references/engineering-standard.md); the line-by-line items are in [the rubric](references/audit-rubric.md).
2. **The enforcement framework** — the shared mechanism for defining and checking _any_ standard (the mode shape, the mechanical-checker contract, the
   mechanical/judgment rubric tagging, the `sources.md` cadence, the `.ki-config.toml` validate-down contract). It lives in
   [the enforcement framework](references/enforcement-framework.md); the other governance skills conform to it.

**Artifact-specific rules are not here.** Anything meaningful only for one artifact type (an MCP's `bin`, `server:mcp:*` scripts, coverage-exclude list, tool
surface) lives in that artifact's skill. A repo is fully audited by **composing** this skill's checker with the artifact skill's — see below.

## The common standard at a glance

- **package.json** — `type:module`, `packageManager:bun@1.3.x`, `engines.node>=22`; the full `lint:*` family (six, exact) + `deps:*` family (three) + `clean` +
  `prepare`. Extra repo-specific scripts are fine — the standard is strict about the families, permissive about additions.
- **Bun vs Node** — install/dev under Bun, `dist/` runs under Node ≥ 22. **No `bun test` anywhere** (it runs Bun's runner, not vitest). `NODE_ENV=development`
  only in dev/inspect scripts; the config loader calls `process.loadEnvFile()` in a try/catch for parity.
- **tsconfig / biome** — the universal `tsconfig.json` invariants (strict, nodenext, noEmit, …) for every repo; the fuller shared base for compiled-TS repos.
  `biome.json` matching the shared formatter/linter fields.
- **Capability conditionals** — tests ⇒ `vitest run` + 100% coverage; compiled build ⇒ `build`/`tsconfig.build.json`/`files` + the **cli-chmod rule** (`build`
  chmods `dist/cli/cli.js` iff `src/cli/`, and never a server bin); env ⇒ `.env*.example` + `NODE_ENV`-in-dev.

## Composition — how a repo gets fully audited

The checker is the **common layer**; each artifact skill audits its own delta. They compose by being **run in sequence**, never by importing each other (so each
stays valid when symlinked standalone):

```text
engineering:audit <repo>     →  common toolchain layer (this skill, all 10 TS repos)
  then audit-mcp.ts <repo>   →  MCP delta (knowledgeislands-mcp, the 7 mcp-* repos)
```

A repo is "clean" only when **every applicable** skill's audit passes. The `.ki-config.toml` tables are the selector: `[knowledgeislands-engineering]` marks the
common layer; the artifact skill applies by its own convention.

## Operating modes

Carries the universal **AUDIT · CONFORM · REFRESH**, plus **INIT** (scaffold a new TS repo's toolchain). Infer the mode from the request; ask if unclear. (Modes
are named and alphabetical.) The mode shape itself is defined in [the enforcement framework](references/enforcement-framework.md).

### Mode AUDIT — check a repo's common toolchain

1. **Run the mechanical checker**: `bun <skill>/scripts/audit-engineering.ts <repo>` (or `node` after a build). It reports the package.json metadata + script
   families, the `bun test` trap, `tsconfig`/`biome`, and the capability conditionals (tests / compiled build + cli-chmod / env), and validates-down the
   `[knowledgeislands-engineering]` table. Capture its output; don't re-derive the mechanical items.
2. **Apply the judgment items** in [the rubric](references/audit-rubric.md): no per-repo loosening of `strict`/the `noImplicit*` family, the Node `.env` parity
   call where env is loaded, tests actually reaching the 100% bar, repo-specific scripts not shadowing a family.
3. **Name the artifact-skill audit that must also run** for the repo to be fully clean (e.g. `audit-mcp.ts` for an MCP repo), and **report** by location →
   criterion → fix, grouped by severity.

### Mode CONFORM — bring a repo's toolchain into line

1. Run **AUDIT** first, so you change against a known gap list.
2. Fix the gaps in place — restore the exact `lint:*`/`deps:*` families, the `tsconfig`/`biome`/`vitest` shape, the build/cli-chmod rule — **copying from the
   closest healthy sibling** rather than inventing. Add the `[knowledgeislands-engineering]` table if missing.
3. Re-run the checker; settle the repo's own `bun run lint:check` / `lint:types` (and `lint:md` for any docs).

### Mode INIT — scaffold a new TS/Bun repo's toolchain

Copy the `package.json` script families, `tsconfig.json`/`biome.json` (and `tsconfig.build.json`/`vitest.config.ts` if it compiles/tests), and the
`[knowledgeislands-engineering]` table from the closest healthy sibling; adapt only names/paths. Then run the checker.

### Mode REFRESH — re-anchor the toolchain pins to their sources

The standard pins volatile versions (Bun, Node, Biome, TypeScript, vitest, syncpack, markdownlint). Run periodically (monthly, with the other skills), or when
asked "are the engineering standards current".

1. **Read [the source list](references/sources.md)** — each pin with its `last reviewed` date.
2. **Re-fetch each** (WebFetch / WebSearch) and diff against the standard + rubric + [`scripts/audit-engineering.ts`](scripts/audit-engineering.ts): a bumped
   Bun or Biome line, a TypeScript option deprecation, a changed default.
3. **Propose a diff**; confirm before writing.
4. **Update [the source list](references/sources.md)** — bump each `last reviewed` date and the `## Last review` block. What changed goes in the commit.

## Boundaries (out of scope, with their homes)

Reciprocal off-ramps — each names this skill back for the engineering layer:

- **A repo's GitHub settings, security, the universal local files (README/LICENSE/.gitignore/.editorconfig), and the `.ki-config.toml` _contract_** →
  `knowledgeislands-repo`. This skill owns the _engineering_ toolchain inside the repo; `knowledgeislands-repo` owns the repo's _configuration_ and its
  `.ki-config.toml` contract (this skill only reads its own table within it).
- **Markdown / TOML _formatting_ style** (including what the `lint:md` pass produces) → `knowledgeislands-authoring`. This skill owns that the toolchain which
  runs lint exists and is wired; authoring owns the prose/format conventions it enforces.
- **Artifact-specific code and deltas** — MCP `src/` layout, tool naming, the access gate, security invariants, the coverage-exclude list →
  `knowledgeislands-mcp` (and future artifact skills). They build on this common layer and add their own.
