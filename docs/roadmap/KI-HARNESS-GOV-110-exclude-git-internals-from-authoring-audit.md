---
id: KI-HARNESS-GOV-110
area: GOV
title: Exclude Git internals
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T17:09:48Z
updated_at: 2026-10-04T12:05:54Z
---

# KI-HARNESS-GOV-110: Exclude Git Internals

## Goal

Repository authoring audits assess the selected checkout without treating physical Git metadata or sibling worktree contents as part of that checkout. Tracked Markdown in the selected worktree remains fully audited.

## Context

A full `ki repo audit` of the Harness reported `MD049` failures from Markdown below `.git/paperclip-worktrees/**`. Those files belong to active sibling Paperclip worktrees, not to the selected primary checkout, so their findings make the primary checkout appear unstable and allow one worktree to fail another's audit.

The authoring audit must exclude the repository's physical `.git/**` from discovery, including `.git/paperclip-worktrees/**`, while continuing to inspect tracked Markdown rooted in the selected worktree. The rule must also respect linked-worktree layouts where `.git` is a pointer file rather than a directory.

No existing roadmap item owns this audit-boundary defect. The nearest active worktree item, `KI-HARNESS-GOV-109`, concerns missing commit gates inside linked worktrees rather than cross-worktree file discovery.

## Boundary

This item does not modify, format, audit, or remove files inside active Paperclip worktrees. It does not broadly exclude hidden directories, weaken Markdown rules, suppress genuine findings from tracked files in the selected worktree, or implement the fix during intake capture.

## Current state

`572d84a6` delivered the exclusion itself: `.git` is in `RUMDL_DEFAULT` (`skills/governance/ki-authoring/scripts/rubric/contexts/authoring.ts`) and in this repository's `.rumdl.toml`, and the frontmatter walk skips `.git` through `FRONTMATTER_IGNORED_DIRECTORIES`. The only remaining gap is the end-to-end regression this record's Verification shape asks for; the existing test merely asserts that the template string contains `".git"`.

## Steps

- [ ] Add one `ki-authoring` regression that drives the real `MD-mech` audit path (`createAuthoringSession` with its default `rumdl check .` inspector) against a temporary Git repository carrying the canonical `.rumdl.toml`.
- [ ] Prove the excluded side: malformed Markdown in a sibling linked worktree under `.git/paperclip-worktrees/**`, and in other physical Git metadata, leaves the selected checkout's audit at `PASS`.
- [ ] Prove the retained side: the same malformed Markdown in the selected checkout yields `VIOLATION`, including when the selected checkout is itself a linked worktree whose `.git` is a pointer file.
- [ ] Confirm the regression fails against a configuration without the `.git` exclusion, so it is not vacuous.

## Files touched

- `skills/governance/ki-authoring/scripts/rubric/items/index.test.ts`
- `docs/roadmap/KI-HARNESS-GOV-110-exclude-git-internals-from-authoring-audit.md`

## Verify

- `bun test skills/governance/ki-authoring/scripts/rubric/items/index.test.ts`, `bun run test`, and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-authoring --repo .` and `ki repo audit --skill ki-work-roadmap --repo .` pass.

## Dependencies / blocks

None. The exclusion is already delivered; this adds evidence only, changes no audit behaviour, and touches no Paperclip worktree or Git metadata outside temporary fixtures.

## Documentation impact

### Decision Records

None; no durable choice changes.

### Specifications

None; accepted behaviour is unchanged.

### Guides

None.

### Roadmap

This record only.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified partial delivery: `572d84a6` added `.git` to the canonical authoring exclusion and this repository’s configuration. The exclusion remains in `skills/governance/ki-authoring/scripts/rubric/contexts/authoring.ts::RUMDL_DEFAULT` and [.rumdl.toml](../../.rumdl.toml#L6). `skills/governance/ki-authoring/scripts/rubric/items/index.test.ts` asserts that the generated configuration contains it.
- Remaining: the existing assertion is not the end-to-end discovery regression requested under Verification shape. Prove that malformed selected-checkout Markdown fails while the same content under physical Git metadata, including a sibling-worktree path, is excluded; cover linked-worktree pointer-file layouts. This audit did not add or run that missing fixture.
- Closure route: treat the exclusion as already implemented, not as permission to weaken more rules. Resolve the verification gap through the proper Triage adoption and review route or an applicable owner-approved disposition; then obtain explicit acceptance. No Git metadata or retained worktree was changed.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Stability boundary

An audit result should depend on the selected repository revision and its declared local configuration. Traversing Git's private storage makes that result depend on unrelated concurrent branches and temporary coordination state, so identical selected-checkout content can alternate between pass and fail.

### Verification shape

Later planning should prove both sides of the boundary: a deliberately non-conforming Markdown file below the selected worktree must still fail, while the same fixture below physical `.git/**`, including a Paperclip worktree path, must not enter the authoring audit. The test must exercise the discovery path used by the full repository audit rather than only a helper in isolation.
