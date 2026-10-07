---
id: KI-HARNESS-GOV-149
area: GOV
title: Adopt roadmap model
theme: governance-consistency
status: done
blocks: []
blocked_by: []
baseline_ref: 8345d0cc89fde567390ef6dd9bdce6f647b9b9d8
created_at: 2026-10-07T12:26:37Z
updated_at: 2026-10-07T16:00:00Z
---

# KI-HARNESS-GOV-149: Adopt roadmap model

## Goal

The harness standard and the lifecycle procedures describe the approved roadmap model as the v1 work-record contract: work records say what kind of work they are, which Project or Initiative they serve and which component they touch; status runs from `triage` to `done` or `cancelled`; horizons are Now, Next, Soon, Future and Hold; and ideas wait outside records until they pass a stricter graduation test.

## Context

Kris approved the roadmap model on 2026-10-07 and asked for the rollout as soon as possible. The specification is the roadmap model recommendation (`~/.local/state/ki/state-of-play/design/roadmap-model.md`) together with Kris's decisions (`~/.local/state/ki/state-of-play/design/decisions.md`); where they differ, the decisions win. All eight section-7 recommendations were accepted as option A, the schema stays v1 with no version bump, recurring work is part of the model, checkpoints stop being theme homes, and "project repository" and "Project" stay distinct in prose.

Today the standard treats Triage as a horizon, closes rejected intake as Triage / done through `intake_disposition`, requires same-roadmap duplicate targets, keeps Waiting for and Parked as horizons with a separate `waiting_on_trades` field, and binds each issuing area to a `theme`. The roadmap standard also contradicts itself: a deferral must preserve lifecycle state, yet ready, in-progress and awaiting-review work must stay in Now or Next.

Kris Brown recorded six decisions on the design on 7 October 2026 and agreed with everything else in it; the design and these decisions together are the specification for the rollout:

1. All eight section 7 recommendations are accepted: triage becomes a status, with `cancelled` and a `resolution`; `hold` becomes a horizon and timing is re-decided on release; `kind` takes deliver, decide, investigate or audit; `purpose` is optional and `artifact` is dropped; upkeep work has no project and names its `initiative`; registry project notes and the Initiatives index live in Arcadia `Streams/Projects/`; the stricter capture test applies now and graduation test (c) is offered to `KI-ARCADIA-GOV-024`; migration covers open records, pilots in three repositories, and enforces the new rules only once coverage is complete; `area` keeps its name.
2. There is no schema version bump. Everything stays v1, and during migration the checker tolerates `theme`, the waiting-for and parked horizons and the triage horizon, rejecting them only once coverage is complete.
3. Recurring work is part of the model. Activities and `ki-work-housekeeping` templates declare `initiative`, and optionally `component` and `purpose`; each spawned run inherits them, takes `kind: audit` unless the template sets another kind, and has no project. Rig and workstation hygiene is therefore an initiative made up of upkeep records and recurring runs.
4. Checkpoints stop being theme homes. Each Project note takes over its theme checkpoint: outcome, health, update narrative and Ideas section. The theme checkpoints are folded into project notes and removed, state-of-play becomes the Initiatives review, and `ki-checkpoint` remains only for ephemeral thread reconstruction. Durable knowledge still goes to Pillars and Decision Records.
5. "project" also names a repository type (`repo_type = "project"`, `ki-repo-project`). The two live in different namespaces, record frontmatter and `.ki.toml`, and both stay for now. Prose says "project repository" for the repository shape and "Project" for the territory registry entry; a rename of the repository type is a possible later record, not part of this rollout.
6. Authority to carry the rollout through (Kris, 7 October 2026): "you can just carry it all the way through, this is a really good example of thought out work." This grants outcome authority for every phase with `completion_target: done`; each record may close once its review evidence has been rechecked, through `ki-batch` consolidated closure or `ki-accept` quoting the grant, and the four duplicate closures may use the new `cancelled` and `resolution` path. Kris then added "push everything needed to done related to this", authorising a fast-forward push of the rollout commits, never forced and never with unrelated work, and pruning only of records the rollout itself closes once their done state is committed.

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

