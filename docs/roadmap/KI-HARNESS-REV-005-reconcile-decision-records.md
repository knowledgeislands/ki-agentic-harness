---
id: KI-HARNESS-REV-005
area: REV
title: Reconcile Decision Records
theme: regular-reviews
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 990431d86d985bd453750dc781ebba510ab1707c
created_at: 2026-09-14T19:14:29Z
updated_at: 2026-09-14T19:30:00Z
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

In progress from immutable baseline `990431d86d985bd453750dc781ebba510ab1707c`. The recurring template supplies the reconciliation boundary. Locally registered and available repositories may be inspected; unavailable repositories must be reported as unavailable rather than inferred clean.

## Steps

- [x] Inventory canonical Decision Record collections and their identifiers, types, statuses, scopes, and indexes in locally available estate repositories.
- [x] Check explicit predecessor and successor links, supersession status, related current contracts, and duplicate authority signals.
- [x] Separate current authority from roadmap items, trades, generated publications, and historical notes.
- [x] Record unavailable evidence and uncertainty explicitly.
- [x] Deduplicate findings and route only material Harness-owned follow-up to Triage; retain receiver-owned findings for their repositories.
- [x] Complete the canonical review packet.

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

### Delivered

Baseline `990431d86d985bd453750dc781ebba510ab1707c`; review run `KI-HARNESS-BATCH-018-RUN-001` inspected all 20 locally registered estate roots without changing any receiver repository.

### Summary of changes

Seventeen repositories declare `ki-decision-records`; 15 have canonical collections and two MCP housekeeping repositories lack the declared adoption root and index. Across existing collections, all 91 current records have exactly one ordered index entry and every declared decision dependency resolves. The review found three divergent payloads for one six-repository shared record, ten broken Arcadia reference links, two overlapping Harness mode decisions, and historical or forward-work content in current records across Harness, Arcadia, and dotfiles.

The Harness-local findings became `KI-HARNESS-GOV-063`, `KI-HARNESS-GOV-064`, and `KI-HARNESS-GOV-065` in Triage. Receiver-owned findings remain recorded here for `mcp-housekeeping-chatgpt`, `mcp-housekeeping-codex`, `ki-arcadia-principal`, and dotfiles; this batch did not modify or allocate work in those repositories.

### Verification

- Coverage was 20 of 20 locally registered roots; no evidence population was unavailable.
- Fifteen canonical collections pass their mechanical Decision Record audits.
- All 91 current records have exactly one index entry: 51 architecture, 29 governance, nine strategy, one operations, and one product.
- The two declared but absent collections fail the adoption-root and index requirements.
- The shared fundamentals record has three byte variants across six repositories despite `shared_record: true` requiring byte identity.
- Four Arcadia strategy records contain ten dangling non-decision references; current standard placement does not permit those links in `## References`.

### Outstanding concerns

Receiver-owned corrections remain outstanding by design. Shared-record reconciliation requires an explicit Harness authority decision followed by coordinated receiver acceptance. The standard currently has no explicit predecessor, successor, applicability, or supersession metadata in the 91-record corpus, so the review could only validate stated dependencies and present authority.

### Post-change review

No Decision Record was rewritten and no historical evidence was discarded. Roadmap, housekeeping, trade, and generated material stayed outside the current-decision index. The three new local records are unadopted proposals, not agreed policy.

### Mini recap

The estate's indexed Decision Record foundation is mechanically healthy. Five coherence classes are now visible and correctly separated into Harness-owned proposals and receiver-owned follow-up without rewriting history.

## Discussion

Readiness acceptance: the review must state the inspected repository population and unavailable scope, distinguish broken discoverability from harmless history, and leave ambiguous or receiver-owned corrections unmodified. Successful closure advances the recurring template from its scheduled date and clears `active-run` atomically.
