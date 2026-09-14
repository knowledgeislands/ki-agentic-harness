---
id: KI-HARNESS-FND-024
area: FND
title: Verify eval scenario registration
theme: foundation-tooling
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:26:00Z
---

# Verify eval scenario registration

## Goal

Detect scenario modules that are missing from the static evaluation Harness registry without invoking live models.

## Context

The registry in `evals/harness.ts` was manually updated in six commits since 2026-08-11. All 26 current scenario modules are registered, but the contribution guide requires two separate edits and an omitted registry entry can silently orphan a scenario.

## Boundary

Prefer a deterministic coverage test over dynamic loading. The check must not invoke Claude, other model providers, credentials, network access, or scenario side effects. It should diagnose orphan modules, duplicate imports, and duplicate scenario identities without writing files.

## Discussion

This is a low-priority Triage proposal. Readiness should establish module naming exceptions, the canonical registry surface, and whether the check belongs to the evaluation Harness or `ki-repo-harness`.
