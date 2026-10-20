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
status: done
blocks: []
blocked_by: []
baseline_ref: e66f313024baf4493fc732ca6251ca2aba21afb6
created_at: 2026-10-09T21:50:21Z
updated_at: 2026-10-20T08:16:49Z
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

- [x] Change the work-item format, repository roadmaps and acceptance standards, and `ki-accept`'s `SKILL.md`, so `resolution_target` must resolve in the same repository, and a duplicate of, or merge into, another repository's work keeps its resolution with no `resolution_target`, naming that repository in plain words in `## Cancelled` with no identifier or link.
- [x] Make `roadmap-evidence.ts` fail a `resolution_target` whose repository code is not this repository's, with tests in `roadmap-evidence.model.test.ts`.
- [x] Check the `ki-work-roadmap` eval scenario and `ki-accept` skill wording still agree.
- [x] Hand the matching work-item model change to `tools-ki` in plain language, as one line in ki.ways-of-working's `messages.md` for routing, since a handoff is a message, not a record.
- [x] Align `ki-accept`'s acceptance model and its fixtures with the same rule, with regression tests that fail on the old behaviour; added after the failed independent review.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-accept/references/standards-acceptance.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` and `roadmap-evidence.model.test.ts`
- `skills/change-management/ki-accept/SKILL.md`
- `skills/change-management/ki-accept/scripts/internal/acceptance-cycle.ts` and `acceptance-cycle.test.ts`
- `evals/scenarios/ki-work-roadmap.ts`

## Verify

- `bun run test` passes, including a new case where a foreign-code `resolution_target` fails ITEM-2 and a targeted resolution with no target passes, and acceptance-model cases where a foreign target stops and a plain-words replacement in another repository cancels.
- `bunx tsc --noEmit` passes.
- `ki repo audit --skill ki-work-roadmap`, `--skill ki-skills` and `--skill ki-authoring` report no FAIL, run on the worktree in an isolated home. `ki-accept` is not a declared audit skill and has no rubric catalogue, so its acceptance model is verified by its focused tests.

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

## Review

### Delivered

The approved boundary, against baseline `e66f313024baf4493fc732ca6251ca2aba21afb6`, in delivery `4a10ba0707abb4d1258fe0b46937880e46b02421` and rework `062c27e65a921041252977909ae1dcbd7e1d9411`: a `resolution_target` must name a record of the same repository, and a `duplicate`, `merged` or `superseded` record whose replacing work lives in another repository keeps its resolution with no target and names that repository and work in plain words in `## Cancelled`. The rework brings `ki-accept`'s acceptance model and fixtures into line with that rule, as the failed independent review required. Done or cancelled records that already cite a cross-repository target were out of scope; none exists. The `tools-ki` change is handed off, not made.

### Change Summary

- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`: the cancellation paragraph requires a same-repository target, fails a foreign one, and gives the plain-words form for work elsewhere.
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`: the lifecycle table's Duplicate across repositories row cancels with no `resolution_target` and names the other repository's work in `## Cancelled`.
- `skills/change-management/ki-accept/references/standards-acceptance.md` steps 6 and 3, and `skills/change-management/ki-accept/SKILL.md`'s invocation paragraph: the same rule for cancellation. The Controlled acceptance models paragraph now lists the same-repository target and plain-words replacement fixtures.
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`: a local `isLocalIdentifier` helper, built on the shared `matchesRoadmapArea`, so a target fails ITEM-2 unless it carries this repository's code and, where areas are declared, one declared area; a targeted resolution with no target now passes, and an empty one fails. The shared `roadmap-areas.ts` is untouched, because `ki-repo-kb-streams` carries a byte-identical copy of it.
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.model.test.ts`: cases for a foreign code, a near-miss code (`TESTX-012` against `TEST`), an absent target and an empty target.
- `skills/change-management/ki-accept/scripts/internal/acceptance-cycle.ts`: a cancel item now carries the selected repository's code and declared areas and an optional `replacementRepository`. A target must be canonical, differ from the record and be local by code and area; a foreign target stops. With no target, a targeted resolution cancels only when it names another repository, its cancellation evidence names that repository, and the evidence cites no other repository's identifier and no link. A target and a replacing repository together stop, as does a replacing repository on `obsolete` or `rejected`. The outcome returns `replacementRepository`. Human approval and the evidence checks are unchanged.
- `skills/change-management/ki-accept/scripts/acceptance-cycle.test.ts`: the fixtures that required a foreign target to pass and an absent target to stop now use local targets and an empty target; two new tests cover the plain-words cross-repository cancellation and every new stop, including near-miss and undeclared-area targets.
- `evals/scenarios/ki-work-roadmap.ts`: the cancel-duplicate scenario says its target is in the same repository, and its rubric names the plain-words form.
- The tools-ki follow-up is one line, TOOLS-KI-RESOLUTION-LOCAL, in ki.ways-of-working's `messages.md`, ki-principal `53184b64`.

