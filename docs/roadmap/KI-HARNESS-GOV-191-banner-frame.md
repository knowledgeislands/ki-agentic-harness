---
id: KI-HARNESS-GOV-191
area: GOV
title: banner frame
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: 0b3c05b5d0bf97cc4c2ea292f9c64d94d3fe42d2
created_at: 2026-10-14T17:09:51Z
updated_at: 2026-10-14T17:55:00Z
---

# Redraw the ki-pmo Banner as a Framed Label With the Thread Type, Issued Time and Mark on Its Borders

## Goal

Every coordinating thread closes its owner reports with one 52-column frame whose top border carries the thread type and the issued time, whose body carries the thread's label, and whose bottom border carries the mark, with the running, queued and waiting lines and the housekeeping line beneath it, so that the banner says what the thread is, when it spoke and where its window starts without a block word or a label-and-mark line.

## Context

`ki-pmo`'s banner has carried a block-letter REST, BUSY or DONE word since KI-HARNESS-GOV-186 and the issued time in its top border since KI-HARNESS-GOV-187. Kris drew a replacement at about 18:00 BST on 2026-10-14, a first version and then this second one, which is the one to build:

```text
╭─ coordination ------------ 2026-10-14T16:54:52Z ─╮
│                                                  │
│ KI Model - ways-of-working                       │
│                                                  │
╰────────────────────── mark 2026-10-14T13:54:34Z ─╯

   running: commit-gate - why ki-principal's commit gate fails
   running: harness-links - accept GOV-187, deliver GOV-188
   queued: link-form - after harness-links
   queued: re-bootstrap - after GOV-187 accepted
   waiting on you: HEADING-FORM
   waiting on you: RUN-WAIVER
   waiting on you: RECORD-THRESHOLD
   thread folder commit blocked by the gate, commit-gate fixing · held: PAPERCLIP-REQ until Wave F
```

Kris drew the top border's fill with ASCII hyphens by hand; the frame uses `─` so it matches the bottom border.

At 18:08 BST, after that drawing had landed, Kris refined it, as received:

```text
╭─ coordination ──── summary 2026-10-14T17:03:02Z ─╮
│                                                  │
│ KI Model - ways-of-working                       │
│                                                  │
╰────────────────────── mark 2026-10-14T13:54:34Z ─╯

- [queued] report-headings - section names, starting now
- [queued] banner-frame - after report-headings
- [waiting] GATE-FIX
...
```

and added "`KI Model - ways-of-working` could be centralised too". The record was reopened under the `banner-refine` brief of the same day, which said "Use the record it opened, or reopen it if it is closed or pruned. Do not open a new record." This record was opened at Kris's request under the `banner-frame` brief of 2026-10-14, after `report-headings` landed on harness `main`.

## Boundary

- In scope: the Banner section of the `ki-pmo` standard and its examples; `scripts/banner.test.ts`; the coordinator reminder hook line, its tests and the hook README; the `ki-coordinator` output style; the PMO-6 rubric item and the regenerated rubric; the harness specification's HARN-012 and HARN-013 wording; every banner example in skill sources, references and `docs/`.
- Out of scope: any `ki` command in `tools-ki` that prints the banner, which gets a handoff in Discussion if one exists; checkpoints, `Admin`, `Pillars` and `Resources`; the DONE frame at Project close and `ki-recap`'s single-session frame, which keep their block-letter glyphs until Kris redraws them.

## Requirements

