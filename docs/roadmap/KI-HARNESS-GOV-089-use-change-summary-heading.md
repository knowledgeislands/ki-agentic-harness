---
id: KI-HARNESS-GOV-089
area: GOV
title: Use Change Summary heading
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T08:26:07Z
updated_at: 2026-09-24T08:26:07Z
---

## Goal

Replace the canonical review-packet heading `Summary of changes` with the shorter, clearer `Change Summary` everywhere that produces, validates, documents, or currently uses the contract.

## Context

Review packets use a fixed six-heading contract shared by `ki-implement`, `ki-accept`, `ki-recap`, and `ki-work-roadmap`. The existing heading is understandable, but its connective word adds no meaning and proved fragile when transformed command output omitted it. The cross-project personal exact-output guard now requires exact validation whenever literal correctness matters; this item makes the shared contract itself less error-prone.

## Boundary

This item changes only the second review-packet heading and its direct fixtures, validators, guidance, and retained open Harness review packets. It does not change review semantics, lifecycle authority, other headings, completed history outside retained records, downstream repositories, packages, dependencies, or package-library folders.

## Current state

The old exact literal occurs in twelve live files: three retained awaiting-review records, the four lifecycle and recap surfaces, the canonical roadmap standard, two runtime constants, the roadmap evidence validator, and its focused test. The repositories are otherwise unchanged by this item, and the Harness dependency tree is already present.

## Steps

- [ ] Update the canonical roadmap format and lifecycle guidance to require `Change Summary`.
- [ ] Update producer, acceptance, recap, and roadmap validation constants and tests.
- [ ] Migrate retained Harness review packets that remain awaiting review.
- [ ] Prove the old exact heading is absent from the governed live surface.
- [ ] Run focused tests, the full test and type gates, and relevant repository audits.

## Files touched

- `skills/change-management/ki-implement/SKILL.md`
- `skills/change-management/ki-implement/references/standards-implementation.md`
- `skills/change-management/ki-implement/scripts/internal/implementation-cycle.ts`
- `skills/change-management/ki-accept/references/standards-acceptance.md`
- `skills/change-management/ki-accept/scripts/internal/acceptance-cycle.ts`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/index.test.ts`
- Retained awaiting-review records under `docs/roadmap/`
- `docs/roadmap/KI-HARNESS-GOV-089-use-change-summary-heading.md`

## Verify

- Exact fixed-string scan finds no remaining `Summary of changes` heading or contract literal in governed live files.
- Focused lifecycle and roadmap tests pass.
- `bun run test`
- `bunx tsc --noEmit`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-skills --repo .`

## Dependencies / blocks

No external dependency blocks delivery. The user explicitly approved the exact-output guard and coordinated heading change. The unrelated untracked batch record remains outside this item.

## Documentation impact

### Decision Records

No Decision Record is required because review authority and semantics do not change.

### Specifications

The roadmap work-item format standard remains the canonical behavioural owner and changes in place.

### Guides

Existing implementation, acceptance, and recap guidance changes in place; no new guide is needed.

### Roadmap

This record coordinates the migration and stops at awaiting review after verified delivery.

## Discussion

### Planning decision

Treat the rename as one atomic contract migration. Updating only prose, a producer, or a validator would leave valid work rejected or obsolete headings emitted. Retained awaiting-review packets migrate because they are live inputs to acceptance; pruned completed records and downstream repositories are outside the boundary.