### Verification

- `bun run test`: 1,374 pass, 0 fail. Against the old acceptance model, the four affected acceptance-cycle tests, including both new ones, fail.
- `bunx tsc --noEmit`: pass.
- In an isolated home linked to the worktree: `ki repo audit --skill ki-work-roadmap` no FAIL, with three pre-existing migration-window size warnings on other records and the isolated home's unavailable capital registry; `--skill ki-skills` and `--skill ki-authoring` pass; `ki dev skill rubric ki-work-roadmap` and `ki dev skill rubric ki-skills` report in sync.
- `ki-accept` cannot be audited as a skill: `ki repo audit --skill ki-accept` exits because it is not a declared resolved audit skill, and `ki dev skill rubric ki-accept` reports no rubric catalogue. Its acceptance model is verified directly by its focused tests above.
- The pre-commit hook passed on each commit.

### Outstanding concerns

`tools-ki`'s work-item parser still throws on a targeted resolution with no target, so the new cross-repository form must not be used until tools-ki follows; the handoff line says so. The acceptance model is a pure model: a caller must supply the repository's code and areas for the locality check to hold.

### Post-change review

The goal holds: a foreign target can no longer pass the audit or the acceptance model, and the standards, checker and model agree on one rule. Scope stayed inside the named files plus the `ki-accept` skill paragraph, recorded at planning, and the acceptance model and fixtures, required by the failed review. Regression risk is low: the estate has no record with a foreign target, and the one local target still resolves.

### Mini recap

Resolution targets are now local only, enforced by ITEM-2 and by the acceptance model, with the cross-repository case recorded in plain words; tests, type check and focused audits pass. Learning route, not promoted: a worktree audit can seed the canonical harness as a link to the worktree, so the isolated-home recipe needs no download.

## Done

Accepted 20 October 2026 by Kris Brown under the quoted standing grant, after independent re-review, on the review packet above.

## Discussion

### Independent re-review and acceptance, 20 October 2026

accept2-harness-170 independently reviewed delivery `4a10ba0707abb4d1258fe0b46937880e46b02421` and rework `062c27e65a921041252977909ae1dcbd7e1d9411` against all five Steps and every Verify requirement at source revision `b5ad1d912960c1088a05156fac77b3209a463bac`. The standards, invocation and eval agree; the roadmap checker rejects foreign and near-miss repository codes; the acceptance model rejects foreign targets and permits the approved plain-words replacement form. Exact checks confirmed the immutable baseline, completed Steps and six-part Review packet. The tools-ki handoff was verified in ki-principal commit `53184b64fe1594ff547c292e06c4e98609017493`.

Independent checks in the linked worktree: `bun run test` passed all 1,374 tests; `bunx tsc --noEmit` passed; isolated-home `ki-work-roadmap`, `ki-skills` and `ki-authoring` audits reported no FAIL. The roadmap audit retained three unrelated size warnings and the isolated home's unavailable capital registry. Running the current acceptance fixtures against the previous model produced four expected failures and five passes. `ki-accept` is a process skill without a declared audit or rubric catalogue; its model was reviewed directly and exercised by the passing suite.

