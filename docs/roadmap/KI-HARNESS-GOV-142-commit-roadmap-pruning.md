---
id: KI-HARNESS-GOV-142
area: GOV
title: Commit roadmap pruning
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 5b50e549f3d6bf33764bd526dd521f6bea38ca2c
created_at: 2026-10-06T01:22:00Z
updated_at: 2026-10-06T11:40:00Z
---

# KI-HARNESS-GOV-142: Commit roadmap pruning

## Goal

Pruning a `done` work record, including a terminal Triage disposition, stays a sanctioned cleanup whose archive is Git history, and every prune lands as one recognisable commit. The roadmap standard, its rubric and the change-management skills say so consistently, including that `ki repo roadmap prune` commits its deletions by default under one standardised message and that `--no-commit` opts out.

## Context

This record was captured on 2026-10-06 as "Retire roadmap pruning" after the estate roadmap consolidation (action C15) applied a then-understood standing rule that work records are never pruned or deleted. The owner reversed that direction the same day:

> I think we want to allow them to be deleted, the history is in git, I'd go further and make it commit the files deleted in a single standardised message, with an optional `--no-commit` if you don't want this

The harness already permits pruning. [ADR-KI-HARNESS-SKILLS-011](../decisions/ADR-KI-HARNESS-SKILLS-011-repository-roadmaps-for-non-kb-repositories.md) and `ki-work-roadmap` `references/standards-repository-roadmaps.md` keep the done-before-prune boundary and a dedicated prune-only commit; `ki-accept` owns path- or glob-selected pruning; `ki-next` and `ki-recap` may recommend but never delete. What is missing is a standard commit message for that prune-only commit, and any statement that the native `ki repo roadmap prune` sweep commits at all: today it only deletes files and leaves the commit, and its message, to whoever runs it. Past prune commits show the drift: `chore: prune roadmap items` here (`47bc10e8`) and in `tools-ki` (`0ec845c`), `chore: prune accepted KB search CLI roadmap record` (`a0f76da`) and `chore(roadmap): prune accepted done items` (`7283e01`).

## Boundary

In scope: the `ki-work-roadmap` standard and ROAD-8 rubric item, `ki-accept` (`SKILL.md`, `references/standards-acceptance.md` and the pure `scripts/internal/prune-selection.ts` model), and the `ki-next` pointers to the native sweep, rewritten so they state that pruning of `done` and terminal-disposition records is allowed, that Git history is the archive, the standardised message, and the CLI's commit-by-default and `--no-commit` behaviour.

Out of scope: restoring records already pruned (the owner decided not to restore them); the `tools-ki` implementation, delivered under `KI-TOOL-CLI-105`; the `ki-batch` retention rule for `+/_BATCHES/`; and trade-record pruning in `ki-trade`.

## Current state

- `standards-repository-roadmaps.md` requires a prune-only commit after a committed `done` state but names no message; ROAD-8 reviews the boundary only.
- `ki-accept` step 4 and its `prune` invocation delete the resolved set and require a prune-only commit, but describe `ki repo roadmap prune` only as a sweep that deletes.
- `prune-selection.ts` returns the selected paths and a `prune-only` commit boundary, with no message.
- `ki-next` `SKILL.md` and `references/standards-next-work.md` call the native command "the separate deterministic selected-repository sweep".
- No skill text says work records are never pruned; the only such statement is this record's former Goal.

## Steps

- [x] `ki-work-roadmap` `references/standards-repository-roadmaps.md`: in the pruning paragraph, state that Git history is the archive and pruned records are not restored, define the standardised message (`chore(roadmap): prune <N> done work record(s)` with one `- <ID>` body line per record), and state that `ki repo roadmap prune` commits by default and `--no-commit` leaves the deletions uncommitted for the caller to commit under the same message.
- [x] ROAD-8 in `scripts/rubric/items/roadmaps.ts`: review the standardised message as part of the prune-commit boundary; update its focused test and regenerate `references/rubric.md`.
- [x] `ki-accept`: `SKILL.md` step 4, `prune` invocation and Notes; `references/standards-acceptance.md` section 4 and the native-command paragraph; state that terminal Triage dispositions are prunable `done` records, the standardised message, and the CLI's default commit and `--no-commit`.
- [x] `ki-accept` `scripts/internal/prune-selection.ts`: candidates carry their identifier and a selected outcome carries the standardised commit message; extend `scripts/prune-selection.test.ts`.
- [x] `ki-next` `SKILL.md` and `references/standards-next-work.md`: name the native sweep as committing by default.
- [x] Regenerate any generated catalogue the changed descriptions feed.

## Files touched

