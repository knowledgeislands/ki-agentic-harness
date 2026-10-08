# hooks

Knowledge Islands **Claude Code hooks**.

This directory is where the harness's hook scripts consolidate — the `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `PreCompact`, and similar handlers a consuming repo (or the personal `~/.claude/` environment) wires into a `settings.json`. The current surface has two concerns: the `plan-stamp.sh` / `plan-sync.sh` Plan Mode lifecycle pair and the `git-lock-check.sh` stale-lock guard.

`plan-stamp.sh` records the authenticated current-session pointer at `~/.claude/plans/.state/<session_id>` as v1 JSON with exactly `version`, `session_id`, `plan_file`, and the hook event's physically resolved `cwd`. `plan-sync.sh` accepts only that validated JSON V1 state before updating progress; malformed, schema-invalid, and plaintext records fail closed. Neither hook promotes or writes a governed repository plan: promotion remains a deliberate `/ki-plan promote` action, and it preserves the scratch plan and state record.

`git-lock-check.sh` runs at `Stop(*)`. In the current Git worktree it removes stale `*.lock` files from the physical Git directory only when no relevant Git process is active. It exits successfully without mutation outside a worktree, when process state cannot be checked safely, or when a candidate no longer proves to be a real file beneath that Git directory. This guard recovers locks left by killed commands; it is not permission to interrupt write-mode Git operations.

The lock guard is best-effort recovery in a trusted user account. It rechecks candidate type, physical parent containment, and process state immediately before each removal, but portable shell cannot combine that parent proof and unlink into one descriptor-relative operation. It therefore does not claim to defend against a same-UID adversary concurrently replacing Git-administration path components.

Two ownership boundaries apply, and they deliberately diverge:

- **Repository-facing declarations** — a consuming skill may declare and audit that it needs a hook capability, but it does not write the user's global Claude settings.
- **Harness payload and runtime binding** — the verified compatible-harness payload installed by `ki` carries these hook sources. A user-environment manager owns any executable deployment and Claude Code registration derived from them. `ki bootstrap`, skill activation, and repository operations never write `.claude/settings.json` or mutate unrelated user hook state.

On a chezmoi-managed machine, `ki-repo-dotfiles-chezmoi` validates the selected payload and renders the matching Claude Code registrations. That binding is deliberately outside CLI harness installation and repository governance. Plan-file lifecycle is tied to personal `~/.claude/plans/` state; the lock guard applies across every worktree, so both remain home-directory capabilities rather than project-local hook installation.

The bundle layout remains governed by `ki-repo-harness`; `ki-plan` owns the Plan Mode lifecycle semantics; and `ki-git` owns the portable stale-lock guard contract. `ki-repo-dotfiles-chezmoi` retains runtime-specific Claude Code registration. No hook is an ungoverned policy surface.

The `plan-stamp.sh` / `plan-sync.sh` pair and Plan Mode discovery used by `/ki-plan promote` are bound to Claude Code's built-in interactive Plan Mode (the `EnterPlanMode`/`ExitPlanMode` tool pair). Per the runtime coverage in [SDR-KI-HARNESS-002](../docs/decisions/SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md), that primitive has no known OpenAI Codex CLI equivalent, so this discovery bridge must not be assumed to port to a second runtime for free. The governed flat `docs/roadmap/<REPO>-<NNN>-<slug>.md` work-item artifact remains runtime-neutral. Codex CLI has its own hooks system with its own event set, but compatibility with Claude Code hook scripts is unverified — there is no confirmed shared plugin env-var convention — so a shared hook executable across runtimes is not proven; any future governed-hooks work must treat cross-runtime hook portability as an open question, not a given.
