---
name: ki-pmo
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-delegation, ki-checkpoint]
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
description: >
  Govern the coordinating thread: the responsive coordinator and its turn budget, the three thread types with their
  openers and bootstrap, the Summary, recap since the mark and full summary, the closing banner with its REST, BUSY
  and DONE frames and resume line, re-anchoring after compaction, decision classes, design notes, Project close and
  the thread working rules. Use in a state-of-play or coordination thread, or to give a summary, recap, full summary,
  banner or strike the mark; `ki-delegation` owns the background runs the thread launches.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | full-summary | help | mark | recap | refresh | summary'
---

# Knowledge Islands coordinating threads

`ki-pmo` is the project-management office of a territory: it owns how a coordinating thread, the state-of-play thread or a coordination thread, behaves with the owner, reports and keeps itself current, and it defines the three thread types every thread is one of: conversational, coordination and state-of-play. Read [the coordinating-thread standard](references/standards-pmo.md) before opening, bootstrapping or working in such a thread. It opens with the responsive coordinator in Kris's words and the three rules that follow from it: the thread never does substantive work itself, every unit of work goes to a detached background agent, and an owner message never pre-empts work in flight.

The standard holds coordinator responsiveness with the counted turn budget and self-check, the coordinating-thread practices with the closing banner, whose REST, BUSY and DONE frames and resume line every thread renders byte-identical, re-anchoring after compaction, the surfaces rule and red-x recovery, the three report forms and the full summary, coordination threads, the state-of-play thread, opening a thread with both openers, bootstrap, directions from the state-of-play thread, decisions and design with the four decision classes, the one list, the design-note home and Project close, and the thread working rules: recap since the mark, parking tangents, linking records, committing the thread folder, keeping primary checkouts current and refreshing this guidance. It adopts the owner report and its Needs tags from `ki-delegation`'s Reporting section by reference, and its glossary gives thread, session, chat, run, worker and agent one owner each.

[The generated rubric](references/rubric.md) carries the mechanical and judgment criteria, and [the sources](references/sources.md) the refresh review.

A repository that runs coordinating threads declares `[skills.ki-pmo]` in `.ki.toml` and, under its dependencies, `ki-delegation` and `ki-checkpoint`. The declaration is the signal the harness `hooks/coordinator-reminder.sh` reminder and the ki-coordinator output style key on: a repository that does not delegate never gets them, and removing the declaration disables them.

It does not launch, brief, monitor or report for background agents, which `ki-delegation` owns; it does not write checkpoints, which `ki-checkpoint` owns; and it does not summarise a single ordinary session, which `ki-recap` owns and which hands to this skill's forms only in a coordinating thread.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes and the operational **FULL-SUMMARY · MARK · RECAP · SUMMARY** modes a coordinating thread gives the owner.

Invoked as `help` / `-h` / `?`, it explains this boundary and stops.

### Mode AUDIT

Run `ki repo audit --skill ki-pmo --repo <repo>`.

The native rubric checks that a Capital, and only a Capital, holds the `_state-of-play.md` state-of-play checkpoint, that each coordinating checkpoint's label ends in the Project its filename names and that the Project and Initiative resolve in the registry, and that the active coordination threads are within the cap. It then reviews coordinator responsiveness, the report forms, the mark and the refresh rule from the transcripts, reports and checkpoints the owner selects.

### Mode CONFORM

Run `ki repo conform --skill ki-pmo --repo <repo> --dry-run` before applying it.

CONFORM republishes the generated rubric only. It never creates, renames or edits a checkpoint, opens or closes a thread, strikes the mark or writes a decision.

### Mode EDUCATE

Run `ki repo educate --skill ki-pmo --repo <repo>` to render the concern and rubric. Explain the responsive coordinator, the openers, the bootstrap and the three report forms from [the standard](references/standards-pmo.md); do not create a declaration or a checkpoint merely to demonstrate them.

### Mode FULL-SUMMARY

In a coordinating thread, `/ki-pmo full-summary` gives [the full summary](references/standards-pmo.md#full-summary): the banner heading with the window `since the thread began`, `## Decided` with every owner decision linked, then the whole-thread owner report with every open query in full, closing with the banner frame and the resume line. It never moves the mark.

### Mode HELP

Explain the three thread types, the coordinating thread and its three rules, the state-of-play and coordination threads with their openers and bootstrap, the three report forms, the closing banner and resume line, re-anchoring after compaction, the decision classes and Project close, and the mark, the ki-coordinator output style and the reminder hook, and the off-ramps: background runs and the owner report in `ki-delegation`, checkpoints in `ki-checkpoint`, single-session recaps in `ki-recap`, the coordination model purpose in `ki-tokenomics` and Project registry in `ki-work`.

### Mode MARK

In a coordinating thread, `/ki-pmo mark` strikes [the mark](references/standards-pmo.md#recap-since-the-mark): it writes `Mark: <UTC timestamp>` into the checkpoint's `Current state` through `ki-checkpoint` UPDATE, keeps every open Needs-tagged query, commits the checkpoint and confirms in one line. Only the owner's instruction moves the mark; "recap and mark" gives the recap first.

### Mode RECAP

In a coordinating thread, `/ki-pmo recap` gives [the recap since the mark](references/standards-pmo.md#recap-since-the-mark): the banner heading with the window `since <mark>`, then the owner report with what was delivered, decided, started, stopped or blocked, and newly captured since the mark, and every open item in full, closing with the banner frame and the resume line. It does not move the mark.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill under `ki-agentic-harness`.

When invoked from an installed copy, stop and redirect to the harness.

Read [the sources](references/sources.md), compare coordinating-thread practice against the standard and the rubric, then update the source review in the same commit as any normative change. A change here also updates the hook line in `hooks/coordinator-reminder.sh` and the ki-coordinator output style where the three rules, the owner-report shape or the banner changed; `scripts/banner.test.ts` holds the frames in the standard and the output style byte-identical below the issued border, and asserts the border's width and the per-item lines beneath.

### Mode SUMMARY

In a coordinating thread, `/ki-pmo summary` gives [the Summary](references/standards-pmo.md#report-forms): the banner heading with the window `since your last message`, then the owner report for that window, closing with the banner frame and the resume line. A thread gives it unasked when background agents finish, when the owner returns after a gap and at a resting point.

## Notes

- The owner report and Needs tags are `ki-delegation`'s; this skill restates neither. Every Summary, recap and full summary is one owner report under the shared banner heading, closing with the banner frame and the resume line, and no output style, proxy shaping block or communication level shortens its sections, its queries, its reply block or its banner.
- The resume line reads `Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.` A re-bootstrap report closes with the same banner as a Summary.
- The refresh rule compares `git log -1 --format=%h -- skills/change-management/ki-pmo` with the checkpoint's `ki-pmo read at <revision>` line; a checkpoint still carrying `ki-delegation read at` replaces it at its next update.
- The openers read `under ki-pmo` and name the `state-of-play thread` or the `<project> coordination thread`; the older `under ki-delegation`, `project thread` and `territory master thread` forms are accepted and mean the same thing until every checkpoint has re-bootstrapped under the new names.
- The local rubric is the materialised domain contract; generic execution, reporting, transaction safety, and publication remain owned by `ki`.
