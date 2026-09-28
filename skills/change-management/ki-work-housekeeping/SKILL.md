---
name: ki-work-housekeeping
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
contributes: ['.ki.toml']
description: >
  Govern recurring-work identity, cadence, due-run reservation, and successful-run evidence for Project templates
  and opted-in KB Activities. Use for recurring maintenance; `ki-repo-kb-activities` owns Activity notes and
  `ki-housekeeping-*` skills own runtime cleanup.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Knowledge Islands housekeeping standard

**Kind:** governance. `ki-work-housekeeping` owns recurring-work templates, not the delivery of a particular run. The shared forward-work lifecycle is owned by `ki-work-roadmap`; `ki-repo-kb-streams` places KB records under `Streams/Roadmap/`. Read [the housekeeping template standard](references/standards-housekeeping.md) before creating or changing a template, [the generated rubric](references/rubric.md) for checkable criteria, and [the sources](references/sources.md) when refreshing this standard.

## Shared model

A housekeeping definition is a durable instruction to create ordinary work when its cadence becomes due. Active definitions are evaluated; paused definitions never spawn work. Project templates are explicitly deleted on retirement; KB Activities retain retired rationale without scheduling. Calendar due and overdue are calculated from cadence, successful-run evidence, and grace; an optional commit threshold also makes work due from verified first-parent history. These are computed evidence, not stored states. Use the owner's [read-only schedule capability](scripts/rubric/contexts/schedule.ts) after filtering retired Activities; it never creates runs.

Project templates live directly below `docs/housekeeping/`. A KB uses an Activity note in the collection owned by `ki-repo-kb-activities`, with one nested `housekeeping` profile; there is no duplicate definition in Streams. The standard owns the exact field mapping. `ki-next` reads active definitions and atomically creates a linked `draft` run while reserving that definition's active run. The run follows the common lifecycle through `ki-accept`; an external scheduler grants no additional authority.

`ki-accept` records the actual successful completion date and evidenced reviewed revision on the template only after the run is `done`. It never marks a template as run merely because a draft was created. An unfinished linked run prevents a duplicate spawn.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes. `help` / `-h` / `?` explains the skill and stops; no recognised mode offers the same explanation and, only interactively, asks for a mode and target.

### Mode AUDIT

Run `ki repo audit --skill ki-work-housekeeping --repo <repo>`. It checks placement, safe regular-file shape, stable template identity, controlled state and scheduling fields, and the absence of a duplicate active run. Then review whether cadences, grace periods, spawn horizons, and procedures remain proportionate to the work they create.

### Mode CONFORM

Run `ki repo conform --skill ki-work-housekeeping --repo <repo> --dry-run`. CONFORM makes no schedule decision, creates no run, and never changes `last-run`; it may only apply a declared safe normalisation. Re-run AUDIT afterwards.

### Mode EDUCATE

Run `ki repo educate --skill ki-work-housekeeping --repo <repo>` to explain the local template root and the template format. It never invents a recurring obligation or creates a schedule without an explicit request.

### Mode REFRESH

**Precondition:** REFRESH writes only this skill's canonical files in `ki-agentic-harness`. From an installed copy, stop and redirect to that harness.

On the cadence in [the sources](references/sources.md), compare observed template use with [the housekeeping template standard](references/standards-housekeeping.md), the shared `ki-work-roadmap` lifecycle, and the `ki-repo-kb-streams` adapter. Update the source review and explain any normative change in the commit.

## Boundaries

- `ki-next` selects, promotes, defers, and spawns due work; this skill only defines its inputs.
- `ki-plan`, `ki-implement`, and `ki-accept` own the spawned run's readiness, delivery, review, closure, and later pruning.
- Runtime-specific state-hygiene skills may be named by a recurring template, but they do not own this template model.
- `ki-repo-kb-activities` owns the KB Activity and collection; this skill owns the optional recurring-work profile in that same note. Ordinary Activities remain outside this lifecycle.

## Runtime binding

The portable template model does not inspect runtime state. The `ki-housekeeping-claude` off-ramp is explicitly Claude Code-specific and may be named by a template when its separate safety contract applies.
