# CLAUDE.md — ki-agentic-harness

@AGENTS.md

The runtime-neutral orientation lives in [AGENTS.md](AGENTS.md), imported above. This appendix contains only Claude-Code-specific repository detail.

## Claude Code specifics

- **Hooks** — the canonical harness carries the three global hook payload files, but `ki` does not write `.claude/settings.json`. A user-environment manager binds the Claude Code Plan Mode lifecycle pair and `Stop(*)` stale Git-lock guard into settings.
