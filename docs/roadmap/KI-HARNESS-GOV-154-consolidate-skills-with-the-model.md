---
id: KI-HARNESS-GOV-154
area: GOV
title: Consolidate skills with model
kind: deliver
purpose: governance
project: roadmap-model
status: done
blocks: []
blocked_by: []
baseline_ref: 1647236d9aff870a97ef8561dcaa152e30a682ff
created_at: 2026-10-07T15:07:03Z
updated_at: 2026-10-07T15:17:43Z
---

# KI-HARNESS-GOV-154: Consolidate skills with model

## Goal

Every harness skill, reference, rubric, script and guide speaks the v1 roadmap model's vocabulary, so no skill outside the roadmap standard still teaches the retired waiting-for and parked horizons, triage as a horizon, `theme`, `waiting_on_trades`, `intake_disposition`, or checkpoints as theme homes.

## Context

Kris approved the roadmap model on 2026-10-07 (`~/.local/state/ki/state-of-play/design/roadmap-model.md` with `decisions.md`, which wins). [KI-HARNESS-GOV-149](KI-HARNESS-GOV-149-adopt-the-roadmap-model.md), [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md) and [KI-HARNESS-GOV-151](KI-HARNESS-GOV-151-recognise-the-initiatives-folder.md) moved the roadmap, work and Streams standards and their checkers. Decision 10 asks for a sweep of every other skill and its consolidation, including ki-checkpoint's narrowed role (decision 4), the trades move from `waiting_on_trades` to `hold.trades`, and stale waiting-for, parked and theme wording.

A read-only sweep of `skills/`, `docs/guides/`, `README.md` and `AGENTS.md` found these conflicts. The roadmap standard's own migration-tolerance lists and the checkers' tolerated legacy values are intentional under decision 2 and stay. Unrelated senses stay too: trade receiver status `parked`, Pulse's signal Triage, a Pillar's subject-matter theme, and website visual themes.

| File | Conflict | Fix |
| --- | --- | --- |
| `skills/governance/ki-trades/scripts/rubric/items/records.ts`, `references/rubric.md` | RECORD-3 says a work item title sits beside its "theme" | Name the Project and horizon instead; regenerate the rubric |
| `skills/governance/ki-trades/references/standards-trades.md` | Roadmap boundary says local work "waits" on a trade without naming the v1 field | Name `horizon: hold` with `hold.trades` and the condition in `hold.condition` |
| `skills/governance/ki-checkpoint/SKILL.md`, `references/standards-checkpoints.md`, LIFECYCLE-2 | No statement that checkpoints are ephemeral thread reconstruction only; nothing stops a checkpoint acting as a theme home | State the narrowed role: Project and Initiative notes own a theme's outcome, health, updates and ideas; regenerate the rubric |
| `skills/change-management/ki-recap/references/standards-session-recap.md` | "Deferred work was already parked on the roadmap"; checkpoint hand-off does not route Project status to its note | Say deferred or held; route Project and Initiative status to the registry note |
| `skills/change-management/ki-batch/references/exemplars.md`, `standards-outcome-authority.md` | Ledger result `parked` reads as the retired horizon | Use `held`, with the record at `horizon: hold` |
| `skills/change-management/ki-next/SKILL.md`, `references/standards-next-work.md` | "A shared theme alone is not enough" names the retired field | Name a shared Project or component |
| `skills/change-management/ki-pulse/SKILL.md`, `references/standards-pulse.md` | Act hand-off predates the idea-first capture rule; signal Triage can be read as the roadmap status | Hand finite work to `ki-next`'s graduation test; say signal Triage is not the `triage` status |
| `skills/repo-structure/ki-repo-kb-streams/references/mode-propose.md` | Captures a record as `status: draft` and `horizon: triage` | `status: triage` with no horizon, under the graduation test |
| `skills/repo-structure/ki-repo-kb/references/standards-frontmatter.md` | Streams branch omits the `streams/project` and `streams/initiative` note types | Add both, defined by `ki-work`'s Project registry standard |
| `AGENTS.md` | Links Arcadia's retired `+/_CHECKPOINTS/paperclip-bootstrap-and-recovery.md` as the recovery checkpoint | Link the `Streams/Projects/paperclip-bootstrap-and-recovery.md` Project note |

## Boundary

- Harness source only. Arcadia's remaining theme checkpoints (`+/_CHECKPOINTS/state-of-play.md`, `techne.md`) are Arcadia's migration and are reported, not edited.
- No change to `ki-work-roadmap`, `ki-work` or their checker: the cross-territory record [KI-HARNESS-GOV-153](KI-HARNESS-GOV-153-qualify-cross-territory-references.md) holds them, and area definitions are [KI-HARNESS-GOV-155](KI-HARNESS-GOV-155-define-roadmap-areas.md).
- Tolerated legacy values in checkers stay until enforcement.
- No new rubric item; existing descriptions are corrected and rubrics regenerated.

## Current state

The table above is the current state at baseline.

## Steps

