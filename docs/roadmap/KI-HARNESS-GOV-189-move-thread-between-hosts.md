---
id: KI-HARNESS-GOV-189
area: GOV
title: move thread between hosts
status: triage
blocks: []
blocked_by: []
baseline_ref: null
transferred_from: ki-principal/Streams/Projects/mac-studio-setup/mac-studio-setup.md
created_at: 2026-10-14T14:17:58Z
updated_at: 2026-10-18T02:22:09Z
---

# Move a Coordinating Thread to Another Host

## Goal

A coordinating thread can move from one machine to another without waiting for its whole queue to drain: only the agents already running finish on the old host, and the queued work restarts on the new host from the work's work file.

## Context

`ki-coordination` governs coordinating threads and `ki-delegation` the detached background agents they launch through `ki agent`. Both assume a thread stays on the host where it started: running and queued agents, the run's decisions log and its reports live in machine-local state under `~/.local/state/ki/agents/<run>/`. A thread that has to move today must either wait until every queued agent has run, or abandon its queue.

This is a cross-repository handoff from Knowledge Islands Principal's [Mac Studio Setup Project](../../../ki-principal/Streams/Projects/mac-studio-setup/mac-studio-setup.md), which is bringing a second machine back into service so that threads can resume there. Kris decided on 2026-10-14, recorded in that run's machine-local decisions log on the laptop, in these words:

> if there is a wish to somehow move a thread over to another machine, because of the way that we're doing the delegation, we need to drain it down. But obviously, there can be quite a lot of stuff that can be queued up potentially. So we should almost decide that stuff that's queued up gets pushed back into the checkpoint, and so when the next machine starts up, it will re-queue it on its machine from that checkpoint, and that will allow us to move things over and only wait for things that are actually already running to be completed.

The work model, [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), written into the harness by [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md), has since changed the ground this record stands on. The checkpoint becomes the work file `+/_WORK/<id>/work.md`; the decisions log, reports and briefs already live in the tracked work folder `+/_WORK/<id>/`, with briefs under `briefs/<run>.md`; a pause is the `on-hold` state rather than a drain; and a closing is the `finished` state with its glyph banner rather than the DONE frame. The proposed rule below is read in those terms, and the DONE-on-handover decision is noted, not settled, under the work model.

The receiving repository keeps priority, planning and acceptance; capturing this record adopts nothing. It is not blocking the Mac Studio Setup Project.

## Boundary

- In scope: a thread-move procedure in the `ki-coordination` standard, and whatever `ki-delegation` needs to say about the run's machine-local state when it moves.
- Out of scope: the `ki agent` queue export and re-import mechanics, which belong to `tools-ki`; host provisioning, which belongs to the Mac Studio Setup Project and Rig; any change to the skill made by this capture.

## Proposed rule

1. **Hold, letting only running agents finish.** On the old host, the work moves to `on-hold`: stop launching, and let the agents already running finish and report.
2. **Write queued work back into the work file.** Each queued agent's brief sits in `+/_WORK/<id>/briefs/<run>.md`, is named in the work file's Next steps as work to re-queue, and is removed from the old host's queue.
3. **Commit and push the work folder.** The decisions log, reports and briefs already live in the tracked `+/_WORK/<id>/`, so this step is only its commit and push; nothing moves out of `~/.local/state/ki/agents/<run>/`, which keeps runtime files alone.
4. **Start on the new host.** The new host pulls every affected repository level, opens the Capital, re-queues from the work file's Next steps and pastes the thread's resume line.
5. **Retire the old host's session.** The old session ends once the move is pushed and the new session has re-bootstrapped.
6. **Close the old instance.** Once the handover has pushed, the instance left on the old host closes with no resume line and points to the host that took over. The 2026-10-14 decision named the DONE frame, which the work model's `finished` glyph banner supersedes; planning settles which form an old-host instance uses, since the work itself continues and is not finished.

## Discussion

### Open questions

- How `ki agent` exports a queue and re-imports it on another host: whether the checkpoint carries the briefs themselves or only references to tracked brief files, and how a re-queue avoids a duplicate run if the old queue was not cleared.
- Agents that must run on a specific host, for example work against a machine-local resource or a host-bound service: whether they stay queued on the old host, are held in the checkpoint with a host constraint, or block the move.

### Decisions-log transfer, observed 2026-10-14

The mac-studio-bootstrap thread moved from the laptop to `sol` on 2026-10-14, and Kris approved recording what that took (Kris, 2026-10-14: "I want to capture any differences and also make an onboarding guide for a rig"). The run's decisions log, `~/.local/state/ki/agents/mac-studio-bootstrap/decisions.md`, is machine-local and not in Git, so nothing carried it: an approved agent copied it to the same path on `sol` with the run reports, and the checkpoint recorded that the live copy was now on `sol` and the laptop's copy frozen. Under the work model the decisions log is tracked in `+/_WORK/<id>/decisions.md`, so this gap closes once the work moves into its work folder; until then, a move depends on that manual copy, and a thread that resumes without it has its checkpoint but none of the owner decisions in the owner's words. The procedure should say:

- which files in the run folder travel (the decisions log, reports and briefs) and which stay behind (process ids, launch records, logs and status files);
- that the checkpoint names the host holding the live decisions log, and the old host's copy is frozen from the move mark;
- how a re-bootstrap on the new host proves it has the latest log, for example by the last entry's time and words matching the checkpoint's last recorded decision.

### DONE on handover, decided 2026-10-14

Kris decided on 2026-10-14 that the instance a host move leaves behind closes as done rather than resting (Kris, 2026-10-14: "we do sometimes need done, not just rest and busy"). The decision named the DONE frame for its closing banner, issued only after the handover has pushed, carrying no send line, because that session must not be resumed, and naming the host that took over the work. Under the work model, `ki-coordination`'s closing banner, `🏁 Finished`, appears only at [Finishing Project work](../../skills/change-management/ki-coordination/references/standards-coordination.md#finishing-project-work); this requirement extends a closing form to the session a host move retires on the old host, while the work itself continues on the new host, and step 6 leaves planning to settle which form that is.

### Relation to existing records

KI-HARNESS-GOV-187 makes the thread model and the issued banner normative in `ki-coordination`; any procedure here edits the same standard and should follow it.
