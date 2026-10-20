---
id: KI-HARNESS-GOV-215
area: GOV
title: COORD-12 to FAIL
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
horizon: now
priority: medium
size: s
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 31fe7df1ab2ee90937878f9e3738354ba0acfe65
created_at: 2026-10-18T08:55:31Z
updated_at: 2026-10-20T05:31:23Z
---

# KI-HARNESS-GOV-215: COORD-12 to FAIL

## Goal

The `ki-coordination` rubric's COORD-12, the check that a saved work report opens with its `#` report heading, moves from WARN to FAIL, so that a report that opens with a lint directive, a frame or a form line stops a mark rather than only warning.

## Context

[KI-HARNESS-GOV-175 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-175-delegation-run-events.md) delivered COORD-12 at WARN, because 14 older reports in other work's folders in Knowledge Islands Principal open with a lint directive or a frame. Kris Brown answered "yes, go ahead with all the recommended" on 18 October 2026 in the ways-of-working decisions log, "owner answers, batches 6 and 7", read back as taken: "PMO12-LEVEL a) - COORD-12 stays WARN, a leading lint directive still fails it, promote to FAIL once folders are pruned." This record carries the promotion; it is adopted and held until the condition holds.

## Boundary

- In: COORD-12's level in `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`, its remediation wording, the regenerated `rubric.md`, and the remediation inventory test that counts the estate's criteria by level.
- Out: what COORD-12 reads or accepts, which stays as delivered, a leading lint directive still failing it; editing any work folder's reports, which their own coordinators prune or fix at their marks; a release.

## Current state

Checked on 20 October 2026 at `30cbbd1d`. COORD-12 in `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts` declares `mechanical.level: 'WARN'` with diagnostic remediation. Its outcomes come from `headingOutcomes` in `scripts/rubric/contexts/coordination.ts`, whose violations carry no level of their own and so take the item's declared level; changing the declaration is enough for the `ki` validator. `references/rubric.md` publishes COORD-12 as `[M]` with no level in the line. The remediation-inventory test in `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` counts catalogues, criteria and remediation classes, not levels, so a level change leaves its counts as they are. The release condition held on 20 October 2026, as recorded under Discussion.

## Steps

- [x] Re-run `ki repo audit --skill ki-coordination --reporter-levels all` in the eight territory Capitals and confirm no COORD-12 warning has appeared since the release.
- [x] Set COORD-12's `mechanical.level` to `'FAIL'` and reword its remediation guidance so that it no longer reads as advisory.
- [x] Add a test that a report opening with a lint directive yields a COORD-12 violation that the item declares at FAIL.
- [x] Regenerate `references/rubric.md` and confirm the remediation-inventory counts are unchanged.

## Files touched

- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`
- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.test.ts` or an item-level test beside `threads.ts`
- `skills/change-management/ki-coordination/references/rubric.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-coordination` leaves no diff.
- `ki repo audit --skill ki-coordination` passes here and in `ki-principal`, with COORD-12 reported as FAIL-level and passing.

## Dependencies / blocks

None blocking: the hold's condition held on 20 October 2026. If the re-run in the first Step finds a COORD-12 warning, the owning coordinator fixes its report first, and this record waits for it.

## Documentation impact

### Decision Records

None needed: the owner's PMO12-LEVEL answer in the ways-of-working decisions log already sets the promotion.

### Specifications

None: no Specification covers the coordination rubric.

### Guides

None: no guide states COORD-12's level.

### Roadmap

None.

## Review

### Delivered

COORD-12 now fails a saved work report whose first non-blank line is not its `#` report heading. The census before the change found no COORD-12 warning in any of the eight territory Capitals: ki-principal, hnr-principal, legal-principal and personal-principal pass with 30, 14, 24 and 44 reports; er-principal, si-principal, tmx-principal and va-principal hold no reports in scope.

### Change Summary

- `threads.ts`: COORD-12's `mechanical.level` is `'FAIL'`, and its remediation asks for the heading to be fixed before the work is marked or sent.
- `threads.test.ts`: a new test that a report opening with a lint directive gives exactly one COORD-12 violation, and that the item declares FAIL.
- `references/rubric.md`: regenerated. Only the remediation line changed, so the remediation-inventory counts are unchanged.

### Verification

- `bun run test`: 1346 pass, 0 fail.
- `bunx tsc --noEmit`: passes.
- `ki dev skill rubric ki-coordination`, run in an isolated home bound to the worktree: in sync.
- `ki repo audit --skill ki-coordination` in the worktree: FAIL=0. The two COORD-8 warnings come from the isolated home's missing user bindings.
- `ki repo audit --skill ki-skills`: PASS.
- `ki repo audit --skill ki-coordination` in ki-principal: COORD-12 passes on 30 reports. That audit uses the installed harness, so it will show COORD-12 at FAIL only after release. The run also has 30 COORD-7 failures in ki-principal's own work folders; they were there before and this record does not touch them.

### Outstanding concerns

None for this record. The COORD-7 failures in ki-principal are territory work's to fix at its mark.

### Post-change review

The level change applies to all reports, including those from the tolerance window. The census shows none of them currently fails, so the promotion does not newly fail any Capital.

### Mini recap

COORD-12 now fails. The census was clean, a test covers the change and the rubric has been regenerated.

## Discussion

The release condition is observable: `ki repo audit --skill ki-coordination` across the territories' Capitals reports no COORD-12 warning. When it does, release this record to Now, plan it and deliver it; until then the warning lets coordinators mark without being blocked by reports that other work will prune.

### Released, 20 October 2026

The hold's condition was checked on 20 October 2026 with `ki repo audit --skill ki-coordination --reporter-levels all` in all eight territory Capitals, `ki-principal`, `er-principal`, `hnr-principal`, `legal-principal`, `personal-principal`, `si-principal`, `tmx-principal` and `va-principal`: none reports a COORD-12 warning, and in `ki-principal` COORD-12 passes over 102 work reports. The record is released to Next under the lane-triage run of the ways-of-working work, as roadmap-census-2 asked; the remediation inventory test's counts are re-read at planning.

### Planning answers, 20 October 2026

Kris Brown answered PLANNED-READY on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "the old do need to move to Ready if possible, and we need to move them", taken as a): take the listed answers and mark each record Ready where the readiness checks pass. It had no open decision; `priority: medium` and `size: s` are set, and the record is Ready at Next.
