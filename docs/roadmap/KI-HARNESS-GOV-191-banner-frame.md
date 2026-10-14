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
updated_at: 2026-10-14T19:45:00Z
---

# Open Every ki-pmo Report With a Rich-Text Initiative › Project Heading and Close It With the Block-Letter Footer

## Goal

Every coordinating thread opens its owner reports with a rich-text heading, the Initiative and the Project linked to their local notes in one `#` heading, with a bold line beneath giving the form, the local time and the last mark, and closes them with the block-letter REST or BUSY footer banner as it stood before this record, with the bracketed-state list beneath it, so that the heading says where the thread sits, which report this is and when it spoke, and the footer says in large letters whether it is at rest. The box frame this record first drew is retired from both ends of the report.

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

### The frame moves to the heading

At 19:05 BST on 2026-10-14 Kris quoted the refined frame and placed it, as received: "This is for the heading, not the footer banner. The footer banner needs to be like it was before, with the large ascii text." The `frame-move` brief of the same day split the record's result in two: the framed label opens every Summary, recap, full summary and re-bootstrap report, in a `text` block, in place of the `# <label> · <form> at <local time>` heading line, with the plain context line from HEADING-FORM beneath it; the footer goes back to the block-letter BUSY and REST frames as harness revision `e60b4e45` carried them, with Kris's `- [<state>] <what>` list items beneath and no label-and-mark line, the resume line staying in its own block after it. The DONE frame and `ki-recap`'s frame stay as block letters. Where a saved report file needs an H1 for the Markdown lint, the single `# <label> · <form> at <local time>` line stays above the frame in the file only.

### The frame retires from the heading

At 19:13 BST on 2026-10-14 Kris asked for a plain heading instead, as received: "maybe you can just come up with something which is just a better heading that is the actual just normal text, so it can be rich text rather than fixed width text. So maybe you do not need to say project or initiative in front of it, you use the ways of working and you render it with a sensible label, and the initiative is before that, so it says knowledge islands model, which is linked. The next line says ways of working and then you have your headings, done, in progress, queries, and then you have your banner at the end. ... after the initiative and project headings at the start you could have one line which says summary at, whatever, and last mark at." He agreed the mock at 19:15 BST with "Actually, that is really good." and amended it with "Maybe we use a tripple HR element Before the main heading." and "And maybe then even a single HR alignment after the summary and last mark part." The `heading-rich` brief of the same day applied it: the box frame at the top of the report and the plain `Project · Initiative · <window> · <state>` line are both removed, and every Summary, recap, full summary and re-bootstrap report opens with three `---` rules, then `# [<Initiative>](<local Initiative note>) › [<Project>](<local Project note>)`, then `**<Form> at <local time> · last mark <local time>**`, then one `---`. The mock as agreed:

```markdown
# [Knowledge Islands model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md)

**Summary at 19:13 BST · last mark 14:54 BST**

## Done
```

## Boundary

- In scope: the Banner section of the `ki-pmo` standard and its examples; `scripts/banner.test.ts`; the coordinator reminder hook line, its tests and the hook README; the `ki-coordinator` output style; the PMO-6 rubric item and the regenerated rubric; `ki-delegation`'s Reporting section, RUN-4, authority footers and run-prompt skeleton, which carry the heading rule for every owner report; the harness specification's HARN-012 and HARN-013 wording; every banner example in skill sources, references and `docs/`.
- Out of scope: any `ki` command in `tools-ki` that prints the banner, which gets a handoff in Discussion if one exists; checkpoints, `Admin`, `Pillars` and `Resources`; the DONE frame at Project close and `ki-recap`'s single-session frame, which keep their block-letter glyphs until Kris redraws them.

## Requirements

