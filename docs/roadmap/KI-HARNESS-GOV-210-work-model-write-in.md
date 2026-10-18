---
id: KI-HARNESS-GOV-210
area: GOV
title: Work model write-in
kind: deliver
purpose: governance
project: ways-of-working
component: governance
horizon: now
status: awaiting-review
blocks: [KI-HARNESS-GOV-206]
blocked_by: []
baseline_ref: be65ccad13720226c85626093538d744fae8f024
created_at: 2026-10-18T01:49:05Z
updated_at: 2026-10-18T02:23:41Z
---

# KI-HARNESS-GOV-210: Work Model Write-In

## Goal

The harness standards, skills, checkers and generated coordinator surfaces describe and check coordinating work under the work model, citing the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note rather than restating it, while accepting the thread-model shapes with a warning for a tolerance window that phase 5 of the migration closes.

## Context

[GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) decides the work model: work at territory, regular and Project level, a worker and a supervisor, seven states, send and receive, the work file `+/_WORK/<id>/work.md` with Git as its logbook, and themes in place of Initiatives. Kris Brown agreed it on 18 October 2026 in the ways-of-working thread and launched its migration the same day under MIGRATION-LAUNCH, answering REPLY-BLOCK, BANNER-GLYPH, MIGRATION-REVIEW, SKILL-NAMES, TITLE-THEME, WORK-THEME-SLUGS and TARGET-GLYPH. The migration brief in Knowledge Islands Principal, `+/_THREADS/ways-of-working/work-migration.brief.md`, sets this repository's work as its phase 1; tools-ki and a release follow as phase 2, the Capital's move as phase 3.

## Boundary

- In: `ki-pmo`, `ki-delegation`, `ki-checkpoint`, `ki-work`'s Project registry standard, `ki-repo-kb-streams`, `ki-work-roadmap`, `ki-repo-kb-activities`, `ki-work-recurring` and `ki-pmo-design` standards, their rubric contexts and tests; the generated hook line, output style, run-prompt and authority footers; the hooks README and the harness specification's HARN-012 and HARN-013; amendments to KI-HARNESS-GOV-189, KI-HARNESS-GOV-199, KI-HARNESS-GOV-200 and KI-HARNESS-GOV-206.
- Out: every skill name and `ki agent`, unchanged under SKILL-NAMES; tools-ki's readers and `ki work status`, phase 2; moving any territory's folders, notes or work files, phases 3 and 4; removing the legacy readers, phase 5; the `ki-recap` ordinary session recap.

## Current state

Delivered from baseline `be65ccad13720226c85626093538d744fae8f024` under the migration's phase 1 and awaiting review; see Review.

## Steps

- [x] `ki-pmo`: the work levels and forms, seven states, On hold, the receive words, the glyph banner and send line, no reply block, the work file, the heartbeat while work lies with a worker, the decisions life cycle, pruning the work folder, two-part ids with the theme as display text, `+/_WORK_REVIEW/<id>/` and design notes in `+/_WORK/<id>/design/`; regenerate the surfaces.
- [x] `ki-delegation`: briefs in `+/_WORK/<id>/briefs/<run>.md`, the run report's glyph banner and no reply block, the decisions log in the work folder.
- [x] `ki-checkpoint`: the work-file standard, still reading old checkpoints.
- [x] The Project registry, Streams and roadmap standards and checkers: `Streams/Themes/`, flat Project notes with `theme:`, no `design/` under `Streams/`, records naming an optional `theme`; `initiative:` and `Streams/Initiatives/` warn.
- [x] `ki-repo-kb-activities` and `ki-work-recurring`: an Activity's home is regular work or a Project, with an optional `theme:`; regular work is self-coordinating. Amend KI-HARNESS-GOV-206.
- [x] `ki-pmo-design`: the artefact home `+/_WORK/<id>/design/`.
- [x] Amend KI-HARNESS-GOV-189, KI-HARNESS-GOV-199 and KI-HARNESS-GOV-200 where the work folder replaces the thread folder and checkpoint.
- [x] Run the checks under Verify.

## Files touched

- `skills/change-management/ki-pmo/` standard, skill, rubric items, context, tests and generator
- `hooks/coordinator-reminder.sh`, its test and `hooks/README.md`; `output-styles/ki-coordinator.md`
- `skills/governance/ki-delegation/` standard, assets and rubric
- `skills/governance/ki-checkpoint/` standard and rubric
- `skills/change-management/ki-work/`, `ki-work-roadmap/`, `ki-work-recurring/`, `ki-pmo-design/` standards and contexts
- `skills/repo-structure/ki-repo-kb-streams/` and `ki-repo-kb-activities/` standards and contexts
- `docs/specs/harness.md`; the four amended records

