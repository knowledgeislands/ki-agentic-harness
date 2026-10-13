# Delegation sources

**Refresh:** external-spec · quarterly

| Source | Last reviewed | Governs |
| --- | --- | --- |
| Knowledge Islands delegation practice | 2026-10-13 | Durable high-risk handoff, authority, escalation, verification, and return boundaries; detached background runs, run packet, authority tiers, decisions log, coordination, worktree placement, run-folder retention, the coordinator role and its responsiveness rules, monitoring, the owner report with its Needs tags and reply block, and owner-facing Summary and recap banners |
| `ki-tokenomics` | 2026-10-13 | Model-purpose and context-cost policy belong outside the packet, including the coordinating-thread model |
| `ki-work-roadmap` | 2026-08-12 | Approved work-record lifecycle, plan ownership, and review boundary |
| [OpenAI: Codex subagents][openai-subagents] | 2026-08-12 | Ordinary subagent task selection, permissions, and execution guidance |
| [Anthropic: Claude Code sub-agents][anthropic-subagents] | 2026-08-12 | Ordinary subagent task fit, restricted capabilities, and isolation guidance |

## Last review

A fourth 2026-10-13 review applied Kris's Decision 18 in the `ways-of-working` run. A coordinating thread now reports in three forms with one table of their windows: the Summary since the owner's last message, the recap since the mark, and the new full summary since the thread began, given on "full summary" or "summary in full", which opens with `## Decided`, every owner decision linked to its decisions-log entry, then the owner report with `What has been done` grouped by topic, dated upcoming deadlines under `Outstanding - no action requested now`, every open query restated in full and a reply block covering them all, with one `DEFAULTS` query for low-stakes choices. Every form now uses the H1 banner, H2 sections and H3 queries, never points back to an earlier report, and carries placeholders in the reply block where only the owner can supply a value. RUN-5 reviews the forms. The vendor guides were not re-reviewed.

A third 2026-10-13 review applied Kris's Decision 14 in the `ways-of-working` run. Every owner-facing report, a background agent's final report and a coordinating thread's Summary alike, now takes the owner report: what has been done, what is in progress with routine open matters under `Outstanding - no action requested now`, and outstanding queries, each under a stable Needs tag with a Summary, a Need from you and a Recommendation, closing with one copyable reply block that is a suggestion and not approval. Kris's wording is quoted in the standard, the communication level sets only depth, the Done / Failed / Needs owner shape is withdrawn from the footers and the prompt skeleton, and the linking rule now forbids invented links. RUN-5 reviews the shape. The vendor guides were not re-reviewed.

A second 2026-10-13 review applied Kris's Decision 11, with Decisions 3 and 8, in the `ways-of-working` run. Coordinator responsiveness is now a set of hard, checkable rules: a turn budget, work that never happens in-thread, waiting only through a detached waiter or monitor, short briefs, a self-check before each tool call, and prompt answers to owner messages. Both openers now carry a coordinator-role line, and the bootstrap report states that role. RUN-3's description and review prompt now check those rules. The vendor guides were not re-reviewed.

The 2026-10-13 review applied Kris's Decisions 2 and 3 in the `ways-of-working` run. A background run's worktrees now live under its run folder and are removed, with their merged branches, before the agent reports `DONE`; a closed run's folder is archived or deleted once its decisions are consolidated. A coordinating thread is now a coordinator that dispatches, decides and reports while background agents do the reasoning, and `ki-tokenomics` owns the matching model recommendation. RUN-3 already reviews coordinator behaviour, so the rubric is unchanged, and the vendor guides were not re-reviewed.

The 2026-10-11 review gave the Summary the recap's header under Kris's Decision 43 in the `mac-studio-bootstrap` run. One shared banner now opens every Summary and recap, naming the thread, its Project and Initiative as links, the window and the thread's state, and a thread that is resting or waiting ends with a Summary that says so and lists done, running and outstanding work with its Needs tags. RUN-5 reviews both. The mark rules are unchanged, and the vendor guides were not re-reviewed.

The 2026-10-07 review added the background-run contract under Kris's Decision 18 (KI-HARNESS-GOV-144). It captures the practice proven in the state-of-play rollout: detached agents that survive an interrupt, the five-file run packet with a `DONE` completion signal, cumulative authority footers with no implied grants, numbered owner decisions as cited authority, per-agent worktrees, and a non-blocking monitor that flags agents exiting without `DONE`. Runtime launch mechanics stay in `ki agent`; the vendor guides were not re-reviewed.

The 2026-08-12 review confirmed that both vendor guides already cover ordinary task fit, isolated worker contexts, restricted capabilities, and concise results. This skill therefore retains only the durable governance delta for an approved high-risk handoff: locked decisions, scope, least authority, isolation, escalation, verification, and return evidence. It deliberately excludes vendor model names, configuration fields, task-selection heuristics, worker scheduling, concurrency limits, integration procedure, and user-interface behaviour.

Re-review quarterly or when either guide changes its delegation, isolation, permission, or background-execution semantics. Watch whether a runtime adds durable, portable authority and escalation records that make this packet redundant; until then, packets describe the needed governance boundary and executing processes choose a mechanism that can honour it.

[anthropic-subagents]: https://code.claude.com/docs/en/sub-agents
[openai-subagents]: https://learn.chatgpt.com/docs/agent-configuration/subagents
