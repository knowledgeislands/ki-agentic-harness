---
id: KI-HARNESS-GOV-117
area: GOV
title: Govern hooks beyond packages
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: [KI-HARNESS-GOV-109]
baseline_ref: null
created_at: 2026-09-27T17:05:00Z
updated_at: 2026-09-27T17:05:00Z
---

# KI-HARNESS-GOV-117: Govern Hooks Beyond Packages

## Goal

A repository with real verification gates and no `package.json` is covered by some commit-gate criterion rather than by none. Today the estate's only Git-hook requirement is unreachable for such a repository, so its gates run exactly as often as a writer remembers them.

## Context

`SCR-11` in `ki-engineering` requires Husky to run `lint-staged` then check-only Syncpack before a commit, and Commitlint on the proposed message. That criterion cannot fire outside a package-backed repository, and the exclusion is structural rather than incidental: `scripts/rubric/contexts/audit-evidence.ts:798-811` returns early when `package.json` is absent, emitting one `NOT_APPLICABLE` finding for `PKG-4`, after which every other engineering code — `SCR-11` among them — produces no evidence and becomes `NOT_APPLICABLE` through the empty-outcome fallback at `contexts/engineering.ts:154-156`. `standards-engineering.md:121` states the same boundary in prose: "Every package-backed repository uses Husky for one common local baseline."

Two repositories in the estate sit outside that boundary while carrying gates worth enforcing. `tools-rig` documents an eight-command gate at `AGENTS.md:36-49` — `ki repo audit`, `shellcheck`, `bash -n`, `assemble-rig --check`, `benchmark-rig`, `smoke-native-providers`, `bats`, and `mandoc -T lint`. The chezmoi source runs twelve `node --test` suites plus `rumdl` through `ki repo audit`. Neither has a Git hook, neither has a tracked hooks directory, and `core.hooksPath` is unset in both and globally. Their declared coverage is `ki-repo` and `ki-authoring` — both baseline — so no hook, lint, or test criterion applies to either from anywhere.

The consequence is observed rather than theoretical. Four Markdown findings were committed across four separate commits in the chezmoi source on 2026-09-27 and surfaced only when a reader ran `ki repo audit` by hand; every one would have been caught by a sub-second check-only hook.

## Boundary

In scope: deciding whether a commit-gate criterion should reach a repository that declares neither `ki-engineering` nor `ki-repo-tools`, and if so which skill owns it. Because `ki-repo` is `ki-applicability: baseline` its criteria run against every `.ki.toml`-bearing repository, which is exactly the reach required and exactly why `ki-engineering` cannot supply it.

Out of scope: the mechanism by which an absent gate becomes a failure, which is `KI-HARNESS-GOV-109` and blocks this item; the content of any individual repository's hook, which each repository owns; and amending `ADR-DOTFILES-006` in the chezmoi source, which is that repository's decision to take and not this one's to assume.

Also out of scope: changing `SCR-11` itself. Its package-backed scope is correct for what it requires — `bunx lint-staged`, Syncpack, Commitlint are all package-manager commands — and widening it would make a Bash repository fail a criterion it has no means to satisfy.

## Discussion

### Why this waits on GOV-109

`KI-HARNESS-GOV-109` records that `core.hooksPath` is `.husky/_`, produced per working directory by `bun install`, so a linked worktree resolves it to a directory that does not exist and commits with no diagnostic — five commits landed on the `KNO-34` branch with none of the three gates running. Its Boundary explicitly defers "the fleet-wide question of whether other repositories in the estate share the configuration, which needs this repository's answer first." This item is that fleet-wide question, so it inherits whichever mechanism GOV-109 chooses and should not pick a different one.

### Moving the criterion is a contract change between two skills

`.husky/pre-commit` and `.husky/commit-msg` are declared under `contributes:` in `ki-engineering`'s `SKILL.md:8`, and `commitlint.config.ts` under `owns:`. A hook criterion in `ki-repo` would therefore either duplicate or relocate an existing ownership claim, which is a decision about the boundary between two governance skills rather than an implementation detail. It needs its own Decision Record and a `SYNC-1` re-alignment across standard, published rubric, and checker, and it cannot be satisfied by editing a criterion in place.

Any such criterion must also be toolchain-neutral in a way `SCR-11` is not. It can require that a repository's documented gate has some mechanical trigger; it cannot name `bunx` commands. That distinction is what makes `ki-repo` the right host and what makes the criterion harder to write than `SCR-11` was.

### The adjacent precedent points the same way

`ki-repo-tools` declines a shell skill deliberately — `standards-tool-repositories.md:106` records "There is deliberately no `ki-shell` skill: shell is the reference language, and its two tool-specific gates (shellcheck, bats) live here as capability conditionals rather than a separate skill (YAGNI at n=1). If a second shell-specific concern emerges, revisit." Commit gates for a non-package repository are plausibly that second concern, so this item should re-read that decision and say whether it agrees or supersedes it rather than quietly working around it.

Note also that `ki-repo-tools` is `ki-applicability: detected` on `install.sh` plus `bin/<exe>`, so even its `SHELL-LINT` and `SHELL-TEST` criteria — which check only that CI wires the gates, not what they find — miss a shell repository that is not a tool repository. The chezmoi source is exactly that case.

### What a check-only requirement has to respect

Three separate records in the chezmoi-managed dotfiles warn against file-rewriting commit hooks in an agentic workflow: `dot_codex/private_AGENTS.md:127` on husky and lint-staged causing failed-then-retried commits, and `dot_claude/private_workflow.md:9` on an external formatter write invalidating an agent's in-context copy of a file so a later exact-string edit fails. Whatever this item requires must therefore be a check, never a `--fix` or `--write` pass. `standards-engineering.md:125` already concedes the related limit — Husky "is an immediate-feedback layer, not an unbypassable authority" — so the criterion should require a trigger, not claim to guarantee one.
