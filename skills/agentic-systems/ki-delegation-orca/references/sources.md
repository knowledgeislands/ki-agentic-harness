# Sources

**Refresh:** external-spec · monthly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Orca][orca] `orca orchestration` command help, version 1.4.245 | `run-create`, `worker-start`, `worker-list`, `worker-show`, `worker-read`, `send`, `check`, `worker-release`, `worker-stop` and `run-use` | 2026-11-01 |
| Orca's bundled `orchestration` skill and its `recovery-and-cleanup` reference, version 1.4.244 | Worker settlement, retention and release | 2026-10-31 |
| Orca trial log, `ki.prj.orca-evaluation` in Knowledge Islands Principal | Proved behaviour, gotchas and open questions | 2026-11-01 |
| Orca launcher proposal, `ki.prj.orca-evaluation` in Knowledge Islands Principal | Proposed rules, settled by Kris in `ki.reg.guilds` on 7 November 2026 | 2026-11-07 |

## Last review

2026-11-10: `ki agent`'s removal in `tools-ki` v0.15.0 applied under `agora.sop.main`: outside Orca a session delegates to its own agent host's subagents; Survival and its interim rule no longer name `ki agent`, so a run that must outlive its coordinator goes to Kris until an agent host is proved; a queued run without a live parent waits for a live session; the report path is the brief's; and the Nesting gotcha goes. No external source refreshed.

2026-11-07: Kris's answers in `ki.reg.guilds` applied by run `orca-land`: ORCA-SKILL-KIND, CLOSEOUT-STRIKE, ONE-LAUNCHER-UNIT, OUTLIVE, PROMPT-RENDER, HEARTBEAT-ACK, STOP-VERB, QUEUE-PACE, REPORT-HOME, WORKER-SURVIVAL, DELIVERY-REPLAY, OWNER-ASK, ADAPTER-MERGE, TRIAL-ASK, TRIAL-PRACTICE, RUN-RECOVERY and TRIAL-PUBLISH each took option a), RUN-HANDOVER took b), and ONE-LAUNCHER closed with no rule. Settled rules moved into the standard; interim rules and the next trial's tests moved into the migration file under MIGRATION-OVERLAY. The Paperclip sibling was dropped, Paperclip having been purged. The Orca command help was not re-read.

2026-11-01: first draft under ORCA-SKILL-NOW a) and ORCH-NAME-DISPATCH a), both decided on 1 November 2026. Every rule was carried from a statement the launcher proposal marked proved, with its trial-log source, or designed elsewhere, with its owner; statements marked proposed became open points. The command help was read by the proposal's author on sol on 1 November 2026 and was not re-read for this draft.

[orca]: https://github.com/stablyai/orca
