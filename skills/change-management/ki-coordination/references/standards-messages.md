# Coordinating-work standard: messages and surfaces

This file holds messages between work and the surfaces a coordinator reads. It extends [the core](standards-coordination.md).

## Messages between work

Any coordinator may message other work; the State of play also spreads common instructions and routes new units. Rules go to their durable owner, a skill or a Decision Record. A line goes into the receiving package's `messages.md`, its incoming queue, which travels between hosts through Git, so a line reaches work wherever and whenever it is next picked up. Writing a line is a send to that work.

- **Place and shape:** one line in the receiver's `messages.md`, in the shape, length and commit subject of the `ki-work-package` [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines).
- **Priority order:** lines stand in priority order, top first.
  - An ordinary line goes at the end; a State of play dispatching may place a line where its priority warrants.
  - An important line, `- IMPORTANT · <date> · <TAG> · <sender label> (<sender id>): ...`, goes above every ordinary line and is taken first. Important lines are taken in order, one at a time, never grouped or reordered.
  - A method change, a `REFRESH` or a stop-and-redirect goes in as an important line, and `FIRST-STEP` lines are important lines. This is how the State of play changes how a work works.
- **Sender:** any coordinator in the same Capital.
  - Its only write into the receiver's package is adding its own line, or replacing its own line not yet acted on. It checks that path under the `ki-git` [checks before committing](../../../governance/ki-git/references/standards-git.md#checks-before-committing) rule, commits it alone and pushes at once.
  - The State of play routes the owner's dumps and anything with no owning work, may write into its territory's Project notes to dispatch work, and alone writes to another Capital, through that Capital's State of play.
  - The owner, through the Observatory, is also a sender: it writes one consolidated feedback package, `feedback/<date>-<slug>.md`, into the package of the work that produced the document, and one line linking it, committed together, under the `ki-work-package` [entry points](../../../governance/ki-work-package/references/standards-work-package.md#entry-points).
  - Other owner feedback on a document is an ordinary line, added by the owner or written word for word from the owner's words by the work's own steward, naming the owner as speaker.
  - [Seeding](standards-territory.md#territory-work) is the only exception that creates a package for a first line; otherwise the one-line write boundary holds.
- **Receiver:** the coordinator pulls fast-forward, then reads `messages.md` at bootstrap, every pick-up, every owner message, every wake, every Summary and before launching work.
  - It takes `IMPORTANT` lines first, then ordinary lines from the top, grouping similar ordinary lines into one unit of work where that makes sense.
  - It records each line's disposition where it lands, in `decisions.md`, `state.md` next steps or `discussions.md`, then removes the line in a commit that names it and every line grouped with it. That commit is the receipt, not necessarily completion of the requested work.
  - A line it cannot act on yet stays, with an open query naming it; the line may point to that query.
  - A line linking a feedback package is taken with its package: the receiver records each point's disposition where it lands, and the package stays until a tidy finds every point homed.
  - Where the work has no active session, its State of play takes the queue for it under [acting for idle work](standards-territory.md#territory-work).
- **Route receipt:** a routed work cannot reject what it is given, and a line confers no execution authority. The receiver does what it can with each line:
  - the part its existing authority covers goes into `state.md` next steps;
  - the part needing the owner's authority, capacity or a scope change becomes a query in `discussions.md`;
  - only the part it judges is not its own goes back, once and with the reason, to the `messages.md` of the State of play that routed it, main or secondary. It returns a part only after doing what it can with the rest, and never the whole.
- **Handoffs and rollouts:** a handoff or rollout to other work or another repository is a line in the receiving work's `messages.md`, or the State of play's where no work owns it, never a record in the receiver's roadmap or triage.
  - Only genuinely deferred work the receiver owns may become a record, captured by the receiver's own coordinator under the `ki-next` [capture rule](../../ki-next/references/standards-next-work.md#capture-substantive-prospective-work). The sender never writes it.
  - A route `ki-trades` declares keeps its trade records.
  - A proposed transfer of work goes at the bottom of the Summary's Queries, naming the receiving package and asking permission before sending, unless the owner has already authorised that transfer. Existing authorised routes, replies and refreshes need no repeated permission.
- **Urgent work:** a unit is urgent only when it carries a stated deadline or rolls out a process change other work must follow; not everything is an escalation. Urgent work goes straight to the live leader on the escalation path, without waiting on an ACK:
  1. The sender hands it to the owning work's live worker, where one is live, as an `URGENT` line in that work's `messages.md`.
  2. Otherwise it writes the same line for the record and at once sends it to the nearest live leader up the owner's `parent` chain: its State of play, then the territory's main State of play, which judges the urgency and delegates within its own authority.
  3. Whoever takes it writes the ACK line back to the sender.
  4. Only where no leader on the path is live and the unit lies within the sender's own authority, the sender does it through a detached run, then replaces its original line with a `SUPERSEDED` line naming the run and its commits, for the owner to adjust or tidy later. Outside the sender's authority it goes to the owner as a blocking query.

  A worker is **live** when its `workers` entry in `state.md` says `status: active` and `listening: on`, and its package or Agora shows activity within the last 30 minutes. Agora reads the register and is not a second source. The line shapes are the `ki-work-package` [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines); a line still confers no execution authority on whoever takes it.
- **Broadcasts:** a line to many packages is one line in each receiver's queue and one Outbound line per receiver. A broadcast such as `REFRESH` is a pointer to the standard at its pinned revision, under the `ki-work-package` [Messages lines](../../../governance/ki-work-package/references/standards-work-package.md#messages-lines).
- **Release notices:** after an authorised release, the releasing territory owner or coordinator sends each affected owning work a release notice in its `messages.md`, or in the receiving State of play's queue where no clear owner exists. It names the released version, the relevant change, compatibility, adoption steps and any reply needed, within the existing sender and cross-territory boundaries. The receiver owns adoption and any genuinely deferred record. The notice is an obligation only: it grants no release authority, consumer selection, rollout execution or foreign-record creation.
- **Inbox check at each wake:** each wake of the [watcher](standards-listening.md#inbox-watch) compares `messages.md`'s last commit and the harness revision with what was last read, and acts on a new line at once, in queue order, without stopping running work. Nothing adds a wake where none is armed: the State of play acts for work that is not listening under [acting for idle work](standards-territory.md#territory-work), and shows the age of any line it leaves.

Sources: MESSAGES-ASYNC, WORK-QUEUE-PRIORITY, FEEDBACK-AS-MESSAGE, ROUTE-RECEIPT, HANDOFF-AS-MESSAGE, URGENT-CRITERIA, ROUTE-UP, HOW-WE-WORK, LIVENESS, BROADCAST-FORM and BROADCAST-POINTER in [the decision register](sources.md#decision-register).

## Surfaces

A coordinator receives lines from other work through its package's `messages.md`, which travels through Git, and from a run through the run's inbox, `~/.local/state/ki/agents/<run>/inbox.md`. `ki agent send <run> <line>` writes the inbox, dating the line and naming the sending run, and the run's next `ki agent status` shows it. Where the runtime can message another live session on the same machine, as Claude Code can and Codex cannot, the sender may also nudge a live session with one runtime message naming the entry.

**A backend reply is not visible progress.** A reply to a nudge, or an inbox acknowledgement, counts only once it is on a surface the owner looks at. The receiving coordinator writes what it did into its next owner-facing turn and its `state.md`; the sender keeps the item under its tag, as "acked by backend, not yet visible", until then.

| Surface | Carries | Who writes it | When |
| --- | --- | --- | --- |
| Transcript | Owner turns and the coordinator's own replies; nothing injected | The coordinator, in its report | Every owner-facing turn names the lines received and acted on since the last one |
| Package | `work.md` and `state.md` front matter, which the Observatory reads; the `messages.md` queue; parked tags in `discussions.md` | The coordinator, under the work-package standard; other work writes only its own `messages.md` line | `state.md` at every send, receive, mark and hold; `work.md` when the definition changes |
| Work status | `ki work status --format json`, schema `ki/work-status/v1`, and the five views | `ki`, reading every package | On demand; the Observatory reads only this |
| Notification | Line received, acknowledgement sent, session recovered, session errored | Not this standard | The notification record in Knowledge Islands Principal owns the channel |

A sender that only nudged, without writing the `messages.md` line or inbox entry, has not sent. The inbox is machine-local: a line that must reach work on another host, or on hold, goes into its `messages.md`.

Sources: SURFACES-RULE in [the decision register](sources.md#decision-register).
