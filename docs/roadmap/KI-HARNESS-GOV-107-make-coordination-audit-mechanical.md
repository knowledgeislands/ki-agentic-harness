---
id: KI-HARNESS-GOV-107
area: GOV
title: Make coordination audit mechanical
kind: deliver
project: paperclip-bootstrap-and-recovery
component: agentic-systems
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
task_links:
  paperclip:
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: 8a4fac55-7b74-4ad7-8934-37f2437873ad
      key: KIS-19
      url: http://127.0.0.1:3100/KIS/issues/KIS-19
      relation: evaluation
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: b76a4ec9-be48-4a3c-8568-7885b5e6789b
      key: KIS-5
      url: http://127.0.0.1:3100/KIS/issues/KIS-5
      relation: related
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: 1040aaa6-dc73-4b11-9b6f-b2f0ad0d2a42
      key: KIS-70
      url: http://127.0.0.1:3100/KIS/issues/KIS-70
      relation: related
created_at: 2026-09-26T15:14:21Z
updated_at: 2026-10-07T20:34:47Z
---

# KI-HARNESS-GOV-107: Make coordination audit mechanical

## Goal

An arrangement that breaks a KI-Paperclip coordination rule is caught by running an audit, not only by a reviewer who happens to look. Today the audit for that arrangement cannot fail on any input, so a declaring repository receives a clean result that carries no information about whether the arrangement conforms.

## Context

`ki-agent-coordination-paperclip` was declared for the first time on 2026-09-26, in `ki-agentic-harness` and `ki-techne-harness`, under coordination task `KNO-19`. Before that no repository declared it and `ki repo audit --skill ki-agent-coordination-paperclip` exited `2` with `--skill must name one declared resolved skill`. The declaration removes that exit and produces `PASS=1 WARN=0 FAIL=0` on each repository.

That result is resolution evidence, not conformance evidence, and the skill's own `references/mode-audit.md` now says so in step 3. The reason is structural: every criterion in [the generated rubric](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md) - `COORD-1` repository authority, `COORD-2` identity model, `COORD-3` task-to-work linkage, `COORD-4` workspace isolation, `COORD-5` direct-interaction boundary, `COORD-6` evidence return - is classified `[J]`. `scripts/rubric/items/coordination.ts` registers no audit operation, so the host has nothing to execute. Run with `--reporter-levels all` the audit prints zero criteria; the same host run with `--skill ki-repo` against the same working copy printed more than thirty and caught a real `TOGGLE-1` failure, so the reporter is not suppressing output.

The consequence is the inert-doctrine condition in a second form. The first form was a rule no repository declared. This form is a declared rule that nothing can fail. Asking what would break if the rule were violated still returns nothing.

Three of the six criteria have a mechanically checkable core, all of them under `COORD-3` and `COORD-1`, and all of them waiting on the same missing thing - a Paperclip task field that carries the governing repository, roadmap identifier and admitted revision as structured data rather than prose:

- a task naming a repository, roadmap identifier and revision triple that does not resolve to a real work item at that revision (`COORD-3`);
- a governing work item whose covering-task list does not name back the task that names it, or names a different one (`COORD-3`, the two-way-link condition);
- a coordination task recorded as complete against a work item that never passed through `ki-accept` (`COORD-1`).

The field does not exist. `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` holds the linkage contract, and the roadmap front-matter allow-list is implemented in `tools-ki` at `src/core/work/items.ts`, where unknown fields are rejected at parse time. Nothing can be adopted by convention: a new field is a code change, a validation rule and a specification change together.

## Boundary

Decided 2026-10-05 under delegated owner authority: `COORD-3` gains mechanical checks over repository-local evidence only, namely that a governing identifier triple resolves and that the item-side backlink is present. Every plane-side check stays judgment. This settles the evidence-route question below in favour of the first route; no deposited snapshot and no live coordination-plane read.

In scope:

