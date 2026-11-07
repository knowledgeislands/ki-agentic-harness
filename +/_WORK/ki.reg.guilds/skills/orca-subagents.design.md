---
note_type: streams/design
status: draft - October 2026
work: ki.prj.ways-of-working
run: ki-prj-ways-of-working
agent: orca-subagents
written_at: 2026-10-30
author: Written with Claude
---

# ki agent runs as Orca sub-agents: design

**Owning work:** `ki.prj.ways-of-working` · **Authority:** ORCA-SUBAGENTS, Kris in this thread, 30 October 2026, 07:05 GMT: "make sure that they run in the same way that Orca does so that they come through as sub agents rather than primary agents and therefore they don't congest things". Taken as design first; implementation in tools-ki goes to its owning work once the design is seen. This note adopts nothing.

**Evidence base:** Orca 1.4.244 on sol (`orca --help`, `orca orchestration worker-start --help`, `orca agent launch --help`, `orca worktree create --help`, `orca skills get orchestration` with its `placement-and-remote`, `low-level-topology`, `coordinator-loop`, `worker-contract` and `messaging-and-gates` references, `orca skills get orca-cli`, `orca status --json` from inside this run); the Orca app bundle's unpacked JavaScript under `/Applications/Orca.app/Contents/Resources/app.asar.unpacked/out/`; a read-only schema and count query of `~/Library/Application Support/orca/orchestration.db`; tools-ki at `76df015a` (`src/core/agent/processes.ts`, `runtimes.ts`, `runs.ts`, `identities.ts`). No Orca worker or terminal was started, so every claim about what the sidebar shows for a launched worker is read from code, not observed. Each claim below is marked **verified** (seen directly) or **inferred** (read from minified code or documentation, not exercised).

**Settled input, ORCA-ROUTING:** Kris chose a machine-local runtime routing record for Orca Runs, relayed from `hnr.sop.main` on 31 October 2026. The record is keyed by `<repository>/<work id>`, such as `hnr-principal/hnr.sop.main`, and holds the Orca endpoint, Run id, coordinator session, binding generation and last-verified time. `messages.md` stays the durable channel between works; `orca orchestration send --to run:<id>` is only a wake. Package files keep no Run id. The evidence is `+/_WORK/hnr.sop.main/orca-run.report.md` in hnr-principal's Git history (`5975967d`). This is decided, not proposed; sections 3, 4 and 7 are aligned to it below, and where that alignment adds detail beyond Kris's choice it is marked as proposed.

## 1. What Orca calls a sub-agent

Orca has three distinct parent-child relations. They are separate decisions in Orca's own words: "Orca lineage, Git base, filesystem isolation, coordination parentage, UI grouping, and execution host are separate decisions" (`placement-and-remote` reference).

