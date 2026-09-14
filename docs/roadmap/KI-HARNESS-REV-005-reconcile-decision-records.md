---
id: KI-HARNESS-REV-005
area: REV
title: Reconcile Decision Records
theme: regular-reviews
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:14:29Z
updated_at: 2026-09-14T19:14:29Z
housekeeping_template: KI-HARNESS-HK-002
scheduled_for: 2026-09-09
---

# Reconcile Decision Records

## Goal

Check that the estate's current Decision Record authority remains coherent and discoverable while preserving historical reasoning as history.

## Context

The monthly reconciliation became due on 2026-09-09. The estate has continued to add and supersede governance, architecture, operations, and strategy decisions. This run should establish whether current indexes, statuses, predecessor and successor links, and authority boundaries still agree.

## Boundary

This is a read-only estate review with Harness-local recording. It must not rewrite another repository, reinterpret historical records as current authority, or silently repair ambiguous decision relationships. Cross-repository findings remain receiver-owned follow-up proposals.

## Current state

Ready. The recurring template supplies the reconciliation boundary. Locally registered and available repositories may be inspected; unavailable repositories must be reported as unavailable rather than inferred clean.

## Steps

- [ ] Inventory canonical Decision Record collections and their identifiers, types, statuses, scopes, and indexes in locally available estate repositories.
- [ ] Check explicit predecessor and successor links, supersession status, related current contracts, and duplicate authority signals.
- [ ] Separate current authority from roadmap items, trades, generated publications, and historical notes.
- [ ] Record unavailable evidence and uncertainty explicitly.
- [ ] Deduplicate findings and route only material Harness-owned follow-up to Triage; retain receiver-owned findings for their repositories.
- [ ] Complete the canonical review packet.

## Files touched

- This roadmap item.
- `docs/housekeeping/KI-HARNESS-HK-002-monthly-decision-reconciliation.md` for lifecycle linkage and successful-run advancement.
- A new Harness roadmap record only if the review establishes a material, non-duplicate local candidate.

## Verify

- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-work-housekeeping --repo .`
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `git diff --check`

## Dependencies / blocks

No delivery block. The review is bounded to locally available evidence and records any coverage gaps.

## Documentation impact

### Decision Records

No current Decision Record is changed by this review. Material corrections require separately owned roadmap work.

### Specifications

No Specification change. This run reviews authority coherence rather than defining behaviour.

### Guides

No guide change unless a separately accepted finding establishes a new operator workflow.

### Roadmap

Retain this record as successful-run evidence. Route material Harness-owned findings to Triage; leave receiver-owned findings with their repositories.

## Review

Pending implementation.

## Discussion

Readiness acceptance: the review must state the inspected repository population and unavailable scope, distinguish broken discoverability from harmless history, and leave ambiguous or receiver-owned corrections unmodified. Successful closure advances the recurring template from its scheduled date and clears `active-run` atomically.
