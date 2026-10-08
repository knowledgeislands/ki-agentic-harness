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

The estate's only Git-hook requirement was `SCR-11` in `ki-engineering`, which requires Husky to run `lint-staged`, check-only Syncpack and Commitlint. It cannot apply outside a package-backed repository, so a Bash tool repository, a Knowledge Base or a chezmoi source with real gates had no commit-gate criterion from any skill, and its gates ran only when a writer remembered them. Findings reached history in the chezmoi source on 2026-09-27 that a sub-second check-only hook would have refused.

Two simpler answers do not hold. Widening `SCR-11` would require package-manager commands of a repository that has no package manager. Moving the whole requirement into `ki-repo`, the only baseline skill that reaches every repository, would ask it to know each toolchain's commands, which it cannot.

`KI-HARNESS-GOV-109` settled the mechanism: an executable `.githooks/pre-commit` committed outside `node_modules` and bound by a relative `core.hooksPath`, so the hook resolves in every working tree.

## Decision

Whether a repository has a commit gate and what that gate runs are owned by different skills.

- **`ki-repo` owns existence and binding.** `HOOK-1` requires a tracked, executable `.githooks/pre-commit`; `HOOK-2` requires the clone's `core.hooksPath` to be `.githooks`; `HOOK-J1` judges that the gate stated in root orientation matches what the hook runs. `ki-repo` never inspects the commands.
- **Each shape skill owns content.** A skill that knows a repository's toolchain declares and verifies the commands its hook must run: `SCR-11` is the `ki-engineering` instance, `SHELL-HOOK` the `ki-repo-tools` one, `GATE-1` the `ki-repo-kb` one and `GIT-2` the `ki-repo-dotfiles-chezmoi` one. With no hook, a content criterion is not applicable, because existence is reported once, by `HOOK-1`.
- **Content is check-only.** A hook verifies the commit and never rewrites the tree: a content criterion rejects its expected command when the same line carries `--fix` or `--write`, and `ki repo conform` never satisfies a `ki repo audit` requirement. Staged formatters that settle only the staged files under `lint-staged` remain the `SCR-11` exception they already were.

`HOOK-1` is introduced as a warning so the estate can adopt stubs through receiver trades before it becomes a failure.

## Consequences

Every repository now meets some commit-gate criterion, and a repository whose toolchain no shape skill yet describes still learns from `HOOK-1` that it lacks a gate. Remaining shape skills gain content criteria as follow-ons; until then, their repositories are held only to existence and binding.

The binding is a property of each clone, so `HOOK-2` is not applicable in CI when no local binding exists, and a linked worktree checked out at a revision without `.githooks/` still commits unchecked.

Adding a stub to a repository is that repository's change, raised as a receiver-owned trade. This decision adds no hook anywhere.

## References

- [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-and-judgment-checker-split.md) separates what the checker proves from what the reviewer judges.
- [ADR-KI-HARNESS-SKILLS-014](ADR-KI-HARNESS-SKILLS-014-explicit-skill-applicability.md) makes `ki-repo` the baseline skill that reaches every repository.
