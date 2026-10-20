---
id: KI-HARNESS-GOV-209
area: GOV
title: "+/_ACQUIRED/ inbound area"
kind: deliver
purpose: governance
component: repo-structure
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T00:40:08Z
updated_at: 2026-10-18T00:40:08Z
---

# KI-HARNESS-GOV-209: +/_ACQUIRED/ Inbound Area

## Goal

Each territory principal carries a `+/_ACQUIRED/` folder, with a scaffold README, where the acquire port pushes whole packets, and `ki-repo-kb` tells the receiving principal how to triage a packet: file it, turn it into work, park it, or mark it `returned <reason>`. The port alone writes packets there; the receiver never writes into the port.

## Context

Kris decided on 18 October 2026, 01:40 BST, in the `knowledge-acquisition` thread, taking option a) on DISPATCH-PUSH and RETURN-ROUTE ("You have bypassed my finishes, you don't need to ask me"): the port may write, commit and push its own packet commits in `+/_ACQUIRED/` of each territory principal and nowhere else; an island hands back a packet that is not about it by marking it `returned <reason>` in its own `+/_ACQUIRED/`, and the port's next run reads the mark, takes the packet back as a new acquisition with source `return`, removes the packet folder it wrote after reading it back, and adds the reason to that territory's routing card. The options and reasoning are in the [dispatch options report (deleted)](https://github.com/knowledgeislands/ki-principal/blob/ae15e273a39a1cecb7ab7859230339c1359974d1/+/_THREADS/knowledge-acquisition/dispatch-options.report.md) and the [decisions log (finished work)](https://github.com/knowledgeislands/ki-principal/blob/e5ae1ad3/+/_WORK/ki.knowledge-acquisition/decisions.md).

Today `ki-repo-kb` describes `+/` as an inbox and names the folders specialist skills own (`_TRADES`, `_BATCHES`, `_CHECKPOINTS`), but has no inbound area for packets pushed by the acquire port and no receiver guidance for them.

## Boundary

- In: a scaffold `README.md` for `+/_ACQUIRED/` in each territory principal, saying who writes there (the port alone), what a packet is, and the four receiver dispositions; and receiver triage guidance in `ki-repo-kb`: file, turn into work, park, or mark the packet `returned <reason>`, with the rule that the receiver never writes into the port and never deletes a packet it marks returned.
- Out: the port's dispatch, return-reading, removal and routing cards, which belong to the acquire repository's dispatch record ([KB-ACQUIRE-007 (pruned)](https://github.com/krisb/acquire/blob/7f43c67f899df0554de647920ec42609e32001b5/docs/roadmap/KB-ACQUIRE-007-dispatch-packet-push-and-return.md), "Dispatch packet, push and return"); the Observatory view and the `ki-trades` envelope; amending Personal's Decision 7, which belongs to Personal's acquire-dispatch thread; the Acquisition Process note's Enactment record.

## Current state

Captured only, at `next`, on Kris's direction. Not planned, not ready; no scaffold or guidance is written. This is a standalone harness record with no coordinating Project: the Knowledge acquisition work that captured it is finishing on Kris's word of 20 October 2026. The port side now lives in Acquire's [dispatch guide](/Users/krisbrown/workspaces/personal/acquire/docs/guides/operator/dispatch.md), under which a delivery creates a receiver's missing `+/_ACQUIRED/`, so the scaffold is not a precondition for dispatch. On 20 October Kris also dropped the return route, so planning revisits the `returned <reason>` disposition. The packet layout and the exact `returned <reason>` mark form are set by the acquire dispatch record and must be agreed with it before this record is planned.

## Steps

- [ ] Plan: fix the packet folder layout and the `returned <reason>` mark form with the acquire dispatch record.
- [ ] Write the scaffold README and its template.
- [ ] Add receiver triage guidance to `ki-repo-kb`, with rubric coverage for the scaffold where the audit can check it.

## Files touched

To be set when planned.

## Verify

To be set when planned.

## Dependencies / blocks

Related, not blocking: acquire's dispatch record, [KB-ACQUIRE-007 (pruned)](https://github.com/krisb/acquire/blob/7f43c67f899df0554de647920ec42609e32001b5/docs/roadmap/KB-ACQUIRE-007-dispatch-packet-push-and-return.md), "Dispatch packet, push and return".

## Documentation impact

### Decision Records

None: the decision is Kris's 18 October 2026 DISPATCH-PUSH and RETURN-ROUTE answer.

### Specifications

None.

### Guides

None.

### Roadmap

None beyond this record.

## Discussion

Captured from the `knowledge-acquisition` thread's inbound-record run. The receiver's only write is the `returned <reason>` mark in its own `+/_ACQUIRED/`, which keeps the port the single writer across repositories.
