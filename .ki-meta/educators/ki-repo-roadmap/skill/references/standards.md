# Repo roadmap standard

## Scope

This standard applies only to non-KB repositories. A repository whose `.ki-config.toml` declares `repo_type = "kb"` uses `ki-kb-streams`; it must not add a parallel project `ROADMAP.md` or `docs/roadmap/` tree.

## Horizons

Every roadmap carries these five `##` horizons exactly once and in this order:

1. `Blocking` — actively broken or preventing `Next`; plans permitted.
2. `Next` — scoped and ready for immediate work; plans permitted.
3. `Soon` — understood but not yet started; no plans.
4. `Waiting for` — blocked by a named external condition; no plans.
5. `Future` — speculative or unscoped; no plans, with `(candidate)` on uncommitted work.

Each horizon heading is followed by one blank line, its exact canonical blurb, and one blank line before any item or the next horizon:

- **Blocking:** Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.
- **Next:** Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.
- **Soon:** Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.
- **Waiting for:** Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.
- **Future:** Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

The blurb is the empty-horizon explanation; do not add a separate `Nothing queued.` placeholder. CONFORM may insert a missing canonical blurb because its wording and position are mechanically derivable. It preserves any existing prose after the insertion rather than guessing whether that prose was an altered blurb or authored context.

Roadmaps are open-only: completed work is removed. Continuous practices belong in a standard or orientation file, not among finite work items.

## Promotion and readiness

Horizon moves are authored, judgment-led decisions. CONFORM never makes them: it may repair only mechanical blurbs and generated projections.

- **Future → Soon** requires enough scope to state the intended outcome and boundary. It remains Future when that minimum is not known.
- **Soon → Next** requires actionable scope, understood dependencies, and readiness to start. It is not a planning shortcut: the item must first be moved to Next, then evaluated there.
- **Waiting for → another horizon** requires evidence that its named external condition has changed and a fresh placement judgment.
- **Blocking / Next** are the only horizons that may carry a plan. A plan is created only after the item is there and the user has confirmed it.

When the immediate queue has no eligible work, a human-led process such as `ki-next` replenishes it in stages: evaluate Blocking and Next first, then evaluate Soon, and only then scope Future candidates to enter Soon. Each confirmed move is re-evaluated at its destination because the readiness contract changes. The process presents proposals and obtains confirmation before every authored move; this governance skill does not depend on that process.

## Simple profile

The root `ROADMAP.md` is the sole roadmap artifact. It has one H1 and the five horizons. It can use lower headings to organise its open work, but it carries no `docs/roadmap/` directory or plan files. Requiring an execution plan is the signal to run EXPAND first.

## Thematic profile

The canonical authored files are:

```text
docs/roadmap/
  README.md
  <theme>/
    ROADMAP.md             # frontmatter: code: <THEME>
    plans/                  # present only while the theme has active plans
      <THEME>-<NNN>-<slug>.md
```

Theme names are unique lowercase kebab-case names. Every theme roadmap begins with one `code: <THEME>` YAML frontmatter field: an unquoted, uppercase semantic identifier that is stable and unique across the repository. A theme roadmap has one H1, all five horizons, and each item is a `###` heading beneath exactly one horizon. Item prose follows its heading until the next item or horizon. A locator is `<theme>/<item-slug>`; the slug is the normalised item heading. Locators must be unique.

A theme directory exists only while its roadmap has at least one item. An empty scaffold-only theme roadmap is drift: CONFORM removes that theme directory, including an empty `plans/` directory. It does not remove a theme holding authored prose or any unexpected content; resolve that case deliberately instead of discarding it. The thematic profile may have zero remaining themes after pruning.

Root `ROADMAP.md` is generated in this profile. It links every canonical item under its horizon but repeats none of its prose. `docs/roadmap/README.md` is also generated: it links themes, indexes every active plan as a short subsection with a metadata list, and renders the global dependency graph. The plan index never uses a Markdown table because its long links and locators are difficult to scan in columns. `docs/roadmap/README.md` is retained even when no themes or plans remain; CONFORM never deletes it or the repository's top-level `README.md`. Edit canonical theme roadmaps or plan files, then run CONFORM; never hand-edit either projection.

## Expansion boundary

EXPAND changes authorship, so it requires judgment. It moves complete items from the simple root into coherent themes, preserving their horizons and prose, then generates the projections. It must prove conservation: every original open item appears once after expansion, with none duplicated.

CONFORM is narrower. It may insert a missing canonical horizon blurb and rebuild derivable projections and indexes, but it must never choose a theme, move an item, change a horizon, invent a locator, remove authored content, or rewrite existing prose.

## Plan discipline

Plans are recoverable execution documents for multi-file or multi-step changes. They exist only for `Blocking` and `Next` items and use the [plan format](plan-format.md). Each theme's code prefixes a separate zero-padded serial sequence beginning at `001`, so a canonical plan identifier is `<THEME>-<NNN>`. Dependencies use those globally unique identifiers and are bidirectional, existent, and acyclic. No plan moves to `in-progress` while a listed blocker is not `done`.

A ready plan has concrete Steps, a checkable Verify section, an honest Current state, and a minimal Files touched list. A completed plan and its roadmap item are removed together; git history is the archive.
