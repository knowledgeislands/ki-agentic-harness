---
id: '005'
title: Replace ki-plans with ki-project-roadmap
status: in-progress
roadmap: project-roadmap/replace-ki-plans-with-ki-project-roadmap
blocks: —
blocked-by: —
---

# Replace ki-plans with ki-project-roadmap

## Context

The current `ki-plans` standard starts from execution-plan files even though the root `ROADMAP.md` is the durable artifact that precedes them and now carries more than 300 lines of cross-theme detail. That framing makes a small repository pay for a plan collection it may not need, leaves a large repository with one increasingly unfocused roadmap, and obscures the deliberate boundary with Knowledge Base work. The target is a non-KB `ki-project-roadmap` standard with two progressively disclosed layouts: a simple root-only roadmap and a thematic portfolio whose canonical detail and active plans live together by theme. Knowledge Bases remain wholly governed by `ki-kb-streams`, where streams already are thematic roadmaps and proposal checklists already are plans.

## Current state

- `ki-plans` is a general-governance skill declared by this repository, vendored under `.ki-meta/skills/ki-plans`, exposed through `ki:plans:*`, and named throughout the skill graph, decisions, guides, agents, and process-skill contracts.
- The root `ROADMAP.md` owns every open item's horizon and prose. Active plans live separately under `docs/plans/<theme>/`, with a flat `docs/plans/README.md` index and title-only `roadmap:` linkage.
- `ki-plan` drives the existing plan lifecycle and its Claude-Code-only promotion transaction against `docs/plans/`. It already rejects KB repositories and routes them to `ki-kb-streams`.
- Plan 004 remains independently in progress; this work must migrate it without claiming its authenticated smoke test passed or otherwise changing its substantive completion state.
- The legacy top-level bootstrap path and its compatibility test have been deliberately removed. This migration likewise targets the new contract directly: no `ki-plans` alias skill, config alias, resolver rename map, dual package scripts, or old-layout fallback.

## Steps

1. Write `ADR-KI-HARNESS-SKILLS-011` and update the Decisions index to fix the boundary and target layout: `ki-project-roadmap` applies only to non-KB repositories; simple profile is root-only; thematic profile uses a generated root portfolio, canonical `docs/roadmap/<theme>/ROADMAP.md` files, `docs/roadmap/<theme>/plans/<NNN>-<slug>.md`, and `docs/roadmap/README.md`; `ki-kb-streams` replaces the standard in KBs; `ki-plan` remains the plan-instance process skill; no compatibility bridge ships.
2. Replace the canonical `ki-plans` governance skill with rubric-compliant `ki-project-roadmap` sources. Define automatic profile detection, five-horizon/open-only discipline, one authoritative item home, qualified `<theme>/<item-slug>` plan linkage, global plan ids/dependencies, the plan quality bar, an explicit KB NA/off-ramp, root-projection ownership, and a judgment-led `EXPAND <theme>` operation that moves a simple roadmap into the thematic layout without duplicating content.
3. Rework the governance scripts and fixtures for both non-KB profiles. AUDIT must validate root horizons in simple mode; in thematic mode it must validate theme roadmap structure, unique qualified item locators, Blocking/Next plan linkage, plan frontmatter/placement, the global index and dependency graph, and exact generated root projection. CONFORM may rebuild projections/indexes and unambiguous mechanics but must not invent themes, move horizons, or rewrite item prose. INIT scaffolds the simple profile. KB fixtures must return the documented off-ramp without creating project-roadmap artifacts.
4. Update `ki-plan` to compose on `ki-project-roadmap`. Keep its verbs and global-id semantics, add theme-aware status, require thematic expansion before creating or promoting a plan, move every path and no-clobber/rollback boundary to `docs/roadmap/<theme>/plans/` plus `docs/roadmap/README.md`, resolve qualified roadmap locators, and make `done` remove the canonical theme item and regenerate the root projection transactionally. Preserve the current Claude session provenance and scratch-state security contract.
5. Migrate this repository into the thematic profile. Split every open root item into one canonical theme roadmap, replace the root's detailed horizons with the generated linked portfolio, create the global roadmap index, move plans 004 and 005 under their theme `plans/` directories, convert their `roadmap:` fields to qualified locators, and preserve plan 004's in-progress state and content. Ensure no item prose or horizon is authored in two places.
6. Sweep the live governance surface directly to the new name and contract: `.ki-config.toml`, package scripts, `ki-harness` composition, bootstrap dependency ordering/coverage, skill graph/help/catalogue, agents, evals, feature definitions, AGENTS/CLAUDE/README/guides, decision records that describe the living model, and all source references. Re-vendor the coverage-scoped `.ki-meta` set after canonical scripts are formatted, then verify source/vendor equality and remove the old vendored unit.
7. Run focused profile, migration, lifecycle, projection, KB-off-ramp, and hostile path/race tests; then run the skill, decision, authoring, engineering, roadmap, bootstrap, aggregate, and full repository gates. Give the path-changing promotion/done transaction and generated-root replacement a dedicated adversarial review before integration. Commit and push bounded rounds, then close this plan and remove its canonical roadmap item only when the new contract audits cleanly from a fresh checkout shape.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-011-*.md` and `docs/decisions/README.md`
- `skills/general-governance/ki-plans/` → `skills/general-governance/ki-project-roadmap/`
- `skills/process/ki-plan/`
- `docs/plans/` → `docs/roadmap/`
- `ROADMAP.md`, `.ki-config.toml`, `package.json`, and `.ki-meta/`
- `skills/keystone/ki-bootstrap/`, `skills/repo-structure/ki-harness/`, agents, evals, features, and user-facing guides that name the live contract

## Verify

- Simple fixtures with only `ROADMAP.md` pass; malformed horizons and KB repositories attempting project-roadmap artifacts produce the specified findings without mutation.
- Thematic fixtures prove one canonical item home, exact root projection, qualified locator resolution, global id/dependency integrity, focused status, safe expansion, and transactional new/promote/done rollback under drift, symlink, race, and no-clobber cases.
- This repository contains `docs/roadmap/<theme>/ROADMAP.md` sources plus `docs/roadmap/README.md`, and its root roadmap is a compact generated portfolio with no duplicated item prose. Plans 004 and 005 retain their ids and honest states under the new paths.
- `bun run ki:project-roadmap:audit`, `bun run ki:decision-records:audit`, `bun run ki:skills:audit`, `bun run ki:authoring:audit`, `bun run ki:engineering:audit`, `bun run ki:bootstrap:audit`, `bun run test`, and `bun run ki:audit` exit with no task-caused failure or warning.
- Canonical and vendored `ki-project-roadmap` units are byte-identical; no live config marker, package script, graph node, linker target, or non-historical standard still requires `ki-plans` or `docs/plans`.

## Dependencies / blocks

No plan dependency. Plan 004 is deliberately not a blocker and is migrated in place without being closed. The significant architecture decision lands before parallel implementation so every workstream builds against one cited target contract.
