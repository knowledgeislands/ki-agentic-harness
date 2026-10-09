---
id: KI-HARNESS-GOV-170
area: GOV
title: Keep resolution targets local
project: ways-of-working
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T21:50:21Z
updated_at: 2026-10-09T21:50:21Z
---

# KI-HARNESS-GOV-170: Keep Resolution Targets Local

## Goal

A cancelled `duplicate`, `merged` or `superseded` record names a `resolution_target` only in its own repository. Where the replacing work lives in another repository, the record names that repository and describes the work in plain terms in `## Cancelled`, without citing the other repository's record identifier.

## Context

The owner decided on 2026-10-09 that nothing should refer to another repository's roadmap record or identifier, because records are pruned and the links break. The cross-repository choreography sections and the `ki-work-roadmap` and `ki-repo` guidance now say so for handoffs and dependencies.

The [work-item format standard](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md) still allows a `resolution_target` "in this or any other repository", accepted by shape. Changing that alters audit behaviour: the `ki-work-roadmap` rubric would reject a target that does not resolve locally. `tools-ki` parses the same field in its work-item model and would need the matching change; that is `tools-ki`'s own decision, so it receives a plain-language handoff rather than a link.

## Boundary

In scope: the standard text, the rubric check in `scripts/rubric/contexts/roadmap-evidence.ts` and its tests, and a handoff to `tools-ki`. Out of scope: done or cancelled records that already cite a cross-repository target; they leave with pruning.

## Discussion
