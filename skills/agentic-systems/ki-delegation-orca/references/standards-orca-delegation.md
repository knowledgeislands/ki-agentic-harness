# Orca delegation standard

How a Knowledge Islands coordinator uses Orca orchestration as its launcher. It adapts the portable [background-run standard](../../../governance/ki-delegation/references/standards-background-runs.md) to Orca and changes none of it; the coordinating work's own rules stay in the [`ki-coordination` standard](../../../change-management/ki-coordination/references/standards-coordination.md).

## Contents

- [Evidence and status](#evidence-and-status)
- [When Orca launches](#when-orca-launches)
- [Start](#start)
- [Wait](#wait)
- [Status and steering](#status-and-steering)
- [Receive and close-out](#receive-and-close-out)
- [Recovery after a coordinator session changes](#recovery-after-a-coordinator-session-changes)
- [Queueing](#queueing)
- [Ids, briefs and reports](#ids-briefs-and-reports)
- [Questions](#questions)
- [Commits](#commits)
- [What stays in Knowledge Islands](#what-stays-in-knowledge-islands)
- [Known gotchas](#known-gotchas)
- [Runtime binding](#runtime-binding)
- [Open points](#open-points)
- [Proposed change to `ki-coordination`](#proposed-change-to-ki-coordination)

## Evidence and status

Kris took ORCA-SKILL-NOW a) on 1 November 2026, "go with what you recommend on the Orca skills now", and named the adapter `ki-delegation-orca` under ORCH-NAME-DISPATCH a) the same day. This standard is drafted from the Orca launcher proposal and the trial log of `ki.prj.orca-evaluation` in Knowledge Islands Principal, on sol with Orca 1.4.244 to 1.4.245.

Every rule below rests on one of two grounds, named beside it: **proved**, Orca behaviour observed in Knowledge Islands use and recorded in the trial log, or **decided**, an owner decision held by its owning work or standard. A statement the proposal could support only by reasoning is not a rule here: it is listed under [Open points](#open-points) with its tag, for the owner to take or change.

## When Orca launches

- **Reach.** Orca launches runs only on attended Macs, and only for work packages that opt in by a logged owner decision; `ki agent` is the only launcher on `vega`, and stays the maintained launcher on any host without Orca and for any package without an opt-in. Decided: ORCA-REACH a), 30 October 2026, follow-up due 6 November 2026, held in the background-run standard's [Reference launcher](../../../governance/ki-delegation/references/standards-background-runs.md#reference-launcher).
- **Opt-in.** A package opts in by a decisions-log entry, as ORCA-OPTIN b) of 30 October 2026 does for `ki.prj.orca-evaluation`: "this Project dispatches all its runs through Orca on attended Macs until Kris revokes it". Decided.
- **Hosts and runs.** Whether the opt-in also fixes one launcher per package per host, and whether a run that must outlive its coordinator stays with `ki agent`, are open points ONE-LAUNCHER and OUTLIVE.

## Start

1. **Run.** Create one Run per package per coordinator session with `orca orchestration run-create --objective "<work id> - <purpose>" --json`. The objective starts with the work id because that is how a later session finds the Run. Proved: the new Run of 1 November 2026 and the gotcha "Finding a Run".
2. **Worker.** Start each run with `orca orchestration worker-start --spec <brief> --task-title <run name> --worktree current --agent <claude|codex> [--model <id> --effort <level>] --json`. Claude and Codex workers started this way from a chat coordinator ran without permission prompts and nest under the coordinator's row in Orca's Agents list. Proved: TRIAL-SHAPE and four workers on 1 November 2026.
3. **Ids.** Read the Task and Dispatch ids from `orca orchestration worker-list --run <run id> --json`, not from the start receipt, which nests them. Proved: the gotcha "worker-start's receipt nests the ids".
4. **Worktree.** `--worktree current` is the default; a worker commits by pathspec, and workers that touch the same files are chained, never run in parallel. Proved: ORCA-DISPATCH-LEARNINGS (2). A writing run moves to its own worktree, Orca's `new-child`, when the background-run standard's [worktree baseline](../../../governance/ki-delegation/references/standards-background-runs.md#coordination) takes effect. Decided: WORKTREE-OPTOUT a), 30 October 2026.
5. **Agent.** Pass the brief's runtime as `--agent` and use Orca's own launch; switch to `orca terminal create` with `worker-start --terminal` only if a worker meets permission prompts or blocked writes. Decided: ORCA-PLACEMENT a), taken in `ki.prj.ways-of-working`.
6. **Brief.** The spec carries the whole brief, with its tier footer, progress protocol and report rule, under the background-run standard's [prompt shape](../../../governance/ki-delegation/references/standards-background-runs.md#prompt-shape). Decided there. How the brief is rendered for Orca is open point PROMPT-RENDER.

## Wait

- **The wait verb.** The adapter's `wait` is one detached `orca orchestration check --wait --timeout-ms 300000 --json`, one at a time, re-armed after each wake; it re-invokes a chat coordinator when a delivery arrives, on the runtime proved under [Runtime binding](#runtime-binding). Proved: TRIAL-SHAPE. The contract, one verb per launcher, one bounded waiter, wakes best effort, is decided under WAKE-SESSION a), 30 October 2026, in the background-run standard's [run queue](../../../governance/ki-delegation/references/standards-background-runs.md#run-queue) section.
- **Batches.** `check` returns the Run's oldest unacknowledged batch whole, and `--types` sets only what wakes it, so heartbeats arrive with or ahead of `worker_done`. Proved: the gotcha "Heartbeats" and `check --help`.
- **Acknowledgement.** A `worker_done` arrives as an inbox delivery the coordinator acknowledges with `orca orchestration check --ack <deliveryId>` once it has processed every message in the batch. Proved: 1 November 2026. Each heartbeat is also a delivery that Orca prompts the owner about, so heartbeats are acknowledged too. Proved: the gotcha "Heartbeats". Whether the waiter acknowledges heartbeat-only batches itself is open point HEARTBEAT-ACK.
- **Unproved runtimes.** A coordinator on a runtime whose wake is not proved under [Runtime binding](#runtime-binding) does not rely on `check --wait`.
- **Durable wake.** The headless coordinator pass stays the durable wake, and no Orca automation is a wake. Decided: WAKE-DURABLE a), 30 October 2026.

## Status and steering

- **Status.** Read a worker through `worker-show --dispatch <id>`, `worker-list --run <id>` and `worker-read --dispatch <id>`. `unverifiable` liveness never means dead. Heartbeats are sent turn by turn, so a long step is silent and silence is not a stall. Proved: the gotcha "Heartbeats".
- **Steering.** Steer a running worker with `orca orchestration send --to dispatch:<id>`, or answer it with `reply`. Proved: ORCA-DISPATCH-LEARNINGS (3).
- **Stopping.** A background agent stops only when the owner names it and says stop. Decided: Kris's delegation principle of 13 October 2026, held in `ki-coordination`. The Orca verb for it is open point STOP-VERB.

## Receive and close-out

- **Read before redispatch.** `worker_done` reflects the worker's last step, not the run's outcome: read the report and the Git log before any redispatch. Proved: plan069 reported `failed` although its planning succeeded.
- **Close-out.** Each settled worker is reused, retained at the owner's explicit request, or released with `orca orchestration worker-release --dispatch <id> --json`, only after an accepted settlement, and no reclaimable worker remains before a mark, a hold or Finished. Decided: ORCA-CLOSE-OUT a), held in `ki-coordination`'s [Closing out Orca workers](../../../change-management/ki-coordination/references/standards-coordination.md#closing-out-orca-workers). A chat coordinator can release a worker it started, closing the worker's terminal and keeping its transcript, on the runtime proved under [Runtime binding](#runtime-binding). The matching change to `ki-coordination` is [proposed below](#proposed-change-to-ki-coordination).

## Recovery after a coordinator session changes

A Run is bound to the session that made it: a new chat session could not use the previous session's Run ("caller not bound"), so on 1 November 2026 a new Run was made and the old one retired. Proved: the gotcha "A Run is bound to the session that made it". The recovery procedure is open point RUN-RECOVERY.

## Queueing

A queued run starts through Orca while its parent chat is live, and otherwise detached through `ki agent`'s dispatcher, the route recorded in its receipt. Decided: ORCA-QUEUE a), "Orca first". How the coordinator paces Orca starts within one session is open point QUEUE-PACE.

## Ids, briefs and reports

- **Ids.** No Run, Task or Dispatch id is written in a work-package file. Routing lives in a machine-local record keyed by `<repository>/<work id>`, and `messages.md` stays the durable channel; an Orca `send` is only a wake. Decided: ORCA-ROUTING, folded into the Orca sub-agents design in `ki.prj.ways-of-working`. Until that record exists, `ki.prj.orca-evaluation`'s `state.md` Run line is a logged exception under its STOCK-TAKE decision.
- **Brief.** The brief sits at `+/_WORK/<id>/briefs/<run>.md` while the run is open. Decided: the background-run standard's [run packet](../../../governance/ki-delegation/references/standards-background-runs.md#run-packet).
- **Report.** The worker writes its report outside every repository, under `~/.local/state/ki/agents/<run-dir>/<name>.report.md`, and names it in `worker_done`. Proved: `ki.prj.orca-evaluation`'s four workers on 1 November 2026. Who homes it in the work folder is open point REPORT-HOME.

## Questions

Operational questions travel by Orca's `ask`; an interrupted ask is resumed by its message id, never duplicated. Proved: plan069 and ORCA-DISPATCH-LEARNINGS (4). An unanswered ask escalates after ten minutes by default; a longer `--timeout-ms`, up to 30 minutes, avoids a duplicate. Proved: the gotcha "Asks time out". How a question only the owner can answer travels is open point OWNER-ASK.

## Commits

A worker commits by explicit pathspec, `git commit -- <paths>`, in the product's repository, so a `--worktree current` worker never commits another session's staged files. Proved: ORCA-DISPATCH-LEARNINGS (2). In a hooked repository, lint-staged runs with `--no-stash`. Decided: HOOK-STASH a), 1 November 2026, in `ki.prj.ways-of-working`.

## What stays in Knowledge Islands

The work package is the record: definition, state, queries, messages and decisions in Git. Orca's Runs, Tasks, Dispatches and messages are host-local and may be lost; no decision rests on them when each report copies every ask's question, options, answer and message ids and the decisions log records the outcome. Proved: plan069, checked at its `worker_done`. Orca's state is never hand-edited: a hand edit stopped Orca starting on terra, and it was recovered only with `orca profile state rollback --backup <id>` from Orca's own backups. Proved.

## Known gotchas

Each is proved in the trial log.

- **Shared index.** Under `--worktree current` workers share the checkout's Git index with other sessions: commit by pathspec and chain workers that edit the same files.
- **Repository moves.** A project removed and re-added at a new path gets a new identity and its chats stay with the old one; for a move, leave a link at the old path and keep the Orca project registered there.
- **Row label.** An armed waiter makes the coordinator's row lead with "Monitoring background tasks"; this is deliberate Orca behaviour and no setting changes it.
- **Question card.** Multi-line text in an `AskUserQuestion` card renders as one paragraph; put context in chat text above the card, as `ki-coordination`'s interactive pass does. Reported upstream as stablyai/orca#36830.
- **Nesting.** A detached `ki agent` run cannot nest under its coordinator's row: only Orca's own orchestration records carry the parent link.

## Runtime binding

Orca supervises both agent runtimes the brief may name; Knowledge Islands has proved them unevenly.

| Runtime | As a worker | As the coordinator |
| --- | --- | --- |
| Claude Code | Proved: starts and runs without permission prompts, 1 November 2026 | Proved: a detached `check --wait` re-invokes the chat when a delivery arrives, and the chat can release a worker it started, under TRIAL-SHAPE on 1 November 2026 |
| Codex | Proved: starts and runs without permission prompts, 1 November 2026, and planned a tools-rig record in plan069 | Unproved: whether `check --wait` has a detached form that re-invokes a Codex session is open point CODEX-WAKE |

## Open points

Each open point is a proposal or an untested question, not a rule. A coordinator meeting one takes it to the owner of its coordinating work rather than treating the proposal as settled.

| Tag | Kind | Proposal or question |
| --- | --- | --- |
| ONE-LAUNCHER | Proposal | One launcher per package per host, recorded in the package's decisions log, as ORCA-OPTIN b) does for `ki.prj.orca-evaluation` |
| OUTLIVE | Proposal | A run that must outlive its coordinator stays with `ki agent` until worker survival is proved |
| PROMPT-RENDER | Proposal | Pass the full rendered brief as the spec; a render-only `ki` step does not yet exist, so until it does the coordinator passes the brief text |
| HEARTBEAT-ACK | Proposal | The waiter acknowledges a heartbeat-only batch itself and waits again within the same bound, so the owner is not prompted and the coordinator not woken for liveness; any batch holding `worker_done`, `escalation` or `question` is left for the coordinator |
| STOP-VERB | Proposal | Stop a named run with `orca orchestration worker-stop --dispatch <id>`, only when the owner names it and says stop |
| RUN-RECOVERY | Proposal | A new coordinator session makes a new Run, finds the old one by objective, settles or names any worker still owing a decision, and records the old Run as retired in its decisions log; `run-use --takeover-legacy` works only from a live coordinator terminal and is not a chat route |
| QUEUE-PACE | Proposal | Orca never starts a worker when its dependencies finish, so within one session the coordinator starts the next worker at the wake that settles the last, keeping about three running |
| REPORT-HOME | Proposal | The coordinator copies the report named by `worker_done --report-path` into the work folder's `reports/` at receive, standing in for `ki agent`'s homing |
| WORKER-SURVIVAL | Untested | Whether a worker survives when its coordinator chat ends; left for first live use under TRIAL-SHAPE |
| DELIVERY-REPLAY | Untested | Whether an unacknowledged delivery replays on the next `check`: end the waiter before `--ack`, re-arm and see the same `deliveryId` |
| RUN-HANDOVER | Untested | Whether `run-use` moves a Run from one coordinator chat session to another |
| CODEX-WAKE | Untested | Whether `check --wait` wakes a coordinator on the second runtime named under [Runtime binding](#runtime-binding); held by `ki.prj.ways-of-working` |
| OWNER-ASK | Undecided | How a question only the owner can answer travels from an Orca worker; held by `ki.prj.ways-of-working` |

## Proposed change to `ki-coordination`

**Proposal, not adopted.** `ki-coordination`'s [Closing out Orca workers](../../../change-management/ki-coordination/references/standards-coordination.md#closing-out-orca-workers) still carries an open point on whether a coordinator in an Orca chat, rather than an Orca terminal, may release a worker it created. TRIAL-SHAPE on 1 November 2026 proved that it can: a chat coordinator released finished workers with `worker-release --dispatch <id>`, closing each worker's terminal and keeping its transcript. The proposal is to strike that open point and cite TRIAL-SHAPE as the proof, leaving the refusal fallback, naming the Dispatch as still owing a decision and closing nothing by hand, as an ordinary rule. This draft does not edit `ki-coordination`; the change waits for the owner's word.
