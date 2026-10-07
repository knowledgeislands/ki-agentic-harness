---
id: KI-HARNESS-GOV-152
area: GOV
title: Capture the design loop
kind: deliver
purpose: capability
initiative: platform-foundations
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: c315f1860eaec870ac0e913fd2ba296b7457fecd
created_at: 2026-10-07T14:50:10Z
updated_at: 2026-10-07T15:27:56Z
---

# KI-HARNESS-GOV-152: Capture the design loop

## Goal

Anyone shaping a Project or Initiative, starting with Kris's run for Techné, can follow the same design loop that produced the roadmap model: a brief, independent reviews, one merged report, the owner's decisions, and a piloted rollout. Every artefact of the loop is kept in the repository that owns the subject, so the design, its evidence and its authority grant survive the session that made them.

## Context

On 7 October 2026 the roadmap model was shaped by a five-stage loop. Its artefacts sit in `~/.local/state/ki/state-of-play/design/`:

1. **Brief.** The orchestrator wrote the problem, the owner's proposal verbatim, what the discussion had established, and its own numbered reflection (`brief.md`).
2. **Independent reviews.** Three reviewers on different models or runtimes - Fable, an Opus fact-checker and Astra - each formed its own view first, then marked Agree, Differ or Add against every point of the reflection (`fable-view.md`, `opus-check.md`, `astra-view.md`). The Opus review also fact-checked the brief and corrected five claims.
3. **Merged report.** One report settled disputes against the standards and evidence rather than by vote. It held a summary, the model, a table of where the reviewers agreed and differed, a migration plan, eight decisions with options and recommendations, and a log of changes after the last review (`roadmap-model.md`).
4. **Decisions.** Kris recorded eight decisions, including the authority grant that carried the rollout to done and authorised pushing (`decisions.md`). Migration proposals and their unclear cases were settled the same way (`migration-proposals.json`, `migration-unclear.md`).
5. **Rollout.** Delegated agents carried out the rollout, piloting in the harness, Arcadia and chezmoi first; the pilot's lessons fed the parallel waves ([KI-HARNESS-GOV-149](KI-HARNESS-GOV-149-adopt-the-roadmap-model.md), [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md), [KI-HARNESS-GOV-151](KI-HARNESS-GOV-151-recognise-the-initiatives-folder.md)).

Kris asked on 7 October 2026 for the loop to be captured so that each Project is shaped the same way, and will run it next for Techné.

Kris also noticed that the artefacts live only in an untracked local folder. Three done harness records and Arcadia's `roadmap-model` Project note cite `decisions.md` as their authority, yet no reader outside this laptop can follow that citation, and nothing in Git preserves the decisions if the folder is lost.

No harness skill owns this process. `ki-delegation` governs durable packets for approved high-risk handoffs and excludes routine delegation. `ki-next` and `ki-plan` start once a record exists. The [Project registry standard](../../skills/change-management/ki-work/references/standards-project-registry.md) defines note schemas, not procedures. [KI-HARNESS-GOV-144](KI-HARNESS-GOV-144-own-portable-background-delegation.md) owns the separate question of a portable contract for detached background agents, which the rollout stage uses but does not define.

## Boundary

- Harness source only: a new process skill, one registry-standard addition, the regenerated catalogue, and outbound trades. No write to Arcadia, `tools-ki` or any other repository.
- Filing the 7 October roadmap-model artefacts durably is Arcadia's work. This record prepares the trade that hands it over; it does not move or delete the local folder.
- Installing the new skill as a core user skill needs a change to `tools-ki`'s bootstrap capability list. This record prepares that trade only.
- No checker, script or automation. The loop is a written procedure with templates; mechanical checks can follow once the loop has run more than once.
- No change to `ki-delegation`, `ki-batch` or [KI-HARNESS-GOV-144](KI-HARNESS-GOV-144-own-portable-background-delegation.md). The rollout stage cites their contracts as they stand.
- No mandated model, vendor or reviewer roster. The procedure requires independence and diversity, not particular models.
- Running the loop for Techné is Kris's, not this record's.

## Placement

The loop's procedure becomes a new process skill, `ki-design-loop`, in `skills/change-management/`. Its artefacts live in the owning repository as a Decision Record with supporting files. The Project and Initiative notes link to them.

| Candidate | Verdict | Reason |
| --- | --- | --- |
| New process skill | **Chosen** for the procedure | The loop is an invocable, repeatable process that runs before a record exists and hands its rollout to `ki-next`, `ki-plan` and `ki-batch`. A process skill is the house form for that, and gives Kris one name to invoke for Techné. |
| `ki-delegation` reference | Rejected | `ki-delegation` is a declaration-only governance skill for high-risk handoff packets and excludes routine delegation. Only the rollout stage delegates, and the routine-delegation owner is still undecided in [KI-HARNESS-GOV-144](KI-HARNESS-GOV-144-own-portable-background-delegation.md). |
| Project-note standard section | Rejected as the procedure's home; **used** for the link | The registry standard defines schemas. The loop must also serve an Initiative - Techné is one - and a cross-cutting model that precedes its Project, as the roadmap model did. The notes gain a link to the design's record instead. |

