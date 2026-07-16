---
id: '004'
title: Roll out uniform modes across MCP repositories
status: in-progress
roadmap: foundation-tooling/roll-out-the-uniform-mode-model-across-the-mcp-repositories
blocks: —
blocked-by: —
handoff: true
tier: sonnet
readiness: pending
---

## Context

The six sibling MCP repositories are the first fleet cohort for the uniform four-mode and coverage-scoped bootstrap model. A representative pilot must prove the migration recipe before applying it repeatedly.

## Current state

The harness carries the target model and onboarding path. The six sibling repositories are clean, on `main`, and share the same pre-rollout governance shape: `[ki-repo]`, `[ki-authoring]`, `[ki-engineering]`, and `[ki-mcp]` declarations; no explicit `target_runtimes`; a `.ki-meta` vendor reference of `8240bc5629d40ca33f08f20d8141973b6984f93e`; and legacy convenience commands that call removed project-local skill script paths. This plan coordinates multiple repositories and therefore retains the clean-preflight requirement for every later mutation.

### Read-only baseline — 2026-07-16

| Repository | State | Migration surface | Pilot readout |
| --- | --- | --- | --- |
| `mcp-claude-housekeeping` | Clean `main` | Shared legacy bootstrap and command surface | Valid representative; retain as an early matched follow-up. |
| `mcp-git-audit` | Clean `main` | Shared legacy bootstrap and command surface | Valid representative; retain as an early matched follow-up. |
| `mcp-gsuite` | Clean `main` | Shared surface plus auth and record/replay tooling | Defer until the MCP-only pilot proves the recipe. |
| `mcp-ki-kb-fs` | Clean `main` | Shared legacy bootstrap and command surface | **Selected pilot:** narrow MCP-only implementation. |
| `mcp-ki-kb-notion-mirror` | Clean `main` | Shared surface; custom aggregate and empty legacy payload directory | Valid follow-up; confirms the recipe against a custom aggregate. |
| `mcp-m365` | Clean `main` | Shared surface plus auth and record/replay tooling | Defer until the MCP-only pilot proves the recipe. |

No direct access, cleanliness, or configuration blocker prevents a pilot. The selected pilot must first capture its own governed local plan and read-only audit/test baseline; a failing legacy command is migration evidence, not a reason to patch around the harness.

### Proven pilot recipe — 2026-07-16

`mcp-ki-kb-fs` completed the pilot in commit `c3315fa` with no harness defect found. The reusable migration sequence is:

1. Add `[ki-project-roadmap]` to `.ki-config.toml`, then bootstrap from the current harness source to vendor the five declared skills.
2. Replace legacy local wrappers with `.ki-meta/bin/aggregate.ts` and generated per-skill commands, retaining repository-specific server, generator, and smoke-test commands.
3. Align CI to run `ki:audit`, tests, coverage, and the repository's existing MCP smoke test; delete only superseded `scripts/ki/` wrappers.
4. Run the generated authoring conformer to refresh its owned Markdown config. Exclude generated `.ki-meta/**` from Knip and retain a `syncpack` ignore because its checker invokes it dynamically.
5. Validate aggregate audit, repository tests, MCP smoke test, focused bootstrap audit, roadmap audit, and a clean diff before committing.

The pilot has 220 passing tests, a passing 13-tool smoke check, and a zero-failure aggregate audit.

### Matched follow-up — 2026-07-16

`mcp-claude-housekeeping` applied the recipe unchanged in commits `e67466c` (roadmap adoption) and `891fc09` (governance migration). It reports 307 passing tests, a passing 39-tool smoke check, a zero-failure aggregate audit, and a passing bootstrap vendor-set audit. Its historical roadmap claimed the smoke test was absent, but the executable `scripts/smoke.ts`, package command, and CI step were already present; that documentation drift was corrected by the thematic roadmap adoption rather than expanded into feature work.

