---
id: KI-HARNESS-GOV-115
area: GOV
title: Require current worktree base
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
task_links:
  paperclip:
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: 1040aaa6-dc73-4b11-9b6f-b2f0ad0d2a42
      key: KIS-70
      url: http://127.0.0.1:3100/KIS/issues/KIS-70
      relation: evaluation
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: 331d6981-2e23-4818-9e4a-dc2ba933e6c3
      key: KIS-79
      url: http://127.0.0.1:3100/KIS/issues/KIS-79
      relation: implementation
created_at: 2026-09-27T05:02:00Z
updated_at: 2026-10-04T18:20:00Z
---

# KI-HARNESS-GOV-115: Require current worktree base

## Goal

A coordinated worktree's base is the destination branch tip when the worktree is provisioned, and any drift after that is a reported fact rather than a silent one. The coordination standard already requires an isolated checkout cut from a named commit and already requires the baseline to be recorded; it says nothing about _which_ commit, and no audit reads a worktree's base at all.

## Context

Measured 2026-09-27 across all 25 registered repositories, read-only, from the primary checkouts: 24 of 24 non-primary worktrees are behind their destination tip, by 1 to 48 commits, in `ki-agentic-harness`, `ki-techne-harness`, `ki-techne-principal` and `tools-ki`. None sits at the tip. The actively provisioned set is 1 to 12 behind; the retained set is 34 to 48 behind, which shows the drift is unbounded while a worktree sits. The three worktrees holding unlanded work are the stalest of all, at 48, 44 and 43, so the worst bases are precisely the ones a landing must be computed against. Evidence and the full table: coordination tasks `KIS-70` and `KIS-37`, the latter's plan revision 9 section 9.

Two defects read the same evidence in the same place and therefore share one check, though only the first is a new claim.

1. **Stale base.** No normative claim requires the base to be current. Nothing detects it.
2. **Forbidden location.** One worktree is registered at `ki-techne-harness/.git/paperclip-worktrees/KNO-19` at `4b45c11`, behind 8 and ahead 0, so nothing is at risk in it. The standard's workspace model already forbids that path and `COORD-4` already asks the question, so this is a conformance failure against settled doctrine rather than a gap in it. It is recorded here because `KI-HARNESS-GOV-110` removes `.git/**` from authoring-audit discovery: after that lands, the only audit that ever noticed this violation stops looking, and the assertion has nowhere else to live. Removing that particular worktree is worktree end-of-life work, owned by `KI-HARNESS-GOV-113`, and is not in this record.

`ki-agent-coordination-paperclip` was declared in `ki-agentic-harness` and `ki-techne-harness` on 2026-09-26, so a mechanical item added here has a repository to run against.

## Boundary

In scope: the normative claim; one mechanical `COORD` assertion pair with both ends inside the repository; the shape of the reported failure and the re-admit action it names.

Out of scope, deliberately:

- Paperclip's provisioner behaviour. No KI repository owns that code. This record makes the defect detectable, not impossible, and says so rather than implying a prevention it cannot deliver. The provisioner request is carried on the coordination plane as `KIS-71`.
- Removing, rebasing, pruning or fetching for any existing worktree. This record reports; it never repairs. Worktree end-of-life is `KI-HARNESS-GOV-113`.
- A sweep across sibling worktrees. Excluded so that an audit result depends only on the selected checkout, per the stability boundary in `KI-HARNESS-GOV-110`. A fleet report is a different surface and its gap is already captured as `KI-HARNESS-GOV-114`.
- The creation half of the workspace convention that constrains a worktree's path and branch name. That rewrites the existing `## Workspace model` paragraphs and has its own governing item; this record adds one sibling claim about the base revision and rewrites nothing.
- The two-way-link evidence routes in `KI-HARNESS-GOV-107`. This assertion needs none of them.

## Current state

Nothing written. The claim is absent from the standard, no `COORD` item is mechanical, and the audit against a declaring repository reports `PASS` with zero criteria evaluated, which is resolution evidence rather than conformance evidence. Covering coordination task: `KIS-70`.

## Steps

- [x] Reserve `GOV-115` by committing the `_ISSUES.md` advance on its own, in the designated primary checkout, before this record existed.
- [ ] Add one normative paragraph to the standard's workspace model: a writing run's isolated checkout is cut from the destination branch tip at provisioning; the recorded baseline is that commit; a checkout whose destination tip is no longer an ancestor of its head is stale and is re-admitted before its work lands.
- [ ] Add `COORD-10 [M]` to `scripts/rubric/items/coordination.ts` with two assertions on the selected worktree — its path lies outside the repository working tree and outside the Git common directory, and the destination tip is an ancestor of its head — and add `COORD-10` to the expected code list in `scripts/rubric/items/index.test.ts`.
- [ ] Regenerate `references/rubric.md` and extend `references/mode-audit.md` with how to read the result and the exact re-admit action on failure.
- [ ] Implement the host-side operation so `ki repo audit --skill ki-agent-coordination-paperclip` executes it. Separate delivery in `tools-ki`.

