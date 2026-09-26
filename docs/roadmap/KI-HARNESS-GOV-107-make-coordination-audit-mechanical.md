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
created_at: 2026-09-26T15:14:21Z
updated_at: 2026-09-26T15:28:25Z
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

## Discussion

### Where the evidence would have to come from

This is the hard part, and it is why the item is captured rather than shaped. Every candidate check has one end in a repository and the other end in a remote coordination plane. A repository-side audit can read a roadmap item's covering-task list; it cannot read the task. Three routes exist and none is obviously right.

The first is repository-side only: check the half of the two-way link the repository owns, and report the other half as unknown rather than as a pass. That is honest, cheap, and catches a covering-task field that names nothing or contradicts itself, but it cannot catch the orphaned task, which is the failure that actually costs something.

The second is an evidence file: require the arrangement to deposit a snapshot of its task-to-item links into the repository at a named revision, and audit the snapshot. That makes the check mechanical and offline, at the price of a file that can go stale silently — which reintroduces the same class of problem one layer down.

The third is a live read against the coordination plane. It makes the audit depend on network reach and credentials, which no other criterion in this harness does, and `mode-audit.md` step 5 already requires an unavailable remote view to be recorded as unknown rather than as a pass. That constraint survives whichever route wins.

### Why the judgment criteria stay

None of the three candidates replaces a judgment criterion; each adds a mechanical floor underneath one. `COORD-2` identity separation and `COORD-5` the direct-interaction boundary have no mechanical core at all that is visible from here, and `COORD-6` evidence return is a reconciliation a reader performs. Converting a judgment prompt into a check that fires on a proxy would be worse than the present state, because a green proxy reads exactly like conformance.

### Relationship to other records

- [KI-HARNESS-GOV-101](KI-HARNESS-GOV-101-record-coordination-lane-roles.md) places the four coordination lane records under `subagents/coordination/`. Those records are the subject of `COORD-2`, not of any check proposed here.
- [KI-HARNESS-GOV-108](KI-HARNESS-GOV-108-decide-coordination-declaration-scope.md) decides who declares the skill. It determines how many repositories a mechanical item would run against, and is therefore worth settling first, but it is not build order: a rubric item can be written against one declaring repository.
- `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` and the allow-list in `tools-ki` are the real precondition. `blocked_by` is empty because it records build order between records in this roadmap, and neither of those is one; the constraint is stated here instead.

### Governing coordination task

Captured from the `KNO-19` proposal document on the external coordination plane, which names this discovery as `D1`. That task owns the declaration; this record owns the question the declaration exposed.
