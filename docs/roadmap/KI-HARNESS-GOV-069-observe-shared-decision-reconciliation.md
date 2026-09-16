---
id: KI-HARNESS-GOV-069
title: Observe Shared Decision Reconciliation
area: GOV
theme: governance-consistency
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-16T08:55:11Z
updated_at: 2026-09-16T21:28:23Z
---

# Observe Shared Decision Reconciliation

## Goal

Compare the canonical projection of `GDR-KI-FUNDAMENTALS-001` across all six owning repositories and establish whether estate-wide reconciliation is complete.

## Context

The Harness defines a deterministic shared Decision Record projection and can reconcile its own copy, while Arcadia, Techne, tools-ki, KI Specifications, and KI Website retain independent authority over their copies. Only a later observation after receiver-owned updates can support an estate-wide claim.

## Boundary

Read all six records without mutating them. Compare only the approved canonical projection, report excluded `note_type` metadata separately, and fail closed on unknown frontmatter. Do not infer acceptance from matching bytes, open roadmap work, or silence.

## Current state

Harness and tools-ki have accepted revisions. The remaining receiver projections now match the approved content in committed, independently owned Awaiting review records:

- [KI-ARCADIA-GOV-008](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-GOV-008-reconcile-shared-fundamentals-decision.md) at `2d9a48e`, retaining only `note_type: admin/governance/decision`.
- [KI-TECHNE-GOV-010](https://github.com/knowledgeislands/ki-techne-principal/blob/main/Streams/Roadmap/KI-TECHNE-GOV-010-reconcile-shared-fundamentals-decision.md) at `96288f2`, retaining only `note_type: admin/governance/decision`.
- [KI-SPEC-RGV-002](https://github.com/knowledgeislands/ki-specifications/blob/main/docs/roadmap/KI-SPEC-RGV-002-reconcile-shared-fundamentals-decision.md) at `67e1004`, byte-identical to the canonical projection.
- [KI-WEB-SITE-006](https://github.com/knowledgeislands/ki-website/blob/main/docs/roadmap/KI-WEB-SITE-006-reconcile-shared-fundamentals-decision.md) at `41d9600`, byte-identical to the canonical projection.

Matching committed content does not satisfy the receiver-acceptance condition. Each review packet still needs explicit human acceptance before this observation can run.

## Steps

- [ ] Confirm the four receiver-owned review packets are accepted and record their accepted revisions.
- [ ] Read the exact accepted revisions for all six owning repositories.
- [ ] Compare decision-owned frontmatter and complete body, excluding only permitted Knowledge Base `note_type` fields.
- [ ] Record each inspected revision, projection result, excluded field, and any fail-closed refusal.
- [ ] Publish the six-repository observation and exact review packet.

## Files touched

- this roadmap record

## Verify

- Every receiver record is accepted before comparison begins.
- The two Knowledge Base projections match after removing exactly one permitted `note_type` field.
- The four code-repository projections match byte for byte.
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `git diff --check`

## Dependencies / blocks

No build-order blocker belongs in `blocked_by`: all receiver content exists. Execution is deliberately gated on explicit acceptance of the four receiver-owned Awaiting review records because the shared-decision contract forbids inferring acceptance from matching content.

## Documentation impact

### Decision Records

No Decision Record mutation is planned; this item observes accepted projections only.

### Specifications

No behaviour-level specification changes; the deterministic projection contract is already accepted.

### Guides

No guide changes; the result belongs in the review packet for this observation.

### Roadmap

This item coordinates the four receiver review outcomes and records estate-wide completion without accepting or pruning receiver-owned work.

## Discussion

### Acceptance boundary

Run only after each receiver-owned reconciliation record reaches an accepted revision. Record the six repository revisions inspected, projection result for each copy, any unknown-field refusal, and the exact residual difference. A successful observation may report reconciliation; it does not accept or prune receiver work.
