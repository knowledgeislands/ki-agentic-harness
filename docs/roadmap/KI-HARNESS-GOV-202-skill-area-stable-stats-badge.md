---
id: KI-HARNESS-GOV-202
area: GOV
title: Skill-area stable stats badge
component: repo-structure
kind: deliver
purpose: capability
priority: medium
size: s
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-16T21:51:55Z
updated_at: 2026-10-22T01:52:24Z
---

# KI-HARNESS-GOV-202: Skill-Area Stable Stats Badge

## Goal

The ten skill-area diagrams in `docs/diagrams/skill-area-*.html` show stable stats about each skill in place of the viewer's SRC badge, such as its rubric rule count, a code-size bucket and its reference count, with exact figures in the HTML detail where the viewer supports it, so that the badge tells a reader something about the skill.

## Context

Kris Brown asked for this in the skill-reviews thread on 14 October 2026, recorded as SRC-BADGE in that thread's [decisions log](https://github.com/knowledgeislands/ki-agentic-harness/blob/8c5b5575b03269df2d0e8a5014c000b427210123/+/_WORK_REVIEW/ki.regular.skill-reviews/decisions.md) (`b868812e`): "there might be a better thing to use as that box rather than SRC1 ... the amount of code that's in them, or the rubric rule sizes ... or some stats about the thing", resolved there as "stable stats (rubric rule count, code size bucket, reference count), exact figures in HTML detail if supported". On 16 October 2026 at 01:10 BST Kris approved capturing it as one unadopted record, priority left to the record. The SRC badge is still in all ten files on `main`, and no record carried it.

## Boundary

- In: the badge content for skill-area diagrams; the generator or diagram source that sets it; the ten regenerated files.
- Out: the vendored viewer itself beyond what its configuration allows; other diagram kinds.

## Current state

Adopted to Next under Kris's 22 October 2026 02:25 BST GOV202-ADOPT a) answer and the overnight brief. This is adoption only; it remains draft, with no diagram, generator or viewer change.

The current area generator emits source references for each skill. The local Archify component schema exposes `tag` and source-reference labels, but these alone do not prove a supported replacement for the viewer's source-evidence affordance. The literal `SRC` captured by this record is absent from the current committed area HTML. A plan must first verify the current rendered affordance and a supported per-skill stats presentation, preserving source references. No viewer implementation change is authorised by this draft.

## Steps

- [ ] Inspect the current rendered source-evidence affordance and verify which existing configuration can carry per-skill stable stats without losing source links.
- [ ] Shape the exact stats, data sources, generation and regeneration boundary under `ki-plan`; if a viewer change is required, return the boundary decision to the owner.
- [ ] Once Ready, deliver and verify the generator and diagram changes, then prepare the independent-review packet.

## Files touched

Adoption touches only this record. The eventual delivery candidates remain the skill-area generator, its supported data model and the ten area diagrams; exact source, receipt and export paths must be enumerated when the supported rendering route is proven.

## Verify

For adoption, run full harness tests, TypeScript, focused work, roadmap and authoring audits, the full isolated harness audit and mandatory commit hooks. A future Ready plan must additionally prove stable stats, preserved source links, deterministic regeneration, valid staged receipts and the rendered result under the diagram standard.

## Dependencies / blocks

No adopted dependency is declared. Supported per-skill badge presentation is unproven and remains a planning question, not an assumed viewer capability.

## Documentation impact

### Decision Records

No new decision record for adoption. A viewer-boundary change, if required, returns to the owner before planning it.

### Specifications

No Specification is changed by adoption.

### Guides

The future plan identifies any generator or diagram guidance that changes with the chosen presentation.

### Roadmap

This existing record is adopted to Next and remains draft; no new record is created.

## Discussion

Capture only; adoption, priority and plan belong to this repository. Questions for planning: whether the badge comes from the generator in `skills/repo-structure/ki-repo-harness/scripts/` or from the viewer's verified-source passport, and so whether a viewer change is needed; and which stats stay stable enough not to churn the diagrams on every edit.

### Adoption - 22 October 2026

Kris approved GOV202-ADOPT a): adopt this record to Next. The overnight brief authorises delivery if it fits, but the captured badge and current viewer need reconciling before a conservative implementation can be made. Keep the record draft rather than removing source evidence or changing the upstream viewer to force the old presentation. Recommended next step, confidence high because source bindings are directly verified: inspect the current rendered badge and select an existing supported stats presentation before shaping Ready; alternatively, ask the owner to approve a viewer-boundary change. No new roadmap record is required.

The initial adoption audit required the complete adopted-record body; the draft sections above supply it without claiming readiness. Adoption verification: full harness tests, TypeScript, focused `ki-work`, `ki-work-roadmap` and `ki-authoring` audits, the full isolated harness audit and mandatory commit hooks pass before publication. No delivery or acceptance is claimed.
