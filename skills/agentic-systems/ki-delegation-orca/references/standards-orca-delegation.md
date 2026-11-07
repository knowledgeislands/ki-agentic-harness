# Orca delegation standard

How a Knowledge Islands coordinator uses Orca orchestration as its launcher. It adapts the portable [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md) to Orca and changes none of it beyond the one named report-homing exception the run packet carries; the coordinating work's own rules stay in the [`ki-coordination` standard](../../../change-management/ki-coordination/references/standards-coordination.md). The interim rules and trial tests that hold until Orca behaviour is proved sit in [the migration file](standards-orca-delegation-migration.md), which defers to this standard.

## Contents

- [Evidence and status](#evidence-and-status)
- [When Orca launches](#when-orca-launches)
- [Start](#start)
- [Wait](#wait)
- [Status, steering and stopping](#status-steering-and-stopping)
- [Receive and close-out](#receive-and-close-out)
- [Recovery after a coordinator session changes](#recovery-after-a-coordinator-session-changes)
- [Queueing](#queueing)
- [Ids, briefs and reports](#ids-briefs-and-reports)
- [Questions](#questions)
- [Commits](#commits)
- [What stays in Knowledge Islands](#what-stays-in-knowledge-islands)
- [Known gotchas](#known-gotchas)
- [Runtime binding](#runtime-binding)

## Evidence and status

Kris took ORCA-SKILL-NOW a) on 1 November 2026, "go with what you recommend on the Orca skills now", and named the adapter `ki-delegation-orca` under ORCH-NAME-DISPATCH a) the same day. The draft came from the Orca launcher proposal and the trial log of `ki.prj.orca-evaluation` in Knowledge Islands Principal, on sol with Orca 1.4.244 to 1.4.245. On 7 November 2026 Kris settled its open points in `ki.reg.guilds`: each took its reviewed option a), except RUN-HANDOVER, which took b), a test in the next trial, and ONE-LAUNCHER, which closed with no rule.

Every rule below rests on one of two grounds, named beside it: **proved**, Orca behaviour observed in Knowledge Islands use and recorded in the trial log, or **decided**, an owner decision held by its owning work or standard. A decided rule whose Orca behaviour is not yet exercised says so.

## When Orca launches

- **Reach.** Orca launches runs only on attended Macs, and only for work packages that opt in by a logged owner decision; `ki agent` is the only launcher on `vega`, and stays the maintained launcher on any host without Orca and for any package without an opt-in. Decided: ORCA-REACH a), 30 October 2026, held in the background-run standard's [Reference launcher](../../../governance/ki-delegation/references/standards-background-runs.md#reference-launcher).
- **Opt-in.** A package opts in by a decisions-log entry, as ORCA-OPTIN b) of 30 October 2026 does for `ki.prj.orca-evaluation`: "this Project dispatches all its runs through Orca on attended Macs until Kris revokes it". Each opt-in says what it covers, such as hosts or kinds of run; there is no one-launcher-per-host rule. Decided: ORCA-OPTIN b), and ONE-LAUNCHER closed with no rule on 7 November 2026.
- **One launcher per unit.** Each dispatched unit has exactly one launcher answerable for it, recorded with the unit at dispatch in the decisions log. Before dispatching, the coordinator checks both the decisions log and the live running work, `ki agent status` and the Orca Run's `worker-list`, because two Macs or two sessions could each pass a Git-synced log check before either pushes; a unit already recorded or running is not started again. Decided: ONE-LAUNCHER-UNIT a), 7 November 2026.
- **Survival.** A run that must outlive its coordinator goes through a launcher whose workers are proved to survive it: the worker keeps working, a fresh session finds it with its progress and result, and it finishes. `ki agent` is proved; Orca's standing is in the migration file. Decided: OUTLIVE a), 7 November 2026.

## Start

1. **Run.** Create one Run per package per coordinator session with `orca orchestration run-create --objective "<work id> - <purpose>" --json`. The objective starts with the work id because that is how a later session finds the Run. Proved: the new Run of 1 November 2026 and the gotcha "Finding a Run".
2. **Worker.** Start each run with `orca orchestration worker-start --spec <brief> --task-title <run name> --worktree <worktree> --agent <claude|codex> [--model <id> --effort <level>] --json`. Claude and Codex workers started this way from a chat coordinator ran without permission prompts and nest under the coordinator's row in Orca's Agents list. Proved: TRIAL-SHAPE and four workers on 1 November 2026.
3. **Ids.** Read the Task and Dispatch ids from `orca orchestration worker-list --run <run id> --json`, not from the start receipt, which nests them. Proved: the gotcha "worker-start's receipt nests the ids".
4. **Worktree.** A writing run works in its own worktree, Orca's `new-child`, under the background-run standard's [worktree baseline](../../../governance/ki-delegation/references/standards-background-runs.md#coordination); a worker commits by pathspec, and workers that touch the same files are chained, never run in parallel. Decided: WORKTREE-OPTOUT a), 30 October 2026; proved: ORCA-DISPATCH-LEARNINGS (2).
5. **Agent.** Pass the brief's runtime as `--agent` and use Orca's own launch; switch to `orca terminal create` with `worker-start --terminal` only if a worker meets permission prompts or blocked writes. Decided: ORCA-PLACEMENT a), taken in `ki.prj.ways-of-working`.
6. **Brief as spec.** The spec is the whole rendered brief, with its tier footer, progress protocol and report rule, under the background-run standard's [prompt shape](../../../governance/ki-delegation/references/standards-background-runs.md#prompt-shape). The coordinator passes a brief already in the work folder, kept exactly as launched, and checks it first for leftover placeholders, a missing or doubled authority footer, a wrong report path and shell truncation. Passing a brief never adds authority. Proved: the four trial workers of 1 November 2026 ran this way; decided: PROMPT-RENDER a), 7 November 2026.

## Wait

- **The wait verb.** The adapter's `wait` is one detached `orca orchestration check --wait --timeout-ms 300000 --json`, one at a time, re-armed after each wake; it re-invokes a chat coordinator when a delivery arrives, on the runtime proved under [Runtime binding](#runtime-binding). Proved: TRIAL-SHAPE. The contract, one verb per launcher, one bounded waiter, wakes best effort, is decided under WAKE-SESSION a), 30 October 2026, in the background-run standard's [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) section.
- **Batches.** `check` returns the Run's oldest unacknowledged batch whole, and `--types` sets only what wakes it, so heartbeats arrive with or ahead of `worker_done`. Proved: the gotcha "Heartbeats" and `check --help`.
- **Acknowledgement.** A `worker_done` arrives as an inbox delivery the coordinator acknowledges with `orca orchestration check --ack <deliveryId>` once it has processed every message in the batch. Proved: 1 November 2026. Each heartbeat is also a delivery that Orca prompts the owner about, so heartbeats are acknowledged too. Proved: the gotcha "Heartbeats".
- **Heartbeat-only batches.** The waiter acknowledges a batch holding only heartbeats itself and waits again, so the owner is not prompted and the coordinator not woken for liveness; the five-minute bound runs from the waiter's first start, not from each re-wait. Any batch holding a `worker_done`, an `escalation`, a `question`, a message of a kind the waiter does not know, or a mix, is left whole for the coordinator. Decided: HEARTBEAT-ACK a), 7 November 2026, taking effect after the supervised trial the migration file names.
- **Unproved runtimes.** A coordinator on a runtime whose wake is not proved under [Runtime binding](#runtime-binding) does not rely on `check --wait`.
- **Durable wake.** The headless coordinator pass stays the durable wake, and no Orca automation is a wake. Decided: WAKE-DURABLE a), 30 October 2026.

## Status, steering and stopping

- **Status.** Read a worker through `worker-show --dispatch <id>`, `worker-list --run <id>` and `worker-read --dispatch <id>`. `unverifiable` liveness never means dead. Heartbeats are sent turn by turn, so a long step is silent and silence is not a stall. Proved: the gotcha "Heartbeats".
- **Steering.** Steer a running worker with `orca orchestration send --to dispatch:<id>`, or answer it with `reply`. Proved: ORCA-DISPATCH-LEARNINGS (3).
- **Stopping.** A background agent stops only when the owner names it and says stop, held in `ki-coordination` from Kris's delegation principle of 13 October 2026. The adapter's stop is `orca orchestration worker-stop --dispatch <id>`, used only on that named word; afterwards the coordinator reports whether the worker stopped and where its partial work stands. Closing or releasing a worker never stands in for stopping it. Decided: STOP-VERB a), 7 November 2026, not yet exercised; its first-use check is in the migration file.

## Receive and close-out

- **Read before redispatch.** `worker_done` reflects the worker's last step, not the run's outcome: read the report and the Git log before any redispatch. Proved: plan069 reported `failed` although its planning succeeded.
- **Report home.** At receive the coordinator copies the worker's report into the work folder, under [Ids, briefs and reports](#ids-briefs-and-reports).
- **Close-out.** Each settled worker is reused, retained at the owner's explicit request, or released with `orca orchestration worker-release --dispatch <id> --json`, only after an accepted settlement, and no reclaimable worker remains before a mark, a hold or Finished. A chat coordinator on the runtime proved under [Runtime binding](#runtime-binding) can release a worker it started, closing the worker's terminal and keeping its transcript. Decided: ORCA-CLOSE-OUT a) and CLOSEOUT-STRIKE a), held in `ki-coordination`'s [Closing out Orca workers](../../../change-management/ki-coordination/references/standards-mark.md#closing-out-orca-workers); proved: TRIAL-SHAPE, 1 November 2026.

## Recovery after a coordinator session changes

A Run is bound to the session that made it: a new chat session could not use the previous session's Run ("caller not bound"), and `run-use --takeover-legacy` works only from a live coordinator terminal, not from a chat. Proved: the gotcha "A Run is bound to the session that made it".

A new coordinator session therefore makes a new Run, finds the old one by its objective, which starts with the work id, and settles each worker under the old Run, or names it with what it still owes, without starting any unit a second time. It logs the old Run as retired in the decisions log only once every worker under it is settled or named unreachable with what it owes. Decided: RUN-RECOVERY a), 7 November 2026; it is what was done on 1 November 2026.

## Queueing

A queued run starts through Orca while its parent chat is live, and otherwise detached through `ki agent`'s dispatcher, the route recorded in its receipt. Decided: ORCA-QUEUE a), "Orca first".

Orca never starts a worker when its dependencies finish, so within one session the coordinator paces the queue itself: at the wake that settles a worker, it reads the report, confirms the next worker's dependency succeeded and that nothing conflicts, then starts the next worker, with no more than about three running, a ceiling rather than a target. A finish message alone does not prove a dependency succeeded, and during recovery no worker is started twice. Decided: QUEUE-PACE a), 7 November 2026.

## Ids, briefs and reports

- **Ids.** No Run, Task or Dispatch id is written in a work-package file. Routing lives in a machine-local record keyed by `<repository>/<work id>`, and `messages.md` stays the durable channel; an Orca `send` is only a wake. Decided: ORCA-ROUTING, folded into the Orca sub-agents design in `ki.prj.ways-of-working`.
- **Brief.** The brief sits at `+/_WORK/<id>/briefs/<run>.md` while the run is open. Decided: the background-run standard's [run packet](../../../governance/ki-delegation/references/standards-background-runs.md#run-packet).
- **Report.** The worker writes its report outside every repository, under `~/.local/state/ki/agents/<run-dir>/<name>.report.md`, and names it in `worker_done`. Proved: `ki.prj.orca-evaluation`'s four workers on 1 November 2026.
- **Report home.** No launcher homes an Orca worker's report, so the coordinator copies it into the reporting package's work folder at receive, the one named exception to the launcher as only writer in the background-run standard's [run packet](../../../governance/ki-delegation/references/standards-background-runs.md#run-packet). It copies only the report its brief named for that worker and package, never a path just because a message names it; it keeps the content unchanged; a repeat copy of the same content changes nothing; and it stops and reports if a different file already sits at the destination. Decided: REPORT-HOME a), 7 November 2026, revisiting Kris's decision of 14 October 2026 for Orca alone.

## Questions

Operational questions, those the coordinator can answer, travel by Orca's `ask`; an interrupted ask is resumed by its message id, never duplicated. Proved: plan069 and ORCA-DISPATCH-LEARNINGS (4). An unanswered ask escalates after ten minutes by default; a longer `--timeout-ms`, up to 30 minutes, avoids a duplicate. Proved: the gotcha "Asks time out".

A question only the owner can answer never goes ahead on a timeout, on silence or on a coordinator's reply in the owner's place, and a worker is never left waiting on it indefinitely. Decided: OWNER-ASK a), 7 November 2026. Its route is held open until OF-OWNER-ASK in the Orca fit design is decided; the interim route is in the migration file.

## Commits

A worker commits by explicit pathspec, `git commit -- <paths>`, in the product's repository, so a worker sharing a checkout never commits another session's staged files. Proved: ORCA-DISPATCH-LEARNINGS (2). In a hooked repository, lint-staged runs with `--no-stash`, so no backup stash is made, and a worker never runs `git stash`. Decided: HOOK-STASH a), 1 November 2026, in `ki.prj.ways-of-working`.

In an Orca trial, a worker commits its own note by explicit path inside the write window its coordinator grants by ask, under the ordinary rules, and the coordinator pushes at receive. Decided: TRIAL-PUBLISH a), 7 November 2026.

