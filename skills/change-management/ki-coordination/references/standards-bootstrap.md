# Coordinating-work standard: bootstrap and re-anchoring

This file holds bootstrap, resolving the opener, re-anchoring after compaction, picking work up, red-x recovery and targeted refresh. It extends [the core](standards-coordination.md).

## Bootstrap

**Before the opener.** On a fresh or changed machine the owner runs the `ki-bootstrap` [machine-readiness checklist](../../../keystone/ki-bootstrap/references/standards-bootstrap.md#machine-readiness-for-coordinating-work) to its "Ready to coordinate" result: tools and level checkouts, the chezmoi binding of the coordinator hook and the `ki-coordinator` output style, `ki bootstrap` and `ki skill add ki-work-design`, the Capital's declarations, the observable checks that the hook and the style work, and `ki agent prompts <territory>` for the opener with its `claude --name` command. That checklist owns the machine half and this standard begins at the opener and owns the session half. A session that reaches the opener without the hook's line or the style's shape says so in one line and names the checklist rather than coordinating blind.

A one-line opener brings a new or already-running session onto this contract, for example `Re-bootstrap as ki.ways-of-working under ki-coordination.` A coordinator also re-bootstraps on request, after a compaction under [Re-anchoring](#re-anchoring-after-compaction), after a model switch, and when picking work up under [Picking work up](#picking-work-up). It then:

1. reads this standard and the Work Process note;
2. checks `ki agent status` for its runs, and reconciles what is actually running rather than assuming;
3. resolves the exact id and actual repository to one authoritative work package, `+/_WORK/<id>/`, reads its five files, `messages.md` first, and stops on an absent or ambiguous home; reconciles it under the work-package standard and checks `method_read`; checks the opener against its actual level (`territory`, `project` or `regular`) and scope, opening authority and package-home coordination capability under [Session kinds](standards-reporting.md#session-kinds), preserving a specifically approved exception such as Acquire intake; a mismatch or missing authority/capability without that exception gets a one-line explanation and the conversational reply forms, never automatic coordination;
4. acts on each line of its [message queue](standards-messages.md#messages-between-work), `messages.md`, important lines first, `FIRST-STEP` among them, then in queue order, before launching any work;
5. as territory work, gathers every record awaiting acceptance across its territory's repositories, or as a secondary across the work it covers, and brings them first, ahead of every other query, as one bundle per work under [Acceptance bundles](standards-queries.md#acceptance-bundles);
6. as the main State of play, lists every item in its territory's `+/_WORK_REVIEW/` areas and, while any holds anything, raises them as one `REVIEW-HOLD` query under [Work awaiting review](standards-territory.md#work-awaiting-review);
7. gives the re-bootstrap report, a full [owner report](standards-reporting.md#owner-report) under the [report heading](standards-coordination.md#banner), its form line reading `**<glyph state> · Re-bootstrap at <local time> · last mark <local time>**`: `## Done` gives its coordinator role and where the work stands and ends with the line `Rename thread: /rename <thread line>`, `<role glyph> 🔑 <work-id>` or `🧵 <work-id>` with no role yet, under [Opening work](standards-opening.md#opening-work), `## In Progress` what is running, and `## Queries` every open query in full; then it closes with the [glyph banner](standards-coordination.md#banner) and its thread line, rendered exactly as a Summary renders them, the thread line last.

Work opened, bootstrapped or restarted in a new session with no mark strikes one at its start, writing `mark` in `state.md`, so every work always carries a mark. [Re-anchoring](#re-anchoring-after-compaction) in the same session still moves none.

Sources: BOOT-HOME and REBOOT-SHAPE in [the decision register](sources.md#decision-register).

## Resolving the opener

At [bootstrap](#bootstrap), resolve the owner-approved opener to the exact package and actual home, check its level without changing it, and cite the opening authority in its decisions log or the bounded owner instruction. `territory`, `project` and `regular` are all eligible. Coordination requires `ki-coordination` capability in the package-home repository, with its declared dependencies, unless a specific owner-approved exception expressly covers that opening. Acquire's already-approved intake exception remains usable; it grants no other package or capture/provider authority. A missing capability without that exception, an ambiguous home, missing opening authority or a mismatched opener stops coordination with a one-line explanation and the conversational reply forms. A package, id, level, binding or capability declaration alone never selects the role.

## Re-anchoring after compaction

A compaction keeps a coordinator's session but replaces its transcript with a summary, so the coordinator re-anchors from durable state before it replies; a conversational session re-reads its work package, if it has one, and carries on with a conversational reply. The owner may choose to compact a long session using the runtime's compaction facility, keeping the work id, Working rules block, mark, open Needs tags, running and queued agents and messages acted on. No send or resume prompt is emitted before or after compaction; a second compaction instead warrants the [restart suggestion](standards-coordination.md#banner).

Whether the compaction came from the owner or from the runtime, the coordinator then, before answering anything else:

1. re-reads this standard, the harness output style `output-styles/ki-coordinator.md` from disk and all five files of its own work package in full, and follows the style file wherever it differs from the loaded style;
2. runs `ki agent status` and reads its `messages.md` queue, important lines first, and any run inbox, so it knows what is running, queued and unread rather than assuming;
3. as territory work, lists every item in its territory's `+/_WORK_REVIEW/` areas and carries the `REVIEW-HOLD` query under [Work awaiting review](standards-territory.md#work-awaiting-review) while any holds anything;
4. confirms in one line that it has re-anchored, then answers in owner-report form with the banner.

The style file wins because a session keeps the output style it loaded at start through a compaction, so the loaded copy can lag the file on disk; the [compact pointer](standards-coordination.md#generated-surfaces) and the style's own re-anchoring paragraph say the same.

Re-anchoring moves no mark. The harness hook injects a one-line pointer to this subsection on a compact session start in Claude Code; a Codex session re-anchors on the owner's next message, where the hook's ordinary line reaches it.

Sources: STYLE-STALE in [the decision register](sources.md#decision-register).

## Picking work up

Prefer a fresh session once the package contains everything needed to resume.

The work package alone says how work is picked up. The state file's front matter, its state, since, hold and mark, with the holder derived from `work.md`'s worker and supervisor, says where the work lies, and its next steps say what the worker does when it is back in use. Every send, receive, mark and hold rewrites `state.md`'s front matter to agree with the banner the report closes with; `work.md` changes only when the definition does. Neither file records a session host seat; an inventory-based host requirement may appear in the work label under `ki-work-package`.

| State | First on pick-up |
| --- | --- |
| With worker | Recovery, not a planned restart: reconcile each running and queued agent against `ki agent status`; one not found counts as stopped and restarts from its open brief |
| Handoff to supervisor, With supervisor | Re-read the work package, take the owner's answers, mark, Summary with the open queries carried forward |
| Handoff to worker | Receive: re-read the work package, read back the owner's answers, restart authorised work |
| Handoff to `<target>` | Check the target's state; stay in handoff until it receives or replies |
| On hold | Only on `resume`, the release, or territory work's next steps naming it: put the parked queries back and continue from the next steps; a line routed meanwhile waits in `messages.md` without waking it |
| Finished | Nothing resumes. Reopening is a new opener from territory work |

Before resuming on another Mac, perform the [repository level check](standards-sync.md#repository-level-check); do the same before leaving a host.

**Pick-up reads.** Picking work up stays within the [turn budget](standards-coordination.md#coordinator-responsiveness). One read of the package's files counts as one call: all five files at bootstrap and re-anchoring, and otherwise the four pick-up files, `state.md`, `messages.md`, `discussions.md` and `decisions.md`, `work.md` being read again only when it has changed. A write to the package's files with a brief counts as one write set, so the five-call budget is not spent before the first launch. After bootstrap the coordinator reads only what changed since its last read, plus the entries that bear on the question, not every decision and query at each owner message. The owner report's `## Queries` is rendered from `discussions.md`'s `## Open`.

The closing thread line identifies the work to pick up; no session is given a copyable send or resume prompt beyond the [restart suggestion](standards-coordination.md#banner) when one of its triggers holds. Before acting, the coordinator verifies the id and exact label against `work.md` and grounds itself in the primary checkout of the repository holding the package. It re-bootstraps, re-reads the package and takes stock from the decisions log, `ki agent status`, `messages.md` and the owner's messages, then follows the state-specific first steps above and restarts authorised work. Whatever must be done first on pick-up is an important `FIRST-STEP` line in `messages.md`. Work that others wait on writes `READY` into territory work's `messages.md`, and territory work then identifies each waiting piece by its thread line in its own order.

Sources: PICKUP-PRINCIPLE and PICKUP-READS in [the decision register](sources.md#decision-register).

## Recovering a session showing a red x

A red x in the editor's session list means the backend turn errored, not that the work is lost: the work package holds everything it needs. The recovery:

1. Do not open a new session first. Ask the same session to pick up the work identified by its closing [thread line](standards-coordination.md#banner). If it replies, it re-anchors, strikes the mark, gives a fresh summary since the mark and takes stock.
2. If the editor will not send into the session, open a new one in the same project folder and identify the work by its id and exact label from the thread line. The coordinator verifies both against `work.md` before acting; the old transcript becomes history.
3. The recovered coordinator reports, under take stock, what it missed and what it did about it, and that one report's `## Done` carries a line saying the session was recovered and when, in UTC.

Sources: RED-X-RECOVERY in [the decision register](sources.md#decision-register).

## Targeted refresh and landed notices

**Targeted refresh.** After an approved method change lands, the sender writes one dated `REFRESH` line, flagged important so that it is taken before ordinary lines, only into the `messages.md` of works whose `method_read` predates the change and whom the change affects, linking the standard at its revision and stating the practical effect in a sentence. While Ways of working is defining the method it sends these lines itself, and afterwards territory work sends them under [Stewardship of continual improvement](standards-territory.md#territory-work). A sender may replace its own earlier `REFRESH` line not yet acted on, so changes coalesce, and the replacement keeps every pending effect of the line it replaces. The receiver rereads at its next safe point, before launching further work. Held work is not woken; the line waits. The bootstrap and update revision checks above stay as the fallback.

**Landed notices.** When Ways of working delivers a change that a thread asked for, or that changes how a thread works, it sends that thread a targeted `REFRESH` line, under the rule above, saying what landed and what it changes for that thread. A coordinator that takes such a line, or finds its `method_read` behind at bootstrap, says in its next reply, in a line or two, how its own behaviour has changed, naming the Ways of working change; it needs no acknowledgement message, since setting `method_read` remains the confirmation.

Sources: REFRESH-TARGET, WOW-REFRESH and LANDED-NOTICE in [the decision register](sources.md#decision-register).