- `docs/roadmap/KI-HARNESS-GOV-142-commit-roadmap-pruning.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/references/rubric.md` (generated)
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/roadmaps.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/index.test.ts`
- `skills/change-management/ki-accept/SKILL.md`
- `skills/change-management/ki-accept/references/standards-acceptance.md`
- `skills/change-management/ki-accept/scripts/internal/prune-selection.ts`
- `skills/change-management/ki-accept/scripts/prune-selection.test.ts`
- `skills/change-management/ki-next/SKILL.md`
- `skills/change-management/ki-next/references/standards-next-work.md`

## Verify

```bash
bun run test
bunx tsc --noEmit
bunx biome check .
ki repo audit --skill ki-work-roadmap --progress never
ki repo audit --repo . --progress never --concise
```

The repository audit reports FAIL=0. A search of `skills/` finds no text forbidding the pruning of `done` records, and every description of `ki repo roadmap prune` mentions its default commit and `--no-commit`.

## Dependencies / blocks

No local dependency. The `tools-ki` relationship is recorded under Discussion.

## Documentation impact

### Decision Records

None. ADR-KI-HARNESS-SKILLS-011 already keeps done-before-prune; the message and the native command's commit are standard-level detail, and the owner's decision is recorded here.

### Specifications

The roadmap standard, ROAD-8 and the `ki-accept` procedure, as listed in Steps.

### Guides

None in this repository.

### Roadmap

`tools-ki` carries the native command change as `KI-TOOL-CLI-105`.

## Review

### Delivered

From baseline `5b50e549f3d6bf33764bd526dd521f6bea38ca2c`, the roadmap standard, ROAD-8, `ki-accept` and `ki-next` state that pruning `done` records, including terminal Triage dispositions, is sanctioned cleanup whose archive is Git history, that pruned records are not restored, the standardised message (`chore(roadmap): prune <N> done work record(s)`, singular for one, with one `- <ID>` body line per record in identifier order), and that `ki repo roadmap prune` commits by default, restores the records if the commit fails and offers `--dry-run`, while `--no-commit` skips its Git checks and leaves the deletions for a manual commit under the same message after the caller confirms the committed `done` state. No skill text forbids pruning `done` records.

### Change Summary

- `ki-work-roadmap` `references/standards-repository-roadmaps.md`: a pruning paragraph after the prune-commit boundary carrying the archive, message and CLI contract.
- ROAD-8 in `scripts/rubric/items/roadmaps.ts`: description, prompt, guidance and a new `prune commit message nonstandard` outcome; focused test extended; `references/rubric.md` regenerated with the `tools-ki` renderer against this checkout's catalogue, after confirming the same renderer reproduces the primary checkout's committed file byte for byte.
- `ki-accept` `SKILL.md` step 4, `prune` invocation and Notes; `references/standards-acceptance.md` section 4, the native-command paragraph and the model paragraph.
- `ki-accept` `scripts/internal/prune-selection.ts`: candidates carry `id`; a selected outcome carries `commitMessage` from the exported `pruneCommitMessage`; `scripts/prune-selection.test.ts` covers ordering, singular and plural.
- `ki-next` `SKILL.md` and `references/standards-next-work.md` name the sweep as committing by default.
- No skill description changed, so no generated catalogue needed regeneration.

### Verification

- `bun run test`: 893 tests pass. `bunx tsc --noEmit` and `bunx biome check .` pass.
- `printf 'chore(roadmap): prune 2 done work records\n\n- KI-HARNESS-GOV-003\n- KI-HARNESS-GOV-005\n' | bunx commitlint` passes.
- `ki repo audit --repo . --progress never --concise` in this isolated worktree reports four failing checks, none from this change: `REPO-REG-1` and `ROUTE-1` because the worktree is not a registered checkout, `RUNTIMES-2` user-activation coverage, and `DEPS-1` raised by an unpushed rubric change in the dev-linked primary checkout. The primary checkout, with the same `.ki.toml` and no changes to these surfaces, audits FAIL=0. `ki-accept` and `ki-next` are user skills, not declared in `.ki.toml`, so they have no repository `--skill` audit; the Verify block now lists only `ki-work-roadmap`, whose focused audit resolves the dev-linked primary checkout rather than this worktree. The pre-commit staged-snapshot `ki-skills` audit covers all touched skill roots.

### Outstanding concerns

None in scope. The skill text describes `KI-TOOL-CLI-105`; until a `tools-ki` release carrying it is installed, the manual prune commit under the same message remains correct, as the standard says.

### Post-change review

The goal holds across all four surfaces and matches the `tools-ki` contract. Regression risk is limited to ROAD-8 reviews, which gain one outcome. Ready for acceptance.

### Mini recap

Aligned the pruning doctrine with the owner's decision and the committing CLI. No learning route beyond this record.

## Done

Accepted 2026-10-06 on the review packet above, with Kris Brown's approval relayed by the coordinating session, after the Fable review findings were addressed.

A Fable review found nothing blocking. Its should-fix findings were applied: the Verify block drops `--skill` audits for the undeclared user skills `ki-accept` and `ki-next`; the standard and acceptance procedure document `--dry-run`, restore on a failed commit, and that `--no-commit` skips the Git checks; and the record lifecycle is current. Nits applied: singular and identifier order in `ki-accept` step 4, the default commit in its Notes, and the ROAD-8 guidance wording with its test assertion and regenerated rubric.

## Discussion

### Owner decision (2026-10-06)

Kris reversed the capture's direction: pruning `done` records stays allowed because Git history is the archive, `ki repo roadmap prune` commits the deleted files in one commit with a standardised message, and `--no-commit` opts out. This settles the three questions the capture left open:

- **Restoration.** Records pruned on 2026-10-04/05 in `mcp-gsuite`, `mcp-m365`, `mcp-ki-kb-notion-mirror`, `mcp-git-audit` and this harness are not restored. Their content remains in the parent of each prune commit.
- **Withdrawal.** No new withdrawal path is needed. Unadopted intake closes through an approved terminal Triage disposition and is then prunable like any `done` record.
- **Native command.** `ki repo roadmap prune` is kept and gains the default commit rather than a refusal.

### Message format

The subject counts records so a reader of `git log` knows the size of the cleanup without opening it, and the body lists one identifier per line so the commit can be found by identifier and every body line stays well inside commitlint's 100-character limit, whatever the record titles. `chore(roadmap)` matches the scope the estate already uses for ledger and record housekeeping, and passes the shared commitlint configuration.

### Cross-repository relationship

`knowledgeislands/tools-ki` `KI-TOOL-CLI-105` delivers the CLI behaviour this item describes. It is a non-blocking handoff in both directions: neither item blocks or is blocked by the other. The skill text describes the command's contract, and until a `tools-ki` release carrying CLI-105 is installed the manual commit with the same message remains correct.
