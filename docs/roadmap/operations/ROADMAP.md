# Operations roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

### Run a `ki-housekeeping` cleanup pass on this machine's Claude Code state

A live `kit-mcp-claude-housekeeping` call via the `mcporter` bridge (2026-07-13) found `~/.claude/projects` at 715 MB and `~/.claude/telemetry` at 145 MB on this machine. Run `ki-housekeeping` CONFORM to review and prune safe session/telemetry retention once the housekeeping server's access level is raised from this machine's default `read` to `destructive`. Do not target memory, which already audited clean. Unblock when destructive access is deliberately enabled for the cleanup session.

### Extend `ki-housekeeping` to cover `~/.claude/workflows/`

`ki-housekeeping` governs accumulated Claude Code state under `~/.claude/`, but its standard does not cover saved workflow scripts. The directory does not exist on this machine yet, so there is no concrete hygiene contract to derive. Revisit once workflows are actually being saved and observable staleness, naming, or orphan-script concerns provide evidence for the audit and conform behavior.

### Retry blocked memory-store fixes once `memory_*` tools recover

During a memory/`CLAUDE.md` review session (2026-07-12), several fixes were identified but couldn't be applied because every `memory_*` tool (`memory_save`, `memory_update`, `memory_search`, `memory_list`) failed with "No such tool available" — reads and writes alike, ruling out a plan-mode-specific restriction. Once the tools are confirmed working again:

- Fix the stale citation in `project-harness-runtime-strategy.md` (a project memory under `~/.claude/projects/-Users-krisbrown-kis-knowledgeislands-ki-agentic-harness/memory/`): it still points at `docs/decisions/SDR-KI-HARNESS-001-runtime-portable-contracts.md`, but the harness's DR-renumbering commit (`4cfd896`) moved that decision to `SDR-KI-HARNESS-002-runtime-portable-contracts.md` and reassigned slot 001 to an unrelated decision.
- Delete `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md` from the same memory directory — both were promoted into `CLAUDE.md`'s Committing section and `~/.claude/workflow.md` respectively during the same session, so per the promote-then-delete reconciliation rule they should no longer persist as separate memories.
- Investigate a possible split between whatever backend the `memory_*` tools actually write to (content from calls made during the outage resurfaced later via automatic recall, so the writes seem to have landed somewhere) and the file-based mirror at `~/.claude/projects/.../memory/*.md` described as canonical in the system prompt — grepping that mirror directly showed no new files after the "successful" saves, so the two stores may not be staying in sync. Worth a `ki-housekeeping` look once reproducible.
- Recurred during the audit/conform standardization session (2026-07-12): `memory_save` errored twice with "No such tool available" mid-recap, then a later retry in the same session succeeded — consistent with an intermittent outage rather than a one-off.
- Recurred again during a `vallearmonia-website` session (2026-07-13): both `memory_save` calls at `ki-recap`'s harvest step failed with "No such tool available," this time with no later retry attempted. The two blocked writes, to apply once recovered:
  - A `reference` memory: Gmail/Google Workspace access is available via the `mcporter` CLI's `kit-mcp-gsuite` server (39 tools), not a natively-connected MCP session — key tools are `gsuite_auth_status`, `gsuite_email_labels_list`, `gsuite_email_messages_search` (query + labelIds), `gsuite_email_message_get` (messageId, format `metadata`\|`full`), `gsuite_email_attachment_get` (messageId, attachmentId, outputPath — downloads under `MCP_GSUITE_DOWNLOAD_PATH`, default `~/Downloads`).
  - A `feedback` memory: the user prefers fixing a real, fixable bug directly in-session (even in a different local repo, e.g. an upstream skill/harness repo) over only logging it on a ROADMAP; reserve ROADMAP-only entries for gaps too large/architectural to fix in-session. Confirmed 2026-07-13 when asked to fix a `ki-agentic-harness` bug directly rather than just documenting it.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Mine historical sessions for recurring context bloat _(candidate)_

**Sequence.** The historical-session mining and the `CLAUDE.md` → skill promotion tooling share `ki-recap`'s transcript substrate and `ki-tokenomics`'s scope — scope them against those before building.

