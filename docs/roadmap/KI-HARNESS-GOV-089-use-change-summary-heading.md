---
id: KI-HARNESS-GOV-089
area: GOV
title: Use Change Summary heading
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: ce84a8e1b725f295d3a4d1eb61c482054152f425
created_at: 2026-09-24T08:26:07Z
updated_at: 2026-09-24T10:30:00Z
---

## Goal

Use the shorter, clearer `Change Summary` as the canonical second review-packet heading everywhere that produces, validates, documents, or currently uses the contract.

## Context

Review packets use a fixed six-heading contract shared by `ki-implement`, `ki-accept`, `ki-recap`, and `ki-work-roadmap`. The existing heading is understandable, but its connective word adds no meaning and proved fragile when transformed command output omitted it. The cross-project personal exact-output guard now requires exact validation whenever literal correctness matters; this item makes the shared contract itself less error-prone.

## Boundary

This item changes only the second review-packet heading and its direct fixtures, validators, guidance, and retained open Harness review packets. It does not change review semantics, lifecycle authority, other headings, completed history outside retained records, downstream repositories, packages, dependencies, or package-library folders.

## Current state

The previous exact literal occurred in twelve live files: three retained awaiting-review records, the four lifecycle and recap surfaces, the canonical roadmap standard, two runtime constants, the roadmap evidence validator, and its focused test. The repositories were otherwise unchanged by this item, and the Harness dependency tree was already present.

## Steps

- [x] Update the canonical roadmap format and lifecycle guidance to require `Change Summary`.
- [x] Update producer, acceptance, recap, and roadmap validation constants and tests.
- [x] Migrate retained Harness review packets that remain awaiting review.
- [x] Prove the old exact heading is absent from the governed live surface.
- [x] Run focused tests, the full test and type gates, and relevant repository audits.

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

- Exact fixed-string scan finds no remaining `Change Summary` heading or contract literal in governed live files.
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

## Review

### Delivered

Delivered the approved atomic review-packet contract migration from baseline `ce84a8e1b725f295d3a4d1eb61c482054152f425`. Producers, validators, acceptance and recap guidance, the canonical work-item standard, focused test evidence, and all retained Harness review packets now use `Change Summary`.

### Change Summary

Updated the review heading in nine shared skill and runtime files plus three retained awaiting-review records. The GOV-089 roadmap record and issue ledger coordinate the change. No dependency, package, package-library folder, downstream repository, lifecycle meaning, or other heading changed.

### Verification

Exact fixed-string predicates confirmed the previous literal is absent and the replacement is present across every intended surface. All 43 focused roadmap and lifecycle tests pass, as do TypeScript checking, Markdown and TypeScript formatting, diff checks, and the `ki-work-roadmap` and `ki-skills` audits. The full suite ran 771 tests: 768 passed and three out-of-scope tests failed against concurrent uncommitted MCP shared-code work.

### Outstanding concerns

None within the heading migration. The Harness working tree is not globally clean until concurrent MCP work reconciles its remediation inventory, shared-code audit expectation, and MCP family-list expectation. Downstream repositories containing independently retained open review packets will migrate when their own governing surfaces adopt the updated Harness skill projection.

### Post-change review

The migration is internally consistent: the producer and acceptance constants agree with the canonical standard and roadmap validator, retained live packets satisfy the new shape, and focused failure text names the same heading. The three global failures do not touch this item's files or behaviour, so the bounded change is ready for user acceptance while the wider repository remains under active MCP implementation.

### Mini recap

The exact-output guard now protects literal-sensitive edits, while the shared review contract uses the less fragile `Change Summary` wording. No further durable learning route is proposed.

## Done

Accepted 2026-09-24 by Kris Brown on the review packet above.

## Discussion

### Planning decision

Treat the rename as one atomic contract migration. Updating only prose, a producer, or a validator would leave valid work rejected or obsolete headings emitted. Retained awaiting-review packets migrate because they are live inputs to acceptance; pruned completed records and downstream repositories are outside the boundary.
