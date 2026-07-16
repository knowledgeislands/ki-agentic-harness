---
id: '004'
title: Pilot uniform modes across MCP repositories
status: open
roadmap: foundation-tooling/sweep-the-mcp-repos-onto-the-uniform-mode-model-re-check-naming-across-surfaces
blocks: —
blocked-by: foundation-tooling/002, foundation-tooling/003
handoff: true
tier: sonnet
readiness: pending
---

## Context

The six sibling MCP repositories are the first fleet cohort for the uniform four-mode and coverage-scoped bootstrap model. A representative pilot must prove the migration recipe before applying it repeatedly.

## Current state

The harness carries the target model and onboarding path; sibling repositories remain on the prior layout. Their repository paths, local changes, declarations, and exact baseline failures must be discovered at execution time. This plan coordinates multiple repositories and therefore must not assume they are all writable or clean.

## Steps

1. After plans 002–003 close, discover the six MCP repository roots and record a read-only baseline matrix: clean/dirty state, current branch, `.ki-config.toml` declarations, `.ki-meta` version, package convenience keys, and audit/test results.
2. Select one clean representative repository whose capabilities exercise the common MCP surface; document why it is representative and create a repository-local governed plan there before mutation.
3. Re-bootstrap the pilot, reconcile only the expected aggregate/scoped package aliases and uniform skill-mode surfaces, then run its focused tests, self-test, artifact audit, and aggregate audit.
4. Review the pilot diff and failures; update the migration recipe in this coordinating plan. Escalate any harness defect back to this repository rather than patching around it per consumer.
5. For each remaining clean repository, create a local plan and apply the proven recipe. Use separate worktrees only where concurrent writes to the same repository are otherwise unavoidable; never mix unrelated dirty state.
6. Record the final six-repository acceptance matrix and close this coordinating plan only when every in-scope repository is clean or carries a named external blocker.

## Files touched

This coordinating plan and, during execution, repository-local roadmap plans plus the bootstrap/config/package/generated surfaces required by the proven migration in each sibling MCP repository. No sibling mutation without its own clean preflight and plan.

## Verify

Pass when the acceptance matrix names all six repositories and each reports a clean uniform-mode bootstrap, valid two-segment aggregate versus three-segment scoped names, passing repository tests, passing `ki-mcp` audit, and passing aggregate audit—or a specific external blocker accepted by the owner.

## Dependencies / blocks

Blocked by plans `foundation-tooling/002` and `foundation-tooling/003`. It is the release-baseline pilot for broader fleet adoption.

## Decisions

**Locked:** Pilot one repository before batching; every sibling gets its own local plan; preserve unrelated state; harness defects return to the harness; aggregate keys are two segments and skill-scoped keys three. The recommended tier is `sonnet`: the recipe is explicit, but cross-repository baselines and failure classification need bounded judgment.

**Escalate:** Dirty or inaccessible repositories, missing authorization, a pilot failure that indicates a harness defect, or a repository whose capabilities require a migration variant not covered by the recipe.

## Readiness

- [ ] Readiness test: a cold executor can build the baseline matrix and choose a defensible pilot from this plan without mutating any sibling repository.
