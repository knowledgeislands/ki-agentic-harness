---
id: KI-HARNESS-GOV-165
area: GOV
title: Adopt process identifier grammar
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: change-management
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: d1ba51a48139913490e61ff071dedf156dacd98f
created_at: 2026-10-08T11:30:00Z
updated_at: 2026-10-09T16:00:59Z
---

# KI-HARNESS-GOV-165: Adopt process identifier grammar

## Goal

`ki-accept` and `ki-batch` validate identifiers through their materialised copy of `ki-work-roadmap:work-identifiers`, so a digit-leading repository code such as `5GE-P2` and an item serial wider than three digits are legal in both, as they already are in `ki-work-roadmap`.

## Context

Split from KI-HARNESS-GOV-094 on 2026-10-08. That record published the shared identifier-grammar module, migrated `ki-work-roadmap`, `ki-repo`, `ki-work-housekeeping`, `ki-decision-records` and `ki-specs`, and made KI-CHECKER-4 require a structured rubric only from skills that depend on `ki-skills:rubric`. It also made `ki-batch` resolve a relative authorisation path against the repository root.

Declaring the dependency in `ki-accept` or `ki-batch` still fails `ki repo audit --skill ki-skills` until the harness payload carrying that KI-CHECKER-4 change is installed: the audit runs the installed `ki-skills` checker, which reads any `ki-shared-dependencies:` entry as a structured-rubric requirement, and neither process skill has a rubric. Verified 2026-10-08 by declaring the dependency in `ki-accept` in a scratch tree: KI-CHECKER-4 failed with `scripts/rubric/items/index.ts is missing`.

## Boundary

In scope:

- Declare `ki-shared-dependencies: [ki-work-roadmap:work-identifiers]` in `ki-accept` and `ki-batch`, and materialise each byte-identical copy at `scripts/shared/work-identifiers.ts`.
- Replace `WORK_ITEM_ID_RE` in `ki-accept/scripts/internal/acceptance-cycle.ts` with the composed `workIdentifier()`.
- Replace the five `ki-batch` sites with composed patterns: the item-list check and batch identity check in `scripts/internal/authorisation.ts`, the run-ledger marker there, the retention pattern in `batch-retention.ts`, and the legacy migration in `legacy-batch-migration.ts`. Each still spells the alpha-leading, three-digit form.
- Add both skills to `RESTATING` in `ki-work-roadmap/scripts/shared/work-identifiers.conformance.test.ts` and remove its pending note.
- Tests pinning digit-leading codes and serials wider than three digits in both skills.

Out of scope: any change to which identifiers are legal beyond removing the repealed alpha-leading, three-digit forms.

## Current state

- The dependency this record waited on has cleared. On 2026-10-09, with installed `ki` 0.10.0, a scratch declaration of `ki-shared-dependencies: [ki-work-roadmap:work-identifiers]` in `ki-accept`, with a materialised copy, passed `ki repo audit --skill ki-skills` with no FAIL.
- `ki-accept/scripts/internal/acceptance-cycle.ts` spells `WORK_ITEM_ID_RE` by hand.
- `ki-batch/scripts/internal/authorisation.ts` spells the item-list check, the batch identity check, the run-ledger marker and the run identity check, each with a three-digit serial; `batch-retention.ts` and `legacy-batch-migration.ts` spell the alpha-leading batch filename.
- `work-identifiers.conformance.test.ts` lists five restating skills and notes that `ki-accept` and `ki-batch` join later.

## Steps

- [x] Declare the dependency in both `SKILL.md` files and materialise byte-identical copies at `scripts/shared/work-identifiers.ts`.
- [x] Compose `ki-accept`'s target check from `workIdentifier()`.
- [x] Compose every `ki-batch` identifier check from `workIdentifierSource()`, including the run identity check, which shares the run-ledger grammar.
- [x] Add both skills to `RESTATING` and remove the pending note.
- [x] Add tests accepting digit-leading repository codes and serials wider than three digits in both skills, including `+/_BATCHES/5GE-P2-BATCH-001.md` with digit-leading items.
- [x] Run Verify, assemble the review packet and set this record `awaiting-review`.

## Files touched

- `skills/change-management/ki-accept/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/internal/acceptance-cycle.ts`, `scripts/acceptance-cycle.test.ts`
- `skills/change-management/ki-batch/SKILL.md`, `scripts/shared/work-identifiers.ts` (new), `scripts/internal/authorisation.ts`, `batch-retention.ts`, `legacy-batch-migration.ts` and their tests
- `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.conformance.test.ts`
- This record

