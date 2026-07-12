# hooks

Knowledge Islands **Claude Code hooks**.

This directory is where the harness's hook scripts consolidate — the `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`, and similar handlers a consuming repo (or the personal `~/.claude/` environment) wires into a `settings.json`. It now holds its first pair: `plan-stamp.sh` and `plan-sync.sh`, a `PostToolUse(ExitPlanMode)` / `PostToolUse(TodoWrite)` pair that stamps and syncs lifecycle status onto Claude Code's personal `~/.claude/plans/` plan-mode scratch files.

Two install patterns apply, and they diverge:

- **Project-local** (the general pattern) — a consuming repo wires a handler into its own `.claude/settings.json`, scoped to that repo.
- **Global** (this pair) — install via `bun run ki:hooks:link:global` (or `bun skills/ki-bootstrap/scripts/link-hooks.ts`), which symlinks `plan-stamp.sh`/`plan-sync.sh` into `~/.claude/hooks/` and merge-patches `~/.claude/settings.json` directly. Plan-file lifecycle is inherently personal/global — tied to `~/.claude/plans/`, not any one repo — so it installs at the home-directory level rather than per-repo.

Hooks have no dedicated governing skill yet — they are advisory, like [evals/](../evals). The bundle layout is fixed by ADR-KI-HARNESS-001 and governed by the **`ki-harness`** skill under [skills/](../skills).