- [x] Rewrite `standards-repository-roadmaps.md`: remove `theme` and the area-to-theme binding (fixed-area mode declares area codes only, as `areas = ["FND", ...]`); add the optional `.ki.toml` `components` vocabulary; define horizons now, next, soon, future and hold; replace Triage-as-horizon with status `triage`; add the horizon x status table and the one-line horizon rule; add the lifecycle moves table (adopt, defer, hold, release, cancel, cross-repository duplicate, failed review, replan) with owner skills; add Ideas and the graduation test, with the project note Ideas section first and `docs/roadmap/_IDEAS.md` beside `_ISSUES.md` as the projectless fallback; state the migration tolerance window.
- [x] Rewrite `standards-work-item-format.md`: frontmatter gains `kind`, `purpose`, `project`, `initiative`, `component`, `hold`, `resolution` and `resolution_target`, loses `theme`, `intake_disposition`, `intake_disposition_target` and `waiting_on_trades`; `horizon` is present if and only if the record is adopted and open; `status` gains `triage` and `cancelled`; Detail by stage replaces Triage / done with `## Cancelled` (who, when, why, outstanding changes, and for a cross-repository target the revision and path reference) and adds Hold.
- [x] Add `ki-work/references/standards-project-registry.md`: portable Project note schema (slug, title, outcome, initiative, lifecycle planned/active/paused/completed/cancelled, lead, target), its Update and Ideas sections taken over from theme checkpoints, the Initiatives index note, territory scoping, classification-not-authority, and runtime discovery through the territory Capital's `Streams/Projects/`; link it from `ki-work` and its abstract vocabulary.
- [x] Update `ki-work/SKILL.md` and `standards-change-management-adapters.md` so the abstract vocabulary carries the status set, horizons, hold, resolution, kind, purpose, project, initiative and component that every adapter maps.
- [x] Update `ki-next` (SKILL.md and `standards-next-work.md`): capture into `status: triage` with no horizon under the stricter graduation test, defaulting to the Ideas section when a Project is known; adoption sets `draft`, a horizon and `kind`; defer keeps status; hold and release with condition, review date and re-decided timing; selection order now, next, soon, future, with hold excluded until release.
- [x] Update `ki-plan` (SKILL.md and `standards-plan-lifecycle.md`): planning at Now or Next only; replan ready -> draft; replanning in-progress work keeps baseline and delivered evidence; a ready record may be held.
- [x] Update `ki-implement` (`standards-implementation.md`): starting work moves the record to Now in the same change; a held in-progress record resumes only after release.
- [x] Update `ki-accept` (SKILL.md and `standards-acceptance.md`): cancel any open record, including triage, with `resolution`, `resolution_target` where required and `## Cancelled`; cross-repository duplicate and merged targets; only the owning repository closes its own record; closure removes the horizon; failed review returns to in-progress; cancelled records are prunable like done.
- [x] Update `ki-recap` and `ki-pulse` where they report or route to horizons and Triage. `ki-pulse` needed no change: its Triage is its own signal operation and it routes finite work to `ki-next` without naming a horizon.
- [x] Update `ki-work-housekeeping` (`standards-housekeeping.md` and both assets): templates and Activities declare `initiative` and optionally `component`, `purpose` and `kind`; spawned runs inherit them, default to `kind: audit`, and carry no `project`.
- [x] Update `ki-trades` and `ki-repo-kb-streams` references (`ki-trades` needed no change; its `parked` is a receiver trade state and it names no horizon): `hold.trades` replaces `waiting_on_trades`; Streams allows `Projects/` for the registry instance and `Roadmap/_IDEAS.md`; legacy horizon folder names stay rejected.
- [x] Update `ki-repo` and `ki-work-roadmap/SKILL.md` wording that mentions the theme configuration.
- [x] Run the focused audits and gates below and write the review packet.

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
- `skills/change-management/ki-work-roadmap/references/sources.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/change-management/ki-work-housekeeping/references/standards-housekeeping.md` and `assets/*.md`
- `skills/repo-structure/ki-repo-kb-streams/SKILL.md` and `references/standards-streams-structure.md`
- `skills/keystone/ki-repo/SKILL.md` and `references/standards-repository.md`
- `skills/README.md` (regenerated capability catalogue)

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

## Review

### Delivered

The harness standards now carry roadmap model v1 from the design and the recorded decisions, within the approved boundary: no record migrated, no schema version field, no checker, test or eval change (those are [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md)), and no registry instance. Baseline `8345d0cc89fde567390ef6dd9bdce6f647b9b9d8`; the resulting commit is the one that sets this record to `awaiting-review`.

### Change Summary

