---
id: KI-HARNESS-GOV-109
area: GOV
title: Fail when commit gates are absent
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T15:58:00Z
updated_at: 2026-09-26T15:58:00Z
---

# KI-HARNESS-GOV-109: Fail when commit gates are absent

## Goal

A run that cannot execute this repository's commit gates is stopped rather than waved through. Today the absence of the gate and the passing of the gate are indistinguishable from inside the run, which is the property that makes every other governance rule optional in practice.

## Context

`core.hooksPath` is set to `.husky/_` in `.git/config`, which is shared by the primary checkout and every linked worktree. `.husky/_` and `node_modules` are produced by `bun install` through the `prepare` script, and that is per working directory. A linked worktree created for an agent task therefore has neither. Git resolves `core.hooksPath` to a directory that does not exist, finds no `pre-commit`, and commits successfully with no diagnostic.

Observed directly in the worktree for coordination task `KNO-34`: `git config core.hooksPath` returns `.husky/_`, and both `.husky/_` and `node_modules` are absent. Five commits landed on that branch without `lint-staged`, without the staged TypeScript check, and without the staged-snapshot `ki-skills` audit. The same commands on the primary checkout run all three. Nothing in the run reported the difference.

The second half of the same gap is the audit. `ki harness list` on this host reports `installed (0)`, and every `ki repo audit --skill <skill>` and `ki dev skill rubric <skill>` exits 1 with `declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); ... is not installed`. That exit is loud and therefore not itself the defect. The defect is that the repository has no position on what a writer should do when its own declared audits cannot run: an unavailable audit is unknown, not a pass, and nothing in the repository says so or acts on it.

Both halves share a cause — the dependency graph a checkout needs to verify itself is not present where the writing happens — and produce opposite symptoms. The hook fails silently; the audit fails loudly but with no defined consequence.

## Boundary

In scope: making the absence of a commit gate a failure rather than a pass in this repository, whether by bootstrapping the worktree, by pointing `core.hooksPath` at a location every worktree resolves, or by a gate that refuses when its tooling is missing; and stating what a writer must do when a declared audit cannot run.

Out of scope: installing a harness on any particular host, which is a user-environment action and not a repository change; the content of any rubric criterion, which is `KI-HARNESS-GOV-104` and its covering tasks; write-root enforcement, which is coordination task `KNO-10`; and the fleet-wide question of whether other repositories in the estate share the configuration, which needs this repository's answer first.

## Discussion

### Why this is not "remember to run bun install"

A convention that every worktree runs `bun install` first is exactly the class of rule this repository has just spent an afternoon learning not to trust: it is unenforced, its violation is invisible, and the cost of the violation falls on a later reader. The gate either runs or the commit does not happen. A worktree that cannot verify itself should say so at the moment it tries to write, not leave a clean-looking history behind.

### The trade-off to decide

Bootstrapping the worktree automatically is convenient and makes the gate real, but it means a commit can trigger a dependency install, which is slow and surprising and can fail for network reasons unrelated to the change. Refusing instead is honest and cheap but blocks the writer until they act. A third option is a committed hook stub outside `node_modules` that runs the full gate when the tooling is present and exits non-zero with instructions when it is not, which preserves the refusal without owning an install. The item should choose one and say why, not offer all three.

### Relationship to `KI-HARNESS-FND-026`

`KI-HARNESS-FND-026` records that `ki repo conform` does not run `bun install` or report an installation requirement, so a later commit fails with a missing-module error that looks unrelated. That is the same absent dependency graph reaching the same hook from the other direction, and its symptom is a confusing loud failure where this item's symptom is a clean silent pass. They may well resolve together. Keeping them separate at capture avoids deciding that before either is shaped; whichever is adopted first should re-read the other and say plainly if one supersedes it.

### Coordination linkage

Discovered while delivering coordination task `KNO-34`, and named in that task's review by the coordinating agent as work that nothing currently covers. Both observations behind it are consequences of that task rather than its subject: the task's own verification could not run its audit criterion, and the task's own commits bypassed the hook that would have caught it. Capture is not adoption. The number for this record was reserved by a committed advance of `docs/roadmap/_ISSUES.md` on the primary checkout before the record existed, applying the rule `KI-HARNESS-GOV-104` writes.