## What stays in Knowledge Islands

The work package is the record: definition, state, queries, messages and decisions in Git. Orca's Runs, Tasks, Dispatches and messages are host-local and may be lost; no decision rests on them when each report copies every ask's question, options, answer and message ids and the decisions log records the outcome. Proved: plan069, checked at its `worker_done`. Orca's state is never hand-edited: a hand edit stopped Orca starting on terra, and it was recovered only with `orca profile state rollback --backup <id>` from Orca's own backups. Proved.

## Known gotchas

Each is proved in the trial log.

- **Shared index.** Workers sharing a checkout share its Git index with other sessions: commit by pathspec and chain workers that edit the same files.
- **Repository moves.** A project removed and re-added at a new path gets a new identity and its chats stay with the old one; for a move, leave a link at the old path and keep the Orca project registered there.
- **Row label.** An armed waiter makes the coordinator's row lead with "Monitoring background tasks"; this is deliberate Orca behaviour and no setting changes it.
- **Question card.** Multi-line text in an `AskUserQuestion` card renders as one paragraph; put context in chat text above the card, as `ki-coordination`'s interactive pass does. Reported upstream as stablyai/orca#36830.
- **Nesting.** A detached `ki agent` run cannot nest under its coordinator's row: only Orca's own orchestration records carry the parent link.

## Runtime binding

Orca supervises both agent runtimes the brief may name; Knowledge Islands has proved them unevenly.

| Runtime | As a worker | As the coordinator |
| --- | --- | --- |
| Claude Code | Proved: starts and runs without permission prompts, 1 November 2026 | Proved: a detached `check --wait` re-invokes the chat when a delivery arrives, and the chat can release a worker it started, under TRIAL-SHAPE on 1 November 2026 |
| Codex | Proved: starts and runs without permission prompts, 1 November 2026, and planned a tools-rig record in plan069 | Unproved: whether `check --wait` has a detached form that re-invokes a Codex session is CODEX-WAKE, held in the migration file |
