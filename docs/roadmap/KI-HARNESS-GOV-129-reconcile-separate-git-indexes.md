---
id: KI-HARNESS-GOV-129
area: GOV
title: Reconcile separate Git indexes
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: a845446a17fb9f18cc4a7c1bc3aeba0c16894ebe
created_at: 2026-10-02T06:06:07Z
updated_at: 2026-10-06T17:15:36Z
---

# KI-HARNESS-GOV-129: Reconcile separate Git indexes

## Goal

An agent that commits through a temporary `GIT_INDEX_FILE` in a shared checkout can leave the ordinary index consistent with the new `HEAD` without staging another writer's work or discarding a concurrent edit.

## Context

During `DOTFILES-UE-054`, the user required commits through a separate index because other writers were active in the dotfiles checkout. Commit `0f45e7d` advanced `HEAD` with the intended roadmap file, but the ordinary index still held that file's parent-commit blob. Git then displayed `MM` for a working file that already matched the new commit. A later commit using the ordinary index could have reintroduced the old version.

The repair checked that the ordinary index entry for the owned path still equalled the parent-commit blob, then updated only that path's index entry to the new `HEAD`. The same effect had appeared after an earlier separate-index roadmap commit. The current `ki-git` standard permits a temporary index for isolated staging and says it does not isolate working files or serialize `HEAD`; it does not explain this post-commit state or its safe reconciliation.

## Boundary

In scope: one guidance block in `skills/governance/ki-git/references/standards-git.md` giving the exact-path reconciliation sequence and its stop condition inside the existing serialized Git write window, covering new, deleted and hook-modified paths, and one verification fixture that exercises it.

Out of scope: making temporary indexes the default; a whole-index reset or any `git reset` without a pathspec; repairing another actor's working files, staged changes or history; a new rubric criterion or wrapper command; and the completed `DOTFILES-UE-054` instance, which that repository owns.

## Current state

`standards-git.md` (the paragraph beginning "For a delegated worker that must stage outside the shared commit window") permits a unique temporary `GIT_INDEX_FILE` and requires revalidation and the serialized commit window, but says nothing about the ordinary index after the commit. The `ki-git` rubric exposes these families as judgment-only; no fixture exercises Git index state.

## Steps

- [x] Add a short "After a separate-index commit" block immediately after that paragraph, as one ordered sequence within the same serialized write window, containing the five steps below.
- [x] Step 1 of the block: before committing, record the parent `P = git rev-parse HEAD` and, for each owned path, its ordinary-index entry `git ls-files --stage -- <path>` (absent for a new file).
- [x] Step 2: after committing, require `git rev-parse HEAD^` to equal `P` and `git diff-tree --no-commit-id --name-only -r HEAD` to list only owned paths; a hook-added or hook-modified path outside the set is a stop.
- [x] Step 3: for each owned path, require its current ordinary-index entry to equal the recorded entry and to match `P:<path>` (or be absent for a new file).
- [x] Step 4: only then run `git reset --quiet HEAD -- <path>` for those exact paths, which updates the index entry to the new `HEAD`, adds a new file's entry, and drops a deleted file's entry, without touching working files.
- [x] Step 5: confirm `git status --short -- <path>...` no longer shows an index-side difference for any owned path.
- [x] State the stop condition: if `HEAD` advanced past the new commit, or any owned path's ordinary-index entry changed since step 1, or the commit contains an unowned path, change nothing, report the path and the observed entries, and coordinate.
- [x] Add `skills/governance/ki-git/scripts/separate-index-reconciliation.test.ts`: a temporary repository where a commit through a temporary index leaves `MM`, the sequence clears it for a modified, a new and a deleted path, and a second case with another blob staged on the same path leaves the ordinary index byte-identical and reports a stop.

## Files touched