Acceptance authority: Kris Brown, 20 October 2026 about 05:20 BST, "if you can quickly now accept ... accepting new things that are waiting with you and pruning those ... getting the roadmaps down to zero", applied to exactly this record by the accept2-harness-170 brief and the ways-of-working decisions log's 09:00 and 09:06 entries. The explicit brief forbids pruning and pushing. The tools-ki parser follow-up remains receiver-owned, and the new cross-repository form remains subject to the Review packet's recorded limitation until that change lands. No other record is accepted.

Deferred to Future on 2026-10-12 by Kris Brown's approval of the roadmap minimisation batch 4 (Kris's 2026-10-12 approval in the state-of-play run, 'ROADMAP-BATCHES 3 to 5 approved as recommended'): the work-item standard still accepts a cross-repository `resolution_target` by shape, and no current work needs the change. Re-scope before it becomes actionable.

- Once a target must be local, a cross-repository replacement cannot use `duplicate`, `merged` or `superseded` with a target. Options: allow those resolutions without a target when the replacement lives elsewhere, or record such a case as `obsolete` with the plain description in `## Cancelled`.
- Adoption corrected the rubric path in Boundary to its location under `skills/change-management/ki-work-roadmap/`, and found the acceptance standard also needs the change; confirm both sit within the agreed scope at planning.
- Settled by the owner on 2026-10-10: the acceptance standard is in scope, and a duplicate of, or merge into, another repository's work is recorded in plain words naming the repository, with no identifier or link.

### Planning, 20 October 2026

Promoted from Future to Next and planned to Ready in the harness-burn run under Kris's OVERNIGHT-BURNDOWN of 20 October 2026 in the ki.ways-of-working decisions log: "we can have a good run at whatever's left in the agentic harness ... keep you know motoring through them". The 2026-10-09 and 2026-10-10 owner decisions above settle the shape, so planning added no new choice.

### Failed independent review, 20 October 2026

Returned to `in-progress` by accept-harness-170 after independently reviewing delivery `4a10ba0707abb4d1258fe0b46937880e46b02421` against baseline `e66f313024baf4493fc732ca6251ca2aba21afb6`. The standards, roadmap checker, regression tests, eval wording and routed tools-ki handoff match the planned change, but the acceptance skill's executable contract still contradicts its changed guidance.

- `skills/change-management/ki-accept/scripts/internal/acceptance-cycle.ts`, lines 154-169: `evaluateAcceptanceCycle` still stops an explicitly approved `superseded` cancellation with no target, even when its cancellation evidence names the replacing repository and work in plain words. The same input with a foreign target returns `kind: cancel`. This conflicts with the revised acceptance standard and invocation. Its input carries no repository identity or target-locality evidence, so canonical identifier shape alone cannot establish the required local boundary.
- `skills/change-management/ki-accept/scripts/acceptance-cycle.test.ts`, lines 120-131 and 165-169: existing fixtures still require foreign targets to pass and absent targets to stop. Align the model and fixtures with the revised rule before seeking acceptance again; preserve human approval and cancellation-evidence checks. This review makes no implementation or scope change.
- Independent verification in an isolated worktree home: `bun run test` passed (1,372 tests); `bunx tsc --noEmit` passed; `ki-work-roadmap`, `ki-skills` and `ki-authoring` audits reported no FAIL. The roadmap audit's three size warnings and unavailable isolated-home capital registry are separate from this finding. The six Review headings, completed Steps and immutable baseline were verified exactly.
- The delivery report's claimed passing `ki-accept` audit could not be reproduced: `ki repo audit --skill ki-accept` exits 2 because it is not a declared resolved audit skill. This process skill's controlled model was reviewed directly instead; do not describe that command as a passing audit.

No acceptance or pruning was performed. The separately routed tools-ki follow-up remains receiver-owned.

### Rework after failed review, 20 October 2026

Returned to `awaiting-review` by harness-rework-170 under the ways-of-working coordinator's brief. `ki-accept`'s acceptance model and fixtures now follow the revised rule, a step and the two script files were added to the record for that, and the review packet was refreshed. No acceptance or pruning was performed.
