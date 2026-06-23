# ADR-KI-HARNESS-TOOLCHAIN-001: Bun and Biome standard toolchain

**Status:** Accepted

**Date:** 2024-01-01

## Context

Knowledge Islands repos needed a consistent toolchain for installing, running scripts, linting, and type-checking TypeScript. Multiple
viable options existed (npm/yarn/pnpm vs Bun; ESLint/Prettier vs Biome). Without a standard choice, each repo carried different
configuration, different script names, and different lock files, making cross-repo tooling and the governance checkers themselves
inconsistent.

## Decision

All Knowledge Islands TypeScript repos use:

- **Bun** for package management and script execution (`bun install`, `bun run <script>`, `bun scripts/…`)
- **Biome** for linting and formatting TypeScript and JSON (`bun run lint:check` invokes Biome)
- **tsc `--noEmit`** for type-checking (`bun run lint:types`)
- **Prettier + markdownlint** for Markdown (`bun run lint:md` writes; `bun run lint:md:check` is the CI gate)

The script families (`lint:check`, `lint:types`, `lint:md`, `lint:md:check`) are required in every repo's `package.json`. Capability-gated
families (test, build, CLI) are added when the repo opts into the capability.

## Consequences

- All governance checkers can assume `bun` is available and scripts follow the standard family names.
- CI pipelines for all KI repos share the same gate commands.
- The engineering audit checker (`audit-engineering.ts`) verifies toolchain config files (biome.json, tsconfig.json) and script families.
- Switching toolchain for a single repo requires an explicit deviation declared in `.ki-config.toml`.

## References

- [skills/knowledgeislands-engineering/references/engineering-standard.md](../../skills/knowledgeislands-engineering/references/engineering-standard.md)
  §1–§5 — package.json toolchain pinning, script families, Bun vs Node, tsconfig, Biome.