### Durable artefact home

- **Decisions** become one Decision Record under `ki-decision-records`, in the decisions collection of the repository that owns the subject: the territory Capital for a Project or Initiative, or the owning repository for a repository-local design. A governance or architecture prefix follows that skill's prefix rules. The record states the accepted design and quotes any authority grant.
- **Brief, reviews, merged report and decisions file** are kept verbatim as supporting files in that collection's `references/` directory, which the Decision Record standard already admits. They share one descriptive slug prefix, for example `roadmap-model-brief.md`, and the Decision Record cites them in its body.
- **From the brief onward** each artefact is written and committed in the owning repository as it is produced, not gathered later. Local state keeps only runtime material: agent prompts, pid, status and report files.
- **The Project or Initiative note** links the Decision Record from its `## Update` or `## Review` and its sources, so the registry is the entry point.

### Stage contracts

The standard gives each stage one contract:

- **Brief:** problem; owner's proposal verbatim; established facts with sources; numbered orchestrator reflection.
- **Reviews:** at least two, on different models or runtimes, read-only; each forms its own view before reading the others, fact-checks the brief, then marks Agree, Differ or Add against every numbered point.
- **Merged report:** disputes settled on cited evidence, never by vote; summary, corrections to the brief, the model, an agree-and-differ table, a rollout plan, at most about eight decisions each with options and a recommendation, and a changes-after-review log; anything evidence cannot settle goes to the owner.
- **Decisions:** the owner's own words, numbered against the report, any authority grant with its completion target, push and prune scope.
- **Rollout:** records captured through `ki-next`, a pilot before parallel waves, the pilot's lessons written into the wave briefs, and authority exercised through `ki-batch` or `ki-accept` quoting the grant.

## Current state

- `skills/change-management/` holds `ki-next`, `ki-plan`, `ki-implement`, `ki-accept`, `ki-batch`, `ki-recap`, `ki-pulse` and the `ki-work*` skills; none describes a design loop.
- `skills/governance/ki-decision-records/references/standards-decision-records.md` admits supporting files in a collection's `references/` directory, cited from a record's body.
- `skills/change-management/ki-work/references/standards-project-registry.md` gives Project notes `## Outcome`, `## Update` and `## Ideas`, and Initiative notes `## Direction`, `## Projects`, `## Upkeep`, `## Activities` and `## Review`; neither names where a design lives.
- `tools-ki` `src/core/harness/bootstrap-capabilities.ts` hard-codes the core process skills that `ki bootstrap` installs.
- The roadmap-model artefacts are untracked in `~/.local/state/ki/state-of-play/design/`.

## Steps

- [x] Write `skills/change-management/ki-design-loop/SKILL.md`: `ki-kind: process`, `ki-applicability: invocation-only`, optional dependencies on `ki-decision-records` and `ki-delegation`; a description that separates it from `ki-next`, `ki-plan` and `ki-design-inspiration`; `help`, `start <subject>` and `resume <subject>` invocations; and a relationship map from the loop to `ki-next`, `ki-plan` and `ki-batch`.
- [x] Write `references/standards-design-loop.md` with the stage contracts and artefact placement rule above.
- [x] Add `assets/` templates for the brief, a review, the merged report and the decisions file, each with the headings the standard requires.
- [x] Write `references/sources.md`, citing the 7 October 2026 roadmap-model run as the worked exemplar by date and subject until Arcadia files it.
- [x] Add to `standards-project-registry.md`: a Project's `## Update` or an Initiative's `## Review` links the Decision Record of any design loop run for it, and its sources cite that record.
- [x] Regenerate `skills/README.md` and any rubric the registry change affects.
- [x] Prepare two outbound trades with `ki-trade`: to `tools-ki`, add `ki-design-loop` to the bootstrap core process skills; to `ki-arcadia-principal`, file the roadmap-model artefacts as a Decision Record with supporting files and link it from the `roadmap-model` Project note and the `platform-foundations` Initiative note.
- [x] Make activation explicit (decision 10): the exact invocation, when to use the loop, where its artefacts go and its hand-off, in the skill and in a `docs/guides/design-loop.md` guide linked from the guides index.
- [x] Run the gates and write the review packet.

## Files touched

- `skills/change-management/ki-design-loop/SKILL.md`
- `skills/change-management/ki-design-loop/references/standards-design-loop.md`
- `skills/change-management/ki-design-loop/references/sources.md`
- `skills/change-management/ki-design-loop/assets/brief.md`, `review.md`, `report.md` and `decisions.md`
- `skills/change-management/ki-work/references/standards-project-registry.md`
- `skills/README.md` and the root `README.md` capability counts
- `docs/guides/design-loop.md` and `docs/guides/README.md`
- `-/_TRADES/` outbound trade records for `tools-ki` and `ki-arcadia-principal`

## Verify

