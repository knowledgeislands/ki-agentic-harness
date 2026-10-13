---
id: KI-HARNESS-GOV-176
area: GOV
title: Explicit skill dependency graph
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 2ffb152f19695844603ff6b081b40e122011f79c
created_at: 2026-10-13T16:30:00Z
updated_at: 2026-10-13T21:16:16Z
---

# Explicit Skill Dependencies and a Generated Skill Graph

## Goal

Every skill's reliance on another skill is declared in its `SKILL.md` frontmatter and validated mechanically, and one living Archify diagram under `docs/diagrams/` shows those relationships, generated from the declarations so that it cannot drift from them.

## Context

Kris asked for this on 2026-10-13, in his words: "where a skill relies on another, its imperative that that mapping is clear in the frontmatter and that we have the skill graph capable of illustrating this. And I'd like that skill graph to be done using archify not graphviz or whatever it was before ... and the skill graph lives in the docs in the harness." On the tool: "archify is a skill for drawing diagrams and its excellent". The work was delivered the same day, ahead of this record, and Kris then adopted and accepted it in one instruction: "Adopt KI-HARNESS-GOV-176 and take it through ki-accept." Before it, `ki-depends-on` and `ki-optional-depends-on` existed and the capability catalogue listed them, but nothing checked that a referenced skill existed, that the declared graph was acyclic, or that a body that leans on another skill by name had declared it. The only diagram under `docs/diagrams/` was a hand-maintained Graphviz drawing of the roadmap cycles that predated the `ki-diagrams` standard and sat outside any manifest.

## Boundary

- In scope: `ki-skills` rubric criteria that a declared dependency names an existing sibling skill and that the declared graph has no cycle, with a judgment-level cue when a body names a skill it has not declared; a `ki-repo-harness` criterion and conform repair that derive `docs/diagrams/skill-graph.architecture.json` from frontmatter; the committed SVG, manifest and index under `docs/diagrams/` following `ki-diagrams`; the harness's own adoption of `ki-diagrams`.
- Out of scope: drawing by hand or editing coordinates; shared-module (`ki-shared-dependencies`) and `ki-detects` relationships, which the graph deliberately omits; any change to the catalogue markers in `skills/README.md`.

## Requirements

1. `ki-skills` fails a skill whose `ki-depends-on` or `ki-optional-depends-on` names a skill absent from the collection, and fails any skill on a dependency cycle.
2. `ki-skills` warns when a body sentence relies on a backticked `ki-*` skill the frontmatter does not declare, so that an author either declares it or rewords it.
3. `ki-repo-harness` CAP-4 compares the committed graph source with the deterministic rendering, ignoring only the traced revision, and CONFORM rewrites it; `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` gives the same answer from the command line.
4. The committed drawing passes Archify's four showcase gates: every dependent sits above its prerequisite, no edge crosses another or passes through a node, and the canvas stays within Archify's desktop readability width.
5. `docs/diagrams/` holds only the manifest, the index, and the skill graph's source and SVG.

## Current state

Delivered. Before the baseline, `ki-depends-on` and `ki-optional-depends-on` were declared but unchecked, no skill graph existed, and `docs/diagrams/` held one hand-maintained Graphviz drawing outside any manifest. After the four delivery commits, `ki-skills` validates the declarations, `ki-repo-harness` derives and checks the graph source, and `docs/diagrams/` holds the manifest, the index and the generated Archify skill graph.

## Steps

- [x] Add `ki-skills` rubric criteria and checks that a declared dependency names an existing sibling skill, that the declared graph is acyclic, and a warning when a body relies on an undeclared `ki-*` skill (commit `e35366c65de73d0d8a797d86cde32b6bc854022d`).
- [x] Add the `ki-repo-harness` CAP-4 criterion, its CONFORM repair and `scripts/skill-graph.ts --check`, deriving `docs/diagrams/skill-graph.architecture.json` from frontmatter with a crossing-free tree layout (commit `a85d00624199316e26a7e6c66acee340e1b8eabc`).
- [x] Adopt `ki-diagrams` in the harness and publish `docs/diagrams/` with the manifest, the index, the graph source and the rendered SVG, removing the Graphviz roadmap-cycles drawing (commit `ccf26424e88ac1fb74ce61ac984c944edac12c0b`).

## Files touched

- `skills/keystone/ki-skills/references/rubric.md`, `references/standards-knowledge-islands.md` and `scripts/rubric/` (`contexts/dependencies.ts`, `contexts/skill.ts`, `contexts/subjects.ts`, `contexts/contexts.ts`, `items/ki-shape.ts` and their tests).
- `skills/repo-structure/ki-repo-harness/SKILL.md`, `references/rubric.md`, `references/standards-compatible-harness.md`, `scripts/skill-graph.ts` and `scripts/rubric/` (`contexts/harness.ts`, `contexts/skill-graph.ts`, `items/capabilities.ts` and their tests).
- `.ki.toml` (declares `ki-diagrams`), `docs/docs.md`, `docs/diagrams/README.md`, `docs/diagrams/diagrams.toml`, `docs/diagrams/skill-graph.architecture.json` and `docs/diagrams/skill-graph.svg`.
- `skills/change-management/ki-recap/SKILL.md` (one declaration the new check required).

## Verify

