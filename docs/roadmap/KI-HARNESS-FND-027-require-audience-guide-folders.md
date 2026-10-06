---
id: KI-HARNESS-FND-027
area: FND
title: Require audience guide folders
theme: foundation-tooling
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 6c073477fa23315d60e61de771f4986c77f78bea
created_at: 2026-09-25T12:30:00Z
updated_at: 2026-10-06T20:47:38Z
---

# KI-HARNESS-FND-027: Require audience guide folders

## Goal

Every guide under `docs/guides/` lives in a folder named for its audience, and `ki-guides` says so as a rule that AUDIT enforces, so each guide's reader is declared by where it sits rather than inferred from its prose.

## Context

This record began as "Configure Cloudflare guide path". `5g-emerge-phase2` flattened its guide collection and found that WCF-26 alone kept `docs/guides/developer/cloudflare.md` in a folder; the original plan would have let WCF-26 find `cloudflare.md` anywhere under `docs/guides/` and removed the `ki-repo` REVIEW question requiring audience subdirectories. On 2026-10-06 the principal rejected that direction: audience-scoped folders are the intended rule, and the defect is that `ki-guides` stopped saying so.

`KI-HARNESS-GOV-083` opened on 2026-09-21 as "Require audience guide directories" and was settled on 2026-09-22 (`c67db353`) as advisory policy instead, without a Decision Record. Its own plan said a Decision Record was owed if the requirement landed. The advisory settlement left three things that now contradict the principal's intent: `standards-guides.md:44` and `:46` accept flat and mixed collections and forbid a finding for a root-level guide; `SKILL.md:22` says to nest guides only when grouping helps; and ROUTE-2 tells the reviewer not to fail a flat guide. `GOV-083` did align WCF-26 to `docs/guides/developer/cloudflare.md` (`bfbb2992`), and `ki-repo` `mode-review.md:235` still asks for an audience subdirectory; both already express the intended rule and stay.

Principal decisions recorded 2026-10-06:

- Enforcement is a mechanical FAIL: any Markdown file directly under `docs/guides/` other than `README.md` violates.
- Folder names are open, local vocabulary. Whether a folder name truly names an audience stays a ROUTE-2 judgment.
- A guide that serves several audiences goes in its primary audience's folder; there is no root-level or shared-folder exception.
- Existing root-level guides in the estate are moved directly as part of this delivery, not handed over by trade or left for each repository's next audit.

## Boundary

In scope: the `ki-guides` standard, SKILL.md, rubric context, a new mechanical GUIDE item, the ROUTE-2 judgment wording, tests and generated rubric; a Decision Record superseding `GOV-083`'s advisory settlement; this repository's own root-level guide; and moving every root-level guide in the five other `ki-guides`-declaring repositories listed under Current state, with their inbound links.

Out of scope: a fixed KI-wide audience vocabulary; renaming existing audience folders; CONFORM moving guides automatically, which stays forbidden; repositories that do not declare `ki-guides`; WCF-26, `ki-repo-website-cloudflare` and the `ki-repo-tools` exact-role constants, which already sit under `developer/` and need no change; and `ki-repo` `mode-review.md:234`-`:235`, which already states the rule.

`docs/guides/README.md` remains the collection entry point at the root. `docs/guides/references/`, which `standards-guides.md:26` names for supporting material a guide links to, is supporting material, not an audience folder; the standard says so explicitly and the mechanical check needs no exception because it inspects only root-level files.

Cross-repository moves are authorised by direct principal instruction on 2026-10-06. Each receiving repository keeps its own commit, Git policy and verification; this record does not write any receiving repository's roadmap record, and a moved repository with a concurrent writer or dirty guide paths is skipped and reported rather than forced.

## Current state

Verified on `main` at `709f49fe`.

