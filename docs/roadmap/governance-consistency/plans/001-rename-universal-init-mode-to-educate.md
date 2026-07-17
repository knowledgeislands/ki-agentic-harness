---
id: '001'
title: Rename universal INIT mode to Educate
status: in-progress
roadmap: governance-consistency/rename-the-universal-init-mode-to-educate
blocks: —
blocked-by: —
---

## Context

Knowledge Islands governance skills establish their target's foundation through a universal mode currently named `INIT`.

The correct name is **Educate**: it gives a target the knowledge, checkers, commands, and guidance it needs to govern itself.

This is an intentional breaking terminology migration.

At release, `educate` is the only KI-owned mode, command, flag, entry point, and documentation term; no `init` alias, compatibility shim, or migration bridge remains.

## Current state

The `init` vocabulary is embedded in governance-skill frontmatter, `scripts/init.ts`, bootstrap resolution, package scripts, generated `.ki-meta/bin/ki-init` entry points, checker help, user and developer guidance, tests, features, decisions, and the six recently bootstrapped MCP repositories.

Some non-KI uses of the word remain legitimate, including `git init` and unrelated dependency APIs; the migration must not alter those.

## Steps

1. [ ] Define and apply one precise source migration map: KI universal-mode labels, verbs, script paths, frontmatter vendor names, flags, package scripts, bootstrap/generated entry points, help output, and checker diagnostics become `educate`; preserve only unrelated external terms such as `git init`.
2. [ ] Update all canonical harness skill contracts, implementations, tests, feature and decision records, guides, agent guidance, and generated-artifact builders so `educate` is the sole supported public surface.
3. [ ] Re-vendor this harness's coverage-scoped `.ki-meta/` outputs, regenerate roadmap and skill-help projections, and run focused migration searches proving no KI-owned `init` surface remains.
4. [ ] Run the harness test suite and aggregate audit; repair all migration fallout before publishing the harness release commit.
5. [ ] Roll the committed harness revision through `mcp-ki-kb-fs`, `mcp-claude-housekeeping`, `mcp-git-audit`, `mcp-ki-kb-notion-mirror`, `mcp-m365`, and `mcp-gsuite`: re-bootstrap, conform, verify, and commit each repository's generated and guidance updates.
6. [ ] Close this plan only after every rollout repository has passed its normal test and audit gates and no active KI-owned `init` contract remains in the harness or rollout set.

## Files touched

- `skills/**/SKILL.md`, `skills/**/scripts/`, and supporting references/tests
- `package.json`, `.ki-meta/`, hooks, evals, agents, and generated help surfaces
- `docs/features/`, `docs/decisions/`, and user/developer guides
- `docs/roadmap/governance-consistency/ROADMAP.md` and generated roadmap projections
- The six MCP rollout repositories' bootstrap-generated governance surfaces

## Verify

- `rg` finds no KI-owned universal-mode `init` names, commands, flags, or help text in the harness or rollout repositories; accepted external terms are explicitly reviewed.
- `bun run test`
- `bun run ki:audit`
- Each rollout repository completes its bootstrap, conform, test, and aggregate audit commands successfully.

## Dependencies / blocks

This plan has no external blocker.

The harness source commit must exist before downstream repositories can consume the exact revised bootstrap revision.
