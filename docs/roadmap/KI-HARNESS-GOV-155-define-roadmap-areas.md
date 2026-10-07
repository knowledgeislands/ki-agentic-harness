---
id: KI-HARNESS-GOV-155
area: GOV
title: Define roadmap areas
kind: deliver
purpose: governance
project: roadmap-model
component: change-management
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T15:07:03Z
updated_at: 2026-10-07T15:07:03Z
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

- [ ] Name the definition home in the standard: `docs/roadmap/README.md` in a project repository, `Streams/Roadmap/Roadmap.md` in a Knowledge Base, each with an `## Areas` section naming every declared code in backticks.
- [ ] Admit `docs/roadmap/README.md` as a non-record roadmap index in the checker and in ROAD-1.
- [ ] Add a ROAD-6 WARN for each declared area with no definition, with tests for both repository shapes.
- [ ] Write `docs/roadmap/README.md` for this repository's five areas.
- [ ] Regenerate the `ki-work-roadmap` rubric, run the gates and write the review packet.

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

## Discussion

### Definition home

A KB already has its roadmap index note. For a project repository, `docs/roadmap/README.md` sits beside the ledger it explains, and keeps the canonical root `ROADMAP.md` free of content that drifts. `_ISSUES.md` is generated and immutable in shape, so it cannot carry prose.

### Authority

Kris's decision 10 of 7 October 2026, under the decision 6 carry-through grant with `completion_target: done`.
