---
id: 'FND-011'
title: Preserve committed completion records before plan removal
status: open
roadmap: foundation-tooling/preserve-committed-completion-records-before-plan-removal
blocks: —
blocked-by: —
---

## Context

Manual acceptance proves a plan is ready to close, but immediate removal leaves no dedicated committed record of its outcome in the normal plan lifecycle.

FND-004, FND-005, and FND-009 demonstrated the desired history manually: first commit a reviewable `done` record, then remove related completed plans and their roadmap items together at the end of the work tranche.

## Current state

The plan format permits transient `status: done`, while the documented `ki-plan done` procedure removes the plan, local roadmap reference, canonical item, and generated projections in one transaction.

The roadmap validator accepts `done` but does not require a `## Done` outcome. The generated active-plan index can render a `done` plan, as the recorded transition demonstrated; it has no batch-pruning operation.

## Steps

1. Define the two durable closing operations: `done` transitions an accepted plan to a committed record without deletion, while explicit `prune` later discovers and removes all eligible `done` plans in the requested scope. Retain manual acceptance as the gate for `done`.
2. Extend the plan format and roadmap validator so a `done` plan retains its acceptance packet and carries one non-empty terminal `## Done` H2 after it, recording the material closure outcome.
3. Specify `prune` scope and safety: list candidate plan identifiers and canonical items before writing; accept an optional theme scope or the full thematic set; require the done records to be committed; and leave non-done, blocked, malformed, or concurrently changed plans untouched with an exact diagnostic.
4. Update `ki-plan` lifecycle guidance for both guarded transitions: `done` updates only plan status, outcome, and derived index, then commits; `prune` removes the selected set of plans, canonical items/references, dependency edges, and projections through one separate no-clobber transaction and commit.
5. Add focused fixtures for missing or malformed done outcomes, correct done-record index visibility, full and theme-scoped batch pruning, dependency cleanup, repeated requests, uncommitted records, concurrent mutation, and rollback boundaries.
6. Refresh vendored roadmap payloads and generated projections, document the two commit boundaries, and run focused and serial repository gates.

## Files touched

- `skills/process/ki-plan/references/lifecycle.md`
- `skills/general-governance/ki-repo-roadmap/references/plan-format.md`
- roadmap evidence, writes, and focused fixtures
- generated `ki-repo-roadmap` checker and educator payloads
- user-facing plan lifecycle guidance where the two committed transitions need explanation

## Verify

- `done` turns an accepted plan into a valid, indexed `done` plan only with a non-empty `## Done` outcome and does not delete it.
- A later `prune` can remove multiple eligible done plans together, either repository-wide or within one theme, while preserving unrelated active plans and authored roadmap prose.
- Prune rejects uncommitted done records, malformed plans, non-done plans, unsafe paths, and concurrent changes without partial publication.
- Repeated, malformed, unsafe, and concurrently changed states fail closed without partial publication.
- `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan formalises the committed completion-record workflow exercised manually for FND-004, FND-005, and FND-009. It is independent of FND-010's terminal-progress presentation work.
