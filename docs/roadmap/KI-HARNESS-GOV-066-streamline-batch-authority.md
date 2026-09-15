---
id: KI-HARNESS-GOV-066
area: GOV
title: Streamline Batch Authority
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-15T05:00:57Z
updated_at: 2026-09-15T05:00:57Z
---

# Streamline Batch Authority

## Goal

Make one batch a lean, integrity-bound authority envelope over a frozen set of Ready work items, with efficient execution and consolidated acceptance rather than duplicated project management.

## Context

The latest four delivered records used three batch files containing 177 lines and 17 commits. The safety boundaries remained valuable, but scope, checks, stops, closure IDs, review evidence, and lifecycle transitions were repeatedly restated. The implementation standard already permits `in-progress` to remain operational rather than requiring a standalone commit.

The approved direction keeps exact-set freezing, repository isolation, item-owned plans and review packets, append-only outcome evidence, and explicit stop conditions. It replaces the pre-publication contract in place with one safe-local policy, derives all-item closure from `completion_target: done`, and treats newly discovered remedial work as capture-only input to a later batch.

## Boundary

Do not introduce dynamic admission, weaken exact-item integrity, infer human authority, collapse item-owned verification, permit public-contract decisions under outcome authority, alter pruning rules, broaden repository scope, or authorise push and release. Existing completed records must remain verifiable as retained evidence until normal cleanup removes them; their retired shape must not remain available for new execution.

## Current state

Ready through the user's explicit approval of the lean exact-set proposal. `ki-batch` owns the process contract and pure validators. `ki-implement` and `ki-work-roadmap` already state that lifecycle transitions do not require standalone commits. `KI-TOOL-CLI-070` owns native preparation and validation mechanics after the Harness contract lands.

## Steps

- [ ] Add a governance Decision Record for a lean exact-set authority envelope and consolidated acceptance.
- [ ] Replace current frontmatter with `policy: safe-local-v1`, deriving fixed stops and all-item closure while retaining approval evidence, expiry, exact IDs, and payload binding.
- [ ] Retain a narrow cleanup-only reader for existing completed records and reject their retired fields from new execution.
- [ ] Reduce new authorisation bodies to identity plus append-only run ledger; keep item plans, checks, and review packets canonical in their work records.
- [ ] Define selection-first freezing, capture-only remedial findings, `N + 2` commit guidance, focused per-item checks, and one aggregate final gate.
- [ ] Update pure authorisation, batch-cycle, and retention fixtures for v2 and legacy retained evidence.
- [ ] Refresh reviewed-item and outcome-authority exemplars.
- [ ] Shape `KI-TOOL-CLI-070` around deterministic `prepare`, `validate`, `run`, and `close` support without moving authority semantics into the CLI.
- [ ] Regenerate affected skill publications and run focused and repository-wide verification.

## Files touched

- `docs/decisions/GDR-KI-HARNESS-009-lean-exact-set-batch-authority.md`
- `docs/decisions/README.md`
- `skills/change-management/ki-batch/`
- Generated skill rubric or catalogue publications affected by the skill change.
- This roadmap item and batch evidence.
- Receiver-owned `tools-ki` roadmap item in its independent repository commit.

## Verify

- Focused `ki-batch` authorisation, cycle, and retention tests.
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No Harness dependency. Native CLI implementation follows the accepted v2 contract through receiver-owned `KI-TOOL-CLI-070`; it does not block the portable process contract.

## Documentation impact

### Decision Records

Add `GDR-KI-HARNESS-009` and register it in the curated decision index.

### Specifications

No repository-wide Specification change. The process skill owns the portable batch contract.

### Guides

The skill and exemplars are sufficient initially. Update task-oriented guidance only if the lean invocation cannot be discovered from the generated catalogue.

### Roadmap

Keep this record as the Harness delivery authority. Prepare the receiver-owned tools-ki item independently and retain any additional automation as remedial work rather than widening this delivery.

## Discussion

The approved contract deliberately optimises the common case before considering rolling admission. One autonomous window freezes one complete eligible set. Work discovered during execution is captured for the next wave, preserving an easily reviewed authority boundary. No schema-version split is needed before public release.