- [x] Correct ki-trades RECORD-3 and the roadmap boundary; regenerate its rubric.
- [x] State ki-checkpoint's narrowed role in `SKILL.md`, the standard and LIFECYCLE-2; regenerate its rubric.
- [x] Correct ki-recap, ki-batch, ki-next, ki-pulse, ki-repo-kb-streams and ki-repo-kb wording.
- [x] Repoint the `AGENTS.md` recovery link.
- [x] Run the gates and write the review packet.

## Files touched

- `skills/governance/ki-trades/scripts/rubric/items/records.ts`, `references/rubric.md`, `references/standards-trades.md`
- `skills/governance/ki-checkpoint/SKILL.md`, `references/standards-checkpoints.md`, `scripts/rubric/items/lifecycle.ts`, `references/rubric.md`
- `skills/change-management/ki-recap/references/standards-session-recap.md`
- `skills/change-management/ki-batch/references/exemplars.md`, `references/standards-outcome-authority.md`
- `skills/change-management/ki-next/SKILL.md`, `references/standards-next-work.md`
- `skills/change-management/ki-pulse/SKILL.md`, `references/standards-pulse.md`
- `skills/repo-structure/ki-repo-kb-streams/references/mode-propose.md`
- `skills/repo-structure/ki-repo-kb/references/standards-frontmatter.md`
- `AGENTS.md`

## Verify

- `bun run test` passes and `bunx tsc --noEmit` is clean.
- `ki repo audit --skill ki-skills`, `--skill ki-trades`, `--skill ki-checkpoint` and `--skill ki-authoring` report FAIL=0 with only pre-existing warnings.
- `ki dev skill rubric ki-trades` and `ki dev skill rubric ki-checkpoint` report the published rubric in sync.
- A repeat of the sweep finds no conflict outside the intentional tolerance lists.

## Dependencies / blocks

None.

## Documentation impact

### Decision Records

None: the roadmap-model decision is Arcadia's.

### Specifications

None.

### Guides

None in `docs/guides/`; the sweep found no conflict there.

### Roadmap

Arcadia's remaining theme checkpoints are reported in the rollout report for Arcadia's migration.

## Review

### Delivered

Commit `cf10b856` (`docs(skills): consolidate skills with the v1 roadmap model`) on baseline `1647236d`.

### Change Summary

- `ki-trades`: RECORD-3 names the Project rather than a theme; the roadmap boundary names `horizon: hold`, `hold.trades` and `hold.condition`. Rubric regenerated.
- `ki-checkpoint`: a new shared-model bullet, the prohibited-payloads paragraph and LIFECYCLE-2 state the narrowed role - ephemeral thread reconstruction only, never a theme home; Project and Initiative notes own outcome, health, updates and ideas. The description names Project state among the owners. Rubric regenerated.
- `ki-recap`: held or deferred wording; the checkpoint hand-off routes Project and Initiative status to the registry note.
- `ki-batch`: ledger exemplar result `held`, with the record at `horizon: hold`.
- `ki-next`: synergy screen names a shared Project or component.
- `ki-pulse`: Act hands finite work to `ki-next`'s graduation test; signal Triage is distinguished from the `triage` status.
- `ki-repo-kb-streams`: capture writes `status: triage` with no horizon, or keeps the work as an idea.
- `ki-repo-kb`: Streams branch lists `streams/project` and `streams/initiative`.
- `AGENTS.md`: Paperclip recovery link points at the Project note.

### Verification

- `bun run test`: 973 pass, 0 fail. `bunx tsc --noEmit` clean.
- `ki repo audit --skill ki-trades`, `ki-checkpoint`, `ki-authoring`: PASS. `ki-skills`: FAIL=0, WARN=1, the pre-existing LONG-3 refresh-cadence warning. `ki-work-roadmap`: FAIL=0, WARN=2, the pre-existing GOV-149 and GOV-150 `theme` tolerance warnings.
- `ki dev skill rubric ki-trades` and `ki-checkpoint`: in sync. `bunx rumdl check` on the touched Markdown: no issues.
- A repeat sweep finds the retired terms only in the roadmap standard's tolerance lists, the checkers' tolerated legacy values, and unrelated senses.

### Outstanding concerns

Arcadia still holds the theme checkpoints `+/_CHECKPOINTS/state-of-play.md` and `techne.md`; folding them into Initiative and Project notes is Arcadia's migration under decision 4 and is reported in the rollout report.

### Post-change review

The goal is met inside the boundary: wording only, no new rubric item, no checker behaviour change. Regression risk is low.

### Mini recap

Eight skills and `AGENTS.md` now use the v1 vocabulary.

## Done

Accepted 2026-10-07 by Kris Brown on the review packet above.

## Discussion

### Authority

Kris's decision 10 of 7 October 2026 asks for this sweep and consolidation, under the decision 6 carry-through grant with `completion_target: done`.

Closed under the decision 6 carry-through grant ("you can just carry it all the way through"), with the review evidence rechecked, through `ki-accept` quoting that grant.
