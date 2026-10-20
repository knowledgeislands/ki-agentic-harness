---
id: KI-HARNESS-GOV-228
area: GOV
title: Home the work spec
purpose: capability
project: portable-specifications
component: governance
priority: medium
size: m
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-20T00:15:30Z
updated_at: 2026-10-20T00:15:30Z
transferred_from: ki-principal ki.portable-specifications HOMING-REVIEW a), 2026-10-20
---

# KI-HARNESS-GOV-228: Home the Work Spec

## Goal

`ki-work-package` holds `work`, the portable, tool-neutral specification of a work package, and the profile that maps the house work package onto it, so that anyone outside Knowledge Islands can write or read a work package from one approved text while the house standard stays unchanged.

## Context

This is step 6a of the [Portable specifications plan](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/design/plan.md), in Knowledge Islands Principal's `ki.portable-specifications` work. Kris Brown decided SPEC-HOME a) on 19 October 2026: each specification is held as one reference in its owning skill, `ki-work-package` for `work`. WORK-PROFILE a) keeps the house work package a mapped profile of `work`, with an explicit field and state mapping, and moves the house rules out of the specification into the profile. Both are in the work's [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/decisions.md).

The [home plan](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/design/home-plan.md#6a-home-work-ki-work-package) sets the change:

- Add `references/standards-work-spec.md` from the approved `work` text and `references/standards-work-spec-profile.md` from the approved house profile, each through the plan's homing transform: an attribution line, unlinked names for the sibling specifications, and a `## Contents` list.
- Add one `## Shared model` bullet to [`SKILL.md`](../../skills/governance/ki-work-package/SKILL.md) pointing to the specification and the profile, leaving `description` and the [work-package standard](../../skills/governance/ki-work-package/references/standards-work-package.md) unchanged.
- Add two provenance rows and a Last review entry to `references/sources.md`.
- Add the `SPEC` rubric family with the judgment-only criterion SPEC-1, whose description text the home plan fixes so that the three owning skills agree, and regenerate `references/rubric.md`.

HOMING-REVIEW a) was decided on 20 October 2026 under the work's overnight authority, after a blind review lifted it to high confidence: one run captures this record and its two siblings, and capture authorises no delivery.

## Boundary

- In: the two references, the `SKILL.md` bullet, `sources.md`, the `SPEC` family and SPEC-1, and the regenerated rubric, all under `skills/governance/ki-work-package/`.
- Out: any change to the house work-package standard or the skill's `description`, so the generated catalogue and diagrams are untouched; refreshing the skill's older `scripts/shared/rubric.ts` copy, which SPEC-1 does not need; the `work.md` to `WORK.md` rename, which belongs to ki.ways-of-working's ENTRY-NAMES run; publication on the website and the move into KI Specifications, which are later plan steps.
- Out: the sibling homings, [KI-HARNESS-GOV-229](KI-HARNESS-GOV-229-home-acquire-spec.md) for `acquire` and [KI-HARNESS-GOV-230](KI-HARNESS-GOV-230-knowledge-package-skill.md) for `knowledge`.

## Dependencies / blocks

- SPEC-TEXT: Kris's acceptance of draft 0.8 of the three specifications, with the four homing edits asked under HOMING-EDITS, is pending in the work's [queries](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/queries.md). The approved commit is the source text this record homes, so nothing is adopted or planned before it.
- ENTRY-NAMES: Kris decided on 19 October 2026 that the entry files are upper case, so the house work package renames `work.md` to `WORK.md`. ki.ways-of-working owns that rename and has queued it as a harness run that changes `ki-work-package`'s contract and its readers. This record starts after that run lands, so the homed specification and profile describe a `WORK.md` entry the house standard already uses.

## Discussion

### Review route

HOMING-REVIEW a) sets the route. After SPEC-TEXT, the record is adopted, planned to Ready and delivered to Awaiting review with its review packet. One blind Codex review of the candidate, with `bun run test`, `bunx tsc --noEmit` and the focused audits the home plan's Verification section names, replaces the Steward gate for this coordinator route. Kris accepts under `ki-accept`. When the three homings run in parallel, each uses its own worktree and integration is serialised.

### Verification

The home plan's checks: the harness tests and type-check; `ki dev skill rubric ki-work-package`; `ki repo audit --skill ki-skills` for layout, links, reference size and portability; `ki repo audit --skill ki-work-package` for RUBRIC-1 and CONFIG-1; and the judgment reads of KI-LINK-3, REF-2 and SPEC-1 against the other two homed texts once all three land.

### Open question

If the ENTRY-NAMES run lands with wording that differs from the profile's description of the entry file, the planning step reconciles the profile to it and reports the change as one beyond the homing transform.