| Repository | Local plan | Governance commit | Validation |
| --- | --- | --- | --- |
| `mcp-ki-kb-fs` | Closed `foundation-tooling/001` (`0a0cec1`) | `c3315fa` | 220 tests; 13-tool smoke; aggregate and bootstrap audits pass. |
| `mcp-claude-housekeeping` | Closed `foundation-tooling/001` (`f3b7571`) | `891fc09` | 307 tests; 39-tool smoke; aggregate and bootstrap audits pass. |
| `mcp-git-audit` | Closed `foundation-tooling/001` (`06a2d7c`) | `cb8e4f5` | 161 tests; 12-tool smoke; aggregate and bootstrap audits pass. |
| `mcp-ki-kb-notion-mirror` | Closed `foundation-tooling/001` (`7b63bbe`) | `6cfb271` | 288 tests; 14-tool smoke; aggregate and bootstrap audits pass. |
| `mcp-m365` | Closed `foundation-tooling/001` (`d94206e`) | `460eb68` | 551 tests; 100% coverage; 32-tool smoke; aggregate and bootstrap audits pass. |
| `mcp-gsuite` | Closed `foundation-tooling/001` (`25fc708`) | `2ea307c` | 464 tests; 42-tool smoke; aggregate and bootstrap audits pass. |

## Steps

1. [x] Discover the six MCP repository roots and record a read-only configuration baseline: clean/dirty state, current branch, `.ki-config.toml` declarations, `.ki-meta` version, and package convenience keys.
2. [x] Select one clean representative repository whose capabilities exercise the common MCP surface. `mcp-ki-kb-fs` is selected because it is clean, MCP-only, and otherwise shares the cohort's legacy governance surface.
3. [x] Create a repository-local governed plan in the pilot, then record its executable audit/test baseline before mutation.
4. [x] Re-bootstrap the pilot, reconcile only the expected aggregate/scoped package aliases and uniform skill-mode surfaces, then run its focused tests, self-test, artifact audit, and aggregate audit.
5. [x] Review the pilot diff and failures; update the migration recipe in this coordinating plan. Escalate any harness defect back to this repository rather than patching around it per consumer.
6. [x] For each remaining clean repository, create a local plan and apply the proven recipe. Use separate worktrees only where concurrent writes to the same repository are otherwise unavoidable; never mix unrelated dirty state.
7. [x] Record the final six-repository acceptance matrix and close this coordinating plan only when every in-scope repository is clean or carries a named external blocker.

## Files touched

This coordinating plan and, during execution, repository-local roadmap plans plus the bootstrap/config/package/generated surfaces required by the proven migration in each sibling MCP repository. No sibling mutation without its own clean preflight and plan.

## Verify

Pass when the acceptance matrix names all six repositories and each reports a clean uniform-mode bootstrap, valid two-segment aggregate versus three-segment scoped names, passing repository tests, passing `ki-mcp` audit, and passing aggregate audit—or a specific external blocker accepted by the owner.

## Dependencies / blocks

Unblocked for the read-only baseline, pilot selection, and operations already covered by the hardened bootstrap publisher. A remaining generated-write gap blocks only the specific operation that invokes that writer; do not apply a local workaround in a sibling repository.

## Decisions

**Locked:** Pilot one repository before batching; every sibling gets its own local plan; preserve unrelated state; harness defects return to the harness; aggregate keys are two segments and skill-scoped keys three. The recommended tier is `sonnet`: the recipe is explicit, but cross-repository baselines and failure classification need bounded judgment.

**Escalate:** Dirty or inaccessible repositories, missing authorization, a pilot failure that indicates a harness defect, or a repository whose capabilities require a migration variant not covered by the recipe.

## Readiness

- [x] Readiness test: a cold executor can build the baseline matrix and choose a defensible pilot from this plan without mutating any sibling repository. Passed on 2026-07-16; `mcp-ki-kb-fs` is the selected pilot.
