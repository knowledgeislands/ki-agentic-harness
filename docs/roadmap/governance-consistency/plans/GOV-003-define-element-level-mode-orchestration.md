---
id: 'GOV-003'
title: Define element-level audit and conform orchestration
status: open
roadmap: governance-consistency/define-element-level-audit-and-conform-orchestration
blocks: GOV-001
blocked-by: —
---

## Context

The aggregate governance runners need deterministic composition without pretending that one ordering of whole skills works for every AUDIT and CONFORM activity. A skill can contain prerequisite, domain, projection, normalization, cross-check, and finalization work in the same mode. The intended outcome is an executable element-level contract that makes those relationships explicit while keeping every governance skill independently runnable.

The same work establishes `depends-on:` as the unambiguous dependency vocabulary. A repository's `.ki-config.toml` is the complete explicit inventory of its governance skills; a skill relationship should require declarations, not create hidden coverage, package implementation modules, or double as an execution-order edge.

## Current state

Bootstrap previously expanded declared skills through a transitive relationship graph, while the `.ki-config.toml` contract says coverage is purely explicit. Aggregate AUDIT and CONFORM discover vendored skill directories and execute whole mode scripts in alphabetical order. The earlier dependency-order ADR describes synthesis priority rather than a working mode scheduler. This means one skill-level order cannot express cases such as `ki-authoring`, whose owned-file scaffolding may belong early while Markdown normalization belongs after other skills have written Markdown.

Each skill already has standalone `audit.ts` and `conform.ts` entry points, and checker support modules are separately vendored. There is no canonical inventory of the logical elements inside those scripts, their effects, their read/write scope, their phase, or their ordering constraints.

## Steps

1. [x] Inventory every governance skill's current AUDIT and CONFORM implementation as logical elements. For each element record its mode, purpose, inputs, outputs, local or external effects, preconditions, and observed ordering constraints. Use the known `ki-authoring`/roadmap/domain-writer collision as a required example, but do not assign one phase to an entire skill. Completed 2026-07-18 in [the mode-element inventory](../../../decisions/references/mode-element-inventory.md).
2. [x] Lock the relationship vocabulary and amend the governing decisions and features: use `depends-on:` as the current-state governance dependency, require every dependency to be explicitly declared in `.ki-config.toml`, reject missing dependency declarations, and stop expanding hidden coverage. Keep `checker-modules` solely for implementation packaging and keep execution edges in the mode-element contract. Ship no alias, fallback, or dual interpretation. Completed 2026-07-18: bootstrap, normal-copy publication, and development linking all reject an undeclared dependency before mutation; source and generated documentation use only the current vocabulary.
3. [x] Derive the smallest useful AUDIT and CONFORM phase vocabularies from the inventory. Define an executable schema for stable element identifiers, mode, phase, explicit `before`/`after` edges, effects, and read/write scope. Allow one skill to contribute multiple elements to multiple phases. Define how a standalone skill selects and orders only its own elements and how the aggregate selects the repository-wide graph from the same declarations. Completed 2026-07-18: `ki-skills` owns the versioned `mode-elements` schema and a deterministic, side-effect-free graph planner; focused fixtures prove phase ordering and rejection of malformed declarations and cycles.
4. Implement schema validation and graph checks in `ki-skills`, including unknown references, phase violations, cycles, duplicate identifiers, undeclared write collisions, and dependencies absent from `.ki-config.toml`. Implement a deterministic serial planner in the aggregate runners; do not add parallel execution until the element graph and collision rules have fleet evidence.
5. Pilot the contract with representative elements: split `ki-authoring` into its prerequisite owned-file work and later Markdown normalization; classify `ki-project-roadmap` projection generation and a domain writer such as `ki-kb-activities`; include `ki-repo` configuration scaffolding where it establishes inputs. Prove that each skill still runs standalone and that aggregate CONFORM reaches a clean aggregate AUDIT in one pass.
6. Migrate every governance skill to the element contract, update its standalone mode entry points to dispatch through the local graph, and re-vendor all declared mode payloads and support modules. Remove the old whole-skill alphabetical scheduler and any retired relationship parser only after every source and generated consumer uses the new contract.
7. Conform every existing Knowledge Islands repository to explicit dependency declarations and the regenerated payload. Do not retain compatibility logic for historical footprints; report repositories with unresolved dependency or element graphs and fix their declarations at source.
8. Refresh the skill graph, user/developer guidance, feature definitions, decisions, fixtures, and evaluation scenarios. Run focused graph/planner tests and then the full harness gates serially, marking plan steps and committing each independently verified migration unit.

## Files touched

- Governance relationship decisions and feature definitions under `docs/decisions/` and `docs/features/`.
- `skills/general-governance/ki-skills/` standards, rubric, schema, checker, and tests.
- `skills/keystone/ki-bootstrap/` resolution, aggregate orchestration, vendoring, and tests.
- `skills/keystone/ki-repo/` explicit `.ki-config.toml` dependency enforcement and tests.
- Every governance skill's mode-element declarations and standalone AUDIT/CONFORM dispatchers.
- Generated `.ki-meta/`, runtime skill copies, graph documentation, and repository-fleet configuration.

## Verify

1. Focused fixtures prove that one skill can place multiple elements in different AUDIT and CONFORM phases, and that standalone and aggregate execution use the same graph.
2. Missing explicit skill dependencies, unknown elements, cycles, invalid cross-phase edges, duplicate identifiers, and conflicting undeclared writes fail before mutation.
3. The representative writer → projection → normalization scenario reaches a clean aggregate AUDIT after one aggregate CONFORM pass.
4. A source and generated-footprint sweep finds no retired relationship contract, hidden coverage expansion, or whole-skill alphabetical scheduler.
5. `bun run ki:skills:graph`, `bun run test`, and `bun run ki:audit` pass serially after bootstrap regeneration.

## Dependencies / blocks

This plan is immediately executable and blocks GOV-001 because both change canonical skill frontmatter, graph generation, bootstrap resolution, and generated documentation. Landing the element/dependency contract first lets the subsequent roadmap-skill rename migrate one stable surface. GOV-001 continues to block GOV-002.
