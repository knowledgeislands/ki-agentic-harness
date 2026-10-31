---
name: ki-coordination
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-delegation, ki-work-package]
ki-shared-dependencies: [ki-skills:rubric, ki-work-roadmap:work-identifiers]
contributes: ['.ki.toml']
description: >
  Govern coordinating work under the Knowledge Islands work model: the responsive coordinator and its turn budget, the
  work levels and forms with their ids, openers and bootstrap, the seven states and the receive words, the Summary, recap
  since the mark and full summary, the report heading, the closing glyph banner and thread line, On hold with its hold
  report, the work package and its message queue, route receipt and the inbox check, re-anchoring after compaction, decision classes and their life cycle,
  design notes, Finished, the working rules, and the three reply forms every session uses. Use while coordinating
  any explicitly opened work package to give a summary, recap, full summary or banner or strike the mark, or to decide how any
  session replies; `ki-delegation` owns the background runs the coordinator launches.
argument-hint: 'audit <repo> | conform <repo> | drain | educate <repo> | full-summary | help | hold | mark | recap | receive | refresh | resume | send | summary'
---

# Knowledge Islands coordinating work

`ki-coordination` governs coordinating work, the work a worker holds for its supervisor while runs of its own carry the parts: it owns how a session coordinating a valid package of any level behaves with the owner, reports and keeps itself current, under the work model that [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) decides and the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes. Read [the coordinating-work standard](references/standards-coordination.md) before opening, bootstrapping or coordinating work. It opens with the work model and its old-to-new mapping and tolerance window, then the responsive coordinator in Kris's words and the three rules that follow from it: the coordinator never does substantive work itself, every unit of work goes to a detached background agent, and an owner message never pre-empts work in flight.

