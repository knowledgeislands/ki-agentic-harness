---
id: '004'
title: Promote Plan Mode plans into `docs/plans/`
status: in-progress
roadmap: Promote Plan Mode plans into `docs/plans/`
blocks: —
blocked-by: —
---

# Promote Plan Mode plans into `docs/plans/`

## Context

Claude Code's interactive Plan Mode (`EnterPlanMode`/`ExitPlanMode`) plans land as personal scratch files under `~/.claude/plans/`. The file can remain after a session ends, but it is neither versioned with the repository nor governed and indexed as a `docs/plans/` artifact. The user wants selected Plan Mode plans promoted into `docs/plans/<theme>/<NNN>-<slug>.md` so they become durable repository work rather than undiscoverable runtime scratch.

The original framing was "a hook that moves the plan file." Research surfaced why a blind, auto-firing hook is the wrong shape for the _move_ itself:

- `docs/plans/` frontmatter requires a `roadmap:` field — a plan with no ROADMAP `Blocking` or `Next` item is misfiled per the near-horizon principle (`skills/general-governance/ki-plans/references/plan-format.md`). A Plan Mode plan has no such linkage; picking one is a judgment call, not a mechanical copy.
- Filename placement (`<theme>/<NNN>-<slug>.md`) requires deriving the next global id (scan `docs/plans/README.md` for the current max) and picking/confirming a theme against ROADMAP sections — again judgment, not string manipulation a `PostToolUse` shell hook can safely do unattended.
- `docs/decisions/references/runtime-feature-coverage.md` explicitly flags that Claude Code's "Plan Mode" and this repo's "plan" artifact are "same word, entirely different mechanisms" — bridging them silently on every `ExitPlanMode` risks polluting `docs/plans/` with throwaway plans the user never meant to keep.
- `ki-plan`'s existing `new` subcommand (`skills/process/ki-plan/references/lifecycle.md`) already implements this exact id/theme/roadmap logic — but only as prose Claude executes itself when the skill runs, not as an importable script. There's nothing to shell out to from a hook.
- The existing hooks (`plan-stamp.sh`, `plan-sync.sh`) already had a symlink-traversal write bug caught by adversarial review before shipping; widening their write surface from `~/.claude/plans/` to arbitrary repo paths is exactly the kind of change that needs the same scrutiny, not an add-on afterthought.

So the approach below keeps the **existing hooks unchanged** and adds a new **`/ki-plan promote` lifecycle subcommand** — a deliberate, user-invoked action (not an unattended hook) that reuses infrastructure the hooks already built.

## Current state

- `hooks/plan-stamp.sh` (`PostToolUse(ExitPlanMode)`) stamps YAML frontmatter (`status`, `created`, `cwd`) onto the Plan Mode scratch file in place, and — critically — writes `~/.claude/plans/.state/<session_id>` containing the resolved path to that scratch file. This state file is the exact pointer a promotion step needs.
- `hooks/plan-sync.sh` (`PostToolUse(TodoWrite)`) uses that same state file to keep syncing `TodoWrite` progress into the scratch plan as the user works.
- Both hooks hard-validate (via `realpath`-style resolution) that the target file stays inside `$HOME/.claude/plans` — a safety gate that must **not** be loosened; it stays exactly as-is.
- Claude Code skills support `${CLAUDE_SESSION_ID}` substitution in `SKILL.md`; Claude Code replaces it with the current session identifier before the skill content reaches the model. Hook JSON's `session_id` is the same current-session identifier, so the resolved substitution selects the state file written by `plan-stamp.sh`. Supporting reference files read later are ordinary files, so the substitution must appear in the always-loaded `SKILL.md`, not only in `references/lifecycle.md`.
- The installed skill directory is `ki-plan`, so its explicit slash invocation is `/ki-plan`; `/plan` was the name of the former custom command and is not an installed alias.
- `ki-plan`'s `new` subcommand (`skills/process/ki-plan/SKILL.md`, `references/lifecycle.md`) already knows how to: derive the next global id from `docs/plans/README.md`, confirm a theme folder against ROADMAP, confirm the `roadmap:` field against a ROADMAP `Blocking` or `Next` entry, write the canonical template (`plan-format.md`), and append the README row + dependency graph. There is no `execute`/`done`/`status`-style script backing it — it's all skill-invocation prose.
- Hooks are registered via `skills/keystone/ki-bootstrap/scripts/link-hooks.ts`'s `HOOK_NAMES`/`HOOK_PAIRS`, merge-patched into `~/.claude/settings.json` under `hooks.PostToolUse` as `{matcher, hooks:[{type:'command', command, timeout:5}]}`. No new entry is needed here since no new hook script is being added.
- Claude Code now supports a configurable `plansDirectory`, but the existing hooks deliberately jail their reads and writes to the default `$HOME/.claude/plans`. Promotion v1 therefore supports the default directory only; it must fail closed rather than scan another directory or imply support the hooks do not provide.

