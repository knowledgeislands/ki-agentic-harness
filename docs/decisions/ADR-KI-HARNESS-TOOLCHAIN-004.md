# ADR-KI-HARNESS-TOOLCHAIN-004: knip for dependency and dead-code hygiene

**Status:** Accepted

**Date:** 2026-06-28

## Context

The engineering standard's `ki:deps:*` family used [`depcheck`](https://github.com/depcheck/depcheck) (wrapped in a
`depcheck --json | node-jq | xargs bun add -D/remove` pipeline) to find unused and missing dependencies. Two problems surfaced:

- **depcheck is static-only and config-blind.** It flagged config-referenced toolchain packages as unused. On `mcp-gmail` it reported
  `@biomejs/biome` as an unused devDependency — which the `ki:deps:unused` auto-fix would have `bun remove`d, breaking the toolchain. The
  pipeline was unsafe to run unattended, which defeats the purpose of a conformance script.
- **No dead-code coverage.** depcheck sees dependencies only; unused files, exports, types, and enum/class members went undetected, so dead
  code accumulated silently (e.g. `mcp-m365` carried 27 redundant `export default` handlers and three unused types).

[knip](https://knip.dev) is plugin-aware (it understands ~100 tools' config files, so it does not mis-flag config-referenced deps), has
first-class Bun + workspaces support, finds unused **and** unlisted dependencies, and additionally detects dead code. A trial on `mcp-gmail`
confirmed it got the toolchain right where depcheck did not, and surfaced genuine findings (an unused `json5`, phantom `google-auth-library`
imports) depcheck missed or mishandled.

## Decision

Adopt knip as the single tool for dependency **and** dead-code hygiene across every Knowledge Islands TS/Bun repo:

- `ki:deps:check` = `bunx knip --dependencies --no-config-hints` (report unused + unlisted deps); `ki:deps:fix` adds `--fix`;
  `ki:deps:update` (`bun update --latest`) is unchanged. `ki:deps:missing` / `ki:deps:unused` are removed.
- `ki:knip` = `bunx knip --no-config-hints` runs the **full** pass (dependencies + dead code) and is composed into `ki:verify`, so it gates
  CI: an unused export or phantom dependency fails the build.
- `knip` is a required `devDependency`; `depcheck` / `node-jq` are dropped. Each repo carries a per-repo `knip.json` declaring its entry
  points (so the build's `bin`/`exports`/public surface is not misread as dead code) and any intentional ignores. House defaults:
  `ignoreExportsUsedInFile: true`; `ignore` generated trees (never hand-edited); `ignoreDependencies` only for packages a meta-package vends
  transitively (e.g. `googleapis` → `google-auth-library`) or pulled via non-JS means (e.g. `tailwindcss` via a CSS `@import`), reason
  recorded.

## Consequences

- Dependency cleanup is now safe to automate, and dead code is caught at the CI gate rather than accumulating.
- Adopting it surfaced and removed real dead code and corrected dependency placement (e.g. `json5` moved to the `arcadia-website` `site`
  workspace where it is actually imported).
- Each repo owns a small `knip.json`; a new entry point that is not declared shows up immediately as a CI failure (false-positive dead code)
  rather than silent rot — the maintenance cost is a deliberately visible one.
- Supersedes the depcheck portion of [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001.md); the Bun/Biome/tsc/Prettier choices
  there are unchanged.
