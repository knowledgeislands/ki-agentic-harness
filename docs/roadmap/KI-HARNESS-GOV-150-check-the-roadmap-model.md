---
id: KI-HARNESS-GOV-150
area: GOV
title: Check roadmap model
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T12:26:37Z
updated_at: 2026-10-07T12:26:37Z
---

# KI-HARNESS-GOV-150: Check roadmap model

## Goal

The roadmap checker validates the approved v1 roadmap model - status x horizon table, hold, cancellation and resolution, kind, purpose, project, initiative and component - while every repository still holding the old shape keeps passing with warnings until its records are migrated.

## Context

[KI-HARNESS-GOV-149](KI-HARNESS-GOV-149-adopt-the-roadmap-model.md) carries the standard for the roadmap model Kris approved on 2026-10-07 (`~/.local/state/ki/state-of-play/design/roadmap-model.md` with `decisions.md`, which wins). Decision 2 keeps the schema at v1: the new fields and states enter v1 directly, and during migration the checker tolerates the old values (`theme`, the Waiting for and Parked horizons, Triage as a horizon) with a warning rather than a failure. An unknown project slug or an unavailable registry is a warning, never a failure.

The checker lives in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`. It hard-codes seven horizons including `triage`, `waiting-for` and `parked`, requires `theme` and binds fixed areas to themes, keeps lifecycle states in Now or Next, validates terminal Triage through `intake_disposition` and a same-roadmap target, and validates `waiting_on_trades` only at Waiting for. The `ki-next` and `ki-plan` decision helpers and the `ki-work-housekeeping` checker carry their own horizon lists. The KB Streams checker allows only `Roadmap` and `Trades` areas, so an Arcadia `Streams/Projects/` registry would warn.

## Boundary

- No existing record is migrated, and the harness `.ki.toml` is not changed.
- No enforcement switch-over: rejecting the old values once coverage is complete is a later record.
- No cross-repository resolution of `resolution_target`; a target in another repository is accepted by shape.
- No `ki` CLI change; `tools-ki` `KI-TOOL-CLI-112` owns `workItemHorizons`, report order, grouping and the migration helper.
- No kind-specific section rules; the existing sections stay required for every kind.
- No standard prose beyond the rubric item text generated from the checker; GOV-149 owns the references.

## Current state

- `HORIZONS` is `['now', 'next', 'soon', 'waiting-for', 'parked', 'future', 'triage']` and `STATUS` has five values.
- `theme` is required and must belong to `themes` or the `areas` map value; `areas` must be a code-to-theme map.
- `ITEM-2` rules: open Triage must stay draft, adopted lifecycle states must be in Now or Next, terminal Triage done requires `intake_disposition`.
- `TRADE-2` validates `waiting_on_trades` at `waiting-for` only.
- `_ISSUES.md` is the only non-record file in `docs/roadmap/`.
- `ki-next/scripts/internal/decisions.ts`, `ki-plan/scripts/internal/decisions.ts` and `ki-work-housekeeping/scripts/rubric/contexts/housekeeping.ts` each hold the old horizon union.
- `ki-repo-kb-streams/scripts/rubric/contexts/streams.ts` allows only `Roadmap` and `Trades` and counts every Markdown file except `_ISSUES.md` as a record.
- `evals/scenarios/ki-work-roadmap.ts` teaches explicit themes and Triage / done disposition.

## Steps

- [ ] Replace the horizon and status constants: horizons `now`, `next`, `soon`, `future`, `hold`; statuses `triage`, `draft`, `ready`, `in-progress`, `awaiting-review`, `done`, `cancelled`; legacy horizons `waiting-for`, `parked`, `triage` accepted with a WARN.
- [ ] Implement the horizon x status table: horizon required if and only if adopted and open; triage, done and cancelled carry none (a legacy horizon on done or a Triage horizon on draft warns); draft any adopted horizon; ready now, next or hold; in-progress and awaiting-review now or hold. New-shape violations FAIL; old-shape combinations that the previous standard allowed WARN.
- [ ] Validate `hold` as a nested mapping: required at `horizon: hold` and forbidden otherwise; `reason` is `waiting-for` or `parked`; non-empty `condition`; optional `review` date; optional `trades` of unique canonical trade identities. Warn on an in-progress hold whose `updated_at` is more than 31 days old. Legacy `waiting_on_trades` at a legacy Waiting-for horizon warns.
- [ ] Validate `resolution` and `resolution_target`: `resolution` required exactly when `status: cancelled`, one of obsolete, rejected, duplicate, merged, superseded; `resolution_target` required for duplicate, merged and superseded and forbidden otherwise, a canonical work-item ID different from the record; a same-repository target that is not retained warns, a cross-repository target is accepted by shape; cancelled requires a non-empty `## Cancelled` section and no delivery sections when it never started. Legacy terminal Triage / done with `intake_disposition*` warns.
- [ ] Validate `kind` (deliver, decide, investigate, audit) when present, warn when an adopted record lacks it; `purpose` (capability, corrective, debt, governance, learning, adoption, upkeep) optional; `component` must belong to the `.ki.toml` `components` list; `project` and `initiative` kebab-case slugs.
- [ ] Add project registry discovery in a small module beside the checker: resolve `[skills.ki-repo].capital` through the local `ki` registry (`$KI_STATE_HOME`, `$XDG_STATE_HOME/ki` or `~/.local/state/ki`) to a checkout whose `.ki.toml` declares that repository, or use the repository itself when it is its own Capital, and read `Streams/Projects/*.md` frontmatter and the `Initiatives.md` index. An unavailable registry or unknown slug warns once per slug; an `initiative` on a record with a `project` fails only when the registry resolves the project to a different initiative, and otherwise warns as redundant.
- [ ] Remove the theme requirement: a present `theme` warns as deprecated; configuration accepts `areas` as a list of codes and keeps the code-to-theme map and `themes` readable with a deprecation warning; add the optional `components` list.
- [ ] Treat `docs/roadmap/_IDEAS.md` as a non-record file.
- [ ] Update the horizon unions and transition rules in `ki-next` and `ki-plan` decision helpers and the `ki-work-housekeeping` checker (accept `initiative`, `component`, `purpose` and `kind` on templates and runs, runs default to audit and carry no project), with their tests.
- [ ] Allow `Projects` as a Streams operational area and exclude `_IDEAS.md` from KB roadmap records.
- [ ] Update the rubric item text in `ki-work-roadmap/scripts/rubric/items/*.ts`, regenerate the published rubrics with `ki dev skill rubric`, and update `evals/scenarios/ki-work-roadmap.ts`.
- [ ] Update `index.test.ts` and add focused tests for the table, hold, cancellation, classification, registry warnings and every tolerance warning; run the gates and write the review packet.

