---
id: KI-HARNESS-GOV-056
area: GOV
title: Track work item timestamps
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: bae5a5e7595fdbacebe5eb817484b06d34d10959
created_at: 2026-09-07T23:33:50Z
updated_at: 2026-09-13T15:41:04Z
---

# Track Work Item Timestamps

## Goal

Give every governed change-management record reliable creation and last-update metadata so local and remote portfolios can report age and staleness consistently.

## Context

Roadmap and KB Streams records currently store lifecycle state but no portable timestamps. Independent agents operating from isolated environments need monotonic metadata that does not depend on a shared filesystem, while GitHub Issues and Linear already expose native creation and update times.

## Boundary

This first increment does not claim cycle time, throughput, or time-in-state statistics. Those require explicit lifecycle timestamps or retained event history beyond `created_at` and `updated_at`.

## Shaping

Define `created_at` and `updated_at` as RFC 3339 UTC timestamps with second precision. Set them equal when a local record is created, keep `created_at` immutable, and advance `updated_at` on each governed record mutation. Let remote adapters project their native timestamps rather than duplicating them. Establish compatibility and Git-history backfill before making the fields universally required.

## Current state

The shared work-item format requires identity, queue, lifecycle, dependency, and baseline fields but contains no temporal metadata. The `ki-work-roadmap` checker therefore cannot distinguish a newly captured record from an inactive one. Process skills author semantic record changes directly, while `tools-ki` currently parses and mutates horizons without a timestamp contract.

Git history can sometimes approximate creation and last change, but renamed files, shallow clones, untracked records, mechanical formatting commits, and remote adapters make it unsuitable as the portable source of truth.

## Steps

- [x] Add a Governance Decision Record defining portable work-item timestamp ownership, local mutation authority, native remote projection, and the transition from optional to required metadata.
- [x] Extend the shared work-item format with `created_at` and `updated_at` using canonical `YYYY-MM-DDTHH:MM:SSZ` UTC values. During the compatibility period require both fields or neither, warn when both are absent, and fail one-sided, malformed, or `updated_at < created_at` records.
- [x] Define creation as one instant written to both fields. Keep `created_at` immutable and advance `updated_at` only for a semantic governed-record mutation, not read-only inspection or formatting-only normalisation.
- [x] Define a monotonic local update as the later of the wall clock truncated to seconds and one second after the current `updated_at`. Require an isolated writer to compare its observed source revision before publication and stop on drift rather than overwrite a newer record.
- [x] Update the `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept` procedures so every lifecycle or semantic body mutation they own preserves creation time and advances update time. `ki-batch` continues to delegate record mutation to those process owners.
- [x] Extend the `ki-work-roadmap` evidence builder and fixtures for optional compatibility, canonical timestamp shape, ordering, future-clock tolerance, immutable creation evidence where available, and adapter-owned Knowledge Base metadata.
- [x] Define remote adapters as projections of provider-native creation and update timestamps. Do not duplicate those timestamps into remote bodies or claim remote write support before the adapter executor exists.
- [x] Document the rollout sequence: publish optional validation and process guidance, release CLI support, measure coverage, perform separately reviewable repository backfills, and create a later record before changing absence from warning to failure.

## Files touched

