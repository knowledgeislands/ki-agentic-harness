---
id: '001'
title: Register OpenAI Codex CLI as a target runtime
status: open
roadmap: Register OpenAI Codex CLI as a target runtime and update the governance layer
blocks: —
blocked-by: —
---

# Register OpenAI Codex CLI as a target runtime

## Context

Knowledge Islands’ contracts should outlive any one agent runtime, but this harness currently executes only on Claude Code. Codex already has native counterparts for the core primitives—Agent Skills, `AGENTS.md`, MCP, TOML-defined custom agents, and lifecycle hooks—while using different discovery paths and serialization. The immediate goal is to state and govern that boundary accurately. It is deliberately not an implementation plan for a runtime adapter.

This plan executes the ROADMAP item that registers Codex as a second target runtime at the governance and decision layer. It establishes the portable contract and records the gaps that a later, separately planned adapter workstream must resolve.

## Current state

- The canonical skills are `SKILL.md` directories and therefore have a portable foundation, but `ki-bootstrap` currently links only Claude Code’s `.claude/skills/` surface.
- The repository has [`CLAUDE.md`](../../CLAUDE.md), no root `AGENTS.md`, and documentation that still describes Claude Code as the only validated runtime.
- Governance agents exist only as Claude Code Markdown-plus-YAML definitions in `agents/governance/`; Codex expects separate TOML files with `name`, `description`, and `developer_instructions`.
- The runtime feature matrix and SDR capture the initial Codex research, but `ki-agents` still defines and audits only the Claude Code shape.
- The behavioural eval harness invokes the local `claude` CLI only; current hooks depend on Claude Code Plan Mode and must not be represented as portable.
- Codex’s initial skill-list budget makes description length a future adapter constraint: the harness’s declared skill set must be made discoverable without relying on every long description being injected unchanged.

## Steps

1. Reconfirm the Codex claims used by this work against primary OpenAI documentation: repository skills under `.agents/skills`, instruction discovery through `AGENTS.md`, custom-agent TOML fields, MCP TOML configuration, and the documented hook events. Record only verified claims and mark unverified interoperability as an open question.
2. Update `SDR-KI-HARNESS-002` and `docs/decisions/references/runtime-feature-coverage.md` so the decision names Codex as a target runtime and distinguishes:
   - portable KI contracts (skills, checkers, `.ki-config.toml`, file-based plans);
   - adaptable runtime projections (agents and MCP serialization);
   - unproven or runtime-specific surfaces (interactive Plan Mode hooks, hook executable compatibility, task tracking, and isolation semantics).
3. Refactor the `ki-agents` standard and rubric into a portable core plus a Claude Code appendix. The core must govern role identity, delegation description, system-prompt body, grounding, lane boundaries, model-purpose reasoning, and evaluation. The appendix must govern Markdown/YAML layout and Claude-only fields. Do not add a Codex TOML generator or make a portability claim that needs one.
4. Update the `ki-agents` linter and its tests only where needed to express the split accurately. Preserve the existing Claude-agent audit as the validated implementation, and make its runtime specificity explicit rather than silently treating it as cross-runtime validation.
5. Align the public and always-on orientation: README, `CLAUDE.md`, `agents/README.md`, user-guide references, package keywords, and source footnotes. State that skills and MCP are portable in principle, while agents and hooks need adapters or further verification.
6. Record the implementation boundary in the ROADMAP: later work must be separately scoped before it changes install links, generates `.codex/agents/*.toml`, emits Codex MCP/plugin configuration, ports hooks, or adds Codex live evaluations. The follow-on scope must include an explicit skill-discovery budget and a hermetic no-skill evaluation baseline.
7. Run the mechanical governance checks and review all changed wording together so the decision, matrix, `ki-agents` standard, README, and roadmap make the same claim at the same confidence level.

## Files touched

- `ROADMAP.md`
- `docs/decisions/SDR-KI-HARNESS-002-runtime-portable-contracts.md`
- `docs/decisions/references/runtime-feature-coverage.md`
- `skills/ki-agents/SKILL.md`
- `skills/ki-agents/references/agent-definitions-standard.md`
- `skills/ki-agents/references/audit-rubric.md`
- `skills/ki-agents/references/sources.md`
- `skills/ki-agents/scripts/audit.ts` and its tests, if the rubric split changes a mechanical criterion
- `README.md`, `CLAUDE.md`, `agents/README.md`, and affected user-guide or prompting references
- `package.json`
- `docs/plans/README.md` and this plan while it remains active

## Verify

1. `bun run ki:plans:audit` exits 0 and indexes this file exactly once.
2. `bun run ki:agents:audit .` exits 0; the existing Markdown/YAML agents remain valid under the Claude Code appendix.
3. `bun run ki:skills:audit` and `bun run ki:authoring:audit` exit 0.
4. A review of the decision, matrix, `ki-agents` standard, README, and `agents/README.md` finds no claim that a Claude agent file, hook executable, or Plan Mode lifecycle ports to Codex unchanged.
5. Each Codex-specific factual statement links to the relevant primary OpenAI documentation or is explicitly labelled unverified.

## Dependencies / blocks

This plan has no plan-file dependency. It is the governance prerequisite for a later adapter workstream, but it does not itself authorize adapter code. That later work must receive its own ROADMAP item and plan before it begins, because it needs separate decisions on skill-link locations, `AGENTS.md` source-of-truth mechanics, Markdown-to-TOML agent generation, MCP/plugin projection, hook behavior, and Codex behavioural evaluation isolation.
