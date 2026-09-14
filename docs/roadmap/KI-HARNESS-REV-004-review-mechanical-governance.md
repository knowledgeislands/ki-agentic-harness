---
id: KI-HARNESS-REV-004
area: REV
title: Review Mechanical Governance
theme: regular-reviews
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 990431d86d985bd453750dc781ebba510ab1707c
created_at: 2026-09-14T19:14:29Z
updated_at: 2026-09-14T19:34:00Z
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

- [x] Inventory repeated mechanical governance operations evidenced by recent work.
- [x] Record frequency signal, cost, owner, deterministic input, judgment boundary, and testable no-write failure mode for each credible candidate.
- [x] Classify each result as retained judgment, prepared context, bounded mechanical check, separately owned proposal, or watch-only signal.
- [x] Deduplicate candidates against current roadmap and existing automation.
- [x] Route only material Harness-owned follow-up to Triage and complete the canonical review packet.

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

### Delivered

Baseline `990431d86d985bd453750dc781ebba510ab1707c`; review run `KI-HARNESS-BATCH-018-RUN-001` inspected repository history, current generated surfaces, evaluation registration, batch preparation, source ledgers, roadmap metadata, and recent GitHub Actions evidence.

### Summary of changes

The review classified nine recurring or suspected operations. It routed three local, non-duplicate proposals: urgent source-Harness CI repair in `KI-HARNESS-OPS-007`, capability-count drift checking in `KI-HARNESS-FND-023`, and eval-registry coverage in `KI-HARNESS-FND-024`. Batch scaffolding belongs to `tools-ki`; remediation totals and source freshness retain judgment; generated publication already has bounded automation; roadmap timestamps and one isolated timeout remain watch-only.

### Verification

- Seven consecutive CI runs on 2026-09-13 and 2026-09-14 fail before meaningful audit because the released embedded Harness predates the checkout's capabilities or roadmap contract.
- Generated catalogue changes outpaced root README edits 13 to seven since 2026-08-09; a public count was stale by six and then seven capabilities.
- Six commits manually registered scenarios since 2026-08-11; all 26 present scenario modules are currently registered.
- Forty-two commits touched current or legacy batch records since 2026-08-09; existing hash and resolver mechanics were distinguished from still-manual authority-preserving scaffolding.
- Each candidate has an owner, evidence, classification, safety boundary, and no-write failure signal; roadmap dedup found no existing owner for the three local proposals.

### Outstanding concerns

GitHub Actions remains red until `KI-HARNESS-OPS-007` is accepted and delivered. The receiver-owned `tools-ki` batch-scaffolding proposal is not created or implemented by this Harness-only run. Weak or one-off signals intentionally remain unpromoted.

### Post-change review

No public contract or runtime state changed. The new records are unadopted Triage proposals for discussion. Existing generated-publication and golden-total checks were not duplicated or weakened.

### Mini recap

The recurring review converted repeated delivery friction into three bounded local proposals, one receiver-owned tooling proposal, two retained-judgment decisions, and watch evidence without granting automatic write authority.

## Done

Accepted 2026-09-14 through `KI-HARNESS-BATCH-018` on the evidence-backed review packet above.

## Discussion

Readiness acceptance: every evaluated candidate must have evidence, classification, proposed owner, explicit safety boundary, and testable no-write failure mode. One-off or weak signals remain visible without becoming speculative work. Successful closure advances the recurring template from its scheduled date and clears `active-run` atomically.
