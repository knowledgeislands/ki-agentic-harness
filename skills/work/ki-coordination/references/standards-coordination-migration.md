# Coordinating-work migration

This file holds temporary adjustments to [the coordinating-work standard](standards-coordination.md), which describes only the final state, under MIGRATION-OVERLAY. Read the standard first; it wins wherever the two differ. Delete each adjustment once its condition is met, and the file whole once it is empty, with no edit to the standard.

## Contents

- [Thread model](#thread-model)
- [Queries file in the DISCUSSIONS tolerance window](#queries-file-in-the-discussions-tolerance-window)
- [Old-shape checkpoint states](#old-shape-checkpoint-states)
- [Banners in past reports](#banners-in-past-reports)
- [Rubric tolerance for old work-folder shapes](#rubric-tolerance-for-old-work-folder-shapes)
- [Done, Failed and Needs owner report shape](#done-failed-and-needs-owner-report-shape)
- [Pre-14-October owner reports](#pre-14-october-owner-reports)
- [Single-paragraph queries before 26 October](#single-paragraph-queries-before-26-october)
- [COORD-11 confidence cutover](#coord-11-confidence-cutover)
- [Handoffs outstanding until done](#handoffs-outstanding-until-done)
- [Pre-18-October reply blocks](#pre-18-october-reply-blocks)
- [COORD-7 and thread folders](#coord-7-and-thread-folders)
- [Older summary words](#older-summary-words)
- [Pre-SUMMARY-MODEL summaries](#pre-summary-model-summaries)
- [Older mode and sync lines](#older-mode-and-sync-lines)
- [Thread-model re-bootstrap openers](#thread-model-re-bootstrap-openers)
- [Legacy records at bootstrap](#legacy-records-at-bootstrap)
- [Old-shape pick-up blocks](#old-shape-pick-up-blocks)
- [Old-shape checkpoint types](#old-shape-checkpoint-types)
- [Old-shape checkpoint ids](#old-shape-checkpoint-ids)
- [Legacy work ids](#legacy-work-ids)
- [Labels without ids](#labels-without-ids)
- [Snoozing hold reason until `ki` accepts `snoozing`](#snoozing-hold-reason-until-ki-accepts-snoozing)
- [Hold commits from before Snoozing](#hold-commits-from-before-snoozing)
- [Single-file work package shapes](#single-file-work-package-shapes)
- [Old thread run folders](#old-thread-run-folders)
- [Pre-focus and numbered decisions-log entries](#pre-focus-and-numbered-decisions-log-entries)
- [The earlier design-note home](#the-earlier-design-note-home)
- [Design notes named `.design.md`](#design-notes-named-designmd)
- [Observatory feedback packages](#observatory-feedback-packages)
- [Openers that name the re-bootstrap report](#openers-that-name-the-re-bootstrap-report)

## Thread model

The model replaced the thread model of 13 to 17 October. Kris agreed it on 18 October and launched its migration the same day; the harness half is [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agent-backpack/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md). The old words map to the new:

| Thread model | Work model |
| --- | --- |
| state-of-play thread, `_state-of-play.md`, id `<territory>.sop` | territory work, `+/_WORK/<territory>/_index.md`, id `<territory>` |
| coordination thread, `<initiative>.<project>.md`, id `<territory>.<initiative>.<project>` | Project work, `+/_WORK/<territory>.<project>/_index.md`, id `<territory>.<project>` |
| conversational thread with a checkpoint | ad hoc work, `+/_WORK/<territory>.regular.<slug>/`, under regular work |
| recurring work homed in an Initiative | regular work, `<territory>.regular`, self-coordinating |
| Initiative, `Streams/Initiatives/`, `initiative:` | theme, `Streams/Themes/<theme>.md`, an optional `theme:` |
| thread folder `+/_THREADS/<run>/` | the work folder `+/_WORK/<id>/` |
| checkpoint, pick-up block, moves | the work package: `_index.md` for the definition, `state.md` for the state; Git as the logbook |
| REST, BUSY, HOLD and DONE frames; resume line | the glyph banner and its closing thread line |
| the copyable stacked reply block | none; the owner answers in speech |
| hold | On hold, paused or snoozing |
| `+/_DESIGN/<subject>/`, `Streams/**/design/` | `+/_WORK/<id>/design/` |

**The tolerance window.** Until every territory has moved, which phase 5 of the migration closes, the checkers and every reader accept both shapes: a `+/_CHECKPOINTS/` checkpoint, a `+/_THREADS/<run>/` folder, `Streams/Initiatives/` and an `initiative:` key are read as before, each with a warning that names its new home, and the new shape passes without one. The `Streams/Initiatives/` and `initiative:` warnings become failures on 7 November 2026, or earlier once a scan finds no residue, as Kris chose THEME-CLOSE's dated cutover on 25 October 2026; the checker messages name the date. A session working old-shape work keeps to this standard through the mapping above; it moves its own files only when its territory's migration moves them. A report written before 18 October keeps its block-letter frame and reply block, and anything that reads past reports accepts both.

## Queries file in the DISCUSSIONS tolerance window

A work package also holds `queries.md` beside `discussions.md`, `messages.md` and `decisions.md` for the DISCUSSIONS tolerance window. This adjusts the package files [Scope](standards-coordination.md#scope) lists. Delete it once the DISCUSSIONS tolerance window closes.

## Old-shape checkpoint states

An old-shape checkpoint's REST reads as Handoff to supervisor or With supervisor, BUSY as With worker, HOLD as On hold, paused, and DONE as Finished. This adjusts the states a coordinator keeps under [States and moves](standards-coordination.md#states-and-moves).

## Banners in past reports

These adjust how a reader takes the banner of a past report under [Banner](standards-coordination.md#banner):

- The block-letter frames retired with the model; a report written before 18 October keeps its frame, a report written before GLYPH-OWNER keeps 🧑 for Kris and 👤 for a target, and anything that reads past reports accepts every one of these.
- A report written before FOOTER-LAYOUT keeps its bracketed heading, such as `🤖 With worker (draining → ⏸️ On hold)`, and anything that reads past reports accepts it.
- A report written before SNOOZE, on 6 November 2026, may read `⏸️ On hold · more expected` or a banner heading ending `· since <time>`, and anything that reads past reports accepts them.
- A report written before BANNER-TRIM keeps its `[handoff]`, `[committed]`, `[uncommitted]`, `[recovered]`, `[unlogged]` and `[behind]` items, and anything that reads past reports accepts them.

## Rubric tolerance for old work-folder shapes

For the tolerance window the `ki-coordination` native rubric reads `+/_CHECKPOINTS/` and `+/_THREADS/` as before and warns on each, naming its new home, and warns on a theme that resolves only in `Streams/Initiatives/` until 7 November 2026 and fails it from that day. This adjusts the checks under [Mechanical boundary](standards-coordination.md#mechanical-boundary). Delete it once the tolerance window closes.

## Done, Failed and Needs owner report shape

The [owner report](standards-reporting.md#owner-report) replaces the Done / Failed / Needs \<owner\> report wherever that shape was set. Delete this adjustment once no source sets that shape.

## Pre-14-October owner reports

A report written before 2026-10-14 keeps its earlier heading, and anything that reads past reports accepts it. Before 2026-10-14 a query carried **Summary**, **Need from you** and **Recommendation**; a report written before that day keeps that shape, and anything that reads past reports accepts both. Both adjust the **Heading** and **Queries** parts of the [owner report](standards-reporting.md#owner-report).

## Single-paragraph queries before 26 October

A query in a report written before 26 October 2026, when Kris chose FORM-VS-RUMDL a), keeps its single-paragraph shape, and anything that reads past reports accepts both. This adjusts the **Queries** part of the [owner report](standards-reporting.md#owner-report).

## COORD-11 confidence cutover

The rubric's COORD-11 warning on a recommended option without `, confidence high|medium|low - <reason>)` applies only in reports issued on or after 2026-10-18. This adjusts the **Queries** part of the [owner report](standards-reporting.md#owner-report).

## Handoffs outstanding until done

The windowed Summary replaces the earlier rule that a handoff stayed outstanding until the owner said it was done. This adjusts the **In Progress** part of the [owner report](standards-reporting.md#owner-report).

## Pre-18-October reply blocks

A report written before 18 October keeps its reply block, and anything that reads past reports accepts it. This adjusts [Answers](standards-reporting.md#answers).

## COORD-7 and thread folders

The rubric's COORD-7 also checks the reports under `+/_THREADS/<run>/` for [the tolerance window](#thread-model). This adjusts [Linking records](standards-reporting.md#linking-records); delete it when the tolerance window closes.

## Older summary words

For the tolerance window the older words stay readable: `recap` is read as `summary`, `recap and mark` as `mark`, and `full summary` or `summary in full` as a `summary since` the work's `created_at`. This adjusts the verbs under [Report forms](standards-report-forms.md#report-forms); delete it when [the tolerance window](#thread-model) closes.

## Pre-SUMMARY-MODEL summaries

A report written before SUMMARY-MODEL keeps its Summary, recap or full summary shape, its `## Decided` section and its `Out of scope`, `Waiting on you` and `What I heard` parts, and anything that reads past reports accepts them. This adjusts [The Summary](standards-report-forms.md#the-summary).

In the report heading's form line, a report written before SUMMARY-MODEL, on 4 November 2026, may read `Recap` or `Full summary`, and one written before REPORT-FORMS-TIDY, on 6 November 2026, a Summary's `· last mark <local time>`; anything that reads past reports accepts them. This adjusts the **Form line** under [Banner detail](standards-report-forms.md#banner-detail).

## Older mode and sync lines

These adjust the **Mode lines** under [Banner detail](standards-report-forms.md#banner-detail):

- A report written between REPORT-FORMS-TIDY and SNOOZE, both on 6 November 2026, may carry `👂 listening · a message releases the hold`, and anything that reads past reports accepts it.
- A report written before SYNC-LINE-OFF may carry a `🔄 syncing for <host>` or `🔄 not syncing for <host>` line, and anything that reads past reports accepts it.
- A report written before FOOTER-LAYOUT keeps its one listening line, such as `👂 listening · not the sync thread for terra`, and one written before FOOTER-NOT-LISTENING may carry a `🔇` line on a thread that never listened; anything that reads past reports accepts both.

## Thread-model re-bootstrap openers

Adjusts [Bootstrap](standards-bootstrap.md#bootstrap). Beside the one-line `Re-bootstrap as <id> under ki-coordination.` opener, the thread-model openers, `Re-bootstrap as the <project> coordination thread under ki-coordination.` and `... as the state-of-play thread ...`, are accepted for the tolerance window and mean the same work. Delete when the [tolerance window](#thread-model) closes.

## Legacy records at bootstrap

Adjusts [Bootstrap](standards-bootstrap.md#bootstrap), step 3. Where a work has not yet moved to a work package, the coordinator reads its tolerated legacy record in place of the package's five files, `messages.md` first. Delete when the [tolerance window](#thread-model) closes.

## Old-shape pick-up blocks

Adjusts [Picking work up](standards-bootstrap.md#picking-work-up). An old-shape checkpoint keeps its pick-up block, read as the state table in Picking work up through the mapping in [The work model](standards-coordination.md#the-work-model), until its territory's migration moves it. Delete once every territory's migration has moved its checkpoints.

## Old-shape checkpoint types

Adjusts [Levels and forms](standards-opening.md#levels-and-forms). A checkpoint in the old shape declares its type in `role` until it moves: `state-of-play` for territory work, `coordination` for Project work, and `conversational` or no field otherwise. Delete once every old-shape checkpoint has moved.

## Old-shape checkpoint ids

Adjusts [Work naming](standards-opening.md#work-naming). An old-shape checkpoint's id is read from its stem until it moves: `_state-of-play` gives `<territory>`, `<initiative>.<project>` gives `<territory>.prj.<project>`, and any other stem gives `<territory>.regular.<stem>`. Delete once every old-shape checkpoint has moved.

## Legacy work ids

Adjusts [Levels and forms](standards-opening.md#levels-and-forms) and [Work naming](standards-opening.md#work-naming). A second id segment `regular`, the legacy form of `reg`, is regular or ad hoc work. Legacy `<territory>`, `<territory>.<project>`, `<territory>.regular`, `<territory>.regular.main` and `<territory>.regular.<topic>` remain readable indefinitely, including existing HNR inputs. This naming transition changes no work level, state, mark, immutable native/run identity or history. Derive old/new resolution from actual valid definitions; two physical definitions for one work are ambiguous, never two independently opened packages. The text sets no deletion condition: the legacy ids are readable indefinitely.

## Labels without ids

Adjusts [Work naming](standards-opening.md#work-naming), the work name. The label alone, without the id, stays readable as the same work on message lines and openers written before 25 October 2026, through the tolerance window. Delete when the [tolerance window](#thread-model) closes.

## Snoozing hold reason until `ki` accepts `snoozing`

A Snoozing hold's `state.md` front matter sets `hold.reason: more-expected`, the value `ki` reads until it accepts `snoozing`. Delete this adjustment once `ki` accepts `snoozing`. It adjusts the **Parking** item of [Putting work on hold](standards-holds.md#putting-work-on-hold).

## Hold commits from before Snoozing

A hold committed before SNOOZE may read `hold, more expected` in its commit subject, in place of `docs(work): <id> hold, snoozing`. It adjusts the **Parking** item of [Putting work on hold](standards-holds.md#putting-work-on-hold).

## Single-file work package shapes

These tolerances keep work that has not yet moved to the five-file work package readable. Each is deleted once no work remains in the single-file shape.

- **Pruning reports:** In the single-file tolerance shape, retain the report until its queries are answered and read back in the log, under `ki-work-package` [Tidying the work folder](../../ki-work-package/references/standard-work-package.md#410-the-tidy). Adjusts the Judgement item of [Pruning the work folder](standards-mark.md#pruning-the-work-folder).
- **Message queue:** Work still in the single-file shape keeps its `## Messages` section, and an old-shape checkpoint its bold-line messages block, until it moves. Adjusts Place and shape in [Messages between work](standards-messages.md#messages-between-work).
- **Work status:** `ki work status` reads every single-file work file, as well as every work package, for the tolerance window. Adjusts the Work status row in [Surfaces](standards-messages.md#surfaces).

## Old thread run folders

A `+/_THREADS/<run>/` folder is checked against its old closed list, `decisions.md` and `<name>.report.md`, for the tolerance window. Adjusts the Flagging item of [Pruning the work folder](standards-mark.md#pruning-the-work-folder).

## Pre-focus and numbered decisions-log entries

A decisions-log entry written before the work declared focus areas carries no `focus:` opener. A log written before the work model keeps its numbers as history. Adjusts [Decisions log](standards-decisions.md#decisions-log).

## The earlier design-note home

The earlier `+/_DESIGN/<subject-slug>/` home for design notes is read for the tolerance window and moves with its territory's migration. Adjusts [Change documents](standards-decisions.md#change-documents).

## Design notes named `.design.md`

An existing `.design.md` design note stays readable as a change document during the rollout and is not renamed; a new one is written as `<slug>.change.md` with its `Base:` and `Touches:` header. Delete this section once no `.design.md` file remains. Adjusts [Change documents](standards-decisions.md#change-documents).

## Observatory feedback packages

The owner's consolidated Observatory feedback package, `feedback/<date>-<slug>.md`, written into the folder of the work that produced the document with one `messages.md` line linking it, committed together under the `ki-work-package` [entry points](../../ki-work-package/references/standard-work-package.md#49-writers), is accepted for the tolerance window. Adjusts the Sender item of [Messages between work](standards-messages.md#messages-between-work).

## Openers that name the re-bootstrap report

An opener whose first step says to give "the full re-bootstrap report", as the openers under [Opening work](standards-opening.md#opening-work) still print them, asks for the Bootstrap, and a past report headed `Re-bootstrap`, `Hold report` or `Finish report`, or carrying a state in its form line, stays readable as the Bootstrap or Stop it was. Delete this adjustment once the openers here name the Bootstrap. It adjusts trigger T2 in [Triggers](standards-report-forms.md#triggers).
