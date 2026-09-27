---
id: KI-HARNESS-GOV-107
area: GOV
title: Make coordination audit mechanical
theme: governance-consistency
horizon: triage
status: draft
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
updated_at: 2026-09-27T22:06:13Z
---

# KI-HARNESS-GOV-107: Make coordination audit mechanical

## Goal

An arrangement that breaks a KI–Paperclip coordination rule is caught by running an audit, not only by a reviewer who happens to look. Today the audit for that arrangement cannot fail on any input, so a declaring repository receives a clean result that carries no information about whether the arrangement conforms.

## Context

`ki-agent-coordination-paperclip` was declared for the first time on 2026-09-26, in `ki-agentic-harness` and `ki-techne-harness`, under coordination task `KNO-19`. Before that no repository declared it and `ki repo audit --skill ki-agent-coordination-paperclip` exited `2` with `--skill must name one declared resolved skill`. The declaration removes that exit and produces `PASS=1 WARN=0 FAIL=0` on each repository.

That result is resolution evidence, not conformance evidence, and the skill's own `references/mode-audit.md` now says so in step 3. The reason is structural: every criterion in [the generated rubric](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md) — `COORD-1` repository authority, `COORD-2` identity model, `COORD-3` task-to-work linkage, `COORD-4` workspace isolation, `COORD-5` direct-interaction boundary, `COORD-6` evidence return — is classified `[J]`. `scripts/rubric/items/coordination.ts` registers no audit operation, so the host has nothing to execute. Run with `--reporter-levels all` the audit prints zero criteria; the same host run with `--skill ki-repo` against the same working copy printed more than thirty and caught a real `TOGGLE-1` failure, so the reporter is not suppressing output.

The consequence is the inert-doctrine condition in a second form. The first form was a rule no repository declared. This form is a declared rule that nothing can fail. Asking what would break if the rule were violated still returns nothing.

Three of the six criteria have a mechanically checkable core, all of them under `COORD-3` and `COORD-1`, and all of them waiting on the same missing thing — a Paperclip task field that carries the governing repository, roadmap identifier and admitted revision as structured data rather than prose:

- a task naming a repository, roadmap identifier and revision triple that does not resolve to a real work item at that revision (`COORD-3`);
- a governing work item whose covering-task list does not name back the task that names it, or names a different one (`COORD-3`, the two-way-link condition);
- a coordination task recorded as complete against a work item that never passed through `ki-accept` (`COORD-1`).

The field does not exist. `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` holds the linkage contract, and the roadmap front-matter allow-list is implemented in `tools-ki` at `src/core/work/items.ts`, where unknown fields are rejected at parse time. Nothing can be adopted by convention: a new field is a code change, a validation rule and a specification change together.

## Boundary

In scope: whether this skill gains mechanical audit items, which criteria they attach to, what evidence each one reads, and where that evidence physically comes from given that one end of every candidate check lives outside any repository.

Out of scope, deliberately:

- adding the roadmap front-matter field itself, which is `TECHNE-TOOLS-CTRL-001` and a `tools-ki` change, not harness rubric work;
- changing any normative claim in [the coordination standard](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md), which this item treats as settled and only proposes to make checkable;
- which repositories declare the skill, which is [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md);
- removing or weakening the existing judgment criteria;
- the seven coordination rules themselves and any decision record that would fix them.

## Task associations

Verified on 2026-09-27 against the local Paperclip instance at `http://127.0.0.1:3100`, company `558dd49e-7615-409f-b7b2-7f19e22171d9`. Each UUID is the stable task identity.

