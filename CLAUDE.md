# CLAUDE.md — ki-agentic-harness

@AGENTS.md

The runtime-neutral orientation for this repo lives in [AGENTS.md](AGENTS.md), imported above — read it first. **This file holds only Claude-Code-specific notes.** When you add or change orientation guidance, put it in `AGENTS.md` by default; only keep a note here if it is genuinely Claude-Code-only (a `.claude/` path, a Claude-Code tool or setting). Common guidance written in `CLAUDE.md` is invisible to Codex and the 20+ other tools that read `AGENTS.md` — so a shared rule placed here silently fails to reach them.

## Claude Code specifics

- **Install/link paths** — the bootstrap keystone links into `~/.claude/skills` (`bun run ki:skills:link:global`); this repo's project-local skills/agents wire under `.claude/skills` and `.claude/agents` (`bun run ki:skills:link:project`, `--all` here). Codex uses `.agents/skills` and `~/.codex/` — see the [runtime parity scorecard](docs/decisions/references/runtime-parity-scorecard.md).
- **Hooks** — three global scripts register via `.claude/settings.json` (`ki:hooks:link:global`): the Plan Mode lifecycle pair and the `Stop(*)` stale Git-lock guard. These are Claude Code-native and have no confirmed Codex equivalent.

<!-- headroom:learn:start -->

<!-- headroom:learn:end -->
