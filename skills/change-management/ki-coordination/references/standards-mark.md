# Coordinating-work standard: mark, tidy and finishing

This file holds the mark, parking tangents, pruning the package, closing out Orca workers and finishing Project work. It extends [the core](standards-coordination.md).

## The mark

The mark is only a timestamp, `mark: <UTC timestamp>` in `state.md`'s front matter, and the default start of the next [Summary](standards-report-forms.md#the-summary). Each package has one mark; a new mark replaces it, and Git keeps the earlier ones. The mark bounds the logbook, record transitions, background-agent reports and `decisions.md`, whose entries carry their own timestamps.

- **Who moves it:** only the owner, with `mark`, `mark only` or `mark, status only`, and a hold. A Summary or a Status never moves it.
- **What follows it:** `mark` gives the Summary since the previous mark in the same reply, with every open query in full, and so does the mark that closes a query set. `mark only` gives nothing more, `mark, status only` gives the [Status](standards-report-forms.md#report-forms), and a hold's mark gives the [hold report](standards-holds.md#putting-work-on-hold).
- **Work at the mark,** in order:
  1. run the [repository level check](standards-sync.md#repository-level-check) before reporting the mark;
  2. work the [decisions life cycle](standards-decisions.md#decisions-life-cycle);
  3. [prune the package](#pruning-the-work-folder) and review its design notes;
  4. [close out Orca workers](#closing-out-orca-workers);
  5. commit the package and confirm in one line.
- **Open items carry forward:** a mark resets only the window of `## Summary since <time>`. Open and parked queries in `discussions.md`, open records in the work's scope, running and queued background agents and parked tangents stay on the status table and in `## Queries`; a mark never drops, closes or hides them.
- **History:** comes from Git and run reports, never from `state.md`. `git log -- +/_WORK/<id>/work.md` shows what the work is and `git log -- +/_WORK/<id>/state.md` its moves. `state.md` holds no dated log, commit runs or test counts; it may link one report or commit instead of copying it, and the `ki-work-package` rubric's history check warns otherwise.
- **No mark yet:** the Summary runs from the session's start, or from `work.md`'s `created_at` where that is unknown, and the first `mark` strikes the first mark.
- **Not a recap:** a Summary covers the package since the mark, and `ki-recap` covers one session at a lower level; they share no form or procedure.

Sources: SUMMARY-MODEL, DECISION-NO-NUMBER, MARK-THEN-SUMMARY and STATE-HISTORY in [the decision register](sources.md#decision-register).

## Parking tangents

When the owner raises a side topic in passing, record it as one dated line, say it is parked and carry on. Do not explore it unasked.

- **Where:** parked tangents live in `discussions.md`'s `## Parked`, beside the parked queries, as `- Parked <YYYY-MM-DD>: <one line>`. Work waiting on a named decision or event goes to `state.md`'s `## Held` with its release condition. Deferred deliverable work becomes a triage record in its home repository under `ki-next`'s [capture rule](../../ki-next/references/standards-next-work.md#capture-substantive-prospective-work).
- **Counting:** tangents count as outstanding in the [Summary](standards-report-forms.md#the-summary).
- **Picking up:** on request, such as "what's parked?", list them. When the owner picks one up, it gets a home, a Project, a record through `ki-next` or a line in other work's `messages.md`, or is dropped, and is removed in the same update.

Sources: HELD-VS-RECORD in [the decision register](sources.md#decision-register).

## Pruning the work folder

At every send and every mark, prune your own package, so `+/_WORK/<id>/` shows only what is still open and Git holds the rest. The `ki-work-package` [Tidying the work folder](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder) rules, over its [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list), set what goes, what stays, how and who; the five package files always stay. This standard sets the timing and the judgement.

- **Judgement:** whether a report's outcome, or every point of a feedback package, has a durable home in a record, `decisions.md`, the package or a commit. In a five-file package, a report is eligible for its steward's tidy once its outcome is homed and every query has been copied in full into `discussions.md`; the queries need not be answered yet. Keep a report whose outcome has no durable home, without homing it in haste. A later [Summary](standards-report-forms.md#the-summary) reads a deleted report from its last revision.
- **Design notes:** at each mark, review the design notes in the focus folders or `design/`. Delete each note that has graduated under the `ki-work-design` [artefact home](../../ki-work-design/references/standards-work-design.md#artefact-home), or that the package records as superseded; keep drafts, notes under review and any in doubt. The mark prompts a review, never an automatic deletion. Beyond graduation, a note goes only when every outcome it carried is homed, the owner's words and any grant included, and every link into it has been rewritten first. A diagram's source and its renders go together.
- **Temporary output:** delete, by explicit path, each of your own `tmp/<run>/` folders whose output is superfluous.
- **Record threshold:** deletion is operational work under the [record threshold](standards-decisions.md#decision-classes) and opens no record.
- **Flagging:** the `ki-work-package` rubric's [FOLDER](../../../governance/ki-work-package/references/rubric.md) items fail a package holding a file outside the closed list. They list as prune candidates every report whose tags `decisions.md` all names, every brief whose run's report is received, every finished work's package, and an unmatched `+/_WORK_REVIEW/` folder or index line.
  - Whether each candidate's outcome is homed stays the owning coordinator's judgement; the list is never permission to delete.
  - At its own mark, the State of play names each flagged package by a line in that work's `messages.md`, and its coordinator prunes it at its next send. A finished work's package is the exception: the State of play closes it itself under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder).
  - FOLDER-7 warns on a `decisions.md` the `ki agent close` gate cannot read as `##` entries alone. FOLDER-6 warns when `discussions.md` holds more than eight open queries.
  - COORD-3 warns, under the [owner queue](standards-coordination.md#coordinating-practices) cap, when more than eight roadmap records naming the Project of a piece of Project work await acceptance, counted across the Capital and the repositories beside it that name it as their Capital.

Sources: THREAD-TIDY and THREADS-TRIM in [the decision register](sources.md#decision-register).

## Closing out Orca workers

A coordinator that starts Orca supervised workers, or whose runs start them, closes out each settled worker as part of its close-out. Orca's orchestration guide counts supervised work as done only when "each settled worker was reused, explicitly retained, or released".

- **Receive:** when the report of an Orca worker the coordinator or its runs started is received, and Orca shows the Dispatch settled, succeeded or failed, do exactly one of three things and name which in the receive commit:
  - reuse the same terminal for an immediate follow-up Dispatch;
  - retain it with `orca orchestration worker-retain --dispatch <id> --json`, only at the owner's explicit request;
  - release it with `orca orchestration worker-release --dispatch <id> --json`. This is the default, done in the same wake as the completion message is received and acknowledged, never deferred to the mark, so no finished worker is left for the owner to raise.

  A release that fails or is refused is reported in that wake's timed line and named in the receive commit, and the Dispatch is carried as still owing a decision.
- **Authority:** only an accepted settlement authorises release. Absence, a timeout, an idle terminal, a heartbeat, a status, a question, an escalation, a stale or rejected completion, `unverifiable` liveness or a status-file `DONE` without a settled Dispatch authorises nothing. `terminal close` is never a substitute. Follow the recovery action of a `release_pending` or `release_unknown` receipt exactly and report it.
- **Mark, hold and Finished:** before a mark is struck, before a hold report and before the Finished banner, `orca orchestration worker-list --run <run id> --terminal-state reclaimable --json` returns none for each Orca Run the work created. A settled worker left open, a leftover, is released then under the same authority and reported. A worker still owing a decision is named in the receive or mark commit and in the hold report's `## Left over`.
- **What release does:** cleanup after settlement, not cancellation. It archives the worker's output, so `worker-read` still returns it, then closes only that worker's own coordinator-owned agent terminal, never setup, configured, reused, pre-existing or user-taken-over terminals. Release is terminal accounting, reported apart from Task status, and the worker is then listed as `released`.
- **`ki agent close`:** once `ki agent` launches runs as Orca workers, a change still to come, its close performs the release for them, and the coordinator's own step covers only workers started outside `ki agent`, such as trials and pilots.
- **History is not close-out:** close-out never deletes an Orca AI Vault session. Deleting conversation history is the owner's own choice, and no background agent or coordinator makes it.
- **Chat coordinators:** a coordinator in an Orca chat, not an Orca terminal, may release a worker it started. The proof covers chat coordinators only on the runtime the `ki-delegation-orca` [Runtime binding](../../../agentic-systems/ki-delegation-orca/references/standards-orca-delegation.md#runtime-binding) names as proved. Where a release is refused or its effect is uncertain, name the Dispatch as still owing a decision and close nothing by hand. Release never stands in for stopping an unfinished worker, which stops only under the `ki-delegation-orca` stop rule.

Sources: ORCA-WORKER-CLEANUP, ORCA-CLOSE-OUT, ACCEPT-BY-CRITERIA, WORKER-LEFTOVERS, TRIAL-SHAPE and CLOSEOUT-STRIKE in [the decision register](sources.md#decision-register).

## Finishing Project work

Project work moves to Finished once only, on the owner's `finish`, after the close-out:

1. every logged decision is homed under the [decisions life cycle](standards-decisions.md#decisions-life-cycle), none left homeless or held;
2. its design notes, in its focus folders or `design/`, are resolved: every note graduated and deleted;
3. `state.md` is set to `state: finished`, its durable information routed, and the commit `docs(work): <id> finish` made;
4. the package is deleted at the mark that closes it, under the `ki-work-package` [close-out](../../../governance/ki-work-package/references/standards-work-package.md#tidying-the-work-folder), Git keeping it, and the runs are archived by `ki agent close`, whose gate stays strict, with `--reconciled` as the owner's waiver. Where the package outlives the finishing session, the State of play closes it at an owner-authorised mark of its own whose report names the package, rather than by a line in the finished work's `messages.md`, which no coordinator reads.

Before the Finished banner, every Orca worker the work started is settled under [Closing out Orca workers](#closing-out-orca-workers). The last report is the finish report under [Templates](standards-report-forms.md#templates), closing with the Finished banner. The Project note then points at the outcome. Reopening a Project is a new opener from the State of play, not a send.

Sources: FINISH-CLOSE-OUT, CLOSE-GATE-STRICT and FINISHED-TIDY-KICK in [the decision register](sources.md#decision-register).
