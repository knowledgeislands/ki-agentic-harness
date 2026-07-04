---
description: Plan lifecycle — new <theme> <title> | execute <id> | done <id> | status
---

# /plan

Drive the plan lifecycle for a **code repo**. Full arguments: `$ARGUMENTS`

The plan **format** (frontmatter, sections, filename, README structure) is defined once in the `ki-plans` skill's [references/plan-format.md](../../skills/ki-plans/references/plan-format.md) — read it and apply it; do not restate it here. The **methodology** (mandate, near-horizon principle, quality bar) is the `ki-plans` `SKILL.md`.

Split `$ARGUMENTS` on the first space to get **sub-command** and **rest**.

## Preflight (every sub-command)

1. `git rev-parse --show-toplevel` → git root.
2. If `.ki-config.toml` at the git root has `repo_type = "kb"`: **stop** and tell the user that in a KB, planning is a stream proposal's `## Checklist`, governed by `ki-kb-streams` — this command is code-repo only.
3. Plans directory: `<git-root>/docs/plans/` (or a `[plans] path` override in `.ki-config.toml`). Create it if absent; if `README.md` is missing, seed it from the index structure in [references/plan-format.md](../../skills/ki-plans/references/plan-format.md).

## Sub-commands

### `new <theme> <title>`

Enter plan mode immediately. While in plan mode:

1. Read `README.md`. Next id = highest global id across all theme folders + 1, zero-padded to three digits; `001` if none.
2. `<theme>` is the first token of `rest` — a kebab-case folder matching a ROADMAP section (create `docs/plans/<theme>/` if absent). The remainder is the title; derive the `<slug>` per the format reference.
3. Confirm the **`roadmap:`** item this plan executes (which ROADMAP "Next" entry), and **blocks** / **blocked-by** (ids or —). Infer from context and confirm; do not ask for a `phase` — there is none.
4. Write `docs/plans/<theme>/<NNN>-<slug>.md` using the template in [references/plan-format.md](../../skills/ki-plans/references/plan-format.md). Fill Steps with concrete, checkable actions; fill the rest from context, marking gaps `<!-- TODO -->`.
5. Add a row to the flat index in `README.md` and rebuild the dependency graph.
6. Tell the user the plan is written; exit plan mode. Do **not** begin implementation — that is `/plan execute`.

### `execute <id>`

1. Locate `<NNN>-*.md` under any theme folder (match on the numeric prefix).
2. Read it. Set `status: in-progress`.
3. Work `## Steps` sequentially; after each completes, prefix that line with `✓` (or check its `- [x]` box). Commit progress as you go — the plan file travels with the code it describes.
4. When all steps are done, set `status: done`.

### `done <id>`

1. Locate `<NNN>-*.md`.
2. Set `status: done` (idempotent).
3. Remove its row from `README.md`; rebuild the dependency graph, dropping any edge that referenced `<id>`.
4. **Remove the matching item from `ROADMAP.md`** — ROADMAP is open-only, so a landed plan's roadmap line goes with it. Use the plan's `roadmap:` field to find it; if the match is ambiguous, ask.
5. Delete the plan file (and prune the theme folder if now empty).
6. Report: "Plan <id> closed."

### `status`

Print `README.md` as-is — the flat active index and the dependency graph. If it has no plan rows, report "No active plans."

## Mandate

For any multi-file or multi-step change, run `/plan new` before touching code. The plan file is committed to git as part of the work — a recoverable, dependency-ordered record that survives context resets. Plans exist only for ROADMAP "Next" items (the near-horizon principle in `ki-plans`).