- The report heading is rich Markdown, not a frame: three `---` rules with blank lines between them, then one `#` heading, the Initiative's display name linked to its local note, ` › `, and the Project's display name linked to its local note, the names as the notes' `title` gives them and not slugs; a Project with no Initiative gives the Project alone; the state-of-play thread writes the territory or Initiative it covers, linked, then `› State of play`.
- Beneath the heading, after a blank line, one bold line `**<Form> at <local time> · last mark <local time>**`, the form being `Summary`, `Recap`, `Full summary` or `Re-bootstrap`, both times local, written like `19:13 BST`; then a blank line, one `---`, and the sections, `## Decided` first in a full summary.
- A background agent's run report adds `› <run name>` to the heading and uses the form `Run report`.
- No box frame opens a report, no `Project · Initiative · <window> · <state>` line follows the heading, and the `# <label> · <form> at <local time>` heading of HEADING-FORM is replaced; a saved report file omits the three rules before the heading so it is not read as front matter. Checks accept the earlier heading forms in past reports.
- A blank line follows the frame. Beneath it is one Markdown list of `- [<state>] <what>` items: `- [at rest] nothing running or queued` first when nothing is running or queued, then `- [running] <agent> - <what>`, `- [queued] <agent> - <what>` and `- [waiting] <TAG>`, then the housekeeping items of the same kind, such as `- [committed] checkpoint and thread folder, pushed`, `- [blocked] <what>`, `- [held] <what> until <when>` and `- [parked] <count>`.
- The footer banner is the block-letter REST or BUSY frame exactly as revision `e60b4e45` carried it, `╭─ issued <UTC> ─…╮` above three fixed rows and the fixed bottom border; the `- [<state>] <what>` list follows its blank line; the label-and-mark line is not restored; the resume line stays in its own text block after the list. The DONE frame and `ki-recap`'s frame keep their block letters.

## Current state

Delivered a fourth time on 2026-10-14 under Kris's `heading-rich` brief, replacing the framed label at the top of the report with the rich-text heading on every surface `frame-move` touched, after his 19:13 BST request and 19:15 BST agreement. Reopened a second time the same day under his `frame-move` brief, to move the frame to the heading and restore the block-letter footer on every surface the earlier deliveries changed, after his 19:05 BST placing. First reopened the same day from baseline `0b3c05b5`, the first delivery, under his `banner-refine` brief, to apply his 18:08 BST refinement on every surface the first delivery changed. The first delivery was closed the same day under the `banner-frame` brief, as received: "Open a Kris-requested deliver record at horizon now under `ki-work-roadmap`. Quote the drawing above in it, deliver it, and close it if it verifies."

## Steps

- [x] Rewrite the Banner section and every example in the `ki-pmo` standard; record the review in `sources.md`.
- [x] Redraw the frames in the `ki-coordinator` output style.
- [x] Rewrite `scripts/banner.test.ts` to assert the width, both borders, the body and the rest line.
- [x] Update the hook line, its tests, the hook README and the harness specification.
- [x] Update the PMO-6 rubric item and regenerate the rubric.
- [x] Refinement: put the report form in the top border, centre the label, add the blank line, turn the lines beneath into bracketed-state list items and set the widening rule, in the standard, the output style, the test, the hook with its tests and README, the PMO-6 item and regenerated rubric, the harness specification and the sources review.
- [x] Rich heading: retire the box frame and the context line from the top of the report and open every report with the linked Initiative › Project heading and the form line, on every surface the frame move touched, plus `rules-prune.md` and `rules-release.md`, which still carried the one-line heading.
- [x] Frame move: make the framed label the heading frame with the context line beneath it and restore the block-letter REST and BUSY footer from `e60b4e45`, in the standard, its SKILL.md and sources, the output style, the test, the hook with its tests and README, PMO-6 and RUN-4 with both rubrics regenerated, `ki-delegation`'s Reporting section, authority footers and run-prompt skeleton, and HARN-012 and HARN-013.

## Files touched

