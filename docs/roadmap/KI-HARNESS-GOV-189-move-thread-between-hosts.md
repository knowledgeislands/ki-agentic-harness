---
id: KI-HARNESS-GOV-189
area: GOV
title: Repository level check
project: mac-studio-setup
kind: deliver
priority: medium
size: m
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: db5e3cff2946beaa05bbf2f821dc7d93fb1daf97
transferred_from: ki-principal/Streams/Projects/mac-studio-setup/mac-studio-setup.md
created_at: 2026-10-14T14:17:58Z
updated_at: 2026-10-22T01:44:06Z
---

# Repository Level Check

## Goal

Before a cross-host resume, at every mark and before leaving a host, the coordinator checks the work's repositories against their remotes and carries unresolved behind findings visibly in its active banner.

## Context

`ki-coordination` governs coordinating threads and `ki-delegation` the detached background agents they launch through `ki agent`. Both assume a thread stays on the host where it started: running and queued agents, the run's decisions log and its reports live in machine-local state under `~/.local/state/ki/agents/<run>/`. A thread that has to move today must either wait until every queued agent has run, or abandon its queue.

This is a cross-repository handoff from Knowledge Islands Principal's [Mac Studio Setup Project](../../../ki-principal/Streams/Projects/mac-studio-setup/mac-studio-setup.md), which is bringing a second machine back into service so that threads can resume there. Kris decided on 2026-10-14, recorded in that run's machine-local decisions log on the laptop, in these words:

> if there is a wish to somehow move a thread over to another machine, because of the way that we're doing the delegation, we need to drain it down. But obviously, there can be quite a lot of stuff that can be queued up potentially. So we should almost decide that stuff that's queued up gets pushed back into the checkpoint, and so when the next machine starts up, it will re-queue it on its machine from that checkpoint, and that will allow us to move things over and only wait for things that are actually already running to be completed.

The work model, [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md), written into the harness by [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md), has since changed the ground this record stands on. The checkpoint becomes the work file `+/_WORK/<id>/work.md`; the decisions log, reports and briefs already live in the tracked work folder `+/_WORK/<id>/`, with briefs under `briefs/<run>.md`; a pause is the `on-hold` state rather than a drain; and a closing is the `finished` state with its glyph banner rather than the DONE frame. The proposed rule below is read in those terms, and the DONE-on-handover decision is noted, not settled, under the work model.

The receiving repository keeps priority, planning and acceptance; capturing this record adopts nothing. It is not blocking the Mac Studio Setup Project.

## Boundary

- In scope: the decided repository level check in `ki-coordination`, its resume and mark entry points, and the `[behind]` housekeeping item.
- Out of scope: queue export or re-import, moving briefs, host-bound runs, the old host's closing form, a new CLI command, live estate synchronisation, and changes to `ki-delegation`.

Kris narrowed the record to this boundary on 22 October 2026 at 02:25 BST under GOV189-SCOPE a). The overnight brief authorises shaping and delivery within it; the broader earlier host-move proposal is deferred, not implemented by this record.

## Proposed rule

Run `mgit fetch` for the work's repositories, then read `mcp-git-audit`'s ahead and behind report, before cross-host resume, at each mark and before departure. Territory work checks its estate. Carry unresolved behind findings as `[behind]` housekeeping items in active banners. Handle ahead findings under the existing publication rules and failed checks as unknown. Dirty or diverged checkouts retain the existing owner escalation. On hold banners retain their existing form.

## Current state

The narrowed plan is approved by the 22 October overnight brief. The narrowed guidance is delivered from the immutable baseline in front matter. Baseline harness tests, TypeScript and full isolated audit pass; existing warnings are retained separately.

## Steps

- [x] Apply the owner's narrowed scope and preserve the broader host-move questions as deferred.
- [x] Add the repository level rule, mark and resume pointers, and `[behind]` active-banner housekeeping item.
- [x] Verify generated coordination surfaces and rubric, harness tests, TypeScript and focused audits; prepare the review packet.

## Files touched

- This roadmap record.
- `skills/change-management/ki-coordination/references/standards-coordination.md`.
- Generated coordination surfaces or rubric only if their source projection changes.

## Verify

Run `bun run test`, `bunx --no-install tsc --noEmit`, `ki dev skill generate ki-coordination`, `ki dev skill rubric ki-coordination`, and sequential focused audits for `ki-coordination`, `ki-skills`, `ki-authoring`, `ki-work` and `ki-work-roadmap`. Run the full isolated harness audit and the mandatory commit hooks. No live estate-level check is part of this documentation delivery.

## Dependencies / blocks

No implementation dependency remains for the narrowed check. Queue transfer and host-bound run handling remain outside the approved boundary.

## Documentation impact

### Decision Records

None needed: the owner decisions of 14 and 18 October are in the decisions logs quoted above.

### Specifications

None: no Specification covers coordination.

### Guides

None in this repository; a host onboarding guide belongs to the Mac Studio Setup Project and Rig.

### Roadmap

None.

## Review

### Delivered

Delivered the 22 October narrowed level-check boundary from the immutable `baseline_ref`. No queue-transfer or host-retirement procedure was delivered, and no live estate operation was run.

### Change Summary

