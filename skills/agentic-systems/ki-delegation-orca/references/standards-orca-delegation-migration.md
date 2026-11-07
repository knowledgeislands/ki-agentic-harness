# Orca delegation migration

This file holds the interim rules and trial tests that apply while Orca behaviour the [Orca delegation standard](standards-orca-delegation.md) relies on is still unproved, so that the standard describes only the final state, as Kris set under MIGRATION-OVERLAY on 7 November 2026. Read the standard first; the standard wins wherever the two differ. Strike each row once its condition is met, and delete this file whole once every row is struck.

## Interim rules

| Standard rule | Interim adjustment | Lifted when |
| --- | --- | --- |
| [Survival](standards-orca-delegation.md#when-orca-launches) | A run that must outlive its coordinator goes through `ki agent`, not Orca. A package opted wholly into Orca needs Kris to amend its opt-in to allow this exception. Decided: OUTLIVE a), 7 November 2026 | WORKER-SURVIVAL below shows an Orca worker that keeps working, is found with its progress and result from a fresh session, and finishes |
| [Brief as spec](standards-orca-delegation.md#start) | No `ki` command yet renders a brief without launching it, so the coordinator passes the brief text from the work folder as the spec, with the standard's checks. A `ki` render-only step is a tools-ki follow-up. Decided: PROMPT-RENDER a), 7 November 2026 | `ki` gains a render-only step |
| [Heartbeat-only batches](standards-orca-delegation.md#wait) | The coordinator acknowledges every batch itself, heartbeats included. Decided: HEARTBEAT-ACK a), 7 November 2026 | One supervised trial covering a finish, a question, an escalation, a message of an unknown kind and a mixed batch shows the waiter acknowledges only all-heartbeat batches |
| [Stopping](standards-orca-delegation.md#status-steering-and-stopping) | Before the first use of `worker-stop`, check what the installed command stops and what happens to a worker's partial work, and record the result with the stop's outcome. Decided: STOP-VERB a), 7 November 2026 | The first use is recorded |
| [Questions](standards-orca-delegation.md#questions) | The coordinator answers its own asks with `--timeout-ms 1800000`, resuming by message id on timeout. A question only Kris can answer ends the attempt: the worker raises it as a blocking query in its report and keeps it, `worker_done --outcome failed` names its tag, the coordinator records it and retries after Kris answers. Decided: OWNER-ASK a) and TRIAL-ASK a), 7 November 2026 | OF-OWNER-ASK in the Orca fit design is decided |
| [Ids](standards-orca-delegation.md#ids-briefs-and-reports) | Until the machine-local routing record exists, `ki.prj.orca-evaluation`'s `state.md` Run line is a logged exception under its STOCK-TAKE decision | The routing record exists |
| [Worktree](standards-orca-delegation.md#start) | Until the background-run standard's worktree baseline takes effect, `--worktree current` is the default | The worktree baseline takes effect |

## Next Orca trial

The next Orca-dispatched trial runs on the ORCA-FIT draft's recommended practice provisionally and for the trial only, its evidence going back to the ORCA-FIT choices; wherever the standard or a row above speaks, it wins over the draft, so no Run id goes in a package file. Decided: TRIAL-PRACTICE a), 7 November 2026. The trial carries three tests, each recorded separately:

| Test | Method | Decided |
| --- | --- | --- |
| WORKER-SURVIVAL | With one short read-only worker running, note its identity, end only an expendable coordinator chat, not the Orca app or the Mac, and from a fresh session check the worker kept working, its result and any pending question can be reached, and it can be cleaned up. A worker finishing before the chat ends proves nothing | WORKER-SURVIVAL a), 7 November 2026 |
| DELIVERY-REPLAY | Note the first message's delivery id, end only the test waiter before it acknowledges, re-arm and check the same delivery returns; then end it after the coordinator acted but before it acknowledged, and check the replay starts, accepts or changes nothing a second time | DELIVERY-REPLAY a), 7 November 2026 |
| RUN-HANDOVER | Read-only: whether `run-use` moves a Run from one chat session to another, testing reconnecting, handing over control and listing workers apart, and the old session leaving apart from a live takeover, never with two coordinators at once | RUN-HANDOVER b), 7 November 2026 |

## Still open

| Tag | Question | Held by |
| --- | --- | --- |
| CODEX-WAKE | Whether `check --wait` has a detached form that re-invokes a coordinator on the second runtime the standard's [Runtime binding](standards-orca-delegation.md#runtime-binding) names | `ki.reg.guilds`, from `ki.prj.ways-of-working` |
| OF-OWNER-ASK | How a question only the owner can answer travels from an Orca worker | The Orca fit design, `ki.reg.guilds` |
