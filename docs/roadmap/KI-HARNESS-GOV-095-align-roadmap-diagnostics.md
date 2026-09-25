---
id: KI-HARNESS-GOV-095
area: GOV
title: Align roadmap diagnostics
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T14:21:37Z
updated_at: 2026-09-25T14:21:37Z
---

# Align Roadmap Diagnostics

## Goal

Make roadmap structure diagnostics agree so malformed records and duplicate canonical identifiers cannot pass one supported inspection path while failing or being silently accepted by another.

## Context

Kit Principal exposed two inconsistent results on 2026-09-25. `ki repo audit --skill ki-repo-kb-streams` passed while `ki repo roadmap list` exited non-zero because one file under `Streams/Roadmap/` lacked canonical work-item frontmatter. After that file was migrated, the list command exited successfully while displaying two active records with the same `KIT-007` identifier and no duplicate-identity diagnostic.

The harness owns the portable roadmap and Streams validation contracts and their native rubric contexts. `tools-ki` owns the executable `ki repo roadmap list` and audit hosts. Planning must identify the narrowest shared invariant and route implementation to each owning repository without duplicating validation semantics.

## Boundary

This intake record does not implement a checker, modify `tools-ki`, repair Kit Principal's duplicate identifiers, change existing roadmap lifecycle state, or treat one command's current exit status as the canonical contract.

## Discussion

### Expected diagnostic parity

For the same repository revision, supported roadmap audit and listing paths should agree on whether every direct child is a canonical work item and whether identifiers are unique. A malformed direct child or duplicate identifier should produce explicit, stable diagnostics and a non-zero result in every command that claims structural validation.

### Ownership and verification

The portable rule belongs with the roadmap and Streams governance contracts; executable parsing and command exit behaviour belong in `tools-ki`. Future planning should define fixtures for malformed frontmatter and duplicate identifiers, then verify both KB Streams and non-KB roadmap adapters without coupling either skill to a private CLI implementation.
