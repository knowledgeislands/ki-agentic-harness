---
id: KI-HARNESS-GOV-213
area: GOV
title: PMO-7 code spans
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 5527b917c708f30276067cc5a84dc1da5d34e37a
created_at: 2026-10-18T08:55:29Z
updated_at: 2026-10-18T09:01:54Z
---

# KI-HARNESS-GOV-213: PMO-7 Code Spans

## Goal

The `ki-pmo` rubric's PMO-7 skips record identifiers inside inline code spans, as it already skips fenced blocks, so that a report quoting literal text, such as a commit subject, is not told to link an identifier that a code span cannot hold.

## Context

Kris Brown answered "yes, go ahead with all the recommended" on 18 October 2026 in the ways-of-working decisions log, "owner answers, batches 6 and 7", read back as taken: "PMO-CODE a) - harness record: PMO-7 skips inline code spans."

The check-pass run in that work linked the bare record identifiers in eight of its reports; PMO-7 for the folder fell from 9 findings to 1, and the one left is a decision identifier quoted inside a commit subject in a code span. Markdown renders a code span literally, so a link inside it is not a link, and the only way to pass today is to drop the backticks from a quotation.

## Boundary

- In: `reportLinkFindings` in `scripts/rubric/contexts/pmo.ts` and its tests; the PMO-7 description in `scripts/rubric/items/threads.ts`; the [Linking records](../../skills/change-management/ki-pmo/references/standards-pmo.md#linking-records) sentence that lists what is not checked; the regenerated `rubric.md`.
- Out: the existence check on a record link, which still reads a link whose label holds a code span; PMO-11's Queries reading; [KI-HARNESS-GOV-197](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-197-pmo-7-outside-checkout-links.md)'s outside-checkout links; a release.

## Current state

`reportLinkFindings` blanks fenced blocks, replaces every Markdown link with a space after checking its target, and reports each record identifier left in the text. An identifier inside backticks is left, so it is reported as unlinked.

## Steps

- [x] `pmo.ts`: after the links are taken out, blank every inline code span, a run of backticks closed by a run of the same length within one paragraph, before collecting the bare identifiers; an unclosed backtick leaves the text checked.
- [x] `pmo.test.ts`: an identifier in a single- and a double-backtick span is not reported; one beside a span still is; an unclosed backtick does not hide it; a link whose label is a code span naming a missing record is still reported missing.
- [x] `threads.ts` PMO-7 description and the `standards-pmo.md` Linking records sentence name inline code spans beside fenced blocks.
- [x] Regenerate `rubric.md` through `ki dev skill rubric ki-pmo --write` and run Verify.

## Files touched

- `skills/change-management/ki-pmo/scripts/rubric/contexts/pmo.ts` and `pmo.test.ts`
- `skills/change-management/ki-pmo/scripts/rubric/items/threads.ts`
- `skills/change-management/ki-pmo/references/standards-pmo.md` and generated `rubric.md`
- this record

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-pmo` reports the rubric current.
- `ki repo audit --skill ki-pmo`, `--skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap` report no new failure in the contract under change.
- `ki repo audit --repo <ki-principal> --skill ki-pmo` no longer reports the code-span identifier in the check-pass report.

## Dependencies / blocks

No blocker. The change reaches other repositories' audits only when `ki` loads the harness's updated catalogue; no release is part of this record.

## Documentation impact

### Decision Records

None: a narrow reading of an existing check, decided by Kris Brown's PMO-CODE a) answer.

### Specifications

None: the `ki-pmo` standard is the contract and changes in place.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

The approved boundary from baseline `5527b917c708f30276067cc5a84dc1da5d34e37a`: PMO-7 blanks inline code spans after reading links and before collecting bare record identifiers, so a quoted commit subject is not reported; a link whose label is a code span still has its target checked, and an unclosed backtick or a span broken by a blank line hides nothing. Nothing is released.

### Change Summary

- `scripts/rubric/contexts/pmo.ts`: a `CODE_SPAN` pattern, a backtick run closed by a run of the same length within one paragraph, is blanked from the unlinked text in `reportLinkFindings`; its doc comment names code spans beside fenced blocks.
- `scripts/rubric/contexts/pmo.test.ts`: three cases, single-, double-backtick and multi-line spans skipped with a bare identifier beside them still reported, an unclosed backtick and a span across a blank line not hiding an identifier, and a code-span link label still reported missing.
- `scripts/rubric/items/threads.ts` and `references/standards-pmo.md`: the PMO-7 description and the Linking records sentence name inline code spans; `references/rubric.md` regenerated.

### Verification

- `bun run test`: pass, 1253 tests.
- `bunx tsc --noEmit`: pass.
- `ki dev skill rubric ki-pmo --write` regenerated `rubric.md`; `ki dev skill generate ki-pmo`: in sync.
- `ki repo audit --skill ki-pmo`, `--skill ki-authoring` and `--skill ki-work-roadmap`: pass. `--skill ki-skills`: no failure; WARN=3, the existing LONG-3 refresh-cadence findings in other skills' `sources.md`, outside this change.
- `ki repo audit --repo <ki-principal> --skill ki-pmo`: `settle-model.report.md`, whose only finding was the identifier quoted in a commit subject, is no longer reported. `check-pass.report.md` is still reported for the same identifier written bare in its prose, a true finding. The other PMO-7 findings are bare identifiers in other work folders' reports, outside this change.

### Outstanding concerns

- The check reaches other repositories only when `ki` loads the harness's updated catalogue.

### Post-change review

Reviewer: pending; this record awaits an independent review before acceptance.

### Mini recap

PMO-7 now treats an inline code span like a fenced block: literal quoted text is not asked to hold a link.

## Discussion

Captured, adopted to Now and planned to Ready by the `harness-followups` run in the ways-of-working work on Kris Brown's PMO-CODE a) answer, which asked for a harness record.
