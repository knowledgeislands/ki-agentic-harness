---
id: KI-HARNESS-GOV-182
area: GOV
title: Wave E skill renames
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: 3beced0a5f64208cdbc01b73c99e23c3569c1716
created_at: 2026-10-14T00:32:51Z
updated_at: 2026-10-14T09:06:00Z
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

Delivered, pushed to `origin/main` on 2026-10-14 and accepted by Kris Brown the same day. See Review and Done.

## Steps

- [x] Move the three skill folders with `git mv`, renaming the two standards files to match their skills.
- [x] Rewrite every tracked reference; retitle the standards and the user guide; add a former-name note to each renamed standard and the guide.
- [x] Regenerate the capability catalogue and the two diagram sources; finalize and re-export both SVGs.
- [x] Run the harness checks and tests.
- [x] Update `tools-ki` and `ki-principal` references in their own commits.
- [x] Integrate into `main` fast-forward and push when the push hold allows.

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

## Review

### Delivered

The approved boundary was delivered in full: both renames, the `ki-pulse` move, every tracked reference, the regenerated catalogue, skill graph and skill map with re-exported SVGs, the `.ki.toml` declaration, the `tools-ki` bootstrap list and tests, and the four `ki-principal` references outside the protected zones. The exclusions held: no `ki-pmo` folder, no change to `ki-signals`, no edit to the design artefacts, to Admin, Pillars, Resources or a checkpoint. Baseline `3beced0a5f64208cdbc01b73c99e23c3569c1716`. Authority is Kris's decision of 2026-10-14: "SKILLS-PARALLEL - yes; start the two Wave E renames and the ki-pulse move now in a worktree, with a deliver record; leave ki-pmo for the pilot."

### Change Summary

Harness commits on `main`: the identifier reservation, this record, the rename commit (67 files, two standards files and the user guide renamed with a former-name note each), the diagram re-export, the `.ki.toml` declaration and the diagram manifest stamp. The declaration was renamed in its own commit after `main` carried the new skill, because the pre-commit gate resolves declared skills through the installed harness link, which points at the primary checkout. `tools-ki` commit f6d65d8 and `ki-principal` commit b203b70 are pushed. Approved deviation from the record as captured: none.

### Verification

Run on 2026-10-14 against the combined result on `main`:

- `bun run test`: 1112 tests pass, 0 fail. `bunx tsc --noEmit`: clean. `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`: both sources in sync.
- `ki repo audit --skill ki-work-roadmap`, `ki repo audit --skill ki-work-recurring`: PASS. `ki repo audit --skill ki-skills`: FAIL=0, two pre-existing refresh-cadence warnings on `ki-skills` sources. `ki repo audit --skill ki-repo-harness`: FAIL=0, warnings cleared by the manifest stamp apart from the same cadence warnings. `ki repo audit --skill ki-diagrams`: FAIL=0 after the manifest stamp.
- `ki dev skill rubric ki-work-recurring` and `ki dev skill rubric ki-repo-kb-activities`: in sync. Archify finalize passed all four gates for both diagrams; both SVGs re-exported through the viewer route.
- `tools-ki`: `bunx tsc --noEmit` clean; `bun run test` 1144 tests pass across 69 files.
- Old-name search: no tracked harness file names the old skills except the three former-name notes and this record; `tools-ki` has none; `ki-principal` has none outside the design history, the protected zones and KI-PRINCIPAL-ECO-013.

### Outstanding concerns

- The installed `ki` 0.10.1 still requires `ki-design-loop` for `ki bootstrap` and `ki dev`; a `tools-ki` release is needed.
- Five repositories still declare `[skills.ki-work-housekeeping]`; each needs the table renamed.
- The `ki-principal` protected-zone references and KI-PRINCIPAL-ECO-013 are listed in the thread report for a later enactment.

### Post-change review

Every check that ran on the pre-rename tree runs on the renamed tree with the same result. Ready for acceptance once the harness push lands.

### Mini recap

Renamed `ki-design-loop` to `ki-pmo-design` and `ki-work-housekeeping` to `ki-work-recurring`, moved `ki-pulse` to the acquire concern, regenerated every derived publication, and followed the names into `tools-ki` and `ki-principal`. Learning route, not promoted: the pre-commit gate's installed-harness resolution means a skill rename cannot be committed with its own `.ki.toml` declaration in a worktree; the declaration follows on `main`.

## Done

Accepted 2026-10-14 by Kris Brown on the review packet above.

### Owner acceptance

Kris's instruction to the ways-of-working background run of 2026-10-14, in these words: "After the push, mark KI-HARNESS-GOV-182 (docs/roadmap/KI-HARNESS-GOV-182-wave-e-skill-renames.md) done if its acceptance is met, commit and push." The push landed on 2026-10-14 as origin/main `e10ff14c`, after a rebase onto `b99a0883` that rewrote the thread's commit hashes; the reviewed delivery is now `ec390acf` through `d8a263d3` against baseline `3beced0a5f64208cdbc01b73c99e23c3569c1716`. Every Verify command was re-run on the pushed tree before this closure: `bun run test` 1112 pass, `bunx tsc --noEmit` clean, skill-graph check in sync, `ki repo audit` for `ki-skills`, `ki-repo-harness`, `ki-work-roadmap`, `ki-work-recurring` and `ki-diagrams` with no failures, and `tools-ki` `bun run test` 1144 pass. This records only this item's Done transition, removes its horizon and advances `updated_at`; the three Outstanding concerns above remain their owners' work and nothing here authorises pruning or any other acceptance.

## Discussion

### Why no redirect folder

The harness has no convention for a stub skill under a retired name: the catalogue and diagrams are generated from the folders that exist, and the skills audit would treat a stub as a skill. The earlier work-family rename left no stubs either. A former-name note in each renamed standard and in the guide gives a reader who searches for the old name a path to the new one.

### Why the standards files were renamed too

A standard called "housekeeping" beside a skill called "recurring" would fail the same glance test the skill failed; "design-loop" beside "pmo-design" would too. The method is still called a design loop in prose, and the recurring-work standard still uses "housekeeping profile" for the Activity field name that `ki-repo-kb-activities` owns.
