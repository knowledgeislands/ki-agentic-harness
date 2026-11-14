# Coordinating-work standard: bootstrap and re-anchoring

This file holds bootstrap, resolving the opener, re-anchoring after compaction, picking work up, red-x recovery and targeted refresh. It extends [the core](standards-coordination.md).

## Contents

- [Bootstrap](#bootstrap)
- [Resolving the opener](#resolving-the-opener)
- [Re-anchoring after compaction](#re-anchoring-after-compaction)
- [Picking work up](#picking-work-up)
- [Recovering a session showing a red x](#recovering-a-session-showing-a-red-x)
- [Targeted refresh and landed notices](#targeted-refresh-and-landed-notices)

## Bootstrap

**Before the opener.** On a fresh or changed machine, the owner runs the `ki-keystone bootstrap` [machine-readiness checklist](../../../keystone/ki-keystone/references/standard-bootstrap.md#47-machine-readiness-for-coordinating-work) to its "Ready to coordinate" result: tools and level checkouts; the chezmoi binding of the coordinator hook and the `ki-coordinator` output style; `ki bootstrap`, which activates `ki-work` and its `design` subcommand; the Capital's declarations; the observable checks that the hook and style work; and the work's opener from [Opening work](standards-opening.md#opening-work). The checklist owns the machine half; this standard owns the session half, from the opener on. A session that reaches the opener without the hook's line or the style's shape says so in one line and names the checklist, rather than coordinating blind.

A one-line opener brings a new or running session onto this contract, for example `Re-bootstrap as ki.ways-of-working under ki-coordination.` A coordinator also re-bootstraps on request, after a compaction under [Re-anchoring](#re-anchoring-after-compaction), after a model switch, and when [picking work up](#picking-work-up). It then:

1. where the opener starts a new session, renames the session to the thread line the opener names, as its first act, before any read, by its agent host's rename (runtime-specific: `/rename <thread line>` in Claude Code), under [Opening work](standards-opening.md#opening-work);
2. reads this standard and the Work Process note;
3. checks through its agent host which of its agents still run and reconciles what is actually running;
4. [resolves the opener](#resolving-the-opener) to one package, `+/_WORK/<id>/`, reads its five files, `messages.md` first, reconciles it under the work-package standard and checks `method_read`;
5. acts on each line of [`messages.md`](standards-messages.md#messages-between-work), `IMPORTANT` lines first, `FIRST-STEP` among them, then in queue order, before launching any work;
6. as a State of play, gathers every record awaiting acceptance across its territory's repositories, or, as a secondary, across the work it covers, and brings them first, ahead of every other query, as one bundle per work under [Acceptance bundles](standards-queries.md#acceptance-bundles);
7. gives the Bootstrap, trigger T2 in the [coordinator reply format](standards-report-forms.md#triggers), a full Medium [report](standards-reporting.md#owner-report) under the [report heading](standards-report-forms.md#banner-detail), form line `**Bootstrap at <local time> · last mark <local time>**`:
   - `## Done` gives its coordinator role and where the work stands, ending with `Rename thread: /rename <thread line>`, the thread line being `<role glyph> 🔑 <work-id>`, or `🧵 <work-id>` with no role yet, the same line the opener named, under [Opening work](standards-opening.md#opening-work);
   - `## In Progress` gives what is running;
   - `## Queries` gives every open query in full;
   - the [banner](standards-coordination.md#banner) and thread line close it, rendered as every banner is, without the roadmap and package lines, the thread line last.

Work opened, bootstrapped or restarted in a new session with no mark strikes one at its start, writing `mark` in `state.md`, so every work carries a mark. [Re-anchoring](#re-anchoring-after-compaction) in the same session moves none.

Sources: BOOT-HOME, REBOOT-SHAPE, WORK-REVIEW-RETIRE and OPENER-NAME in [the decision register](sources.md#decision-register).

## Resolving the opener

At [bootstrap](#bootstrap), resolve the owner-approved opener to the exact id, package and actual repository, and stop on an absent or ambiguous home. Check the opener's level against the package without changing it, and its scope; `territory`, `project` and `regular` are all eligible. Cite the opening authority in `decisions.md` or the bounded owner instruction.

- Coordination requires `ki-coordination` capability in the package's home repository, with its declared dependencies, under [Session kinds](standards-reporting.md#session-kinds), unless a specific owner-approved exception expressly covers that opening. Acquire's already-approved intake exception remains usable; it grants no other package or capture/provider authority.
- A missing capability without that exception, an ambiguous home, missing opening authority or a mismatched opener stops coordination: give a one-line explanation and use the conversational reply forms, never automatic coordination.
- A package, id, level, binding or capability declaration alone never selects the role.

## Re-anchoring after compaction

A compaction keeps the session but replaces its transcript with a summary, so the coordinator re-anchors from durable state before it replies. A conversational session re-reads its package, if it has one, and carries on conversationally.

The owner may compact a long session with the runtime's compaction facility, keeping the work id, Working rules block, mark, open tags, running and queued agents and the lines acted on. No send or resume prompt is given before or after; a second compaction instead warrants the [restart suggestion](standards-coordination.md#banner).

After any compaction, owner's or runtime's, the coordinator, before answering anything else:

1. re-reads this standard, the harness output style `output-styles/ki-coordinator.md` from disk and all five files of its package in full, and follows the style file wherever it differs from the loaded style;
2. checks its agents through its agent host and reads `messages.md`, `IMPORTANT` lines first;
3. confirms in one line that it has re-anchored, then answers with the Bootstrap, heading block to banner.

The style file wins because a session keeps the style it loaded at start through a compaction, so the loaded copy can lag the file on disk; the [compact pointer](standards-coordination.md#generated-surfaces) and the style's re-anchoring paragraph say the same.

Re-anchoring moves no mark. The harness hook injects a one-line pointer to this section on a compact session start in Claude Code; a Codex session re-anchors on the owner's next message, where the hook's ordinary line reaches it.

Sources: STYLE-STALE in [the decision register](sources.md#decision-register).

## Picking work up

Prefer a fresh session once the package holds everything needed to resume.

The package alone says how work is picked up. `state.md`'s front matter, its state, since, hold and mark, with the holder derived from `_index.md`'s worker and supervisor, says where the work lies; its next steps say what the worker does when back in use. Every send, receive, mark and hold rewrites `state.md`'s front matter to agree with the report's banner; `_index.md` changes only with the definition. Neither file records a session host seat; an inventory-based host requirement may appear in the work label under `ki-work-package`.

| State | First on pick-up |
| --- | --- |
| With worker | Recovery, not a planned restart: reconcile each running and waiting agent against what its agent host shows; one not found counts as stopped and restarts from its own open brief |
| Handoff to supervisor, With supervisor | Re-read the package, take the owner's answers, mark, Summary with the open queries carried forward |
| Handoff to worker | Receive: re-read the package, read back the owner's answers, restart authorised work |
| Handoff to `<target>` | Check the target's state; stay in handoff until it receives or replies |
| On hold | Only on `resume`, the release, or the State of play's next steps naming it: put the parked queries back and continue from the next steps; a line routed meanwhile waits in `messages.md` without waking it |
| Finished | Nothing resumes. Reopening is a new opener from the State of play |

Run the [repository level check](standards-sync.md#repository-level-check) before resuming on another Mac and before leaving a host.

**Pick-up reads.** Picking work up stays within the [turn budget](standards-coordination.md#coordinator-responsiveness).

- One read of the package's files counts as one call: all five at bootstrap and re-anchoring; otherwise `state.md`, `messages.md`, `discussions.md` and `decisions.md`, with `_index.md` only when it changed.
- A write to the package's files with a brief counts as one write set, so the five-call budget is not spent before the first launch.
- After bootstrap, read only what changed since the last read, plus the entries bearing on the question, not every decision and query at each owner message.
- A report's `## Queries` is rendered from `discussions.md`'s `## Open`.

**Identity.** The closing thread line identifies the work to pick up; no session gets a copyable send or resume prompt beyond the [restart suggestion](standards-coordination.md#banner) when a trigger holds. Before acting, the coordinator verifies the id and exact label against `_index.md` and grounds itself in the primary checkout of the package's repository. It re-bootstraps, takes stock from `decisions.md`, its agents in its agent host, `messages.md` and the owner's messages, follows the state's first step above and restarts authorised work.

- Whatever must be done first on pick-up is an important `FIRST-STEP` line in `messages.md`.
- Work others wait on writes `READY` into the State of play's `messages.md`, and the State of play then identifies each waiting piece by its thread line, in its own order.

Sources: PICKUP-PRINCIPLE and PICKUP-READS in [the decision register](sources.md#decision-register).

## Recovering a session showing a red x

A red x in the editor's session list means the backend turn errored, not that the work is lost: the package holds everything needed.

1. Do not open a new session first. Ask the same session to pick up the work its closing [thread line](standards-coordination.md#banner) identifies. If it replies, it re-anchors, strikes the mark, gives a fresh Summary since the mark and takes stock.
2. If the editor will not send into the session, open a new one in the same project folder and identify the work by its id and exact label from the thread line. The coordinator verifies both against `_index.md` before acting; the old transcript becomes history.
3. The recovered coordinator reports, as part of taking stock, what it missed and what it did about it. That report's `## Done` carries a line saying the session was recovered and when, in UTC.

Sources: RED-X-RECOVERY in [the decision register](sources.md#decision-register).

## Targeted refresh and landed notices

**Targeted refresh.** After an approved method change lands, the sender writes one dated `REFRESH` line, flagged important so it is taken before ordinary lines, only into the `messages.md` of works whose `method_read` predates the change and whom it affects. The line links the standard at its revision and states the practical effect in a sentence.

- While Ways of working is defining the method it sends these lines itself; afterwards the State of play sends them under [Stewardship of continual improvement](standards-territory.md#territory-work).
- A sender may replace its own earlier `REFRESH` line not yet acted on, so changes coalesce; the replacement keeps every pending effect of the line it replaces.
- The receiver rereads at its next safe point, before launching further work. Held work is not woken; the line waits.
- The bootstrap and update revision checks stay as the fallback.

**Landed notices.** When Ways of working delivers a change a coordinator asked for, or one that changes how it works, it sends that coordinator a targeted `REFRESH` line saying what landed and what it changes there. A coordinator that takes such a line, or finds its `method_read` behind at bootstrap, says in its next reply, in a line or two, how its own behaviour has changed, naming the Ways of working change. No acknowledgement line is needed: setting `method_read` is the confirmation.

Sources: REFRESH-TARGET, WOW-REFRESH and LANDED-NOTICE in [the decision register](sources.md#decision-register).