- `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check` reports the committed graph source in sync with skill frontmatter.
- `bun test skills/keystone/ki-skills/scripts/rubric/contexts/dependencies.test.ts skills/keystone/ki-skills/scripts/rubric/items/ki-shape.test.ts skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-graph.test.ts` passes.
- `ki repo audit --skill ki-skills`, `--skill ki-repo-harness` and `--skill ki-diagrams` on this repository report no FAIL attributable to this record.
- `ls docs/diagrams` lists exactly `README.md`, `diagrams.toml`, `skill-graph.architecture.json` and `skill-graph.svg`.

## Dependencies / blocks

- `ki-diagrams` owns the manifest, index, export and freshness rules; this record adopts them in the harness and adds nothing to them.
- `ki-skills` owns frontmatter semantics; the new criteria live in its rubric and the graph reads the same canonical frontmatter.

## Documentation impact

### Decision Records

None needed: the dependency fields and their semantics already stand under ADR-KI-HARNESS-SKILLS-006, which the new rubric criteria cite; this record adds checks and a drawing, not a new decision.

### Specifications

No behaviour-level contract changes outside the harness's own skill rubrics, which `ki-skills` and `ki-repo-harness` own and updated in their references.

### Guides

`docs/diagrams/README.md` explains the skill graph and how to read it; no separate guide changes.

### Roadmap

No follow-on record. Kris answered the two open questions below on 2026-10-13: "RECYCLE - Keep roadmap-cycles drawing removed." and "SHAPE-21 - Keep KI-SHAPE-21 warning."

## Review

### Delivered

The approved boundary was delivered in full: the `ki-skills` dependency criteria, the `ki-repo-harness` CAP-4 criterion with its CONFORM repair and command-line check, the harness's adoption of `ki-diagrams`, and the committed manifest, index, graph source and SVG under `docs/diagrams/`. The exclusions held: nothing was drawn by hand, shared-module and `ki-detects` relationships are omitted from the graph, and the catalogue markers in `skills/README.md` are unchanged. Baseline `2ffb152f19695844603ff6b081b40e122011f79c` (the identifier reservation); delivery commits `e35366c65de73d0d8a797d86cde32b6bc854022d`, `a85d00624199316e26a7e6c66acee340e1b8eabc` and `ccf26424e88ac1fb74ce61ac984c944edac12c0b`. Acceptance authority is Kris's instruction of 2026-10-13: "Adopt KI-HARNESS-GOV-176 and take it through ki-accept."

### Change Summary

Files are listed under Files touched. Material decisions: events and the graph are derived from frontmatter rather than authored, so the drawing cannot drift; the layout is a crossing-free tree built from the declared forest, trading height for Archify's showcase gates; the undeclared-reliance cue is a WARN, not a FAIL, which Kris confirmed ("SHAPE-21 - Keep KI-SHAPE-21 warning."). Approved deviation from the record as captured: none. The record itself was written after the delivery and adopted and accepted in one pass, so it carries no separate Ready or in-progress revision.

### Verification

Run on 2026-10-13 against `HEAD` `1cfa7d89e3e323db3950dbde65c2466358206be0` plus this record's edits:

- `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`: in sync, exit 0.
- `bun test` on the three named test files: 19 pass, 0 fail.
- `ki repo audit --skill ki-skills`: FAIL=0, WARN=2 (pre-existing LONG-3 refresh-cadence warnings on `references/sources.md`, unrelated to this record).
- `ki repo audit --skill ki-repo-harness`: FAIL=0 attributable to this record; the run also evaluates the roadmap records and reported ITEM-3 on `KI-HARNESS-GOV-175` while it was being adopted, repaired before commit.
- `ki repo audit --skill ki-diagrams`: PASS.
- `ls docs/diagrams`: exactly the four expected files.

### Outstanding concerns

None open. The two open questions in Discussion are answered by Kris's words recorded under Roadmap above. The pre-existing `ki-repo` FILES-10 failure on `.ki.toml` table order and the LONG-3 refresh warnings predate this record and are not carried by it.

### Post-change review

The delivered checks are deterministic, tested and run from the command line and the audit; the drawing regenerates from frontmatter through CONFORM. Nothing in this record changes runtime behaviour outside the harness's own audits. Ready for acceptance.

### Mini recap

Delivered the explicit skill dependency checks and the generated Archify skill graph in three commits against baseline `2ffb152f`; verified by the sync check, the focused tests and the three skill audits; no outstanding concerns. Learning route, not promoted: the tree-layout approach under Archify's gates could inform `ki-diagrams` guidance on large generated graphs.

## Done

Accepted 2026-10-13 by Kris Brown on the review packet above.

## Discussion

### Why a generated tree layout

Archify at showcase quality treats any edge crossing as an error and caps a tall canvas at about 1395px wide, so a generic layered drawing of 42 connected skills could not pass. The declared graph is a forest once directions are ignored, which allows a layout that is crossing-free by construction: each skill owns a column clear of its subtree, prerequisites hang in bands below it and dependents in bands above it, and edges run along a parent's column to a lane beside the child's band. The cost is height, about 3600px for 62 skills, which Archify accepts for an intrinsic-height architecture.

### Open questions

- Whether the roadmap-cycles drawing removed from `docs/diagrams/` should return as an Archify workflow diagram under the manifest. Answered by Kris on 2026-10-13: "RECYCLE - Keep roadmap-cycles drawing removed."
- Whether the undeclared-reliance cue should become a failure once the fleet's existing bodies have been reviewed. Answered by Kris on 2026-10-13: "SHAPE-21 - Keep KI-SHAPE-21 warning."; a later review may reopen it.
