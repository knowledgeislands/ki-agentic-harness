# Coordinating-work standard: holds

This file holds draining, the paused hold, Snoozing and release. It extends [the core](standards-coordination.md).

## Putting work on hold

On hold is the Work Process note's state, with its two reasons: paused, and more expected, which this standard calls Snoozing. Drain is the activity into a hold, never a state.

- A hold is agreed only from With supervisor: the owner says `pause` or `done for now`, and a coordinator may propose one in its send. The one exception is the idle hold below, which the worker sets itself.
- A hold serves a move between hosts, closes work for a period or rests it between waves. It never says which host the work comes back up on.
- A conversational session's ad hoc work goes On hold through a `state.md` update, with no Stop.

**First steps.** Read `IMPORTANT` lines first, cancel every wake this session holds, the watcher included, and report whether anything is still running, queued or scheduled. Work going Snoozing re-arms the watcher once the snooze lands.

**The drain**, in order:

- **Wrapping up:** leave nothing running or queued. Let each agent that will finish within about 15 minutes finish. Stop each other agent at a safe point, recording where it stopped and how to restart it in `state.md`'s next steps, with its brief kept open in its focus folder or `briefs/<run>.md`. Finish small open items where possible, through a run if needed. Start no new work once the drain begins. Reuse, retain or release every settled Orca worker the work started, under [Closing out Orca workers](standards-mark.md#closing-out-orca-workers).
- **Committing:** in every repository the coordinator or its agents touched, commit your own work by explicit path under the repository's gate and `ki-git`. Pull fast-forward only into a clean checkout, under [Committing the work folder](standards-coordination.md#committing-the-work-folder), and push under [Pushing beneath other sessions](standards-sync.md#pushing-beneath-other-sessions): stacked commits go with your own and stay out of the report. Never use `--no-verify` or force-push. Name another session's uncommitted file in `## Left over` and leave it alone.
- **Tidy first:** before any hold, paused, Snoozing or idle, the package keeps nothing already dealt with, under the `ki-work-package` [tidy before a hold](../../ki-work-package/references/standard-work-package.md#410-the-tidy). The rubric fails a held package that still does.
- **Parking:**
  - strike the mark under [The mark](standards-mark.md#the-mark), strike decisions under the [decisions life cycle](standards-decisions.md#decisions-life-cycle) and prune the package;
  - move every open query from `## Open` to `## Parked` in `discussions.md`, with its tag, one line of context and its recommended option;
  - carry every held item, parked item and waiting-on item into its home in the package, with its release condition where it has one, so nothing outstanding is left only in the session;
  - write `state.md`'s next steps for when the work is back in use;
  - copy into the package anything its agent host keeps that is needed to resume, and remove re-copied retired reports by explicit path;
  - set `state.md`'s front matter to `state: on-hold`, with `hold.reason` (`paused`, or `more-expected` for Snoozing), `hold.release` in words, and `since`;
  - commit with the subject `docs(work): <id> hold, paused` or `docs(work): <id> hold, snoozing`, and push. Make no baseline or empty commit.
- **Report:** the Stop, trigger T3 in the [coordinator reply format](standards-report-forms.md#triggers), is the send that announces the hold, and nothing else is said.
  - Form line `**Stop at <local time> · mark <local time>**`, under the [report heading](standards-report-forms.md#banner-detail); the state shows only in the banner heading.
  - Sections `## Done`, one line per repository; `## In Progress`, holding Left over, another session's uncommitted file, or `Nothing`; and `## Queries`, holding the tags parked in `discussions.md`, one line each, with no **Context**, **Query**, **Options** or reply block.
  - The On hold or Snoozing banner, listing nothing waiting under [Banner](standards-coordination.md#banner): counts `⏸️ drained · 🅿️ <n> queries parked`, or `💤 waiting for a message · 🅿️ <n> queries parked`; items only `[parked]` and `[release]`.
  - The thread line is the last line; no send or resume prompt follows. Nothing about pushes appears beyond a failure.

**Other cases:**

- **Cannot drain:** work with unpushable changes, or a run that must not be stopped, stays With worker, blocked. Its report says in one line what is blocking and ends with its thread line.
- **Drain without hold:** `drain` alone stops launching while the work stays With worker. When everything has finished, the report's `## Done` carries `DRAINED`, or `NOT DRAINED` with what remains. Any explicit drain check, such as "are we drained?", puts its result in `## Done` the same way. The thread line stays last.
- **Territory hold:** the owner issues it through the State of play. Every piece of Project work goes on hold first and the State of play last. The State of play's `state.md` next steps name the work that restarts when the hold lifts and the work that stays on hold.
- **Snoozing:** a hold that waits for more to come, `💤 Snoozing (on hold)`. It replaces the more-expected hold and the listening hold.
  - The owner asks in words such as `snooze`, "hold on snooze waiting for a message" or "done for now, more to come". Regular work rests Snoozing between occurrences, and a Project may rest Snoozing between waves.
  - Log the request in `decisions.md` and drain as above. Once the snooze lands, re-arm the one watcher and set `listening_status: on`, and `listening_enabled: true` where the owner asked it to wait for a message.
  - `hold.release` reads `a message arrives, or resume`.
  - Banner, under the [one table of states](standards-coordination.md#banner): heading `### 💤 Snoozing (on hold) · at <time>`; counts `💤 waiting for a message · 🅿️ <n> queries parked`, never `drained`, because the coordinator still listens; items `[parked]` and ``[release] a message arrives, or `resume` ``; then `👂 listening`.
  - A new line in `messages.md`, or new work arriving, releases it under **Release** and the coordinator acts on it.
  - "stop the wake" or "stop listening" sets `listening_status: off` and shows `🔇 not listening`. The work stays Snoozing until `resume`, or a line its State of play handles under [acting for idle work](standards-territory.md#territory-work).
  - Once the session closes, the State of play acts for the snoozing package on its lines alone.
- **Idle:** a worker may put its own work into Snoozing by itself, the idle hold, and into no other hold.
  - It may go idle only while all five hold: no run running or queued; nothing in handoff to a target; no unprocessed line in `messages.md`; no open query with the owner in `discussions.md`, parked queries allowed; every repository the work touched committed and pushed. Any query with the owner keeps the work With supervisor.
  - The package is tidied first, as for any hold, but idle needs no drain and no Stop. Set `state: on-hold`, `hold.reason: more-expected`, `hold.set_by: worker`, `hold.release: a message arrives, or resume` and `since`; commit `docs(work): <id> hold, idle`; say so in one line.
  - The banner is Snoozing's, with the heading `### 💤 Snoozing (on hold) · idle · at <time>`. It listens only while `listening_enabled` is true.
  - A line arriving on a listening idle coordinator is received at once, moving the work straight to With worker, not Handoff to worker, because the worker is already there.
  - The owner's `pause`, `done for now` or `snooze` turns an idle hold into the owner's form, `hold.set_by: owner`. A hold with no `set_by` was set by the owner.
- **Paused work and important lines:** a paused hold stays closed to every line, `URGENT` and `IMPORTANT` included. The line waits unread. The State of play, acting for the held work under [acting for idle work](standards-territory.md#territory-work), shows the count and puts an important or urgent line to the owner as a `resume` query in its own `discussions.md`; the package stays paused until the owner answers. A sender with genuinely urgent work sends it to a live owner under [Urgent work](standards-messages.md#messages-between-work), not into the paused queue.
- **Release:** `resume`, the release condition being met, or, while Snoozing, a new line or new work, moves the work to Handoff to worker. The coordinator re-reads the package, moves the parked queries back to `## Open` in `discussions.md` and starts from `state.md`'s next steps. `finish` moves the work to Finished. A paused hold older than 31 days is flagged in the views.

Sources: HOLD-DRAIN, HOLD-NAMES, HOLD-TIDY, SNOOZE, DRAIN-END, TERRITORY-HOLD, SNOOZE-STATE, SNOOZE-HEADING, HOLD-IDLE, HOLD-SELF, HOLD-LISTEN and HOLD-URGENT in [the decision register](sources.md#decision-register).
