---
id: '002'
title: Enforce generated-code exclusions in ki-engineering
status: in-progress
roadmap: foundation-tooling/enforce-generated-code-exclusions-in-ki-engineering
blocks: —
blocked-by: —
---

## Context

The engineering standard already describes generated and vendored exclusions, but the common checker does not consistently prove that Biome, knip, and Markdown tooling exclude those surfaces when they exist.

## Current state

Generated-code handling depends on examples and individual repository configuration, so a newly introduced generated or vendored tree can silently be included in tools that should not govern it.

## Steps

1. [x] Define the exact generated and vendored tree signals and the required exclusions for Biome, knip, and Markdown tooling.
2. [x] Add focused `ki-engineering` audit logic and fixtures for present, absent, and partially excluded trees.
3. [x] Update the engineering standard and rubric with stable finding codes and repair guidance.
4. [x] Re-vendor the harness checker and run focused tests plus aggregate gates.
5. [ ] After this source change ships, re-bootstrap affected TypeScript/Bun sibling repositories, add their selective exclusions, and verify their scoped audits before closing the plan.

## Files touched

- `skills/foundations/ki-engineering/`
- `.ki-meta/skills/ki-engineering/`
- `docs/guides/` only if user-facing guidance needs adjustment

## Verify

- A repository with generated or vendored trees fails when any required tool exclusion is absent.
- A fully excluded fixture passes, while a repository without those trees remains unaffected.
- Affected sibling repositories receive the shipped checker and have clean scoped audits after their config updates.
- `bun skills/foundations/ki-engineering/scripts/audit.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

Independent of the documentation plan. It must preserve deliberate local development links as a supported local-author behaviour.
