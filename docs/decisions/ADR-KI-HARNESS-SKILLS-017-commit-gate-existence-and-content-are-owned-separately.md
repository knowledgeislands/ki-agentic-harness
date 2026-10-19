---
id: ADR-KI-HARNESS-SKILLS-017
title: 'Commit-gate existence and content are owned separately'
date: 2026-10-08
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
---

# ADR-KI-HARNESS-SKILLS-017: Commit-gate existence and content are owned separately

## Context

The estate's only Git-hook requirement was `SCR-11` in `ki-engineering`, which required Husky to run `lint-staged`, check-only Syncpack and Commitlint. It cannot apply outside a package-backed repository, so a Bash tool repository, a Knowledge Base or a chezmoi source with real gates had no commit-gate criterion from any skill, and its gates ran only when a writer remembered them. Findings reached history in the chezmoi source on 2026-09-27 that a sub-second check-only hook would have refused.

Two simpler answers do not hold. Widening `SCR-11` would require package-manager commands of a repository that has no package manager. Moving the whole requirement into `ki-repo`, the only baseline skill that reaches every repository, would ask it to know each toolchain's commands, which it cannot.

`KI-HARNESS-GOV-109` settled the mechanism: an executable `.githooks/pre-commit` committed outside `node_modules` and bound by a relative `core.hooksPath`, so the hook resolves in every working tree. Husky binds `core.hooksPath` to its generated, untracked `.husky/_`, which a linked worktree that has never run `bun install` lacks, so Git finds no hook and the commit goes through unchecked. A hook that runs a tool the clone has not installed fails the same way, open.

## Decision

Whether a repository has a commit gate and what that gate runs are owned by different skills, and every gate lives in committed `.githooks/`.

- **`.githooks/` holds every hook.** Each repository commits an executable `.githooks/pre-commit`, and `.githooks/commit-msg` where its message gate can run: a package-backed repository runs Commitlint, and a package-less one runs `ki git check-message` once `tools-ki` `KI-TOOL-KI-CLI-161` ships it. Husky is retired: a package-backed repository's `prepare` is `git config core.hooksPath .githooks`, followed by the boundary install where that root exists.
- **`ki-repo` owns existence, binding and the frame.** `HOOK-1` requires the tracked, executable `.githooks/pre-commit` and `HOOK-3` the `.githooks/commit-msg` of a package-backed repository; `HOOK-2` requires the audited working tree's effective `core.hooksPath` to resolve to `.githooks`; `HOOK-4` requires each hook to open with `#!/bin/sh`, find the repository root and refuse, naming the missing tool and its install step, before it runs anything, never suggesting `--no-verify`; `HOOK-5` reports any Husky file, dependency, call or binding left behind; `HOOK-J1` judges that the gate stated in root orientation matches what the hook runs. `ki-repo` never inspects the commands after the frame.
- **Each shape skill owns content.** A skill that knows a repository's toolchain declares and verifies the commands its hook must run after the frame: `SCR-11` is the `ki-engineering` instance, `SHELL-HOOK` the `ki-repo-tools` one, `GATE-1` the `ki-repo-kb` and `ki-repo-harness` ones and `GIT-2` the `ki-repo-dotfiles-chezmoi` one. With no hook, a content criterion is not applicable, because existence is reported once, by `ki-repo`.
- **Content is check-only.** A hook verifies the commit and never rewrites the tree: a content criterion rejects its expected command when the same line carries `--fix` or `--write`, and `ki repo conform` never satisfies a `ki repo audit` requirement. Staged formatters that settle only the staged files under `lint-staged` remain the `SCR-11` exception they already were.

The new and changed criteria report as warnings while the estate converts, and each becomes a failure once the last rollout wave lands. The rollout moves in waves, each under one owner grant covering the repositories it names, committed locally by explicit path in each repository; the owner pushes.

## Consequences

Every repository now meets some commit-gate criterion, and a repository whose toolchain no shape skill yet describes still learns from `HOOK-1` that it lacks a gate. Remaining shape skills gain content criteria as follow-ons; until then, their repositories are held only to existence, binding and the frame.

A gate that cannot run refuses the commit rather than letting it through, so the remedy is always the install the hook names. `--no-verify` still bypasses any local hook, so the repository audit and CI remain authoritative.

The binding is a property of each clone, so `HOOK-2` is not applicable in CI when no local binding exists, and a linked worktree checked out at a revision without `.githooks/` still commits unchecked. Converting a clone needs its binding run once; composing the hooks and sweeping the estate's bindings are `tools-ki` work, because a conform write cannot carry the executable mode a hook needs.

## References

- [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-and-judgment-checker-split.md) separates what the checker proves from what the reviewer judges.
- [ADR-KI-HARNESS-SKILLS-014](ADR-KI-HARNESS-SKILLS-014-explicit-skill-applicability.md) makes `ki-repo` the baseline skill that reaches every repository.