## Files touched

- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/index.test.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md` (generated)
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/mode-audit.md`
- host implementation in `tools-ki`, separate delivery under its own item

## Verify

Acceptance criteria, each judgeable by someone who did not write this:

1. Audited in a worktree whose destination tip is not an ancestor of its head, the run reports one `COORD-10` finding naming the repository, the selected worktree path, its head, the destination branch and tip, and the behind count, and exits non-zero.
2. Audited in a worktree at the tip, `COORD-10` passes, and the count of evaluated criteria reported by `--reporter-levels all` is greater than zero. Before this record it is zero.
3. Audited in a worktree registered beneath a repository's Git common directory, `COORD-10` reports the location assertion and prints the offending path.
4. The audit mutates nothing: `git worktree list --porcelain` and `git rev-parse HEAD` are byte-identical before and after, and no fetch occurs.
5. Two audits of the same selected checkout, taken while a sibling worktree commits, return the same `COORD-10` result.
6. `bun run test` and `bunx tsc --noEmit` pass, and `ki dev skill rubric ki-agent-coordination-paperclip` shows `COORD-10` published in the generated rubric.

```bash
ki repo audit --skill ki-agent-coordination-paperclip --reporter-levels all
git merge-base --is-ancestor "$(git rev-parse <destination>)" HEAD \
  || echo "stale base: behind $(git rev-list --count HEAD..<destination>)"
```

## Dependencies / blocks

`blocked_by` is empty by intent. `KI-HARNESS-GOV-107` settles how the _link_ criteria become mechanical and this record does not wait on it, because this assertion's evidence is entirely repository-local. `KI-HARNESS-GOV-110` is not a blocker but is the reason the location assertion belongs in the coordination audit rather than the authoring audit. `KI-HARNESS-GOV-113` and this record add sibling sections to one standard and sibling codes to one criterion namespace, which is a sequencing preference rather than a build order.

## Documentation impact

### Decision Records

None. The claim follows from the admitted-revision requirement the standard already carries. If review disagrees, this becomes an amendment to the coordination standard rather than a new record.

### Specifications

`standards-agent-coordination-paperclip.md` is the behaviour-level contract and it gains one paragraph in the workspace model. The change is a strengthening: every worktree cut from the destination tip already satisfied the existing named-commit requirement.

### Guides

None. The website skills-by-outcome guide selects skills by task and does not restate the workspace model.

### Roadmap

`KI-HARNESS-GOV-107` gains one cross-reference: this is the first candidate check with both ends inside the repository, so its evidence deadlock does not apply here.

## Task associations

Verified on 2026-09-27 against the local Paperclip instance at `http://127.0.0.1:3100`, company `558dd49e-7615-409f-b7b2-7f19e22171d9`. Each UUID is the stable task identity.

