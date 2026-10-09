---
id: KI-HARNESS-GOV-167
area: GOV
title: Restore gap-free decision serials
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T07:40:00Z
updated_at: 2026-10-09T07:40:00Z
---

# KI-HARNESS-GOV-167: Restore gap-free decision serials

## Goal

Decision Record serials are gap-free again: each prefix-and-scope series starts at `001` and is contiguous, records are living documents refined in place, and a real removal or reclassification renumbers the series and sweeps every citation in the same change.

## Context

Kris decided on 2026-10-09 (GOV-020 owner decision 6) that decision-record serials must be gap-free, and that Decision Records are living documents: refine and update existing records in place so every key decision stays visible, which keeps gaps rare. This reverses the gaps-allowed outcome of KI-HARNESS-GOV-099 (done and pruned; harness commits `3455e0f0`, `8187a07d`, `15f84f7a`), which [ADR-KI-HARNESS-SKILLS-018](../decisions/ADR-KI-HARNESS-SKILLS-018-decision-record-serials-may-contain-gaps.md) records.

## Boundary

In scope: amending ADR-KI-HARNESS-SKILLS-018 in place, the `ki-decision-records` standard and CONSOLIDATE mode, a new contiguity rubric item under a fresh code, the INDEX-8 wording, tests and the generated rubric, and a read-only territory-wide check of which repositories would now fail.

Out of scope: renumbering any record in another repository; `KI-OBS-VIS-004` in `apps-observatory`, which may keep its contiguity check, so no trade is raised.

## Discussion

Captured from the GOV-020 state-of-play rollout; Kris's decision is the approval of this outcome.
