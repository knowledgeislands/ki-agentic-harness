---
id: KI-HARNESS-GOV-154
area: GOV
title: Consolidate skills with model
kind: deliver
purpose: governance
project: roadmap-model
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T15:07:03Z
updated_at: 2026-10-07T15:07:03Z
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

- [ ] Correct ki-trades RECORD-3 and the roadmap boundary; regenerate its rubric.
- [ ] State ki-checkpoint's narrowed role in `SKILL.md`, the standard and LIFECYCLE-2; regenerate its rubric.
- [ ] Correct ki-recap, ki-batch, ki-next, ki-pulse, ki-repo-kb-streams and ki-repo-kb wording.
- [ ] Repoint the `AGENTS.md` recovery link.
- [ ] Run the gates and write the review packet.

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

## Discussion

### Authority

Kris's decision 10 of 7 October 2026 asks for this sweep and consolidation, under the decision 6 carry-through grant with `completion_target: done`.
