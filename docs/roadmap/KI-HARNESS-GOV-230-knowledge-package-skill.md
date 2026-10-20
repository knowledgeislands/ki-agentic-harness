---
id: KI-HARNESS-GOV-230
area: GOV
title: Knowledge package skill
purpose: capability
project: portable-specifications
component: governance
priority: medium
size: l
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-20T00:15:30Z
updated_at: 2026-10-20T00:15:30Z
transferred_from: ki-principal ki.portable-specifications HOMING-REVIEW a), 2026-10-20
---

# KI-HARNESS-GOV-230: Knowledge Package Skill

## Goal

A new governance skill, `ki-knowledge-package`, owns `knowledge`, the portable, tool-neutral specification of a knowledge package: an Agent Skills extension into which the knowledge of one area is condensed and factored, whose focus is the knowledge rather than an action. Anyone can then write, review or explain a knowledge package from one approved text.

## Context

This is step 6c of the [Portable specifications plan](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/design/plan.md), in Knowledge Islands Principal's `ki.portable-specifications` work. Kris Brown's decisions, in the work's [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/decisions.md):

- SPEC-HOME a), 19 October 2026: each specification is held as one reference in its owning skill, with a new skill for `knowledge`.
- KNOWLEDGE-SKILL a), 19 October 2026: a new governance skill, such as `ki-knowledge-package`, owns the `knowledge` spec and later its rubric.
- KNOWLEDGE-AS-SKILL, 20 October 2026: a knowledge package is first and foremost an Agent Skills extension, "a skill extension, really, first and foremost"; `acquire` does not feed `knowledge` as a pipeline stage.
- CATALOGUE-WRITE a), 20 October 2026, under the work's overnight authority after a blind review lifted it to high confidence: this delivery may run exactly one write-mode `ki repo conform --skill ki-repo-harness` in this repository, every other conform staying dry-run. It audits first, runs the dry-run, checks the complete proposed path set and diff, stops on any unbriefed write, and re-audits after generation and after the separate SVG export. Package manifests, lockfiles and hook directories stay outside that authority.

The [home plan](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/design/home-plan.md#6c-home-knowledge-the-new-ki-knowledge-package) sets the change:

- Create `skills/governance/ki-knowledge-package/` with `SKILL.md` (draft text in the plan, `declaration-only`, no dependencies, the `ki-skills:rubric` shared module), `references/standards-knowledge-spec.md` from the approved `knowledge` text through the homing transform, `references/sources.md` with an `external-spec · quarterly` refresh class, a generated `references/rubric.md`, and rubric scripts with the `CONFIG`, `SPEC` and `RUBRIC` families and a configuration test modelled on `ki-acquire`'s. SPEC-1 uses the description text the home plan fixes so that the three owning skills agree.
- Register it: an empty `[skills.ki-knowledge-package]` table in `.ki.toml`; an entry in the records group of [`skill-functions.ts`](../../skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-functions.ts); and a reciprocal off-ramp in [`ki-skills`](../../skills/keystone/ki-skills/SKILL.md)' description, since a knowledge package is a skill and both fire on "write a skill about X".
- Regenerate, through the one write-mode conform, the capability catalogue in `skills/README.md`, the counts in `README.md` and the two architecture sources under `docs/diagrams/`, then re-export their two SVGs through `ki-diagrams`.

## Boundary

- In: the new skill root, its registration in `.ki.toml`, `skill-functions.ts` and `ki-skills`' description, and the generated catalogue, README counts and four diagram files.
- Out: criteria that check a knowledge package itself (its description's area and boundaries, map and Sources), which KNOWLEDGE-SKILL leaves for a later rubric; evals and assets; a `ki-repo-kb` off-ramp, unless the COLL-2 read finds one needed; the website's skills-by-outcome guide, publication and the move into KI Specifications, which are later plan steps.
- Out: any write-mode conform beyond the one CATALOGUE-WRITE allows, and any change to package manifests, lockfiles or hook directories.
- Out: the sibling homings, [KI-HARNESS-GOV-228](KI-HARNESS-GOV-228-home-work-spec.md) for `work` and [KI-HARNESS-GOV-229](KI-HARNESS-GOV-229-home-acquire-spec.md) for `acquire`.

## Dependencies / blocks

- SPEC-TEXT: Kris's acceptance of draft 0.8 of the three specifications, with the four homing edits asked under HOMING-EDITS, is pending in the work's [queries](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/queries.md). The approved commit is the source text this record homes, so nothing is adopted or planned before it. This record can start as soon as SPEC-TEXT is accepted.

## Discussion

### Review route

HOMING-REVIEW a) sets the route. After SPEC-TEXT, the record is adopted, planned to Ready and delivered to Awaiting review with its review packet. One blind Codex review of the candidate, with `bun run test`, `bunx tsc --noEmit` and the focused audits the home plan's Verification section names, replaces the Steward gate for this coordinator route. Kris accepts under `ki-accept`. When the three homings run in parallel, each uses its own worktree and integration is serialised; this record alone regenerates the catalogue and diagrams, since its siblings change no description.

### Verification

The home plan's checks: the harness tests and type-check; `ki dev skill rubric ki-knowledge-package`; `ki repo audit --skill ki-skills` for layout, links, reference size, portability and the shared-module declaration; `ki repo audit --skill ki-knowledge-package` for RUBRIC-1 and CONFIG-1; after the conform write, `ki repo audit --skill ki-repo-harness` and `ki repo audit --skill ki-diagrams`; and the judgment reads of KI-LINK-3, REF-2, COLL-2 and SPEC-1 against the other two homed texts once all three land.

### Validator

Until the later rubric checks packages, a knowledge package is reviewed against the specification by reading it; a passing audit of this skill does not establish that a package conforms. The plan carries that "no validator" risk until then.
