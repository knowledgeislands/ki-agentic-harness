---
id: KI-HARNESS-GOV-065
area: GOV
title: Conform current Decision Records
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:26:00Z
---

# Conform current Decision Records

## Goal

Keep current Harness Decision Records written as present-state authority by removing historical narration and forward-work instructions from the living contract.

## Context

The monthly reconciliation found superseded-state narration in `ADR-KI-HARNESS-TOOLCHAIN-003` and ROADMAP or future-work statements in `ADR-KI-HARNESS-007`, `ADR-KI-HARNESS-012`, and `ADR-KI-HARNESS-TOOLCHAIN-002`. The current Decision Record contract preserves history through Git and routes unfinished work to the roadmap.

## Boundary

Do not erase current rationale, change the enacted decision, or hide unresolved forward work. Move material unfinished obligations to deduplicated roadmap records before removing them from current authority. Treat any semantic change as a separate decision rather than mechanical cleanup.

## Discussion

Readiness should quote the exact candidate passages, classify each as historical, forward work, or current rationale, and identify existing roadmap coverage before any edit.