- a diagnostic mechanical operation on the existing `COORD-3` item, alongside its judgment prompt, reading only the selected checkout's work records under the configured `ki-work` adapter root (`docs/roadmap/` for `roadmap`, `Streams/Roadmap/` for `kb-streams`) and the local Git object store;
- **triple resolves:** for each record carrying a Paperclip `task_links` reference with relation `implementation` and a non-null `baseline_ref`, the locator triple of this repository, the record `id` and `baseline_ref` resolves: the revision is a commit in the local object store, is an ancestor of `HEAD`, and contains a record file for that `id` under the adapter root;
- **backlink present:** each qualified Paperclip task identity (`authority`, `scope`, `id`) carried with relation `implementation` has exactly one item-side backlink in the selected revision: one record claims it as governing, matching the standard's rule that a delivery task has at most one governing KI item. A record whose delivery runs outside Paperclip is not required to carry a governing link, because an `evaluation` or `related` link says nothing about who delivers;
- outcome text that says the plane side was not evaluated, so a pass is never read as live conformance;
- `NOT_APPLICABLE`, not `PASS`, when the repository selects a remote work adapter or no record carries a Paperclip reference;
- **current worktree base**, absorbed from `KI-HARNESS-GOV-115`: the coordination standard states that a coordinated worktree's base is the destination branch tip when it is provisioned, and one mechanical `COORD` assertion pair, with both ends inside the repository, reports drift from that base as a fact naming its re-admit action. It reads only the selected checkout's Git worktree registry, its base and the declared destination branch, never repairs, rebases or fetches, and never sweeps sibling worktrees, so the result depends only on the selected checkout;
- the `mode-audit.md` procedure update and the regenerated rubric.

Out of scope, deliberately:

- any read of the coordination plane, including whether the task's prose locator exists or names this item, task status, live claims, or acceptance; those remain the `COORD-3` and `COORD-1` judgment;
- the task-link field and its shape validation, delivered by `KI-HARNESS-GOV-116` and owned by `ki-work-roadmap`;
- changing any normative claim in [the coordination standard](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md);
- which repositories declare the skill, which is [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md);
- the held-workspace listing, which [KI-HARNESS-GOV-147](KI-HARNESS-GOV-147-make-the-branch-durable.md) now carries;
- removing or weakening any judgment criterion, and any new criterion code. `COORD-15` stays free for the worktree-base assertion above.

## Current state

- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts` defines `COORD-1` to `COORD-14`, all judgment; `ORG-1` and `RUBRIC-1` are the only mechanical items.
- `scripts/rubric/contexts/coordination.ts` reads only the skill's own `.ki.toml` table; it receives the repository root through `RubricContextOptions.repository` but reads no work record.
- `scripts/rubric/items/index.test.ts` asserts that no item other than `ORG-1` and `RUBRIC-1` is mechanical.
- `references/mode-audit.md` step 3 still says the catalogue registers no mechanical operation, which `ORG-1` already made stale.
- In this repository three records carry Paperclip task links, and none combines an `implementation` link with a non-null `baseline_ref`, so the new checks will report not applicable here on day one; fixtures carry the negative cases.
- Rubric contexts may read files and run local Git, as `ki-trades` does in `scripts/rubric/contexts/trades.ts`, so no host change in `tools-ki` is needed.

## Steps

- [ ] Extend `PaperclipCoordinationContext` with a `linkage` outcome list computed in `createPaperclipCoordinationSession`: resolve the adapter from the repository's `.ki.toml` `[skills.ki-work]` table, parse record frontmatter under the adapter root, and run local Git (`git cat-file -e <ref>^{commit}`, `git merge-base --is-ancestor <ref> HEAD`, `git ls-tree --name-only <ref> -- <root>`) with no fetch and no write.
- [ ] Emit one `VIOLATION` per failed triple naming the record, the revision and which part failed; and one per task identity claimed as governing by more than one record, naming every claimant. Emit `PASS` with a count and a plane-side-not-evaluated note otherwise, and `NOT_APPLICABLE` when nothing is in scope.
- [ ] Add a `mechanical` diagnostic block at level `FAIL` to `COORD-3`, keeping its judgment prompt, with remediation guidance that names the record to correct and says the task side must be reconciled by judgment.
- [ ] Add context fixtures in `scripts/rubric/contexts/coordination.test.ts` using a temporary Git repository: an unknown revision, a revision not an ancestor of `HEAD`, a revision without the record, a duplicate governing claim, a record with only `evaluation` links that must pass, a clean pass, a remote adapter and a repository with no links.
- [ ] Update `scripts/rubric/items/index.test.ts` so `COORD-3` is permitted as mechanical and still carries its judgment.
- [ ] Rewrite `references/mode-audit.md` step 3 to say which results are mechanical, what `COORD-3` checks and what it cannot see, and that a pass is repository-side evidence only.
- [ ] Regenerate `references/rubric.md` and run the verification below.

## Files touched

- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/contexts/coordination.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/contexts/coordination.test.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/index.test.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/mode-audit.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md` (generated)

