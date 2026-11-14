# Coordinating-work standard: listening and host sync

This file holds the inbox watch, the two session capabilities and host sync. It extends [the core](standards-coordination.md).

## Inbox watch

- **Inbox watch:** a coordinator listens only once the owner expressly asks, in words such as "listen for messages" or "keep listening", and logs the request in `decisions.md`. A Rig host sync thread, `personal.reg.rig-<host>`, listens by its role, because [host sync](#thread-capabilities) implies listening. A coordinator never asked does not listen. "stop the wake" or "stop listening" ends listening until the owner asks again.
- **When:** while a listening coordinator is open and its work is not draining, On hold or Finished, it keeps one watcher armed, whoever holds the work. Work [Snoozing](standards-holds.md#putting-work-on-hold) keeps it armed On hold too.
- **The watcher:** one long-running detached shell loop that spends no model time. The heartbeat while runs go is separate and stays, listening or not, and joins the watcher in one loop.
  - Every couple of minutes it fetches and fast-forwards local `main` silently and compares the Git object of the work's `messages.md` with the one it started from, reading no content.
  - It exits only on news: a new line in `messages.md`, a run in this coordinator's group finishing, or a pull that cannot fast-forward, which needs a resolve.
  - It has no timed bound while idle, so a quiet period brings no wake, no tool calls and no chat line.
  - Polling is the baseline. AHP may later replace the polling, and only the polling, for an agent host the `ki-agentic-radar` radar shows supports it, under [The Cairn Beacon](standards-messages.md#the-cairn-beacon).
- **At a wake:** speak only about what landed. On a new line, act on it under [Messages between work](standards-messages.md#messages-between-work), commit, re-arm and tell the owner in one timed line what was done. On a finished run, receive it in one timed line and re-arm.
- **One loop:** a coordinator never holds more than one loop. After a compaction or a recovery it checks whether one is armed before arming another.
- **Session-bound:** the watcher lives and dies with the session. It is a session wake, not a scheduled agent, and promises nothing once the session closes. A runtime with no proven way for the watcher's exit to wake the session checks the inbox only at owner messages and run events, and shows not listening.
- **Open questions:** a shared shell command for the watcher, and each runtime's wake, remain with the owner.
- **Listening line:** the [banner's listening line](standards-coordination.md#banner) shows `👂 listening` while the watcher is armed, `listening_status: on`, and `🔇 not listening` otherwise, `listening_status: off`, which is the default:
  - while draining, from `pause`, `done for now` or `drain` until the drain ends, because a drain stops listening;
  - On hold and paused;
  - after "stop the wake" or "stop listening";
  - where the runtime cannot be woken;
  - where the owner has not asked the session to listen and it is no host sync thread, `listening_enabled: false`.

  The line appears in every structure that carries it, whatever the capability. Work [Snoozing](standards-holds.md#putting-work-on-hold), the idle hold included, keeps `👂 listening`.

Sources: INBOX-WATCH, LISTEN-STATUS, LISTEN-OPT-IN, QUIET-LISTEN and WAKE-SESSION in [the decision register](sources.md#decision-register).

<a id="thread-capabilities"></a>

## Session capabilities

A coordinator may hold two capabilities. Each is switched on only by the owner's express word, logged in `decisions.md`, or by an agreed role, such as a Rig host sync thread's. `state.md` records them in four fields under the `ki-work-package` [state file](../../ki-work-package/references/standard-work-package.md#45-the-state):

| Field | Values | Set |
| --- | --- | --- |
| `listening_enabled`, `syncing_enabled` | `true` or `false` | when the owner's word or the agreed role grants the capability; cleared only when the owner withdraws it |
| `listening_status`, `syncing_status` | `on` or `off` | each `_status` at every arm, stop, drain, hold and resume |

- `syncing_enabled: true` requires `listening_enabled: true`: a syncing session always listens.
- "stop the wake" or "stop listening" sets the status to `off` and keeps the capability.
- The close-out at [Finished](standards-mark.md#finishing-project-work) clears both `_enabled` fields.

**Listening.** The coordinator keeps the [watcher](#inbox-watch) armed. At each wake it also makes at most one small tidy of its own package, within the turn budget:

- keep `state.md`'s front matter and next steps true;
- prune received reports and spent briefs under the `ki-work-package` [tidy rules](../../ki-work-package/references/standard-work-package.md#410-the-tidy);
- strike a decision, or cut it to a one-line pointer, once a durable home carries it, under the [decisions life cycle](standards-decisions.md#decisions-life-cycle);
- clear answered entries from `discussions.md`;
- raise what it cannot settle as a query.

It mentions a tidy only when something needs the owner. It never edits another package; it may flag a problem there with one line in that package's `messages.md`.

**Host sync.** The coordinator is its Mac's sync thread. It repeats each pass until the Mac and GitHub are clean and level, or something needs judgement, and only then waits for its next slot. A quiet pass says nothing, a pass that changed something says at most one short line, and only a matter for judgement or the owner gets a full report. Host sync implies listening.

The banner shows only the listening status, `👂 listening` or `🔇 not listening`. Host sync has no banner line, because Cairn keeps the machines in sync through each machine's household package; the `syncing_enabled` and `syncing_status` fields stay in `state.md`.

Sources: THREAD-CAPABILITIES, FOOTER-CAPABILITY-STATUS-2, LISTEN-OPT-IN, LISTEN-TENDS-PACKAGE, SYNC-UNTIL-CLEAN, SYNC-QUIET, SYNC-LINE-OFF and REPLY-FORMAT in [the decision register](sources.md#decision-register).
