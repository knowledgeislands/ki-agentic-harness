---
id: KI-HARNESS-GOV-182
area: GOV
title: Wave E skill renames
project: ways-of-working
component: governance
kind: deliver
purpose: governance
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 3beced0a5f64208cdbc01b73c99e23c3569c1716
created_at: 2026-10-14T00:32:51Z
updated_at: 2026-10-14T00:32:51Z
---

# Rename Two Change-Management Skills and Move ki-pulse to Acquire

## Goal

Rename `ki-design-loop` to `ki-pmo-design` and `ki-work-housekeeping` to `ki-work-recurring`, and move `ki-pulse` from the change-management concern to the acquire concern, so that the harness carries the names and placement the change-management design settled, with every reference, generated publication and dependent repository updated.

## Context

The change-management design in the Ways of working Project reviewed every skill name against Kris's rule that a name must convey its purpose at a glance. Two current names failed it: "housekeeping" says cleanup while the skill governs recurring work, and "design loop" names an activity without its subject and reads as interface design beside `ki-design-system` and `ki-design-inspiration`. Kris chose the new names in words: "names change: (c) ki-pmo, ki-work-recurring, ki-design-loop -> ki-blueprint", later revised to "LOOP-NAME - `ki-pmo-design`". The design also found that `ki-pulse` captures links and scans bounded public sources, which is acquisition rather than change management, and moved it to the acquire concern without renaming it; Kris settled its name as "PULSE-NAME - keep ki-pulse; revisit as ki-signals in the naming wave", so this record does not touch `ki-signals` or any other name.

The design placed these renames in a naming wave after the pilot. On 2026-10-14 Kris brought them forward: "SKILLS-PARALLEL - yes; start the two Wave E renames and the ki-pulse move now in a worktree, with a deliver record; leave ki-pmo for the pilot." This record is that deliver record. The design artefacts live in the `ki-principal` repository under the Ways of working Project's design folder.

## Boundary

- In scope: the three skill folders and their standards; every reference in harness skill bodies, references, scripts, tests, decision records, guides, housekeeping templates and `.ki.toml`; the generated capability catalogue, skill graph and skill map with their SVG exports; the `tools-ki` bootstrap capability list and its tests, in that repository; and `ki-principal` references outside its Admin, Pillars, Resources and checkpoint zones.
- Out of scope: creating `ki-pmo`, which belongs to the pilot KI-PRINCIPAL-ECO-013; renaming `ki-pulse` or `ki-signals`; the change-management design artefacts themselves, which record the names as they were; declarations of `[skills.ki-work-housekeeping]` in other repositories' `.ki.toml` files; the website-owned skills-by-outcome guide; a `tools-ki` release.

## Requirements

1. No tracked harness file outside the design history refers to `ki-design-loop`, `ki-work-housekeeping` or `change-management/ki-pulse` except a former-name note that helps a reader with the old name.
2. The catalogue, skill graph source and skill map source are regenerated from frontmatter, not edited, and their SVGs are re-exported through the viewer route.
3. `bun run test`, `bunx tsc --noEmit`, `ki repo audit --skill ki-skills`, `ki repo audit --skill ki-repo-harness` and `ki repo audit --skill ki-work-roadmap` pass on the combined result.
4. The `tools-ki` bootstrap capability list names `ki-pmo-design` and its tests pass.

## Current state

In progress in the `skill-renames` worktree branch; see Review when delivered.

## Steps

- [ ] Move the three skill folders with `git mv`, renaming the two standards files to match their skills.
- [ ] Rewrite every tracked reference; retitle the standards and the user guide; add a former-name note to each renamed standard and the guide.
- [ ] Regenerate the capability catalogue and the two diagram sources; finalize and re-export both SVGs.
- [ ] Run the harness checks and tests.
- [ ] Update `tools-ki` and `ki-principal` references in their own commits.
- [ ] Integrate into `main` fast-forward and push when the push hold allows.

## Files touched

- `skills/change-management/ki-pmo-design/` (was `ki-design-loop`), `skills/change-management/ki-work-recurring/` (was `ki-work-housekeeping`), `skills/acquire/ki-pulse/` (was under `change-management`).
- `docs/guides/user/pmo-design.md` (was `design-loop.md`) and the two guide indexes.
- `.ki.toml`, `skills/README.md`, `docs/diagrams/skill-graph.*`, `docs/diagrams/skill-map.*`, and about fifty files that name the skills; listed by the commit.
- `tools-ki`: `src/core/harness/bootstrap-capabilities.ts` and four test files.
- `ki-principal`: the Ways of working Project note, its design folder note, the skill-refresh Project note and the territory-selection brief.

## Verify

- `bun run test`, `bunx tsc --noEmit`, `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`.
- `ki repo audit --skill ki-skills`, `ki repo audit --skill ki-repo-harness`, `ki repo audit --skill ki-work-roadmap`, `ki repo audit --skill ki-work-recurring`, `ki repo audit --skill ki-diagrams`.
- `bun run test` in `tools-ki`.
- A search for the old names across the harness, `tools-ki` and the editable zones of `ki-principal` finds only the former-name notes and the design history.

## Dependencies / blocks

- The installed `ki` CLI (0.10.1) requires `ki-design-loop` among its minimum bootstrap skills; until a `tools-ki` release carries the new list, `ki bootstrap` and `ki dev` against a harness without `ki-design-loop` will report it missing. The source change is made here; the release is `tools-ki`'s own work.
- Repositories declaring `[skills.ki-work-housekeeping]` in `.ki.toml` (legal-principal, apps-midnight.ninja, apps-rig.midnight.ninja, apps-tower.midnight.ninja and the chezmoi source) must rename the table before their audits resolve the skill again; those edits belong to each repository.
- The pilot KI-PRINCIPAL-ECO-013 creates `ki-pmo`; nothing here depends on it.

## Documentation impact

### Decision Records

None: the naming rationale lives in the change-management decisions file in `ki-principal` and is quoted in Context.

### Specifications

None: no behaviour changes beyond the names.

### Guides

`docs/guides/user/pmo-design.md` replaces `design-loop.md` with a former-name line; the guide indexes follow.

### Roadmap

No follow-on record here. The `.ki.toml` renames in other repositories and the `tools-ki` release are named under Dependencies for their owners.

## Discussion

### Why no redirect folder

The harness has no convention for a stub skill under a retired name: the catalogue and diagrams are generated from the folders that exist, and the skills audit would treat a stub as a skill. The earlier work-family rename left no stubs either. A former-name note in each renamed standard and in the guide gives a reader who searches for the old name a path to the new one.

### Why the standards files were renamed too

A standard called "housekeeping" beside a skill called "recurring" would fail the same glance test the skill failed; "design-loop" beside "pmo-design" would too. The method is still called a design loop in prose, and the recurring-work standard still uses "housekeeping profile" for the Activity field name that `ki-repo-kb-activities` owns.
