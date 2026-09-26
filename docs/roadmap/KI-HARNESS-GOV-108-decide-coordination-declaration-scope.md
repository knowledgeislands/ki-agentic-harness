---
id: KI-HARNESS-GOV-108
area: GOV
title: Decide coordination declaration scope
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T15:14:21Z
updated_at: 2026-09-26T15:28:25Z
---

# KI-HARNESS-GOV-108: Decide coordination declaration scope

## Goal

Which repositories declare `[skills.ki-agent-coordination-paperclip]` is a recorded decision with its reasoning, its named exclusions and its revisit condition, so that a later reader can tell a deliberate boundary from an accident of who happened to be edited first.

## Context

`ki-agent-coordination-paperclip` is `ki-applicability: declaration-only`: no repository shape implies it and nothing discovers it, so the declaring set is entirely a judgment. Until 2026-09-26 that set was empty, which made the judgment invisible. On that date, under coordination task `KNO-19`, two repositories declared it — `ki-agentic-harness` and `ki-techne-harness` — and the reasoning for choosing those two, and for excluding the rest, exists only in a coordination-plane document that is deleted when the task is pruned.

The skill governs an _arrangement_ between Knowledge Islands and a coordination plane. There is one such arrangement across the archipelago, not one per repository, so the declaration is not a description of a repository's contents. That is what makes the scope question real: nothing in a repository's shape answers it.

The reasoning as it currently stands:

- `ki-agentic-harness` declares it because it owns `ki-subagents` and, under the rule that a role is a repository record before it is an agent, holds the role records that every coordination agent is a projection of. `KI-HARNESS-GOV-101` places four of those under `subagents/coordination/`. This is where the _agent role_ identity physically lives.
- `ki-techne-harness` declares it because it holds `TECHNE-TOOLS-CTRL-001`, the unresolved form of the task-to-work linkage contract, and owns the controller and execution fabric where the _workspace_ and _worker_ identities are physically realised.
- `tools-ki` is excluded because it implements the roadmap front matter in `src/core/work/items.ts` and is therefore the _subject_ of a future field change, not the owner of the arrangement.
- `ki-techne-principal` is excluded because it holds remote-agent working style as knowledge base material. Knowledge about an arrangement is not the arrangement.
- `ki-arcadia-principal` is excluded for now, and becomes a candidate if a decision record fixing the coordination rules lands there.
- The remaining registered repositories are excluded because they are subject to the doctrine through the agents that act on them, not owners of the arrangement.

The alternative considered and rejected was declaring it in all registered repositories. That produces one empty table per repository with no per-repository content, and a grandfathered exception the first time any one of them cannot satisfy a criterion. An exception granted at adoption never expires, so a clean start with a small scope was preferred.

## Boundary

In scope: the rule for who declares this skill, the reasoning behind the current two, the named exclusions, the revisit condition, and where that reasoning is durably recorded.

Out of scope, deliberately:

- reversing the two declarations already made, which were approved on `KNO-19` and stand until this item proposes otherwise;
- declaring the skill in any further repository, which needs its own approval on its own record;
- what the audit actually checks once declared, which is [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md);
- the content of the coordination rules and the standard, which this item takes as given;
- any change to `ki-applicability` or to the declaration mechanism itself, which is a `ki-skills` contract.

## Discussion

### The revisit condition

The first repository that holds its own distinct coordination arrangement — rather than participating in the single archipelago-wide one — is the trigger to reopen this. At that point the declaration starts describing something repository-local, and the two-repository rule stops being a proxy for "the repositories that own the arrangement's identity anchors".

A second, weaker trigger: if a criterion ever acquires a mechanical form that reads repository-local evidence, the cost of declaring more widely falls and the argument for restraint weakens with it.

### Whether this needs a decision record

Open. The case for one is that the declaring set is an authority boundary, it spans repositories, and it will be cited by later arguments about where coordination doctrine applies. The case against is that it is a placement judgment inside an existing standard that deliberately leaves placement open, and that the reasoning fits in a work item with a revisit condition — which is how `KI-HARNESS-GOV-101` handled a structurally similar choice.

The question is entangled with a larger one that has no record yet: the coordination rules themselves are accepted on a coordination task and written into no repository. If that decision record is created, this scope rule is a natural section of it rather than a record of its own. Settle the larger question first.

### Why the declaration is not free

An empty table is not a null act. It selects the repository into every future criterion this skill gains, including ones written after the declaring decision was made and by someone who never considered that repository. A repository that declares a skill it cannot satisfy produces either a standing failure or a permanent exception, and the exception is the more likely outcome. The restraint here is about what the set will cost when `KI-HARNESS-GOV-107` succeeds, not about what it costs today when the audit checks nothing.

### Governing coordination task

Captured from the `KNO-19` proposal document on the external coordination plane, which names this discovery as `D2` and whose section 3 is the scope argument summarised above. That task owns the two declarations; this record owns the rule they were made under.
