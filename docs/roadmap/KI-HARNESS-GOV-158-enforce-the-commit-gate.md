---
id: KI-HARNESS-GOV-158
area: GOV
title: Enforce the commit gate
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T08:28:53Z
updated_at: 2026-10-09T20:58:51Z
---

# KI-HARNESS-GOV-158: Enforce the Commit Gate

## Goal

Every repository shape states what its committed `.githooks/pre-commit` runs, the repositories that still lack a hook receive trades to add one, and once the estate has converged `HOOK-1` and `HOOK-2` move from WARN to FAIL, so a repository without a running commit gate fails its baseline audit.

## Context

### Remaining content criteria

[ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) splits the commit gate: `ki-repo` owns existence and binding (`HOOK-1`, `HOOK-2`), and each shape skill owns content. `KI-HARNESS-GOV-117` (done) gave content criteria to `ki-engineering` (`SCR-11`), `ki-repo-tools` (`SHELL-HOOK`), `ki-repo-kb` (`GATE-1`) and `ki-repo-dotfiles-chezmoi` (`GIT-2`). The other shape skills under `skills/repo-structure/` - including `ki-repo-homebrew-tap`, `ki-repo-specifications`, `ki-repo-project` and `ki-repo-mcp` - still say nothing, so a repository of those shapes passes `HOOK-1` with any hook content at all.

### Raising the existence criteria

`KI-HARNESS-GOV-117` (done) introduced `HOOK-1` (committed, executable, safe hook) and `HOOK-2` (relative `core.hooksPath .githooks` binding) at WARN under [ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md), because most repositories had no committed hook when the criteria landed. Raising them is a separate reviewed step so the estate can converge first.

### Receivers without a hook

`KI-HARNESS-GOV-117` (done) was raised because both repositories run real gates - `tools-rig` an eight-command gate in its `AGENTS.md`, the chezmoi source `node --test` suites and `rumdl` through `ki repo audit` - with no hook and no `core.hooksPath`, and four Markdown findings reached the chezmoi source's history on 2026-09-27 that a sub-second check-only hook would have stopped. The harness now governs the gate (`HOOK-1`, `HOOK-2`, `SHELL-HOOK`, `GIT-2`) but adding the hook is each receiver's decision.

## Boundary

The work runs in three stages, in this order: content criteria, receiver trades, then raising the levels once fresh audit evidence shows convergence.

- **Content criteria:** In scope: deciding, per remaining shape skill, whether it has a check-only command worth requiring and, where it does, one content criterion following the shared rule (not applicable without a hook; unsafe hook a violation; command on a non-comment line without `--fix` or `--write`; level FAIL), with tests, standard text and `contributes: ['.githooks/pre-commit']`. A shape whose repositories are always package-backed may instead rely on `SCR-11` and say so. Out of scope: existence and binding, which `ki-repo` owns; any repository's actual hook.
- **Receiver trades:** In scope: preparing and submitting one `ki-trades` work trade to each receiver, naming the criteria and the check-only rule. Out of scope: writing either repository's hook, amending `ADR-DOTFILES-006` in the chezmoi source, and any remote operation beyond the trade transport the receiver accepts.
- **Raising the levels:** In scope: confirming estate convergence from fresh `ki repo audit` evidence, raising both levels, and updating the `ki-repo` standard and rubric. Out of scope: adding hooks to repositories, which each receiver owns through trades; content criteria.

## Discussion

Captured as follow-ons of `KI-HARNESS-GOV-117` (done) during the Baseline rollout, as three records. Merged on 2026-10-09 with Kris's approval (state-of-play decisions log, Decision 21): this record absorbed KI-HARNESS-GOV-159 (Require the commit gate) and KI-HARNESS-GOV-160 (Trade receiver commit gates), which are cancelled as merged into it.
