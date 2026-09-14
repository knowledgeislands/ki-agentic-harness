---
id: KI-HARNESS-GOV-063
area: GOV
title: Reconcile Shared Decision Payload
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:26:00Z
---

# Reconcile shared Decision Record payload

## Goal

Resolve the conflict between byte-identical shared Decision Records and repository-local metadata, then coordinate one valid canonical fundamentals payload.

## Context

Six repositories mark `GDR-KI-FUNDAMENTALS-001` as shared, but the estate contains three current byte variants. The Harness copy retains stale `ki-repo-specifications` and `ki-repo-website` names; three project copies use current names; the Arcadia and Techne Knowledge Base copies add local `note_type` metadata. The current shared-record contract requires byte identity.

## Boundary

Do not rewrite receiver copies until the authority decision is explicit. Preserve each repository's acceptance authority and historical reasoning. First decide whether shared identity permits repository-local metadata or requires an external projection mechanism.

## Discussion

The Harness owns the `ki-decision-records` contract and therefore owns the initial decision. Delivery will require coordinated receiver-local changes across the six repositories after the canonical payload and metadata rule are accepted.
