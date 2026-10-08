---
id: KI-HARNESS-GOV-109
area: GOV
title: Enforce commit gates
kind: deliver
purpose: governance
project: baseline-rollout
component: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 9c930be71faa94f8bc55f3d67d3b9b3d2a63bdb3
created_at: 2026-09-26T15:58:00Z
updated_at: 2026-10-08T08:11:33Z
---

# KI-HARNESS-GOV-109: Enforce Commit Gates

## Goal

A run that cannot execute this repository's commit gates is stopped rather than waved through. Today the absence of the gate and the passing of the gate are indistinguishable from inside the run, which is the property that makes every other governance rule optional in practice.

## Context

`core.hooksPath` is set to `.husky/_` in `.git/config`, which is shared by the primary checkout and every linked worktree. `.husky/_` and `node_modules` are produced by `bun install` through the `prepare` script, and that is per working directory. A linked worktree created for an agent task therefore has neither. Git resolves `core.hooksPath` to a directory that does not exist, finds no `pre-commit`, and commits successfully with no diagnostic.

Observed directly in the worktree for coordination task `KNO-34`: `git config core.hooksPath` returns `.husky/_`, and both `.husky/_` and `node_modules` are absent. Five commits landed on that branch without `lint-staged`, without the staged TypeScript check, and without the staged-snapshot `ki-skills` audit. The same commands on the primary checkout run all three. Nothing in the run reported the difference.

The second half of the same gap is the audit. `ki harness list` on this host reported `installed (0)`, and every `ki repo audit --skill <skill>` and `ki dev skill rubric <skill>` exited 1 with `declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); ... is not installed`. That exit is loud and therefore not itself the defect. The defect is that the repository has no position on what a writer should do when its own declared audits cannot run: an unavailable audit is unknown, not a pass, and nothing in the repository says so or acts on it.

Both halves share a cause - the dependency graph a checkout needs to verify itself is not present where the writing happens - and produce opposite symptoms. The hook fails silently; the audit fails loudly but with no defined consequence.

## Boundary

In scope: making the absence of a commit gate a failure rather than a pass in this repository through a committed hook stub outside `node_modules`; the minimal `SCR-5` acceptance of that binding so this repository's own engineering audit stays clean; and one sentence in `AGENTS.md` stating what a writer must do when a declared audit cannot run.

Out of scope: installing a harness on any particular host, which is a user-environment action and not a repository change; running `bun install` from a hook; the content of any rubric criterion beyond the `SCR-5` binding form; write-root enforcement, which is coordination task `KNO-10`; and the fleet-wide question of whether other repositories share the configuration, which is [KI-HARNESS-GOV-117](KI-HARNESS-GOV-117-govern-hooks-beyond-packages.md) and is blocked by this item. Conform-time reporting of pending dependency activation is `KI-HARNESS-FND-026` (done).

## Current state

Nothing written. `.husky/pre-commit` and `.husky/commit-msg` are committed and carry the gate content; `package.json` has `"prepare": "husky"`, which binds `core.hooksPath` to the generated, untracked `.husky/_`. `hooks/pre-commit.test.ts` and `hooks/commit-msg.test.ts` exercise the committed `.husky` scripts directly. `SCR-5` in `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts` accepts only `prepare === 'husky'` and otherwise warns.

## Steps

- [x] Add `.githooks/pre-commit` and `.githooks/commit-msg` as executable POSIX `sh` stubs. Each resolves `git rev-parse --show-toplevel`, checks the executables its gate needs under `node_modules/.bin/` (`lint-staged`, `syncpack`, `tsc` for pre-commit; `commitlint` for commit-msg), and when any is absent prints the missing names, the exact step `bun install` in that top-level, and a line saying not to bypass with `--no-verify`, then exits 1. When all are present it prefixes `node_modules/.bin` to `PATH` and `exec`s `sh "$root/.husky/<hook>" "$@"`.
- [x] Change `package.json` `prepare` to `husky && git config core.hooksPath .githooks`, so the shared `core.hooksPath` names a committed, relative directory that every worktree resolves against its own top-level.
- [x] Extend `SCR-5` to accept exactly that `prepare` form when both `.githooks` stubs are safe regular files, keeping `husky` alone as the other passing form; update the item description in `scripts/rubric/items/scripts.ts`, the `SCR-5` paragraph in `standards-engineering.md`, and the `SCR-5` cases in `scripts/rubric/items/index.test.ts`.
- [x] Add `hooks/git-hook-stub.test.ts`: a temporary repository with the stubs and `core.hooksPath .githooks`, plus a linked worktree, proving refusal without tooling and delegation with stub executables present.
- [x] Add one sentence to `AGENTS.md` under Working here: a declared audit or hook that cannot run is unknown, not a pass; stop and report the activation step rather than committing with `--no-verify`.
- [x] Regenerate `skills/governance/ki-engineering/references/rubric.md` with `ki dev skill rubric ki-engineering`, run `bun install` in the primary checkout, and confirm `git config core.hooksPath` returns `.githooks`.