- `skills/governance/ki-git/references/standards-git.md`
- `skills/governance/ki-git/scripts/separate-index-reconciliation.test.ts` (new)

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. The standard gives the five-step sequence and the stop condition in the separate-index paragraph's immediate neighbourhood, and every Git command in it takes an explicit `-- <path>` pathspec.
2. The fixture shows `MM` before reconciliation and a clean status for the owned paths after it, for a modified, a new and a deleted path.
3. In the concurrent-staging case the fixture asserts the ordinary index file is byte-identical before and after, and the sequence reports a stop.
4. No new rubric criterion, wrapper or default changes; the existing preference for the serialized write window and explicit-path staging is retained.

```bash
bun test skills/governance/ki-git
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-git --progress never
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

None.

## Documentation impact

### Decision Records

None.

### Specifications

`standards-git.md` gains the reconciliation sequence and stop condition.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

The approved boundary: one "After a separate-index commit" block in `standards-git.md` with the five-step exact-path sequence and its stop condition, and one fixture. Excluded as planned: temporary indexes as a default, any pathspec-less reset, a rubric criterion or wrapper, and the `DOTFILES-UE-054` instance. Baseline `a845446a17fb9f18cc4a7c1bc3aeba0c16894ebe`; the delivery lands as the commit that carries this review.

### Change Summary

- `skills/governance/ki-git/references/standards-git.md`: the block follows the `GIT_INDEX_FILE` paragraph directly. Step 2 states that a hook may modify an owned path, while a hook-added or hook-modified unowned path stops; step 5 notes that a remaining working-file difference is a hook effect to review, not a reconciliation failure.
- `skills/governance/ki-git/scripts/separate-index-reconciliation.test.ts` (new): three cases in a temporary repository isolated from user and system Git configuration. The first case shows `MM`, `D` and `AD` before reconciliation and a clean owned-path status after it, for a modified, a new and a deleted path. The second case has a rival blob staged on an owned path: it stops and leaves `.git/index` byte-identical. The third case has an unowned path in the commit: it also stops and leaves `.git/index` byte-identical.
- Interpretation: Verify criterion 1 asks every Git command to take an explicit pathspec. The index- and working-state commands (`ls-files --stage`, `reset`, `status`) do. `rev-parse` and `diff-tree` are the commit-level reads that Steps 1 and 2 prescribe verbatim, so they cannot take one.

### Verification

- `bun test skills/governance/ki-git`: 9 pass, 0 fail.
- `bun run test`: 943 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `bunx biome check .`: 0 errors (pre-existing warnings and infos only).
- `ki repo audit --skill ki-git --progress never`: PASS.
- `ki repo audit --skill ki-skills --progress never`: FAIL=0, WARN=1. The warning is pre-existing: `LONG-3` refresh cadence for `ki-skills` sources is unrelated to this change.
- `ki dev skill rubric ki-git`: rubric in sync, no regeneration needed.

### Outstanding concerns

None blocking. Optional hardening from review, left to the owner: step 2 checks `HEAD^` equals `P` as planned. Also recording the new commit `C` and requiring `HEAD` to equal `C` would also catch a sibling commit that replaced it.

### Post-change review

Independent Fable review verdict: approve, with nits only. Applied: the fixture strips inherited `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and related variables; an empty commit no longer reports a blank unowned path; and step 5 clarifies the working-file side. Not applied: the `HEAD == C` hardening, which goes beyond the record's prescribed step 2. Goal, scope and the explicit-path preference are retained; regression risk is limited to guidance text and one isolated test.

### Mini recap

Delivered the separate-index reconciliation guidance and a pinning fixture; all gates pass. Proposed learning route: none beyond the standard itself.

## Discussion

The safe sequence distinguishes a stale parent entry from a real concurrent staged edit: the first equals the recorded pre-commit entry and the parent blob, the second does not. New files, deleted files, hook-modified files and unrelated staged work each have explicit treatment so a convenient `git reset` recipe cannot silently erase another writer's contribution. A fixture is warranted because the distinction is precise enough to get wrong in prose, and one test pins it without adding a mechanical criterion.
