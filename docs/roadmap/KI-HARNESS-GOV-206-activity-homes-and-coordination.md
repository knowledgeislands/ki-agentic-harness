---
id: KI-HARNESS-GOV-206
area: GOV
title: Activity homes and coordination
project: ways-of-working
component: change-management
status: triage
blocks: []
blocked_by: [KI-HARNESS-GOV-210]
baseline_ref: null
created_at: 2026-10-17T22:06:58Z
updated_at: 2026-10-18T02:18:20Z
---

# KI-HARNESS-GOV-206: Activity Homes and Coordination

## Goal

The harness standards home a regular activity in its territory's regular work, `<territory>.regular`, or, for a Project's own recurring check, in that Project, under the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md). Regular work is self-coordinating: an occurrence starts by its schedule or by whoever needs it, with no standing session, and the territory's state of play may discuss it but does not necessarily dispatch it. A theme is an optional label in `theme`, replacing `initiative`. Improving an activity remains Project work.

## Context

The [activity-levels run report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/ab526abed0d493bddd9c44ddb48c104d7fa2c846/+/_THREADS/ways-of-working/activity-levels.report.md) set out the model and, in its section 5, the harness changes. Kris Brown answered on 17 October 2026 at 22:50 BST in the ways-of-working thread:

- ACT-HOME: "Home a regular activity at territory or Initiative level, never in a Project; a territory-level Activity declares a territory home and state-of-play stewards it; Initiative stays the default."
- ACT-THREAD: "Run regular activities with no standing thread: state-of-play or a scheduler dispatches each occurrence as one agent in the state-of-play run, reports and answers land there, standing changes go to the Activity note through Enactment, and improving an activity is a Project with a coordination thread while active."
- ACT-NAMES: "Retitle Initiatives for short display names with no short-title field; decide slug renames in SHAPE-AGREE's single migration; Personal retitles Knowledge acquisition to Acquire in that pass."
- ACT-WORK: "Capture one ki-agentic-harness record for the section 5 changes of the activity-levels report, sequenced with the SHAPE-AGREE migration, and send Personal > SoP one handoff through me carrying its section 6."

ACT-THREAD took option a), so the optional `<territory>.<initiative>` thread id in section 5 is not wanted.

The [work model decision](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) of 18 October 2026 superseded ACT-HOME and part of ACT-THREAD: Initiatives became themes, which hold no work, so an Activity's home moved from an Initiative or the territory to the territory's regular work, and the state-of-play thread no longer necessarily dispatches each occurrence. This record was amended to match under [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md).

## Boundary

- In, from section 5 as the work model amends it:
  - `ki-repo-kb-activities`: Home names the territory's regular work as the default home with no key, an optional `project` for a Project's own recurring check and an optional `theme`; the former `initiative` warns.
  - `ki-work-recurring`: templates and runs carry and inherit an optional `theme` on the same terms, and the standard states that recurring work is self-coordinating.
  - `ki-work`: Attributes by level gives recurring work's home as regular work or its Project; a theme page points to no Activities.
  - `ki-pmo`: regular work needs no coordinating session; the state of play may discuss it and send it Messages but does not necessarily dispatch it; improving an Activity is a Project.
  - `ki-pmo` Work naming: regular work is `<territory>.regular`, and ad hoc work `<territory>.regular.<slug>`; no `<territory>.<initiative>.<activity>` id.
  - `ki-checkpoint`: the work file replaces the checkpoint, so no Initiative prefix remains.
  - `ki-delegation`: an occurrence's run is briefed from its Activity note into the work folder of the work it serves.
- Phase 1 of the work-model migration, under [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md), writes each of these into its standard.
- Out: renaming existing checkpoints, folders or slugs and moving Activity notes from `initiative` to `theme`, which belong to each territory's migration; Personal's section 6 handoff and its `Admin/Operations/Activities/` work, which go to Personal > SoP through Kris; a short-title field, which ACT-NAMES declined.

## Dependencies / blocks

Sequenced after the SHAPE-AGREE migration's harness checker. Kris Brown agreed SHAPE-AGREE on 17 October 2026 at 22:50 BST as "one migration after the restart: harness checker first, then folders, decisions logs and thread ids together". This record's checkpoint and naming changes must land against that checker and in the same pass as the folder and thread-id renames, so that nothing is renamed twice. [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) is that checker and the work model's write-in, so it stands in `blocked_by`.

## Discussion

Captured on Kris Brown's ACT-WORK answer. Questions for planning: whether the seven skill changes stay one delivery or split by skill; and how a territory home is written in Activity frontmatter. The work model answered the second: regular work is the default home and needs no key. With phase 1 writing every Boundary item in, planning decides whether this record closes as delivered by [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md) or keeps a residue.