## Files touched

- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/project-registry.ts` (new)
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/*.ts` and their tests
- `skills/change-management/ki-work-roadmap/references/rubric.md` (generated)
- `skills/change-management/ki-next/scripts/internal/decisions.ts` and `scripts/decisions.test.ts`
- `skills/change-management/ki-plan/scripts/internal/decisions.ts` and `scripts/decisions.test.ts`
- `skills/change-management/ki-work-housekeeping/scripts/rubric/contexts/housekeeping.ts`, its rubric items, tests and generated `references/rubric.md`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.ts`, its tests and generated rubric
- `evals/scenarios/ki-work-roadmap.ts`

## Verify

- `bun run test` passes, including new tests for every rule and tolerance warning.
- `bunx tsc --noEmit` and `bunx biome check` pass.
- `ki dev skill rubric ki-work-roadmap` reports the published rubric current.
- `ki repo audit --skill ki-work-roadmap` on this repository, still holding old-shape records, reports no FAIL that the previous checker did not report.
- `ki repo audit --skill ki-skills` passes for the touched skill roots.

## Dependencies / blocks

None as build order. [KI-HARNESS-GOV-149](KI-HARNESS-GOV-149-adopt-the-roadmap-model.md) carries the matching standard prose. `tools-ki` `KI-TOOL-CLI-112` is blocked by this record as build order.

## Documentation impact

### Decision Records

None; the design decision is Arcadia's and GOV-149 carries the standard.

### Specifications

None; the checker implements the reference standard.

### Guides

None.

### Roadmap

The later enforcement switch-over, removing the WARN tolerance once coverage is complete, needs its own record after migration.

## Discussion

### Tolerance levels

Present-but-invalid new values fail at once, because no repository has authored them yet. Missing new values that become required (`kind` on an adopted record) and every old value warn. This keeps every unmigrated repository's audit at its current FAIL count while new records get strict feedback.

### Registry access in a rubric context

Skill scripts do not import across skill roots, so the checker carries its own minimal registry reader rather than reusing `ki-repo`'s territory module. Registry problems are warnings only, so a missing or stale registry never blocks an audit.
