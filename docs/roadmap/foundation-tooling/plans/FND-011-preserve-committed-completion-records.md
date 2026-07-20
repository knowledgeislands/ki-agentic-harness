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

FND-004, FND-005, and FND-009 demonstrated the desired history manually: first commit a reviewable `done` record, then remove the plan and its roadmap item in a later explicit commit.

## Current state

The plan format permits transient `status: done`, while the documented `ki-plan done` procedure removes the plan, local roadmap reference, canonical item, and generated projections in one transaction.

The roadmap validator accepts `done` but does not require a `## Done` outcome. The generated active-plan index can render a `done` plan, as the recorded transition demonstrated.

## Steps

1. Define the two durable closing transitions and their user-facing verbs or arguments: accepted plan to committed `done` record, then explicit later removal; retain manual acceptance as the gate for the first transition.
2. Extend the plan format and roadmap validator so a `done` plan retains its acceptance packet and carries one non-empty terminal `## Done` H2 after it, recording the material closure outcome.
3. Update `ki-plan` lifecycle guidance for both guarded transitions: the first updates only plan status, outcome, and derived index; the second removes the plan, canonical item/reference, dependency edges, and projections through a separate no-clobber transaction.
4. Add focused fixtures for missing or malformed done outcomes, correct first-transition index visibility, explicit second-transition removal, dependency cleanup, repeated requests, concurrent mutation, and rollback boundaries.
5. Refresh vendored roadmap payloads and generated projections, document the commit boundary, and run focused and serial repository gates.

## Files touched

- `skills/process/ki-plan/references/lifecycle.md`
- `skills/general-governance/ki-repo-roadmap/references/plan-format.md`
- roadmap evidence, writes, and focused fixtures
- generated `ki-repo-roadmap` checker and educator payloads
- user-facing plan lifecycle guidance where the two committed transitions need explanation

## Verify

- An accepted plan can become a valid, indexed `done` plan only with a non-empty `## Done` outcome.
- The first transition keeps the plan, its canonical roadmap item, and local reference visible for a separate committed record.
- The explicit removal transition safely removes all plan-owned references and projections without touching unrelated authored roadmap prose or dependent plans incorrectly.
- Repeated, malformed, unsafe, and concurrently changed states fail closed without partial publication.
- `bun skills/general-governance/ki-repo-roadmap/scripts/repo-roadmap.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan formalises the committed completion-record workflow exercised manually for FND-004, FND-005, and FND-009. It is independent of FND-010's terminal-progress presentation work.
