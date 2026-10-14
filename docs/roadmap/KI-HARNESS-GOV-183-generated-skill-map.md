---
id: KI-HARNESS-GOV-183
area: GOV
title: Generated skill map
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: e83d7b13fdf6b1aec5aae1f7baeb201b384aff44
created_at: 2026-10-14T07:11:13Z
updated_at: 2026-10-14T13:43:23Z
---

# A Generated Skill Map Beside the Skill Graph

## Goal

The harness publishes a second generated Archify diagram, a skill map, that shows every skill grouped by its source concern under `skills/` and drawn in its shape, and the existing skill graph shares that shape vocabulary, so a reader can see both what the collection holds and what relies on what.

## Context

The skill graph delivered under [KI-HARNESS-GOV-176](KI-HARNESS-GOV-176-explicit-skill-dependency-graph.md) drew only declared dependencies. Kris asked on 2026-10-14 for it to be improved, in Kris's words: "the skills graph is nowhere near as good as it was previously. This one's only looking at the dependencies, it's not looking at the directories that the skills are in so effectively the groupings, and it's not also looking at the shape of the skill, whether it's a governance one or whether it's just a simple sort of equivalent of a slash command." The earlier Graphviz skills map, removed in `9e09b943`, grouped skills by area; Kris asked for it to be used as inspiration "but with the twist of using Archify". Asked how to shape it, Kris chose "Two diagrams (Recommended)" (a concern map plus the improved dependency graph), "Leave them out (Recommended)" for hand-drawn context edges and boxes, and "Just do it here" for in-thread delivery with the record written afterwards. Kris asked for this record with "GOV-RECORD - Capture a record".

## Boundary

- In scope: the generated `docs/diagrams/skill-map.architecture.json` and its SVG; the skill graph's shared shape types, concern sublabels and removal of its foot region; `ki-repo-harness` CAP-4, its CONFORM repair and `scripts/skill-graph.ts` covering both diagrams; the diagrams index, manifest, rubric, standard and `SKILL.md` text.
- Out of scope: hand-placed context edges or boxes; committing either diagram's interactive HTML, which [KI-HARNESS-GOV-179](KI-HARNESS-GOV-179-diagram-html-commit-opt-in.md) holds; a more compact graph layout.

## Requirements

1. The skill map draws one region per source concern under `skills/`, every skill in exactly one region, and no edges.
2. Both diagrams draw each skill as one of four Archify node types by `ki-applicability`, and name the shape in the sublabel so meaning does not rest on colour alone.
3. The skill graph draws only skills with at least one declared relationship; skills with none appear only on the map.
4. CAP-4 compares each committed source with its deterministic rendering, ignoring only the traced revision, and CONFORM rewrites a missing or stale one; `scripts/skill-graph.ts --check` gives the same answer for both.
5. Both drawings pass Archify's showcase gates.

## Current state

Delivered in one commit. Before the baseline, `docs/diagrams/` held one generated skill graph with a foot region for unrelated skills and no concern grouping. After it, `docs/diagrams/` holds the skill map and the skill graph, each generated and checked by CAP-4.

## Steps

- [x] Add the skill map generator, shared shape vocabulary, the two-diagram CAP-4 and CLI, regenerate both sources and SVGs, and update the index, manifest, rubric, standard and `SKILL.md` (commit `df08e1e5c29f18ea5f3194be519b2189d85a6e39`).

## Files touched

- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/` (`skill-map.ts`, `skill-diagrams.ts`, `skill-graph.ts`, `harness.ts` and their tests), `scripts/rubric/items/capabilities.ts` and `scripts/skill-graph.ts`.
- `skills/repo-structure/ki-repo-harness/SKILL.md`, `references/rubric.md` and `references/standards-compatible-harness.md`.
- `docs/docs.md`, `docs/diagrams/README.md`, `docs/diagrams/diagrams.toml`, and the source and SVG of `skill-map` and `skill-graph` under `docs/diagrams/`.

## Verify

- `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` reports both sources in sync.
- `bun run test` and `bunx tsc --noEmit` pass.
- `ki repo audit --skill ki-repo-harness`, `--skill ki-skills` and `--skill ki-diagrams` report no FAIL; `ki dev skill rubric ki-repo-harness` reports the rubric publication current.

## Dependencies / blocks

- Builds on [KI-HARNESS-GOV-176](KI-HARNESS-GOV-176-explicit-skill-dependency-graph.md); `ki-diagrams` owns the manifest, index and refresh rules, and `ki-skills` owns the frontmatter both diagrams read.

## Documentation impact

### Decision Records

None needed: the diagrams read existing `ki-kind`, `ki-applicability` and dependency fields and add no new decision.

### Specifications

The `ki-repo-harness` standard and rubric describe both diagrams under CAP-4.

### Guides

`docs/diagrams/README.md` explains the map and the graph.

### Roadmap

Kris has since asked for a graph that fits on a single page and for an explorable HTML view. The HTML view is [KI-HARNESS-GOV-179](KI-HARNESS-GOV-179-diagram-html-commit-opt-in.md); a single-page layout is not yet captured.

## Review

### Delivered

The boundary was delivered in commit `df08e1e5c29f18ea5f3194be519b2189d85a6e39` against baseline `e83d7b13fdf6b1aec5aae1f7baeb201b384aff44`. Nothing was drawn by hand and no HTML was committed.

### Change Summary

Material decisions: two diagrams rather than one, because concern regions and cross-concern dependency edges cannot pass Archify's no-crossing gate together; the shape is carried by node type and sublabel; the `runtime-bound` tag was dropped because a 48px node cannot hold a third text row without overlap, and the capability catalogue already publishes runtime binding.

### Verification

Run on 2026-10-14 against the delivery commit:

- `scripts/skill-graph.ts --check`: both in sync, exit 0.
- `bun run test`: 1112 pass, 0 fail. `bunx tsc --noEmit`: clean.
- `ki repo audit --skill ki-repo-harness`: FAIL=0. `--skill ki-skills`: FAIL=0, WARN=2 (pre-existing LONG-3 refresh warnings on `references/sources.md`). `--skill ki-diagrams`: PASS.
- Archify finalize at showcase quality: validate, deliver, check and browser-check pass for both diagrams.

### Outstanding concerns

The skill graph is about 3400px tall, which Kris finds too long to read; see Roadmap above.

### Post-change review

The change is deterministic, tested and regenerated through CONFORM; it changes no runtime behaviour outside the harness's own audit.

### Mini recap

Added a generated Archify skill map grouped by concern and shape and aligned the skill graph to it, verified by the sync check, tests and three audits; open follow-ons are the single-page layout and the HTML view.

## Done

Accepted as done on 14 October 2026 under `ki-accept`, approved by Kris Brown in the state-of-play thread's roadmap census ('RC-ALL: approve all; ways-of-working applies the harness part'). The review packet above stands as delivered: on re-check the same day, `scripts/skill-graph.ts --check` reported both sources in sync and `ki repo audit --skill ki-diagrams` passed. The page-length concern is a follow-on, not a defect, and no single-page record is opened by this closure.

## Discussion

### Why two diagrams

Archify at showcase quality fails any edge crossing. Regions per concern with dependency edges between them would cross wherever a dependency spans concerns, which most do, so grouping and relationships are drawn separately.
