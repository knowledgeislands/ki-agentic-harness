---
id: KI-HARNESS-GOV-080
area: GOV
title: Clarify standing trade authority
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 02b97f520d1699111d790113cd0ffdc2f5eabf43
created_at: 2026-09-21T08:08:16Z
updated_at: 2026-09-22T01:53:25Z
---

## Goal

Knowledge Islands has one unambiguous authority model for standing trade agreements and unattended delivery, clearly distinguishing pre-authorised knowledge intake from any future automatic execution.

## Context

The trade system already implements two related ideas. `ki-trades` defines exact reciprocal standing knowledge-intake grants, and `tools-ki` exposes `ki trade standing` operations. Separately, `ki-trade` defines an `unattended` observation policy that requests no response but still waits for observable receipt.

The governing sources do not currently describe those concepts consistently. `GDR-KI-HARNESS-005` and the core `ki-trades` standard describe knowledge as `receipt` and work as `decision` or `completion`, while the `ki-trade` procedure and `ki-next` also recognise `unattended`. The current names can additionally make a standing intake grant sound like background transfer, automatic application, or advance acceptance even though the model grants none of those authorities.

This is the right point to settle the contract before standing agreements are used broadly or automation is built on top of ambiguous terminology.

## Boundary

This item reconciles the portable trade authority, vocabulary, kind/policy matrix, and future automation boundary. It does not assume that standing authority should extend to work, authorise background execution, activate any standing route, or directly change `tools-ki` or another repository. Host changes discovered by the review must be returned through a bounded handoff or trade after the Harness contract is agreed.

## Current state

The decision record and `ki-trades` standard define reciprocal standing knowledge-intake grants, while `ki-trade` and `ki-next` additionally use `unattended` as an observation policy. The concepts are implemented but named closely enough to imply execution authority they do not grant.

## Steps

- [x] Define one authority matrix separating standing knowledge intake, per-trade unattended observation, receiver disposition, execution, acceptance, release, and pruning.
- [x] Keep standing grants knowledge-only and state explicitly that they grant capture eligibility, not application, prioritisation, implementation, acceptance, or background execution.
- [x] Define `unattended` solely as an observation and release policy for an itemised trade, with receipt still evidenced and receiver authority unchanged.
- [x] Align `GDR-KI-HARNESS-005`, the `ki-trades` standard and rubric, `ki-trade`, and `ki-next`, including activation, reciprocal consent, revocation, and historical evidence terminology.
- [x] Add focused authority and lifecycle fixtures, then identify exact `tools-ki` follow-on requirements without editing that repository.

## Files touched

- `docs/decisions/GDR-KI-HARNESS-005-cross-repository-trade-routes.md`
- `skills/governance/ki-trades/SKILL.md`
- `skills/governance/ki-trades/references/standards-trades.md`
- `skills/governance/ki-trades/references/rubric.md`
- `skills/governance/ki-trades/scripts/rubric/`
- `skills/governance/ki-trade/SKILL.md`
- `skills/governance/ki-trade/references/standards-trade-operations.md`
- `skills/change-management/ki-next/references/standards-next-work.md`

## Verify

- Focused trade tests prove standing capture cannot imply execution and unattended delivery cannot bypass receipt or receiver disposition.
- Generated `ki-trades` rubric publication matches its source.
- `ki repo audit --skill ki-trades --repo .` and `ki repo audit --skill ki-skills --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No external dependency blocks the portable authority clarification. Any `tools-ki` command or persistence change is receiver-owned follow-on work through the existing trade route.

## Documentation impact

### Decision Records

Amend `GDR-KI-HARNESS-005` so the durable authority model matches the clarified contract.

### Specifications

Record downstream `tools-ki` specification consequences as a bounded handoff; do not amend that repository here.

### Guides

Update only existing operational guidance whose wording currently conflates standing intake and unattended observation.

### Roadmap

Capture a `tools-ki` receiver record only if implementation consequences remain after the Harness contract is complete.

## Review

### Delivered

The portable trade contract now separates reciprocal standing knowledge intake from itemized observation policies and from any future automatic transport or execution authority.

### Summary of changes

- Added `unattended` and `receipt` for both knowledge and work, with `decision` and `completion` remaining work-only.
- Made explicit that `unattended` requests no response but still requires evidenced receipt before sender release.
- Documented standing activation, reciprocal consent, immediate revocation for new capture, and retained historical introduction evidence.
- Aligned the decision record, `ki-trades`, `ki-trade`, and `ki-next`, and added focused policy and release tests.

### Verification

- Focused `ki-trades` context and catalogue tests pass.
- The generated `ki-trades` rubric matches its source.
- TypeScript, the full test suite, and focused repository audits passed at the final batch gate.

### Outstanding concerns

`tools-ki` still needs receiver-owned follow-on work to accept and validate the clarified policy matrix, expose configured, active, revoked, and historical standing states, and treat `unattended` as receipt-bound during release. It must not infer automatic transport, execution, acceptance, or publication authority. Future automation remains a separate authority contract.

### Post-change review

The change remains within the approved boundary: it changes the portable Harness contract and its tests but does not edit `tools-ki` or activate any standing agreement.

### Mini recap

Standing intake now means exact, reciprocal, knowledge-only capture authority. `unattended` now means itemized no-response-requested observation with an evidenced receipt boundary; neither grants execution authority.

## Discussion

### Planning decisions

Standing intake remains deliberately knowledge-only. `unattended` remains a per-trade observation policy, not a standing agreement or execution grant. Any future autonomous transfer or application requires a separate authority contract covering idempotency, scheduling, failure recovery, evidence, and revocation.

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