| Relation | How a child is linked | Where it shows | Reachable by `ki agent`? |
| --- | --- | --- | --- |
| **Native sub-agents and background tasks** of an agent session | Orca reads the parent agent's own hook payload (`background_tasks` in Claude Code's hooks, `shared/claude-background-task-inventory.js`; a Codex roster in `codex-subagent-roster.js`) and its transcript (`structured-agent-session-subagent-roster.js`). It builds "child work" rows of kind `agent`, `workflow`, `command`, `monitor` or `unknown` under the parent (`shared/agent-status-child-work.js`). The renderer gives each child row `orchestration.parentPaneKey` = the parent's pane and `rowSource: 'subagent'` (`renderer/assets/store-*.js`). In the AI Vault history, Claude sub-agent transcripts under `<session>/subagents/` carry `subagent.parentSessionId` (`main/session-scanner-service-entry.js`). | Nested under the parent agent in the agents list and chat; nested under the parent session in AI Vault. **Inferred** from code. | **No.** Only the parent agent's own in-session tools produce these. An external process cannot announce child work: there is no CLI or RPC verb for it (no `childWork` RPC name in the bundle; **verified** by search). |
| **Supervised orchestration workers** | `orca orchestration worker-start` called from inside an Orca agent session. The Dispatch row records `creator_orca_session_id`, `creator_handle`, `creator_pane_key`, `creator_dispatch_id` and `depth` (**verified**: `dispatch_contexts` schema; 3 dispatches on sol, 2 carrying a creator session id). A worker's status entry carries `orchestration.{taskId, dispatchId, parentPaneKey, parentTerminalHandle, coordinatorHandle, orchestrationRunId}` (**inferred** from the main-process validator). | Grouped as a child of the coordinator in the agents list and dashboard (`DashboardAgentChildDisclosure`, "show child agents"). **Inferred**: when the creator is a _session_ rather than a terminal, Orca stores `creatorPaneKey: null` (main chunk, creator resolution), so whether a worker nests under a **chat** coordinator, which is what Kris's coordinators are (`ORCA_STRUCTURED_SESSION=1`), is not proven. | **Yes**, by calling `worker-start` with the coordinator's Orca identity. |
| **Worktree lineage** | `orca worktree create --parent-worktree <selector>` (default: the caller's context), or `orca worktree set --parent-worktree`. | A child workspace card under its parent workspace in the sidebar (`sidebar.childWorkspaces.toggle`). | Only for runs that need their own checkout; it nests the workspace, not the agent. |

The relation that matches Kris's words, a run that "comes through as a sub-agent" of the launching thread, is the second: a supervised worker. The first is what Orca itself calls a sub-agent, but it is in-session by construction, and the ki-coordination rule that "an in-session subagent is not a background agent" rules it out for KI runs. That trade-off is deliberate, not a gap this design can close.

### Why runs look like primary agents today

- `ki agent launch` spawns `claude -p ...` or `codex exec ...` as a detached process (`spawn(..., { detached: true })`, `processes.ts`). Orca neither starts nor supervises it.
- Orca's Claude status hooks, installed in `~/.claude/settings.json`, exit at once unless `ORCA_AGENT_HOOK_PORT`, `ORCA_AGENT_HOOK_TOKEN` and `ORCA_PANE_KEY` are set (**verified**). A structured chat session does not export a pane key, so a run sends Orca no live status at all.
- Each run writes its own top-level Claude transcript, which Orca's session scanner lists as a separate primary session. On sol, 384 top-level transcripts exist for ki-principal alone, 53 of them from the last 24 hours (**verified** by count). This is the congestion: dozens of unparented sessions, none tied to the thread that launched them.

## 2. The parent id and how to detect it

| Variable | Value in this run | Meaning |
| --- | --- | --- |
| `ORCA_AGENT_SESSION_ID` | `claude_55032ddf_1e2c_4e9a_a32c_1875596217d6` | The Orca agent session id of the launching thread. Orca's own CLI reads it to resolve the caller (`shared/agent-session-caller-env.js`): "Injected session identity resolves the orchestration caller without guessing a terminal. Valid only on the same host/user". Its mailbox address is `orca_session_id:<id>`. It is Orca's id, not the Claude transcript id. |
| `ORCA_AGENT_SESSION_SPAWN_TOKEN` | present, not read | "The reservation token distinguishes its live child from a process that reused the PID." A secret-like value; never logged or copied. |
| `ORCA_STRUCTURED_SESSION` | `1` | The thread is an Orca chat (structured session), not a terminal. |
| `ORCA_TERMINAL_HANDLE` | absent | Set for terminal agents and for supervised workers, whose minted handle is their address. |
| `ORCA_CHAT_SCRATCH_DIR` | the chat's scratch folder | Per-chat scratch space. |
| `ORCA_CLI_COMMAND` | `/Applications/Orca.app/Contents/Resources/bin/orca` | The executable Orca's skills say to use. |

**Detection:** a launch is inside an Orca thread when `ORCA_AGENT_SESSION_ID` is set and `orca status --json` returns `result.caller.orcaSessionId == "orca_session_id:<that id>"` with `result.caller.live == true`. The second check matters, because the variable alone is inherited (next point).

**Finding, high confidence: runs impersonate their coordinator in Orca today.** `runtimes.ts` passes `context.environment` through whole, so every run inherits `ORCA_AGENT_SESSION_ID` and the spawn token. This run is the proof: `orca status --json` run from inside it answered `caller.orcaSessionId = orca_session_id:claude_55032ddf_...`, `live: true`, the coordinator's identity (**verified**). Any run that called `orca orchestration check`, `send`, `reply` or `worker-start` would act as the coordinator, and a `check --ack` would consume the coordinator's inbox. This needs fixing whatever is decided about sub-agents.

## 3. The smallest change to `ki agent launch`

Two parts. Part A is independent and safe now; Part B waits for a pilot.

### Part A - stop leaking the coordinator's Orca identity

In `runtimes.ts`, both adapters build the child environment from `request.environment` with `ORCA_AGENT_SESSION_ID`, `ORCA_AGENT_SESSION_SPAWN_TOKEN`, `ORCA_STRUCTURED_SESSION` and `ORCA_CHAT_SCRATCH_DIR` removed. Nothing else changes: the run is still detached, visible exactly as today, and no longer able to speak for its parent. `ki agent`'s own control processes (the queue dispatcher, `dispatch.pid`) keep the full environment, because Part B needs them to act for the coordinator.

### Part B - an Orca placement for the runtime launch

When detection succeeds and the working directory resolves to an Orca-managed workspace (`orca worktree current --json` from the workdir returns a worktree), `ki agent launch` places the worker through Orca instead of `spawn`:

1. **Run.** Read the Run id from the ORCA-ROUTING record for the launching work, keyed by `<repository>/<work id>`, and pass `--run <id>` explicitly, so nothing depends on which Run the coordinator has bound. The Run id is never written into the work package. Proposed, confidence medium (it follows the settled shape, but the record's writer is not yet built): when no verified record exists for the work, `ki agent launch` does not create a Run of its own but takes the detached path in step 6, with `no verified routing record` as the reason, so that only a verified coordinator binding writes the record.
2. **Start.** `orca orchestration worker-start --run <id> --spec <prompt-file contents> --task-title <name> --worktree current --agent <claude|codex> [--model <m>] [--effort <e>] --json`, run with the workdir as the current directory. The prompt is the same composed brief, footer and progress protocol as today, plus one closing line: "After writing DONE, send `worker_done` exactly once as your Orca preamble directs, with `--outcome succeeded` or `--outcome failed`."
3. **Packet.** Record the receipt's Task id, Dispatch id and worker handle in `<name>.orca.json` in place of `<name>.pid`; the status file, report path, `DONE`, `events.jsonl` and control store are unchanged.
4. **Liveness.** Where `agentState` asks `processes.alive(pid)`, an Orca attempt asks `orca orchestration worker-show --dispatch <id> --json` and maps Orca's verdicts: `live` to running, `exited` to exited, `unverifiable` to running with that reason, never to dead. `DONE` in the status file still decides `finished`, as today.
5. **Stop and close.** `ki agent stop` maps to `worker-stop --dispatch <id>` (Orca fences and stops the agent); `ki agent close` runs `worker-release --dispatch <id>` once the run is finished and Orca reports the Dispatch settled, so settled worker terminals do not pile up, which would be the same congestion in a new place.
6. **Fallback.** Outside Orca, when detection fails, when the workdir is not an Orca workspace, for `--worktree` runs in the first cut, or when `worker-start` fails with `effectsApplied: false` in its receipt, the launch takes today's detached path, Part A applied, and the receipt says `placement: detached` with the reason. When `worker-start` fails with effects applied or an unknown outcome, the launch does not fall back, because a second agent could start: it records `claim-unconfirmed` with Orca's `failedStage` and `residualResources`, as the existing `claim-unconfirmed` path already does, and leaves recovery to the operator.

The seam already exists: `AgentProcesses.control` (`AgentControlProcesses` with `launch`, `inspect`, `terminate`, `verifyRecovery`) is declared in `processes.ts` with no implementation behind it. Part B could be that managed adapter, but its `ProcessIdentity` is PID-, birth-, session- and group-based and Orca does not hand back a PID, so an honest fit means either widening `ProcessIdentity` with an Orca dispatch identity or adding a placement field to the attempt. Placement is the smaller change and keeps the PID contract truthful; it is the shape recommended here.

**What stays the same:** the run packet layout apart from `.pid` becoming `.orca.json` for Orca attempts; the status-line and `DONE` protocol; `ki agent wait`, which watches the status file; the report path; authority footers; commit and push rules. Under ORCA-ROUTING, the run directory and `<name>.orca.json` are machine-local, like the routing record, and no Orca identifier reaches a package file. Receipts, handoffs and replies between works still go as `messages.md` lines; an Orca `send` to a Run only wakes the coordinator to read them.

**What changes for the worker:** an Orca worker is an interactive agent in an Orca terminal or chat, launched with Orca's agent-launch settings, not `claude -p --permission-mode bypassPermissions --add-dir ...`. Three properties of today's contract therefore move to Orca and must be proven in the pilot: non-interactive autonomy (Orca's `settings.agent-launch.auto-permissions` capability exists; whether Kris's setting grants it is not known), extra writable directories (`worker-start` has no `--add-dir`), and survival when the coordinator ends (Orca's terminals belong to its daemon, `orcad`, not to the coordinator; the run would survive the coordinator's session but not, unproven, an Orca restart or update). The low-level route, `orca terminal create --command "<today's argv>"` followed by `worker-start --terminal <handle>`, keeps today's exact argv; Orca's guide reserves it for "custom argv or terminal topology that worker-start cannot express", which is this case, so it is the alternative if the pilot shows the settings route cannot be made autonomous.

**Route, decided:** Part B uses Orca's own launch, `worker-start --agent`, and switches to the terminal route only if the pilot shows permission prompts or blocked writes. This is ORCA-PLACEMENT a), taken under Kris's ACCEPT-BY-CRITERIA answer of 31 October 2026 ([decisions](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/decisions.md#owner-answers-during-away-31-oct-0136-gmt-31-october-2026)). The blind review's condition comes with it: before Part B is built, the pilot must show that the Orca-launched worker meets the run contract, covering the directories the run needs, running without anyone at the keyboard, and the run's intended authority limits, so that a worker with too much access fails the test as well as one with too little.

## 4. `--wait-for` queues

Today a queued run is started later by the run's detached dispatcher (`ki agent dispatch --foreground`) when its gate opens. Orca's dependencies (`task-create --deps`) do not help: "A Run ... never schedules or places workers", so somebody must still start the worker when the gate opens.

The recommended shape keeps ki's dispatcher as the scheduler. The dispatcher was launched from the coordinator's shell and keeps its full environment (Part A strips only runtime children), so when the gate opens it calls `worker-start` with the Run id from the work's ORCA-ROUTING record and Orca resolves the caller as the coordinator, as it did for this run's `orca status`. If the coordinator's session is no longer live when the gate opens, Orca will not resolve the caller (**inferred**; test it), and the dispatcher falls back to the detached launch for that run and says so in its receipt. A queued run therefore becomes a sub-agent while its parent thread lives and a detached run after it ends, never a silent impersonation.

**Queued runs, decided:** when a queued run's gate opens, the dispatcher starts it through Orca while the parent chat is live, otherwise detached as today, and records the route and its reason in the run's receipt. This is ORCA-QUEUE a), answered by Kris in the interactive prompt on 31 October 2026 ([decisions](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/decisions.md#owner-answers-during-away-31-oct-0136-gmt-31-october-2026)). The dead-parent behaviour is still inferred; the queue test in section 5 proves it before anyone relies on it.

## 5. Tests

tools-ki tests inject `AgentProcesses`; Part B adds an injected `orca` command runner beside it, so no test starts Orca.

- **Environment hygiene (Part A):** for both runtimes, the child environment lacks the four `ORCA_*` names when the parent has them, and keeps every other variable, including `KI_AGENT_RUN`.
- **Detection:** set and live gives Orca placement; set and not live, absent, or `orca` missing gives detached, with the reason in the receipt.
- **Placement:** the exact `worker-start` argv for each runtime with and without model and effort; the Run id is created once and reused; the prompt carries the `worker_done` line only for Orca placement; `.orca.json` is written and `.pid` is not.
- **Failure:** `effectsApplied: false` falls back; effects applied or `outcome_unknown` records `claim-unconfirmed` and starts nothing else.
- **State mapping:** `live`, `exited` and `unverifiable` map as in section 3; `DONE` wins as today.
- **Stop and close:** `worker-stop` on stop; `worker-release` only after `DONE` and a settled Dispatch; never `terminal close`.
- **Queue:** a gate opening with a live parent starts through Orca; with a dead parent, detached.
- **Live pilot, outside the test suite:** one hand-started `worker-start` from an Orca coordinator chat, with Kris watching, before any tools-ki change lands, to settle the open questions below. Under ORCA-PLACEMENT it also checks the run contract for the `worker-start --agent` route: the run's directories are writable, the worker runs to `DONE` without a prompt, and it is held to the run's authority limits, failing on too much access as well as too little.

## 6. Risks

- **Nesting under a chat coordinator is unproven.** Orca stores no creator pane for a session-created Dispatch, and the renderer nests rows by `parentPaneKey`. Workers may group under the Run or the workspace rather than the coordinator's chat. If the pilot shows no nesting, Part B buys supervision and visibility but not the hierarchy Kris asked for.
- **Autonomy.** An Orca worker that stops on a permission prompt breaks the detached contract. Pilot it with Kris's current agent-launch settings.
- **Settlement load on the coordinator.** Orca's model expects the coordinator to `check`, process and acknowledge `worker_done`. KI coordinators do not run that loop, so deliveries would stay unacknowledged in the Run inbox. `ki agent close` can release terminals, but acknowledging the inbox from outside the coordinator's chat is not supported by the documented verbs (`check` from outside an Orca terminal needs `--terminal`, and a chat has no terminal handle).
- **Two supervisors.** ki and Orca would both hold lifecycle state for the same run. Orca's verdicts (`unverifiable` is not dead) must win where they speak, and ki must never stop, retry or release on absence, which matches its own rules.
- **Orca restarts and updates.** A worker's life is tied to `orcad`. Roughly daily Orca releases make this a practical risk; today's detached runs do not share it.
- **Depth and resource limits.** Orca's nested-worker depth limit (`nested_worker_depth_exceeded`) and terminal process ceilings apply. Runs do not launch runs, so depth is unlikely to bite, but `ki batch` waves could meet resource ceilings.
- **Vendor drift.** Orca's orchestration surface is marked experimental and changes often; Part B should check Orca's advertised capabilities (`orchestration.contract.v1`, `agent.launch.v2`) before using the path and fall back when they are absent.
- **AI Vault history.** Workers are still separate Claude sessions, so the history list may still show one entry per run, perhaps tied to its Dispatch. The live agents list is what Part B changes.

## 7. Worker close-out

**Authority:** message ORCA-WORKER-CLEANUP, 30 October 2026, from `hnr.sop.5ge` at Kris's explicit request (Orca Run `run_632527cdc86f`): make coordinator cleanup of completed KI-created Orca workers part of the close-out routine, and verify separately whether `worker-release` stops only the runtime or also removes the visible session. This section proposes; it adopts nothing.

**Evidence base:** Orca 1.4.244 on sol: `orca orchestration --help` with the `worker-release`, `worker-retain`, `worker-stop`, `worker-abandon`, `worker-list` and `worker-show` help; `orca skills get orchestration` with its `recovery-and-cleanup` reference; the app bundle's `shared/ai-vault-session-deletion.js`, `shared/ai-vault-runtime-session-delete.js` and the AI Vault panel's strings; one read-only `orca orchestration worker-list --json`; the `ki-coordination`, `ki-delegation` and `ki-work-package` skills at harness `7e8df6ef`. No worker was released, retained or stopped, so nothing below about release's effect on a list was observed: **documented** means Orca's own help or guide says it, **verified** means seen directly, **inferred** means read from code.

### What Orca requires

Orca's orchestration guide makes the step part of done: "each settled worker was reused, explicitly retained, or released", and after an accepted success or failure report the coordinator does "exactly one" of reusing the same proven terminal for an immediate follow-up Dispatch, `worker-retain` at the user's request, or `worker-release`. It then enumerates the terminals still owing a decision with `worker-list --run <run_id> --terminal-state reclaimable --json` and does "not end the coordinator turn until it returns none" (**documented**). Release is "post-settlement cleanup, not cancellation": only an accepted settlement authorises it, never a timeout, idle TUI, heartbeat, status, question, escalation, stale or rejected completion, or `unverifiable` liveness, and `terminal close` is never a substitute (**documented**).

### What KI guidance says today

Nothing. `ki-coordination`, `ki-delegation` and `ki-work-package` do not mention Orca, `worker-release` or `worker-retain` (**verified** by search at `7e8df6ef`). Their close-out steps, receive, `ki agent close`, the hold drain and Finished, cover the run packet, temporary directory and work folder only. Section 3's step 5 would have `ki agent close` release ki-launched workers once Part B lands, but no rule covers workers a KI coordinator starts by hand, as the Orca trials have.

The gap is live on sol (**verified**, read-only `worker-list` across all Runs): the two succeeded workers of Run `run_30f7929469` (`ki.prj.orca-evaluation`, Orca dispatch trial) are `reclaimable` with `nextAction` `release`, owing exactly the decision the guide requires; the failed worker of Run `run_0de85069bc` (`ki.prj.mac-studio-setup`, Orca trial) is `retained` with no next action. The Run named in the message, `run_632527cdc86f`, is not on sol.

### What release does and does not remove

| Effect | What happens | Basis |
| --- | --- | --- |
| Agent terminal | Closes only "the exact coordinator-owned agent terminal" of a settled (succeeded or failed) Dispatch. | Documented |
| Worker output | "An inspectable output archive is preserved before the terminal closes, so `worker-read` still returns output afterwards." | Documented |
| Other terminals | Never closes setup terminals, configured tabs, reused or pre-existing terminals, user-taken-over terminals or unproven identities; those, and a Dispatch made by `orchestration dispatch`, are reported `retained` with no process action. | Documented |
| Repeats and failure | Idempotent (`already_released`); only `release_unknown` exits 1; `release_pending` and `release_unknown` carry an exact recovery action to follow. | Documented |
| Task, Dispatch and Run records | Kept. Terminal state is "process accounting ... reported separately from Task status", and `released` is a `worker-list` filter value, so the row stays as `released`. | Documented |
| Worktree and files | Untouched. Release names only the terminal; `worker-stop` says outright that it never deletes the worktree. | Documented for stop; inferred for release |
| Live agents list | The released worker's row should leave the live list, because the list is built from live panes and the pane closes. | Inferred, not observed |
| Conversation history (AI Vault) | Not removed. The provider's own transcript (Claude's session file) is not mentioned by release, and Orca deletes history only through a separate path (next row). | Inferred from code |

**Session-list cleanup is a separate, destructive act** (**verified** from code and strings). AI Vault, Orca's history list, has its own "Delete this session?" action, backed by the `aiVault.deleteSession` RPC, which removes the session's transcript files: "Once deleted, it will no longer be resumable from [the agent]'s own command line either". It is offered only for agents whose whole session is derivable from its path, Claude among them and Codex not ("one-sided deletion reappears"), and it is reached from the GUI only: `orca --help` lists no session-delete or archive verb and the CLI code carries no call to it (**verified**). No hide or archive action for history rows was found in the bundle. So release tidies the live agents list (**inferred**) and leaves history alone, and clearing the history list means deleting conversation evidence, by hand, per session.

### Proposed close-out rule for KI coordinators

1. **Receive.** When a coordinator receives the report of an Orca worker it or its runs started, and Orca shows the Dispatch settled, it does exactly one, and says which in the receive commit: reuses the terminal for an immediate follow-up Dispatch, retains it with `worker-retain` only at Kris's explicit request, or releases it with `worker-release --dispatch <id> --json`.
2. **Authority.** Only an accepted settlement authorises release. Absence, timeout, idle, `unverifiable` or a status-file `DONE` without a settled Dispatch authorises nothing; `terminal close` is never used; a `release_pending` or `release_unknown` receipt's recovery action is followed exactly and reported.
3. **Mark, hold and Finished.** For each Orca Run the work created, its Run id read from the work's ORCA-ROUTING record, `worker-list --run <id> --terminal-state reclaimable --json` returns none before a mark is struck, before a hold report and before the Finished banner; anything left is named in the hold report's Left over and in the receive or mark commit.
4. **`ki agent close`.** Once Part B lands, `ki agent close` performs step 1's release for ki-launched workers (section 3, step 5), so the coordinator's own step covers only workers started outside `ki agent`, such as trials and pilots.
5. **History is not close-out.** Close-out never deletes an AI Vault session. Deleting conversation history is Kris's own choice, made in Orca's GUI, and no run or coordinator does it.

The rule belongs in the `ki-coordination` standard (receive, the mark, On hold and Finished), with a one-line pointer from the `ki-delegation` run-close guidance; the harness owns that change and would receive it as a message. Whether a coordinator in an Orca chat, rather than an Orca terminal, may release a worker it created is unproven, because release takes only `--dispatch` and Orca resolves the caller itself; the ORCA-SUBAGENT-PILOT should check it.

### ORCA-CLOSE-OUT - Make worker release part of KI coordinator close-out

**Context:** Orca's guide counts supervised work as done only when each settled worker has been reused, explicitly retained or released, and KI's coordination and delegation guidance says nothing about it; two succeeded trial workers of `ki.prj.orca-evaluation` on sol are still waiting for that decision. Release closes only the worker's own terminal after archiving its output, keeps the Task and Dispatch records, and does not delete conversation history; deleting history is a separate GUI-only AI Vault action that cannot be undone. Section 3 already has `ki agent close` release ki-launched workers once Part B lands, which covers only runs `ki agent` starts.

**Query:** Should the five-step close-out rule above go into the `ki-coordination` standard now, as a message to the harness, rather than waiting for Part B?

**Options:**

a) (recommended, confidence medium - the rule repeats Orca's own required step and the gap is live, but whether a chat coordinator can release its workers is unproven until the pilot) Yes: send the rule to the harness now as a message, covering receive, mark, hold and Finished, with history deletion kept out of close-out; `ki agent close` takes over ki-launched workers when Part B lands.

b) Wait for the ORCA-SUBAGENT-PILOT and Part B, and fold the rule into `ki agent close` only, leaving hand-started workers to the work that started them.

c) Also make AI Vault session deletion part of close-out, with Kris's go per session, to declutter the history list.

## 8. Draft messages, not sent

For `ki.prj.tools-burndown` (`+/_WORK/ki.prj.tools-burndown/messages.md`):

> 2026-10-30 from ki.prj.ways-of-working: ORCA-ENV-LEAK - `ki agent launch` passes the coordinator's whole environment to runs, so a run started from an Orca chat inherits `ORCA_AGENT_SESSION_ID` and `ORCA_AGENT_SESSION_SPAWN_TOKEN` and Orca answers it as the coordinator (verified from a live run). Please strip `ORCA_AGENT_SESSION_ID`, `ORCA_AGENT_SESSION_SPAWN_TOKEN`, `ORCA_STRUCTURED_SESSION` and `ORCA_CHAT_SCRATCH_DIR` from runtime children in `src/core/agent/runtimes.ts`, keeping them for ki's own dispatcher; Part A of `ki-principal/+/_WORK/ki.prj.ways-of-working/orca-subagents/design.md`. Part B, an Orca placement for runs, follows only after the pilot that design asks for; not blocking.

For `ki.prj.orca-evaluation` (`+/_WORK/ki.prj.orca-evaluation/messages.md`):

> 2026-10-30 from ki.prj.ways-of-working: ORCA-SUBAGENT-PILOT - the orca-subagents design (`ki-principal/+/_WORK/ki.prj.ways-of-working/orca-subagents/design.md`) needs one supervised pilot from an Orca coordinator chat on sol, with Kris watching: `orca orchestration run-create` then one `orca orchestration worker-start --spec <short brief> --worktree current --agent claude`, to answer whether the worker nests under the chat in the agents list, whether it runs without permission prompts under the current agent-launch settings, whether it survives the coordinator chat ending, and what `worker_done` leaves in the Run inbox. Please fold it into your evaluation and send the answers back; not blocking.

## 9. Queries

Section 7 carries its own query, ORCA-CLOSE-OUT.

### ORCA-ENV-LEAK - Stop runs inheriting the coordinator's Orca identity

**Context:** Every `ki agent` run started from an Orca chat inherits the chat's Orca session id and spawn token, and Orca treats the run as the coordinator; this was verified from inside this run. A run calling Orca's orchestration verbs would send, reply or consume the coordinator's inbox in its name. The fix removes four `ORCA_*` variables from the runtime child's environment only, changes nothing visible, and is independent of the sub-agent design.

**Query:** Should tools-ki strip the four `ORCA_*` session variables from every runtime child now, ahead of any sub-agent work?

**Options:**

a) (recommended, confidence high - verified directly, small and reversible, and it closes a real impersonation path) Yes: send the ORCA-ENV-LEAK line to `ki.prj.tools-burndown` as drafted, Part A only.

b) Hold it and land it with Part B as one change.