- The frame is 52 code points wide on every framed line while the top border fits at that width with at least four `─` of fill; when the thread type and the form need more, every line of the frame widens equally and nothing is abbreviated.
- The top border reads `╭─ <thread type> `, then `─` fill, then `<form> <issued UTC, seconds> ─╮`, the thread type being `coordination` or `state-of-play` and the form `summary`, `recap`, `full summary` or `re-bootstrap`.
- The body is a blank line, the thread label centred with any odd space on the right, then a blank line, each padded with spaces to the frame; the label separator is ` - `.
- The bottom border reads `╰`, then `─` fill, then `mark <mark UTC, seconds> ─╯`.
- A blank line follows the frame. Beneath it is one Markdown list of `- [<state>] <what>` items: `- [at rest] nothing running or queued` first when nothing is running or queued, then `- [running] <agent> - <what>`, `- [queued] <agent> - <what>` and `- [waiting] <TAG>`, then the housekeeping items of the same kind, such as `- [committed] checkpoint and thread folder, pushed`, `- [blocked] <what>`, `- [held] <what> until <when>` and `- [parked] <count>`.
- The block-letter REST and BUSY bodies and the label-and-mark line go. The resume line stays in its own text block after the banner.

## Current state

Reopened on 2026-10-14 from baseline `0b3c05b5`, the first delivery, under Kris's `banner-refine` brief of the same day, to apply his 18:08 BST refinement on every surface the first delivery changed. The first delivery was closed the same day under the `banner-frame` brief, as received: "Open a Kris-requested deliver record at horizon now under `ki-work-roadmap`. Quote the drawing above in it, deliver it, and close it if it verifies."

## Steps

