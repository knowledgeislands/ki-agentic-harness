---
id: KI-HARNESS-REV-004
area: REV
title: Review Mechanical Governance
theme: regular-reviews
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 990431d86d985bd453750dc781ebba510ab1707c
created_at: 2026-09-14T19:14:29Z
updated_at: 2026-09-14T19:21:00Z
housekeeping_template: KI-HARNESS-HK-001
scheduled_for: 2026-09-09
---

# Review Mechanical Governance

## Goal

Identify evidence-backed opportunities to reduce repeated mechanical governance cost without hiding judgment or widening write authority.

## Context

The monthly review became due on 2026-09-09. Recent capability deliveries repeatedly touched generated publications, source inventories, roadmap lifecycle evidence, and aggregate test expectations. The review should distinguish genuinely repeated deterministic work from one-off friction and from work that must retain human judgment.

## Boundary

This is a review-only run. It may inspect locally available evidence and route material, deduplicated Harness-owned candidates to Triage. It must not change skill contracts, configuration, runtime state, consumer repositories, or external systems.

## Current state

In progress from immutable baseline `990431d86d985bd453750dc781ebba510ab1707c`. The recurring template defines the procedure and successful-run evidence. Initial signals worth testing include hard-coded capability counts, exact remediation-inventory totals, source-ledger freshness shape, a single full-suite timeout that passed on isolation and rerun, and repeated CI failures caused by released-harness lag.

## Steps

- [ ] Inventory repeated mechanical governance operations evidenced by recent work.
- [ ] Record frequency signal, cost, owner, deterministic input, judgment boundary, and testable no-write failure mode for each credible candidate.
- [ ] Classify each result as retained judgment, prepared context, bounded mechanical check, separately owned proposal, or watch-only signal.
- [ ] Deduplicate candidates against current roadmap and existing automation.
- [ ] Route only material Harness-owned follow-up to Triage and complete the canonical review packet.

## Files touched

- This roadmap item.
- `docs/housekeeping/KI-HARNESS-HK-001-monthly-mechanical-governance-review.md` for lifecycle linkage and successful-run advancement.
- A new Harness roadmap record only if the review establishes a material, non-duplicate candidate.

## Verify

- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-work-housekeeping --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `git diff --check`

## Dependencies / blocks

None. Read-only local evidence is available.

## Documentation impact

### Decision Records

No Decision Record change. The review does not make or revise policy.

### Specifications

No Specification change. Any proposed mechanical contract remains separately reviewed work.

### Guides

No guide change unless separately accepted follow-up establishes a new user workflow.

### Roadmap

Retain this record as the successful-run evidence. Create only material, deduplicated Harness-owned follow-up in Triage for discussion.

## Review

Pending implementation.

## Discussion

Readiness acceptance: every evaluated candidate must have evidence, classification, proposed owner, explicit safety boundary, and testable no-write failure mode. One-off or weak signals remain visible without becoming speculative work. Successful closure advances the recurring template from its scheduled date and clears `active-run` atomically.
