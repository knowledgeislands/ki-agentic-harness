---
id: KI-HARNESS-GOV-170
area: GOV
title: Keep resolution targets local
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
priority: medium
size: s
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T21:50:21Z
updated_at: 2026-10-20T07:44:30Z
---

# KI-HARNESS-GOV-170: Keep Resolution Targets Local

## Goal

A cancelled `duplicate`, `merged` or `superseded` record names a `resolution_target` only in its own repository. Where the replacing work lives in another repository, the record names that repository and describes the work in plain terms in `## Cancelled`, without citing the other repository's record identifier or linking to it.

## Context

The owner decided on 2026-10-09 that nothing should refer to another repository's roadmap record or identifier, because records are pruned and the links break. The cross-repository choreography sections and the `ki-work-roadmap` and `ki-repo` guidance now say so for handoffs and dependencies.

The [work-item format standard](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md) still allows a `resolution_target` "in this or any other repository", accepted by shape. Changing that alters audit behaviour: the `ki-work-roadmap` rubric would reject a target that does not resolve locally. `tools-ki` parses the same field in its work-item model and would need the matching change; that is `tools-ki`'s own decision, so it receives a plain-language handoff rather than a link.

## Boundary

In scope: the work-item format and repository roadmaps standards, `ki-accept`'s [acceptance standard](../../skills/change-management/ki-accept/references/standards-acceptance.md), which also allows cross-repository resolution targets, the rubric check in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` and its tests, and a handoff to `tools-ki`. Out of scope: done or cancelled records that already cite a cross-repository target; they leave with pruning.

## Current state

Verified on 2026-10-10 and rechecked on 20 October 2026 at `727af90e`:

- The [work-item format standard](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md#cancellation-and-resolution) allows a `resolution_target` "in this or any other repository" and accepts a cross-repository target by shape; the [repository roadmaps standard](../../skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md)'s lifecycle table asks for "a qualified `resolution_target`" for a duplicate across repositories.
- The [acceptance standard](../../skills/change-management/ki-accept/references/standards-acceptance.md) step 6 says a target "may belong to another repository" and asks `## Cancelled` to name the target's repository and path.
- `roadmap-evidence.ts` checks the target's shape, and warns only when a same-repository target does not resolve; a target with another repository code passes unchecked.
- The `ki-work-roadmap` eval scenario names `KI-WEBSITE-SEO-005` as the retained record, with no repository context.
- `ki-accept`'s `SKILL.md` invocation paragraph also says the target may sit in another repository.
- No local roadmap in the estate's checkouts cites a cross-repository `resolution_target`; the one target in use, on [KI-HARNESS-GOV-196](KI-HARNESS-GOV-196-scratch-output-in-temp.md), is local.
- `tools-ki`'s work-item parser rejects a `duplicate`, `merged` or `superseded` record with no `resolution_target`, so until it follows, a record that uses the new cross-repository form fails `ki`'s own roadmap reading.

## Steps

- [ ] Change the work-item format, repository roadmaps and acceptance standards, and `ki-accept`'s `SKILL.md`, so `resolution_target` must resolve in the same repository, and a duplicate of, or merge into, another repository's work keeps its resolution with no `resolution_target`, naming that repository in plain words in `## Cancelled` with no identifier or link.
- [ ] Make `roadmap-evidence.ts` fail a `resolution_target` whose repository code is not this repository's, with tests in `roadmap-evidence.model.test.ts`.
- [ ] Check the `ki-work-roadmap` eval scenario and `ki-accept` skill wording still agree.
- [ ] Hand the matching work-item model change to `tools-ki` in plain language, as one line in ki.ways-of-working's `messages.md` for routing, since a handoff is a message, not a record.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-accept/references/standards-acceptance.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` and `roadmap-evidence.model.test.ts`
- `skills/change-management/ki-accept/SKILL.md`
- `evals/scenarios/ki-work-roadmap.ts`

## Verify

- `bun run test` passes, including a new case where a foreign-code `resolution_target` fails ITEM-2 and a targeted resolution with no target passes.
- `bunx tsc --noEmit` passes.
- `ki repo audit --skill ki-work-roadmap`, `--skill ki-skills` and `--skill ki-authoring` report no FAIL, run on the worktree in an isolated home.

## Dependencies / blocks

None in this repository. `tools-ki` makes its own matching change after the handoff; this record does not wait for it. Until it does, a cross-repository cancellation should not be recorded, since `ki` would reject the record.

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

Deferred to Future on 2026-10-12 by Kris Brown's approval of the roadmap minimisation batch 4 (Kris's 2026-10-12 approval in the state-of-play run, 'ROADMAP-BATCHES 3 to 5 approved as recommended'): the work-item standard still accepts a cross-repository `resolution_target` by shape, and no current work needs the change. Re-scope before it becomes actionable.

- Once a target must be local, a cross-repository replacement cannot use `duplicate`, `merged` or `superseded` with a target. Options: allow those resolutions without a target when the replacement lives elsewhere, or record such a case as `obsolete` with the plain description in `## Cancelled`.
- Adoption corrected the rubric path in Boundary to its location under `skills/change-management/ki-work-roadmap/`, and found the acceptance standard also needs the change; confirm both sit within the agreed scope at planning.
- Settled by the owner on 2026-10-10: the acceptance standard is in scope, and a duplicate of, or merge into, another repository's work is recorded in plain words naming the repository, with no identifier or link.

### Planning, 20 October 2026

Promoted from Future to Next and planned to Ready in the harness-burn run under Kris's OVERNIGHT-BURNDOWN of 20 October 2026 in the ki.ways-of-working decisions log: "we can have a good run at whatever's left in the agentic harness ... keep you know motoring through them". The 2026-10-09 and 2026-10-10 owner decisions above settle the shape, so planning added no new choice.
