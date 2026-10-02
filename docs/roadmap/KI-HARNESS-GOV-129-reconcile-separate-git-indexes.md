---
id: KI-HARNESS-GOV-129
area: GOV
title: Reconcile separate Git indexes
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-02T06:06:07Z
updated_at: 2026-10-02T06:06:07Z
---

# KI-HARNESS-GOV-129: Reconcile separate Git indexes

## Goal

An agent that commits through a temporary `GIT_INDEX_FILE` in a shared checkout can leave the ordinary index consistent with the new `HEAD` without staging another writer's work or discarding a concurrent edit.

## Context

During `DOTFILES-UE-054`, the user required commits through a separate index because other writers were active in the dotfiles checkout. Commit `0f45e7d` advanced `HEAD` with the intended roadmap file, but the ordinary index still held that file's parent-commit blob. Git then displayed `MM` for a working file that already matched the new commit. A later commit using the ordinary index could have reintroduced the old version.

The repair checked that the ordinary index entry for the owned path still equalled the parent-commit blob, then updated only that path's index entry to the new `HEAD`. The same effect had appeared after an earlier separate-index roadmap commit. The current `ki-git` standard permits a temporary index for isolated staging and says it does not isolate working files or serialize `HEAD`; it does not explain this post-commit state or its safe reconciliation.

## Boundary

This item owns portable `ki-git` guidance for the shared-index state after a commit made with a temporary index. It should cover the short serialized Git write window, exact-path checks, and the stop condition when another writer has staged a different blob on the same path.

It does not make temporary indexes the default, authorize a whole-index reset, or repair another actor's working files, staged changes, or history. `DOTFILES-UE-054` owns the completed instance; this record owns the reusable guidance.

## Discussion

The safe sequence needs to distinguish a stale parent entry from a real concurrent staged edit. Verify the commit contains only owned paths; for each affected path, compare the ordinary index entry with the pre-commit state before reconciling that exact path to the new `HEAD`. If the entry changed or `HEAD` advanced again, stop and coordinate. New files, deleted files, hook-modified files, and unrelated staged work need explicit treatment so a convenient `git reset` recipe cannot silently erase another writer's contribution.

Consider whether the rule belongs in `skills/governance/ki-git/references/standards-git.md` alone or also needs a focused verification fixture. The guidance should retain the standard's existing preference for a serialized write window and explicit-path staging.
