---
id: KI-HARNESS-GOV-090
area: GOV
title: Accept estate work trades
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 9fda7bc0b17826b60281459f419999c426b3e1d8
created_at: 2026-09-24T10:07:00Z
updated_at: 2026-10-04T11:52:31Z
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

Superseded on 2026-10-04: `.ki.toml` now declares explicit work and knowledge import routes for every Knowledge Islands repository, and `ki repo trade routes check` reports all 70 route directions active. The paragraph below records the state when this item was captured.

`.ki.toml` lines 111-127 declare routes for sixteen peers. Only `knowledgeislands/ki-specifications` and `knowledgeislands/ki-techne-principal` carry `import = ["work"]`, so those two are the only repositories in the estate that can successfully report a defect to the harness. Every other repository governed by these skills — the 5G-EMERGE sites, the MCP servers, the tooling repositories, the principals — can submit a work trade that will never arrive.

## Steps

- [x] Establish which repositories should be able to report harness defects. The likely answer is every repository the harness governs, since the defects they hit are the harness's own; confirm that rather than assume it.
- [x] Decide whether a blanket inbound work route is right, or whether the route list should stay explicit and be extended only on request. Record the reasoning — an estate-wide grant is a standing intake decision, not a convenience.
- [x] Declare the agreed routes with `ki trade routes add <repository> --direction import --kind work`, and confirm each with `ki trade routes check`.
- [x] Decide the ownership of silent dead-lettering. A sender that cannot tell the difference between "received and ignored" and "never arrived" is the real fault here, and the sender-side `release` error message actively misleads by naming a receiver that never had a route.
- [x] If that is a CLI defect, prepare and submit a work trade to `knowledgeislands/tools-ki` describing it, since that repository owns the command surface.

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

## Review

### Delivered

Steps 1 to 5 against immutable baseline `9fda7bc0b17826b60281459f419999c426b3e1d8`. The route declarations themselves landed earlier in `6378206c` and `77ec746d`. This run verified them, recorded the intake decision, and submitted the CLI defect to `tools-ki` as work trade `TRD-d03495e9` (observation `decision`). No CLI change, route widening, or edit to another repository was made.

### Change Summary

- Steps 1 and 2: who may report harness defects. The harness keeps an explicit per-peer route list rather than a blanket estate-wide grant. Every Knowledge Islands repository has `import = ["work", "knowledge"]` with standing `shared-capability-maintenance` knowledge intake. The `.ki.toml` comment at the head of `[skills.ki-trades]` records the exclusion of HNR, legal, personal and other company groups. Repositories in those groups report harness defects through their own principal or Knowledge Islands repositories, not through a formal route. An explicit list needs no Decision Record, as this record's Documentation impact already states.
- Step 3: the routes are declared (`6378206c`, `77ec746d`) and `ki repo trade routes check` reports `ROUTES=70 ACTIVE=70`.
- Step 4: silent dead-lettering is a `tools-ki` CLI defect, not a harness policy gap. `routes check` already computes `awaiting-receiver` (`src/core/trade/estate.ts`), but `tradeLifecycle` (`src/core/trade/lifecycle.ts`) reports every unreceived outbound record as `awaiting-receipt` without consulting that route state, and submission on a pending route is allowed (`8533e1b`).
- Step 5: submitted `-/_TRADES/knowledgeislands/tools-ki/TRD-d03495e9.md`. It asks `tools-ki` to report undeliverable outbound trades, warn at submit, allow release or abandon on an inactive route, and name the missing receiver route in refusals.
- This record: the Current state is superseded, the Steps are complete, and this packet is added.

### Verification

- `ki repo trade routes check`: `ROUTES=70 ACTIVE=70`.
- `ki repo audit --skill ki-trades`: PASS.
- `ki repo audit --skill ki-work-roadmap`: PASS.
- `ki repo trade list` in `tools-ki`, before submission: no existing trade, and no `tools-ki` roadmap item already covering the defect.
- The second Verify bullet was not executed: a live test submission from a previously unrouted repository. The original sender, `5g-emerge-phase2`, is an HNR repository and is deliberately not routed. Every Knowledge Islands repository already reports an `active` reciprocal route, and an active reciprocal route is the precondition that `TRD-8b69fe1b` lacked. A live round-trip would mean writing a trade in another repository, which was outside this run's authority.

### Outstanding concerns

- The live round-trip in Verify bullet 2 is replaced by route-state evidence. The reviewer should decide whether that is sufficient.
- Dead-letter detection depends on `tools-ki` adopting `TRD-d03495e9`. Under the Boundary and the Dependencies section, that hand-over does not hold this item open.

### Post-change review

The goal holds for the estate the owner has chosen to route. Every Knowledge Islands repository that can legitimately report a harness defect has an active inbound work route. For the remaining dead-letter path, the owning repository now holds a concrete, evidenced request. The original wording, "every repository the harness governs", is deliberately narrowed by the owner's standing route policy, and the narrowing is recorded here rather than silently assumed. Regression risk is nil because no configuration or code changed in this run.

### Mini recap

Intake routes are verified active across the Knowledge Islands estate. Explicit per-peer routing is recorded as the decision, and silent dead-lettering is routed to `tools-ki` as `TRD-d03495e9`. Learning route: none beyond the trade.

## Done

Accepted 2026-10-04 on the review packet above, under the owner's delegated estate-push authority following an independent Fable review verdict of ACCEPT. The reviewer accepted route-state evidence in place of a live test submission, confirmed the TRD-d03495e9 defect description against tools-ki source, and observed the trade visible at its receiver as awaiting receipt.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified partial delivery: commits `6378206c` and `77ec746d` are reachable from the audited destination. [The current intake declaration](../../.ki.toml#L115) accepts work from explicitly named KI repositories and expressly excludes formal routes to HNR, legal, personal and other company groups. The old statement that only two repositories can report defects is no longer the current configuration.
- Remaining: reconcile the original estate-wide goal with this narrower standing intake policy, establish the disposition of silent dead-lettering, and verify the intended receiving path. This audit did not submit or receive a trade, test live delivery, or establish completion of the CLI follow-up.
- Closure route: review the existing approved scope against the current policy and capture any necessary owner decision before reconciling the plan and preparing its review packet. Do not widen routes or repeat already-landed declarations merely to satisfy the historical checklist.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

Raised from a live session in `5g-emerge-phase2` that went looking for the trade's status and found the deadlock underneath it. The instruction was to drop the trade and raise the route problem directly in the repository that owns the declaration, rather than fold a governance change into a cleanup commit.

Worth holding on to: the trade protocol's failure mode here was silent in both directions and a month long, and it was only found because somebody asked what had happened to one specific record. That is a poor property for a transport whose whole purpose is that reports do not get lost.
