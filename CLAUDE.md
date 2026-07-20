# CLAUDE.md — ki-agentic-harness

@AGENTS.md

The runtime-neutral orientation for this repo lives in [AGENTS.md](AGENTS.md), imported above — read it first. **This file holds only Claude-Code-specific notes.** When you add or change orientation guidance, put it in `AGENTS.md` by default; only keep a note here if it is genuinely Claude-Code-only (a `.claude/` path, a Claude-Code tool or setting). Common guidance written in `CLAUDE.md` is invisible to Codex and the 20+ other tools that read `AGENTS.md` — so a shared rule placed here silently fails to reach them.

## Claude Code specifics

- **Install/link paths** — the bootstrap keystone links into `~/.claude/skills` (`bun run ki:skills:link:global`); bootstrap wires this harness's project-local skills under `.claude/skills` and `.agents/skills` as source links. Codex uses `.agents/skills` and `~/.codex/` — see the [runtime parity scorecard](docs/decisions/references/runtime-parity-scorecard.md).
- **Hooks** — `ki:hooks:install` copies the three global hook payload files and an active manifest under `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`; it never writes `.claude/settings.json`. A user-environment manager binds the Plan Mode lifecycle pair and `Stop(*)` stale Git-lock guard into settings. These are Claude Code-native and have no confirmed Codex equivalent.

<!-- headroom:learn:start -->

<!-- headroom:learn:end -->
