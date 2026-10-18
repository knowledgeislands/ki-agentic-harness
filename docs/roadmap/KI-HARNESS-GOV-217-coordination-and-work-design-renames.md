---
id: KI-HARNESS-GOV-217
area: GOV
title: Coordination and work-design renames
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 0b95efbb51e54a813a49d1d477dbc23681ecc70e
created_at: 2026-10-18T09:10:18Z
updated_at: 2026-10-18T09:10:18Z
---

# KI-HARNESS-GOV-217: Coordination and Work-Design Renames

## Goal

The harness speaks the work model in its skill names: `ki-pmo` becomes `ki-coordination` and `ki-pmo-design` becomes `ki-work-design`, outright, with no alias; and `ki-repo-kb-streams` keeps its container and Enactment-gate jobs while dropping the four modes that only point to the lifecycle skills and the status table that repeats `ki-work-roadmap`'s.

## Context

Kris Brown answered the skills-audit batch on 18 October 2026, recorded in the ways-of-working decisions log under "owner answers, skills-audit batch":

- PMO-NAME: "Let's get rid of PMO and go with KI coordination. There's no need to accept it as an alias. We just need to get on with this."
- DESIGN-NAME: "KI work design is good".
- STREAMS-SLIM: "So is slimming down the streams, that makes a lot of sense."
- VISIBLE-PUSH: commit and push each verified step, and capture as few new records as possible.

The work-folder half of the same batch, CHECKPOINT-FATE and WORK-FOLDER-DEDUP, was reopened at 10:15 the same day ("owner message, work-folder skill") and goes to the `work-folder-design` run. This record leaves `ki-checkpoint` and the work-folder, clean-out and close-out rules where they stand.

## Boundary

- In: the `ki-pmo` and `ki-pmo-design` skill folders, names, descriptions, standards file names and rubric family code (`PMO` becomes `COORD`, item numbers kept); every reference to them in skills, hooks, the output style, guides, specs, diagrams, the catalogue, `.ki.toml` and tests; the regenerated rubric, generated surfaces, skill graph and map; the `ki-repo-kb-streams` ITERATE, PROPOSE, READY and ROLLOUT modes and its status table.
- Out: `ki-checkpoint` and the work-folder rules (the `work-folder-design` run); the tools-ki CLI side, which is a tools-ki record; other repositories' declarations; historical text in `+/_WORK_REVIEW/`, accepted Decision Records' decisions and closed records; a release.

## Current state

`ki-pmo` names coordinating work after a project-management office, a word the work model does not use, while its own standard is already titled the coordinating-work standard; `ki-pmo-design` carries the prefix without depending on it. `ki-repo-kb-streams` carries ITERATE, PROPOSE, READY and ROLLOUT modes whose files only point to `ki-plan`, `ki-next` and `ki-implement`, and a status table that repeats `ki-work-roadmap`'s.

## Steps

- [ ] Move `skills/change-management/ki-pmo/` to `ki-coordination/` and `ki-pmo-design/` to `ki-work-design/`, with `standards-pmo.md` as `standards-coordination.md` and `standards-pmo-design.md` as `standards-work-design.md`; descriptions speak in work-model terms.
- [ ] Rename the rubric family `PMO` to `COORD` and regenerate both rubrics.
- [ ] Repoint every reference across skills, hooks, the output style, guides, specs, diagrams, the catalogue, `.ki.toml` and tests; regenerate the generated surfaces through `ki dev skill generate ki-coordination`.
- [ ] Slim `ki-repo-kb-streams`: retire the ITERATE, PROPOSE, READY and ROLLOUT modes and their reference files, and link to `ki-work-roadmap`'s status table instead of repeating it.
- [ ] Run Verify.

## Files touched

- `skills/change-management/ki-coordination/` (was `ki-pmo/`) and `skills/change-management/ki-work-design/` (was `ki-pmo-design/`)
- `skills/repo-structure/ki-repo-kb-streams/SKILL.md`, its standard, rubric items and retired mode files
- every file naming either skill: other skills' references and tests, `hooks/`, `output-styles/ki-coordinator.md`, `docs/`, `skills/README.md` and `.ki.toml`
- this record and `docs/roadmap/_ISSUES.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-coordination`, `ki-work-design` and `ki-repo-kb-streams` report the rubric current; `ki dev skill generate ki-coordination` reports the surfaces in sync.
- `ki repo audit --skill ki-coordination`, `--skill ki-work-design`, `--skill ki-repo-kb-streams`, `--skill ki-skills`, `--skill ki-repo-harness` and `--skill ki-authoring` report no new failure in the contract under change.
- No live `ki-pmo` reference remains outside history.

## Dependencies / blocks

The local `ki` loads this checkout through the installed harness link, so every repository declaring `[skills.ki-pmo]` stops resolving the moment this lands; the declaring Knowledge Islands repositories follow in the same run, and other territories get a handoff. `ki` requires `ki-pmo-design` as a bootstrap skill, so its tools-ki record lands beside this one. Continuous integration elsewhere uses the released `ki` and its pinned harness, so a repository that declares `[skills.ki-coordination]` fails its CI repair step until a release pins this change, which asks Kris first.

## Documentation impact

### Decision Records

None: the names are Kris Brown's PMO-NAME and DESIGN-NAME answers.

### Specifications

`docs/specs/harness.md` names the renamed skills.

### Guides

`docs/guides/user/pmo-design.md` becomes `work-design.md`.

### Roadmap

Open records that name `ki-pmo` or PMO rubric codes are repointed; closed records keep their history.

## Discussion

Captured by the `coordination-rename` run in the ways-of-working work on Kris Brown's answers of 18 October 2026, as the one harness record VISIBLE-PUSH asks for.
