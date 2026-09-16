---
id: KI-HARNESS-GOV-069
title: Observe Shared Decision Reconciliation
area: GOV
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-16T08:55:11Z
updated_at: 2026-09-16T08:55:11Z
---

# Observe Shared Decision Reconciliation

## Goal

Compare the canonical projection of `GDR-KI-FUNDAMENTALS-001` across all six owning repositories and establish whether estate-wide reconciliation is complete.

## Context

The Harness defines a deterministic shared Decision Record projection and can reconcile its own copy, while Arcadia, Techne, tools-ki, KI Specifications, and KI Website retain independent authority over their copies. Only a later observation after receiver-owned updates can support an estate-wide claim.

## Boundary

Read all six records without mutating them. Compare only the approved canonical projection, report excluded `note_type` metadata separately, and fail closed on unknown frontmatter. Do not infer acceptance from matching bytes, open roadmap work, or silence.

## Discussion

Run only after each receiver-owned reconciliation record reaches an accepted revision. Record the six repository revisions inspected, projection result for each copy, any unknown-field refusal, and the exact residual difference. A successful observation may report reconciliation; it does not accept or prune receiver work.
