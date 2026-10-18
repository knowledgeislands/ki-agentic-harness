---
id: KI-HARNESS-GOV-217
area: GOV
title: Coordination and work-design renames
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: 0b95efbb51e54a813a49d1d477dbc23681ecc70e
created_at: 2026-10-18T09:10:18Z
updated_at: 2026-10-18T17:35:03Z
---

# KI-HARNESS-GOV-217: Coordination and Work-Design Renames

## Goal

The harness speaks the work model in its skill names: `ki-pmo` becomes `ki-coordination` and `ki-pmo-design` becomes `ki-work-design`, outright, with no alias; and `ki-repo-kb-streams` keeps its container and Enactment-gate jobs while dropping the four modes that only point to the lifecycle skills and the status table that repeats `ki-work-roadmap`'s. `ki-checkpoint` then becomes `ki-work-folder`, the same way, and becomes the canonical specification of the work folder, with `ki-coordination`, `ki-delegation` and `ki-work-design` each keeping only their own part.

## Context

Kris Brown answered the skills-audit batch on 18 October 2026, recorded in the ways-of-working decisions log under "owner answers, skills-audit batch":

- PMO-NAME: "Let's get rid of PMO and go with KI coordination. There's no need to accept it as an alias. We just need to get on with this."
- DESIGN-NAME: "KI work design is good".
- STREAMS-SLIM: "So is slimming down the streams, that makes a lot of sense."
- VISIBLE-PUSH: commit and push each verified step, and capture as few new records as possible.

The work-folder half of the same batch, CHECKPOINT-FATE and WORK-FOLDER-DEDUP, was reopened at 10:15 the same day ("owner message, work-folder skill") and went to the `work-folder-design` run. Kris answered its queries later that day, under "owner answers, Summary queries; mark", with "Yep, and the workflow checks we can go with", read back as:

- WORK-FOLDER-OWNER a): "the work-folder skill is the canonical specification; ki-coordination timing and judgement; ki-delegation run side only; ki-work-design graduation; others check in on the four-point contract."
- WORK-FOLDER-NAME a): "`ki-work-folder` ("work forward" in speech)."
- WORK-FOLDER-CHECKS a): "audit checks into KI-HARNESS-GOV-200; one new tools-ki record for the close-gate parse, unnumbered `decide`, launch refusal and `ki work message`/`prune`." The audit checks are therefore [KI-HARNESS-GOV-200](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-200-thread-folder-closed-list.md)'s, not this record's.

## Boundary

- In: the `ki-pmo` and `ki-pmo-design` skill folders, names, descriptions, standards file names and rubric family code (`PMO` becomes `COORD`, item numbers kept); every reference to them in skills, hooks, the output style, guides, specs, diagrams, the catalogue, `.ki.toml` and tests; the regenerated rubric, generated surfaces, skill graph and map; the `ki-repo-kb-streams` ITERATE, PROPOSE, READY and ROLLOUT modes and its status table; the `ki-checkpoint` skill folder, name, standard, rubric context and every live reference, renamed to `ki-work-folder`; the division of the work-folder rules between `ki-work-folder`, `ki-coordination`, `ki-delegation` and `ki-work-design` under WORK-FOLDER-OWNER; Knowledge Islands Principal's `.ki.toml` declaration.
- Out: the WORK-FOLDER-CHECKS audit checks (KI-HARNESS-GOV-200); old checkpoints' `type: ki-checkpoint` front matter, which is data read for the tolerance window; the tools-ki CLI side, which is a tools-ki record; other repositories' declarations; historical text in `+/_WORK_REVIEW/`, accepted Decision Records' decisions and closed records; a release.

## Current state

`ki-pmo` names coordinating work after a project-management office, a word the work model does not use, while its own standard is already titled the coordinating-work standard; `ki-pmo-design` carries the prefix without depending on it. `ki-repo-kb-streams` carries ITERATE, PROPOSE, READY and ROLLOUT modes whose files only point to `ki-plan`, `ki-next` and `ki-implement`, and a status table that repeats `ki-work-roadmap`'s.

