# Runtime feature coverage matrix

Reference companion to [SDR-KI-HARNESS-002](../SDR-KI-HARNESS-002-runtime-portable-contracts.md). This is a **reference doc, not a decision record** — it carries no decision, needs no Decisions-index entry, and is edited freely as evidence accrues.

It enumerates the harness-relevant **native runtime primitives** and marks, for each of the two runtimes the harness has probed, whether the primitive is present. It exists so that later workstream phases have one place to check a mechanism's portability **before** assuming a runtime-native feature ports for free.

For the complementary lens — where each of the harness's own **bundle parts** stands on Claude Code vs Codex, and the critical path to developing in both concurrently — see the [runtime parity scorecard](runtime-parity-scorecard.md).

## Legend

- **Native** — a first-class runtime primitive with a documented interface.
- **Adaptable** — no identical primitive, but an existing mechanism can carry it with a shim or a serialization change.
- **None known** — no known equivalent surfaced by the runtime's documentation; the harness must implement it from scratch, or the gap is an open unknown.

The Codex CLI column is verified against Codex's primary documentation (all `learn.chatgpt.com/docs/*`, fetched 2026-07-13; the `developers.openai.com/codex/*` paths 308-redirect there). A **None known** cell means "not established by that documentation", not "confirmed absent". Per-claim sources are in the footnotes and collected under [Primary sources](#primary-sources-codex-cli).

## Native primitive coverage

| Primitive                       | Claude Code  | Codex CLI     |
| ------------------------------- | ------------ | ------------- |
| Interactive Plan Mode †         | Native       | None known †  |
| Hooks / lifecycle events        | Native       | Native ‡      |
| Subagents                       | Native       | Adaptable §   |
| Skills                          | Native       | Native ¶      |
| MCP                             | Native       | Native ‖      |
| Memory / cross-session state    | Adaptable †† | None known ‡‡ |
| Task-tracking (TodoWrite)       | Native       | None known ‡‡ |
| Background / worktree isolation | Native       | None known ‡‡ |

† Claude Code exposes interactive Plan Mode as the `EnterPlanMode` / `ExitPlanMode` tool pair. Codex's documentation surfaces no interactive plan-mode primitive, so this stays a known gap.

‡ Codex ships its own hooks system with events `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `SubagentStart`, `SubagentStop`, and `Stop` — a native primitive. The documentation names no Claude Code compatibility shim and no shared `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` environment contract, so portability of a shared hook executable across the two runtimes is **unverified** — do not assume a hook script ports.

§ Codex documents standalone subagents as TOML files under `~/.codex/agents` (global) or `.codex/agents` (project), with fields `name`, `description`, `developer_instructions` (the system-prompt analog) plus optional `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, and `skills.config`, and built-in `default` / `worker` / `explorer` agents. The format exists, so the barrier is a field mapping plus a Markdown-plus-frontmatter ↔ TOML conversion from Claude Code's `.md` agents — a generator, not a copy — hence Adaptable, not absence. Open items: no external cross-runtime subagent standard anchors either shape (unlike skills), and the wiring between the `SubagentStart` / `SubagentStop` hook payloads and the named TOML agents is undocumented.

¶ Codex scans a `SKILL.md`-shaped skills primitive from `.agents/skills` (repo → user → admin → system) rather than Claude Code's `.claude/skills`; Codex-specific extras live in a sibling `openai.yaml`, not `SKILL.md` frontmatter. Near-identical to the open Agent Skills standard, which agentskills.io anchors across runtimes.

‖ Codex has native MCP support via TOML `[mcp_servers.<name>]` in `~/.codex/config.toml` (also project `.codex/config.toml`) — STDIO fields `command` / `args` / `env` / `cwd`, HTTP fields `url` / `bearer_token_env_var` / `http_headers`. Same protocol as Claude Code's JSON config; portability costs a config serialization translation, not a reimplementation.

†† Claude Code has no single durable memory store the harness relies on; cross-session state is carried by the propose-not-promote knowledge-base convention over plain files, hence Adaptable rather than Native.

‡‡ Not established by Codex's primary documentation — treat as an unknown to be tested, not a confirmed absence.

## KI surfaces: on a native primitive vs runtime-agnostic invention

The matrix matters because harness surfaces fall into two classes, and only one of them survives a runtime swap unexamined.

**On a runtime-native primitive (fragile across runtimes).** These surfaces latch onto a mechanism the runtime provides, so they are only as portable as that mechanism. The plan-file lifecycle hooks (`hooks/plan-stamp.sh` and `hooks/plan-sync.sh`) hook Claude Code's built-in interactive Plan Mode — the `EnterPlanMode` / `ExitPlanMode` tool pair — which has no confirmed Codex equivalent, so that surface stays a hard gap. The governance agents in `agents/` sit on Claude Code's Markdown-plus-frontmatter subagent-definition format; Codex documents its own subagent format too, but as TOML, so this surface needs a field-mapping generator across an incompatible serialization, not a copy — a milder barrier than absence, but still a barrier. Any hook also depends on the runtime firing the lifecycle event it binds to, and Codex's Claude Code hook-script interop is unverified.

**Pure KI invention (already runtime-agnostic — the model to imitate).** The paired skills `ki-plans` and `ki-plan` define a KI-invented `docs/plans/*.md` format whose governed artifact has no runtime-plan dependency. Its file-oriented lifecycle procedures (`done`, `execute`, `new`, and `status`) work on any runtime that can read and write the files, with interactive choices adapted to that host. The optional `promote` procedure is a boundary adapter rather than part of the artifact contract: it discovers the current scratch plan through Claude Code's session substitution and Plan Mode hook state, then writes the same portable artifact. The governance skills are the same general shape — plain `SKILL.md` plus Markdown plus a checker, depending only on the file layout.

**Two different "plan" concepts, easy to conflate.** Claude Code's interactive **Plan Mode** is a runtime tool pair (`EnterPlanMode` / `ExitPlanMode`) that the plan-stamp / plan-sync hooks latch onto — runtime-native and fragile. The `ki-plans` / `ki-plan` **plan** is a KI-authored governance artifact (`docs/plans/*.md`) with a file-oriented lifecycle — a format the harness owns outright, independent of any runtime plan tool. `/ki-plan promote` is the explicit bridge between them, not evidence that either mechanism has become the other or that Plan Mode discovery is portable.

## Using this matrix

Before a workstream phase builds on, or assumes the portability of, any runtime mechanism, check the primitive here first. A **Native** cell on one runtime is not a portability guarantee; a **None known** or **Adaptable** cell is the signal that the surface needs a shim, a from-scratch implementation, or a conformance run before it can be claimed portable.

## Primary sources (Codex CLI)

All fetched 2026-07-13; the `developers.openai.com/codex/*` paths 308-redirect to these `learn.chatgpt.com` URLs.

- [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) — the TOML subagent file format, fields, and built-in agents.
- [Hooks](https://learn.chatgpt.com/docs/hooks) — Codex's own hook event system.
- [Build skills](https://learn.chatgpt.com/docs/build-skills) — `.agents/skills` scanning and the `openai.yaml` sidecar.
- [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) — the multi-scope instruction merge.
- [MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) — TOML `[mcp_servers.<name>]` config and transport fields.
- [Config reference](https://learn.chatgpt.com/docs/config-file/config-reference) — the `approval_policy` and `sandbox_mode` approval model.
