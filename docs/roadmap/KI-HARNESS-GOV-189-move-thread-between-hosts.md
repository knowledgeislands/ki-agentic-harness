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
updated_at: 2026-10-14T17:00:00Z
---

# Move a Coordinating Thread to Another Host

## Goal

A coordinating thread can move from one machine to another without waiting for its whole queue to drain: only the agents already running finish on the old host, and the queued work restarts on the new host from the thread's checkpoint.

## Context

`ki-pmo` governs coordinating threads and `ki-delegation` the detached background agents they launch through `ki agent`. Both assume a thread stays on the host where it started: running and queued agents, the run's decisions log and its reports live in machine-local state under `~/.local/state/ki/agents/<run>/`. A thread that has to move today must either wait until every queued agent has run, or abandon its queue.

This is a cross-repository handoff from Knowledge Islands Principal's [Mac Studio Setup Project](../../../ki-principal/Streams/Projects/mac-studio-setup/mac-studio-setup.md), which is bringing a second machine back into service so that threads can resume there. Kris decided on 2026-10-14, recorded in that run's machine-local decisions log on the laptop, in these words:

> if there is a wish to somehow move a thread over to another machine, because of the way that we're doing the delegation, we need to drain it down. But obviously, there can be quite a lot of stuff that can be queued up potentially. So we should almost decide that stuff that's queued up gets pushed back into the checkpoint, and so when the next machine starts up, it will re-queue it on its machine from that checkpoint, and that will allow us to move things over and only wait for things that are actually already running to be completed.

The receiving repository keeps priority, planning and acceptance; capturing this record adopts nothing. It is not blocking the Mac Studio Setup Project.

## Boundary

- In scope: a thread-move procedure in the `ki-pmo` standard, and whatever `ki-delegation` needs to say about the run's machine-local state when it moves.
- Out of scope: the `ki agent` queue export and re-import mechanics, which belong to `tools-ki`; host provisioning, which belongs to the Mac Studio Setup Project and Rig; any change to the skill made by this capture.

## Proposed rule

1. **Drain only running agents.** On the old host, stop launching; let the agents already running finish and report.
2. **Write queued work back into the checkpoint.** Each queued agent's brief, or a pointer to it, is recorded in the thread checkpoint as work to re-queue, and removed from the old host's queue.
3. **Move the run's state into the tracked thread folder.** The run's decisions log and reports move from `~/.local/state/ki/agents/<run>/` into the tracked `+/_THREADS/<run>/` folder, which is committed and pushed.
4. **Start on the new host.** The new host pulls every affected repository level, opens the Capital, re-queues from the checkpoint and pastes the thread's resume line.
5. **Retire the old host's session.** The old session ends once the move is pushed and the new session has re-bootstrapped.
6. **Close the old instance with DONE.** Once the handover has pushed, the thread instance left on the old host closes with a DONE frame that has no resume line and points to the host that took over.

## Discussion

### Open questions

- How `ki agent` exports a queue and re-imports it on another host: whether the checkpoint carries the briefs themselves or only references to tracked brief files, and how a re-queue avoids a duplicate run if the old queue was not cleared.
- Agents that must run on a specific host, for example work against a machine-local resource or a host-bound service: whether they stay queued on the old host, are held in the checkpoint with a host constraint, or block the move.

### Decisions-log transfer, observed 2026-10-14

The mac-studio-bootstrap thread moved from the laptop to `sol` on 2026-10-14, and Kris approved recording what that took (Kris, 2026-10-14: "I want to capture any differences and also make an onboarding guide for a rig"). The run's decisions log, `~/.local/state/ki/agents/mac-studio-bootstrap/decisions.md`, is machine-local and not in Git, so nothing carried it: an approved agent copied it to the same path on `sol` with the run reports, and the checkpoint recorded that the live copy was now on `sol` and the laptop's copy frozen. Until rule 3 lands, a move depends on that manual copy, and a thread that resumes without it has its checkpoint but none of the owner decisions in the owner's words. The procedure should say:

- which files in the run folder travel (the decisions log, reports and briefs) and which stay behind (process ids, launch records, logs and status files);
- that the checkpoint names the host holding the live decisions log, and the old host's copy is frozen from the move mark;
- how a re-bootstrap on the new host proves it has the latest log, for example by the last entry's time and words matching the checkpoint's last recorded decision.

### DONE on handover, decided 2026-10-14

Kris decided on 2026-10-14 that the instance a host move leaves behind closes as done rather than resting (Kris, 2026-10-14: "we do sometimes need done, not just rest and busy"). Its closing banner uses the DONE frame, issued only after the handover has pushed, carries no resume line, because that instance must not be resumed, and names the host that took over the thread. `ki-pmo`'s DONE frame today appears only at [Project close](../../skills/change-management/ki-pmo/references/standards-pmo.md#project-close); this requirement extends it to a thread instance retired by a host move, while the thread itself continues on the new host.

### Relation to existing records

KI-HARNESS-GOV-187 makes the thread model and the issued banner normative in `ki-pmo`; any procedure here edits the same standard and should follow it.
