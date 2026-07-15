# Project roadmap standard

## Scope

This standard applies only to non-KB repositories. A repository whose `.ki-config.toml` declares `repo_type = "kb"` uses `ki-kb-streams`; it must not add a parallel project `ROADMAP.md` or `docs/roadmap/` tree.

## Horizons

Every authored roadmap carries these five `##` horizons exactly once and in this order:

1. `Blocking` — actively broken or preventing `Next`; plans permitted.
2. `Next` — scoped and ready for immediate work; plans permitted.
3. `Soon` — understood but not yet started; no plans.
4. `Waiting for` — blocked by a named external condition; no plans.
5. `Future` — speculative or unscoped; no plans, with `(candidate)` on uncommitted work.

Roadmaps are open-only: completed work is removed. Continuous practices belong in a standard or orientation file, not among finite work items.

## Simple profile

The root `ROADMAP.md` is the sole roadmap artifact. It has one H1 and the five horizons. It can use lower headings to organise its open work, but it carries no `docs/roadmap/` directory or plan files. Requiring an execution plan is the signal to run EXPAND first.

## Thematic profile

The canonical authored files are:

```text
docs/roadmap/
  README.md
  <theme>/
    ROADMAP.md
    plans/                  # present only while the theme has active plans
      <NNN>-<slug>.md
```

Theme names are unique lowercase kebab-case names. A theme roadmap has one H1, all five horizons, and each item is a `###` heading beneath exactly one horizon. Item prose follows its heading until the next item or horizon. A locator is `<theme>/<item-slug>`; the slug is the normalised item heading. Locators must be unique.

Root `ROADMAP.md` is generated in this profile. It links every canonical item under its horizon but repeats none of its prose. `docs/roadmap/README.md` is also generated: it links themes, indexes every active plan, and renders the global dependency graph. Edit canonical theme roadmaps or plan files, then run CONFORM; never hand-edit either projection.

## Expansion boundary

EXPAND changes authorship, so it requires judgment. It moves complete items from the simple root into coherent themes, preserving their horizons and prose, then generates the projections. It must prove conservation: every original open item appears once after expansion, with none duplicated.

CONFORM is narrower. It may rebuild derivable projections and indexes, but it must never choose a theme, move an item, change a horizon, invent a locator, or rewrite prose.

## Plan discipline

Plans are recoverable execution documents for multi-file or multi-step changes. They exist only for `Blocking` and `Next` items and use the [plan format](plan-format.md). Ids are global across themes. Dependencies are bidirectional, existent, and acyclic. No plan moves to `in-progress` while a listed blocker is not `done`.

A ready plan has concrete Steps, a checkable Verify section, an honest Current state, and a minimal Files touched list. A completed plan and its roadmap item are removed together; git history is the archive.