The standard holds coordinator responsiveness with the counted turn budget and self-check and the heartbeat that runs only while work lies with a worker, the inbox watch that listens only when the owner asks the thread to, or for a Rig host sync thread by its role, and not while draining or on hold, the two thread capabilities, listening, which also tends the thread's own work package on quiet wakes, and host sync, a host sync pass repeating until the Mac and GitHub are clean and level, and the keep-awake an unattended window adds; the levels and forms and work naming, with two-part ids that carry no theme, titles that keep it as display text and the work name, the label with the id in brackets, used wherever a session names a piece of work; the states and moves; the rich-text report heading with its glyph form line and the closing glyph banner with its counts and holder list, its listening line, the closing thread line in every state, which every coordinator renders the same way; re-anchoring after compaction, the surfaces rule and red-x recovery; the report forms and the full summary; territory work, with its main State of play and any secondary States of play under it, Project work, opening work with its openers, which `ki agent prompts <territory>` lists for the owner, bootstrap, the message queue between work with its important flag, route receipt and the inbox check at each wake; decisions and design with the four decision classes, the decisions life cycle at each mark, design notes in the work folder and Finishing Project work; and the working rules: recap since the mark, parking tangents, linking records, committing and pruning the work folder, closing out Orca workers, putting work on hold with its hold report, picking work up from its work package, work awaiting review in `+/_WORK_REVIEW/`, pushing beneath other sessions, keeping primary checkouts current, refreshing this guidance through `method_read` and State of play's stewardship of continual improvement. It is the one source of the three [reply forms](references/standards-coordination.md#reply-forms), conversational reply, completed-work report and coordinator summary, with what counts as a unit of work, and of the [owner report](references/standards-coordination.md#owner-report), its spoken [answers](references/standards-coordination.md#answers) and its Needs tags, which every completed-work report takes, and of the [generated surfaces](references/standards-coordination.md#generated-surfaces) that carry it: the coordinator hook's line, the ki-coordinator output style, the run-prompt Report paragraph, each authority footer's report rule and the review-independence line of the run-prompt skeleton and the `ki-work-design` brief template, rendered by `ki dev skill generate ki-coordination`.

[The generated rubric](references/rubric.md) carries the mechanical and judgment criteria, and [the sources](references/sources.md) the refresh review.

A repository that runs coordinating work declares `[skills.ki-coordination]` in `.ki.toml` and, under its dependencies, `ki-delegation` and `ki-work-package`. The declaration enables the harness `hooks/coordinator-reminder.sh` conditional pointer and the ki-coordinator output-style binding; it proves checkout capability, never session selection or role. Removing it disables those surfaces. Full session-sensitive hook detection remains deferred, and the coordinator performs its own method revision check.

It does not launch, brief, monitor or report for background agents, which `ki-delegation` owns; it does not define the work package or its files, which `ki-work-package` owns; and it does not summarise a single ordinary session, which `ki-recap` owns and which keeps the ordinary session recap only.

The [deferred host-move design notes](references/sources.md#deferred-host-move-evidence) retain unresolved queue, host-bound-run and historical handover questions without granting implementation authority.

The [assigned-package cascade](references/standards-coordination.md#coordinating-assigned-packages) covers explicit stewardship and handover, one package per turn, one territory Summary with work-qualified queries, per-package marks and the main `covers` register. STEWARD-FIELD remains a placeholder and creates no field.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the operational **DRAIN · FULL-SUMMARY · HOLD · MARK · RECAP · RECEIVE · RESUME · SEND · SUMMARY** modes a coordinator gives the owner.

Invoked as `help` / `-h` / `?`, it explains this boundary and stops.

### Mode AUDIT

Run `ki repo audit --skill ki-coordination --repo <repo>`.

The native rubric checks that a Capital, and only a Capital, holds its territory work, its main titled `<Territory> > SoP` and each secondary `<Territory> > SoP (<name>)`; that each piece of Project work names a Project that resolves in the registry, that its title ends in that Project's title and that any theme resolves; that each work file's level agrees with its id, reading state from `state.md` where the work package has one; that the active Project work is within the cap; that every full record identifier in a report under `+/_WORK/` is a link to an existing file, with a pruned record linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision; that recommended options carry their confidence; that each work folder holds only its closed list, the five package files among it; and warns on more than eight open queries in `queries.md`. For the tolerance window it reads `+/_CHECKPOINTS/` and `+/_THREADS/` as before, warning on each, and accepts `+/_WORK_REVIEW/` as a holding area. It then reviews coordinator responsiveness, the report forms, the mark and the refresh rule from the transcripts, reports and work files the owner selects.

### Mode CONFORM

Run `ki repo conform --skill ki-coordination --repo <repo> --dry-run` before applying it.

CONFORM republishes the generated rubric only. It never creates, renames or edits a work package, opens or finishes work, strikes the mark or writes a decision.

### Mode EDUCATE

Run `ki repo educate --skill ki-coordination --repo <repo>` to render the concern and rubric. Explain the responsive coordinator, the openers, the bootstrap and the report forms from [the standard](references/standards-coordination.md); do not create a declaration or a work file merely to demonstrate them.

### Mode DRAIN

While coordinating, `/ki-coordination drain` stops new launches while the work stays With worker, receives running work and reports `DRAINED` or `NOT DRAINED` in Done, under [Putting work on hold](references/standards-coordination.md#putting-work-on-hold). It does not put the work on hold.

### Mode FULL-SUMMARY

While coordinating, `/ki-coordination full-summary` gives [the full summary](references/standards-coordination.md#full-summary): the report heading, its form line reading `<glyph state> · Full summary at <local time> · last mark <local time>`, `## Decided` with every owner decision linked, then the whole-work owner report with every open query in full, closing with the glyph banner and its thread line. It never moves the mark.

### Mode HELP

Explain the work levels and forms, the coordinator and its three rules, territory work and Project work with their openers and bootstrap, the seven states and the receive words, the report forms, the closing glyph banner and its thread line, re-anchoring after compaction, the decision classes and their life cycle and Finishing Project work, and the mark, the ki-coordinator output style and the reminder hook, and the off-ramps: the Work Process note for the model itself, background runs and the run report in `ki-delegation`, the work package in `ki-work-package`, single-session recaps in `ki-recap`, the coordination model purpose in `ki-tokenomics` and the theme and Project registry in `ki-work`.

### Mode HOLD

While coordinating, `/ki-coordination hold` drains and puts the work On hold under [Putting work on hold](references/standards-coordination.md#putting-work-on-hold), ending with its hold report.

### Mode MARK

While coordinating, `/ki-coordination mark` strikes [the mark](references/standards-coordination.md#recap-since-the-mark): it writes `mark: <UTC timestamp>` into the state file's front matter, `state.md`, works the decisions life cycle, prunes the work folder, keeps every open Needs-tagged query, commits the work folder and confirms in one line. Only the owner's instruction, or a hold, moves the mark; "recap and mark" gives the recap first. Every mark, whether struck at Kris's word, at the end of a query set or at a hold, is followed at once, in the same reply, by the full Summary of everything since the previous mark; a hold report stays the exception.

### Mode RECAP

While coordinating, `/ki-coordination recap` gives [the recap since the mark](references/standards-coordination.md#recap-since-the-mark): the report heading, its form line reading `<glyph state> · Recap at <local time> · last mark <local time>`, then the owner report with what was delivered, decided, started, stopped or blocked, and newly captured since the mark, and every open item in full, closing with the glyph banner. It does not move the mark.

### Mode RECEIVE

While coordinating, `/ki-coordination receive` records the owner's receive under [States and moves](references/standards-coordination.md#states-and-moves), as `with me` does.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill under `ki-agentic-harness`.

When invoked from an installed copy, stop and redirect to the harness.

Read [the sources](references/sources.md), compare coordinating practice against the standard, the Work Process note and the rubric, then update the source review in the same commit as any normative change. A change here also regenerates the hook line in `hooks/coordinator-reminder.sh` and the ki-coordinator output style where the three rules, the owner-report shape or the banner changed; `scripts/banner.test.ts` holds the report heading and the live glyph banners in the standard and the output style byte-identical, and asserts the glyph form line, the banner heading, counts line and holder list, the closing thread lines and the absence of send or resume lines and a reply block.

### Mode RESUME

While coordinating, `/ki-coordination resume` releases held work under [Putting work on hold](references/standards-coordination.md#putting-work-on-hold).

### Mode SEND

While coordinating, `/ki-coordination send` commits and syncs the work package and gives the Summary for the handoff under [States and moves](references/standards-coordination.md#states-and-moves).

### Mode SUMMARY

While coordinating, `/ki-coordination summary` gives [the Summary](references/standards-coordination.md#report-forms): the report heading, its form line reading `<glyph state> · Summary at <local time> · last mark <local time>`, then the owner report for that window, closing with the glyph banner and its thread line. A coordinator gives it unasked when all dispatched work has finished, at every send, and in the first reply after 30 minutes or more without an owner message while queries are with the owner, answering the message first and then giving every open query in full.

## Notes

- The owner report and Needs tags are this skill's, and `ki-delegation` links to them. After editing the owner report, the hook line or the output style source, run `ki dev skill generate ki-coordination --write` and commit the rendered surfaces with the standard; the banner test fails while any surface is stale. No output style, proxy shaping block or communication level shortens an owner report's sections, its queries or its banner.
- Every banner closes with `🧵 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work; no send or resume prompt is emitted, and the owner gets each thread's opener from `ki agent prompts <territory>`. A re-bootstrap report is a full owner report under the same report heading and banner as a Summary: `## Done` gives the coordinator role and where the work stands, `## In Progress` what is running, and `## Queries` every open query in full.
- A hold, under [Putting work on hold](references/standards-coordination.md#putting-work-on-hold), is agreed only from With supervisor with `pause` or `done for now`, and ends with a hold report and nothing else: the report heading with the form line `⏸️ On hold · Hold report at <local time> · mark <local time>`, `## Done`, `## Parked` and `## Left over`, then the On hold banner, its closing thread line; work that cannot drain stays With worker, blocked, with one line on what blocks it.
- Every send, receive, mark and hold rewrites the state file's front matter, under [Picking work up](references/standards-coordination.md#picking-work-up), and no work package records a session host seat; inventory-based host requirements follow `ki-work-package`.
- Each session commits its own work by explicit path after every finished change, syncs at least every 15 minutes while work runs, and may push everything stacked on `main`, other sessions' commits included, fast-forward only, never forced or with `--no-verify`, stopping on divergence, under [Pushing beneath other sessions](references/standards-coordination.md#pushing-beneath-other-sessions).
- The refresh rule compares `git log -1 --format=%h -- skills/change-management/ki-coordination skills/governance/ki-work-package` with `state.md`'s `method_read`, and an important `REFRESH` line in `messages.md` targets it.
- The openers read `Bootstrap as <id> ... under ki-coordination`; the thread-model forms, naming the `state-of-play thread` or the `<project> coordination thread`, and the older `under ki-delegation`, `project thread` and `territory master thread` forms are accepted for the tolerance window and mean the same work.
- The local rubric is the materialised domain contract; generic execution, reporting, transaction safety, and publication remain owned by `ki`.