- `skills/change-management/ki-pmo/SKILL.md`, `references/standards-pmo.md`, `references/sources.md`, `references/rubric.md`
- `skills/change-management/ki-pmo/scripts/banner.test.ts`, `scripts/rubric/items/threads.ts`
- `skills/governance/ki-delegation/references/standards-background-runs.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`, `assets/rules-none.md`, `assets/rules-push.md`, `assets/rules-prune.md`, `assets/rules-release.md`, `assets/run-prompt.md`
- `output-styles/ki-coordinator.md`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`
- `docs/specs/harness.md`

## Verify

After the rich heading: `bun run test` 1152 pass, 0 fail; `bunx tsc --noEmit` clean; the skill-graph check in sync; `bun test skills/change-management/ki-pmo/scripts/banner.test.ts hooks/coordinator-reminder.test.ts` 22 pass; both rubrics in sync; the `ki-pmo`, `ki-delegation` and `ki-work-roadmap` audits pass and `ki-skills` passes with its two standing refresh-cadence warnings.

After the refinement: `bun run test` 1151 pass, 0 fail; `bunx tsc --noEmit` clean; `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` in sync; `bun test skills/change-management/ki-pmo/scripts/banner.test.ts hooks/coordinator-reminder.test.ts` 21 pass; `ki dev skill rubric ki-pmo` in sync; `ki repo audit --skill` for `ki-pmo`, `ki-delegation` and `ki-work-roadmap` pass, and `ki-skills` passes with its two pre-existing refresh-cadence warnings only.

## Dependencies / blocks

None. Built on `report-headings`, which shortened the owner-report sections to Done, In Progress and Queries on harness `main` before this record opened.

## Documentation impact

### Decision Records

None. The frame is a presentation rule in the `ki-pmo` standard, settled in Kris's drawing.

### Specifications

`docs/specs/harness.md` HARN-012 and HARN-013 now describe the rich-text report heading, the block-letter footer and what `scripts/banner.test.ts` asserts of each.

### Guides

The `ki-pmo` standard's Banner section and thread-type table, its SKILL.md and sources review, the regenerated rubric, the `ki-coordinator` output style and the hook README all describe the rich-text heading and the block-letter footer. Checkpoints that render the banner pick it up at their next report under the refresh rule; none was edited.

### Roadmap

No follow-on record. The DONE frame question is raised in the owner report, not captured.

## Review

### Delivered

After the rich heading: every Summary, recap, full summary and re-bootstrap report opens with three `---` rules, the `#` heading `[<Initiative>](<note>) › [<Project>](<note>)`, the bold `<Form> at <local time> · last mark <local time>` line and one `---`; a run report adds `› <run name>` with the form `Run report`; the box frame and the `Project · Initiative · <window> · <state>` line are retired from the top of the report; the footer stays exactly as the frame move left it. Before that:

After the frame move: the framed label opens every Summary, recap, full summary and re-bootstrap report in its own `text` block with the context line beneath it, and the footer is the block-letter REST or BUSY frame of revision `e60b4e45` with the bracketed-state list beneath and no label-and-mark line, on every surface the earlier deliveries changed and in `ki-delegation`'s owner report, whose background-agent reports take the thread's two frames. Before the move:

The live `ki-pmo` banner is one frame whose top border reads `╭─ <thread type>`, `─` fill, the report form, the issued time and `─╮`; whose body centres the label with any odd space on the right; and whose bottom border carries the mark. The frame is 52 code points wide while the top border fits with four `─` of fill and widens equally, never abbreviating, when the thread type and form need more. A blank line follows it, then one Markdown list of `- [<state>] <what>` items: `[at rest]` first when nothing runs or queues, then `[running]`, `[queued]` and `[waiting] <TAG>`, then the housekeeping items `[committed]`, `[uncommitted]`, `[unpushed]`, `[blocked]`, `[held]`, `[parked]`, `[recovered]` and `[unlogged]`. The resume line keeps its own text block. The DONE frame keeps its glyphs.

### Change Summary

Rich heading:

