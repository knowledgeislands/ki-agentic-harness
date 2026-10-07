---
id: KI-HARNESS-GOV-155
area: GOV
title: Define roadmap areas
kind: deliver
purpose: governance
project: roadmap-model
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: cf10b85664d3a2dfe5020ce598877304575908e6
created_at: 2026-10-07T15:07:03Z
updated_at: 2026-10-07T15:17:43Z
---

# KI-HARNESS-GOV-155: Define roadmap areas

## Goal

Every fixed-area repository defines what each of its issuing area codes covers in one place the roadmap standard names, and the checker warns when a declared code has no definition there.

## Context

Kris approved the roadmap model on 2026-10-07 (`~/.local/state/ki/state-of-play/design/roadmap-model.md` with `decisions.md`, which wins). [KI-HARNESS-GOV-149](KI-HARNESS-GOV-149-adopt-the-roadmap-model.md) reduced the `.ki.toml` `areas` declaration to a list of codes when it removed the area-to-theme map, so a code's meaning now lives nowhere canonical. Decision 10: "Area codes keep their meaning in a definition. Make sure every fixed-area repository defines each of its areas somewhere the standard names."

Arcadia already does this in its KB roadmap index, `Streams/Roadmap/Roadmap.md`, under `## Areas`, with each code in backticks. A project repository's root `ROADMAP.md` must match the canonical orientation exactly, and `docs/roadmap/` admits only records, `_ISSUES.md` and `_IDEAS.md`, so it has no home for definitions yet.

## Boundary

- Harness standard, checker, tests and published rubric only. Writing each repository's definitions is that repository's work; the rollout report lists them.
- The definition is prose. The checker only tests that each declared code appears in backticks under an `## Areas` heading of the named index.
- A missing definition is a WARN, never a FAIL, and the record does not change the `.ki.toml` schema.

## Current state

- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md` declares `areas = [...]` as codes only and names no definition home.
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` treats every `docs/roadmap/*.md` file other than `_ISSUES.md` and `_IDEAS.md` as a record.
- `skills/repo-structure/ki-repo-kb-streams/` already admits `Streams/Roadmap/Roadmap.md` as a non-record index note.
- Of the 21 fixed-area repositories in the estate, only Arcadia defines its codes.

## Steps

- [x] Name the definition home in the standard: `docs/roadmap/README.md` in a project repository, `Streams/Roadmap/Roadmap.md` in a Knowledge Base, each with an `## Areas` section naming every declared code in backticks.
- [x] Admit `docs/roadmap/README.md` as a non-record roadmap index in the checker and in ROAD-1.
- [x] Add a ROAD-6 WARN for each declared area with no definition, with tests for both repository shapes.
- [x] Write `docs/roadmap/README.md` for this repository's five areas.
- [x] Regenerate the `ki-work-roadmap` rubric, run the gates and write the review packet.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/area-definitions.ts` and its test
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/roadmaps.ts`
- `skills/change-management/ki-work-roadmap/references/rubric.md`
- `docs/roadmap/README.md`

## Verify

- `bun run test` passes and `bunx tsc --noEmit` is clean.
- `ki repo audit --skill ki-work-roadmap` reports FAIL=0 here with no area-definition warning, and the new WARN against an undefined code in a fixture.
- `ki dev skill rubric ki-work-roadmap` reports the published rubric in sync.

## Dependencies / blocks

Shares `roadmap-evidence.ts` with [KI-HARNESS-GOV-153](KI-HARNESS-GOV-153-qualify-cross-territory-references.md); edits that file only after that record's change is committed.

## Documentation impact

### Decision Records

None.

### Specifications

None.

### Guides

None.

### Roadmap

The fixed-area repositories without definitions are listed in the rollout report for their owners.

## Review

### Delivered

Commit `cb6f0c7c` (`feat(work): warn when a declared roadmap area has no definition`) on baseline `cf10b856`, after [KI-HARNESS-GOV-153](KI-HARNESS-GOV-153-qualify-cross-territory-references.md) committed its change to `roadmap-evidence.ts`.

### Change Summary

- `standards-repository-roadmaps.md`: the canonical shape lists `docs/roadmap/README.md`; a fixed-area repository defines each code under `## Areas` in `docs/roadmap/README.md`, or in `Streams/Roadmap/Roadmap.md` for a Knowledge Base, and the checker warns per undefined code.
- `area-definitions.ts` with eight tests: one ROAD-6 WARN per declared code missing from the `## Areas` section; both repository shapes, a missing index, codes outside the section, and malformed or repository-wide configuration.
- `roadmap.ts` merges the findings; `roadmap-evidence.ts` admits `README.md` as a non-record; ROAD-1 and ROAD-6 descriptions updated and the rubric regenerated.
- `docs/roadmap/README.md` defines FND, GOV, OPS, REV and RTP from the retired area-to-theme names.

### Verification

- `bun run test`: 981 pass, 0 fail. `bunx tsc --noEmit` clean.
- `ki repo audit --skill ki-work-roadmap`: FAIL=0, WARN=2, the pre-existing `theme` tolerance warnings; no area warning here. Against Arcadia: PASS. Against `tools-ki`: the new WARN for `CLI` and `VENDOR`.
- `ki dev skill rubric ki-work-roadmap`: in sync.

### Outstanding concerns

Twenty fixed-area repositories have no definitions yet; the rollout report lists them for their owners. The warning stays a WARN.

### Post-change review

The goal is met inside the boundary; no schema change and no FAIL. Regression risk is low: a `README.md` previously in `docs/roadmap/` would have failed as a malformed record.

### Mini recap

Area codes now have a named definition home and a warning when it is missing.

## Done

Accepted 2026-10-07 by Kris Brown on the review packet above.

## Discussion

### Definition home

A KB already has its roadmap index note. For a project repository, `docs/roadmap/README.md` sits beside the ledger it explains, and keeps the canonical root `ROADMAP.md` free of content that drifts. `_ISSUES.md` is generated and immutable in shape, so it cannot carry prose.

### Authority

Kris's decision 10 of 7 October 2026, under the decision 6 carry-through grant with `completion_target: done`.

Closed under the decision 6 carry-through grant ("you can just carry it all the way through"), with the review evidence rechecked, through `ki-accept` quoting that grant.
