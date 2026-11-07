# Coordinating-work standard: mark, tidy and finishing

This file holds the mark, parking tangents, pruning the work folder, closing out Orca workers and finishing Project work. It extends [the core](standards-coordination.md).

## The mark

The mark is only a timestamp: the default start of the next [Summary](standards-report-forms.md#the-summary). A Summary is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure.

At each mark, perform the [repository level check](standards-sync.md#repository-level-check) before reporting the mark.

- **Mark:** the point at which the next Summary starts by default, and at which decisions are struck and the working area tidied, struck by the owner at a moment of their choosing or by a hold. Each piece of work has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The state file's front matter keeps it as `mark: <UTC timestamp>`. The timestamp bounds the logbook, work-record transitions, background-agent reports and the decisions log, whose entries carry their own timestamps. The banner and the mark describe or date a decision and never cite a number.
- **Striking:** only the owner moves the mark, by saying `mark`, `mark only` or `mark, status only`, and a hold strikes one. Giving a Summary or a Status does not move it. The coordinator then works the [decisions life cycle](standards-decisions.md#decisions-life-cycle) on the entries, [prunes its work folder](#pruning-the-work-folder), [closes out its Orca workers](#closing-out-orca-workers), commits the work folder and confirms in one line.
- **Summary after the mark:** `mark`, and every mark struck at the end of a query set, is followed at once, in the same reply, by the [Summary](standards-report-forms.md#the-summary) since the previous mark, with every open query in full, so Kris never has to ask for it; `mark only` strikes it with no Summary, and `mark, status only` strikes it and gives the [Status](standards-report-forms.md#report-forms), the Summary without its history. A hold report stays the exception: a hold's mark is followed by its [hold report](standards-holds.md#putting-work-on-hold) instead.
- **Outstanding:** the open and parked Needs tags in `discussions.md`, open work records in the work's scope, running or queued background agents, and parked tangents. Outstanding carries forward across marks: striking a mark resets only the window of `## Summary since <time>`, and never drops, closes or hides an open item, which the Summary's status table and `## Queries` carry in full.
- **History:** the work's history comes from the logbook and the run reports, never from `state.md`. `git log -- +/_WORK/<id>/work.md` is the history of what the work is and `git log -- +/_WORK/<id>/state.md` the history of its moves; `state.md` holds no dated log, commit runs or test counts, and may link one report or commit rather than copy it, which the `ki-work-package` rubric's history check warns on.
- **No mark yet:** a Summary runs from the thread's start, and the first `mark` strikes the first mark; where the thread's start is unknown, it runs from `work.md`'s `created_at`.

Sources: SUMMARY-MODEL, DECISION-NO-NUMBER, MARK-THEN-SUMMARY and STATE-HISTORY in [the decision register](sources.md#decision-register).

## Parking tangents

When the owner raises a side topic in passing, the coordinator records it as one dated line, says it is parked, and carries on with the current work. It does not explore the tangent unasked.

Parked tangents live in `discussions.md`'s `## Parked` section beside the parked queries, each as `- Parked <YYYY-MM-DD>: <one line>`, under the work-package standard; work waiting on a named decision or event goes to `state.md`'s `## Held` with its release condition, and deferred deliverable work becomes a triage record in its home repository under `ki-next`'s [capture rule](../../ki-next/references/standards-next-work.md#capture-substantive-prospective-work). They count as outstanding in the [Summary](standards-report-forms.md#the-summary).

On request, such as "what's parked?", the coordinator lists them. When the owner picks one up, it gets a home - a Project, a work record through `ki-next`, or a line in other work's `messages.md` - or is dropped, and the coordinator removes it in the same update.

Sources: HELD-VS-RECORD in [the decision register](sources.md#decision-register).

## Pruning the work folder

At every send and at each mark the coordinator prunes its own work folder, so that `+/_WORK/<id>/` shows only what is still open and Git history holds the rest, as the note's Shared history is never rewritten sets. What goes, what stays, how and who are the `ki-work-package` [Tidying the work folder](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder) rules, over the folder's [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list): the five package files always stay; this standard keeps their timing and the judgement each needs.

- **Judgement:** whether the report's outcome, or every point of a feedback package, has a durable home in a work record, decisions log, work package or commit. In a five-file package, a report is eligible for its owning steward's tidy once its outcome is homed and every query has been copied in full into `discussions.md`; those queries need not already be answered. Keep every report whose outcome has no durable home yet, without homing it in haste; a later [Summary](standards-report-forms.md#the-summary) reads a deleted report from its last revision.
- **Design notes:** at each mark the coordinator reviews the design notes in its focus folders, or `design/`, and deletes each note that has graduated under the `ki-work-design` [artefact home](../../ki-work-design/references/standards-work-design.md#artefact-home), or that the work package records as superseded; drafts, notes under review and any in doubt stay. The mark prompts the review, never an automatic deletion. Beyond graduation, a note goes only when every outcome it carried is homed, the owner's words and any grant included, and every link into it has been rewritten first; a diagram's source and its renders go together.
- **Temporary output:** the coordinator deletes, by explicit path, each `tmp/<run>/` folder of its own whose output is superfluous.
- **Record threshold:** the deletion is operational work under the [record threshold](standards-decisions.md#decision-classes) and opens no record.
- **Flagging:** the `ki-work-package` rubric's [FOLDER](../../../governance/ki-work-package/references/rubric.md) items fail a work folder holding a file outside the closed list and list as candidates for the prune every report whose Needs tags the decisions log all names, every brief whose run's report is received, every finished work's folder and an unmatched `+/_WORK_REVIEW/` folder or index line; whether each candidate's outcome has a durable home stays the owning coordinator's judgement, and the listing is never permission to delete. At its own mark territory work names each flagged folder by a line in that work's `messages.md`, and the owning coordinator prunes it at its next send, except a finished work's folder, which territory work closes itself under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder) instead of naming it in a message line. FOLDER-7 warns on a decisions log the `ki agent close` gate cannot read as `##` entries alone. FOLDER-6 also warns when a work's `discussions.md` holds more than eight open queries, and COORD-3 warns, under the [owner queue](standards-coordination.md#coordinating-practices) cap, when more than eight roadmap records naming a piece of Project work's Project await acceptance, counted across the Capital and the repositories beside it that name it as their Capital.

Sources: THREAD-TIDY and THREADS-TRIM in [the decision register](sources.md#decision-register).

## Closing out Orca workers

A coordinator that starts Orca supervised workers, or whose runs start them, closes out each settled worker as part of its close-out, because Orca's own orchestration guide counts supervised work as done only when "each settled worker was reused, explicitly retained, or released".

- **Receive:** when the coordinator receives the report of an Orca worker it or its runs started, and Orca shows the Dispatch settled, succeeded or failed, it does exactly one of three things and names which in the receive commit: reuses the same terminal for an immediate follow-up Dispatch, retains it with `orca orchestration worker-retain --dispatch <id> --json` only at the owner's explicit request, or releases it with `orca orchestration worker-release --dispatch <id> --json`. Release is the default, and it happens as soon as the worker's completion message is received and acknowledged, in the same wake, never deferred to the mark, so that a finished worker is not left open for the owner to raise. A release that fails or is refused is reported in that wake's timed line and named in the receive commit, and the Dispatch is carried as still owing a decision.
- **Authority:** only an accepted settlement authorises release. Absence, a timeout, an idle terminal, a heartbeat, a status, a question, an escalation, a stale or rejected completion, `unverifiable` liveness or a status-file `DONE` without a settled Dispatch authorises nothing. `terminal close` is never a substitute, and the recovery action of a `release_pending` or `release_unknown` receipt is followed exactly and reported.
- **Mark, hold and Finished:** for each Orca Run the work created, `orca orchestration worker-list --run <run id> --terminal-state reclaimable --json` returns none before a mark is struck, before a hold report and before the Finished banner; a settled worker the receive step left open, a leftover, is released then under the same authority and reported. A worker still owing a decision is named in the receive or mark commit and in the hold report's `## Left over`.
- **What release does:** release is cleanup after settlement, not cancellation. It closes only that worker's own coordinator-owned agent terminal, after archiving its output so that `worker-read` still returns it, and never closes setup, configured, reused, pre-existing or user-taken-over terminals. Release is terminal accounting, reported apart from Task status, and the worker is then listed as `released`.
- **`ki agent close`:** once `ki agent` launches runs as Orca workers, a change still to come, its close performs the receive step's release for them, and the coordinator's own step covers only workers started outside `ki agent`, such as trials and pilots.
- **History is not close-out:** close-out never deletes an Orca AI Vault session. Deleting conversation history is the owner's own choice, and no run or coordinator makes it.
- **Chat coordinators:** a coordinator in an Orca chat, rather than an Orca terminal, may release a worker it started. The proof covers chat coordinators only on the runtime the `ki-delegation-orca` standard's [Runtime binding](../../../agentic-systems/ki-delegation-orca/references/standards-orca-delegation.md#runtime-binding) names as proved. Where a release is refused or its effect is uncertain, the coordinator names the Dispatch as still owing a decision and closes nothing by hand. Releasing never stands in for stopping an unfinished worker, which stops only under the `ki-delegation-orca` stop rule.

Sources: ORCA-WORKER-CLEANUP, ORCA-CLOSE-OUT, ACCEPT-BY-CRITERIA, WORKER-LEFTOVERS, TRIAL-SHAPE and CLOSEOUT-STRIKE in [the decision register](sources.md#decision-register).

## Finishing Project work

Project work moves to Finished once only, on the owner's `finish`, after the close-out:

1. every logged decision is homed under the [decisions life cycle](standards-decisions.md#decisions-life-cycle), with none left homeless or held;
2. its design notes are resolved, in its focus folders or `design/`: every note graduated and deleted;
3. the state file is set to `state: finished`, its durable information routed, and the commit `docs(work): <id> finish` made;
4. the work folder is deleted at the mark that closes it, under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder), Git keeping it, and the runs archived by `ki agent close`, whose gate stays strict, with `--reconciled` as the owner's waiver. Where the folder outlives the finishing thread, territory work closes it at an owner-authorised mark of its own whose report names the folder, under that close-out, rather than naming it in the finished work's `messages.md`, which no coordinator reads.

Before the Finished banner, every Orca worker the work started is settled under [Closing out Orca workers](#closing-out-orca-workers). The last report is the finish report under [Templates](standards-report-forms.md#templates), closing with the Finished banner.

The Project note then points at the outcome. Reopening a Project is a new opener from territory work, not a send.

Sources: FINISH-CLOSE-OUT, CLOSE-GATE-STRICT and FINISHED-TIDY-KICK in [the decision register](sources.md#decision-register).