- `references/standards-pmo.md`: the Banner section's heading half becomes the report heading, with its rules-before, heading, form line, rule-after and nothing-else rules, the Summary, state-of-play and run-report examples, and Kris's request, agreement and two amendments quoted; the thread-type table, practices, heading levels, resting point, report forms, full summary, re-bootstrap, recap and agent's-report paragraphs name the report heading; the footer's label-and-mark sentence points the mark at the form line.
- `scripts/banner.test.ts`: asserts the standard carries three frames, REST, BUSY and DONE, and no heading frame; the Summary heading example byte-identical in the standard and the output style; the state-of-play and run-report examples; the heading, state-of-play and form-line shapes; and the hook line's new wording.
- `scripts/rubric/items/threads.ts` and `ki-delegation`'s `background-runs.ts`: PMO-6 and RUN-4 describe the report heading; both rubrics regenerated.
- `ki-delegation`'s `standards-background-runs.md`: the Heading rule gives the rich-text heading with Kris's words, the run-report form and the saved-file rule; the four authority footers and the run-prompt skeleton say so, `rules-prune.md` and `rules-release.md` for the first time.
- `output-styles/ki-coordinator.md`, `hooks/coordinator-reminder.sh`, its test, `hooks/README.md`, `docs/specs/harness.md`: the report heading opens and the block-letter footer closes.

Frame move:

- `references/standards-pmo.md`: the Banner section splits into the heading frame, with its borders, width, body and context-line rules and the two framed examples, and the footer banner, with the restored REST and BUSY frames, the list rule and the DONE frame; the thread-type table, practices, heading levels, report forms, full summary, re-bootstrap and recap name the heading frame and the footer.
- `scripts/banner.test.ts`: asserts the heading frame with nothing beneath it, the footer's issued border, its three rows byte-identical to `e60b4e45` and its fixed bottom border, the output style's three frames equal to the standard's, and the hook line's new wording.
- `scripts/rubric/items/threads.ts` and `ki-delegation`'s `background-runs.ts`: PMO-6 and RUN-4 describe the heading frame above and the block-letter footer below; both rubrics regenerated.
- `ki-delegation`'s `standards-background-runs.md`: the Heading rule puts the frame above the context line, keeps the H1 for saved files only, and gives a background agent's report the frames of the thread it reports to; `rules-none.md`, `rules-push.md` and `run-prompt.md` say so.
- `output-styles/ki-coordinator.md`, `hooks/coordinator-reminder.sh`, its test, `hooks/README.md`, `docs/specs/harness.md`: the heading frame opens and the block-letter footer closes.

Before the move:

- `references/standards-pmo.md`: the Banner section carries the form, width, centred body, gap and list rules with Kris's refinement quoted; the REST and BUSY examples are redrawn from his 18:08 drawing with the label centred; a widened `state-of-play` full-summary example is added; the thread-type table, the heading-state sentence, the red-x recovery item and the thread-folder item say list and item rather than line. `references/sources.md` records the eighth review; `SKILL.md` names the form, the centred label and the list.
- `scripts/banner.test.ts`: asserts the top border with its form and at least four fill, the width for every thread type and form pair, equal widening, the centred label with odd space right, the blank line after the frame, every item's bracketed state and order, the agent and tag item shapes, byte-identical examples in the output style, the DONE glyphs and the hook wording.
- `scripts/rubric/items/threads.ts`: PMO-6 describes the form, the centred label, the blank line and the bracketed-state list; `references/rubric.md` regenerated.
- `output-styles/ki-coordinator.md`: the Banner section rewritten with the same two examples and the list rule.
- `hooks/coordinator-reminder.sh`, its test and `hooks/README.md`: the reminder line names the form, the centred label, the widening, the blank line and the bracketed-state items.
- `docs/specs/harness.md`: HARN-012 and HARN-013 wording.

### Verification

After the rich heading: `bun run test` 1152 pass, 0 fail; `bunx tsc --noEmit` clean; the skill-graph check in sync; `bun test skills/change-management/ki-pmo/scripts/banner.test.ts hooks/coordinator-reminder.test.ts` 22 pass; both rubrics in sync; the `ki-pmo`, `ki-delegation` and `ki-work-roadmap` audits pass and `ki-skills` passes with its two standing refresh-cadence warnings.

