---
id: KI-HARNESS-GOV-225
area: GOV
title: Hook content claims
purpose: capability
project: tools-burndown
component: keystone
priority: medium
size: m
kind: deliver
status: done
blocks: []
blocked_by: []
baseline_ref: 76b6e5c51cee6c8a7f34c683b497ea1dc1fad817
created_at: 2026-10-19T22:46:17Z
updated_at: 2026-10-20T23:15:19Z
transferred_from: ki-principal ki.tools-burndown hooks-standard design section 4.2, HOOK-CAPTURE a), 2026-10-19
---

# KI-HARNESS-GOV-225: Hook Content Claims

## Goal

Each shape skill declares, in its rubric catalogue, the check-only lines it requires in a repository's committed `.githooks/pre-commit` and `.githooks/commit-msg`, and `ki-repo` declares the frame they follow, so that the `ki` host can compose a repository's hooks from the skills it declares instead of anyone writing them by hand.

## Context

Kris decided on 19 October, under GIT-HOOKS a) in the ki.tools-burndown [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.tools-burndown/decisions.md), that all hook content lives in a committed `.githooks/`. ki-agentic-harness `95a1ab58` standardised the convention: [ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) keeps existence and binding with `ki-repo` and content with the shape skills, and `HOOK-1` to `HOOK-5`, `SCR-5`, `SCR-11` and `GATE-1` audit the result. None of them creates a hook.

The [hooks-standard design](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.tools-burndown/design/hooks-standard.md), section 2.2, tabulates each shape's content and owning criterion: Bun (`SCR-11`), Knowledge Base (`GATE-1`), harness (a new `ki-repo-harness` criterion), Bash tool (`SHELL-HOOK`), chezmoi source (`GIT-2`) and the `HOOK-1`-only remainder. Section 4.2 names a claims mechanism on the model of the package-script claims. Kris took HOOK-CAPTURE a) at 23:21 BST: capture now, plans refined by pilot evidence, with the host in tools-ki, [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e978a4c9b0e697252bac3e0979f09d85e8c/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md), and the declarations and standards here. The wave 1 pilot hand-wrote va-principal's `pre-commit` because no claim existed.

## Boundary

- In: the claim declaration shape in the rubric catalogue contract, beside `packageScripts`; the `ki-repo` frame template as declared data, matching the `HOOK-4` frame rule; claims from `ki-engineering`, `ki-repo-kb`, `ki-repo-tools`, `ki-repo-dotfiles-chezmoi` and `ki-repo-harness`; the new `ki-repo-harness` content criterion the design names; standard text in `ki-repo` and each shape skill saying that conform composes from claims; checker tests.
- Out: the host loader, composer and conform step, which [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e978a4c9b0e697252bac3e0979f09d85e8c/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md) owns; `commit-msg` content for package-less repositories until `ki git check-message` ships in [KI-TOOL-KI-CLI-161 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/ce905bee422605f2f7c7c4c2d94819582f0c56b8/docs/roadmap/KI-TOOL-KI-CLI-161-git-check-message.md); raising the hook checks to FAIL; running conform in any repository.

## Current state

Checked on 20 October 2026 on branch `roll-standards`, after step 6.1 of the [Git hooks model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.chezmoi/design/git-hooks-model.md). Kris's STRICTNESS-CONFORM decision there settles the open questions below: there is one canonical hook pair per `primary_shape` and package presence, composed in a fixed order from the `ki-repo` frame and each shape's block, audited by exact comparison and with no extension point, so no repository keeps an unclaimed line; a repository-specific check becomes a criterion of its shape skill, run through the focused staged audit.

- The claims live as data in `ki-repo`, `skills/keystone/ki-repo/scripts/rubric/contexts/canonical-hooks.ts`, not in the rubric catalogue contract beside `packageScripts`.
- `ki-repo` `HOOK-4` compares each committed hook byte for byte with that text, and `HOOK-1` to `HOOK-4` are not applicable where a shape declares no hook.
- Each shape skill publishes its generated worked example under `assets/githooks/{package,no-package}/`, written by `ki-repo`'s generator.
- Content criteria: `ki-engineering` `SCR-11` and `PKG-6`, `ki-authoring` `MD-hook`, `ki-repo-kb` `GATE-1`, `ki-repo-harness` `GATE-1`, `ki-repo-tools` `SHELL-HOOK` and `ASSEMBLE-1`, and new `GATE-1` criteria in `ki-repo-specifications` and `ki-repo-homebrew-tap`; `ki-repo-dotfiles-chezmoi` `GIT-2` now requires that no hook is committed or bound.
- The harness's own hooks are its canonical package pair.

