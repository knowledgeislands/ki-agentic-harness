---
id: KI-HARNESS-GOV-206
area: GOV
title: Activity homes and coordination
project: ways-of-working
component: change-management
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T22:06:58Z
updated_at: 2026-10-17T22:06:58Z
---

# KI-HARNESS-GOV-206: Activity Homes and Coordination

## Goal

The harness standards let a regular activity live at territory or Initiative level, never in a Project, and run it without a standing thread: the state-of-play thread or a scheduler dispatches each occurrence as one agent in the state-of-play run, its report and answers land there, standing changes reach the Activity note through Enactment, and improving an activity is a Project with its own coordination thread while active.

## Context

The [activity-levels run report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/ways-of-working/activity-levels.report.md) set out the model and, in its section 5, the harness changes. Kris Brown answered on 17 October 2026 at 22:50 BST in the ways-of-working thread:

- ACT-HOME: "Home a regular activity at territory or Initiative level, never in a Project; a territory-level Activity declares a territory home and state-of-play stewards it; Initiative stays the default."
- ACT-THREAD: "Run regular activities with no standing thread: state-of-play or a scheduler dispatches each occurrence as one agent in the state-of-play run, reports and answers land there, standing changes go to the Activity note through Enactment, and improving an activity is a Project with a coordination thread while active."
- ACT-NAMES: "Retitle Initiatives for short display names with no short-title field; decide slug renames in SHAPE-AGREE's single migration; Personal retitles Knowledge acquisition to Acquire in that pass."
- ACT-WORK: "Capture one ki-agentic-harness record for the section 5 changes of the activity-levels report, sequenced with the SHAPE-AGREE migration, and send Personal > SoP one handoff through me carrying its section 6."

ACT-THREAD took option a), so the optional `<territory>.<initiative>` thread id in section 5 is not wanted.

## Boundary

- In, from section 5:
  - `ki-repo-kb-activities`: Home accepts either `initiative: <slug>` or an explicit territory home stewarded by the state-of-play thread; the audit warns only when an Activity has neither, or both.
  - `ki-work-recurring`: templates and runs inherit an Initiative or territory home on the same terms.
  - `ki-work`: Attributes by level gives an Activity's parent as one Initiative or the territory; the Initiative `## Notes` rule still points to Activities by upward link only.
  - `ki-pmo`: a new Activities subsection: no thread for an Activity; the state-of-play thread may dispatch a briefed occurrence into its own run; reports, queries and decisions land as section 3 describes; improving an Activity is a Project; occurrences count against the agent limit, not the thread cap.
  - `ki-pmo` Thread naming: no `<territory>.<initiative>.<activity>` id.
  - `ki-checkpoint`: a checkpoint with no Project no longer takes an `<initiative>.` prefix that looks like a Project stem.
  - `ki-delegation`: an activity occurrence runs in the state-of-play run, its brief taken from the Activity note.
- Out: renaming existing checkpoints, folders or slugs, and retitling Initiatives, which belong to the SHAPE-AGREE migration and its IDS-MIGRATE pass; Personal's section 6 handoff and its `Admin/Operations/Activities/` work, which go to Personal > SoP through Kris; a short-title field, which ACT-NAMES declined.

## Dependencies / blocks

Sequenced after the SHAPE-AGREE migration's harness checker. Kris Brown agreed SHAPE-AGREE on 17 October 2026 at 22:50 BST as "one migration after the restart: harness checker first, then folders, decisions logs and thread ids together". This record's checkpoint and naming changes must land against that checker and in the same pass as the folder and thread-id renames, so that nothing is renamed twice. No record for the checker exists yet; when it is captured, it belongs in this record's `blocked_by`.

## Discussion

Captured on Kris Brown's ACT-WORK answer. Questions for planning: whether the seven skill changes stay one delivery or split by skill; and how a territory home is written in Activity frontmatter.
