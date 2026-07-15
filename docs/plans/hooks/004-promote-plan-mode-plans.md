---
id: '004'
title: Promote Plan Mode plans into `docs/plans/`
status: open
roadmap: Promote Plan Mode plans into `docs/plans/`
blocks: —
blocked-by: —
---

# Promote Plan Mode plans into `docs/plans/`

## Context

Claude Code's interactive Plan Mode (`EnterPlanMode`/`ExitPlanMode`) plans land only as scratch files under `~/.claude/plans/`, so a plan drafted there is lost once the session ends unless someone manually re-authors it as a governed `docs/plans/` entry. The user wants those plans to end up in `docs/plans/<theme>/<NNN>-<slug>.md` instead, so a plan survives beyond the session and is versioned with the code it describes.

The original framing was "a hook that moves the plan file." Research surfaced why a blind, auto-firing hook is the wrong shape for the _move_ itself:

- `docs/plans/` frontmatter requires a `roadmap:` field — a plan with no ROADMAP `Blocking` or `Next` item is misfiled per the near-horizon principle (`skills/general-governance/ki-plans/references/plan-format.md`). A Plan Mode plan has no such linkage; picking one is a judgment call, not a mechanical copy.
- Filename placement (`<theme>/<NNN>-<slug>.md`) requires deriving the next global id (scan `docs/plans/README.md` for the current max) and picking/confirming a theme against ROADMAP sections — again judgment, not string manipulation a `PostToolUse` shell hook can safely do unattended.
- `docs/decisions/references/runtime-feature-coverage.md` explicitly flags that Claude Code's "Plan Mode" and this repo's "plan" artifact are "same word, entirely different mechanisms" — bridging them silently on every `ExitPlanMode` risks polluting `docs/plans/` with throwaway plans the user never meant to keep.
- `ki-plan`'s existing `new` subcommand (`skills/process/ki-plan/references/lifecycle.md`) already implements this exact id/theme/roadmap logic — but only as prose Claude executes itself when the skill runs, not as an importable script. There's nothing to shell out to from a hook.
- The existing hooks (`plan-stamp.sh`, `plan-sync.sh`) already had a symlink-traversal write bug caught by adversarial review before shipping; widening their write surface from `~/.claude/plans/` to arbitrary repo paths is exactly the kind of change that needs the same scrutiny, not an add-on afterthought.

So the approach below keeps the **existing hooks unchanged** and adds a new **`/plan promote` lifecycle subcommand** — a deliberate, user-invoked action (not an unattended hook) that reuses infrastructure the hooks already built.

## Current state

- `hooks/plan-stamp.sh` (`PostToolUse(ExitPlanMode)`) stamps YAML frontmatter (`status`, `created`, `cwd`) onto the Plan Mode scratch file in place, and — critically — writes `~/.claude/plans/.state/<session_id>` containing the resolved path to that scratch file. This state file is the exact pointer a promotion step needs.
- `hooks/plan-sync.sh` (`PostToolUse(TodoWrite)`) uses that same state file to keep syncing `TodoWrite` progress into the scratch plan as the user works.
- Both hooks hard-validate (via `realpath`-style resolution) that the target file stays inside `$HOME/.claude/plans` — a safety gate that must **not** be loosened; it stays exactly as-is.
- `ki-plan`'s `new` subcommand (`skills/process/ki-plan/SKILL.md`, `references/lifecycle.md`) already knows how to: derive the next global id from `docs/plans/README.md`, confirm a theme folder against ROADMAP, confirm the `roadmap:` field against a ROADMAP `Blocking` or `Next` entry, write the canonical template (`plan-format.md`), and append the README row + dependency graph. There is no `execute`/`done`/`status`-style script backing it — it's all skill-invocation prose.
- Hooks are registered via `skills/keystone/ki-bootstrap/scripts/link-hooks.ts`'s `HOOK_NAMES`/`HOOK_PAIRS`, merge-patched into `~/.claude/settings.json` under `hooks.PostToolUse` as `{matcher, hooks:[{type:'command', command, timeout:5}]}`. No new entry is needed here since no new hook script is being added.

## Steps

1. Add a `promote [theme]` entry to `skills/process/ki-plan/SKILL.md`'s dispatch table, alongside `new`/`execute`/`done`/`status`.
2. Add a `promote` section to `skills/process/ki-plan/references/lifecycle.md` describing the algorithm:
   - Resolve `session_id`, read `~/.claude/plans/.state/<session_id>`; if absent, tell the user there's no Plan Mode plan for this session to promote.
   - Read the stamped scratch plan file; extract a title (first `#`/first line) and the freeform body.
   - Confirm the theme (from the optional `[theme]` arg, else ask) and the `roadmap:` item (must match a ROADMAP `Blocking` or `Next` entry — refuse and ask the user to add one first if none fits, per the near-horizon principle; do not invent a linkage).
   - Derive the next global id the same way `new` does (max id across `docs/plans/README.md` + 1).
   - Map the scratch plan's prose into the canonical sections (`Context`, `Current state`, `Steps`, `Files touched`, `Verify`, `Dependencies / blocks`), marking anything that doesn't map cleanly with `<!-- TODO -->` — the same best-effort convention `new` already uses for gaps.
   - Write `docs/plans/<theme>/<NNN>-<slug>.md`, append the `README.md` row, rebuild the dependency graph.
   - Leave the original `~/.claude/plans/` scratch file untouched (v1 does not re-point `plan-sync.sh`'s TodoWrite syncing at the new file — that would widen the hook's write surface from `~/.claude/plans/` to arbitrary repo paths, which is a separate, security-sensitive change to scope later if wanted).
3. Add a short cross-reference note to `hooks/README.md` stating that `plan-stamp.sh`'s `.state/<session_id>` file is also consumed by `/plan promote`, so it doesn't read as dead/orphaned state to a future reader.

## Files touched

- `skills/process/ki-plan/SKILL.md`
- `skills/process/ki-plan/references/lifecycle.md`
- `hooks/README.md`

## Verify

- Manually run `/plan promote` mid-session after a Plan Mode exit: confirm it locates the scratch file via `.state/<session_id>`, prompts for/derives theme + roadmap + id correctly, writes a `docs/plans/<theme>/<NNN>-<slug>.md` that passes `ki:plans:audit` (frontmatter, README sync, dependency integrity), and appends a correct README row.
- Confirm `plan-stamp.sh`/`plan-sync.sh` behavior and their existing tests (`hooks/plan-stamp.test.ts`, `hooks/plan-sync.test.ts`) are unaffected — no changes were made to either script.
- Confirm `/plan new`'s existing behavior is unchanged (this only adds a sibling subcommand, doesn't touch `new`'s logic).

## Dependencies / blocks

None.
