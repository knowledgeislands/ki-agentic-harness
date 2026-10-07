---
id: KI-HARNESS-GOV-150
area: GOV
title: Check roadmap model
theme: governance-consistency
status: done
blocks: []
blocked_by: []
baseline_ref: 8345d0cc89fde567390ef6dd9bdce6f647b9b9d8
created_at: 2026-10-07T12:26:37Z
updated_at: 2026-10-07T16:00:00Z
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

- [x] Replace the horizon and status constants: horizons `now`, `next`, `soon`, `future`, `hold`; statuses `triage`, `draft`, `ready`, `in-progress`, `awaiting-review`, `done`, `cancelled`; legacy horizons `waiting-for`, `parked`, `triage` accepted with a WARN.
- [x] Implement the horizon x status table: horizon required if and only if adopted and open; triage, done and cancelled carry none (a legacy horizon on done or a Triage horizon on draft warns); draft any adopted horizon; ready now, next or hold; in-progress and awaiting-review now or hold. New-shape violations FAIL; old-shape combinations that the previous standard allowed WARN.
- [x] Validate `hold` as a nested mapping: required at `horizon: hold` and forbidden otherwise; `reason` is `waiting-for` or `parked`; non-empty `condition`; optional `review` date; optional `trades` of unique canonical trade identities. Warn on an in-progress hold whose `updated_at` is more than 31 days old. Legacy `waiting_on_trades` at a legacy Waiting-for horizon warns.
- [x] Validate `resolution` and `resolution_target`: `resolution` required exactly when `status: cancelled`, one of obsolete, rejected, duplicate, merged, superseded; `resolution_target` required for duplicate, merged and superseded and forbidden otherwise, a canonical work-item ID different from the record; a same-repository target that is not retained warns, a cross-repository target is accepted by shape; cancelled requires a non-empty `## Cancelled` section and no delivery sections when it never started. Legacy terminal Triage / done with `intake_disposition*` warns.
- [x] Validate `kind` (deliver, decide, investigate, audit) when present, warn when an adopted record lacks it; `purpose` (capability, corrective, debt, governance, learning, adoption, upkeep) optional; `component` must belong to the `.ki.toml` `components` list; `project` and `initiative` kebab-case slugs.
- [x] Add project registry discovery in a small module beside the checker: resolve `[skills.ki-repo].capital` through the local `ki` registry (`$KI_STATE_HOME`, `$XDG_STATE_HOME/ki` or `~/.local/state/ki`) to a checkout whose `.ki.toml` declares that repository, or use the repository itself when it is its own Capital, and read `Streams/Projects/*.md` frontmatter and the `Initiatives.md` index. An unavailable registry or unknown slug warns once per slug; an `initiative` on a record with a `project` fails only when the registry resolves the project to a different initiative, and otherwise warns as redundant.
- [x] Remove the theme requirement: a present `theme` warns as deprecated; configuration accepts `areas` as a list of codes and keeps the code-to-theme map and `themes` readable with a deprecation warning; add the optional `components` list.
- [x] Treat `docs/roadmap/_IDEAS.md` as a non-record file.
- [x] Update the horizon unions and transition rules in `ki-next` and `ki-plan` decision helpers and the `ki-work-housekeeping` checker (accept `initiative`, `component`, `purpose` and `kind` on templates and runs, runs default to audit and carry no project), with their tests.
- [x] Allow `Projects` as a Streams operational area and exclude `_IDEAS.md` from KB roadmap records.
- [x] Update the rubric item text in `ki-work-roadmap/scripts/rubric/items/*.ts`, regenerate the published rubrics with `ki dev skill rubric`, and update `evals/scenarios/ki-work-roadmap.ts`.
- [x] Update `index.test.ts` and add focused tests for the table, hold, cancellation, classification, registry warnings and every tolerance warning; run the gates and write the review packet.

## Files touched

- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/project-registry.ts` (new)
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.model.test.ts` (new)
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/*.ts` and their tests
- `skills/change-management/ki-work-roadmap/references/rubric.md` (generated)
- `skills/change-management/ki-next/scripts/internal/decisions.ts` and `scripts/decisions.test.ts`
- `skills/change-management/ki-plan/scripts/internal/decisions.ts` and `scripts/decisions.test.ts`
- `skills/change-management/ki-work-housekeeping/scripts/rubric/contexts/housekeeping.ts` and its tests (the published rubric stayed current)
- `skills/change-management/ki-accept/scripts/internal/acceptance-cycle.ts`, `prune-selection.ts` and their tests
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.ts` and its tests (the published rubric stayed current)
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

## Review

### Delivered

The roadmap checker, decision helpers, Streams context, housekeeping context, `ki-accept` scripts, rubric text and eval scenarios now implement roadmap model v1 with migration tolerance: an old value warns with a `migration:` prefix and never fails, no record is migrated, and no schema version is bumped. Baseline `8345d0cc89fde567390ef6dd9bdce6f647b9b9d8`; the resulting commit is the one that sets this record to `awaiting-review`.

### Change Summary

- `roadmap-evidence.ts`: the new horizon and status sets and the horizon x status table; `hold` parsed as a nested mapping with reason, condition, review date and trades, and a stale in-progress hold warning after 31 days; `resolution` and `resolution_target` with the `## Cancelled` section; `kind`, `purpose`, `project`, `initiative` and `component` validation; `areas` as a list of codes and a `components` vocabulary; `_IDEAS.md` as a non-record; one `tolerate()` helper for every legacy value.
- `project-registry.ts` (new): resolves the Capital through the local `ki` registry to `Streams/Projects/`, reading project notes and the Initiatives index; anything missing gives one warning.
- Rubric items: ITEM-2 is now "item state and classification"; ROAD-2, ROAD-5, ROAD-6, EXEC-1 to EXEC-3 and TRADE-2 describe triage status, hold and cancellation; ITEM-2, ITEM-3, ROAD-6 and TRADE-2 declare a `WARN` override level so tolerance warnings pass `ki` outcome validation. `references/rubric.md` is regenerated.
- `ki-next` and `ki-plan` decisions: the new unions, the allowed-horizon table, adoption from triage only, hold with a condition, and a new `releaseDecision`. `ki-accept` prune selection admits cancelled records.
- `housekeeping.ts`: horizons now, next, soon and future with legacy values accepted; classification fields validated; INFO migration notices for a legacy spawn horizon or a missing `initiative`.
- `streams.ts`: `Projects` is an operational area and `_IDEAS.md` is not a roadmap record.
- `evals/scenarios/ki-work-roadmap.ts`: the capture scenario teaches triage status, no horizon and classification; the disposition scenario becomes a duplicate cancellation with `resolution_target` and a `## Cancelled` section.

### Verification

- `bun run test`: 969 pass, 0 fail, including `roadmap-evidence.model.test.ts` for the table, hold, stale hold, cancellation, classification, components, areas, legacy themes, `_IDEAS.md`, registry discovery and membership.
- `bunx tsc --noEmit`: clean. `bunx @biomejs/biome check skills evals`: no finding in a changed file.
- `ki dev skill rubric ki-work-roadmap`, `ki-work-housekeeping` and `ki-repo-kb-streams`: published rubrics current.
- Old and new checkers side by side: `ki-agentic-harness`, `tools-ki`, `ki-website`, `tools-mgit` and `mcp-ki-kb-fs` show no FAIL the old checker did not report (harness 77, tools-ki 12, ki-website 6, tools-mgit 2 and mcp-ki-kb-fs 2 migration warnings).
- `ki repo audit --skill ki-work-roadmap`: FAIL=0, WARN=77 migration findings. `ki repo audit --skill ki-skills`: FAIL=0 with the pre-existing LONG-3 warning. `ki repo audit --skill ki-repo-kb-streams` in `ki-arcadia-principal`: PASS, so `Projects` is no longer unexpected.

### Outstanding concerns

None for this record. Rejecting old values after migration coverage is complete is the migration phase's work, and the `ki` CLI parts are `tools-ki` `KI-TOOL-CLI-112`.

### Post-change review

The goal is met: the checker enforces the v1 shape for new values and only warns on old ones, confirmed against five repositories. Scope stayed inside the boundary. The main regression risk was a new FAIL on an unmigrated repository; the side-by-side comparison rules it out. The record is ready for acceptance under decision 6.

### Mini recap

The checker and its helpers now implement roadmap model v1 with migration tolerance, verified by the full suite, the type check, regenerated rubrics and a five-repository old-versus-new comparison. No concern remains open. A possible learning route is a `ki` validation hint naming `overrideLevels` when an outcome uses an undeclared level, offered to `tools-ki` rather than promoted here.

## Done

Accepted 2026-10-07 by Kris Brown on the review packet above.

## Discussion

### Tolerance levels

Present-but-invalid new values fail at once, because no repository has authored them yet. Missing new values that become required (`kind` on an adopted record) and every old value warn. This keeps every unmigrated repository's audit at its current FAIL count while new records get strict feedback.

### Registry access in a rubric context

Skill scripts do not import across skill roots, so the checker carries its own minimal registry reader rather than reusing `ki-repo`'s territory module. Registry problems are warnings only, so a missing or stale registry never blocks an audit.

### Choices made in implementation

- **Kind warning scope.** The missing-`kind` warning applies only to open records at a non-legacy horizon, so done history and records still on an old horizon do not double-warn.
- **Housekeeping legacy notices.** The housekeeping rubric has no WARN status, so its legacy spawn horizon and missing `initiative` are INFO outcomes headed "Migration:".
- **Registry finding reference.** Registry findings cite the repository roadmap standard rather than the work-item format, because discovery is a repository-level rule.
- **Done at a horizon.** A done record still at now or next warns under tolerance; done at any other horizon fails as before, so no previously failing record now passes silently.
- **Active work at next.** In-progress or awaiting-review at next warns under tolerance rather than failing, because the old model allowed it.
- **Override levels.** `ki` validates every outcome level against the item's declaration, so the items that emit tolerance warnings declare `overrideLevels: ['WARN']`.

### Acceptance authority

Closed through `ki-accept` under the standing grant in `~/.local/state/ki/state-of-play/design/decisions.md`, decision 6 (Kris Brown, 7 October 2026): "you can just carry it all the way through, this is a really good example of thought out work", with `completion_target: done` for every phase of the rollout. The review evidence was rechecked on the committed delivery (`1549ad35`) before closure: `bun run test` 969 pass and 0 fail, `bunx tsc --noEmit` clean, the published roadmap rubric current, and `ki repo audit` FAIL=0 for `ki-skills`, `ki-work-roadmap`, `ki-authoring`, `ki-repo-harness` and `ki-work-housekeeping`.
