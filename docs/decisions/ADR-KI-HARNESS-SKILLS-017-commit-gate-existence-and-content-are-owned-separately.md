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

A commit gate that runs only when a writer remembers it lets findings reach history that a sub-second check would have refused. Every Knowledge Islands repository has a toolchain some skill knows, but no single skill knows them all: `ki-repo` reaches every repository and cannot know each toolchain's commands, and `ki-engineering` knows the package toolchain but cannot apply where no package exists.

The mechanism is an executable hook committed outside `node_modules` and bound by a relative `core.hooksPath`, so the hook resolves in every working tree. Husky binds `core.hooksPath` to its generated, untracked `.husky/_`, which a linked worktree that has never run `bun install` lacks, so Git finds no hook and the commit goes through unchecked. A hook that runs a tool the clone has not installed fails the same way, open.

A hook that runs slow or whole-project work is skipped in practice, and a hook every repository writes by hand drifts into variants no audit can tell apart from intended difference.

## Decision

Whether a repository has a commit gate is owned by `ki-repo`; what the gate runs is declared by the shape skills that know each toolchain and composed by `ki-repo` into one canonical hook per primary shape and package presence. Every gate lives in committed `.githooks/`.

- **`.githooks/` holds every hook.** A repository whose primary shape declares a hook commits an executable `.githooks/pre-commit` and `.githooks/commit-msg`. A package-backed repository's `prepare` is `git config core.hooksPath .githooks`, followed by the boundary install where that root exists; elsewhere each clone sets the binding. Husky is retired.
- **A shape may declare no hook.** `ki-repo-dotfiles-chezmoi` declares none, and its root manual gate stands in its place. `HOOK-1` to `HOOK-4` are not applicable to such a shape. A repository without `.ki.toml` is outside these standards.
- **A hook runs lint, format and message checks only.** It is check-only, quiet on success and offline, over what is staged: staged formatters under `lint-staged`, check-only Syncpack, staged Markdown, a shape's own staged lint, one focused `ki repo audit --staged` for the shape and the message check. Test suites, whole-project type checks, full audits, builds and network fetches belong to the manual gate and CI.
- **One canonical hook per shape and package presence, with no extension point.** `ki-repo` composes it in a fixed order from its frame and the blocks the shape skills declare: the shebang and header, the root, the empty-index exit, the missing-tool refusal, the `PATH` step, the staged lint, the shape's lint and the focused audit through a quiet helper. `commit-msg` runs Commitlint where a package exists and `ki git check-message` where none does. Each shape skill publishes the generated text under `assets/githooks/`, and a repository copies it byte-exact. A repository-specific check that is fast and check-only becomes a criterion of its shape skill, run through the focused staged audit, never a hook line.
- **`ki-repo` owns existence, binding and the canonical text.** `HOOK-1` requires the tracked, executable `pre-commit` and `HOOK-3` the `commit-msg`; `HOOK-2` requires the audited working tree's effective `core.hooksPath` to resolve to `.githooks`; `HOOK-4` compares each committed hook byte for byte with its canonical text; `HOOK-5` reports any Husky file, dependency, call or binding left behind; `HOOK-J1` judges that the gate stated in root orientation matches what the hook runs.
- **Each shape skill keeps one content criterion.** It checks the shape's distinctive lines in its own terms and is not applicable without a hook: `SCR-11` in `ki-engineering`, `MD-hook` in `ki-authoring`, `SHELL-HOOK` in `ki-repo-tools`, and `GATE-1` in `ki-repo-kb`, `ki-repo-harness`, `ki-repo-specifications` and `ki-repo-homebrew-tap`. `GIT-2` in `ki-repo-dotfiles-chezmoi` requires no hook and no binding.

The new and changed criteria report as warnings while the estate converts, and each becomes a failure once the last rollout wave lands. The rollout moves in waves, each under one owner grant covering the repositories it names, committed locally by explicit path in each repository; the owner pushes.

## Consequences

Every repository that should have a gate learns from `HOOK-1` that it lacks one, and from `HOOK-4` exactly which line differs from its canonical text and which asset to copy. Exact comparison subsumes a forbidden-command list: a test, type check, full audit or rewriting flag cannot appear in a canonical text.

A gate that cannot run refuses the commit rather than letting it through, so the remedy is always the install the hook names; an empty index exits before any tool is required. `--no-verify` still bypasses any local hook, so the repository audit and CI remain authoritative.

The block declarations live in `ki-repo` until each shape skill can declare its own; changing a shape's hook is a change to the composer, its regenerated assets and the shape's content criterion together. Conform writing the hooks and sweeping the estate's bindings are `tools-ki` work, because a conform write cannot carry the executable mode a hook needs; a repository that copied its asset is already canonical when that composer arrives.

The binding is a property of each clone, so `HOOK-2` is not applicable in CI when no local binding exists, and a linked worktree checked out at a revision without `.githooks/` still commits unchecked.

## References

- [ADR-KI-HARNESS-SKILLS-002](ADR-KI-HARNESS-SKILLS-002-mechanical-and-judgment-checker-split.md) separates what the checker proves from what the reviewer judges.
- [ADR-KI-HARNESS-SKILLS-014](ADR-KI-HARNESS-SKILLS-014-explicit-skill-applicability.md) makes `ki-repo` the baseline skill that reaches every repository.