Added one repository-level-check section in the coordination standard, pointers at mark and cross-host pick-up, and the unresolved `[behind]` housekeeping item. Existing publication authority, dirty/diverged-checkout handling and On hold banner rules remain the governing constraints. Narrowed this record under Kris's GOV189-SCOPE answer; generated surfaces and rubric require no changes.

### Verification

`bun run test`: 1,414 pass, zero fail. `bunx --no-install tsc --noEmit`: pass. `ki dev skill generate ki-coordination` and `ki dev skill rubric ki-coordination`: in sync. Sequential focused audits for coordination, skills, authoring, work and roadmap, plus the full isolated harness audit and mandatory commit hooks, pass before publication. Existing fleet warnings are recorded separately from this contract; the initial authoring and roadmap checks identified contents-list indentation and an overlong title, both corrected before the final checks.

### Outstanding concerns

No unresolved concern in the narrowed delivery. Full host-move mechanics and the historical questions below are deferred; this delivery supplies no authority to execute them. Independent acceptance remains outstanding.

### Post-change review

The rule covers the decided resume, mark and departure triggers without introducing a command or automatic synchronisation. Ahead findings remain governed by the existing publication rule, and unknown checks cannot claim level. The change is ready for independent review within its narrowed scope.

### Mini recap

Delivered the repository level check and visible behind findings, with source tests, type checking and hosted verification. Durable guidance is homed in its owning standard. No new work record, acceptance or pruning occurred.

## Discussion

### Deferred host-move questions

- How `ki agent` exports a queue and re-imports it on another host: whether the checkpoint carries the briefs themselves or only references to tracked brief files, and how a re-queue avoids a duplicate run if the old queue was not cleared.
- Agents that must run on a specific host, for example work against a machine-local resource or a host-bound service: whether they stay queued on the old host, are held in the checkpoint with a host constraint, or block the move.

### Decisions-log transfer, observed 2026-10-14

The mac-studio-bootstrap thread moved from the laptop to `sol` on 2026-10-14, and Kris approved recording what that took (Kris, 2026-10-14: "I want to capture any differences and also make an onboarding guide for a rig"). The run's decisions log, `~/.local/state/ki/agents/mac-studio-bootstrap/decisions.md`, is machine-local and not in Git, so nothing carried it: an approved agent copied it to the same path on `sol` with the run reports, and the checkpoint recorded that the live copy was now on `sol` and the laptop's copy frozen. Under the work model the decisions log is tracked in `+/_WORK/<id>/decisions.md`, so this gap closes once the work moves into its work folder; until then, a move depends on that manual copy, and a thread that resumes without it has its checkpoint but none of the owner decisions in the owner's words. The procedure should say:

- which files in the run folder travel (the decisions log, reports and briefs) and which stay behind (process ids, launch records, logs and status files);
- that the checkpoint names the host holding the live decisions log, and the old host's copy is frozen from the move mark;
- how a re-bootstrap on the new host proves it has the latest log, for example by the last entry's time and words matching the checkpoint's last recorded decision.

### DONE on handover, decided 2026-10-14

Kris decided on 2026-10-14 that the instance a host move leaves behind closes as done rather than resting (Kris, 2026-10-14: "we do sometimes need done, not just rest and busy"). The decision named the DONE frame for its closing banner, issued only after the handover has pushed, carrying no send line, because that session must not be resumed, and naming the host that took over the work. Under the work model, `ki-coordination`'s closing banner, `🏁 Finished`, appears only at [Finishing Project work](../../skills/change-management/ki-coordination/references/standards-coordination.md#finishing-project-work); this requirement extends a closing form to the session a host move retires on the old host, while the work itself continues on the new host, and step 6 leaves planning to settle which form that is.

### Level check, decided 2026-10-18

Before a work resumes on another Mac, and at every mark, the coordinator checks that the work's repositories are level: `mgit fetch` across them, then `mcp-git-audit`'s ahead and behind report. A repository behind its remote shows as a `[behind]` item in the banner and an unpushed one as `[unpushed]`, so neither is lost between hosts. Kris agreed on 18 October 2026 in the ways-of-working decisions log, 17:59 BST owner answers: "sync guard. Yeah, got your recommendation" (SYNC-GUARD a)). The recommendation read: "Fold 'level before resume and at every mark' into KI-HARNESS-GOV-189: mgit fetch then mcp-git-audit ahead/behind across the estate at session start, at every mark and before leaving a host, with [behind] and [unpushed] banner items; capture a tools-ki `ki repo level` record only if that proves too slow." The banner's housekeeping items do not yet include `[behind]`, so planning adds it to `ki-coordination` with the check.

### Relation to existing records

KI-HARNESS-GOV-187 makes the thread model and the issued banner normative in `ki-coordination`; any procedure here edits the same standard and should follow it.

### Disposition, 20 October 2026

Kris Brown answered HARNESS-TRIAGE on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "let's get the ball moving forwards", taken as a) with changes. Adopted into Next. Queue export and host-bound agents are still open, and it does not block the Mac Studio setup.

### Narrowed delivery authority - 22 October 2026

Kris took GOV189-SCOPE a) at 02:25 BST: narrow this record to the decided level check and `[behind]`. The overnight brief authorises delivery to awaiting review, local fast-forward integration and publication of this run's own verified commits. The queue-transfer and old-instance closing proposals above remain historical context and supply no implementation authority.
