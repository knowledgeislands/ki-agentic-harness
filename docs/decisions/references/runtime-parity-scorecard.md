# Runtime parity scorecard — Claude Code vs Codex CLI

Reference companion to [SDR-KI-HARNESS-002](../SDR-KI-HARNESS-002-runtime-portable-contracts.md) and its sibling [runtime feature-coverage matrix](runtime-feature-coverage.md). This is a **reference doc, not a decision record** — it carries no decision, needs no Decisions-index entry, and is edited freely as the gap moves.

Two lenses, deliberately separate: the **feature-coverage matrix** tracks the _native runtime primitives_ (Plan Mode, hooks, subagents, MCP, memory …) and whether each runtime has them. This **scorecard** tracks the _harness's own bundle parts_ — where each stands on Claude Code vs Codex, and what it takes to close the gap. Read the matrix to know whether a mechanism ports at all; read this to know how far the harness itself has been carried across.

## Legend

- **●** — works in both runtimes.
- **◐** — partial: present on Claude Code, and a shim/generator exists or is straightforward.
- **○** — absent on Codex: no working path yet.

## Scorecard

| Part                | Claude Code                | Codex CLI                   | Parity | Comments                                                |
| ------------------- | -------------------------- | --------------------------- | ------ | ------------------------------------------------------- |
| Skills — content    | `SKILL.md`                 | same `SKILL.md`             | ●      | Open Agent Skills standard; one identical file. †       |
| Skills — install    | `.claude/skills`           | `.agents/skills`            | ●      | Bootstrap linker loops declared runtimes (landed).      |
| Project orientation | `CLAUDE.md` → `@AGENTS.md` | `AGENTS.md`                 | ●      | `AGENTS.md` is the common core; `CLAUDE.md` imports it. |
| MCP servers         | JSON surfaces              | TOML `~/.codex/config.toml` | ●      | `ki-binding` renders it via `codex mcp add\|remove`. ‡  |
| Agents              | MD+YAML `.claude/agents`   | TOML (absent)               | ○      | Needs an MD→TOML generator; linker skips Codex. §       |
| Hooks               | Plan-Mode hooks            | none                        | ○      | No confirmed Codex equivalent. ¶                        |
| Evals               | scenarios                  | unproven                    | ○      | Runtime-agnostic by design; never run on Codex.         |

† Skill checkers are `bun` scripts and the `ki:*` package.json keys wrap them — runtime-blind, so they run identically under either runtime once discovered.

‡ `ki-binding`'s source is a renderer-neutral `mcp-servers.yaml`; its Codex renderer (`render-codex.ts`) shells Codex's native merge-safe `codex mcp add|remove` to write `[mcp_servers.<name>]` into `~/.codex/config.toml`, verified end-to-end against codex-cli 0.144.4. Separately, `mcp/` ships no servers yet.

§ Codex subagents are TOML under `~/.codex/agents/` (`name`/`description`/`developer_instructions`), a different shape from Claude Code's Markdown+YAML. `ki-repo`'s explicit development linker reports-and-skips Codex pending the generator; the format is spiked, not built.

¶ `plan-stamp`/`plan-sync` ride Claude Code's native Plan Mode, which the matrix marks **None known** for Codex. Parity here likely means a KI-invented reimplementation of the capability, not a port — the way `ki-repo-roadmap`/`ki-plan` are already pure KI inventions with zero runtime dependency.

## Working in both concurrently — the critical path

The near-term goal was **not** full feature parity of everything shipped today. It was the narrower, more valuable milestone of being able to **develop in both runtimes side by side** — needing only **skills** and **MCP** at parity. **Done, 2026-07-14:**

1. **Skills — done.** Both runtimes install and discover them; nothing blocks concurrent use here.
2. **`AGENTS.md` — done.** The runtime-neutral orientation core; `CLAUDE.md` opens with `@AGENTS.md`.
3. **MCP → Codex — done.** `ki-binding`'s Codex renderer emits `~/.codex/config.toml` `[mcp_servers.*]` from the neutral `mcp-servers.yaml`.

The develop-in-both milestone is closed. Explicitly **off** that path, still open as their own future items: **agents** (MD→TOML generator), **hooks** (Phase 3 generator + the Plan-Mode question), and **evals** on Codex. These are governance/automation depth, not blockers to concurrent development.

## When to revisit

Update a row whenever: a linker or generator lands (skills-install, agents, hooks), a runtime's documentation shifts a primitive's status (re-check against the matrix), a new bundle part ships, or the concurrent-dev path clears a step. A parity cell moving ● / ◐ / ○ should be reflected here in the same change that causes it.