The host still composes nothing: writing the canonical text into a repository is [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e978a4c9b0e697252bac3e0979f09d85e8c/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md), which can now read the published assets or the composer rather than a catalogue claim.

## Steps

- [x] Settle where the claim shape lives and how lines are ordered: settled by STRICTNESS-CONFORM, as above.
- [x] ~~Add the hook-line claim shape beside `packageScripts` in the catalogue contract.~~ Superseded: the claims are `ki-repo` data.
- [x] Declare the `ki-repo` frame as data and make `HOOK-4` compare against it.
- [x] Add each shape's block and content criterion, including the new `ki-repo-harness` criterion.
- [x] Add the standard text in `ki-repo` and each shape skill, and regenerate the affected rubrics.
- [x] Kris agreed GOV225-CLOSE a) on 20 October 2026 at 23:16 BST: this record closes once independently reviewed; tools-ki has delivered repository hook writing.

## Files touched

- `skills/keystone/ki-repo/` composer, generator, standard, rubric items and `rubric.md`
- `ki-engineering`, `ki-authoring`, `ki-git` and the eight `ki-repo-*` shape skills' standards, criteria, `assets/githooks/` and `rubric.md`
- The harness's own `.githooks/`, `package.json` and `AGENTS.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric` leaves no diff for each touched skill, and `ki repo audit --skill ki-repo` and `--skill ki-repo-harness` report no FAIL here.

## Dependencies / blocks

[KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e978a4c9b0e697252bac3e0979f09d85e8c/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md) can proceed against the published canonical hooks. Kris's STRICTNESS-CONFORM decision brought the Project, homebrew-tap and specifications shapes in, which NO-GATE had parked.

## Documentation impact

### Decision Records

[ADR-KI-HARNESS-SKILLS-017](../decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md) is refined in place for the canonical hook and exact comparison.

### Specifications

None: the canonical text is harness data.

### Guides

None.

### Roadmap

None beyond [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e978a4c9b0e697252bac3e0979f09d85e8c/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md) in tools-ki.

## Review

### Delivered

The five delivery steps are complete. Canonical hook policy and text are owned by `ki-repo`; the host writes that text into repositories. Implementation is committed at `cea02aa56326ef3290ef9ec058a6a2287616cea4`.

The record never passed through `in-progress`, so its start transition wrote no baseline. A repair run set `baseline_ref` on 20 October 2026 from Git evidence alone, under GOV225-CLOSE a) and the coordinator's 23:42 BST entry in the ways-of-working decisions log. Three independent lines fix it at `76b6e5c51cee6c8a7f34c683b497ea1dc1fad817`:

1. The implementing run, `hooks/roll-standards`, Claude Code session `d8ef7048-5057-4645-b197-24543efcd9b1`, created its worktree at 03:37:22Z with `git worktree add -q -b roll-standards <worktree> main`. It ran no reset, checkout, pull or rebase before its first commit.
2. The primary checkout's `HEAD` reflog holds `main` at `76b6e5c5` from the `wow-rules2` fast-forward at 02:54:49Z until the `skills-cut` fast-forward at 03:39:42Z, which spans the worktree's creation.
3. The original implementation commit, `ac7d54764221b3258ed8b1b00b726cda3a4cfe44`, has the same subject and author time, 04:16:55Z, and its parent is `76b6e5c5`. The run rebased it onto `main` at 04:18:47Z, producing `cea02aa5`. Its present parent, `ba4055efca9a58d3790822f811ee621199c28122`, was committed at 04:19:03Z, after the original implementation commit, so it is not the execution baseline.

### Change Summary

Canonical hook data, fixed frame and shape blocks, exact `HOOK-4` comparison, generated package and no-package examples, shape content criteria, standards and readable rubrics were delivered. STRICTNESS-CONFORM superseded the proposed catalogue claim extension. This acceptance run changes the lifecycle evidence only.

