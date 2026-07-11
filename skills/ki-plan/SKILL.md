---
name: ki-plan
implies: []
description: >
  Drives the plan lifecycle for a code repo — new / execute / done / status — promoted from the former `/plan` command so it is installable globally, not just project-local to this repo. A process skill (kind: process, ADR-KI-HARNESS-SKILLS-006): it carries out the lifecycle, it does not hold the standard. The format (frontmatter, sections, filename, README index) and methodology (when to plan, the near-horizon principle, quality bar) belong to the governance skill `ki-plans`, which this skill composes on and never restates. Triggers: "new plan", "start a plan", "execute plan", "plan status", "close out this plan", "/plan". Not for Knowledge Islands KB repos (`repo_type = "kb"`) — there, planning is a `ki-kb-streams` proposal Checklist.
argument-hint: 'new <theme> <title> | execute <id> | done <id> | status | help'
---

# ki-plan

**Kind:** process. Drives one plan's lifecycle; the class-level standard (format, methodology) is owned by [`ki-plans`](../ki-plans/SKILL.md) — see [references/lifecycle.md](references/lifecycle.md) for the full procedure this skill carries out.

## What this skill does

Runs the plan lifecycle for a **code repo**: `new` (write a plan file), `execute` (work its Steps), `done` (close it out and sync ROADMAP), `status` (show the active index). It is the process counterpart to `ki-plans` — paired deliberately, singular verb beside plural class, drive-an-instance beside govern-the-class. It reads the plan format and quality bar from `ki-plans`' [plan-format.md](../ki-plans/references/plan-format.md) rather than restating them.

## Invocation

`help` / `-h` / `?` explains this skill and stops, taking no action. With no argument, in an interactive session, it offers the four sub-commands via `AskUserQuestion`. Otherwise dispatch on the first token of the argument per [references/lifecycle.md](references/lifecycle.md).

## Preflight (every sub-command)

1. `git rev-parse --show-toplevel` → git root.
2. If `.ki-config.toml` at the git root has `repo_type = "kb"`: **stop** — in a KB, planning is a stream proposal's `## Checklist`, governed by `ki-kb-streams`. This skill is code-repo only.
3. Plans directory: `<git-root>/docs/plans/` (or a `[plans] path` override in `.ki-config.toml`). Create it if absent; if `README.md` is missing, seed it from the index structure in `ki-plans`' [plan-format.md](../ki-plans/references/plan-format.md).

## Notes

- No universal AUDIT/CONFORM/INIT/REFRESH modes — this is a process skill (ADR-KI-HARNESS-SKILLS-001, ADR-KI-HARNESS-SKILLS-006); its "modes" are the lifecycle sub-commands above.
- Installable globally (`ki:skills:link:global`), alongside `ki-bootstrap` — usable in any code repo on the machine, not just this one. Like `ki-bootstrap`, never vendored or declared in a repo's `.ki-config.toml` — no `[ki-plan]` table, ever.
