---
id: KI-HARNESS-GOV-220
area: GOV
title: COORD-1 undeclared warn level
project: tools-burndown
component: governance
kind: deliver
priority: medium
size: s
status: draft
horizon: now
blocks: []
blocked_by: []
baseline_ref: null
transferred_from: ki-principal/Streams/Projects/tools-burndown.md
created_at: 2026-10-19T07:16:09Z
updated_at: 2026-10-20T01:44:15Z
---

# KI-HARNESS-GOV-220: COORD-1 Undeclared Warn Level

## Goal

`ki repo audit` completes on a territory Capital whose territory work is still the state-of-play checkpoint `+/_CHECKPOINTS/_state-of-play.md`, and reports COORD-1's tolerance-window warning as the item describes, instead of aborting the whole audit with a rubric validation error.

## Context

On 19 October 2026, with `ki` 0.11.3, `ki repo audit` in `equal-remedy/er-principal` stops with `ki: error: rubric item COORD-1 audit outcome 0 uses undeclared level` and exits 1 without rendering any findings. The same command passes COORD-1 in `ki-principal`, whose territory work has moved to `+/_WORK/`, and in `tools-ki`. The seven Capitals that still hold `+/_CHECKPOINTS/_state-of-play.md` all reach this path: `er-principal`, `hnr-principal`, `legal-principal`, `personal-principal`, `si-principal`, `tmx-principal` and `va-principal`.

The defect is a mismatch between COORD-1's declared level and the outcome it emits:

- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts:13` declares COORD-1 with `mechanical.level: 'FAIL'` and no `overrideLevels`.
- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts:215-220` defines `legacy()`, the tolerance-window helper, which returns a `VIOLATION` with `level: 'WARN'`.
- `coordination.ts:261`, in `masterOutcomes`, pushes `legacy(...)` for every Capital whose state-of-play checkpoint still exists, so COORD-1 emits a `WARN` outcome.
- `tools-ki/src/core/runtime/audit.ts:111-118` (`validateOutcome`) accepts an outcome `level` only when it equals the item's `mechanical.level` or appears in `mechanical.overrideLevels`, and otherwise throws, which aborts the audit.

COORD-1's own description promises that the legacy checkpoint "passes with a warning naming its new home", so the warning is intended; only the item's declaration does not admit it. The other `legacy()` callers, at `coordination.ts:282`, `:356` and `:715`, sit under items whose level the receiver should check the same way. The skill's own tests exercise the context's outcomes directly and do not run them through the `ki` validator, which is how the mismatch reached a release.

This is a handoff from the Tools burndown work in Knowledge Islands Principal, under Kris Brown's 19 October 2026 answer NEXT-TOOLS-KI a). This repository owns its priority, plan and execution; it is captured as unadopted triage and not implemented here.

## Boundary

- `ki-coordination`: COORD-1 admits its tolerance-window warning, by declaring `overrideLevels: ['WARN']` or by another shape the receiver chooses, and any other item emitting `legacy()` under a `FAIL` level is brought into line; `rubric.md` is regenerated if the published item changes.
- A test that would have caught the mismatch, such as checking each item's emitted levels against its declaration.
- Not the `ki` validator in `tools-ki`, whose rejection of an undeclared level is the intended contract.
- Not the migration of the seven Capitals' state-of-play checkpoints to `+/_WORK/`, which each territory owns.

## Current state

Checked on 20 October 2026 at `30cbbd1d` with `ki` 0.12.0. The defect stands in the source: `legacy()` in `scripts/rubric/contexts/coordination.ts` still returns a `WARN` violation, and COORD-1 in `scripts/rubric/items/threads.ts` still declares `level: 'FAIL'` with no `overrideLevels`. Of the four `legacy()` callers, only `masterOutcomes` feeds a FAIL item, COORD-1; `themeOutcomes`, reached from `labelOutcomes`, feeds COORD-2 and `tidyOutcomes` feeds COORD-9, both declared WARN, so they match. The `ki` validator (`tools-ki/src/core/runtime/audit.ts`, `validateOutcome`) is unchanged. No Capital reaches the path today: all seven named above, `si-principal` included, have moved their state-of-play checkpoint to `+/_WORK/`, and `ki repo audit --skill ki-coordination` in `er-principal` now renders its findings. The defect is latent: any repository that still holds a state-of-play checkpoint aborts its audit. Other skills already use `overrideLevels`, for example `ki-work-roadmap`'s `scripts/rubric/items/item.ts`.

## Steps

- [ ] Declare `overrideLevels: ['WARN']` on COORD-1's mechanical audit.
- [ ] Add a `ki-coordination` test that runs every item's emitted outcomes over fixtures, the tolerance-window checkpoint included, and asserts each outcome's level is the item's declared level or one of its `overrideLevels`.
- [ ] Regenerate `references/rubric.md` if the published item line changes.

## Files touched

- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`
- A new or extended test beside it, or in `scripts/rubric/contexts/coordination.test.ts`
- `skills/change-management/ki-coordination/references/rubric.md`, if regenerated

## Verify

- `bun run test` and `bunx tsc --noEmit` pass, and the new level test fails when `overrideLevels` is removed.
- `ki dev skill rubric ki-coordination` leaves no diff.
- `ki repo audit --skill ki-coordination` over a fixture Capital holding `+/_CHECKPOINTS/_state-of-play.md` renders COORD-1's tolerance-window warning instead of aborting.

## Dependencies / blocks

None blocking. No Capital is affected today, so the fix guards against the path rather than unblocking a live audit.

## Documentation impact

### Decision Records

None needed: the fix makes the item match its own description.

### Specifications

None: no Specification covers the coordination rubric.

### Guides

None.

### Roadmap

None.

## Discussion

### Shape of the fix

Declaring `overrideLevels: ['WARN']` on COORD-1 is the smallest change and matches the validator's contract. Lowering COORD-1 to `WARN` would weaken its main check, that a Capital holds its territory work and no other repository does, which is meant to fail.