## Verify

1. Each negative fixture produces exactly one `COORD-3` violation naming the record and the failed part, and the audit exits non-zero.
2. The passing fixture reports `PASS` with the count of links checked and a statement that the plane side was not evaluated; the remote-adapter and no-link fixtures report `NOT_APPLICABLE`.
3. The audit makes no network call and no write: `git rev-parse HEAD`, `git status --porcelain` and `git worktree list --porcelain` are byte-identical before and after, and no fetch occurs.
4. The result depends only on the selected checkout: a commit in a sibling worktree does not change it.
5. `COORD-3` keeps its judgment prompt, no new criterion code exists, and `mode-audit.md` step 3 no longer claims the catalogue is wholly judgment.
6. The commands below pass, and the audit against this repository reports `COORD-3` as evaluated.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-agent-coordination-paperclip
ki repo audit --skill ki-agent-coordination-paperclip --reporter-levels all --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

Nothing blocks this record and it blocks nothing. Sequencing preference: land after [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md), which settles how many repositories these checks run in; this record is correct under either scope because it emits `NOT_APPLICABLE` where no record carries a Paperclip reference. The held-workspace listing in [KI-HARNESS-GOV-147](KI-HARNESS-GOV-147-make-the-branch-durable.md) adds a further local-evidence operation to the same context, should follow this one's evidence-boundary pattern, and is preferably landed after it to avoid merge conflicts. Both blockers removed as ordering only; decided by the Fable reviewer under delegated autonomy, reversible. `KI-HARNESS-GOV-116` and `TECHNE-TOOLS-CTRL-001`, the field prerequisites, are done.

## Documentation impact

### Decision Records

None. The scope question is answered in the standard by [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md).

### Specifications

None. `docs/specs/` does not describe the coordination rubric; `rubric.md` is regenerated and `mode-audit.md` is corrected as steps above.

### Guides

None.

### Roadmap

Sequenced after [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md) and before [KI-HARNESS-GOV-147](KI-HARNESS-GOV-147-make-the-branch-durable.md), which adds the held-workspace listing to the same audit surface, by preference only; neither is a blocker. Apart from the worktree-base assertion pair absorbed from `KI-HARNESS-GOV-115`, no new rubric code is allocated.

## Task associations

Verified on 2026-09-27 against the local Paperclip instance at `http://127.0.0.1:3100`, company `558dd49e-7615-409f-b7b2-7f19e22171d9`. Each UUID is the stable task identity.

