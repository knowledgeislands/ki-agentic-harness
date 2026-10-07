---
id: KI-HARNESS-GOV-149
area: GOV
title: Adopt roadmap model
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T12:26:37Z
updated_at: 2026-10-07T12:26:37Z
---

# KI-HARNESS-GOV-149: Adopt roadmap model

## Goal

The harness standard and the lifecycle procedures describe the approved roadmap model as the v1 work-record contract: work records say what kind of work they are, which Project or Initiative they serve and which component they touch; status runs from `triage` to `done` or `cancelled`; horizons are Now, Next, Soon, Future and Hold; and ideas wait outside records until they pass a stricter graduation test.

## Context

Kris approved the roadmap model on 2026-10-07 and asked for the rollout as soon as possible. The specification is the roadmap model recommendation (`~/.local/state/ki/state-of-play/design/roadmap-model.md`) together with Kris's decisions (`~/.local/state/ki/state-of-play/design/decisions.md`); where they differ, the decisions win. All eight section-7 recommendations were accepted as option A, the schema stays v1 with no version bump, recurring work is part of the model, checkpoints stop being theme homes, and "project repository" and "Project" stay distinct in prose.

Today the standard treats Triage as a horizon, closes rejected intake as Triage / done through `intake_disposition`, requires same-roadmap duplicate targets, keeps Waiting for and Parked as horizons with a separate `waiting_on_trades` field, and binds each issuing area to a `theme`. The roadmap standard also contradicts itself: a deferral must preserve lifecycle state, yet ready, in-progress and awaiting-review work must stay in Now or Next.

This record is migration step 3 of the specification. The checker is [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md); the `ki` CLI parts are handed to `tools-ki` as `KI-TOOL-CLI-112`.

## Boundary

- No existing record is migrated: no frontmatter of any open or done record changes, and the harness's own `.ki.toml` keeps its area-to-theme map until the migration phase.
- No checker, rubric generator, test or eval change; [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md) owns those.
- No Project registry instance, Initiatives index or project note; Arcadia owns the instance. The harness publishes only the portable schema and the discovery rule.
- No Linear or GitHub Issues projection change beyond naming the abstract vocabulary they map; a projection waits for its own record after [KI-HARNESS-FND-014](KI-HARNESS-FND-014-implement-remote-adapters.md).
- No kind-specific plan or review sections. The standard records that `kind` will decide them, and the existing sections stay required for every kind until a separate record defines the variants.
- No change to the Enactment threshold; graduation test (c) is offered to `KI-ARCADIA-GOV-024`, which owns it.
- No schema version field or bump.

## Current state

- `ki-work-roadmap/references/standards-repository-roadmaps.md` lists seven horizons including Triage, Waiting for and Parked, binds areas to themes, and keeps lifecycle states in Now or Next.
- `ki-work-roadmap/references/standards-work-item-format.md` requires `theme` and `horizon`, defines terminal Triage with `intake_disposition` and `intake_disposition_target`, and has no `kind`, `project`, `initiative`, `component`, `purpose`, `hold`, `resolution` or `resolution_target`.
- `ki-work/references/standards-change-management-adapters.md` owns the abstract lifecycle vocabulary without triage, cancelled or the classification fields.
- `ki-next`, `ki-plan`, `ki-implement`, `ki-accept`, `ki-recap` and `ki-pulse` describe Triage as a horizon, Triage / done closure, Waiting for and Parked moves, and same-roadmap duplicate targets.
- `ki-work-housekeeping` spawned runs carry no `initiative`, `component`, `purpose` or `kind`.
- `ki-trades` and `ki-repo-kb-streams` reference `waiting_on_trades` and the old horizon names.
- No harness reference defines a Project registry note or the Initiatives index.

## Steps

