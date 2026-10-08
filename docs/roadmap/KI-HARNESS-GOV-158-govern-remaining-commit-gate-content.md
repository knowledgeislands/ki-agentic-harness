---
id: KI-HARNESS-GOV-158
area: GOV
title: Govern remaining commit-gate content
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-08T08:28:53Z
updated_at: 2026-10-08T08:28:53Z
---

# KI-HARNESS-GOV-158: Govern Remaining Commit-Gate Content

## Goal

Every shape skill whose repositories carry their own verification gates states what a committed `.githooks/pre-commit` runs, so no repository shape is left with an existence check and no content expectation.

## Context

[ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) splits the commit gate: `ki-repo` owns existence and binding (`HOOK-1`, `HOOK-2`), and each shape skill owns content. `KI-HARNESS-GOV-117` (done) gave content criteria to `ki-engineering` (`SCR-11`), `ki-repo-tools` (`SHELL-HOOK`), `ki-repo-kb` (`GATE-1`) and `ki-repo-dotfiles-chezmoi` (`GIT-2`). The other shape skills under `skills/repo-structure/` - including `ki-repo-homebrew-tap`, `ki-repo-specifications`, `ki-repo-project` and `ki-repo-mcp` - still say nothing, so a repository of those shapes passes `HOOK-1` with any hook content at all.

## Boundary

In scope: deciding, per remaining shape skill, whether it has a check-only command worth requiring and, where it does, one content criterion following the shared rule (not applicable without a hook; unsafe hook a violation; command on a non-comment line without `--fix` or `--write`; level FAIL), with tests, standard text and `contributes: ['.githooks/pre-commit']`. A shape whose repositories are always package-backed may instead rely on `SCR-11` and say so. Out of scope: existence and binding, which `ki-repo` owns; any repository's actual hook.

## Discussion

Captured as a follow-on of `KI-HARNESS-GOV-117` (done) during the Baseline rollout.