- [KIS-19](http://127.0.0.1:3100/KIS/issues/KIS-19), `8a4fac55-7b74-4ad7-8934-37f2437873ad`: discovery and evaluation; its proposal D1 is the source cited below as KNO-19.
- [KIS-5 plan](http://127.0.0.1:3100/KIS/issues/KIS-5#document-plan), `b76a4ec9-be48-4a3c-8568-7885b5e6789b`: related task-link contract and parser work, not implementation of this item's mechanical audit. The current proposal uses per-item references and ordinary task prose backlinks, not a mandatory structured Paperclip field or shared mapping file. The held Techné record below remains historical provenance, not resumed authority.
- [KIS-70](http://127.0.0.1:3100/KIS/issues/KIS-70), `1040aaa6-dc73-4b11-9b6f-b2f0ad0d2a42`: related current-base evaluation; its plan distinguishes this item from governing GOV-115.

This is an association-only recovery check. No active delivery task was verified, but this is not a complete task/worktree census or an availability grant. Neither task-link backfill nor a paused agent releases retained work. Reconcile ownership and the changed evidence assumptions before selecting or shaping this Triage item; its horizon, lifecycle and audit boundary remain unchanged. Keep references here until KIS-5's provider-neutral map is implemented.

## Discussion

### Pickup checkpoint - 2026-09-27

- Verified partial prerequisite delivery: `a98cce65` supplies qualified per-item task links and offline shape validation in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`. The matching committed CLI implementation is `c0857d5652060d644fecc7c2f20a308f59feec7c` in `knowledgeislands/tools-ki`, `src/core/work/items.ts::parseTaskLinks`. Historical statements that no field exists are no longer current.
- The broader claim that the coordination audit cannot fail on any input is also stale: `00de1d36` added organisation configuration validation through `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/contexts/coordination.ts::createPaperclipCoordinationSession` and `ORG-1`. This is not task-link, live ownership or independent-acceptance verification. The current `COORD` criteria remain judgments.
- Remaining and closure route: retain this Triage item for its actual linkage-evidence problem, reconcile its prerequisites before human-approved adoption or disposition, and design negative fixtures against the selected evidence boundary. Do not report a mechanical coordination PASS as proof of live conformance or reimplement the delivered task-link field.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Where the evidence would have to come from

This was the hard part, and it kept the item in Triage until the 2026-10-05 decision chose the first route below. Every candidate check has one end in a repository and the other end in a remote coordination plane. A repository-side audit can read a roadmap item's covering-task list; it cannot read the task. Three routes exist and none is obviously right.

The first is repository-side only: check the half of the two-way link the repository owns, and report the other half as unknown rather than as a pass. That is honest, cheap, and catches a covering-task field that names nothing or contradicts itself, but it cannot catch the orphaned task, which is the failure that actually costs something.

The second is an evidence file: require the arrangement to deposit a snapshot of its task-to-item links into the repository at a named revision, and audit the snapshot. That makes the check mechanical and offline, at the price of a file that can go stale silently - which reintroduces the same class of problem one layer down.

The third is a live read against the coordination plane. It makes the audit depend on network reach and credentials, which no other criterion in this harness does, and `mode-audit.md` step 5 already requires an unavailable remote view to be recorded as unknown rather than as a pass. That constraint survives whichever route wins.

### Why the judgment criteria stay

None of the three candidates replaces a judgment criterion; each adds a mechanical floor underneath one. `COORD-2` identity separation and `COORD-5` the direct-interaction boundary have no mechanical core at all that is visible from here, and `COORD-6` evidence return is a reconciliation a reader performs. Converting a judgment prompt into a check that fires on a proxy would be worse than the present state, because a green proxy reads exactly like conformance.

### Relationship to other records

- The accepted coordination-lane delivery places the four coordination lane records under `subagents/coordination/`. Those records are the subject of `COORD-2`, not of any check proposed here.
- [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md) decides who declares the skill. It determines how many repositories a mechanical item would run against, and is therefore worth settling first, but it is not build order: a rubric item can be written against one declaring repository.
- `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` and the allow-list in `tools-ki` are the real precondition. `blocked_by` is empty because it records build order between records in this roadmap, and neither of those is one; the constraint is stated here instead.
- The worktree-base assertion, absorbed from `KI-HARNESS-GOV-115`, is the first candidate check whose evidence is entirely repository-local: the Git worktree registry, the selected worktree's base, and the declared destination branch are all readable offline in the checkout being audited. None of the three evidence routes above applies to it, so it can land before the link criteria, whose other end is genuinely in the coordination plane.

### Governing coordination task

Captured from the `KNO-19` proposal document on the external coordination plane, which names this discovery as `D1`. That task owns the declaration; this record owns the question the declaration exposed.

### Decision

Add mechanical `COORD-3` checks over repository-local evidence only - the identifier triple resolves and the backlink is present - while plane-side checks stay judgment. The other evidence routes discussed above are superseded. Decided by the Fable reviewer under delegated autonomy, reversible.

### Merged from KI-HARNESS-GOV-115

Kris approved merging `KI-HARNESS-GOV-115` (Require current worktree base) into this record on 2026-10-07, under decision 17 of the state-of-play design: the worktree-base check is one more mechanical `COORD` criterion in the same context. Its scope is the in-scope bullet above. Its full plan - the stale-base and forbidden-location findings, the reported failure shape, the `COORD-10` identifier-collision note, its grandfathering rule and the provisioner request `KIS-71` - is at [its last open revision](https://github.com/knowledgeislands/ki-agentic-harness/blob/05d6acecb33dc19a6ac4aab7b077700c5ae9d2fc/docs/roadmap/KI-HARNESS-GOV-115-require-a-current-base-for-a-coordinated-worktree.md). The Steps and Verify sections above predate the merge: re-plan them to include it before implementation.
