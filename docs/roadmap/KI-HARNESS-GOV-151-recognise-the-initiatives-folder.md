---
id: KI-HARNESS-GOV-151
area: GOV
title: Recognise Initiatives folder
kind: deliver
purpose: governance
project: roadmap-model
component: change-management
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: a448b057a5808f2f985e46d49730ca6213c617d1
created_at: 2026-10-07T13:54:02Z
updated_at: 2026-10-07T13:58:53Z
---

# KI-HARNESS-GOV-151: Recognise Initiatives folder

## Goal

A territory Capital keeps each Initiative as its own note in `Streams/Initiatives/`, beside `Streams/Projects/`, and the harness standard and checkers recognise both folders, so an Initiative can carry its direction, Projects, upkeep, recurring Activities and review in one place.

## Context

Kris approved the roadmap model on 2026-10-07 (`~/.local/state/ki/state-of-play/design/roadmap-model.md` with `decisions.md`, which wins). Decision 8 gives Initiatives their own folder: `Streams/Initiatives/` with an `Initiatives.md` index and one note per Initiative (platform-foundations, techne, knowledge-islands-model, rig), a sibling of `Streams/Projects/`. Each Initiative note holds the direction, its Projects, its projectless upkeep records, its recurring Activities and a review section; the state-of-play review becomes that review. `Streams/Projects/Initiatives.md` goes, and the harness schema and checker recognise both folders.

[KI-HARNESS-GOV-149](KI-HARNESS-GOV-149-adopt-the-roadmap-model.md) and [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md) shipped the opposite rule: `standards-project-registry.md` says Initiatives have no notes of their own and keeps an `Initiatives.md` index inside `Streams/Projects/`, and `project-registry.ts` reads Initiative slugs only from that index. The KB Streams checker admits `Projects` but not `Initiatives` as an operational area.

## Boundary

- Harness standard, checkers, tests and published rubric only. Creating the Arcadia Initiative notes and removing its `Streams/Projects/Initiatives.md` belong to Arcadia's own migration.
- No change to the record schema: a record still names `project`, or `initiative` when projectless.
- The legacy index stays readable with a migration warning; rejecting it follows the enforcement record that ends the tolerance window.

## Current state

- `skills/change-management/ki-work/references/standards-project-registry.md` places `Initiatives.md` inside `Streams/Projects/` and forbids Initiative notes.
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/project-registry.ts` reads only `Streams/Projects/`.
- `skills/repo-structure/ki-repo-kb-streams/` lists `Roadmap`, `Trades` and `Projects` as operational areas.

## Steps

- [x] Rewrite the registry standard: both folders, the `Initiatives.md` index, the portable Initiative note schema (slug, title, direction, lifecycle, lead; Projects, Upkeep, Activities and Review sections), and remove the "Initiatives index inside Projects" wording.
- [x] Add the legacy `Streams/Projects/Initiatives.md` to the roadmap standard's migration tolerance list.
- [x] Recognise `Initiatives/` in the KB Streams standard, skill and checker.
- [x] Teach `project-registry.ts` to read Initiative notes from `Streams/Initiatives/`, keep reading the legacy index, and report the legacy location once as a migration warning.
- [x] Update and add focused tests; regenerate the published rubrics; run the gates and write the review packet.

## Files touched

- `skills/change-management/ki-work/references/standards-project-registry.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/project-registry.ts`, `roadmap-evidence.ts` and `roadmap-evidence.model.test.ts`
- `skills/repo-structure/ki-repo-kb-streams/SKILL.md`, `references/standards-streams-structure.md`, `scripts/rubric/contexts/streams.ts` and `streams.test.ts`
- Published rubrics, if their text changes.

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-work-roadmap`, `--skill ki-repo-kb-streams` on `ki-arcadia-principal`, and `--skill ki-skills` report FAIL=0.

## Dependencies / blocks

Builds on GOV-149 and GOV-150, both done. Arcadia's registry migration follows and uses this schema.

## Documentation impact

### Decision Records

None: decision 8 in the rollout's approved decisions is the rationale, and the standard records the rule.

### Specifications

None: the registry standard is the behaviour contract.

### Guides

None: no human guide describes the registry layout.

### Roadmap

Arcadia's registry migration creates the Initiative notes and removes the legacy index.

## Review

### Delivered

The approved boundary: the harness registry standard, the KB Streams standard and skill, the registry loader, the roadmap and Streams checkers, and their tests now recognise `Streams/Initiatives/` beside `Streams/Projects/`, with one note per Initiative and an `Initiatives.md` index. Arcadia's own notes and the removal of its legacy index are excluded. Baseline `a448b057a5808f2f985e46d49730ca6213c617d1`; the component vocabulary this record uses landed in `ed5ae12b`.

### Change Summary

- `skills/change-management/ki-work/references/standards-project-registry.md`: two sibling folders; a new Initiative note section with the portable schema (`slug`, `title`, `direction`, `lifecycle` of active, paused or retired, `lead`; Direction, Projects, Upkeep, Activities and Review sections); the "Initiatives have no notes of their own" index inside Projects is gone; the Review replaces theme checkpoints and the state-of-play review.
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`: the legacy `Streams/Projects/Initiatives.md` joins the migration tolerance list.
- `skills/repo-structure/ki-repo-kb-streams/SKILL.md` and `references/standards-streams-structure.md`: `Initiatives/` is a fixed Capital area.
- `project-registry.ts`: reads `streams/initiative` notes from `Streams/Initiatives/`, is available when either folder exists, and still reads the legacy index, flagging it. `roadmap-evidence.ts` reports the flag once as a migration warning.
- `streams.ts`: `Initiatives` is an operational area.
- Tests: the registry fixture uses Initiative notes, a new test covers the legacy index and its warning, and the Streams test covers both folders.

Decision: the legacy index stays readable with a warning rather than failing, so Arcadia's upkeep records keep resolving until its own migration.

### Verification

- `bun run test`: 970 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `ki dev skill rubric` for `ki-work-roadmap`, `ki-repo-kb-streams` and `ki-work`: in sync.
- `ki repo audit --skill ki-work-roadmap`: FAIL=0; the new legacy-index warning appears once against Arcadia's current registry.
- `ki repo audit --skill ki-repo-kb-streams --repo ../ki-arcadia-principal`: PASS.
- `ki repo audit --skill ki-skills`: FAIL=0, WARN=1, the pre-existing LONG-3 refresh-cadence warning.

### Outstanding concerns

None in this boundary. Creating Arcadia's Initiative notes and removing its legacy index belong to Arcadia's registry migration.

### Post-change review

The goal is met: both folders are recognised in the standard and both checkers, and the retired wording is gone. Scope stayed inside the boundary. Regression risk is low: an unmigrated Capital gains one warning and no failure, and a Capital with only `Streams/Initiatives/` now resolves. Ready for acceptance under decision 6.

### Mini recap

Initiatives now have their own registry folder and note schema; the checker reads it and tolerates the old index with a warning. Gates pass. Learning route: the Initiative schema is new vocabulary that Arcadia's migration will test first.

## Discussion

### Legacy index

Arcadia still holds `Streams/Projects/Initiatives.md` until its own migration. Reading it with a single migration warning keeps every Initiative slug resolvable during the window, rather than turning each upkeep record's `initiative` into an unknown-slug warning.

### Authority

Decision 8 approves the change and decision 6 (Kris Brown, 7 October 2026) grants carry-through to done for the whole rollout.