- [x] Rewrite the Banner section and every example in the `ki-pmo` standard; record the review in `sources.md`.
- [x] Redraw the frames in the `ki-coordinator` output style.
- [x] Rewrite `scripts/banner.test.ts` to assert the width, both borders, the body and the rest line.
- [x] Update the hook line, its tests, the hook README and the harness specification.
- [x] Update the PMO-6 rubric item and regenerate the rubric.
- [x] Refinement: put the report form in the top border, centre the label, add the blank line, turn the lines beneath into bracketed-state list items and set the widening rule, in the standard, the output style, the test, the hook with its tests and README, the PMO-6 item and regenerated rubric, the harness specification and the sources review.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `sources.md`, `rubric.md`
- `skills/change-management/ki-pmo/scripts/banner.test.ts`, `scripts/rubric/items/threads.ts`
- `output-styles/ki-coordinator.md`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`
- `docs/specs/harness.md`

## Verify

After the refinement: `bun run test` 1151 pass, 0 fail; `bunx tsc --noEmit` clean; `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` in sync; `bun test skills/change-management/ki-pmo/scripts/banner.test.ts hooks/coordinator-reminder.test.ts` 21 pass; `ki dev skill rubric ki-pmo` in sync; `ki repo audit --skill` for `ki-pmo`, `ki-delegation` and `ki-work-roadmap` pass, and `ki-skills` passes with its two pre-existing refresh-cadence warnings only.

## Dependencies / blocks

None. Built on `report-headings`, which shortened the owner-report sections to Done, In Progress and Queries on harness `main` before this record opened.

## Documentation impact

### Decision Records

None. The frame is a presentation rule in the `ki-pmo` standard, settled in Kris's drawing.

### Specifications

`docs/specs/harness.md` HARN-012 and HARN-013 now describe the frame's borders and body and what `scripts/banner.test.ts` asserts.

### Guides

The `ki-pmo` standard's Banner section and thread-type table, its SKILL.md and sources review, the regenerated rubric, the `ki-coordinator` output style and the hook README all describe the new frame. Checkpoints that render the banner pick it up at their next report under the refresh rule; none was edited.

### Roadmap

No follow-on record. The DONE frame question is raised in the owner report, not captured.

## Review

### Delivered

The live `ki-pmo` banner is one frame whose top border reads `╭─ <thread type>`, `─` fill, the report form, the issued time and `─╮`; whose body centres the label with any odd space on the right; and whose bottom border carries the mark. The frame is 52 code points wide while the top border fits with four `─` of fill and widens equally, never abbreviating, when the thread type and form need more. A blank line follows it, then one Markdown list of `- [<state>] <what>` items: `[at rest]` first when nothing runs or queues, then `[running]`, `[queued]` and `[waiting] <TAG>`, then the housekeeping items `[committed]`, `[uncommitted]`, `[unpushed]`, `[blocked]`, `[held]`, `[parked]`, `[recovered]` and `[unlogged]`. The resume line keeps its own text block. The DONE frame keeps its glyphs.

### Change Summary

- `references/standards-pmo.md`: the Banner section carries the form, width, centred body, gap and list rules with Kris's refinement quoted; the REST and BUSY examples are redrawn from his 18:08 drawing with the label centred; a widened `state-of-play` full-summary example is added; the thread-type table, the heading-state sentence, the red-x recovery item and the thread-folder item say list and item rather than line. `references/sources.md` records the eighth review; `SKILL.md` names the form, the centred label and the list.
- `scripts/banner.test.ts`: asserts the top border with its form and at least four fill, the width for every thread type and form pair, equal widening, the centred label with odd space right, the blank line after the frame, every item's bracketed state and order, the agent and tag item shapes, byte-identical examples in the output style, the DONE glyphs and the hook wording.
- `scripts/rubric/items/threads.ts`: PMO-6 describes the form, the centred label, the blank line and the bracketed-state list; `references/rubric.md` regenerated.
- `output-styles/ki-coordinator.md`: the Banner section rewritten with the same two examples and the list rule.
- `hooks/coordinator-reminder.sh`, its test and `hooks/README.md`: the reminder line names the form, the centred label, the widening, the blank line and the bracketed-state items.
- `docs/specs/harness.md`: HARN-012 and HARN-013 wording.

### Verification

As in Verify above: `bun run test` 1151 pass; `bunx tsc --noEmit` clean; the skill-graph check in sync; the banner and hook tests 21 pass; the rubric in sync; the `ki-pmo`, `ki-delegation` and `ki-work-roadmap` audits pass and `ki-skills` passes with its two pre-existing warnings.

### Outstanding concerns

- The housekeeping item states beyond Kris's `[blocked]` and `[held]` examples, namely `[committed]`, `[uncommitted]`, `[unpushed]`, `[parked]`, `[recovered]` and `[unlogged]`, are this delivery's choice, kept to a state word in the bracket; Kris may rename them.
- `- [waiting] <TAG>` carries the tag alone, as the refinement draws it, so the query title now lives only in the report's Queries section.
- The DONE frame at Project close and `ki-recap`'s single-session frame keep their block-letter glyphs; the refinement did not cover them.
- Checkpoints still carry labels with a colon as the separator; the banner renders them with ` - ` and no checkpoint was edited.

### Post-change review

The shape is held mechanically by `scripts/banner.test.ts`, including the width for every thread type and form pair, so a thread that widens unevenly or abbreviates fails the harness test. No skill frontmatter changed, so the catalogue and diagram stamps are untouched.

### Mini recap

The banner's top border names the report form, the label is centred, a blank line follows the frame and the lines beneath are bracketed-state list items; the frame widens equally when the border needs it; every surface that states the banner says the same.

## Discussion

### First delivery and acceptance

Closed 2026-10-14 under the `banner-frame` brief, in which Kris said "deliver it, and close it if it verifies". Verified at close: `bun run test` 1150 pass, `bunx tsc --noEmit` clean, the skill-graph check in sync, the hook and banner tests 20 pass, and the `ki-pmo`, `ki-delegation`, `ki-skills` and `ki-work-roadmap` audits pass.

Reopened the same day under the `banner-refine` brief for Kris's 18:08 BST refinement; the review packet above covers the refined result.

### Why the DONE frame keeps its glyphs

Kris's drawing covers the live banner, REST and BUSY, whose bodies go. The DONE frame renders once at Project close and shares its glyphs with `ki-recap`'s single-session frame, which this brief does not name, so it stays as it is until Kris redraws it or says the new frame covers it too.
