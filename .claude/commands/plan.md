---
description: Plan lifecycle — new <title> | execute <id> | done <id> | status [--stream <name>]
---

# Plan lifecycle

Manage implementation plans. Full arguments: `$ARGUMENTS`

Split `$ARGUMENTS` on the first space to get **sub-command** and **rest**.

---

## Path discovery

Run these steps before every sub-command:

1. `git rev-parse --show-toplevel` → git root
2. If `--stream <name>` appears anywhere in `$ARGUMENTS`, extract `<name>` and set plans path to `<git-root>/Streams/<name>/plans/` (KB mode)
3. Otherwise check `<git-root>/.ki-config.toml` for a `[plans]` table with `path = "..."` — use that value (relative to git root) if present
4. Default: `<git-root>/docs/plans/`
5. Create the plans directory if it doesn't exist
6. If `README.md` doesn't exist in the plans directory, create it with the seed structure shown in the **README seed** section below

Strip any `--stream <name>` tokens from the remainder before processing sub-command arguments.

---

## Sub-commands

### `new <title>`

Enter plan mode immediately. While in plan mode:

1. Read `README.md` from the plans directory. Find the highest numeric `id` in use across all plan rows. Next id = highest + 1, zero-padded to three digits (e.g. `004`). If the README has no rows yet, start at `001`.
2. Derive `<slug>` from `<title>`: lowercase, spaces and punctuation to hyphens, max 50 chars.
3. Filename: `<id>-<slug>.md` inside the plans directory.
4. Ask the user: **phase** (Next / Soon / Future), **blocks** (comma-separated ids or —), **blocked-by** (comma-separated ids or —). If they've already said, infer from context and confirm.
5. Write the plan file using the **Plan file template** below. Under `## Steps`, write ordered, concrete action steps based on the title and context. Under the other sections, write what you know; leave gaps marked `<!-- TODO -->`.
6. Add a row to the correct phase table in `README.md` and rebuild the dependency graph.
7. Tell the user the plan is written and exit plan mode. Do NOT begin implementation — that is `/plan execute`.

### `execute <id>`

1. Locate `<id>-*.md` in the plans directory (match on numeric prefix).
2. Read the plan file.
3. Update `status: in-progress` in the YAML frontmatter.
4. Work through `## Steps` sequentially. After each step completes, prefix that line with `✓` (or mark a checkbox `- [x]` if the steps use task syntax).
5. Commit progress regularly — plan file updates travel with the code changes they describe.
6. When all steps are done, set `status: done` in the frontmatter.

### `done <id>`

1. Locate `<id>-*.md`.
2. Set `status: done` in its frontmatter (idempotent).
3. Remove its row from `README.md` (all phase tables).
4. Rebuild the dependency graph in `README.md` — remove any edge that referenced `<id>` as a source or target.
5. Delete the plan file.
6. Report: "Plan <id> closed."

### `status`

Read `README.md` from the plans directory and print the full table as-is, including the dependency graph. If the file doesn't exist or has no plan rows, report "No plans yet."

---

## Plan file template

```markdown
---
id: '<NNN>'
title: <title>
phase: Next | Soon | Future
status: open
blocks: <comma-separated ids, or —>
blocked-by: <comma-separated ids, or —>
---

## Context

<!-- Why this work exists and what goal it serves -->

## Current state

<!-- What is true today — the baseline the steps depart from -->

## Steps

1. Step one
2. Step two
3. Step three

## Files touched

<!-- List key files that will change; update as work progresses -->

## Verify

<!-- How to confirm the work is complete and correct -->

## Dependencies / blocks

<!-- Narrative on what this plan needs and what it unblocks -->
```

---

## README seed

Use this structure when creating a plans `README.md` from scratch:

```markdown
# Implementation Plans

One file per roadmap item. Each plan is self-contained: context, current state, ordered steps, files touched, and a verify section. Read the plan before starting the item; update the status field when work begins or completes.

Plans are ordered by recommended execution sequence. Items with dependencies are listed after the items they depend on.

---

## Execution order

### Next (highest-impact, nearest-term)

| Plan | Title | Status | Blocks |
| ---- | ----- | ------ | ------ |

### Soon (opportunistic — can overlap with Next)

| Plan | Title | Status | Blocks |
| ---- | ----- | ------ | ------ |

### Future (larger / blocked / calendar)

| Plan | Title | Status | Blocks |
| ---- | ----- | ------ | ------ |

---

## Dependency graph

\`\`\`text (none yet) \`\`\`
```

---

## README row format

Each row in the phase tables:

```markdown
| [<NNN>](<NNN>-<slug>.md) | <title> | <status> | <blocks or —> |
```

Status values follow this vocabulary:

- `open` — not started
- `open (needs <id>+<id>)` — has hard blockers
- `open (soft dep on <id>)` — has a soft dependency
- `in-progress` — being executed now
- `done` — complete
- `blocked by <id>+<id>` — waiting on another plan
- `awaiting <person/event>` — external dependency
- `calendar item (by <date>)` — time-gated

---

## Mandate

For any multi-file or multi-step change, run `/plan new` before touching code. The plan file is committed to git as part of the work — it gives a recoverable, dependency-ordered record that survives context resets.
