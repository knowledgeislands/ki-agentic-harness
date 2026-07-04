# ADR-KI-HARNESS-TOOLCHAIN-001: Bun, Biome, and knip standard toolchain

**Status:** Accepted

**Mutability:** open

**Date:** 2026-06-28

## Context

Knowledge Islands repos need a consistent toolchain for installing, running scripts, linting, type-checking, and dependency/dead-code hygiene across TypeScript. Multiple viable options exist (npm/yarn/pnpm vs Bun; ESLint/Prettier vs Biome; depcheck vs knip). Without a single standard, each repo would carry different configuration, script names, and lock files, making cross-repo tooling and the governance checkers themselves inconsistent.

## Decision

All Knowledge Islands TypeScript repos use:

- **Bun** for package management and script execution (`bun install`, `bun run <script>`, `bun scripts/…`).
- **Biome** for linting and formatting TypeScript and JSON (`bun run ki:lint:check`).
- **tsc `--noEmit`** for type-checking (`bun run ki:lint:types`).
- **Prettier + markdownlint** for Markdown (`bun run ki:lint:md` writes; `bun run ki:lint:md:check` is the CI gate).
- **knip** for dependency **and** dead-code hygiene. knip is plugin-aware (it reads ~100 tools' config files, so it does not mis-flag config-referenced deps), has first-class Bun + workspaces support, and finds unused/unlisted dependencies plus dead files, exports, types, and members. `ki:deps:check` = `bunx knip --dependencies --no-config-hints`; `ki:deps:fix` adds `--fix`; `ki:deps:update` = `bun update --force`. `ki:knip` = `bunx knip --no-config-hints` runs the full pass and is composed into `ki:verify`, so an unused export or phantom dependency fails CI. Each repo carries a small `knip.json` declaring its entry points and any intentional ignores (house defaults: `ignoreExportsUsedInFile: true`; ignore generated trees; `ignoreDependencies` only for transitively-vended or non-JS-imported packages, with a recorded reason).

The script families (`ki:lint:check`, `ki:lint:types`, `ki:lint:md`, `ki:lint:md:check`, `ki:deps:*`, `ki:knip`) are required in every repo's `package.json`. Capability-gated families (test, build, CLI) are added when the repo opts into the capability.

## Consequences

- All governance checkers can assume `bun` is available and scripts follow the standard family names.
- CI pipelines for all KI repos share the same gate commands; dependency cleanup is safe to automate and dead code is caught at the gate rather than accumulating.
- The engineering audit checker (`audit-engineering.ts`) verifies toolchain config files (`biome.json`, `tsconfig.json`, `knip.json`) and script families.
- A new entry point not declared in `knip.json` surfaces immediately as a CI failure (false-positive dead code) rather than silent rot — a deliberately visible maintenance cost.
- Switching toolchain for a single repo requires an explicit deviation declared in `.ki-config.toml`.

## References

- [skills/ki-engineering/references/engineering-standard.md](../../skills/ki-engineering/references/engineering-standard.md) §1–§5 — package.json toolchain pinning, script families, Bun vs Node, tsconfig, Biome, knip.
- [knip.dev](https://knip.dev) — dependency and dead-code analysis.

## Changelog

- 2026-07-02 — realigned to present state; folded in knip for dependency + dead-code hygiene (previously recorded as ADR-KI-HARNESS-TOOLCHAIN-004).
- 2026-07-04 — split dependency freshness into two idioms by intent. `ki:deps:refresh` (`bun update --force`) is the routine in-range refresh now composed into `ki:conform` — it never crosses a semver major or writes `latest` into `bun.lock`. `ki:deps:update` (`bun update --latest && bun install`) is the deliberate cross-major upgrade run on purpose; the trailing `bun install` re-pins `bun.lock` so `--latest`'s transient `latest` markers never reach a commit. (`ki:conform` previously composed `ki:deps:update` = `bun update --latest`, which bumped majors on every conform and polluted the lock.)
