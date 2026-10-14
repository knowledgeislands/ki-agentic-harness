---
id: KI-HARNESS-GOV-191
area: GOV
title: banner frame
project: ways-of-working
component: governance
kind: deliver
purpose: governance
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 2208da994c2aff20aef749b242365de6a0e14a21
created_at: 2026-10-14T17:09:51Z
updated_at: 2026-10-14T17:09:51Z
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

In progress on 2026-10-14 from baseline `2208da99`.

## Steps

- [ ] Rewrite the Banner section and every example in the `ki-pmo` standard; record the review in `sources.md`.
- [ ] Redraw the frames in the `ki-coordinator` output style.
- [ ] Rewrite `scripts/banner.test.ts` to assert the width, both borders, the body and the rest line.
- [ ] Update the hook line, its tests, the hook README and the harness specification.
- [ ] Update the PMO-6 rubric item and regenerate the rubric.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `sources.md`, `rubric.md`
- `skills/change-management/ki-pmo/scripts/banner.test.ts`, `scripts/rubric/items/threads.ts`
- `output-styles/ki-coordinator.md`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`
- `docs/specs/harness.md`

## Discussion

### Why the DONE frame keeps its glyphs

Kris's drawing covers the live banner, REST and BUSY, whose bodies go. The DONE frame renders once at Project close and shares its glyphs with `ki-recap`'s single-session frame, which this brief does not name, so it stays as it is until Kris redraws it or says the new frame covers it too.
