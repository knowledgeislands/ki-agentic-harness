---
id: KI-HARNESS-GOV-080
area: GOV
title: Clarify standing trade authority
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-21T08:08:16Z
updated_at: 2026-09-21T08:08:16Z
---

## Goal

Knowledge Islands has one unambiguous authority model for standing trade agreements and unattended delivery, clearly distinguishing pre-authorised knowledge intake from any future automatic execution.

## Context

The trade system already implements two related ideas. `ki-trades` defines exact reciprocal standing knowledge-intake grants, and `tools-ki` exposes `ki trade standing` operations. Separately, `ki-trade` defines an `unattended` observation policy that requests no response but still waits for observable receipt.

The governing sources do not currently describe those concepts consistently. `GDR-KI-HARNESS-005` and the core `ki-trades` standard describe knowledge as `receipt` and work as `decision` or `completion`, while the `ki-trade` procedure and `ki-next` also recognise `unattended`. The current names can additionally make a standing intake grant sound like background transfer, automatic application, or advance acceptance even though the model grants none of those authorities.

This is the right point to settle the contract before standing agreements are used broadly or automation is built on top of ambiguous terminology.

## Boundary

This item reconciles the portable trade authority, vocabulary, kind/policy matrix, and future automation boundary. It does not assume that standing authority should extend to work, authorise background execution, activate any standing route, or directly change `tools-ki` or another repository. Host changes discovered by the review must be returned through a bounded handoff or trade after the Harness contract is agreed.

## Discussion

### Concepts to distinguish

The contract should name and relate four separate capabilities:

- ordinary itemised `TRD-*` preparation, submission, receipt, disposition, release, and pruning;
- an `unattended` observation policy, if retained, that removes an expectation of response without bypassing explicit receipt;
- standing knowledge intake, which pre-authorises an exact receiver-owned knowledge subtype for explicit commit-pinned local capture; and
- any future automatic transport or execution, which does not exist today and would need its own authority and recovery model.

### Policy questions

The review should decide whether `unattended` and `receipt` are meaningfully distinct, which trade kinds permit each observation policy, and whether current host validation matches that matrix. It should confirm whether standing intake remains deliberately knowledge-only and document why, rather than allowing its current limitation to look accidental.

Standing declarations also need one clear account of activation, reciprocal consent, revocation, historical evidence, discovery, audit reporting, and the difference between a configured agreement and an executed capture. If future automation remains a desired direction, the contract should state what additional explicit authority, idempotency, scheduling, failure recovery, review evidence, and revocation behaviour would be required before it could be safe.

### Sources to reconcile

The review should align `GDR-KI-HARNESS-005`, the `ki-trades` standard and generated catalogue/rubric, the `ki-trade` procedure, and the `ki-next` disposition language. It should then identify exact downstream specification, documentation, validation, completion, and test changes required in `tools-ki`, without treating the Harness roadmap item as authority to edit that repository.
