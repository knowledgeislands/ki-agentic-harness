---
id: KI-HARNESS-GOV-165
area: GOV
title: Adopt process identifier grammar
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: change-management
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T11:30:00Z
updated_at: 2026-10-08T11:30:00Z
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

## Discussion

### Acceptance evidence

`bun run test`, `bunx tsc --noEmit` and `ki repo audit --skill ki-skills` pass, and `ki-batch` accepts `+/_BATCHES/5GE-P2-BATCH-001.md` with digit-leading item identifiers.

### Dependencies

Waits on an installed harness payload that includes the KI-CHECKER-4 change from KI-HARNESS-GOV-094. Blocks nothing.
