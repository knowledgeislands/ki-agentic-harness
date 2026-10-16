---
id: KI-HARNESS-GOV-203
area: GOV
title: Git clean-down criteria
kind: deliver
purpose: governance
project: ways-of-working
component: governance
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: b2e8e784efaf333bc7d0aaec2a69ad7c57952c1a
created_at: 2026-10-16T21:53:45Z
updated_at: 2026-10-16T21:56:10Z
---

# KI-HARNESS-GOV-203: Git Clean-Down Criteria

## Goal

The `ki-git` standard and rubric state mechanically checkable PR and branch clean-down criteria, each with the read-only command and fixed rule that decide it, and never let clean-down delete a remote branch or close a pull request without the owner's approval, so that [KI-TOOL-KI-CLI-140](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-140-git-hygiene-estate-audit.md) can run them through `ki repo audit` and `conform` across the estate.

## Context

Kris Brown decided REPO-GIT-HYGIENE in the tools-burndown thread on 16 October 2026 at 01:00 BST, routing the rubric rule to KI Model: ways-of-working. The ways-of-working checkpoint carried it as: add PR and branch clean-down criteria to the `ki-git` rubric and standard in ki-agentic-harness - open PRs, merged and stale local and remote branches (`automation/*`, `dependabot/*` and `renovate/*` included), commits ahead of or behind upstream, stashes, linked worktrees beyond BRANCH-2, and untracked or staging-area leftovers - each mechanically checkable, never deleting a remote branch or closing a PR without approval. Before this record the rubric's only mechanical criterion was RUBRIC-1, and nothing named remote branches, PRs, stashes or ahead and behind.

The `ki-git` rubric is deliberately judgment-only with no private Git executor, a contract its tests pin; KI-TOOL-KI-CLI-140 owns the read-only Git facts and the mechanical findings. This record therefore makes each criterion mechanically decidable in its wording, the command and the rule, and leaves the executor to `ki`.

## Boundary

- In: a `## Clean-down state` section in the standard with the default-branch rule, remote-evidence freshness, the 30-day stale threshold, the criteria table and the approval rule; the CLEAN rubric family, CLEAN-1 to CLEAN-7, as judgment items naming their deciding commands; the regenerated `rubric.md`; the SKILL.md and sources wording; tests.
- Out: any Git executor or mechanical check, which KI-TOOL-KI-CLI-140 owns; fetching, deleting or closing anything; the estate clean-down itself, which tools-burndown carries.

## Current state

Delivered at the resting point recorded under Review.

## Steps

- [x] Add `## Clean-down state` to `standards-git.md` and name the clean-down criteria in its scope.
- [x] Add `scripts/rubric/items/clean.ts` with CLEAN-1 to CLEAN-7 and register the family in the catalogue and the session subject.
- [x] Pin the family, the deciding commands, the automation prefixes and the approval boundary in the rubric tests, and update the ki-skills remediation-inventory counts.
- [x] Regenerate `rubric.md` with `ki dev skill rubric ki-git --write` and update SKILL.md and `sources.md`.

## Files touched

- `skills/governance/ki-git/SKILL.md`, `references/standards-git.md`, `references/rubric.md`, `references/sources.md`
- `skills/governance/ki-git/scripts/rubric/items/clean.ts`, `index.ts`, `index.test.ts`, `scripts/rubric/contexts/git.ts`, `git.test.ts`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`
- `docs/roadmap/_ISSUES.md`, this record

## Verify

`bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-git`, `--skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap`, run sequentially.

## Dependencies / blocks

KI-TOOL-KI-CLI-140 in `tools-ki` depends on this record for its criteria. The dependency crosses repositories, so it lives here rather than in `blocks`.

## Documentation impact

### Decision Records

None: the decision is Kris's REPO-GIT-HYGIENE answer.

### Specifications

None: the standard is the contract and changes in place.

### Guides

None.

### Roadmap

None beyond this record; KI-TOOL-KI-CLI-140 can now plan against the CLEAN family.

## Review

### Delivered

The boundary above, from baseline `b2e8e784efaf333bc7d0aaec2a69ad7c57952c1a`, in the delivery commit that carries this record.

### Change Summary

The standard gains `## Clean-down state`: the default branch, remote facts from remote-tracking refs with the last fetch's age, automation branches judged like any other, a 30-day stale threshold, a seven-row table of criterion, deciding command and finding, and the approval rule: only a proven-merged local branch may be proposed for `git branch -d`, and deleting a remote branch, closing a PR, dropping a stash, removing a worktree or deleting an untracked file each need the owner's approval naming the item. The rubric gains the CLEAN family, CLEAN-1 to CLEAN-7, rendered as judgment items until `ki` supplies the executor.

### Verification

- `bun run test`: 1208 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `ki repo audit --skill ki-git`, `--skill ki-authoring` and `--skill ki-work-roadmap`: pass. `--skill ki-skills`: pass with two LONG-3 refresh-cadence warnings on untouched skills.

### Outstanding concerns

The 30-day stale threshold is this delivery's choice; Kris did not set one, and KI-TOOL-KI-CLI-140 asks for it. Making it a repository setting is left to KI-TOOL-KI-CLI-140's planning.

### Post-change review

The change meets the Goal in text and keeps the judgment-only contract the existing tests pin. Ready for acceptance.

### Mini recap

The clean-down criteria are in the `ki-git` standard and rubric with their deciding commands; the mechanical executor is KI-TOOL-KI-CLI-140's.

## Discussion

Captured and delivered in one run on Kris Brown's REPO-GIT-HYGIENE routing, as the ways-of-working thread's master-harness brief set it: capture one record and deliver it to awaiting review. The stale threshold and whether a criterion warns or fails once mechanical are for KI-TOOL-KI-CLI-140's planning.
