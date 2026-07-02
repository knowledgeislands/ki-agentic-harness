# Plan format — the canonical source

This is the single source of truth for the shape of a plan: its frontmatter, sections, filename, placement, and the `docs/plans/README.md` index. The `ki-plans` `SKILL.md` governs the _methodology_ (when to plan, quality, dependencies); the `/plan` slash command drives the _lifecycle_ (new / execute / done / status). Both defer here for the format — neither restates it.

Plans are a **code-repo** instrument. In a Knowledge Islands KB the equivalent is a stream proposal's `## Checklist`, governed by `ki-streams` — see the `SKILL.md` off-ramp. Nothing in this file applies to a KB.

**Contents:**

- [Placement and naming](#placement-and-naming)
- [Frontmatter](#frontmatter)
- [Sections](#sections)
- [The index](#the-index--docsplansreadmemd)

## Placement and naming

A plan lives at:

```text
docs/plans/<theme>/<NNN>-<slug>.md
```

- **`<theme>`** — a kebab-case folder that matches a ROADMAP section or theme (e.g. `seo`, `testing`, `sanctuary`). The theme folder is the namespace; a plan is always filed under the ROADMAP item it executes.
- **`<NNN>`** — a **global**, zero-padded three-digit id, unique across _all_ themes (not per-theme). Global ids keep cross-references bare: `blocked-by: 004`, never `blocked-by: seo/004`.
- **`<slug>`** — lowercase, hyphen-separated, derived from the title, ≤ 50 characters.

`docs/plans/README.md` is the index and carries no `<NNN>` prefix.

## Frontmatter

```yaml
---
id: '004'
title: Short descriptive title
status: open
roadmap: <ROADMAP item or section this plan executes>
blocks: <comma-separated ids, or —>
blocked-by: <comma-separated ids, or —>
---
```

| Field | Rule |
| --- | --- |
| `id` | Quoted, zero-padded, ≥ 3 digits, globally unique across themes. |
| `title` | One line; matches the README row and the `#` heading. |
| `status` | One of `open`, `in-progress`, `done`. |
| `roadmap` | Names the ROADMAP "Next" item this plan executes. Required — a plan with no roadmap item is misfiled (see the near-horizon principle in `SKILL.md`). |
| `blocks` | Ids this plan unblocks, comma-separated, or `—`. |
| `blocked-by` | Ids that must be `done` first, comma-separated, or `—`. Bidirectional with the blocker's `blocks`. |

There is **no `phase` field.** Phasing (Next / Soon / Future) lives in `ROADMAP.md`, owned by `ki-harness`. A plan exists only for a "Next" item, so its phase is implicit.

## Sections

```markdown
## Context

Why this work exists and what goal it serves — the problem, what prompted it, the intended outcome.

## Current state

What is actually true today, gaps included — the baseline the steps depart from. Not aspirational.

## Steps

1. Concrete action (Read X, Write Y, Run Z). Each checkable by inspection.
2. …

## Files touched

The key files the plan expects to change — anchors scope, makes drift visible.

## Verify

A pass/fail test that confirms the work is complete and correct (a command to run, an assertion to check).

## Dependencies / blocks

Narrative on what this plan needs and what it unblocks.
```

During execution, completed steps are marked with a leading `✓` (or a `- [x]` checkbox if the Steps use task syntax).

## The index — `docs/plans/README.md`

A **flat active index** — one row per plan on disk — followed by a dependency graph. Plans exist only for the near horizon, so there are no Next / Soon / Future tables here; phasing is ROADMAP's job.

````markdown
# Implementation Plans

Active plans only — one file per ROADMAP "Next" item. Each plan is self-contained: context, current state, ordered steps, files touched, and a verify section. Phasing (Next / Soon / Future) lives in ROADMAP.md; a plan is written when an item enters "Next" and removed when it lands.

| Plan                       | Theme | Title                       | Status           | Blocks |
| -------------------------- | ----- | --------------------------- | ---------------- | ------ |
| [004](seo/004-json-ld.md)  | seo   | JSON-LD structured data     | open             | 005    |
| [005](seo/005-llms-txt.md) | seo   | llms.txt and /llms-full.txt | open (needs 004) | —      |

## Dependency graph

```text
004 ──► 005
```
````

**Row format:**

```markdown
| [<NNN>](<theme>/<NNN>-<slug>.md) | <theme> | <title> | <status> | <blocks or —> |
```

**Status vocabulary** (the `Status` cell):

- `open` — not started
- `open (needs <id>)` / `open (needs <id>+<id>)` — has hard blockers not yet `done`
- `in-progress` — being executed now
- `done` — complete (transient; a done plan is removed from the index and deleted)
- `blocked by <id>` — waiting on another plan

Every plan file has exactly one row; every row has exactly one file. The dependency graph is rebuilt from `blocks` / `blocked-by` whenever they change.
