---
id: KI-HARNESS-OPS-010
title: Receiver-local acquisition triage
kind: deliver
purpose: capability
theme: model
component: acquire
size: m
area: OPS
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: ed49d2f26b622285a30005e00611fe8cc7b4bc4a
created_at: 2026-10-20T22:26:28Z
updated_at: 2026-10-22T01:46:47Z
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

Shaped and delivered under the 22 October overnight triage-and-draft grant. The approved plan is the single common receiver-triage rule below; it changes no importer, receiver repository or retirement policy. Immutable baseline is in front matter.

## Steps

- [x] Add receiver-local triage after acquisition, with harvested, retained-as-evidence, routed-onward and no-residual-knowledge dispositions, recorded within the existing capture package with evidence and remaining gaps.
- [x] Extend the existing common authority-and-record judgment to cover receiver dispositions and regenerate the readable rubric.
- [x] Verify the rubric, full harness tests, TypeScript, focused acquisition/skills/authoring/work/roadmap audits and full isolated audit; prepare the review packet.

## Files touched

- This roadmap record.
- `skills/acquire/ki-acquire/references/standards-acquisition.md`.
- `skills/acquire/ki-acquire/scripts/rubric/items/acquisition.ts` and generated `references/rubric.md`.

## Verify

Run `ki dev skill rubric ki-acquire`, `bun run test`, `bunx --no-install tsc --noEmit`, sequential focused `ki repo audit --skill` checks for `ki-acquire`, `ki-skills`, `ki-authoring`, `ki-work` and `ki-work-roadmap`, the full isolated harness audit, and mandatory commit hooks. Judge the four dispositions against the no-ledger, faithful-preservation and separate-authority contracts. No particular capture is triaged during this delivery.

## Dependencies / blocks

None in this repository. A receiver applies the rule once it is published.

## Documentation impact

### Decision Records

No new artifact; the common acquisition standard and generated rubric carry the rule.

### Specifications

No new artifact; the common acquisition standard and generated rubric carry the rule.

### Guides

No new artifact; the common acquisition standard and generated rubric carry the rule.

### Roadmap

Split from KI-HARNESS-OPS-009.

## Review

### Delivered

Delivered the single approved receiver-local triage rule from `baseline_ref`, under the overnight brief's planning and implementation authority. No live captures were read, routed, reconciled or retired.

### Change Summary

Added the four dispositions with evidence, scoped coverage and visible gaps in the existing capture package. Retained incomplete-session honesty, separate receiver authority and the prohibition on a parallel ledger or return marker. Extended ACQUIRE-5 and regenerated its publication; provider-specific contracts already inherit the common capture rule, so no provider text changed.

### Verification

Before commit, `bun run test`, TypeScript, generated acquisition rubric verification, the five focused audits named in Verify, the full isolated harness audit and mandatory commit hooks pass. Existing fleet warnings remain separate. Judgment review confirms that intake handling alone cannot claim knowledge harvested, and no-residual-knowledge cannot authorise deletion or hide incomplete coverage.

### Outstanding concerns

No delivery concern. Applying the rule to a receiver's captures remains receiver-owned and requires its local authority. Independent acceptance remains outstanding.

### Post-change review

The common rule supplies receiver-visible disposition without a new schema, ledger, ticket or importer. Preserved source material stays distinct from evaluation. Pending routes and partial harvesting remain open, and retention and retirement stay separate.

### Mini recap

Delivered one common triage rule and its rubric evidence. Durable guidance is homed in acquisition; no new work record or cross-repository action was needed. Awaiting independent review, with no acceptance or pruning.

## Discussion

### Split - 2026-10-20

Captured at Next as draft, OPS-009's own horizon and status, under Kris's OPS009-SPLIT a), which lifted the capture gate for this split only. No planning has been done.

### Overnight delivery - 22 October 2026

The bounded overnight brief adopts the existing draft for delivery under the agreed triage-and-draft grant and takes it through the review boundary. It authorises no receiver mutation, source retirement or new roadmap capture.
