---
id: KI-HARNESS-GOV-117
area: GOV
title: Govern hooks beyond packages
theme: governance-consistency
horizon: now
status: draft
blocks: []
blocked_by: [KI-HARNESS-GOV-109]
baseline_ref: null
created_at: 2026-09-27T17:05:00Z
updated_at: 2026-10-05T08:41:49Z
---

# KI-HARNESS-GOV-117: Govern Hooks Beyond Packages

## Goal

A repository with real verification gates and no `package.json` is covered by some commit-gate criterion rather than by none. Today the estate's only Git-hook requirement is unreachable for such a repository, so its gates run exactly as often as a writer remembers them.

## Context

`SCR-11` in `ki-engineering` requires Husky to run `lint-staged` then check-only Syncpack before a commit, and Commitlint on the proposed message. That criterion cannot fire outside a package-backed repository, and the exclusion is structural rather than incidental: `scripts/rubric/contexts/audit-evidence.ts` returns early when `package.json` is absent, emitting one `NOT_APPLICABLE` finding for `PKG-4`, after which every other engineering code, `SCR-11` among them, produces no evidence and becomes `NOT_APPLICABLE` through the empty-outcome fallback in `contexts/engineering.ts`. `standards-engineering.md` states the same boundary in prose: "Every package-backed repository uses Husky for one common local baseline."

Two repositories in the estate sit outside that boundary while carrying gates worth enforcing. `tools-rig` documents an eight-command gate in its `AGENTS.md`: `ki repo audit`, `shellcheck`, `bash -n`, `assemble-rig --check`, `benchmark-rig`, `smoke-native-providers`, `bats`, and `mandoc -T lint`. The chezmoi source runs twelve `node --test` suites plus `rumdl` through `ki repo audit`. Neither has a Git hook, neither has a tracked hooks directory, and `core.hooksPath` is unset in both and globally. Their declared coverage was `ki-repo` and `ki-authoring`, both baseline, so no hook, lint, or test criterion applied to either from anywhere.

The consequence is observed rather than theoretical. Four Markdown findings were committed across four separate commits in the chezmoi source on 2026-09-27 and surfaced only when a reader ran `ki repo audit` by hand; every one would have been caught by a sub-second check-only hook.

## Boundary

In scope: a two-layer split, agreed 2026-09-27 and confirmed 2026-10-05. `ki-repo`, being `ki-applicability: baseline`, requires only that a repository has a committed mechanical trigger bound to a gate and that its root orientation says what that gate runs. Each shape skill then declares and verifies its own expected hook content. `ki-repo` owns the existence question because it is the only skill that reaches every repository; it never owns the content question, because the content is toolchain-specific and `ki-repo` cannot know it. The trigger mechanism is the one [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md) chooses: a committed `.githooks/pre-commit` bound through a relative `core.hooksPath`.

In scope also: requiring shape skills that today say nothing to say something. `ki-engineering` already states its expectation as `SCR-11` and needs only to be read as an instance of the general rule. `ki-repo-tools`, `ki-repo-kb`, and `ki-repo-dotfiles-chezmoi` each gain one hook-content criterion here, the last because the chezmoi source is the observed failure. A Decision Record fixes the split.

Out of scope: the mechanism by which an absent gate becomes a failure, which is [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md) and blocks this item; the content of any individual repository's hook, which each repository owns; adding hooks to `tools-rig`, the chezmoi source, or any other repository, which are receiver-owned trades raised after delivery; hook-content criteria for the remaining shape skills, captured through `ki-next` as follow-ons; and amending `ADR-DOTFILES-006` in the chezmoi source, which is that repository's decision. Moving a commit-gate criterion wholesale into `ki-repo` was considered and rejected: the baseline skill cannot carry a requirement it has no means to express.

Also out of scope: changing what `SCR-11` requires. Its package-backed scope is correct for what it requires (`bunx lint-staged`, Syncpack, and Commitlint are package-manager commands), and widening it would make a Bash repository fail a criterion it has no means to satisfy.

## Current state

Nothing written. `ki-repo` has no hook family; its catalogue lives in `skills/keystone/ki-repo/scripts/rubric/items/index.ts` and its evidence in `scripts/rubric/contexts/repository.ts`. `ki-engineering`'s `SKILL.md` declares `.husky/pre-commit` and `.husky/commit-msg` under `contributes:`. `ki-repo-tools` has `SHELL-LINT` and `SHELL-TEST` in `scripts/rubric/items/shell.ts`, which check CI wiring only, and is `detected` on `install.sh` plus `bin/<exe>`. `ki-repo-kb` and `ki-repo-dotfiles-chezmoi` say nothing about hooks. `standards-tool-repositories.md` records the deliberate absence of a `ki-shell` skill ("YAGNI at n=1").

## Steps