- [KIS-19](http://127.0.0.1:3100/KIS/issues/KIS-19), `8a4fac55-7b74-4ad7-8934-37f2437873ad`: discovery and evaluation; its proposal D1 is the source cited below as KNO-19.
- [KIS-5 plan](http://127.0.0.1:3100/KIS/issues/KIS-5#document-plan), `b76a4ec9-be48-4a3c-8568-7885b5e6789b`: related task-link contract and parser work, not implementation of this item's mechanical audit. The current proposal uses per-item references and ordinary task prose backlinks, not a mandatory structured Paperclip field or shared mapping file. The held Techné record below remains historical provenance, not resumed authority.
- [KIS-70](http://127.0.0.1:3100/KIS/issues/KIS-70), `1040aaa6-dc73-4b11-9b6f-b2f0ad0d2a42`: related current-base evaluation; its plan distinguishes this item from governing GOV-115.

This is an association-only recovery check. No active delivery task was verified, but this is not a complete task/worktree census or an availability grant. Neither task-link backfill nor a paused agent releases retained work. Reconcile ownership and the changed evidence assumptions before selecting or shaping this Triage item; its horizon, lifecycle and audit boundary remain unchanged. Keep references here until KIS-5's provider-neutral map is implemented.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified partial prerequisite delivery: `a98cce65` supplies qualified per-item task links and offline shape validation in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`. The matching committed CLI implementation is `c0857d5652060d644fecc7c2f20a308f59feec7c` in `knowledgeislands/tools-ki`, `src/core/work/items.ts::parseTaskLinks`. Historical statements that no field exists are no longer current.
- The broader claim that the coordination audit cannot fail on any input is also stale: `00de1d36` added organisation configuration validation through `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/contexts/coordination.ts::createPaperclipCoordinationSession` and `ORG-1`. This is not task-link, live ownership or independent-acceptance verification. The current `COORD` criteria remain judgments.
- Remaining and closure route: retain this Triage item for its actual linkage-evidence problem, reconcile its prerequisites before human-approved adoption or disposition, and design negative fixtures against the selected evidence boundary. Do not report a mechanical coordination PASS as proof of live conformance or reimplement the delivered task-link field.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

### Where the evidence would have to come from

This is the hard part, and it is why the item is captured rather than shaped. Every candidate check has one end in a repository and the other end in a remote coordination plane. A repository-side audit can read a roadmap item's covering-task list; it cannot read the task. Three routes exist and none is obviously right.

The first is repository-side only: check the half of the two-way link the repository owns, and report the other half as unknown rather than as a pass. That is honest, cheap, and catches a covering-task field that names nothing or contradicts itself, but it cannot catch the orphaned task, which is the failure that actually costs something.

The second is an evidence file: require the arrangement to deposit a snapshot of its task-to-item links into the repository at a named revision, and audit the snapshot. That makes the check mechanical and offline, at the price of a file that can go stale silently — which reintroduces the same class of problem one layer down.

The third is a live read against the coordination plane. It makes the audit depend on network reach and credentials, which no other criterion in this harness does, and `mode-audit.md` step 5 already requires an unavailable remote view to be recorded as unknown rather than as a pass. That constraint survives whichever route wins.

### Why the judgment criteria stay

None of the three candidates replaces a judgment criterion; each adds a mechanical floor underneath one. `COORD-2` identity separation and `COORD-5` the direct-interaction boundary have no mechanical core at all that is visible from here, and `COORD-6` evidence return is a reconciliation a reader performs. Converting a judgment prompt into a check that fires on a proxy would be worse than the present state, because a green proxy reads exactly like conformance.

### Relationship to other records

- The accepted coordination-lane delivery places the four coordination lane records under `subagents/coordination/`. Those records are the subject of `COORD-2`, not of any check proposed here.
- [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md) decides who declares the skill. It determines how many repositories a mechanical item would run against, and is therefore worth settling first, but it is not build order: a rubric item can be written against one declaring repository.
- `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` and the allow-list in `tools-ki` are the real precondition. `blocked_by` is empty because it records build order between records in this roadmap, and neither of those is one; the constraint is stated here instead.
- The worktree-base assertion captured in [KI-HARNESS-GOV-115](KI-HARNESS-GOV-115-require-a-current-base-for-a-coordinated-worktree.md) is the first candidate check whose evidence is entirely repository-local: the Git worktree registry, the selected worktree's base, and the declared destination branch are all readable offline in the checkout being audited. None of the three evidence routes above applies to it, so it proceeds independently of this record. What remains here is the link criteria, whose other end is genuinely in the coordination plane.

### Governing coordination task

Captured from the `KNO-19` proposal document on the external coordination plane, which names this discovery as `D1`. That task owns the declaration; this record owns the question the declaration exposed.
