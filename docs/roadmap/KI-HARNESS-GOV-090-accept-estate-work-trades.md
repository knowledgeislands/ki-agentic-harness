---
id: KI-HARNESS-GOV-090
area: GOV
title: Accept estate work trades
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-24T10:07:00Z
updated_at: 2026-09-27T22:06:13Z
---

## Goal

Every repository in the estate that can legitimately report a harness defect has a declared inbound work route, and a submission arriving without one is surfaced to somebody rather than dropped in silence.

## Context

`5g-emerge/5g-emerge-phase2` submitted work trade `TRD-8b69fe1b` on 2026-08-21, reporting that `WEB-6` emitted an undeclared `WARN` level and aborted the whole-repo audit. It sat in `submitted` for a month and was never received. The cause was not neglect: `.ki.toml` declares 26 routes and none of them names that repository, so the submission had nowhere to land. `ki trade receive --all` reported zero eligible trades while the trade was plainly visible in `ki trade list` as an export awaiting receipt.

Neither side could resolve it. The sender's `ki trade release` refuses with "export work trade route … is awaiting receiver"; the receiver's `ki trade receive` refuses with "outbound trade … is unavailable or ambiguous". A sender with no matching inbound route is therefore in a deadlock it cannot see, detect, or escape, and the report is lost without either party being told.

The particular defect has since been fixed by an unrelated rewrite of `WEB_6`, and the stale record was removed from the sender. That closes the instance and leaves the mechanism untouched: the next defect any unrouted repository reports will disappear exactly the same way.

## Boundary

In scope: which estate repositories get a declared inbound work route, the route declarations themselves, and deciding whether silent dead-lettering is a harness policy gap or a `tools-ki` CLI defect.

Out of scope: implementing any CLI change. `tools-ki` owns trade command mechanics, so a detection or warning behaviour is raised to it as its own trade rather than built here. Knowledge routes are not in scope; this is about work trades only. Re-litigating `TRD-8b69fe1b` is not in scope — it is superseded and gone.

## Current state

`.ki.toml` lines 111-127 declare routes for sixteen peers. Only `knowledgeislands/ki-specifications` and `knowledgeislands/ki-techne-principal` carry `import = ["work"]`, so those two are the only repositories in the estate that can successfully report a defect to the harness. Every other repository governed by these skills — the 5G-EMERGE sites, the MCP servers, the tooling repositories, the principals — can submit a work trade that will never arrive.

## Steps

- [ ] Establish which repositories should be able to report harness defects. The likely answer is every repository the harness governs, since the defects they hit are the harness's own; confirm that rather than assume it.
- [ ] Decide whether a blanket inbound work route is right, or whether the route list should stay explicit and be extended only on request. Record the reasoning — an estate-wide grant is a standing intake decision, not a convenience.
- [ ] Declare the agreed routes with `ki trade routes add <repository> --direction import --kind work`, and confirm each with `ki trade routes check`.
- [ ] Decide the ownership of silent dead-lettering. A sender that cannot tell the difference between "received and ignored" and "never arrived" is the real fault here, and the sender-side `release` error message actively misleads by naming a receiver that never had a route.
- [ ] If that is a CLI defect, prepare and submit a work trade to `knowledgeislands/tools-ki` describing it, since that repository owns the command surface.

## Files touched

- `.ki.toml` — the `[skills.ki-trades]` route table.
- Possibly `skills/change-management/ki-trades/references/` — if the outcome of step 2 is a standing policy about who may report defects, it belongs in the standard rather than only in the route table.

## Verify

- `ki trade routes check` reports every newly declared route as `active`.
- A test submission from a previously unrouted repository appears in that repository's `ki trade receive --all` preview here, rather than reporting zero eligible.
- `ki repo audit --skill ki-trades` passes.

## Dependencies / blocks

None blocking. Step 5 hands work to `knowledgeislands/tools-ki`, which owns the CLI; that hand-over does not hold this item open, and this item closes on the route declarations and the recorded decision.

## Documentation impact

### Decision Records

A standing estate-wide intake grant would be a governance decision worth recording, if step 2 lands there. An explicit per-peer route list needs no Decision Record.

### Specifications

None.

### Guides

None.

### Roadmap

This item. `TRD-8b69fe1b` is referenced by identifier only; the record itself was removed from the sender on 2026-09-24 and resolves against history there.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified partial delivery: commits `6378206c` and `77ec746d` are reachable from the audited destination. [The current intake declaration](../../.ki.toml#L115) accepts work from explicitly named KI repositories and expressly excludes formal routes to HNR, legal, personal and other company groups. The old statement that only two repositories can report defects is no longer the current configuration.
- Remaining: reconcile the original estate-wide goal with this narrower standing intake policy, establish the disposition of silent dead-lettering, and verify the intended receiving path. This audit did not submit or receive a trade, test live delivery, or establish completion of the CLI follow-up.
- Closure route: review the existing approved scope against the current policy and capture any necessary owner decision before reconciling the plan and preparing its review packet. Do not widen routes or repeat already-landed declarations merely to satisfy the historical checklist.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

Raised from a live session in `5g-emerge-phase2` that went looking for the trade's status and found the deadlock underneath it. The instruction was to drop the trade and raise the route problem directly in the repository that owns the declaration, rather than fold a governance change into a cleanup commit.

Worth holding on to: the trade protocol's failure mode here was silent in both directions and a month long, and it was only found because somebody asked what had happened to one specific record. That is a poor property for a transport whose whole purpose is that reports do not get lost.