Common issues tend to cost the same context over and over — an audit script that scans all repo Markdown and returns spurious FAILs, a Read tool that fails silently on space-containing paths, a checker invoked with the wrong default argument — each rediscovered from scratch across sessions before the fix is known. The `headroom learn` sweep already captures some of these as _Learned Patterns_ (see this repo's `CLAUDE.md`), but that is a manual, per-session distillation. Investigate whether a **mechanical tool** could analyse the corpus of historical session transcripts (the stored VSCode/Claude Code sessions the `ki-housekeeping` standard already governs) to detect repeated, high-cost context patterns — the same dead-end tool call, the same re-read of a large file, the same clarification round-trip — and surface them as candidates for a `CLAUDE.md` learned-pattern entry, a skill fix, or a hook. This is the **offline, cold** sibling of the `ki-recap` process skill (which already ships the **warm, in-session** leg): the two share the transcript-reading substrate and the routing table, so the open design question is not "one tool or two" (answered: two) but how much of this one can reuse `ki-recap`'s `scripts/recap-grounding.ts` versus needing its own mechanical corpus-scan. Assess overlap with `headroom learn` and `ki-tokenomics` (which owns the standing context surface but not this retrospective, per-issue analysis), whether the signal is extractable without an LLM pass, and where such a tool would live (candidate: a `ki-housekeeping` companion, since it already has session-transcript access).

### Evaluate memtrace as structural-memory layer for the harness _(candidate)_

[syncable-dev/memtrace-public](https://github.com/syncable-dev/memtrace-public) is a code-intelligence tool that parses a codebase into a live knowledge graph — symbols as nodes, relationships (`CALLS`, `IMPLEMENTS`, `IMPORTS`) as edges, built with Rust + Tree-sitter — that agents query in milliseconds. It claims deterministic indexing (no LLM calls, no API cost), bi-temporal version history with scoring modes for "what changed / what might break" queries, cross-service HTTP call-graph topology, and ships 25+ MCP tools and 17 agent skills across 20+ languages. Currently private beta under a proprietary EULA (benchmark suite MIT). Assess whether it complements the harness — as a structural-memory MCP server the KI skills could lean on, or as prior art for the skills/agents/MCP bundle shape — and whether its licensing and host-local posture fit our surfaces.

### Model recurring, schedule-driven activities as a harness concept _(candidate)_

Some work in this ecosystem is inherently periodic and not triggered by an LLM decision — the `ki-skills-refresh` sweep already runs on a cron-like cadence per skill's declared `**Refresh:**` interval, and `ki-recap`/`ki-housekeeping` gesture at similar scheduled hygiene. But there's no single, named concept for "a recurring activity, run on a schedule, independent of whether an agent happens to invoke it" — each instance (refresh cadence, housekeeping sweep, a future website-drift check) reinvents its own scheduling story. Investigate whether this deserves a first-class harness concept — a declared `schedule:` surface a skill can carry (cadence + what runs), consistently interpretable by cron/launchd on the host and by hosted scheduling (the `schedule` skill's routines) — versus leaving it as an implicit pattern each skill states in its own prose. Scope against `ki-tokenomics` (which owns standing-surface cost, not scheduling) and the existing `**Refresh:**` cadence field before proposing a new mechanism.

### Make `ki-recap`'s grounding helper resolve the invoking session, not heuristically guess it _(candidate)_

`scripts/recap-grounding.ts` resolves "the" session transcript to ground its files-touched/tool-tally/high-cost-candidate output, but in a repo with more than one concurrent or recent Claude Code session it can latch onto the wrong one — observed directly: a recap invoked mid-session pulled tool-tally data (`ExitPlanMode`, `Agent`, `Write` calls) that belonged to a different, concurrent session editing `ki-authoring`/`ki-engineering`/`ki-repo`, not the one that asked for the recap. Investigate whether the actual invoking session's ID/transcript path is available to the skill at invocation time (rather than inferred by recency or file-mtime heuristics) and, if so, thread it through so grounding is never ambiguous when multiple sessions are live in the same repo.

### Tooling to promote genuinely reusable `CLAUDE.md` content into skills _(candidate)_

"Cover the CLAUDE.md → skill move as a tokenomics lever" (above, under _Skills & docs consistency_) documents the trade-off and routes the judgment call to `/ki-skills`, but that's guidance for a human/agent to apply by hand, not a detector. Build the mechanical companion: a tool (candidate home: `ki-housekeeping`, since it already reads `CLAUDE.md` across `~/.claude/` and per-project scope for hygiene purposes) that scans a `CLAUDE.md` for sections that read as genuinely reusable — self-contained, only situationally relevant, not tied to standing always-on context — and flags them as promotion candidates. Two cases: (a) an existing skill is already the natural home (the content overlaps a skill's domain and should be folded in, e.g. as a reference or an added mode), in which case name that skill directly rather than proposing a new one; (b) no existing skill fits, in which case flag it as a candidate for a new skill and leave the "is this skill-worthy" call to `/ki-skills` per the existing item. Scope this as detection + a report, not an auto-mover — the actual move is a judgment call the existing item already routes correctly.
