---
id: KI-HARNESS-GOV-151
area: GOV
title: Recognise Initiatives folder
kind: deliver
purpose: governance
project: roadmap-model
component: change-management
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T13:54:02Z
updated_at: 2026-10-07T13:54:02Z
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

- [ ] Rewrite the registry standard: both folders, the `Initiatives.md` index, the portable Initiative note schema (slug, title, direction, lifecycle, lead; Projects, Upkeep, Activities and Review sections), and remove the "Initiatives index inside Projects" wording.
- [ ] Add the legacy `Streams/Projects/Initiatives.md` to the roadmap standard's migration tolerance list.
- [ ] Recognise `Initiatives/` in the KB Streams standard, skill and checker.
- [ ] Teach `project-registry.ts` to read Initiative notes from `Streams/Initiatives/`, keep reading the legacy index, and report the legacy location once as a migration warning.
- [ ] Update and add focused tests; regenerate the published rubrics; run the gates and write the review packet.

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

## Discussion

### Legacy index

Arcadia still holds `Streams/Projects/Initiatives.md` until its own migration. Reading it with a single migration warning keeps every Initiative slug resolvable during the window, rather than turning each upkeep record's `initiative` into an unknown-slug warning.

### Authority

Decision 8 approves the change and decision 6 (Kris Brown, 7 October 2026) grants carry-through to done for the whole rollout.
