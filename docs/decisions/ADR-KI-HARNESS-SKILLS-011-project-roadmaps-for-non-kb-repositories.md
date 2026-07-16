# ADR-KI-HARNESS-SKILLS-011: Project roadmaps for non-KB repositories

**Date:** 2026-07-16

## Context

Non-KB repositories vary in how much forward-work structure they need. A small repository can keep a useful open-only forward view in one root `ROADMAP.md`, while a larger repository benefits from separating canonical detail by theme and attaching execution plans to the nearest work. Treating plan files as the primary instrument makes the larger layout the default and leaves the roadmap itself outside the named standard. Knowledge Base repositories already have a separate thematic model: `ki-kb-streams` governs Streams, Focus state, proposals, proposal checklists, and the Enactment Process.

## Decision

The general-governance skill for non-KB forward work is **`ki-project-roadmap`**, replacing `ki-plans`. It governs two automatically detected profiles:

- **Simple:** the root `ROADMAP.md` is the complete and only roadmap artifact. It carries the open work and has no plan collection.
- **Thematic:** each theme owns its canonical open work in `docs/roadmap/<theme>/ROADMAP.md`, with executable plans at `docs/roadmap/<theme>/plans/<NNN>-<slug>.md`. The root `ROADMAP.md` is an exact generated portfolio linking to the theme roadmaps rather than a second home for their prose. `docs/roadmap/README.md` is the global active-plan index and dependency graph.

Each thematic roadmap item has a stable qualified locator, `<theme>/<item-slug>`. Numeric plan ids are local to their theme and start at `001`; the canonical plan reference is `<theme>/<NNN>`, which dependencies use across the repository. An item has exactly one authoritative home. Work requiring an executable plan expands into the thematic profile before the plan is created.

`ki-plan` remains the process skill that drives individual plan lifecycles and composes on the `ki-project-roadmap` standard. A Knowledge Base does not use either project-roadmap profile or its artifacts: `ki-kb-streams` wholly owns its thematic forward view and execution checklists.

The replacement is direct. There is no `ki-plans` alias, configuration or script alias, resolver rename, dual-write period, `docs/plans/` fallback, or compatibility bridge.

## Consequences

- Small non-KB repositories pay only for a root roadmap; larger ones can load and govern one theme at a time without duplicating canonical work descriptions.
- The generated root portfolio gives a repository-wide view while theme roadmaps remain the sources of truth, so projection drift becomes mechanically detectable.
- Theme-local plan ids keep each workstream legible from `001`, while qualified plan references preserve unambiguous cross-theme dependencies and qualified item locators remove title-only ambiguity.
- Knowledge Base planning remains one coherent Streams model rather than acquiring parallel project-roadmap artifacts.
- Existing `ki-plans` declarations, scripts, vendored units, and `docs/plans/` layouts must migrate atomically to the new name and thematic paths; mixed old and new layouts are invalid.

## References

- [ADR-KI-HARNESS-SKILLS-003](ADR-KI-HARNESS-SKILLS-003-dependency-order-composition.md) — the skill naming grammar and dependency-order model this name participates in.
- [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md) — the governance/process distinction and cluster taxonomy that place ki-project-roadmap beside ki-plan.
