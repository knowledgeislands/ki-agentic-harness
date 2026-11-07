---
name: ki-coordination
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-delegation, ki-work-package]
ki-shared-dependencies: [ki-skills:rubric, ki-work-roadmap:work-identifiers]
contributes: ['.ki.toml']
description: >
  Govern coordinating work under the Knowledge Islands work model: the responsive coordinator and its turn budget, the
  work levels and forms with their ids, openers and bootstrap, the seven states and the receive words, the mark and the one
  Summary with its status table and footer, the report heading, the closing glyph banner and thread line, On hold with its hold
  report, the work package and its message queue, route receipt and the inbox check, re-anchoring after compaction, decision classes and their life cycle,
  design notes, Finished, the working rules, and the three reply forms every session uses. Use while coordinating
  any explicitly opened work package to give a summary or banner or strike the mark, or to decide how any
  session replies; `ki-delegation` owns the background runs the coordinator launches.
argument-hint: 'audit <repo> | conform <repo> | drain | educate <repo> | help | hold | mark [only | status only] [no art] | receive | refresh | resume | send | status [no art] | summary [since <time>] [no art]'
---

# Knowledge Islands coordinating work

`ki-coordination` governs coordinating work, the work a worker holds for its supervisor while runs of its own carry the parts: it owns how a session coordinating a valid package of any level behaves with the owner, reports and keeps itself current, under the work model that [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) decides and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes. Read [the coordinating-work standard](references/standards-coordination.md) before opening, bootstrapping or coordinating work. It opens with the work model, then the responsive coordinator in Kris's words and the three rules that follow from it: the coordinator never does substantive work itself, every unit of work goes to a detached background agent, and an owner message never pre-empts work in flight.

The standard is one core and its purpose files. [The core](references/standards-coordination.md) holds what every coordinating turn needs and lists each purpose file with what it holds: [reporting](references/standards-reporting.md), [report forms and banner](references/standards-report-forms.md), [queries](references/standards-queries.md), [holds](references/standards-holds.md), [unattended windows](references/standards-unattended.md), [listening and host sync](references/standards-listening.md), [territory work](references/standards-territory.md), [opening and naming](references/standards-opening.md), [bootstrap and re-anchoring](references/standards-bootstrap.md), [messages and surfaces](references/standards-messages.md), [decisions and design notes](references/standards-decisions.md), [mark, tidy and finishing](references/standards-mark.md) and [sync](references/standards-sync.md). [The migration file](references/standards-coordination-migration.md) holds temporary adjustments, among them the old-to-new thread mapping and its tolerance window, and is deleted once empty.

