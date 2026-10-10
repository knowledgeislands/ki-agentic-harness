---
id: KI-HARNESS-GOV-170
area: GOV
title: Keep resolution targets local
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T21:50:21Z
updated_at: 2026-10-10T05:45:05Z
---

# KI-HARNESS-GOV-170: Keep Resolution Targets Local

## Goal

A cancelled `duplicate`, `merged` or `superseded` record names a `resolution_target` only in its own repository. Where the replacing work lives in another repository, the record names that repository and describes the work in plain terms in `## Cancelled`, without citing the other repository's record identifier.

## Context

The owner decided on 2026-10-09 that nothing should refer to another repository's roadmap record or identifier, because records are pruned and the links break. The cross-repository choreography sections and the `ki-work-roadmap` and `ki-repo` guidance now say so for handoffs and dependencies.

The [work-item format standard](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md) still allows a `resolution_target` "in this or any other repository", accepted by shape. Changing that alters audit behaviour: the `ki-work-roadmap` rubric would reject a target that does not resolve locally. `tools-ki` parses the same field in its work-item model and would need the matching change; that is `tools-ki`'s own decision, so it receives a plain-language handoff rather than a link.

## Boundary

In scope: the standard text, the rubric check in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` and its tests, and a handoff to `tools-ki`. Out of scope: done or cancelled records that already cite a cross-repository target; they leave with pruning.

## Current state

Verified on 2026-10-10:

- The [work-item format standard](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md#cancellation-and-resolution) allows a `resolution_target` "in this or any other repository" and accepts a cross-repository target by shape; the [repository roadmaps standard](../../skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md)'s lifecycle table asks for "a qualified `resolution_target`" for a duplicate across repositories.
- The [acceptance standard](../../skills/change-management/ki-accept/references/standards-acceptance.md) step 6 says a target "may belong to another repository" and asks `## Cancelled` to name the target's repository and path.
- `roadmap-evidence.ts` checks the target's shape, and warns only when a same-repository target does not resolve; a target with another repository code passes unchecked.
- The `ki-work-roadmap` eval scenario names `KI-WEB-SEO-005` as the retained record, with no repository context.

## Steps

- [ ] Decide how a cross-repository duplicate, merge or supersession is recorded once its target cannot be named (see Discussion).
- [ ] Change the work-item format, repository roadmaps and acceptance standards so `resolution_target` must resolve in the same repository, and cross-repository replacement is described in plain terms in `## Cancelled`.
- [ ] Make `roadmap-evidence.ts` fail a `resolution_target` whose repository code is not this repository's, with tests in `roadmap-evidence.model.test.ts`.
- [ ] Check the `ki-work-roadmap` eval scenario and `ki-accept` skill wording still agree.
- [ ] Hand the matching work-item model change to `tools-ki` in plain language, through `ki-trades`.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-accept/references/standards-acceptance.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` and `roadmap-evidence.model.test.ts`
- possibly `evals/scenarios/ki-work-roadmap.ts`

## Verify

- `bun run test` passes, including a new case where a foreign-code `resolution_target` fails ITEM-2.
- `ki repo audit` passes on this repository.

## Dependencies / blocks

None in this repository. `tools-ki` makes its own matching change after the handoff; this record does not wait for it.

## Documentation impact

### Decision Records

None expected: the owner's 2026-10-09 decision is already recorded in the state of play, and this applies it to one field.

### Specifications

None: the work-item format is a skill standard here, not a KI Specification.

### Guides

None beyond the standards and skill text listed above.

### Roadmap

A plain-language handoff to `tools-ki` for its work-item model.

## Discussion

- Once a target must be local, a cross-repository replacement cannot use `duplicate`, `merged` or `superseded` with a target. Options: allow those resolutions without a target when the replacement lives elsewhere, or record such a case as `obsolete` with the plain description in `## Cancelled`.
- Adoption corrected the rubric path in Boundary to its location under `skills/change-management/ki-work-roadmap/`, and found the acceptance standard also needs the change; confirm both sit within the agreed scope at planning.
