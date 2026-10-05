---
id: KI-HARNESS-GOV-138
area: GOV
title: Govern Bun runtime freshness
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-05T23:00:00Z
updated_at: 2026-10-05T23:00:00Z
---

# KI-HARNESS-GOV-138: Govern Bun runtime freshness

## Goal

Repositories run a current Bun release, and an audit notices when the pinned runtime falls behind, just as it already does for package dependencies.

## Context

`DEPS-1` in `skills/governance/ki-engineering/scripts/rubric/items/dependencies.ts` reads only `bun outdated`, which covers declared packages but not the runtime itself. The runtime is pinned separately, in `packageManager` (`bun@1.4.1`) and the `mise` `bun` tool version, and the `ki-engineering` CONFORM scaffold writes `bun@1.4.1` in `scripts/rubric/contexts/engineering.ts`.

The 2026-10-06 `ki-engineering` REFRESH found Bun 1.4.2, published on 2026-09-05, already past the 14-day adoption window, while the harness and every configured repository still pinned 1.4.1. No audit criterion reported it. `references/sources.md` records the gap.

## Boundary

In scope: bumping the harness and its CONFORM scaffold to the current Bun release; extending runtime coverage, either within `DEPS-1` or as a new criterion, with the same 14-day adoption window and `dependency_holds` route; and raising receiver-owned handoffs for each repository's own bump.

Out of scope: other runtimes such as Node, and each repository's own bump, which its owner makes.

## Discussion

### Evidence source

The upstream latest release can come from the GitHub releases of `oven-sh/bun` or the npm `bun` package. Whichever is chosen, an unavailable source reports unknown, never PASS, consistent with `DEPS-1`.

### Pin agreement

`packageManager` and `mise` can disagree. The check should probably require them to agree as well as be current, so a bump cannot land in one place only.