## Steps

- [x] Move `skills/change-management/ki-pmo/` to `ki-coordination/` and `ki-pmo-design/` to `ki-work-design/`, with `standards-pmo.md` as `standards-coordination.md` and `standards-pmo-design.md` as `standards-work-design.md`; descriptions speak in work-model terms.
- [x] Rename the rubric family `PMO` to `COORD` and regenerate both rubrics.
- [x] Repoint every reference across skills, hooks, the output style, guides, specs, diagrams, the catalogue, `.ki.toml` and tests; regenerate the generated surfaces through `ki dev skill generate ki-coordination`.
- [x] Slim `ki-repo-kb-streams`: retire the ITERATE, PROPOSE, READY and ROLLOUT modes and their reference files, and link to `ki-work-roadmap`'s status table instead of repeating it.
- [x] Move `skills/governance/ki-checkpoint/` to `ki-work-folder/`, with `standards-checkpoints.md` as `standards-work-folder.md`; repoint every live reference, regenerate the rubric, catalogue and skill map, and declare `[skills.ki-work-folder]` in Knowledge Islands Principal.
- [x] Make the work-folder standard the one specification of `+/_WORK/<id>/` and reduce the coordination, delegation and work-design standards to their own parts.
- [x] Run Verify.

## Files touched

- `skills/change-management/ki-coordination/` (was `ki-pmo/`) and `skills/change-management/ki-work-design/` (was `ki-pmo-design/`)
- `skills/repo-structure/ki-repo-kb-streams/SKILL.md`, its standard, rubric items and retired mode files
- every file naming either skill: other skills' references and tests, `hooks/`, `output-styles/ki-coordinator.md`, `docs/`, `skills/README.md` and `.ki.toml`
- `skills/governance/ki-work-folder/` (was `ki-checkpoint/`), `skills/keystone/ki-repo/` coverage, `skills/governance/ki-delegation/` and `skills/change-management/ki-work-design/` standards
- this record and `docs/roadmap/_ISSUES.md`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-coordination`, `ki-work-design` and `ki-repo-kb-streams` report the rubric current; `ki dev skill generate ki-coordination` reports the surfaces in sync.
- `ki repo audit --skill ki-coordination`, `--skill ki-work-design`, `--skill ki-repo-kb-streams`, `--skill ki-skills`, `--skill ki-repo-harness` and `--skill ki-authoring` report no new failure in the contract under change.
- No live `ki-pmo` or `ki-checkpoint` skill reference remains outside history and old checkpoints' `type` value.

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

## Review

### Delivered

`ki-pmo` is `ki-coordination` and `ki-pmo-design` is `ki-work-design`, outright, with no alias: folders, names, descriptions in work-model terms, standards files, the rubric family `COORD` with its item numbers kept, and every live reference across skills, hooks, the output style, guides, diagrams, the catalogue, `.ki.toml` and tests. `ki-repo-kb-streams` keeps its container and Enactment-gate jobs, drops the ITERATE, PROPOSE, READY and ROLLOUT modes with their files, and links to `ki-work-roadmap`'s status and horizon table instead of repeating it.

### Change Summary

- `c4cbb5aa`: the two skill moves, the standards, guide and rubric-context renames, the `PMO` to `COORD` family rename, every reference, the regenerated rubric, catalogue and skill-graph sources, and this record.
- `157896d3`: the skill map and the coordination and records-and-code area diagrams rebuilt at the rename commit; the thread-model diagram's traced source and README prose point at the coordination standard.
- `92c0db6c`: `ki-repo-kb-streams` slimmed, with the catalogue refreshed.
- `9ca8f779`: `ki-checkpoint` renamed to `ki-work-folder`, with its standard, rubric context, coverage key, every live reference, rubric and catalogue.
- `9a06f8e4`: the skill map and coordination area diagram redrawn for `ki-work-folder`.
- `807b93bb`: the work-folder standard made the one specification of the work folder; coordination keeps timing, judgement and the decisions entry form, delegation the run side, and work design graduation.
- Knowledge Islands Principal `2639ac7`: `[skills.ki-work-folder]` declared in place of `[skills.ki-checkpoint]`, and `ki repo repair` run.

### Verification

On 18 October 2026, after each commit: `bun run test` passed 1253 tests and `bunx tsc --noEmit` passed; `ki dev skill rubric ki-coordination` and `ki-repo-kb-streams` report the rubric current, and `ki dev skill generate ki-coordination` reports 7 surfaces in sync. `ki repo audit --skill` reports PASS for `ki-coordination`, `ki-authoring`, `ki-work-roadmap`, `ki-delegation` and `ki-work-folder`, WARN only for `ki-skills` (three LONG-3 cadence warnings that predate this record), `ki-repo-harness` and `ki-diagrams` (DIAG-4 freshness warnings), and `ki-repo-kb-streams` passes with warnings against Knowledge Islands Principal, which declares it. `ki-work-design` ships no rubric catalogue and is not declared here, so it has no focused audit. No live `ki-pmo` remains outside `+/_WORK_REVIEW/`, closed records, this record and the thread-model diagram. For the work-folder rename and division the same day: `bun run test` passed 1253 tests and `bunx tsc --noEmit` passed after each commit; `ki repo audit --skill` reports PASS for `ki-work-folder`, `ki-coordination`, `ki-delegation`, `ki-repo`, `ki-skills` and `ki-authoring`, and `ki-repo-harness` FAIL=0 with its DIAG-4 freshness warnings; Knowledge Islands Principal's commit-gate audit passed.

### Outstanding concerns

- The thread-model diagram stays pinned at `b7d3b53e`, where its cited `ki-pmo` paths and lines exist; renaming its node label and sources means re-tracing it at HEAD under its `regenerate` instruction, a separate diagram refresh.
- Released `ki` v0.11.1 pins a Harness carrying `ki-pmo`, so a repository declaring `[skills.ki-coordination]` fails its CI repair step until a release repins; that release asks Kris first.
- Seven other territories' `.ki.toml` files, and one personal repository's, still declare `[skills.ki-checkpoint]`, which stops resolving now the harness link carries the rename; they are named to their owners, not changed here.
- The tools-ki CLI side of the work-folder rename, and its launcher and close-gate follow-ups, are tools-ki's.
- The user-level skill links and the chezmoi-managed `~/.config/ki/config.toml` still name `ki-pmo`, `ki-pmo-design` and `ki-checkpoint`, and the other territories' `.ki.toml` files still declare `[skills.ki-pmo]`; both are handed to their owners through the ways-of-working work file's Messages.

### Post-change review

None beyond the outstanding concerns.

### Mini recap

Coordination, work design and the work folder now carry work-model names, the work folder has one specification, and the Streams skill no longer repeats the lifecycle skills or the status table.

## Done

Accepted 2026-10-18 by Kris Brown on the review packet above.

## Discussion

Captured by the `coordination-rename` run in the ways-of-working work on Kris Brown's answers of 18 October 2026, as the one harness record VISIBLE-PUSH asks for; the `work-folder-rename` run folded the work-folder rename into it the same day.

### Acceptance

Accepted on 18 October 2026 by the `accept-prune` run of the ways-of-working Project work, under Kris Brown's standing grant recorded in the ways-of-working decisions log, entry "2026-10-18 17:59 BST - owner answers, recap batch" (ACCEPT-AND-PRUNE): "I think anything which is awaiting acceptance can be accepted, and then we can prune anything which is in a state of done". Re-check against `main` at `7d9959dc` before closure: `bun run test` passes, 1255 tests; `bunx tsc --noEmit` passes; `ki dev skill rubric` reports the touched skills' rubrics current and `ki dev skill generate ki-coordination` reports the surfaces in sync; `ki repo audit` passes every skill this record's Verify names, its one failure being the pre-existing `ki-engineering` SCR-11 hook finding outside this record.