- [KIS-70](http://127.0.0.1:3100/KIS/issues/KIS-70), `1040aaa6-dc73-4b11-9b6f-b2f0ad0d2a42`: evaluation and proposal of this record; the earlier "covering" wording identifies that context, not a fresh implementation grant.
- [KIS-79](http://127.0.0.1:3100/KIS/issues/KIS-79), `331d6981-2e23-4818-9e4a-dc2ba933e6c3`: held delivery task explicitly naming this governing item and the KIS-70 context. Do not allocate overlapping implementation to a direct agent without resolving this retained ownership first.

This association-only check does not reconcile all worktrees, refresh a branch, release the held delivery, approve its old plan, or change this item's lifecycle. The current coordination standard's branch-refresh policy also needs comparison with this older plan before implementation; do not replay a superseded claim from the baseline above. Keep the evaluation and delivery references on this item for migration after KIS-5's provider-neutral map is implemented. A paused agent or missing machine-readable map is not evidence of availability.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified partial delivery: the current coordination standard already requires [current-baseline recovery](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#recovery-and-visibility) and [delivery-branch refresh](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#refreshing-a-delivery-branch). Those normative prerequisites do not prove the planned mechanical current-base and path-containment assertions.
- Remaining: no current-base mechanical assertion exists in the inspected coordination catalogue/context. Moreover, `7d7b247d` now uses `COORD-10` for Repository skill baseline, a judgment criterion. Reconcile and explicitly resolve this identifier collision before implementing or regenerating any rubric; do not overwrite the existing criterion. The earlier GOV-113 claim about `4c854d2c` is incorrect: that commit only updated GOV-107’s roadmap cross-reference.
- Verification and closure route: the retained KIS-70 worktree points to `94b6f9f007d06754f7c5ee67cf3c82be32308c50`; this audit did not inspect its uncommitted contents or establish a live task claim. Reconcile retained work, confirm the separate host-operation delivery in `tools-ki`, and prove all planned negative and read-only fixtures before review and explicit owner acceptance. Do not refresh or replay the retained branch under this documentation pass.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Why the obvious check cannot fail

The check first proposed on `KIS-70` was `git merge-base --is-ancestor <base> <destination-tip>`. That assertion is vacuously true for any base reachable from the destination branch, including a base 48 commits behind it, so it would have passed on all 24 measured worktrees. Executed in the `KIS-70` worktree at base `5514e48f` against `main` at `4eb1ea90`: as written it passes, and the corrected direction fails at behind 2. The assertion that detects the defect is `git merge-base --is-ancestor "$(git rev-parse <destination>)" HEAD`.

### Why the assertion is self-scoped rather than fleet-scoped

An audit result must depend only on the selected revision and the repository's declared local configuration, which is the stability boundary `KI-HARNESS-GOV-110` carries. A sweep across sibling worktrees would let one worktree fail another's audit, the precise failure that boundary exists to remove. The fleet sweep that produced this record's evidence is therefore a report rather than an audit criterion, and its gap is `KI-HARNESS-GOV-114`.

### Why this reports and never repairs

An audit that rebases or moves a worktree writes to a checkout whose owner did not ask it to, which is the isolation rule inverted. The failure is the deliverable: it tells the agent computing a landing that its base is superseded, at the moment that matters, and leaves the correction to whoever holds the work.

### Why this proceeds while GOV-107 stays in Triage

`KI-HARNESS-GOV-107` is `triage` and `draft` because every candidate check it examined has one end in the coordination plane, with three unsatisfactory evidence routes. This check has both ends inside the repository: `git worktree list --porcelain`, `git merge-base`, the declared destination branch, and the worktree's own path are all local and offline, needing no task read, no deposited snapshot and no live coordination-plane call. `GOV-107` also excludes changing any normative claim in the coordination standard, and part of this correction is such a claim, which is the second reason this is a separate record.

### Identifier and criterion-code allocation

The number is `115` rather than the `113` this record's proposal named. `GOV-113` and `GOV-114` were already reserved by committed ledger advances on `KIS-39`'s unmerged branch, so `main`'s high-water of `112` was stale rather than current at allocation time. Taking `113` would have produced two records under one identifier, discovered at merge rather than at allocation, which is the failure `KI-HARNESS-GOV-104` exists to prevent. The same reasoning fixes the criterion code: `COORD-8` is held for the roadmap write locus on `KIS-36`'s branch and `COORD-9` for workspace retirement on `KIS-39`'s, so this record takes `COORD-10` and leaves no collision. A gap in either namespace costs a reader nothing; a collision costs a reviewer a reconciliation.

### Grandfathering

All 24 measured worktrees fail the base assertion the day this lands, and no exception is proposed. An exception granted at adoption never expires. These worktrees are transient by construction and each landing already has to re-admit its base, so the correct migration is the ordinary one: the report is loud, and it goes quiet as the population turns over.

### Governing coordination task

Covering coordination task: `KIS-70`, where the finding was raised and where the widened 24-of-24 measurement from `KIS-37` was accepted as its evidence. The proposal was approved by the responsible human on that task, bound to plan revision 1. The provisioner half of the correction is `KIS-71`, escalated rather than absorbed, because no KI repository governs the code that cuts the worktree. This record and its ledger advance were written in this repository's designated primary checkout, on `main` from `4eb1ea90`, not in the covering task's delivery worktree, per `### Roadmap records are the exception`. The readiness re-audit ran on that checkout: `ki repo audit --skill ki-work-roadmap` reports `PASS`.

### Blocker checkpoint - 2026-10-04 (estate push)

Not implemented in the 2026-10-04 estate push. Paperclip task `KIS-79` still holds retained delivery ownership of this record (`in_review`, assigned to the Convenor), and its latest comment records the board pausing agents with an instruction to stop without delivering. This record says not to allocate overlapping implementation until that ownership is resolved, so the owner must either release `KIS-79` or confirm its retained delivery. Separately, the plan's `COORD-10` code is now taken ("Repository skill baseline" in `ki-agent-coordination-paperclip`); a fresh code, such as `COORD-15`, is needed when the plan is revisited.

### Question for Kris - 2026-10-04

Not started in the second 2026-10-04 pass, for two reasons that only you can clear. The harness half already exists as retained commit `94b6f9f0` on the `KIS-70` branch (standard paragraph, mechanical item, regenerated rubric, `mode-audit.md`), still owned by `KIS-79`. Verify criteria 1 and 2 also need a host operation in `tools-ki`, which has no matching item yet.

**Question:** May this repository take over delivery from `KIS-79` by landing `94b6f9f0` on `main` with its criterion renumbered to `COORD-15`, and should a `tools-ki` handoff item be raised for the host-side execution (this record would then be `blocked by` it)? Until both are answered this record stays `ready`.