## Verify

- `bun run test` passes, including the old-shape fixtures now carrying their tolerance warning and new work-model fixtures.
- `bunx tsc --noEmit` passes.
- `ki dev skill generate ki-pmo` reports every generated surface current.
- `ki repo audit --skill <skill>` for every touched skill reports no new failure in the contract under change.
- Assertion: no skill is renamed and `ki agent` is unchanged.

## Dependencies / blocks

No local blocker. Phase 2 in tools-ki depends on this record landing, under KI-TOOL-KI-CLI-127.

## Documentation impact

### Decision Records

None here. GDR-KI-PRINCIPAL-009 in Knowledge Islands Principal is the decision; Kris's answers of 18 October stand in for an Enactment record.

### Specifications

HARN-012 and HARN-013 in `docs/specs/harness.md` describe the hook line and output style under the work model.

### Guides

The hooks README describes the hook under the work model.

### Roadmap

The four amended records; phase 5 closes the tolerance window in a later record.

## Review

### Delivered

Every step: the `ki-pmo`, `ki-delegation`, `ki-checkpoint`, Project registry, Streams, roadmap, Activities, recurring-work and `ki-pmo-design` standards and checkers describe the work model and accept the thread-model shapes with a `legacy:` warning; the generated hook line, output style, run-prompt and authority footers are current; [KI-HARNESS-GOV-189](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-189-move-thread-between-hosts.md), [KI-HARNESS-GOV-199](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-199-thread-identity-role-native-sessions.md), [KI-HARNESS-GOV-200](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-200-thread-folder-closed-list.md) and [KI-HARNESS-GOV-206](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-206-activity-homes-and-coordination.md) are amended.

### Change Summary

- `ki-pmo`: the work model in the standard, skill, rubric items PMO-9 and PMO-10 and generator, with the hook line, output style, hooks README and HARN-012 and HARN-013 regenerated or rewritten.
- `ki-delegation`: briefs, decisions log and reports in `+/_WORK/<id>/`, the run report's glyph banner with no reply block, and the run-prompt decisions-log path.
- `ki-checkpoint`: the work-file standard; old `+/_CHECKPOINTS/` records still read with a warning; `ki-repo-kb` exempts work files from note typing.
- `ki-work`, `ki-repo-kb-streams` and `ki-work-roadmap`: `Streams/Themes/`, flat Project notes with `theme:`, no `design/` under `Streams/`, and `initiative:` and `Streams/Initiatives/` warning.
- `ki-repo-kb-activities` and `ki-work-recurring`: an Activity's home is regular work or a Project with an optional `theme`; recurring work is self-coordinating; a legacy `initiative` warns.
- `ki-pmo-design`: the artefact home `+/_WORK/<id>/design/`.
- No skill is renamed and `ki agent` is unchanged.

### Verification

`bun run test` and `bunx tsc --noEmit` pass; `ki dev skill generate ki-pmo` reports every surface current; `ki repo audit` for `ki-work-roadmap`, `ki-checkpoint`, `ki-delegation` and `ki-skills` passes. `ki-pmo` reports FAIL=4 and WARN=2, the same findings as at the baseline, in an old thread folder, not in the contract under change. Against Knowledge Islands Principal, the old checkpoints, `Streams/` design folders and Activity `initiative:` fields report the expected legacy findings for phase 3.

### Outstanding concerns

- `ki-repo`'s `standards-repository.md` and `standards-configuration.md`, and its COVERAGE detect in `scripts/rubric/contexts/audit.ts`, still name `+/_CHECKPOINTS/` and `+/_THREADS/<run>/`; they lay outside this record's boundary and want a follow-up.
- Planning decides whether [KI-HARNESS-GOV-206](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-206-activity-homes-and-coordination.md) closes as delivered by this record.

### Post-change review

Reviewer: pending; this record awaits an independent review before acceptance.

### Mini recap

The harness now speaks the work model and reads the thread model with warnings until phase 5 closes the window; tools-ki's phase 2 can build on it.

## Discussion

Captured by the `migrate-phase1` run of the ways-of-working thread on 18 October 2026, under the migration brief's phase 1 and Kris's MIGRATION-LAUNCH.