### ORCA-SUBAGENT-PILOT - Prove the Orca worker path before changing tools-ki

**Context:** Orca links a supervised worker to its creator through `orca orchestration worker-start`, which records the creator's session on the Dispatch. Whether such a worker nests under a chat coordinator in Orca's agents list, runs without permission prompts, survives the chat ending, and leaves the Run inbox in a tolerable state was read from code, not observed; Orca stores no creator pane for a chat, and the list nests rows by pane. One hand-started worker with Kris watching answers all four. It starts an Orca worker, so it needs Kris's go and belongs with the Orca evaluation.

**Query:** Should one supervised Orca worker pilot run, through `ki.prj.orca-evaluation`, before any tools-ki change for sub-agents?

**Options:**

a) (recommended, confidence high - the hierarchy Kris asked for is the one claim the evidence cannot settle, and a wrong guess costs a tools-ki change) Yes: send the ORCA-SUBAGENT-PILOT line to `ki.prj.orca-evaluation` as drafted.

b) Skip the pilot and implement Part B directly, accepting that the nesting may not appear.

c) Drop the Orca placement and keep runs detached, with Part A only.

### ORCA-PLACEMENT - Which Orca route Part B takes

**Answered:** a), taken under ACCEPT-BY-CRITERIA on 31 October 2026, with the blind review's condition; recorded in section 3 under "Route, decided". The text below is the query as drafted.

