---
id: KI-HARNESS-GOV-213
area: GOV
title: COORD-7 code spans
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: 5527b917c708f30276067cc5a84dc1da5d34e37a
created_at: 2026-10-18T08:55:29Z
updated_at: 2026-10-18T17:35:03Z
---

# KI-HARNESS-GOV-213: COORD-7 Code Spans

## Goal

The `ki-coordination` rubric's COORD-7 skips record identifiers inside inline code spans, as it already skips fenced blocks, so that a report quoting literal text, such as a commit subject, is not told to link an identifier that a code span cannot hold.

## Context

Kris Brown answered "yes, go ahead with all the recommended" on 18 October 2026 in the ways-of-working decisions log, "owner answers, batches 6 and 7", read back as taken: "PMO-CODE a) - harness record: COORD-7 skips inline code spans."

The check-pass run in that work linked the bare record identifiers in eight of its reports; COORD-7 for the folder fell from 9 findings to 1, and the one left is a decision identifier quoted inside a commit subject in a code span. Markdown renders a code span literally, so a link inside it is not a link, and the only way to pass today is to drop the backticks from a quotation.

## Boundary

- In: `reportLinkFindings` in `scripts/rubric/contexts/coordination.ts` and its tests; the COORD-7 description in `scripts/rubric/items/threads.ts`; the [Linking records](../../skills/change-management/ki-coordination/references/standards-coordination.md#linking-records) sentence that lists what is not checked; the regenerated `rubric.md`.
- Out: the existence check on a record link, which still reads a link whose label holds a code span; COORD-11's Queries reading; [KI-HARNESS-GOV-197](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-197-pmo-7-outside-checkout-links.md)'s outside-checkout links; a release.

## Current state

`reportLinkFindings` blanks fenced blocks, replaces every Markdown link with a space after checking its target, and reports each record identifier left in the text. An identifier inside backticks is left, so it is reported as unlinked.

## Steps

- [x] `coordination.ts`: after the links are taken out, blank every inline code span, a run of backticks closed by a run of the same length within one paragraph, before collecting the bare identifiers; an unclosed backtick leaves the text checked.
- [x] `coordination.test.ts`: an identifier in a single- and a double-backtick span is not reported; one beside a span still is; an unclosed backtick does not hide it; a link whose label is a code span naming a missing record is still reported missing.
- [x] `threads.ts` COORD-7 description and the `standards-coordination.md` Linking records sentence name inline code spans beside fenced blocks.
- [x] Regenerate `rubric.md` through `ki dev skill rubric ki-coordination --write` and run Verify.

## Files touched

- `skills/change-management/ki-coordination/scripts/rubric/contexts/coordination.ts` and `coordination.test.ts`
- `skills/change-management/ki-coordination/scripts/rubric/items/threads.ts`
- `skills/change-management/ki-coordination/references/standards-coordination.md` and generated `rubric.md`
- this record

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-coordination` reports the rubric current.
- `ki repo audit --skill ki-coordination`, `--skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap` report no new failure in the contract under change.
- `ki repo audit --repo <ki-principal> --skill ki-coordination` no longer reports the code-span identifier in the check-pass report.

## Dependencies / blocks

No blocker. The change reaches other repositories' audits only when `ki` loads the harness's updated catalogue; no release is part of this record.

## Documentation impact

### Decision Records

None: a narrow reading of an existing check, decided by Kris Brown's PMO-CODE a) answer.

### Specifications

None: the `ki-coordination` standard is the contract and changes in place.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

The approved boundary from baseline `5527b917c708f30276067cc5a84dc1da5d34e37a`: COORD-7 blanks inline code spans after reading links and before collecting bare record identifiers, so a quoted commit subject is not reported; a link whose label is a code span still has its target checked, and an unclosed backtick or a span broken by a blank line hides nothing. Nothing is released.

### Change Summary

- `scripts/rubric/contexts/coordination.ts`: a `CODE_SPAN` pattern, a backtick run closed by a run of the same length within one paragraph, is blanked from the unlinked text in `reportLinkFindings`; its doc comment names code spans beside fenced blocks.
- `scripts/rubric/contexts/coordination.test.ts`: three cases, single-, double-backtick and multi-line spans skipped with a bare identifier beside them still reported, an unclosed backtick and a span across a blank line not hiding an identifier, and a code-span link label still reported missing.
- `scripts/rubric/items/threads.ts` and `references/standards-coordination.md`: the COORD-7 description and the Linking records sentence name inline code spans; `references/rubric.md` regenerated.

### Verification

- `bun run test`: pass, 1253 tests.
- `bunx tsc --noEmit`: pass.
- `ki dev skill rubric ki-coordination --write` regenerated `rubric.md`; `ki dev skill generate ki-coordination`: in sync.
- `ki repo audit --skill ki-coordination`, `--skill ki-authoring` and `--skill ki-work-roadmap`: pass. `--skill ki-skills`: no failure; WARN=3, the existing LONG-3 refresh-cadence findings in other skills' `sources.md`, outside this change.
- `ki repo audit --repo <ki-principal> --skill ki-coordination`: `settle-model.report.md`, whose only finding was the identifier quoted in a commit subject, is no longer reported. `check-pass.report.md` is still reported for the same identifier written bare in its prose, a true finding. The other COORD-7 findings are bare identifiers in other work folders' reports, outside this change.

### Outstanding concerns

- The check reaches other repositories only when `ki` loads the harness's updated catalogue.

### Post-change review

Reviewer: pending; this record awaits an independent review before acceptance.

### Mini recap

COORD-7 now treats an inline code span like a fenced block: literal quoted text is not asked to hold a link.

## Done

Accepted 2026-10-18 by Kris Brown on the review packet above.

## Discussion

Captured, adopted to Now and planned to Ready by the `harness-followups` run in the ways-of-working work on Kris Brown's PMO-CODE a) answer, which asked for a harness record.

### Acceptance

Accepted on 18 October 2026 by the `accept-prune` run of the ways-of-working Project work, under Kris Brown's standing grant recorded in the ways-of-working decisions log, entry "2026-10-18 17:59 BST - owner answers, recap batch" (ACCEPT-AND-PRUNE): "I think anything which is awaiting acceptance can be accepted, and then we can prune anything which is in a state of done". Re-check against `main` at `7d9959dc` before closure: `bun run test` passes, 1255 tests; `bunx tsc --noEmit` passes; `ki dev skill rubric` reports the touched skills' rubrics current and `ki dev skill generate ki-coordination` reports the surfaces in sync; `ki repo audit` passes every skill this record's Verify names, its one failure being the pre-existing `ki-engineering` SCR-11 hook finding outside this record.
