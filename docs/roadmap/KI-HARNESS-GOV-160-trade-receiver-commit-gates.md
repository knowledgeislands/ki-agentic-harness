---
id: KI-HARNESS-GOV-160
area: GOV
title: Trade receiver commit gates
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T08:28:53Z
updated_at: 2026-10-08T08:28:53Z
---

# KI-HARNESS-GOV-160: Trade Receiver Commit Gates

## Goal

`tools-rig` and the chezmoi source each receive a trade asking them to commit and bind a `.githooks/pre-commit` that runs their existing check-only gates, so the criteria `KI-HARNESS-GOV-117` added have repositories to pass.

## Context

`KI-HARNESS-GOV-117` was raised because both repositories run real gates - `tools-rig` an eight-command gate in its `AGENTS.md`, the chezmoi source `node --test` suites and `rumdl` through `ki repo audit` - with no hook and no `core.hooksPath`, and four Markdown findings reached the chezmoi source's history on 2026-09-27 that a sub-second check-only hook would have stopped. The harness now governs the gate (`HOOK-1`, `HOOK-2`, `SHELL-HOOK`, `GIT-2`) but adding the hook is each receiver's decision.

## Boundary

In scope: preparing and submitting one `ki-trades` work trade to each receiver, naming the criteria and the check-only rule. Out of scope: writing either repository's hook, amending `ADR-DOTFILES-006` in the chezmoi source, and any remote operation beyond the trade transport the receiver accepts.

## Discussion

Captured as a follow-on of `KI-HARNESS-GOV-117` during the Baseline rollout.