- `ki-work-roadmap` standards: horizons now, next, soon, future and hold; status `triage` and `cancelled`; the horizon x status table, lifecycle moves, hold mapping, cancellation and resolution, classification (`kind`, `purpose`, `project`, `initiative`, `component`), `areas` as a list of codes, `components` vocabulary, `_IDEAS.md`, and the migration tolerance window. `sources.md` records the design as a source.
- `ki-work` gains the portable Project registry schema in `standards-project-registry.md` and maps the new vocabulary for every adapter.
- `ki-next`, `ki-plan`, `ki-implement`, `ki-accept` and `ki-recap` describe triage as a status, hold and release, cancellation with a resolution, and pruning of cancelled records.
- `ki-work-housekeeping` templates, Activities and both example assets declare `initiative` and optional `component`, `purpose` and `kind`; spawned runs inherit them and take `kind: audit`.
- `ki-repo-kb-streams` allows `Projects/` and `Roadmap/_IDEAS.md`; `ki-repo` names the issuing-area and component vocabulary instead of a theme map; one `ki-agent-coordination-paperclip` line and the `ki-next` description stop treating Triage as a horizon; `skills/README.md` is regenerated.
- `ki-pulse` and `ki-trades` needed no change: Pulse's Triage is its own signal operation, and the trade `parked` state is a receiver trade state, not a horizon.

### Verification

- `bun run test`: 969 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `bunx rumdl check` on every changed Markdown file: no issues.
- `bunx @biomejs/biome check skills evals`: no finding in a changed file; six pre-existing warnings remain in untouched `ki-repo` and `ki-repo-kb` scripts.
- `ki repo audit --skill ki-skills`: FAIL=0, one pre-existing WARN (LONG-3 refresh cadence of `ki-skills` sources).
- `ki repo audit --skill ki-authoring`, `ki-work-housekeeping` and `ki-agent-coordination-paperclip`: PASS. `ki-repo-harness`: FAIL=0 after catalogue regeneration.
- `rg -n "waiting_on_trades|intake_disposition|Waiting for|Parked"` over skill standards finds only migration-tolerance wording.

### Outstanding concerns

None for this record. Record migration (spec steps 6 to 8), kind-specific plan and review sections, a Linear projection and the landed-but-unaccepted dependency question are follow-on work named under Documentation impact; the `ki` CLI parts are `tools-ki` `KI-TOOL-CLI-112`.

### Post-change review

The goal is met: every lifecycle skill now speaks the v1 model, and old values remain readable under the stated tolerance window. Scope stayed inside the boundary. Regression risk is low because the standards change wording and add optional fields; enforcement sits in GOV-150 and only warns on old values. The record is ready for acceptance under decision 6.

### Mini recap

The roadmap model v1 standards landed across the change-management, housekeeping and Streams skills, verified by the full test suite, type check, Markdown lint and focused audits with no new finding. No concern remains open. A possible learning route is a `ki-skills` check that a skill description never names a retired horizon, offered to `ki-skills` rather than promoted here.

## Done

Accepted 2026-10-07 by Kris Brown on the review packet above.

## Discussion

### Migration tolerance

Decision 2 keeps v1 and tolerates the old values during migration. The standard therefore names the old values (`theme`, the Waiting for and Parked horizons, Triage as a horizon, `intake_disposition*`, `waiting_on_trades`, the area-to-theme map) as deprecated and checker-warned until coverage is complete, then rejected. New records use the new shape immediately.

### Choices made within the specification

- **Fixed-area configuration.** With `theme` gone, an area no longer maps to anything; `areas` becomes a list of codes. The map form stays readable under tolerance.
- **Horizon absence.** Triage, done and cancelled records omit `horizon` entirely rather than carrying `null`.
- **Hold shape.** `hold` is a nested mapping with `reason` (`waiting-for` or `parked`), `condition`, optional `review` date and optional `trades`.
- **Registry discovery.** The checker resolves `[skills.ki-repo].capital` through the local `ki` registry to the Capital checkout's `Streams/Projects/`; a repository that is its own Capital reads its own. Missing anything means a warning only.
- **Ideas file.** `_IDEAS.md` sits beside `_ISSUES.md` and holds plain bullets with no identifiers, horizons or status.

### Acceptance authority

Closed through `ki-accept` under the standing grant in `~/.local/state/ki/state-of-play/design/decisions.md`, decision 6 (Kris Brown, 7 October 2026): "you can just carry it all the way through, this is a really good example of thought out work", with `completion_target: done` for every phase of the rollout. The review evidence was rechecked on the committed delivery (`1780ff75`) before closure: `bun run test` 969 pass and 0 fail, `bunx tsc --noEmit` clean, the published roadmap rubric current, and `ki repo audit` FAIL=0 for `ki-skills`, `ki-work-roadmap`, `ki-authoring`, `ki-repo-harness` and `ki-work-housekeeping`.
