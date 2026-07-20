---
id: 'FND-011'
title: Preserve committed completion records before plan removal
status: acceptance
roadmap: foundation-tooling/preserve-committed-completion-records-before-plan-removal
blocks: —
blocked-by: —
---

## Context

The current `open` state conflates a newly authored plan with one the user has reviewed and deliberately authorised for execution. Manual acceptance then proves a completed plan is ready to close, but immediate removal leaves no dedicated committed record of its outcome in the normal plan lifecycle.

FND-004, FND-005, and FND-009 demonstrated the desired history manually: first commit a reviewable `done` record, then remove related completed plans and their roadmap items together at the end of the work tranche.

## Current state

The lifecycle is `open` → `in-progress` → `acceptance` → transient `done`. A plan begins `open` immediately on creation and can therefore be executed without a distinct ready-to-start decision. The plan format permits transient `status: done`, while the documented `ki-plan done` procedure removes the plan, local roadmap reference, canonical item, and generated projections in one transaction.

The roadmap validator accepts `done` but does not require a `## Done` outcome. The generated active-plan index can render a `done` plan, as the recorded transition demonstrated; it has no batch-pruning operation. `prune` is not, and must not become, a plan status: it is an explicit operation over already-done records.

## Steps

1. ✓ Define the visible lifecycle as `open` → `ready` → `in-progress` → `acceptance` → `done`. `open` is a newly authored or materially revised plan awaiting a user's explicit readiness decision; `ready` is reviewed, unblocked, and eligible for execution; `execute` moves it to `in-progress`. `prune` is an operation, not a plan state.
2. ✓ Add a guarded `ready` transition: require the user's explicit approval to start, retain the plan and roadmap item unchanged apart from status and derived projections, reject unresolved blockers, and return a materially revised plan to `open` for renewed review. Update plan creation, promotion, status display, and execution guidance to make that boundary visible.
3. ✓ Extend the plan format and roadmap validator with `ready`, including dependency rules that prevent a ready, in-progress, or acceptance plan from bypassing a non-done blocker. Keep `done` as a visible terminal record, not an implicit pruning request.
4. ✓ Define the durable closing operations: `done` transitions an accepted plan to a committed record without deletion and with one non-empty terminal `## Done` H2 after its acceptance packet; explicit `prune` later discovers and removes eligible `done` plans in the requested scope.
5. ✓ Specify `prune` scope and safety: list candidate plan identifiers and canonical items before writing; accept an optional theme scope or the full thematic set; require the done records to be committed; and leave non-done, blocked, malformed, or concurrently changed plans untouched with an exact diagnostic.
6. ✓ Update `ki-plan` lifecycle guidance and user-facing help for the three guarded transitions: `ready` records start approval, `done` records closure and commits, and `prune` removes the selected plans, canonical items/references, dependency edges, and projections through one separate no-clobber transaction and commit. On reaching `acceptance`, emit the shared completion banner to show that implementation is complete and explicit acceptance is next; this applies to direct plan work as well as delegated work.
7. ✓ Add focused fixtures for invalid ready transitions, status visibility, revised-plan re-review, dependency blocking, missing or malformed done outcomes, correct done-record index visibility, full and theme-scoped batch pruning, dependency cleanup, repeated requests, uncommitted records, concurrent mutation, and rollback boundaries.
8. ✓ Refresh vendored roadmap payloads and generated projections, document the distinct ready, done, and prune commit boundaries, and run focused and serial repository gates.

## Files touched

- `skills/process/ki-plan/references/lifecycle.md`
- `skills/process/ki-plan/SKILL.md` and generated HELP surface
- `skills/process/ki-delegate/references/delegation.md`
- `skills/general-governance/ki-repo-roadmap/references/plan-format.md`
- roadmap evidence, writes, and focused fixtures
- generated `ki-repo-roadmap` checker and educator payloads
- user-facing plan lifecycle guidance where the two committed transitions need explanation

## Verify

- A newly created or materially revised plan is `open`; only explicit user approval moves it to `ready`, and only a ready plan may begin execution.
- `ready` is visible in plan status and the generated index, preserves the canonical item and plan contents, and cannot bypass an unresolved dependency.
- A verified plan entering `acceptance` emits the completion banner and names acceptance as the next action, whether or not execution was delegated.
- `done` turns an accepted plan into a valid, indexed `done` plan only with a non-empty `## Done` outcome and does not delete it.
- A later `prune` can remove multiple eligible done plans together, either repository-wide or within one theme, while preserving unrelated active plans and authored roadmap prose.
- Prune rejects uncommitted done records, malformed plans, non-done plans, unsafe paths, and concurrent changes without partial publication.
- Repeated, malformed, unsafe, and concurrently changed states fail closed without partial publication.
- `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan formalises the explicit ready-to-start gate and the committed completion-record workflow exercised manually for FND-004, FND-005, and FND-009. It is independent of FND-010's terminal-progress presentation work.

## Acceptance

### Delivered

`ki-plan` now has the visible `open` → `ready` → `in-progress` → `acceptance` → `done` lifecycle, with retained completion records and a separate guarded `prune` operation.

### Summary of changes

- Added ready, done-record, and prune procedures to `ki-plan`, including the completion banner at acceptance.
- Extended the roadmap checker and generated index for ready and retained done records.
- Added ready/dependency and done/outcome fixtures, refreshed vendored payloads, and updated user and runtime-neutral guidance.

### Verification

- `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts` — passed.
- `bun run test` — passed.
- `bun run ki:audit` — passed.
- Implementation evidence: `ee094bd6`.

### Outstanding concerns

`prune` is deliberately a guarded runtime-neutral process operation, rather than a separate local executable. Its required candidate review, commit boundary, no-clobber transaction, and rollback rules are now part of the lifecycle contract.

### Mini recap

Keeping `done` distinct from destructive pruning preserves reviewable completion evidence while still allowing a related tranche of work to be removed together later.