- [ ] Rewrite `standards-repository-roadmaps.md`: remove `theme` and the area-to-theme binding (fixed-area mode declares area codes only, as `areas = ["FND", ...]`); add the optional `.ki.toml` `components` vocabulary; define horizons now, next, soon, future and hold; replace Triage-as-horizon with status `triage`; add the horizon x status table and the one-line horizon rule; add the lifecycle moves table (adopt, defer, hold, release, cancel, cross-repository duplicate, failed review, replan) with owner skills; add Ideas and the graduation test, with the project note Ideas section first and `docs/roadmap/_IDEAS.md` beside `_ISSUES.md` as the projectless fallback; state the migration tolerance window.
- [ ] Rewrite `standards-work-item-format.md`: frontmatter gains `kind`, `purpose`, `project`, `initiative`, `component`, `hold`, `resolution` and `resolution_target`, loses `theme`, `intake_disposition`, `intake_disposition_target` and `waiting_on_trades`; `horizon` is present if and only if the record is adopted and open; `status` gains `triage` and `cancelled`; Detail by stage replaces Triage / done with `## Cancelled` (who, when, why, outstanding changes, and for a cross-repository target the revision and path reference) and adds Hold.
- [ ] Add `ki-work/references/standards-project-registry.md`: portable Project note schema (slug, title, outcome, initiative, lifecycle planned/active/paused/completed/cancelled, lead, target), its Update and Ideas sections taken over from theme checkpoints, the Initiatives index note, territory scoping, classification-not-authority, and runtime discovery through the territory Capital's `Streams/Projects/`; link it from `ki-work` and its abstract vocabulary.
- [ ] Update `ki-work/SKILL.md` and `standards-change-management-adapters.md` so the abstract vocabulary carries the status set, horizons, hold, resolution, kind, purpose, project, initiative and component that every adapter maps.
- [ ] Update `ki-next` (SKILL.md and `standards-next-work.md`): capture into `status: triage` with no horizon under the stricter graduation test, defaulting to the Ideas section when a Project is known; adoption sets `draft`, a horizon and `kind`; defer keeps status; hold and release with condition, review date and re-decided timing; selection order now, next, soon, future, with hold excluded until release.
- [ ] Update `ki-plan` (SKILL.md and `standards-plan-lifecycle.md`): planning at Now or Next only; replan ready -> draft; replanning in-progress work keeps baseline and delivered evidence; a ready record may be held.
- [ ] Update `ki-implement` (`standards-implementation.md`): starting work moves the record to Now in the same change; a held in-progress record resumes only after release.
- [ ] Update `ki-accept` (SKILL.md and `standards-acceptance.md`): cancel any open record, including triage, with `resolution`, `resolution_target` where required and `## Cancelled`; cross-repository duplicate and merged targets; only the owning repository closes its own record; closure removes the horizon; failed review returns to in-progress; cancelled records are prunable like done.
- [ ] Update `ki-recap` and `ki-pulse` where they report or route to horizons and Triage.
- [ ] Update `ki-work-housekeeping` (`standards-housekeeping.md` and both assets): templates and Activities declare `initiative` and optionally `component`, `purpose` and `kind`; spawned runs inherit them, default to `kind: audit`, and carry no `project`.
- [ ] Update `ki-trades` and `ki-repo-kb-streams` references: `hold.trades` replaces `waiting_on_trades`; Streams allows `Projects/` for the registry instance and `Roadmap/_IDEAS.md`; legacy horizon folder names stay rejected.
- [ ] Update `ki-repo` and `ki-work-roadmap/SKILL.md` wording that mentions the theme configuration.
- [ ] Run the focused audits and gates below and write the review packet.

## Files touched

- `skills/change-management/ki-work-roadmap/SKILL.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work/SKILL.md`
- `skills/change-management/ki-work/references/standards-change-management-adapters.md`
- `skills/change-management/ki-work/references/standards-project-registry.md` (new)
- `skills/change-management/ki-next/SKILL.md` and `references/standards-next-work.md`
- `skills/change-management/ki-plan/SKILL.md` and `references/standards-plan-lifecycle.md`
- `skills/change-management/ki-implement/references/standards-implementation.md`
- `skills/change-management/ki-accept/SKILL.md` and `references/standards-acceptance.md`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/change-management/ki-pulse/SKILL.md` and `references/standards-pulse.md`
- `skills/change-management/ki-work-housekeeping/references/standards-housekeeping.md` and `assets/*.md`
- `skills/governance/ki-trades/references/standards-trades.md`
- `skills/repo-structure/ki-repo-kb-streams/SKILL.md` and `references/standards-streams-structure.md`
- `skills/keystone/ki-repo/references/standards-repository.md`

## Verify

- `ki repo audit --skill ki-skills` passes for every touched skill root.
- `ki repo audit --skill ki-authoring` reports no new finding in touched files.
- `bunx rumdl check` and `bunx biome check` pass on the touched paths.
- `bun run test` and `bunx tsc --noEmit` pass.
- `rg -n "waiting_on_trades|intake_disposition|Waiting for|Parked" skills/**/references skills/**/SKILL.md` finds only migration-tolerance wording.

## Dependencies / blocks

None. [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md) implements the same specification in the checker and can land independently. `tools-ki` `KI-TOOL-CLI-112` depends on both.

## Documentation impact

### Decision Records

The design decision is accepted in Arcadia (migration step 1). This record carries the harness standard, so no harness Decision Record is needed; the standard cites the accepted design.

### Specifications

The work-record contract is a harness reference standard rather than a repository Specification; no Specification changes.

### Guides

The website skills-by-outcome guide may need a horizon wording refresh after the rollout; that belongs to `ki-website` and is not part of this record.

### Roadmap

Follow-on: the record migration (spec steps 6 to 8) in each repository; kind-specific plan and review sections; a Linear projection after FND-014; and the separate dependency-rule question for landed but unaccepted prerequisites. None is captured here.

## Discussion

### Migration tolerance

Decision 2 keeps v1 and tolerates the old values during migration. The standard therefore names the old values (`theme`, the Waiting for and Parked horizons, Triage as a horizon, `intake_disposition*`, `waiting_on_trades`, the area-to-theme map) as deprecated and checker-warned until coverage is complete, then rejected. New records use the new shape immediately.

### Choices made within the specification

- **Fixed-area configuration.** With `theme` gone, an area no longer maps to anything; `areas` becomes a list of codes. The map form stays readable under tolerance.
- **Horizon absence.** Triage, done and cancelled records omit `horizon` entirely rather than carrying `null`.
- **Hold shape.** `hold` is a nested mapping with `reason` (`waiting-for` or `parked`), `condition`, optional `review` date and optional `trades`.
- **Registry discovery.** The checker resolves `[skills.ki-repo].capital` through the local `ki` registry to the Capital checkout's `Streams/Projects/`; a repository that is its own Capital reads its own. Missing anything means a warning only.
- **Ideas file.** `_IDEAS.md` sits beside `_ISSUES.md` and holds plain bullets with no identifiers, horizons or status.