**Context:** If the pilot shows nesting, Part B can start workers with Orca's own launch (`worker-start --agent`, which uses Kris's Orca agent-launch settings and cannot pass `--add-dir`), or create an Orca terminal running today's exact `claude`/`codex` command and hand it to `worker-start --terminal`, which keeps today's autonomy flags but is the low-level route Orca reserves for argv it cannot express. The first is simpler and closer to how Orca's own sub-agents start; the second preserves today's run contract exactly. Which one works depends on the pilot's permission and directory findings.

**Query:** Should Part B use Orca's own agent launch, or adopt a terminal running today's command?

**Options:**

a) (recommended, confidence medium - simplest and most Orca-native, but autonomy and extra directories are unproven until the pilot) Orca's own launch, `worker-start --agent`, switching to the terminal route only if the pilot shows prompts or blocked writes.

b) The terminal route from the start, `terminal create --command` plus `worker-start --terminal`.

### ORCA-QUEUE - How queued runs behave under Orca

**Answered:** a), by Kris in the interactive prompt on 31 October 2026; recorded in section 4 under "Queued runs, decided". The text below is the query as drafted.

**Context:** Orca does not start a task when its dependencies finish, so ki's dispatcher must still start a queued run when its `--wait-for` gate opens. The dispatcher keeps the coordinator's environment and can start the run as an Orca worker while the coordinator's chat is live; after the chat ends, Orca will most likely not accept it as the caller, and the run would start detached as today. The alternative is to keep every queued run detached so that queued and immediate runs behave the same.

**Query:** When a queued run's gate opens, should the dispatcher try the Orca path first and fall back to a detached launch?

**Options:**

a) (recommended, confidence medium - keeps queued runs under their thread in the common case and never impersonates a parent that has gone, but the dead-parent behaviour is inferred) Orca first while the parent chat is live, detached otherwise, with the placement and reason in the receipt.

b) Queued runs stay detached; only immediate launches use the Orca path.