- `skills/governance/ki-guides/scripts/rubric/contexts/guides.ts` collects every Markdown file under `docs/guides/` except the root `README.md` (`guideFiles`, `:47`-`:62`) but records nothing about depth; `GuidesLayoutContext` (`:9`-`:14`) has no root-level field.
- `scripts/rubric/items/guides.ts` holds GUIDE-1 to GUIDE-4; the family list is at its foot.
- `scripts/rubric/items/routing.ts` ROUTE-2 prompt and guidance (`:38`-`:46`) endorse root-level placement and forbid failing a flat guide mechanically.
- `scripts/rubric/contexts/guides.test.ts:47` asserts that flat, grouped and mixed collections are structurally valid.
- `references/standards-guides.md:44` and `:46` permit flat and mixed collections; `SKILL.md:22` says to nest only when grouping helps.
- `ki-repo-website-cloudflare` WCF-26 requires `docs/guides/developer/cloudflare.md`; `ki-repo-tools` requires `docs/guides/developer/definition-of-done.md` and `docs/guides/developer/releasing.md`.
- Root-level guides in repositories declaring `ki-guides`, surveyed 2026-10-06:

| Repository | Root-level guides |
| --- | --- |
| `ki-agentic-harness` | `skills-by-outcome.md`, a compatibility pointer to the website-owned guide |
| `5g-emerge-phase2` (`5GE-P2`) | `deployment.md`, `interactive-diagrams.md`, `maintenance.md`, `reprocess.md`, `source-acquisition.md`, `source-sync.md` |
| `5g-emerge-phase3` (`5GE-P3`) | `source-sync.md` |
| `infoschematics` (`INFOSCHEMATICS`) | `host-editing-authored-yaml.md`, `host-integrating-renderers.md`, `host-programmatic-models.md`, `host-rendering-from-the-command-line.md`, `repository-authoring-example-packages.md`, `repository-releasing-packages.md` |
| `vallearmonia-website` (`VA-WEB`) | `resources.md`, `sanctuary-features.md` |
| `kit-midnight.ninja` (`MIDNIGHT`) | `tower-review.md` |

## Steps

