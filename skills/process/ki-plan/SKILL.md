---
name: ki-plan
implies: []
description: >
  Drives the plan lifecycle for a code repo — done / execute / new / promote / status — as an installable process skill (kind: process, ADR-KI-HARNESS-SKILLS-006). It creates and executes governed plans, closes them with ROADMAP sync, and deliberately promotes the current Claude Code Plan Mode scratch plan into `docs/plans/`. The format and methodology belong to the governance skill `ki-plans`, which this skill composes on and never restates. Triggers: "close this plan", "execute plan", "new plan", "promote this Plan Mode plan", "plan status", "/ki-plan". Not for Knowledge Islands KB repos (`repo_type = "kb"`), where planning is a `ki-kb-streams` proposal Checklist.
argument-hint: 'done <id> | execute <id> | new <theme> <title> | promote | status | help'
---

# ki-plan

**Kind:** process. Drives one plan's lifecycle; the class-level standard (format, methodology) is owned by [`ki-plans`](../../general-governance/ki-plans/SKILL.md) — see [references/lifecycle.md](references/lifecycle.md) for the full procedure this skill carries out.

## What this skill does

Runs the plan lifecycle for a **code repo**: `done` (close a plan and sync ROADMAP), `execute` (work its Steps), `new` (write a plan file), `promote` (turn the current Claude Code Plan Mode scratch plan into a governed plan), and `status` (show the active index). It is the process counterpart to `ki-plans` — paired deliberately, singular verb beside plural class, drive-an-instance beside govern-the-class. It reads the plan format and quality bar from `ki-plans`' [plan-format.md](../../general-governance/ki-plans/references/plan-format.md) rather than restating them.

## Planning is repo-first

In a KI code repo the plan is a governed file under `docs/plans/`, authored through this skill — never a Claude-native Plan Mode scratch file in `~/.claude/plans/`. When a user asks to plan, including by entering native Plan Mode, treat `docs/plans/<theme>/<NNN>-<slug>.md` as the source of truth and create it here with `new`; a `~/.claude/plans/` scratch file, if one exists, is only a draft and is never canonical. Where a native draft exists, prefer to leave in it a pointer to the governed repo plan rather than duplicating content. This keeps planning identical across runtimes — Codex has no Plan Mode, so plans simply live where the repo expects them — and removes any dependency on Plan Mode hooks firing. The `promote` verb, which bridges a native Plan Mode scratch plan into `docs/plans/` via the `ExitPlanMode` hook, is therefore an optional Claude-Code-CLI-only convenience subordinate to `new`, and is unavailable on surfaces that do not fire that hook (e.g. the SDK/editor extension).

## Invocation

`help` / `-h` / `?` explains this skill and stops, taking no action. With no argument, present the five lifecycle verbs in the order above using the runtime's available interactive choice mechanism; in a non-interactive session, print the same choices and stop. Otherwise dispatch on the first token of the argument per [references/lifecycle.md](references/lifecycle.md).

**Claude Code session token for `promote`:** `${CLAUDE_SESSION_ID}`. Claude Code resolves this always-loaded value before the skill reaches the model. `promote` binds that resolved value as the current session id and fails closed if it remains unresolved or is not filename-safe; do not move this placeholder into the on-demand lifecycle reference. Other lifecycle verbs do not depend on it.

## Preflight (every sub-command)

1. `git rev-parse --show-toplevel` → git root.
2. If `.ki-config.toml` at the git root has `repo_type = "kb"`: **stop** — in a KB, planning is a stream proposal's `## Checklist`, governed by `ki-kb-streams`. This skill is code-repo only.
3. For `done`, `execute`, `new`, and `status`, resolve the plans directory as `<git-root>/docs/plans/` or the `[plans] path` override in `.ki-config.toml`; create missing plan structure only when the selected verb writes it. `promote` has a deliberately narrower, read-first preflight: it supports only the default physical `<git-root>/docs/plans/`, rejects an override, and creates nothing until every validation gate in the lifecycle procedure passes.

## Notes

- No universal AUDIT/CONFORM/INIT/REFRESH modes — this is a process skill (ADR-KI-HARNESS-SKILLS-001, ADR-KI-HARNESS-SKILLS-006); its "modes" are the lifecycle sub-commands above.
- Installable globally (`ki:skills:link:global`), alongside `ki-bootstrap` — usable in any code repo on the machine, not just this one. Like `ki-bootstrap`, never vendored or declared in a repo's `.ki-config.toml` — no `[ki-plan]` table, ever.
- The governed `docs/plans/` artifact and the file-oriented `done`, `execute`, `new`, and `status` procedures are runtime-neutral; adapt interactive prompts to the host runtime. `promote` is Claude-Code-only because it consumes Claude Code's Plan Mode hook state and session substitution.
