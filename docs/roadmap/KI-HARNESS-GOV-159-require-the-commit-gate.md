---
id: KI-HARNESS-GOV-159
area: GOV
title: Require the commit gate
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T08:28:53Z
updated_at: 2026-10-08T08:28:53Z
---

# KI-HARNESS-GOV-159: Require the Commit Gate

## Goal

`HOOK-1` and `HOOK-2` move from WARN to FAIL once the estate carries a bound `.githooks/pre-commit`, so a repository without a running commit gate fails its baseline audit.

## Context

`KI-HARNESS-GOV-117` introduced `HOOK-1` (committed, executable, safe hook) and `HOOK-2` (relative `core.hooksPath .githooks` binding) at WARN under [ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content.md), because most repositories had no committed hook when the criteria landed. Raising them is a separate reviewed step so the estate can converge first.

## Boundary

In scope: confirming estate convergence from fresh `ki repo audit` evidence, raising both levels, and updating the `ki-repo` standard and rubric. Out of scope: adding hooks to repositories, which each receiver owns through trades; content criteria.

## Discussion

Captured as a follow-on of `KI-HARNESS-GOV-117` during the Baseline rollout.