## Verify

- `bun run test` and `bunx tsc --noEmit` pass, including the conformance test with both skills in `RESTATING`.
- `ki repo audit --skill ki-skills` reports no FAIL.
- A `ki-batch` test accepts `+/_BATCHES/5GE-P2-BATCH-001.md` naming digit-leading item identifiers.

## Dependencies / blocks

The KI-CHECKER-4 change from KI-HARNESS-GOV-094 is now installed (see Current state). Blocks nothing.

## Documentation impact

### Decision Records

None: ADR-KI-HARNESS-SKILLS-015 already makes the shared module the single grammar definition.

### Specifications

None: the legal identifier set is unchanged.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

`ki-accept` and `ki-batch` now declare `ki-work-roadmap:work-identifiers`, carry byte-identical copies of the shared module, and compose every identifier check from it, within the approved boundary. The legal identifier set is unchanged apart from removing the repealed alpha-leading, three-digit-only forms from `ki-batch`. Baseline `d1ba51a48139913490e61ff071dedf156dacd98f`; the delivery commit follows it on `main`.

### Change Summary

- `skills/change-management/ki-accept/SKILL.md` and `ki-batch/SKILL.md`: declare `ki-shared-dependencies: [ki-work-roadmap:work-identifiers]`.
- `ki-accept/scripts/shared/work-identifiers.ts` and `ki-batch/scripts/shared/work-identifiers.ts`: new byte-identical copies of the provider.
- `ki-accept/scripts/internal/acceptance-cycle.ts`: `WORK_ITEM_ID_RE` is `workIdentifier()`.
- `ki-batch/scripts/internal/authorisation.ts`: the item-list check, batch identity check, run-ledger marker and run identity check compose `workIdentifier()`, `workIdentifier('BATCH')`, `workIdentifierSource('BATCH')` and `SERIAL`. `batch-retention.ts` and `legacy-batch-migration.ts` compose their batch file paths from `workIdentifierSource('BATCH')`.
- Approved deviation: the run identity check (`${id}-RUN-NNN`) was a sixth hand-written site, not named in the Boundary; it shares the run-ledger grammar, so it now takes `SERIAL` too.
- `ki-work-roadmap/scripts/shared/work-identifiers.conformance.test.ts`: both skills join `RESTATING`; the pending note is gone.
- Tests: `ki-accept` pins wider-serial and area-qualified cancellation targets; `ki-batch` resolves `+/_BATCHES/5GE-P2-BATCH-001.md` naming `5GE-P2-001` and `5GE-P2-GOV-1001` with a bound run ledger, and retention and legacy migration accept digit-leading batch paths.

### Verification

- `bun run test`: 1062 pass, 0 fail. The three new `ki-batch` tests fail against the baseline patterns and pass after the change; the `ki-accept` test pins behaviour the baseline already had.
- `bunx tsc --noEmit`: pass.
- `ki repo audit --skill ki-skills`: FAIL=0, WARN=1 (pre-existing LONG-3 refresh-cadence warning on `ki-skills` sources, unrelated). KI-CHECKER-4 accepts both declarations.
- `ki repo audit --skill ki-work-roadmap`: PASS. `ki-accept` and `ki-batch` are process skills and are not repository-audit roots.

### Outstanding concerns

None.

### Post-change review

The goal is met: both process skills take the grammar from the single shared definition, and the conformance test now guards them against restating it. Scope held, with one small named deviation. Regression risk is low: the composed patterns accept a superset of what `ki-batch` accepted before, and every existing test passes. Ready for acceptance.

### Mini recap

Moved `ki-accept` and `ki-batch` onto the shared identifier grammar, so digit-leading repository codes such as `5GE-P2` and serials above 999 work in batch envelopes. Verification passed in full. No learning route proposed.

## Discussion

### Acceptance evidence

`bun run test`, `bunx tsc --noEmit` and `ki repo audit --skill ki-skills` pass, and `ki-batch` accepts `+/_BATCHES/5GE-P2-BATCH-001.md` with digit-leading item identifiers.

### Dependencies

Waited on an installed harness payload that includes the KI-CHECKER-4 change from KI-HARNESS-GOV-094; that payload was installed by 2026-10-09. Blocks nothing.

### Adoption and readiness

Kris adopted this record on 2026-10-09 and asked for it to be planned, implemented and brought to review in one run; that instruction is the Ready approval for the plan above.