## Files touched

- `.githooks/pre-commit` (new)
- `.githooks/commit-msg` (new)
- `package.json`
- `AGENTS.md`
- `hooks/git-hook-stub.test.ts` (new)
- `skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/engineering.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/git-hooks.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/scripts.ts`
- `skills/governance/ki-engineering/scripts/rubric/items/index.test.ts`
- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/references/rubric.md` (generated)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. In a linked worktree with no `node_modules`, `git commit` exits non-zero and its output names the missing executables and `bun install`; no commit is created.
2. With the gate executables present, the stub runs `.husky/pre-commit` and `.husky/commit-msg` unchanged: a failing staged check still refuses and a clean commit still succeeds.
3. After `bun install` in the primary checkout, `git config core.hooksPath` returns `.githooks`, and the same value is seen from a linked worktree.
4. `SCR-5` passes for this repository and for `"prepare": "husky"`, and still warns for any other value; `SCR-11` is unchanged.
5. `AGENTS.md` states that an unavailable audit or hook is unknown and must be reported, not bypassed.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-engineering --progress never
ki repo audit --skill ki-skills --progress never
git config core.hooksPath
```

## Dependencies / blocks

`blocks` [KI-HARNESS-GOV-117](KI-HARNESS-GOV-117-govern-hooks-beyond-packages.md), which inherits this mechanism for the estate. Paired with `KI-HARNESS-FND-026` (done) as a cross-reference, not a blocker: that item reports pending activation at conform time; this one refuses at commit time. Neither supersedes the other.

Known limit: a linked worktree whose checked-out revision predates `.githooks/` resolves the shared path to nothing and still commits silently. Base currency is [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md)'s concern; this record does not repair existing worktrees.

Sequencing: this record and `KI-HARNESS-FND-026` (done), `KI-HARNESS-GOV-092` (done) and [KI-HARNESS-GOV-127](KI-HARNESS-GOV-127-adopt-dependency-cruiser-estatewide.md) all edit the shared `ki-engineering` files `scripts/rubric/items/index.test.ts`, `references/rubric.md` and `references/standards-engineering.md`. Increment counts, never hardcode them; whichever lands second rebases. A sequencing note, not a dependency.

## Documentation impact

### Decision Records

None. The stub decision is recorded in this record's Discussion and is local to this repository; [KI-HARNESS-GOV-117](KI-HARNESS-GOV-117-govern-hooks-beyond-packages.md) carries the estate-level Decision Record.

### Specifications

`standards-engineering.md` gains the second accepted `SCR-5` `prepare` form; `AGENTS.md` gains one sentence on unavailable audits.

### Guides

None.

### Roadmap

[KI-HARNESS-GOV-117](KI-HARNESS-GOV-117-govern-hooks-beyond-packages.md) inherits the `.githooks` mechanism.

## Review

### Delivered

The approved boundary: committed `.githooks` stubs that refuse a commit whose gate tooling is absent and otherwise delegate to the governed Husky hooks, the `prepare` binding, the `SCR-5` acceptance of that form, a stub test over a real linked worktree, and the `AGENTS.md` sentence on audits that cannot run. Excluded as planned: any install from a hook, any host harness installation and any estate-wide change, which stays with [KI-HARNESS-GOV-117](KI-HARNESS-GOV-117-govern-hooks-beyond-packages.md). Baseline `9c930be71faa94f8bc55f3d67d3b9b3d2a63bdb3`.

### Change Summary

