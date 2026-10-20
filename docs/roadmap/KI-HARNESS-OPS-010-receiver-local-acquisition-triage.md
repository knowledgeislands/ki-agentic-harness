---
id: KI-HARNESS-OPS-010
title: Receiver-local acquisition triage
kind: deliver
purpose: capability
theme: model
component: acquire
area: OPS
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-20T22:26:28Z
updated_at: 2026-10-20T22:26:28Z
---

# KI-HARNESS-OPS-010: Receiver-Local Acquisition Triage

## Goal

After an AI session is acquired, its receiving repository triages it locally under one `ki-acquire` rule: each complete session is harvested, retained as source evidence, routed onward, or marked as containing no residual knowledge, and that disposition is visible to the receiver without reading the source again.

## Context

This is one of the eight unfinished AI-session acquisition steps carried by [KI-HARNESS-OPS-009](KI-HARNESS-OPS-009-complete-ai-session-acquisition.md). Kris took OPS009-SPLIT a) on 20 October 2026 at 23:16 BST, in the ways-of-working "query sign-offs, first batch": split OPS-009, keeping in the harness only the steps it owns. The common capture contract is `ki-acquire`'s, so the triage rule is the harness's; each receiving repository applies it to its own captures.

## Boundary

- In: the triage dispositions and their evidence in the `ki-acquire` common contract, its rubric and any provider skill that must cite them.
- Out: triaging any particular repository's captures, which each receiver does under its own authority; executable importer changes, which `tools-ki` owns; source retirement.

## Current state

Split from OPS-009, not yet planned.

## Steps

- [ ] Add receiver-local triage after acquisition so complete sessions can be harvested, retained as source evidence, routed onward, or marked as containing no residual knowledge.

## Files touched

To be set when planned.

## Verify

To be set when planned.

## Dependencies / blocks

None in this repository. A receiver applies the rule once it is published.

## Documentation impact

### Decision Records

None yet.

### Specifications

None yet.

### Guides

None yet.

### Roadmap

Split from KI-HARNESS-OPS-009.

## Discussion

### Split - 2026-10-20

Captured at Next as draft, OPS-009's own horizon and status, under Kris's OPS009-SPLIT a), which lifted the capture gate for this split only. No planning has been done.
