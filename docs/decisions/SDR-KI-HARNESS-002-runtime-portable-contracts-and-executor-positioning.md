---
id: SDR-KI-HARNESS-002
title: 'Runtime-portable contracts and executor positioning'
date: 2026-07-11
status: current
type: Strategy Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/sdr
decision_type: strategy
---

# SDR-KI-HARNESS-002: Runtime-portable contracts and executor positioning

## Context

The agent-tooling market has settled into layers rather than competing products: applications, agent runtimes/harnesses (Hermes Agent, pi.dev, OpenClaw, Claude Code, the Codex CLI, the Claude Agent SDK, the OpenAI Agents SDK), orchestration primitives (MCP servers, memory, planning, subagents), and model providers. Knowledge Islands sits above the runtime layer: it is a governance-and-capability framework — territory boundaries, evidence and provenance rules, validation for accuracy, correctness, and completeness — and the runtimes are execution substrates beneath it that do not define the epistemic rules. The harness's artefacts (skills, agents, checkers, the `.ki-config.toml` contract) are Markdown and scripts that are portable in principle, but Claude Code is today the only environment that has ever executed them, and nothing has proven the portability. The candidate runtimes differ in philosophy: Hermes is a batteries-included, model-agnostic persistent agent (memory, scheduling, skills, delegation, channels); Pi is a deliberately minimal TypeScript core where extensions provide everything; OpenClaw is strongest as an always-reachable multi-channel gateway; and the Codex CLI is a Claude Code-adjacent terminal harness whose primitives map almost one-to-one onto Claude Code's, which makes it the most direct near-term portability probe. Extending a minimal runtime to feature parity with a batteries-included one, or nesting one generic runtime inside another, duplicates ownership of sessions, context, tools, and lifecycle.

## Decision

Knowledge Islands capabilities are expressed through portable contracts — skills, MCP interfaces, evidence and validation protocols, the `.ki-config.toml` binding — and never through the assumptions of any one runtime. Concretely:

- No runtime becomes the definition of the system; each is a conforming execution environment. Claude Code is the current one; Hermes is the intended first conforming environment for persistent, scheduled, steward-style work; Pi serves as the portability and conformance test and as a repo-local coding workbench; OpenClaw is deferred until a multi-channel gateway is specifically needed.
- Runtimes divide by workload and sit beside one another, never nested: persistent stewards and scheduled work on the batteries-included runtime; controlled, narrow, high-assurance work on the minimal one. Effort goes overwhelmingly into the Knowledge Islands contracts themselves, not into recreating one runtime's features in another.
- **Best tool for the job** is a central tenet, and "tool" spans deterministic scripts as much as model providers and tiers: a mechanical check where one suffices, then the cheapest sufficient intelligence tier, then frontier reasoning only where judgment is genuinely needed — extending the mechanical-first paradigm from capability to _capability independence_.
- Learned behaviour is **proposed, never silently promoted**: an agent may propose a memory entry or an improved skill, but promotion into governed territory passes through an explicit governance gate, as the Enactment Process already requires for knowledge-base content.

## Consequences

Skills, checkers, and configuration must avoid runtime-specific assumptions where avoiding them is cheap, and any that remain are deliberate and known. Adopting a second runtime becomes a conformance exercise against existing contracts rather than a rewrite, and implementing one narrow skill on a minimal runtime is the test that the standards are genuinely portable rather than one runtime's configuration under a Knowledge Islands label. The propose-versus-promote boundary extends governance from knowledge-base content to harness-side learning, which existing mechanisms do not yet gate uniformly. The best-tool-for-the-job tenet gives the mechanical/judgment split and the model-tier standards (ki-tokenomics, ki-handoffs) a single articulated rationale.

A portability probe against the Codex CLI — verified against Codex's primary documentation on 2026-07-13 — bears out the layered reading for `skills/` and MCP while narrowing, rather than closing, the questions elsewhere. Confirmed: Codex scans a `SKILL.md`-shaped skills primitive from `.agents/skills` (repo → user → admin → system), with Codex-specific extras in a sibling `openai.yaml` rather than `SKILL.md` frontmatter; it merges instructions from `AGENTS.md` across scopes (global `~/.codex` plus a project git-root-down walk, concatenated root-first so closer files override) in place of `CLAUDE.md`; and it has native MCP support configured in TOML (`[mcp_servers.<name>]`) rather than JSON — the same protocol under a different serialization. Codex also documents standalone subagents as TOML files under `~/.codex/agents` (global) or `.codex/agents` (project), with fields `name`, `description`, `developer_instructions` (the system-prompt analog) plus optional `model`, `sandbox_mode`, and `mcp_servers`; and it ships its own hooks system (events `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `SubagentStart`, `SubagentStop`, `Stop`).

So the "portable contract" claim is strongest for `skills/`, which has an external cross-runtime anchor in the open Agent Skills standard (agentskills.io) that both runtimes track. For `agents/` and `hooks/` the claim is narrower than a copy-across. Codex's subagent format exists but is **TOML, not file-compatible** with Claude Code's Markdown-plus-frontmatter `.md` agents, so a field-mapping generator — not a copy — is what portability costs; no external standard anchors either subagent shape; and the wiring between the `SubagentStart` / `SubagentStop` events and the named TOML agents is undocumented. For hooks, Codex's own event system is real, but its interoperability with Claude Code hook scripts is **unverified** — no shared environment contract is documented — so hook-executable portability cannot be asserted. Interactive Plan Mode has no confirmed Codex equivalent at all. Agent and hook portability is therefore an aspiration to be tested against these specifics, not an established property.

## References

- [SDR-KI-HARNESS-001](SDR-KI-HARNESS-001-purpose-and-scope-of-the-agentic-harness.md) — the purpose and scope of the harness whose positioning this record sets.
- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — the mechanical-first paradigm this strategy generalises.
- [Hermes Agent](https://github.com/NousResearch/hermes-agent) — the batteries-included persistent runtime.
- [pi.dev](https://pi.dev) — the minimal TypeScript runtime.
- [OpenClaw](https://docs.openclaw.ai) — the multi-channel gateway runtime.
- [Runtime feature coverage matrix](references/runtime-feature-coverage.md) — native primitive coverage across Claude Code and the Codex CLI, the matrix later workstream phases check against.
- [Codex subagents documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents) — the TOML subagent file format (primary source for the `agents/` correction).
- [Codex hooks documentation](https://learn.chatgpt.com/docs/hooks) — Codex's own hook event system (primary source for the `hooks/` correction).
