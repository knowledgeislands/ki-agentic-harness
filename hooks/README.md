# hooks

Knowledge Islands **Claude Code hooks**.

This directory is where the harness's hook scripts consolidate — the `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`, and similar handlers a consuming repo (or the personal `~/.claude/` environment) wires into a `settings.json`. It now holds its first pair: `plan-stamp.sh` and `plan-sync.sh`, a `PostToolUse(ExitPlanMode)` / `PostToolUse(TodoWrite)` pair that stamps and syncs lifecycle status onto Claude Code's personal `~/.claude/plans/` plan-mode scratch files.

Two install patterns apply, and they diverge:

- **Project-local** (the general pattern) — a consuming repo wires a handler into its own `.claude/settings.json`, scoped to that repo.
- **Global** (this pair) — install via `bun run ki:hooks:link:global` (or `bun skills/keystone/ki-bootstrap/scripts/link-hooks.ts`), which symlinks `plan-stamp.sh`/`plan-sync.sh` into `~/.claude/hooks/` and merge-patches `~/.claude/settings.json` directly. Plan-file lifecycle is inherently personal/global — tied to `~/.claude/plans/`, not any one repo — so it installs at the home-directory level rather than per-repo.

Hooks have no dedicated governing skill yet — they are advisory, like [evals/](../evals). The bundle layout is fixed by ADR-KI-HARNESS-001 and governed by the **`ki-harness`** skill under [skills/](../skills).

The `plan-stamp.sh` / `plan-sync.sh` pair is bound to Claude Code's built-in interactive Plan Mode (the `EnterPlanMode`/`ExitPlanMode` tool pair), which — per the runtime feature-coverage matrix at [docs/decisions/references/runtime-feature-coverage.md](../docs/decisions/references/runtime-feature-coverage.md) — has no known OpenAI Codex CLI equivalent, so these hooks must not be assumed to port to a second runtime for free. Codex CLI has its own hooks system with its own event set, but compatibility with Claude Code hook scripts is unverified — there is no confirmed shared plugin env-var convention — so a shared hook executable across runtimes is not proven; any future governed-hooks work (tracked as the "Hooks as a governed harness surface" ROADMAP item) must treat cross-runtime hook portability as an open question, not a given.