- [ ] Write the Decision Record under `docs/decisions/` at the next free `ADR-KI-HARNESS-SKILLS` serial (`017` if [KI-HARNESS-GOV-099](KI-HARNESS-GOV-099-decide-decision-serial-gaps.md) has landed): `ki-repo` owns existence and binding of `.githooks/pre-commit`; each shape skill owns and verifies its expected content; `SCR-11` is the `ki-engineering` instance; check-only content only. Add it to `docs/decisions/README.md`.
- [ ] Add a `HOOK` family to `ki-repo` in `scripts/rubric/items/hooks.ts`: `HOOK-1 [M]` (WARN at introduction, diagnostic) a tracked, executable `.githooks/pre-commit` exists, with a follow-on to raise it to FAIL once estate adoption trades land; `HOOK-2 [M]` (WARN, diagnostic) local `core.hooksPath` resolves to `.githooks`, with guidance naming `git config core.hooksPath .githooks`; `HOOK-J1 [J]` the gate stated in root orientation matches what the hook runs. Register it in `items/index.ts`, gather evidence in `contexts/repository.ts`, and extend `items/index.test.ts`.
- [ ] Add the hook paragraph to `references/standards-repository.md` and `.githooks/pre-commit` to `ki-repo`'s `SKILL.md` ownership declarations; in `ki-engineering`'s `SKILL.md` and `standards-engineering.md`, record the stub as an engineering contribution and `SCR-11` as its content expectation.
- [ ] `ki-repo-tools`: add `SHELL-HOOK [M]` in `scripts/rubric/items/shell.ts` requiring that, under the SHELL capability, `.githooks/pre-commit` invokes `shellcheck` and `bats` without a fixing flag; add the row to `standards-tool-repositories.md` and say there whether this agrees with or supersedes the "no `ki-shell` skill" decision.
- [ ] `ki-repo-kb`: add one criterion in a new `scripts/rubric/items/gate.ts` requiring `.githooks/pre-commit` to run `ki repo audit` check-only; document it in `standards-knowledge-base.md`.
- [ ] `ki-repo-dotfiles-chezmoi`: add `GIT-2 [M]` in `scripts/rubric/items/git.ts` requiring `.githooks/pre-commit` to run `ki repo audit` check-only; document it in `standards-chezmoi-dotfiles.md`.
- [ ] Add tests for each new criterion in the owning skill's `items/index.test.ts`, regenerate each touched `references/rubric.md`, and capture follow-ons through `ki-next` for the remaining shape skills and for receiver trades to `tools-rig` and the chezmoi source.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-NNN-commit-gate-existence-and-content.md` (new; the next free `SKILLS` serial, `017` if GOV-099 has landed)
- `docs/decisions/README.md`
- `skills/keystone/ki-repo/SKILL.md`
- `skills/keystone/ki-repo/scripts/rubric/items/hooks.ts` (new)
- `skills/keystone/ki-repo/scripts/rubric/items/index.ts`
- `skills/keystone/ki-repo/scripts/rubric/items/index.test.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.ts`
- `skills/keystone/ki-repo/references/standards-repository.md`
- `skills/keystone/ki-repo/references/rubric.md` (generated)
- `skills/governance/ki-engineering/SKILL.md`
- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/items/shell.ts`
- `skills/repo-structure/ki-repo-tools/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-tools/references/standards-tool-repositories.md`
- `skills/repo-structure/ki-repo-tools/references/rubric.md` (generated)
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/gate.ts` (new)
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/index.ts`
- `skills/repo-structure/ki-repo-kb/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-kb/references/standards-knowledge-base.md`
- `skills/repo-structure/ki-repo-kb/references/rubric.md` (generated)
- `skills/repo-structure/ki-repo-dotfiles-chezmoi/scripts/rubric/items/git.ts`
- `skills/repo-structure/ki-repo-dotfiles-chezmoi/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-dotfiles-chezmoi/references/standards-chezmoi-dotfiles.md`
- `skills/repo-structure/ki-repo-dotfiles-chezmoi/references/rubric.md` (generated)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. A fixture repository with no `package.json` and no `.githooks/pre-commit` warns on `HOOK-1` under `ki-repo`; adding an executable stub makes `HOOK-1` pass.
2. `HOOK-2` warns with the exact `git config core.hooksPath .githooks` step when the local binding is absent, and passes when it resolves.
3. No `ki-repo` criterion inspects what the hook runs; each content check lives in a shape skill, and none accepts a `--fix` or `--write` invocation.
4. `SHELL-HOOK`, the `ki-repo-kb` gate criterion, and `GIT-2` each fail on a hook that omits their expected command and pass on one that has it.
5. `SCR-11` behaviour is unchanged, and this repository passes `HOOK-1` and `HOOK-2` through the [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md) stub.
6. The Decision Record exists, is indexed, and the `SYNC-1` re-alignment between each touched standard, published rubric and checker holds.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --progress never
ki repo audit --skill ki-repo-tools --progress never
ki repo audit --skill ki-repo-kb --progress never
ki repo audit --skill ki-repo-dotfiles-chezmoi --progress never
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

`blocked_by` [KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md), which settles the `.githooks` mechanism this item generalises. The record is fully shaped but stays `draft` because `ITEM-5` forbids a `ready` item with a non-done blocker; it becomes `ready` once GOV-109 is done. Adoption by `tools-rig`, the chezmoi source and other repositories follows as separate receiver-owned trades and does not block acceptance here.

Sequencing: this record and [KI-HARNESS-GOV-121](KI-HARNESS-GOV-121-require-substantive-store-mirrors.md) both add a criterion through the shared `ki-repo-kb` files `scripts/rubric/items/index.test.ts`, `references/rubric.md` and `references/standards-knowledge-base.md`. Increment, do not hardcode; whichever lands second rebases. A sequencing note, not a dependency.

## Documentation impact

### Decision Records

A new `ADR-KI-HARNESS-SKILLS` record at the next free serial (`017` if GOV-099 has landed) records the existence-versus-content split.

### Specifications

`standards-repository.md`, `standards-engineering.md`, `standards-tool-repositories.md`, `standards-knowledge-base.md` and `standards-chezmoi-dotfiles.md` each gain their part of the split.

### Guides

None.

### Roadmap

Follow-ons through `ki-next` for the remaining shape skills, for raising `HOOK-1` to FAIL, and for receiver trades to `tools-rig` and the chezmoi source.

## Discussion

### Delegation

The four skill changes after the `ki-repo` family are independent and can run as parallel lanes once the Decision Record and `HOOK` family land; one reviewer should check `SYNC-1` across all of them together.

### Why this waits on GOV-109

[KI-HARNESS-GOV-109](KI-HARNESS-GOV-109-fail-when-commit-gates-absent.md) records that `core.hooksPath` is `.husky/_`, produced per working directory by `bun install`, so a linked worktree resolves it to a directory that does not exist and commits with no diagnostic; five commits landed on the `KNO-34` branch with none of the three gates running. Its Boundary defers the fleet-wide question to this item, which therefore inherits whichever mechanism GOV-109 chooses and should not pick a different one.

### The split follows from what each layer can know

A baseline criterion can ask whether a trigger exists and whether the repository has written down what it should run; both are answerable from any repository's files without knowing its toolchain. It cannot ask whether the trigger runs the right thing, because "the right thing" is `bunx lint-staged` in one repository, `shellcheck` and `bats` in another, and a structural check in a knowledge base. So the existence question rises to `ki-repo` and the content question stays with whichever skill already knows the toolchain.

That is also why the declaration matters as much as the binding. A repository that binds a hook to nothing satisfies a bare existence check, and a repository whose documented gate and whose hook have drifted apart satisfies it too. The baseline layer therefore carries both halves, a trigger and a stated gate, with the shape skill comparing its own expectation against reality.

### Relocating the criterion is a contract change between two skills

`.husky/pre-commit` and `.husky/commit-msg` are declared under `contributes:` in `ki-engineering`'s `SKILL.md`, and `commitlint.config.ts` under `owns:`. A hook criterion in `ki-repo` would therefore either duplicate or relocate an existing ownership claim, which is a decision about the boundary between two governance skills rather than an implementation detail. It needs its own Decision Record and a `SYNC-1` re-alignment across standard, published rubric, and checker, and it cannot be satisfied by editing a criterion in place.

Any such criterion must also be toolchain-neutral in a way `SCR-11` is not. It can require that a repository's documented gate has some mechanical trigger; it cannot name `bunx` commands. That distinction is what makes `ki-repo` the right host and what makes the criterion harder to write than `SCR-11` was.

### The adjacent precedent points the same way

`ki-repo-tools` declines a shell skill deliberately: `standards-tool-repositories.md` records "There is deliberately no `ki-shell` skill: shell is the reference language, and its two tool-specific gates (shellcheck, bats) live here as capability conditionals rather than a separate skill (YAGNI at n=1). If a second shell-specific concern emerges, revisit." Commit gates for a non-package repository are plausibly that second concern, so this item re-reads that decision and says whether it agrees or supersedes it rather than quietly working around it.

Note also that `ki-repo-tools` is `ki-applicability: detected` on `install.sh` plus `bin/<exe>`, so even its `SHELL-LINT` and `SHELL-TEST` criteria, which check only that CI wires the gates and not what they find, miss a shell repository that is not a tool repository. The chezmoi source is exactly that case, which is why `ki-repo-dotfiles-chezmoi` carries its own expectation here.

### What a check-only requirement has to respect

Three separate records in the chezmoi-managed dotfiles warn against file-rewriting commit hooks in an agentic workflow, including `dot_codex/private_AGENTS.md` on Husky and lint-staged causing failed-then-retried commits, and `dot_claude/private_workflow.md` on an external formatter write invalidating an agent's in-context copy of a file so a later exact-string edit fails. Whatever this item requires must therefore be a check, never a `--fix` or `--write` pass. `standards-engineering.md` already concedes the related limit, that Husky "is an immediate-feedback layer, not an unbypassable authority", so the criterion requires a trigger and does not claim to guarantee one.