- `docs/decisions/GDR-KI-HARNESS-008-portable-work-item-timestamps.md` (new)
- `docs/decisions/README.md`
- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/index.test.ts`
- `skills/change-management/ki-work-roadmap/references/rubric.md`
- `skills/change-management/ki-next/references/standards-next-work.md`
- `skills/change-management/ki-plan/references/standards-plan-lifecycle.md`
- `skills/change-management/ki-implement/references/standards-implementation.md`
- `skills/change-management/ki-accept/references/standards-acceptance.md`
- This work item

## Verify

- `bunx vitest run skills/change-management/ki-work-roadmap/scripts/rubric/items/index.test.ts`
- `bunx vitest run skills/change-management/ki-next/scripts/decisions.test.ts skills/change-management/ki-plan/scripts/decisions.test.ts skills/change-management/ki-implement/scripts/implementation-cycle.test.ts skills/change-management/ki-accept/scripts/acceptance-cycle.test.ts`
- `ki dev skill rubric ki-work-roadmap`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

No implementation blocker remains. This record establishes the contract consumed by `KI-TOOL-CLI-066`; the tools-ki record should not begin implementation until this Harness change is published at a commit it can cite.

The compatibility period deliberately keeps absent timestamps non-failing. Repository backfill and the later required-field transition remain separate work so this contract can ship without breaking older tooling or remote adapters.

## Delegation

After the decision and normative field semantics are fixed, checker fixtures and process-skill procedure updates may proceed as two bounded lanes. The orchestrator retains the shared-standard edit, reconciles both lanes against the same timestamp semantics, regenerates the rubric, and runs the complete verification set.

## Documentation impact

### Decision Records

Add `GDR-KI-HARNESS-008` to anchor portable timestamp ownership, monotonic semantic mutation, concurrency refusal, and remote native projection independently of any one CLI implementation.

### Specifications

No repository-level behaviour specification is required. The `ki-work-roadmap` work-item format and checker rubric are the normative portable contract; tools-ki will specify its CLI behaviour in its own repository.

### Guides

No new guide is required. Process-skill procedures carry the authoring workflow, and the work-item format remains the reader-facing reference.

### Roadmap

After optional support and CLI reporting are delivered, create separately reviewable records for estate backfill and for any later transition that makes timestamps universally required.

## Review

### Delivered

Implemented the approved portable timestamp increment from immutable baseline `bae5a5e7595fdbacebe5eb817484b06d34d10959`. Commit `50af8c2e00ce37d2551120aed716adbfcae35321` adds the governance decision, optional local timestamp pair, deterministic validation, process mutation rules, and remote native projections. It does not add lifecycle-event statistics, perform an estate backfill, change the CLI, or enable remote writes.

### Summary of changes

Added `GDR-KI-HARNESS-008` and its decision-index entry. Extended the repository work-item format and lifecycle standard with canonical RFC 3339 UTC-second values, immutable creation time, monotonic semantic updates, optimistic source-revision refusal, and compatibility rollout. Extended the roadmap evidence builder and focused fixtures for pair presence, canonical shape, ordering, and future-clock tolerance; regenerated the readable rubric. Updated `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept` procedures, plus the GitHub Issues and Linear adapter standards. During implementation, absence reporting was made informational rather than a rubric warning because `ki-next` deliberately stops on roadmap warnings; a warning would have made optional metadata operationally mandatory before the approved backfill phase.

### Verification

`bun run test` passes with 594 tests and no failures. `bunx tsc --noEmit` passes. The focused roadmap fixture suite passes. `ki repo audit --skill ki-work-roadmap --repo .`, `ki repo audit --skill ki-skills --repo .`, `ki repo audit --skill ki-decision-records --repo .`, and `ki repo audit --skill ki-authoring --repo .` pass after the review packet is present.

### Outstanding concerns

No blocker remains for this increment. Existing records without timestamps remain valid and produce non-failing compatibility information. `KI-TOOL-CLI-066`, estate backfills, coverage measurement, and any later required-field transition remain separate work with their own review boundaries.

### Post-change review

The change meets the approved goal without claiming unsupported lifecycle statistics or coupling the portable contract to one CLI or remote provider. Validation is deterministic and does not depend on the auditor's wall clock. The main regression risk is process authors forgetting to advance timestamps; the updated process standards make ownership explicit, while later CLI support can automate local mutation.

### Mini recap

Portable creation and last-semantic-update metadata now has one governed contract, checker evidence, and process ownership. The increment is ready for acceptance; follow-on tooling and backfills remain visible but deliberately out of scope.

## Done

Accepted 2026-09-13 by Kris Brown on the review packet above.

## Discussion

### Distributed authority

Prefer `tools-ki` as the timestamp writer for deterministic local operations and require process skills to preserve monotonic values during authored changes. Specify optimistic conflict handling so an isolated agent cannot silently overwrite a newer record.

### Statistical scope

The initial reporting contract may calculate record age, inactivity, timestamp coverage, and stale-active counts. A later decision can add `started_at`, `completed_at`, or lifecycle events when reliable delivery and throughput measures are needed.

### Rollout order

First accept and validate optional timestamps, then update tooling and process skills, backfill existing records from Git history, and only then consider a required-field gate. This avoids breaking repositories still running the earlier parser.