- `.githooks/pre-commit` and `.githooks/commit-msg` check `lint-staged`, `syncpack` and `tsc`, or `commitlint`, under `node_modules/.bin`; when any is missing they name it, the `bun install` step and the `--no-verify` prohibition, and exit 1. Otherwise they put `node_modules/.bin` on `PATH` and run `.husky/<hook>` unchanged.
- `package.json` `prepare` is `husky && git config core.hooksPath .githooks`.
- `git-hooks.ts` gains the stub constants and `acceptedPrepares`, shared by the audit and conform paths. `audit-evidence.ts` passes `SCR-5` on either accepted form, the stub form only while both stubs are safe regular files. `engineering.ts` conform keeps a chosen stub binding instead of resetting it to plain `husky`; this file was not in the planned list but owns the conform write, which would otherwise have undone the binding.
- `index.test.ts` covers the accepted forms, with and without the boundary install, and the conform keep and drop cases. `hooks/git-hook-stub.test.ts` builds a repository and linked worktree bound to `.githooks`.
- `scripts.ts`, `standards-engineering.md` and `rubric.md` describe the second accepted form; `AGENTS.md` gains the sentence under Working here.

### Verification

- `bun run test`: 1012 pass, 0 fail. `bunx tsc --noEmit`: clean. `git-hooks.ts` coverage 100%.
- Criterion 1: in a linked worktree with no `node_modules` the commit exits non-zero naming `lint-staged syncpack tsc` and `bun install`, and `HEAD` is unchanged; `commit-msg` refuses the same way on its own missing `commitlint`.
- Criterion 2: with the executables present the stubs delegate; a failing stand-in `.husky/pre-commit` still refuses and a passing one commits, with `commit-msg` receiving the message file.
- Criterion 3: the fixture's linked worktree reads `core.hooksPath` as `.githooks`; `bun install` in this worktree set the shared value to `.githooks`. It was restored to `.husky/_` until the stubs reach `main`, so that checkouts without them keep their hooks, and is re-bound by `bun install` in the primary checkout after the push.
- Criterion 4: the worktree's evidence collector on this repository reports `SCR-5` `PASS` for the stub form and `SCR-11` `PASS`. `ki repo audit` reads the installed primary checkout, so until the push it still shows the old `SCR-5` warning.
- `ki dev skill rubric` resolves the installed primary checkout, so the `rubric.md` line was edited to match the new item description.
- `ki repo audit` on the primary checkout: FAIL=0, WARN=5, all existing. In the worktree the only failures are `REPO-REG-1` and `RUNTIMES-2`, which follow from the unregistered worktree path.

### Outstanding concerns

None.

## Done

Accepted 2026-10-08 by Kris Brown on the review packet above.

## Discussion

### Why this is not "remember to run bun install"

A convention that every worktree runs `bun install` first is exactly the class of rule this repository has just spent an afternoon learning not to trust: it is unenforced, its violation is invisible, and the cost of the violation falls on a later reader. The gate either runs or the commit does not happen. A worktree that cannot verify itself should say so at the moment it tries to write, not leave a clean-looking history behind.

### Decision: committed stub that refuses

Three options were weighed. Bootstrapping the worktree automatically makes the gate real but means a commit can trigger a networked dependency install that is slow, surprising, and can fail for reasons unrelated to the change. Refusing without a binding change is honest but impossible here, because Git finds no hook to refuse with. The chosen option is a committed hook stub outside `node_modules` that runs the full gate when the tooling is present and exits non-zero with instructions when it is not: it preserves the refusal without owning an install, and because `core.hooksPath` is relative, the one shared setting resolves to a committed file in every worktree. The stubs delegate to `.husky/<hook>` rather than absorbing its content, so `SCR-11` and the existing hook tests continue to govern what the gate runs.

### Relationship to `KI-HARNESS-FND-026`

`KI-HARNESS-FND-026` (done) records that `ki repo conform` does not run `bun install` or report an installation requirement, so a later commit fails with a missing-module error that looks unrelated. That is the same absent dependency graph reaching the same hook from the other direction. After this item the commit-time symptom becomes an explicit refusal naming `bun install`; FND-026 still owns making conform itself report the pending step, so the two remain separate and complementary.

### Coordination linkage

Discovered while delivering coordination task `KNO-34`, and named in that task's review by the coordinating agent as work that nothing currently covers. Both observations behind it are consequences of that task rather than its subject: the task's own verification could not run its audit criterion, and the task's own commits bypassed the hook that would have caught it. Capture is not adoption. The number for this record was reserved by a committed advance of `docs/roadmap/_ISSUES.md` on the primary checkout before the record existed, applying the rule `KI-HARNESS-GOV-104` writes.
