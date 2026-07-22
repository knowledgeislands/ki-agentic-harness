---
id: 'GOV-002'
title: Batch plan readiness and start transitions
status: acceptance
roadmap: governance-consistency/batch-plan-readiness-and-start-transitions
blocks: —
blocked-by: —
---

## Context

Related plans are often approved or started as one tranche of work, but the current `ki-plan` lifecycle describes `ready` and `execute` only for one identifier at a time.

That forces artificial per-plan commits even when the user made one approval or one coordinated start decision.

## Current state

`ready <THEME>-<NNN>...` and `execute <THEME>-<NNN>...` now accept a distinct, explicit batch of plan identifiers.

Each batch validates every selected plan before any write, snapshots the affected plans and roadmaps, then publishes all transitions atomically in one commit; an owned-write failure restores the batch to its prior state.

## Steps

1. [x] Define the batch selector grammar and boundary: one or more explicit plan identifiers, no implicit discovery, one explicit user approval for each readiness batch and one explicit coordinated start for each execution batch.
2. [x] Update `ki-plan` invocation and lifecycle procedures so `ready` validates every selected open plan before publishing all `ready` transitions in one guarded transaction and one commit.
3. [x] Update `execute` so a selected ready batch validates every dependency and snapshot before publishing all `in-progress` transitions in one guarded transaction and one commit; retain ordinary per-plan step progress commits after that shared start.
4. [x] Update the `ki-repo-roadmap` plan-format/lifecycle guidance to describe the transaction and rollback expectations without duplicating `ki-plan`'s procedural detail.
5. [x] Run the roadmap and authoring audits, then serial repository verification.

## Files touched

- `skills/process/ki-plan/SKILL.md`
- `skills/process/ki-plan/references/lifecycle.md`
- `skills/general-governance/ki-repo-roadmap/references/plan-format.md`
- `skills/general-governance/ki-repo-roadmap/references/standards.md`

## Verify

1. The lifecycle documents explicit multi-plan `ready` and `execute` invocations, one-commit publication, and all-or-nothing failure behaviour.
2. Single-plan commands remain valid special cases of the same grammar.
3. Run `bun run ki:authoring:audit`, `bun run ki:skills:audit`, `bun skills/general-governance/ki-repo-roadmap/scripts/govern.ts audit .`, `bun run test`, and `bun run ki:audit` serially.

## Dependencies / blocks

This plan has no plan dependencies.

## Acceptance

### Delivered

`ki-plan` now supports an explicit batch of canonical plan identifiers for the `ready` and initial `execute` transitions.

### Summary of changes

- Added multi-plan invocation grammar to the process skill while retaining a single plan as the batch-of-one case.
- Required exact current-conversation approval for a readiness batch and an exact coordinated start for an execution batch.
- Required all selected plans and dependencies to validate before any write, then publish every status update atomically in one commit with guarded rollback.
- Recorded the same lifecycle boundary in the roadmap plan format and standard without duplicating the detailed procedure.

### Verification

- Passed `bun run ki:authoring:audit`, `bun run ki:skills:audit`, the `ki-repo-roadmap` audit, `bun run ki:bootstrap:audit`, `bun run test`, and `bun run ki:audit` serially.
- The skills and aggregate audits retain only the existing, unrelated `KI-SHAPE-7` and `GDR-KI-ARCADIA-002` warnings.
- Implementation evidence: `abcc0ce6` (`docs(lifecycle): support atomic plan transition batches`).

### Outstanding concerns

The lifecycle is a runtime-neutral process contract, not a command implementation. Any future runtime binding must preserve this explicit-selection, preflight, atomic-publication, and rollback boundary.

### Mini recap

Batching status transitions does not weaken the plan gates: all work is checked before publishing, and a single-plan command follows the same safer transaction path.