### Verification

`bun run test` passed on the baseline and worktree: 1,374 tests, zero failures. `bunx tsc --noEmit` passed. `ki dev skill rubric` passed without writes for all 13 affected skills: `ki-repo`, `ki-engineering`, `ki-authoring`, `ki-git` and the nine repository shapes. The isolated-home `ki-repo` and `ki-authoring` audits passed. The isolated-home `ki-work-roadmap` audit failed because this executing or completed record needs an immutable `baseline_ref`; `ki-repo-harness` failed through that same governing check. Existing fleet warnings are separate from this blocking record failure.

After the baseline repair, `bun run test` passed with 1,385 tests and zero failures, and `bunx tsc --noEmit` passed. The isolated-home `ki-work-roadmap`, `ki-repo-harness`, `ki-authoring` and `ki-repo` audits reported no failures. Their warnings are fleet findings about other records and the unregistered ki-principal checkout, not this record.

The fourth independent acceptance pass on 21 October 2026 reviewed the combined result at `3f203c63da4434d925c2aaec34bf907c0456a621`. `bun run test` passed with 1,393 tests and zero failures; `bunx tsc --noEmit` passed. All 13 affected rubric publications verified without writes. The isolated-home `ki-work-roadmap`, `ki-authoring`, `ki-repo`, `ki-repo-harness`, `ki-skills` and `ki-diagrams` audits reported no failures. Existing fleet warnings remain separate from this record. The canonical hook data, byte-exact mismatch path, generated-asset equality tests, all completed delivery steps and the host loader were independently inspected.

### Outstanding concerns

The first acceptance run stopped on `baseline_ref: null`. The repair under Delivered fixes the baseline from Git evidence, and the fourth independent acceptance review has passed. The original commit `ac7d5476` is unreachable from any ref, so a future `git gc` may prune it; the reflog and session log stay as evidence. No new work record has been created.

Reference preflight searched 23 local repository roots under the Knowledge Islands workspace. Surviving inbound references exist in ki-principal, including the tools-burndown hook design and ways-of-working review material. They must be pinned to this record's final committed revision before any later prune. The first acceptance run had no authority to edit those peer documents directly; the fourth pass explicitly includes pinning every inbound link before pruning. No reference was orphaned because this record is retained.

### Post-change review

This run independently inspected the canonical data, the byte-exact comparison and its failure path, generated-asset equality coverage, the five completed delivery steps, and tools-ki's canonical hook loader. Kris's GOV225-CLOSE a) agreement is recorded in the ways-of-working decisions log under "query sign-offs, first batch", 20 October 2026 at 23:16 BST. The grant authorises acceptance and pruning of this record only after a passing review.

### Mini recap

The source work is delivered, the repaired immutable baseline is verified and the independent acceptance review passes. Kris's GOV225-CLOSE a) grant authorises this closure. This commit retains the accepted record; inbound references must be pinned to its last committed revision before a separate prune-only commit.

## Done

Accepted 21 October 2026 by Kris Brown under GOV225-CLOSE a), agreed on 20 October 2026 at 23:16 BST in the [ways-of-working decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.ways-of-working/decisions.md), following the fourth independent review on the review packet above.

## Discussion

### Contract placement

The claim shape is read by the `ki` host, so it may belong in a KI Specifications contract rather than in the harness alone, as the rubric catalogue contract does. Planning should decide where it lives before either side writes code.

### Order and repository-specific lines

When several skills claim lines in one hook, the composed order must be stable: the design puts Bun lines first and the KB audit after them. Planning should decide whether order follows declared skill order or an explicit rank, and how a repository keeps lines no skill claims, which [KI-TOOL-KI-CLI-165 (pruned)](https://github.com/knowledgeislands/tools-ki/blob/fde00e978a4c9b0e697252bac3e0979f09d85e8c/docs/roadmap/KI-TOOL-KI-CLI-165-hook-composition-claims-host.md) also asks.

### Disposition, 20 October 2026

Kris Brown answered HARNESS-TRIAGE on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "let's get the ball moving forwards", taken as a) with changes. Adopted into Next. Planning decides whether the contract belongs in KI Specifications.
