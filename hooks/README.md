# hooks

Knowledge Islands **Claude Code hooks**.

This directory is where the harness's hook scripts consolidate — the `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `PreCompact`, and similar handlers a consuming repo (or the personal `~/.claude/` environment) wires into a `settings.json`. The current surface has two concerns: the `plan-stamp.sh` / `plan-sync.sh` Plan Mode lifecycle pair and the `git-lock-check.sh` stale-lock guard.

`plan-stamp.sh` records the authenticated current-session pointer at `~/.claude/plans/.state/<session_id>` as v1 JSON with exactly `version`, `session_id`, `plan_file`, and the hook event's physically resolved `cwd`. `plan-sync.sh` validates that state before updating progress. It temporarily accepts a safe legacy one-line plaintext plan pointer for progress sync only; malformed JSON is rejected, and `/ki-plan promote` rejects all legacy state because it has no trusted repository provenance. Neither hook promotes or writes a governed repository plan: promotion remains a deliberate `/ki-plan promote` action, and it preserves the scratch plan and state record.

`git-lock-check.sh` runs at `Stop(*)`. In the current Git worktree it removes stale `*.lock` files from the physical Git directory only when no relevant Git process is active. It exits successfully without mutation outside a worktree, when process state cannot be checked safely, or when a candidate no longer proves to be a real file beneath that Git directory. This guard recovers locks left by killed commands; it is not permission to interrupt write-mode Git operations.

The lock guard is best-effort recovery in a trusted user account. It rechecks candidate type, physical parent containment, and process state immediately before each removal, but portable shell cannot combine that parent proof and unlink into one descriptor-relative operation. It therefore does not claim to defend against a same-UID adversary concurrently replacing Git-administration path components.

Two install patterns apply, and they diverge:

- **Project-local** (the general pattern) — a consuming repo wires a handler into its own `.claude/settings.json`, scoped to that repo.
- **Global** (the current surface) — install via `bun run ki:hooks:link:global` (or `bun skills/keystone/ki-bootstrap/scripts/link-hooks.ts`), which symlinks all three scripts into `~/.claude/hooks/` and merge-patches each script's declared event and matcher into `~/.claude/settings.json`. Plan-file lifecycle is tied to personal `~/.claude/plans/` state; the lock guard applies across every worktree. Both therefore install at the home-directory level rather than per-repo.

Hooks have no dedicated governing skill yet — they are advisory, like [evals/](../evals). The bundle layout is fixed by ADR-KI-HARNESS-001 and governed by the **`ki-harness`** skill under [skills/](../skills).

The `plan-stamp.sh` / `plan-sync.sh` pair and Plan Mode discovery used by `/ki-plan promote` are bound to Claude Code's built-in interactive Plan Mode (the `EnterPlanMode`/`ExitPlanMode` tool pair). Per the [runtime feature-coverage matrix](../docs/decisions/references/runtime-feature-coverage.md), that primitive has no known OpenAI Codex CLI equivalent, so this discovery bridge must not be assumed to port to a second runtime for free. The governed `docs/roadmap/<theme>/plans/` artifact remains runtime-neutral. Codex CLI has its own hooks system with its own event set, but compatibility with Claude Code hook scripts is unverified — there is no confirmed shared plugin env-var convention — so a shared hook executable across runtimes is not proven; any future governed-hooks work (tracked as the "Hooks as a governed harness surface" ROADMAP item) must treat cross-runtime hook portability as an open question, not a given.
