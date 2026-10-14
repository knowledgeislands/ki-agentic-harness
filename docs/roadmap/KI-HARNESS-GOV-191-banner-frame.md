---
id: KI-HARNESS-GOV-191
area: GOV
title: banner frame
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 2208da994c2aff20aef749b242365de6a0e14a21
created_at: 2026-10-14T17:09:51Z
updated_at: 2026-10-14T17:40:00Z
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

Kris drew the top border's fill with ASCII hyphens by hand; the frame uses `─` so it matches the bottom border. This record was opened at Kris's request under the `banner-frame` brief of 2026-10-14, after `report-headings` landed on harness `main`.

## Boundary

- In scope: the Banner section of the `ki-pmo` standard and its examples; `scripts/banner.test.ts`; the coordinator reminder hook line, its tests and the hook README; the `ki-coordinator` output style; the PMO-6 rubric item and the regenerated rubric; the harness specification's HARN-012 and HARN-013 wording; every banner example in skill sources, references and `docs/`.
- Out of scope: any `ki` command in `tools-ki` that prints the banner, which gets a handoff in Discussion if one exists; checkpoints, `Admin`, `Pillars` and `Resources`; the DONE frame at Project close and `ki-recap`'s single-session frame, which keep their block-letter glyphs until Kris redraws them.

## Requirements

- The frame is 52 code points wide on every framed line.
- The top border reads `╭─ <thread type> `, then `─` fill, then `<issued UTC, seconds> ─╮`, the thread type being `coordination` or `state-of-play`.
- The body is a blank line, the thread label after one space, then a blank line, each padded with spaces to the frame; the label separator is ` - `.
- The bottom border reads `╰`, then `─` fill, then `mark <mark UTC, seconds> ─╯`.
- Beneath the frame, each line with three leading spaces: one line per running, queued or waiting item with its prefix, then the housekeeping line. When nothing is running or queued the first line reads `at rest: nothing running or queued`, followed by any waiting lines.
- The block-letter REST and BUSY bodies and the label-and-mark line go. The resume line stays in its own text block after the banner.

## Current state

Delivered and closed on 2026-10-14 from baseline `2208da99`, under Kris's brief of the same day, as received: "Open a Kris-requested deliver record at horizon now under `ki-work-roadmap`. Quote the drawing above in it, deliver it, and close it if it verifies." The standard, the output style, the test, the hook line with its tests and README, the PMO-6 item and regenerated rubric, and the harness specification carry the new frame; `tools-ki` prints no banner, so no handoff was needed.

## Steps

- [x] Rewrite the Banner section and every example in the `ki-pmo` standard; record the review in `sources.md`.
- [x] Redraw the frames in the `ki-coordinator` output style.
- [x] Rewrite `scripts/banner.test.ts` to assert the width, both borders, the body and the rest line.
- [x] Update the hook line, its tests, the hook README and the harness specification.
- [x] Update the PMO-6 rubric item and regenerate the rubric.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `sources.md`, `rubric.md`
- `skills/change-management/ki-pmo/scripts/banner.test.ts`, `scripts/rubric/items/threads.ts`
- `output-styles/ki-coordinator.md`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`
- `docs/specs/harness.md`

## Verify

`bun run test` 1150 pass, 0 fail; `bunx tsc --noEmit` clean; `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` in sync; `bun test skills/change-management/ki-pmo/scripts/banner.test.ts hooks/coordinator-reminder.test.ts` 20 pass; `ki repo audit --skill` for `ki-pmo`, `ki-delegation` and `ki-work-roadmap` pass, and `ki-skills` passes with its two pre-existing refresh-cadence warnings only.

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

The live `ki-pmo` banner is now one 52-column frame: `╭─ <thread type>`, a space, `─` fill, a space and `<issued UTC> ─╮` above; a blank line, the label after one space with ` - ` as its separator, and a blank line within; `╰`, `─` fill, a space and `mark <mark UTC> ─╯` below. Beneath it, a thread at rest says `at rest: nothing running or queued` first, then any waiting lines; a busy thread lists each running, queued and waiting item on its own line; the housekeeping line closes, and the resume line keeps its own text block. The block-letter REST and BUSY bodies and the label-and-mark line are gone; the DONE frame keeps its glyphs.

### Change Summary

- `references/standards-pmo.md`: the Banner section rewritten with the border, body and rest-line rules, the REST and BUSY examples redrawn from Kris's drawing, a state-of-play top border shown, the thread-type table row and the heading-state sentence updated; `references/sources.md` records the review; `SKILL.md` names the frame and what the test asserts.
- `scripts/banner.test.ts`: asserts 52 code points, the top border with thread type and issued time, the blank and label body lines, the bottom border with the mark, the rest line first beneath REST and absent beneath BUSY, the per-item lines, byte-identical examples in the output style, the DONE glyphs shared with `ki-recap`, the resume line and the hook wording.
- `scripts/rubric/items/threads.ts`: PMO-6 describes the frame's borders, body and rest line; `references/rubric.md` regenerated.
- `output-styles/ki-coordinator.md`: the Banner section redrawn with the same two examples.
- `hooks/coordinator-reminder.sh`, its test and `hooks/README.md`: the reminder line names the borders, the body, the per-item lines and the rest line.
- `docs/specs/harness.md`: HARN-012 and HARN-013 wording.

### Verification

`bun run test` 1150 pass, 0 fail; `bunx tsc --noEmit` clean; the skill-graph check in sync; `bun test skills/change-management/ki-pmo/scripts/banner.test.ts hooks/coordinator-reminder.test.ts` 20 pass; `ki repo audit --skill` for `ki-pmo`, `ki-delegation` and `ki-work-roadmap` pass, and `ki-skills` passes with its two pre-existing refresh-cadence warnings only.

### Outstanding concerns

- The DONE frame at Project close and `ki-recap`'s single-session frame keep their block-letter glyphs; Kris's drawing did not cover them.
- A label longer than 48 code points cannot fit the body line; every current label is far shorter.
- Checkpoints still carry labels with a colon as the separator; the banner renders them with ` - ` and no checkpoint was edited.

### Post-change review

The shape is held mechanically by `scripts/banner.test.ts` rather than by prose, so a thread that drifts after a re-bootstrap fails the harness test rather than Kris's eye. No skill frontmatter changed, so the catalogue and diagram stamps are untouched.

### Mini recap

The banner is one framed label with the thread type and issued time above and the mark below; the rest line replaced the block words; every surface that states the banner says the same.

## Done

Closed 2026-10-14 under the `banner-frame` brief, in which Kris said "deliver it, and close it if it verifies". Verified at close: `bun run test` 1150 pass, `bunx tsc --noEmit` clean, the skill-graph check in sync, the hook and banner tests 20 pass, and the `ki-pmo`, `ki-delegation`, `ki-skills` and `ki-work-roadmap` audits pass.

## Discussion

### Why the DONE frame keeps its glyphs

Kris's drawing covers the live banner, REST and BUSY, whose bodies go. The DONE frame renders once at Project close and shares its glyphs with `ki-recap`'s single-session frame, which this brief does not name, so it stays as it is until Kris redraws it or says the new frame covers it too.