## Steps

1. Update `skills/process/ki-plan/SKILL.md` to expose `promote [theme]` alongside `new`/`execute`/`done`/`status`, use the real `/ki-plan` invocation, and describe `promote` as a Claude-Code-only bridge while the rest of the lifecycle remains runtime-neutral. Put the `${CLAUDE_SESSION_ID}` token in this always-loaded file and tell the lifecycle procedure to stop if the runtime leaves it unresolved.
2. Add a `promote` section to `skills/process/ki-plan/references/lifecycle.md` describing the algorithm:
   - Consume the session id already resolved in `SKILL.md`; reject an empty or unexpanded value, `.`, `..`, or any value containing `/`. Do not infer an id from timestamps, process state, transcript names, or directory scans.
   - Read only `$HOME/.claude/plans/.state/<session_id>`. If it is absent, not a regular file, or a symlink, stop and report that this session has no safe Plan Mode plan to promote. Do not fall back to another session's state.
   - Resolve the scratch-plan path stored in the state file and repeat the hooks' safety boundary before reading: the target must be a regular, non-symlink file whose resolved parent is `$HOME/.claude/plans` or a descendant. Refuse traversal, a target outside the jail, and a configured custom `plansDirectory`; do not weaken the hooks' containment contract.
   - Read the stamped scratch plan, resolve its `cwd` to a git root, and require it to equal the current preflight git root. Stop with both roots named when they differ, because one Claude session can move between repositories and its state pointer names only the most recently exited Plan Mode plan.
   - Extract a title from the first Markdown heading (falling back to the first non-frontmatter content line) and retain the freeform body as source material.
   - Confirm the theme (from the optional `[theme]` arg, else ask) and the `roadmap:` item (must match a ROADMAP `Blocking` or `Next` entry — refuse and ask the user to add one first if none fits, per the near-horizon principle; do not invent a linkage).
   - Derive the next global id the same way `new` does (max id across `docs/plans/README.md` + 1).
   - Map the scratch plan's prose into the canonical sections (`Context`, `Current state`, `Steps`, `Files touched`, `Verify`, `Dependencies / blocks`), marking anything that doesn't map cleanly with `<!-- TODO -->` — the same best-effort convention `new` already uses for gaps.
   - Write `docs/plans/<theme>/<NNN>-<slug>.md`, append the `README.md` row, rebuild the dependency graph.
   - Leave the original `~/.claude/plans/` scratch file untouched (v1 does not re-point `plan-sync.sh`'s TodoWrite syncing at the new file — that would widen the hook's write surface from `~/.claude/plans/` to arbitrary repo paths, which is a separate, security-sensitive change to scope later if wanted).
3. Add a short cross-reference note to `hooks/README.md` stating that `plan-stamp.sh`'s `.state/<session_id>` file is also consumed by `/ki-plan promote`, documenting the default-directory contract and why the state is not dead or orphaned.
4. Update `docs/guides/user-guide/skill-catalogue.md` so the listed lifecycle and runtime boundary include `promote` without implying that Claude Code Plan Mode exists on every runtime.

## Files touched

- `skills/process/ki-plan/SKILL.md`
- `skills/process/ki-plan/references/lifecycle.md`
- `hooks/README.md`
- `docs/guides/user-guide/skill-catalogue.md`

## Verify

- Manually run `/ki-plan promote` mid-session after a Plan Mode exit: confirm the `SKILL.md` substitution selects that session's `.state/<session_id>`, the command prompts for or derives theme + roadmap + id correctly, the scratch body maps without losing material, and the resulting `docs/plans/<theme>/<NNN>-<slug>.md` plus README row pass `ki:plans:audit`.
- Exercise fail-closed cases and confirm none writes under `docs/plans/`: an unresolved or malformed session id; missing, symlinked, or non-regular state; a state pointer outside `$HOME/.claude/plans`; a symlinked scratch file; a stamped `cwd` in another git root; and a custom `plansDirectory` unsupported by the existing hooks. Confirm the procedure never selects a nearest or most-recent fallback plan.
- Confirm `plan-stamp.sh`/`plan-sync.sh` behavior and their existing tests (`hooks/plan-stamp.test.ts`, `hooks/plan-sync.test.ts`) are unaffected — no changes were made to either script.
- Confirm `/ki-plan new`'s existing behavior is unchanged and remains usable outside Claude Code; only `promote` depends on Claude Code's substitution and Plan Mode hooks.
- Run `bun run ki:plans:audit`, `bun run ki:skills:audit`, and `bun run ki:authoring:audit` after the documentation changes.

## Dependencies / blocks

No plan dependency. Runtime dependency for `promote`: Claude Code skill substitution plus the installed `plan-stamp.sh` hook using the default `$HOME/.claude/plans` directory. The other `ki-plan` subcommands remain runtime-neutral.