After the frame move: `bun run test` 1152 pass, 0 fail; `bunx tsc --noEmit` clean; the skill-graph check in sync; the banner and hook tests 22 pass; both rubrics in sync; the `ki-pmo`, `ki-delegation` and `ki-work-roadmap` audits pass and `ki-skills` passes with its two standing refresh-cadence warnings. Before the move:

As in Verify above: `bun run test` 1151 pass; `bunx tsc --noEmit` clean; the skill-graph check in sync; the banner and hook tests 21 pass; the rubric in sync; the `ki-pmo`, `ki-delegation` and `ki-work-roadmap` audits pass and `ki-skills` passes with its two pre-existing warnings.

### Outstanding concerns

- The housekeeping item states beyond Kris's `[blocked]` and `[held]` examples, namely `[committed]`, `[uncommitted]`, `[unpushed]`, `[parked]`, `[recovered]` and `[unlogged]`, are this delivery's choice, kept to a state word in the bracket; Kris may rename them.
- `- [waiting] <TAG>` carries the tag alone, as the refinement draws it, so the query title now lives only in the report's Queries section.
- The DONE frame at Project close and `ki-recap`'s single-session frame keep their block-letter glyphs, as the frame move confirms.
- Kris's two amendments, "a tripple HR element Before the main heading" and "a single HR alignment after the summary and last mark part", are read as three `---` rules with blank lines between them before the heading and one `---` after the form line; a saved report file omits the three because a leading `---` is read as front matter. Raised as `HR-SHAPE` in the owner report.
- A background agent's run report opens with the thread's heading plus `› <run name>` and the form `Run report`, as the `heading-rich` brief set; the mark it carries is the thread's, which the run packet or the checkpoint supplies.
- Checkpoints still carry labels with a colon as the separator; the banner renders them with ` - ` and no checkpoint was edited.

### Post-change review

The shape is held mechanically by `scripts/banner.test.ts`: the heading example byte-identical in the standard and the output style, the heading and form-line shapes, and the footer frames, so a surface that drifts fails the harness test. No skill frontmatter changed, so the catalogue and diagram stamps are untouched.

### Mini recap

The box frame has been retired from the heading: a report opens with the linked Initiative › Project heading and its form line, and closes with the block-letter REST or BUSY footer and the bracketed-state list, on every surface. Before that, the framed label was the heading frame and the block-letter REST and BUSY frames were back as the footer, with the context line under the one and the bracketed-state list under the other. The banner's top border names the report form, the label is centred, a blank line follows the frame and the lines beneath are bracketed-state list items; the frame widens equally when the border needs it; every surface that states the banner says the same.

## Discussion

### First delivery and acceptance

Closed 2026-10-14 under the `banner-frame` brief, in which Kris said "deliver it, and close it if it verifies". Verified at close: `bun run test` 1150 pass, `bunx tsc --noEmit` clean, the skill-graph check in sync, the hook and banner tests 20 pass, and the `ki-pmo`, `ki-delegation`, `ki-skills` and `ki-work-roadmap` audits pass.

Reopened the same day under the `banner-refine` brief for Kris's 18:08 BST refinement; the review packet above covers the refined result.

### Frame move

Reopened a second time on 2026-10-14 under the `frame-move` brief after Kris placed the frame at 19:05 BST: "This is for the heading, not the footer banner. The footer banner needs to be like it was before, with the large ascii text." The split is recorded in the Context, Requirements and Review above; the record stays at `awaiting-review` for Kris to accept the combined result.

### Rich heading

Delivered a fourth time on 2026-10-14 under the `heading-rich` brief after Kris asked at 19:13 BST for "a better heading that is the actual just normal text, so it can be rich text rather than fixed width text" and agreed the mock with "Actually, that is really good." The box frame is retired from the top of the report; the record stays at `awaiting-review` for Kris to accept the combined result.

### Why the DONE frame keeps its glyphs

Kris's drawing covers the live banner, REST and BUSY, whose bodies go. The DONE frame renders once at Project close and shares its glyphs with `ki-recap`'s single-session frame, which this brief does not name, so it stays as it is until Kris redraws it or says the new frame covers it too.