The standard holds coordinator responsiveness with the counted turn budget and self-check and the heartbeat that runs only while work lies with a worker and wakes the thread only when a run finishes, the inbox watch that listens only when the owner asks the thread to, or for a Rig host sync thread by its role, and not while draining or on hold, and wakes only on news, the two thread capabilities, listening, which also tends the thread's own work package at its wakes, and host sync, a host sync pass repeating until the Mac and GitHub are clean and level, and the keep-awake an unattended window adds; the levels and forms and work naming, with two-part ids that carry no theme, titles that keep it as display text and the work name, the label with the id in brackets, used wherever a session names a piece of work; the states and moves; the rich-text report heading with its glyph form line and the closing glyph banner with its counts and holder list, its listening line, the closing thread line in every state, which every coordinator renders the same way; re-anchoring after compaction, the surfaces rule and red-x recovery; the report forms and the one Summary, with its status table and footer; territory work, with its main State of play and any secondary States of play under it, Project work, opening work with its openers, which `ki agent prompts <territory>` lists for the owner, bootstrap, the message queue between work with its important flag, route receipt and the inbox check at each wake; decisions and design with the four decision classes, the decisions life cycle at each mark, design notes in the work folder and Finishing Project work; and the working rules: the mark, parking tangents, linking records, committing and pruning the work folder, closing out Orca workers, putting work on hold with its hold report, picking work up from its work package, work awaiting review in `+/_WORK_REVIEW/`, pushing beneath other sessions, keeping primary checkouts current, refreshing this guidance through `method_read` and State of play's stewardship of continual improvement. It is the one source of the three [reply forms](references/standards-reporting.md#reply-forms), conversational reply, completed-work report and coordinator summary, with what counts as a unit of work, and of the [owner report](references/standards-reporting.md#owner-report), its spoken [answers](references/standards-reporting.md#answers) and its Needs tags, which every completed-work report takes, and of the [generated surfaces](references/standards-coordination.md#generated-surfaces) that carry it: the coordinator hook's line, the ki-coordinator output style, the run-prompt Report paragraph, each authority footer's report rule and the review-independence line of the run-prompt skeleton and the `ki-work-design` brief template, rendered by `ki dev skill generate ki-coordination`.

[The generated rubric](references/rubric.md) carries the mechanical and judgment criteria, and [the sources](references/sources.md) the decision register, which holds the owner decisions behind each rule, and the refresh review.

A repository that runs coordinating work declares `[skills.ki-coordination]` in `.ki.toml` and, under its dependencies, `ki-delegation` and `ki-work-package`. The declaration enables the harness `hooks/coordinator-reminder/coordinator-reminder.sh` conditional pointer, the `hooks/coordinator-footer/coordinator-footer.sh` footer check on an owner's mark or state word, and the ki-coordinator output-style binding; it proves checkout capability, never session selection or role. Removing it disables those surfaces. Full session-sensitive hook detection remains deferred, and the coordinator performs its own method revision check.

It does not launch, brief, monitor or report for background agents, which `ki-delegation` owns; it does not define the work package or its files, which `ki-work-package` owns; and it does not summarise a single ordinary session, which `ki-recap` owns and which keeps the ordinary session recap only.

The [deferred host-move design notes](references/sources.md#deferred-host-move-evidence) retain unresolved queue, host-bound-run and historical handover questions without granting implementation authority.

The [assigned-package cascade](references/standards-territory.md#coordinating-assigned-packages) covers explicit stewardship and handover, one package per turn, one territory Summary with work-qualified queries, per-package marks and the main `covers` register. STEWARD-FIELD remains a placeholder and creates no field. Where a package of the territory has no active session, its State of play [acts for it](references/standards-territory.md#territory-work) on its messages alone, receiving, ACKing, routing and answering them without taking its work forward or transferring stewardship.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the operational **DRAIN · HOLD · MARK · RECEIVE · RESUME · SEND · SUMMARY** modes a coordinator gives the owner.

Invoked as `help` / `-h` / `?`, it explains this boundary and stops.

### Mode AUDIT

Run `ki repo audit --skill ki-coordination --repo <repo>`.

The native rubric checks that a Capital, and only a Capital, holds its territory work, its main titled `<Territory> > SoP` and each secondary `<Territory> > SoP (<name>)`; that each piece of Project work names a Project that resolves in the registry, that its title ends in that Project's title and that any theme resolves; that each work file's level agrees with its id, reading state from `state.md` where the work package has one; that the active Project work is within the cap; that every full record identifier in a report under `+/_WORK/` is a link to an existing file, with a pruned record linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision; that recommended options carry their confidence; that each work folder holds only its closed list, the five package files among it; and warns on more than eight open queries in `discussions.md`, or `queries.md` for the tolerance window. For the tolerance window it reads `+/_CHECKPOINTS/` and `+/_THREADS/` as before, warning on each, and accepts `+/_WORK_REVIEW/` as a holding area. It then reviews coordinator responsiveness, the report forms, the mark and the refresh rule from the transcripts, reports and work files the owner selects.

### Mode CONFORM

Run `ki repo conform --skill ki-coordination --repo <repo> --dry-run` before applying it.

CONFORM republishes the generated rubric only. It never creates, renames or edits a work package, opens or finishes work, strikes the mark or writes a decision.

### Mode EDUCATE

Run `ki repo educate --skill ki-coordination --repo <repo>` to render the concern and rubric. Explain the responsive coordinator, the openers, the bootstrap and the report forms from [the standard](references/standards-coordination.md); do not create a declaration or a work file merely to demonstrate them.

### Mode DRAIN

While coordinating, `/ki-coordination drain` stops new launches while the work stays With worker, receives running work and reports `DRAINED` or `NOT DRAINED` in its Summary, under [Putting work on hold](references/standards-holds.md#putting-work-on-hold). It does not put the work on hold.

### Mode HELP

Explain the work levels and forms, the coordinator and its three rules, territory work and Project work with their openers and bootstrap, the seven states and the receive words, the report forms, the closing glyph banner and its thread line, re-anchoring after compaction, the decision classes and their life cycle and Finishing Project work, and the mark, the ki-coordinator output style and the reminder hook, and the off-ramps: the Work Process note for the model itself, background runs and the run report in `ki-delegation`, the work package in `ki-work-package`, single-session recaps in `ki-recap`, the coordination model purpose in `ki-tokenomics` and the theme and Project registry in `ki-work`.

### Mode HOLD

While coordinating, `/ki-coordination hold` drains and puts the work On hold under [Putting work on hold](references/standards-holds.md#putting-work-on-hold), ending with its hold report.

### Mode MARK

While coordinating, `/ki-coordination mark` strikes [the mark](references/standards-mark.md#the-mark), which is only a timestamp, the default start of the next Summary: it writes `mark: <UTC timestamp>` into the state file's front matter, `state.md`, works the decisions life cycle, prunes the work folder, keeps every open Needs-tagged query, commits the work folder and then gives, in the same reply, [the Summary](references/standards-report-forms.md#the-summary) since the previous mark. `/ki-coordination mark only` strikes it with no Summary, and `/ki-coordination mark, status only` strikes it and gives the Status, the Summary without its history. Only the owner's instruction, or a hold, moves the mark, and a hold's mark is followed by its hold report instead. `no art` leaves the art out of the Summary's footer.

### Mode RECEIVE

While coordinating, `/ki-coordination receive` records the owner's receive under [States and moves](references/standards-coordination.md#states-and-moves), as `with me` does.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill under `ki-agentic-harness`.

When invoked from an installed copy, stop and redirect to the harness.

Read [the sources](references/sources.md), compare coordinating practice against the standard, the Work Process note and the rubric, then update the source review in the same commit as any normative change. A change here also regenerates the hook line in `hooks/coordinator-reminder/coordinator-reminder.sh` and the ki-coordinator output style where the three rules, the owner-report shape or the banner changed; `scripts/banner.test.ts` holds the report heading and the live glyph banners in the standard and the output style byte-identical, and asserts the glyph form line, the banner heading, counts line and holder list, the closing thread lines and the absence of send or resume lines and a reply block.

### Mode RESUME

While coordinating, `/ki-coordination resume` releases held work under [Putting work on hold](references/standards-holds.md#putting-work-on-hold).

### Mode SEND

While coordinating, `/ki-coordination send` commits and syncs the work package and gives the Summary for the handoff under [States and moves](references/standards-coordination.md#states-and-moves).

### Mode SUMMARY

While coordinating, `/ki-coordination summary` gives [the Summary](references/standards-report-forms.md#the-summary) since the last mark, or the thread's start where there is none, and `/ki-coordination summary since <time>` gives it from any point the owner names; `no art` leaves the art out of its footer. It is the one summary form, replacing the recap and the full summary: the report heading, its form line reading `<glyph state> · Summary at <local time> · since <local time>`, the window's start, then `## Summary since <time>` with a bold headline and what changed, `## Status` with the two-column focus table, its lines opening with their holder's glyph, `## Queries` with every open query in full, then the footer, the Knowledge Islands art and the glyph banner with its thread line. It never moves the mark. `/ki-coordination status` gives the Status, the same without `## Summary since <time>`, its form line reading `<glyph state> · Status at <local time> · last mark <local time>`; it never moves the mark either. `/ki-coordination goals` takes a [goal-setting pass](references/standards-queries.md#goal-setting-pass) over the Focus list. A coordinator gives it unasked after every `mark`, when all dispatched work has finished, at every send, and in the first reply after 30 minutes or more without an owner message while queries are with the owner, answering the message first. `recap` and `full summary` are read as `summary` and a summary since the work began for the tolerance window.

## Notes

- The owner report and Needs tags are this skill's, and `ki-delegation` links to them. After editing the owner report, the hook line or the output style source, run `ki dev skill generate ki-coordination --write` and commit the rendered surfaces with the standard; the banner test fails while any surface is stale. No output style, proxy shaping block or communication level shortens an owner report's sections, its queries or its banner.
- Every banner closes with the seat's thread line, `<role glyph> 🔑 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, its glyph from the [role catalogue](../../governance/ki-work-package/references/standards-roles.md#role-catalogue), or `🧵 <work-id>` for a session with no role yet; the session name, the `Rename thread:` line and message-line senders carry the same line; no send or resume prompt is emitted, and the owner gets each thread's opener from `ki agent prompts <territory>`. A re-bootstrap report is a full owner report under the same report heading and banner as a Summary: `## Done` gives the coordinator role and where the work stands, `## In Progress` what is running, and `## Queries` every open query in full.
- A hold, under [Putting work on hold](references/standards-holds.md#putting-work-on-hold), is agreed only from With supervisor with `pause` or `done for now`, or `snooze` for a hold that waits for more to come, and ends with a hold report and nothing else: the report heading with the form line `⏸️ On hold · Hold report at <local time> · mark <local time>`, or `💤 Snoozing (on hold) · Hold report at <local time> · mark <local time>` while Snoozing, `## Done`, `## Parked` and `## Left over`, then the On hold or Snoozing banner from the standard's one table of states, its closing thread line; work that cannot drain stays With worker, blocked, with one line on what blocks it.
- Every send, receive, mark and hold rewrites the state file's front matter, under [Picking work up](references/standards-bootstrap.md#picking-work-up), and no work package records a session host seat; inventory-based host requirements follow `ki-work-package`.
- Each session commits its own work by explicit path after every finished change, syncs at least every 15 minutes while work runs, and may push everything stacked on `main`, other sessions' commits included, fast-forward only, never forced or with `--no-verify`, stopping on divergence, under [Pushing beneath other sessions](references/standards-sync.md#pushing-beneath-other-sessions).
- The refresh rule compares `git log -1 --format=%h -- skills/change-management/ki-coordination skills/governance/ki-work-package skills/governance/ki-delegation output-styles/ki-coordinator.md` with `state.md`'s `method_read`, and an important `REFRESH` line in `messages.md` targets it.
- The openers read `Bootstrap as <id> ... under ki-coordination`; the thread-model forms, naming the `state-of-play thread` or the `<project> coordination thread`, and the older `under ki-delegation`, `project thread` and `territory master thread` forms are accepted for the tolerance window and mean the same work.
- The local rubric is the materialised domain contract; generic execution, reporting, transaction safety, and publication remain owned by `ki`.