- `bun run test` passes and `bunx tsc --noEmit` is clean.
- `ki repo audit --skill ki-skills`, `--skill ki-repo-harness`, `--skill ki-authoring`, `--skill ki-work-roadmap` and `--skill ki-trades` report FAIL=0, with only pre-existing warnings.
- `ki dev skill rubric ki-work` reports the published rubric in sync.
- `bunx rumdl check` passes on every touched Markdown file.
- A reader can follow the standard and templates to produce the five roadmap-model artefacts' shapes without consulting the local folder.

## Dependencies / blocks

None by build order. The rollout stage cites the delegation contract as it stands; when [KI-HARNESS-GOV-144](KI-HARNESS-GOV-144-own-portable-background-delegation.md) settles an owner, that record updates the citation.

## Documentation impact

### Decision Records

None in the harness: the skill standard records the procedure. The roadmap-model design becomes an Arcadia Decision Record through the outbound trade.

### Specifications

None: no repository Specification describes design work.

### Guides

[Run a design loop](../guides/design-loop.md) explains when and how to invoke the loop. The website's skills-by-outcome guide should list `ki-design-loop`; that belongs to `ki-website` and follows publication.

### Roadmap

Two outbound trades, to `tools-ki` and `ki-arcadia-principal`, as planned above. Kris's Techné run is the loop's first use outside the roadmap model.

## Review

### Delivered

Commit `72e9c8a2` (`feat(skills): add the ki-design-loop process skill`) and commit `a9325fdf` (`docs(trades): submit the design-loop trades`) on baseline `c315f186`.

### Change Summary

- `ki-design-loop`: an invocation-only process skill with `start <subject>`, `resume <subject>` and `help`; a standard with the five stage contracts, the artefact-home rule, the rollout hand-off to `ki-next`, `ki-plan`, `ki-batch` and `ki-accept`, and its stops; templates for the brief, a review, the merged report and the decisions file; and source notes citing the 7 October 2026 roadmap-model run.
- Activation made explicit under decision 10: the skill's "When to use it" section and a new [Run a design loop](../guides/design-loop.md) guide, linked from the guides index, give the invocation `/ki-design-loop start <subject>`, the triggers, the artefact home and the hand-off.
- `standards-project-registry.md`: a Project's `## Update` or an Initiative's `## Review` links its design's Decision Record and never copies the artefacts.
- Generated catalogue and root `README.md` capability counts refreshed.
- Trades: `TRD-756e382d` to `tools-ki`, work with completion observation, to add the skill to the bootstrap core process skills; `TRD-4c4d8f6c` to `ki-arcadia-principal`, knowledge with receipt observation, to file the roadmap-model design as a Decision Record.

### Verification

- `bun run test`: 981 pass, 0 fail. `bunx tsc --noEmit` clean.
- `ki repo audit`: `ki-skills` FAIL=0, WARN=1, the pre-existing LONG-3 refresh-cadence warning; `ki-repo-harness` FAIL=0, with the same pre-existing warnings; `ki-authoring`, `ki-trades` and `ki-work` PASS; `ki-work-roadmap` FAIL=0, WARN=2, the pre-existing GOV-149 and GOV-150 `theme` tolerance warnings.
- `ki dev skill rubric ki-work`: in sync. `bunx rumdl check` on every touched Markdown file: no issues.
- The templates reproduce the headings of the roadmap-model brief, reviews, report and decisions without the local folder.

### Outstanding concerns

The territory trade policy grants the harness only knowledge trades to Arcadia, so the Arcadia filing is a knowledge trade rather than the planned work trade; Arcadia decides whether to capture it as work. Until Arcadia files the design, `references/sources.md` names the run by date and subject. Until `tools-ki` acts, `ki bootstrap` does not install the skill.

### Post-change review

The goal is met inside the boundary: procedure, templates, one registry rule, a guide and two trades; no checker, script or edit to `ki-delegation`, `ki-batch` or GOV-144. Regression risk is low.

### Mini recap

The design loop is now a named, invocable skill whose artefacts live in Git with the subject they shape.

## Done

Accepted 2026-10-07 by Kris Brown on the review packet above.

## Discussion

### Naming

`ki-design-loop` keeps Kris's own term, which makes the skill findable. It shares the `ki-design-` stem with `ki-design-inspiration`, a website-design skill in `skills/design/`. The loop sits in `skills/change-management/` because it shapes work before capture, and the description disambiguates the two. A rename stays cheap until the `tools-ki` trade lands.

### Why a Decision Record

The owner's decisions are durable rationale and, here, an authority grant: exactly what `ki-decision-records` owns. Its `references/` directory already admits supporting files, so the evidence needs no new folder shape in `Streams/Projects/`, which holds one note per Project and no work artefacts. A per-Project design folder was considered and rejected for that reason.

### Reviewer independence

The 7 October run used three reviewers on different models and runtimes. The standard requires at least two and asks that each form its view before reading the others. That is what produced disagreements worth settling, such as the hold model and upkeep.

### Authority

Kris's instruction of 7 October 2026 asked for this record to be captured, planned, left `ready` in Now and pushed. That is the adoption and readiness approval. Implementation still needs selection through `ki-implement`.

Closed under the decision 6 carry-through grant ("you can just carry it all the way through"), with the review evidence rechecked, through `ki-accept` quoting that grant; decision 10 asked for explicit activation.
