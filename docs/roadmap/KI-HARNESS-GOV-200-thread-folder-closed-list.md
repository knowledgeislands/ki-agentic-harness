---
id: KI-HARNESS-GOV-200
area: GOV
title: Thread folder closed list
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-15T22:55:39Z
updated_at: 2026-10-18T02:22:09Z
---

# Thread Folder Closed List

## Goal

The `ki-delegation` run packet states the work folder's closed list and the temporary home, one footer line in `assets/run-prompt.md` tells every background agent where temporary output goes and that it writes nothing into the work folder beyond its report, and a `ki-coordination` rubric item flags a work folder that holds anything beyond `work.md`, `decisions.md`, `<name>.report.md`, `briefs/<run>.md` and `design/`, so that work folders stay pruned without relying on each coordinator remembering.

## Context

Kris Brown set the thread folder's contents in the ways-of-working thread on 15 October 2026 (THREADS-CONTENT): "A thread folder holds a closed list, decisions.md and <name>.report.md only; briefs live in the state folder, work products in their owning home, temporary output in the temporary location." The same day Kris set the temporary home (THREADS-TMP-HOME): "Temporary output goes in <primary checkout>/tmp/<run>/<name>/ in the repository the agent works in, ignored and deleted when the run closes or they are superflous to requirements; machine-only scratch may stay in the state folder as <name>.work/. Improve the ways-of-working via whichever skill to ensure that the threads are regularly trimmed back as needed." Kris asked for this record in THREADS-TELL: "Open one ki-agentic-harness record (closed list in the ki-delegation run packet, one run-prompt.md footer line, a ki-coordination rubric item) and one tools-ki record (ki agent launch creates tmp/<run>/<name>/, ki agent close removes it)."

The standards wording for the closed list, the temporary home and the mark-time trim is carried directly, not by this record; this record owns the mechanical parts. Today the ki-coordination rubric runs COORD-1 to COORD-8 in `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`, none of which reads a thread folder's file list, and `assets/run-prompt.md` names only the report path.

This record was issued as KI-HARNESS-GOV-195, which the Granola record [KI-HARNESS-GOV-195](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-195-granola-screenshots-markers.md) already held, and was renumbered on 16 October 2026. COORD-9 (`737cd4d1`) now delivers the rubric half: a heuristic warning on a thread folder holding a file outside the closed list. What remains is the run-packet closed list, if the direct wording has not already stated it, and the `run-prompt.md` footer line.

The work model, [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), replaces the thread folder `+/_THREADS/<run>/` with the work folder `+/_WORK/<id>/`, and [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) writes it into the harness. Its closed list grows to `work.md`, `decisions.md`, `<name>.report.md`, `briefs/<run>.md` and `design/`, under the `ki-coordination` standard's Pruning the work folder, and briefs move from the state folder into `briefs/`. COORD-9 now checks the work folder against that list. THREADS-CONTENT's "briefs live in the state folder" is superseded by that move; its closed-list principle stands.

## Boundary

- In: the closed list stated in the run packet's knowledge-file table if the direct wording has not already done so; one `run-prompt.md` footer line naming `<primary checkout>/tmp/<run>/<name>/` for temporary output and saying the agent writes nothing else into `+/_WORK/<id>/`; the ki-coordination rubric item that lists every `+/_WORK/<id>/` folder and flags each file outside the closed list, which COORD-9 delivers as a warning.
- Out: the launcher creating and removing `tmp/<run>/<name>/`, which [KI-TOOL-KI-CLI-137](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-137-agent-run-tmp-home.md) owns; clearing any existing thread folder, which each owning thread does at its next mark under THREADS-CLEAR, and moving old thread folders into work folders, which the work-model migration's phase 3 does; the report-heading check that [KI-HARNESS-GOV-175](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) carries.

## Discussion

Capture only, on Kris Brown's explicit request in THREADS-TELL; adoption, priority and plan belong to this repository. Questions for planning: whether COORD-9 should move from a warning to a failure once existing thread folders are cleared; whether an inbox file joins the closed list once the inbox moves into the thread folder, as the background-run standard anticipates; and whether this record and [KI-HARNESS-GOV-175](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) share one `run-prompt.md` edit.
