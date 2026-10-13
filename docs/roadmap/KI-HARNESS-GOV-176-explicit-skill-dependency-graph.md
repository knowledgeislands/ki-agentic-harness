---
id: KI-HARNESS-GOV-176
area: GOV
title: Explicit skill dependency graph
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-13T16:30:00Z
updated_at: 2026-10-13T16:30:00Z
---

# Explicit Skill Dependencies and a Generated Skill Graph

## Goal

Every skill's reliance on another skill is declared in its `SKILL.md` frontmatter and validated mechanically, and one living Archify diagram under `docs/diagrams/` shows those relationships, generated from the declarations so that it cannot drift from them.

## Context

Kris approved this delivery on 2026-10-13 as Decisions 19 and 20 of the `ways-of-working` run. Before it, `ki-depends-on` and `ki-optional-depends-on` existed and the capability catalogue listed them, but nothing checked that a referenced skill existed, that the declared graph was acyclic, or that a body that leans on another skill by name had declared it. The only diagram under `docs/diagrams/` was a hand-maintained Graphviz drawing of the roadmap cycles that predated the `ki-diagrams` standard and sat outside any manifest.

## Boundary

- In scope: `ki-skills` rubric criteria that a declared dependency names an existing sibling skill and that the declared graph has no cycle, with a judgment-level cue when a body names a skill it has not declared; a `ki-repo-harness` criterion and conform repair that derive `docs/diagrams/skill-graph.architecture.json` from frontmatter; the committed SVG, manifest and index under `docs/diagrams/` following `ki-diagrams`; the harness's own adoption of `ki-diagrams`.
- Out of scope: drawing by hand or editing coordinates; shared-module (`ki-shared-dependencies`) and `ki-detects` relationships, which the graph deliberately omits; any change to the catalogue markers in `skills/README.md`.

## Requirements

1. `ki-skills` fails a skill whose `ki-depends-on` or `ki-optional-depends-on` names a skill absent from the collection, and fails any skill on a dependency cycle.
2. `ki-skills` warns when a body sentence relies on a backticked `ki-*` skill the frontmatter does not declare, so that an author either declares it or rewords it.
3. `ki-repo-harness` CAP-4 compares the committed graph source with the deterministic rendering, ignoring only the traced revision, and CONFORM rewrites it; `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` gives the same answer from the command line.
4. The committed drawing passes Archify's four showcase gates: every dependent sits above its prerequisite, no edge crosses another or passes through a node, and the canvas stays within Archify's desktop readability width.
5. `docs/diagrams/` holds only the manifest, the index, and the skill graph's source and SVG.

## Dependencies / blocks

- `ki-diagrams` owns the manifest, index, export and freshness rules; this record adopts them in the harness and adds nothing to them.
- `ki-skills` owns frontmatter semantics; the new criteria live in its rubric and the graph reads the same canonical frontmatter.

## Discussion

### Why a generated tree layout

Archify at showcase quality treats any edge crossing as an error and caps a tall canvas at about 1395px wide, so a generic layered drawing of 42 connected skills could not pass. The declared graph is a forest once directions are ignored, which allows a layout that is crossing-free by construction: each skill owns a column clear of its subtree, prerequisites hang in bands below it and dependents in bands above it, and edges run along a parent's column to a lane beside the child's band. The cost is height, about 3600px for 62 skills, which Archify accepts for an intrinsic-height architecture.

### Open questions

- Whether the roadmap-cycles drawing removed from `docs/diagrams/` should return as an Archify workflow diagram under the manifest.
- Whether the undeclared-reliance cue should become a failure once the fleet's existing bodies have been reviewed.