- [x] Write a Decision Record under `docs/decisions/` in the `ADR-KI-HARNESS-SKILLS` series, taking the next free serial at delivery: every guide lives in an open-vocabulary audience folder, enforced mechanically; a multi-audience guide takes its primary audience; `README.md` and `references/` are the only root entries that are not audience folders; the rule supersedes `KI-HARNESS-GOV-083`'s advisory settlement. Record the rejected alternatives: advisory grouping, a fixed vocabulary, a shared-folder exception, and discovery of the Cloudflare guide anywhere in the collection.
- [x] Rewrite `standards-guides.md` `:44` and `:46`: a guide's location names its audience; folder names are local; a guide serving several readers sits with its primary reader and the index may link it from other areas; AUDIT fails a guide directly below `docs/guides/`; CONFORM still never moves an authored guide. Add that `references/` holds supporting material, not guides for an audience. Keep `:45` on specialised exact-role paths.
- [x] Rewrite `SKILL.md:22` to state the audience-folder rule in one sentence, citing the standard.
- [x] Add `rootGuides: readonly string[]` to `GuidesLayoutContext`, populated from the existing `guideFiles` list as the files whose parent is `docs/guides`.
- [x] Add GUIDE-5 "every guide lives in an audience folder" to `items/guides.ts`, mechanical FAIL, one VIOLATION per root-level guide naming the file, diagnostic remediation telling the author to move it into its primary audience's folder and update inbound links; register it in the GUIDE family.
- [x] Rewrite the ROUTE-2 prompt and guidance: assess whether each folder name genuinely names an audience and whether each guide sits with its primary reader; drop the root-level endorsement and the "do not fail a flat guide" instruction; keep "do not invent a fixed taxonomy" and "do not relocate through CONFORM".
- [x] Replace the `guides.test.ts:47` case with fixtures: grouped collection passes; a root-level guide fails and is named; `README.md` alone at the root passes; `references/` content does not trip GUIDE-5; nested folders below an audience folder pass. Update `items/index.test.ts` for the new item code.
- [x] Regenerate `references/rubric.md` with `ki dev skill rubric ki-guides`.
- [x] Resolve this repository's `docs/guides/skills-by-outcome.md`: search the registered estate for inbound links; delete the pointer if none remain and update `docs/guides/README.md`, otherwise move it to the audience folder its linkers serve and fix those links.
- [x] Before installing the harness change, so no receiving audit fails in between, work through each repository in the Current state table in its own primary checkout, skipping and reporting any with a concurrent writer or dirty guide paths. Read each root-level guide, choose its primary audience folder (reusing an existing folder where it fits; `5g-emerge-phase2` and `5g-emerge-phase3` have only `developer/`, and `infoschematics`' `host-` and `repository-` prefixes suggest their audiences), and `git mv` it there.
- [x] Update every inbound link in that repository, including `docs/guides/README.md`, `README.md`, `AGENTS.md`, other guides and any site navigation or build configuration that names a guide path; relative links inside a moved guide gain one `../` where they leave its folder.
- [x] Verify and commit there per that repository's Git policy, one Conventional Commit per repository.
- [x] For `5g-emerge-phase2`, note in the commit body that this reverses the flattening recorded under `5GE-P2-GOV-010` by principal decision.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-SKILLS-<next>-audience-guide-folders.md` (new)
- `docs/guides/skills-by-outcome.md`, `docs/guides/README.md`
- `skills/governance/ki-guides/SKILL.md`
- `skills/governance/ki-guides/references/standards-guides.md`
- `skills/governance/ki-guides/references/rubric.md`
- `skills/governance/ki-guides/scripts/rubric/contexts/guides.ts`
- `skills/governance/ki-guides/scripts/rubric/contexts/guides.test.ts`
- `skills/governance/ki-guides/scripts/rubric/items/guides.ts`
- `skills/governance/ki-guides/scripts/rubric/items/routing.ts`
- `skills/governance/ki-guides/scripts/rubric/items/index.test.ts`
- In each of `5g-emerge-phase2`, `5g-emerge-phase3`, `infoschematics`, `vallearmonia-website` and `kit-midnight.ninja`: the moved guides under `docs/guides/` and every file holding an inbound link to them.

## Verify

1. GUIDE-5 fails a fixture with a guide directly under `docs/guides/`, naming it, and passes fixtures with only `README.md` at the root, with a `references/` folder, and with nested folders below an audience folder.
2. `grep -rn -i "flat, grouped\|fail a flat guide\|remain directly under" skills/governance/ki-guides` returns nothing.
3. `find docs/guides -maxdepth 1 -name '*.md' ! -name README.md` is empty in this repository and in each of the five moved repositories.
4. `ki repo audit --skill ki-guides --repo <repo> --progress never` passes in every moved repository with the new harness checked out, and each repository's own link or site check passes after its move.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-guides
ki repo audit --skill ki-guides --progress never
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

None. The principal authorised the cross-repository moves directly, so no trade is raised. [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is the same class of defect, a constraint held in one skill that another owns, and does not block this.

## Documentation impact

### Decision Records

A new `ADR-KI-HARNESS-SKILLS` record, as in Steps. It supersedes the advisory settlement in the pruned `KI-HARNESS-GOV-083` and cites that record by identifier and commit `c67db353`.

### Specifications

`standards-guides.md`, `SKILL.md`, the ROUTE-2 judgment and the generated `rubric.md` for `ki-guides`.

### Guides

This repository's `skills-by-outcome.md` pointer, and the moved guides in five repositories under the principal's direct instruction.

### Roadmap

None beyond this record. The fourteen companion records `GOV-083` found in other repositories, worded around the advisory policy, stay with their owners; the moves here may make some of them redundant, and their owners close them.

## Review

### Delivered

Baseline `6c073477`. The harness change is the commit that moves this record to `awaiting-review`. The estate moves landed first, one local commit per repository, none pushed:

| Repository | Commit | Moves |
| --- | --- | --- |
| `5g-emerge-phase2` | `0e17a27` | six guides to `developer/`; the body records the reversal of `5GE-P2-GOV-010` |
| `5g-emerge-phase3` | `fd4bc02` | `source-sync.md` to `developer/` |
| `infoschematics` | `95e83e6b` | `host-*` to `host/` and `repository-*` to `developer/`, dropping the prefixes |
| `vallearmonia-website` | `07e13c2` | `sanctuary-features.md` to `editorial/`, `resources.md` to `ops/` |
| `kit-midnight.ninja` | `c5b765d` | `tower-review.md` to `operator/` |

No repository was skipped.

### Change Summary

- [ADR-KI-HARNESS-SKILLS-016](../decisions/ADR-KI-HARNESS-SKILLS-016-every-guide-lives-in-an-audience-folder.md) records the rule, the rejected alternatives and the supersession of `GOV-083`'s advisory settlement; the decisions index lists it.
- `ki-guides` GUIDE-5 fails each Markdown file directly below `docs/guides/` other than `README.md`, from a new `rootGuides` field on the layout context.
- ROUTE-2 now asks whether each folder names a reader rather than a topic and whether each guide sits with its primary reader; the flat-guide endorsement is gone.
- `standards-guides.md`, `SKILL.md` and `mode-audit.md` state the rule; `references/` is named as supporting material; `rubric.md` is regenerated.
- This repository's `docs/guides/skills-by-outcome.md` pointer had no inbound links in the estate and is deleted.
- The `ki-skills` remediation-inventory test counts rise by one criterion.

### Verification

- `bun run test` on the baseline plus this change alone, in a clean worktree: 950 pass, 0 fail. `bunx tsc --noEmit` passes.
- `ki dev skill rubric ki-guides` reports the rubric current.
- `ki repo audit` passes here for `ki-guides`, `ki-repo`, `ki-work-roadmap`, `ki-authoring` and `ki-decision-records`; `ki-skills` passes with one WARN, the LONG-3 source-review age warning present before this work.
- A probe guide at `docs/guides/zz-probe.md` failed GUIDE-5, named; it was removed.
- Verify 2's grep returns nothing. Verify 3's `find` is empty in this repository and all five moved repositories, and `ki repo audit --skill ki-guides` passes in each.

### Outstanding concerns

- `5GE-P2-GOV-013` in `5g-emerge-phase2`, still `draft`, asks for the discovery this record rejected; its owner should close it as superseded.
- `INFOSCHEMATICS-TOOL-041` cites `docs/guides/repository-releasing-packages.md` five times; the guide is now `docs/guides/developer/releasing-packages.md`. Roadmap records were left to their owner.
- `vallearmonia-website` folders such as `code/`, `content/`, `design/` and `media/` read as topics, so ROUTE-2 review there may ask for regrouping.
- The uncommitted STREAM-7 change in this checkout adds one more criterion, so the full suite run here fails the remediation-inventory counts until that change bumps them again.
- The five estate commits are unpushed. Pushing `5g-emerge-phase2` deploys its site, including the edited programme pages.

### Post-change review

The rule now agrees with WCF-26, the `ki-repo-tools` exact-role paths and the `ki-repo` REVIEW question, which all already assumed audience folders. CONFORM still moves nothing; GUIDE-5's remediation is diagnostic.

### Mini recap

Guides must live in an audience folder, AUDIT fails any that do not, and every `ki-guides` repository in the estate already complies.

## Done

Accepted 2026-10-06 by Kris Brown on the review packet above.

## Discussion

Decided 2026-10-06 by the principal: audience folders are mandatory, enforced mechanically, with open local names, primary-audience placement for multi-audience guides, and direct estate moves. This supersedes the 2026-09-25 plan and its delegated "discovery anywhere" decision, which would have removed the `ki-repo` REVIEW question and let a root-level Cloudflare guide pass.
