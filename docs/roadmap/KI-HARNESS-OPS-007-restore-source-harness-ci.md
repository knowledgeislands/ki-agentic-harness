---
id: KI-HARNESS-OPS-007
area: OPS
title: Restore source Harness CI
theme: operations
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-14T19:26:00Z
---

# Restore source Harness CI

## Goal

Restore a trustworthy push gate that verifies the checked-out Harness with the released `ki` CLI while retaining released-binary provenance checks.

## Context

Seven consecutive GitHub Actions runs failed on 2026-09-13 and 2026-09-14. Released `ki` v0.3.6 embeds a Harness older than this checkout: the latest failure cannot resolve `ki-model-radar`, while an earlier run applies a roadmap contract that predates timestamps and current horizons. The workflow also uses `actions/checkout@v4`, whose Node 20 runtime now emits a retirement warning.

The released CLI already provides an isolated development-Harness route through `ki dev local set` and `ki dev local on`. A candidate fix can preserve released CLI identity and diagnostics, then explicitly validate and activate the checkout before repair and audit.

## Boundary

Do not publish or install a replacement CLI, weaken released-binary checks, mutate developer state, or infer trust from an arbitrary checkout. CI-local state must remain isolated and the source checkout must be validated before activation. Review the major checkout action update rather than applying future dependency majors automatically.

## Discussion

Treat as urgent Triage because every push is currently red before meaningful repository verification. Readiness should pin the failing run evidence, exact isolated XDG state, activation order, dependency-version evidence, and a regression case where source contracts are newer than the embedded archive.
