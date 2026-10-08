---
id: KI-HARNESS-GOV-166
area: GOV
title: Retire shared_record
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T13:49:15Z
updated_at: 2026-10-08T13:49:15Z
---

# KI-HARNESS-GOV-166: Retire shared_record

## Goal

The vestigial `shared_record` Decision Record mechanism is retired, so the `ki-decision-records` standard, rubric and code describe only the local records that every repository now holds.

## Context

The GOV-020 Decision Record scope rollout made every record's scope equal its repository's `repo_code`, enforced by `ROOT-3`. It deleted the mirrored `GDR-KI-FUNDAMENTALS-001` copies, and Arcadia's former TECHNE records and its fundamentals record became local records without `shared_record`. No live record now carries the field, yet it survives in `docs/specs/governance.md`, [GDR-KI-HARNESS-007](../decisions/GDR-KI-HARNESS-007-document-metadata-and-principal-authority.md), the `ki-decision-records` SKILL.md, audit mode and standard, and the rubric's `shared-projection` context and its tests.

## Boundary

In scope: confirming that no repository in the territory still uses `shared_record`; removing the field, the shared-projection context and its rubric wiring and tests; and updating the standard, specification and any affected Decision Record. Out of scope: Decision Record scope rules (`ROOT-3`); cross-repository provenance, which stays with canonical source references.

## Discussion

Captured as a follow-up of the GOV-020 Decision Record scope rollout, whose report found the mechanism effectively vestigial.
