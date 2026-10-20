---
id: KI-HARNESS-GOV-229
area: GOV
title: Home the acquire spec
purpose: capability
project: portable-specifications
component: acquire
priority: medium
size: s
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-20T00:15:30Z
updated_at: 2026-10-20T00:15:30Z
transferred_from: ki-principal ki.portable-specifications HOMING-REVIEW a), 2026-10-20
---

# KI-HARNESS-GOV-229: Home the Acquire Spec

## Goal

`ki-acquire` holds `acquire`, the portable, tool-neutral specification of an acquire package, a method for acquiring knowledge from one source or one tool, so that a method meant for use outside Knowledge Islands can be written or reviewed from one approved text while the house acquisition contract stays as it is.

## Context

This is step 6b of the [Portable specifications plan](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/design/plan.md), in Knowledge Islands Principal's `ki.portable-specifications` work. Kris Brown decided SPEC-HOME a) on 19 October 2026: each specification is held as one reference in its owning skill, `ki-acquire` for `acquire`. It is in the work's [decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/decisions.md).

The [home plan](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/design/home-plan.md#6b-home-acquire-ki-acquire) sets the change:

- Add `references/standards-acquire-spec.md` from the approved `acquire` text through the plan's homing transform: an attribution line, unlinked names for the sibling specifications, and a `## Contents` list.
- Add one paragraph to [`SKILL.md`](../../skills/acquire/ki-acquire/SKILL.md) after the one on the common capture contract, pointing to the specification and leaving the [common acquisition standard](../../skills/acquire/ki-acquire/references/standards-acquisition.md) and provider skills as the house contract; `description` does not change.
- Add provenance bullets to `references/sources.md`, with the provider front-matter mapping recorded in its Last review paragraph rather than in the standard.
- Add the `SPEC` rubric family with the judgment-only criterion SPEC-1, as a subject in the acquisition context, using the description text the home plan fixes so that the three owning skills agree, and regenerate `references/rubric.md`.

No profile file is needed: WORK-PROFILE asked for one only for `work`. HOMING-REVIEW a) was decided on 20 October 2026 under the work's overnight authority, after a blind review lifted it to high confidence: one run captures this record and its two siblings, and capture authorises no delivery.

## Boundary

- In: the reference, the `SKILL.md` paragraph, `sources.md`, the `SPEC` family and SPEC-1, and the regenerated rubric, all under `skills/acquire/ki-acquire/`.
- Out: any change to the common acquisition standard, the provider skills or the skill's `description`, so the generated catalogue and diagrams are untouched; publication on the website and the move into KI Specifications, which are later plan steps.
- Out: the sibling homings, [KI-HARNESS-GOV-228](KI-HARNESS-GOV-228-home-work-spec.md) for `work` and [KI-HARNESS-GOV-230](KI-HARNESS-GOV-230-knowledge-package-skill.md) for `knowledge`.

## Dependencies / blocks

- SPEC-TEXT: Kris's acceptance of draft 0.8 of the three specifications, with the four homing edits asked under HOMING-EDITS, is pending in the work's [queries](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.portable-specifications/queries.md). The approved commit is the source text this record homes, so nothing is adopted or planned before it. This record can start as soon as SPEC-TEXT is accepted.

## Discussion

### Review route

HOMING-REVIEW a) sets the route. After SPEC-TEXT, the record is adopted, planned to Ready and delivered to Awaiting review with its review packet. One blind Codex review of the candidate, with `bun run test`, `bunx tsc --noEmit` and the focused audits the home plan's Verification section names, replaces the Steward gate for this coordinator route. Kris accepts under `ki-accept`. When the three homings run in parallel, each uses its own worktree and integration is serialised.

### Verification

The home plan's checks: the harness tests and type-check; `ki dev skill rubric ki-acquire`; `ki repo audit --skill ki-skills` for layout, links, reference size and portability; `ki repo audit --skill ki-acquire` for RUBRIC-1 and CONFIG-1; and the judgment reads of KI-LINK-3, REF-2 and SPEC-1 against the other two homed texts once all three land.
