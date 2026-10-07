---
id: KI-HARNESS-GOV-148
area: GOV
title: Let senders withdraw trades
kind: deliver
purpose: capability
project: territories-and-trades
component: governance
status: cancelled
resolution: obsolete
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T23:49:32Z
updated_at: 2026-10-07T17:20:40Z
---

# KI-HARNESS-GOV-148: Let senders withdraw trades

## Goal

The `ki-trades` standard lets a sender withdraw a submitted trade that the receiver has not received. Withdrawal removes the sender's outbound copy, records withdrawal evidence that stays traceable after the copy is gone, and is refused once receipt is observable. The standard also defines how a withdrawn trade appears to the receiver and in both repositories' audits, so withdrawal is never mistaken for premature release.

## Context

The sender lifecycle today has only mutable `preparing`, immutable `submitted`, and observation-led release. A submitted trade can leave the sender only through `ki trade release` once its observation policy is satisfied, and `ki trade abandon` refuses after submission. A sender that submits in error, or whose receiver never receives, has no supported way out.

Motivating case: harness trades `TRD-8004751b` (knowledge, from `KI-HARNESS-GOV-118`) and `TRD-d03495e9` (work, from `KI-HARNESS-GOV-090`), both addressed to `knowledgeislands/tools-ki` and never received, had to be deleted by hand as Kris's explicit one-off exception to this standard on 2026-10-07, in harness commit [`9cac0452`](https://github.com/knowledgeislands/ki-agentic-harness/commit/9cac045245a36326f02e8e3a9aa192e7749e4f85) ("chore(trades): withdraw two unreceived tools-ki trades by hand"). Their content now lives in `tools-ki` Triage records `KI-TOOL-CLI-110` and `KI-TOOL-CLI-111`. The hand deletion left no withdrawal evidence beyond the commit message.

Origin: `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md` (last committed at `87e160fa3f730677ebc275e60662960d0760ab5e`), which records the hand withdrawal and its replacement records. Kris approved capturing this record on 2026-10-07; it is captured, not adopted.

This is the harness side of `tools-ki` [KI-TOOL-CLI-111](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/KI-TOOL-CLI-111-surface-undeliverable-trades.md), which adds `ki repo trade withdraw <id>` and explicitly leaves the standard change to the harness. No existing harness record duplicates this.

## Boundary

In scope: the `ki-trades` standard and rubric, and the `ki-trade` operating guidance that mirrors the lifecycle, so that withdrawal is a governed sender operation with defined evidence, refusal, receiver-visible and audit semantics.

Out of scope:

- The `ki repo trade withdraw` command and its messaging, which `tools-ki` owns under `KI-TOOL-CLI-111`.
- Route policy and the undeliverable-route detection in the rest of `KI-TOOL-CLI-111`.
- Withdrawing a received trade. After receipt the sender's only path remains observation-led release, and the receiver keeps its disposition authority.
- Retroactively adding evidence for `TRD-8004751b` and `TRD-d03495e9`; their hand deletion stands as a recorded one-off exception.

## Dependencies / blocks

Blocks `tools-ki` [KI-TOOL-CLI-111](https://github.com/knowledgeislands/tools-ki/blob/main/docs/roadmap/KI-TOOL-CLI-111-surface-undeliverable-trades.md) as build order: its withdraw command implements semantics this standard must define first. `KI-TOOL-CLI-111` records the reciprocal blocked-by. The link is stated here rather than in `blocks`, because those fields hold only identifiers that resolve in this roadmap.

## Cancelled

Approved by Kris on 2026-10-07 under decision 13 of the state-of-play design ("Yes please, lets reduce stuff": cancel and prune obsolete or ownerless records).

Trades are on hold (decision 11), and sender-side withdrawal overlaps KI-TOOL-CLI-111 in `knowledgeislands/tools-ki`, cancelled with it. The trades hold review due 2026-10-14 (HOLD-1 in `ki-trades`) decides whether trades return; any withdrawal design is re-specified then. No outstanding changes.

## Discussion

### Sections it changes

In [the trade standard](../../skills/governance/ki-trades/references/standards-trades.md):

- [Storage and identity](../../skills/governance/ki-trades/references/standards-trades.md#storage-and-identity) — say where withdrawal evidence lives once the outbound copy at `-/_TRADES/<receiver-owner>/<receiver-repository>/` is removed, and whether that identity may ever be reused.
- [Copy and write authority](../../skills/governance/ki-trades/references/standards-trades.md#copy-and-write-authority) — add withdrawal to what the sender may remove, and state that the receiver never writes or infers withdrawal evidence.
- [Delivery and decision](../../skills/governance/ki-trades/references/standards-trades.md#delivery-and-decision) — add `withdrawn` as a delivery fact alongside `submitted · waiting`, `submitted · received` and `released`, reachable only from `submitted · waiting`.
- [Observation policies](../../skills/governance/ki-trades/references/standards-trades.md#observation-policies) — state that withdrawal does not satisfy or depend on any policy.
- [Release and pruning](../../skills/governance/ki-trades/references/standards-trades.md#release-and-pruning) — distinguish withdrawal from release and premature release, define the refusal once receipt is observable, and define what a receiver sees: no receivable record, and a receive refusal that names the withdrawal rather than reporting an unavailable or ambiguous identity.
- [Contents](../../skills/governance/ki-trades/references/standards-trades.md#contents) — follows any new or renamed section.

Elsewhere in `skills/governance`:

- `ki-trades` rubric: the `STATUS` and `RELEASE` criteria (`scripts/rubric/items/status.ts`, `scripts/rubric/items/release.ts`) and the regenerated `references/rubric.md`, so audits accept recorded withdrawal and flag an outbound absence with neither release eligibility nor withdrawal evidence.
- `ki-trade` `SKILL.md` Lifecycle diagram and What this skill does, plus [the trade-operations procedure](../../skills/governance/ki-trade/references/standards-trade-operations.md) sections 4 (Submit or abandon, whose "Refuse after submission" rule stays for abandon), 6 (List and show) and 8 (Finish), naming the new `withdraw` operation.

### Open questions

- Where does withdrawal evidence live: a retained sender-local record under `-/_TRADES/` with a new terminal `phase`, a ledger file, or only a commit trailer? Kris's direction requires evidence of trade ID, receiver, reason, time and actor that survives removal of the outbound copy.
- How is the receipt race handled when a receiver receives from a committed sender reference that predates the withdrawal? The receiver's audit then sees an inbound copy with no outbound and withdrawal evidence; it should report that distinctly and leave disposition to the receiver rather than treat it as premature release.
- Does a withdrawn trade's knowledge or work need a mandatory successor reference, as the motivating case carried by `KI-TOOL-CLI-110` and `KI-TOOL-CLI-111`, or is a free-text reason enough?
