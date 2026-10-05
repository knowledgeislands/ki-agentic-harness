---
id: KI-HARNESS-GOV-108
area: GOV
title: Decide coordination declaration scope
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T15:14:21Z
updated_at: 2026-10-05T08:41:49Z
---

# KI-HARNESS-GOV-108: Decide coordination declaration scope

## Goal

Which repositories declare `[skills.ki-agent-coordination-paperclip]` is a recorded decision with its reasoning, its named exclusions and its revisit condition, so that a later reader can tell a deliberate boundary from an accident of who happened to be edited first.

## Context

`ki-agent-coordination-paperclip` is `ki-applicability: declaration-only`: no repository shape implies it and nothing discovers it, so the declaring set is entirely a judgment. Until 2026-09-26 that set was empty, which made the judgment invisible. On that date, under coordination task `KNO-19`, two repositories declared it - `ki-agentic-harness` and `ki-techne-harness` - and the reasoning for choosing those two, and for excluding the rest, exists only in a coordination-plane document that is deleted when the task is pruned.

The skill governs an _arrangement_ between Knowledge Islands and a coordination plane. There is one such arrangement across the archipelago, not one per repository, so the declaration is not a description of a repository's contents. That is what makes the scope question real: nothing in a repository's shape answers it.

The reasoning as it currently stands:

- `ki-agentic-harness` declares it because it owns `ki-subagents` and, under the rule that a role is a repository record before it is an agent, holds the role records that every coordination agent is a projection of. The accepted coordination-lane delivery places four of those under `subagents/coordination/`. This is where the _agent role_ identity physically lives.
- `ki-techne-harness` declares it because it holds `TECHNE-TOOLS-CTRL-001`, the unresolved form of the task-to-work linkage contract, and owns the controller and execution fabric where the _workspace_ and _worker_ identities are physically realised.
- `tools-ki` is excluded because it implements the roadmap front matter in `src/core/work/items.ts` and is therefore the _subject_ of a future field change, not the owner of the arrangement.
- `ki-techne-principal` is excluded because it holds remote-agent working style as knowledge base material. Knowledge about an arrangement is not the arrangement.
- `ki-arcadia-principal` is excluded for now, and becomes a candidate if a decision record fixing the coordination rules lands there.
- The remaining registered repositories are excluded because they are subject to the doctrine through the agents that act on them, not owners of the arrangement.

The alternative considered and rejected was declaring it in all registered repositories. That produces one empty table per repository with no per-repository content, and a grandfathered exception the first time any one of them cannot satisfy a criterion. An exception granted at adoption never expires, so a clean start with a small scope was preferred.

## Boundary

In scope: the live rule for who declares this skill (every repository admitted to a Paperclip company), what the declaration means, where the skill, role records and execution fabric live, the revisit condition, and recording that rule in the coordination standard.

Out of scope, deliberately:

- adding or removing a declaration in any repository, which each repository does on its own record;
- any new cross-repository authority allocation;
- what the audit actually checks once declared, which is [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md);
- the content of the coordination rules and the standard, which this item takes as given;
- any change to `ki-applicability` or to the declaration mechanism itself, which is a `ki-skills` contract.

## Current state

The premise of this record no longer holds. Read-only inspection of local `.ki.toml` files on 2026-10-05 found `[skills.ki-agent-coordination-paperclip]` declared in 43 repositories across seven organisation codes: 23 `KIS` repositories (every registered `knowledgeislands` repository with a `.ki.toml`, including `tools-ki`, `ki-techne-principal` and `ki-arcadia-principal`, which this record names as exclusions), plus `HNR`, `ER`, `KIT`, `LGL`, `TMX` and `VA` repositories. The `KIS` declarations landed as `chore: baseline` commits on 2026-09-27, alongside `7d7b247d` ("resolve kinds and shape-driven Paperclip bootstrap") and `00de1d36` (required `organisation_code`, criterion `ORG-1`).

The standard has already moved with them. `standards-agent-coordination-paperclip.md#organisation-identity` says "Every repository using this skill declares its owning Paperclip company code in its own `.ki.toml`", and bootstrap admits a repository to its company through that declaration. The declaration now means "this repository is admitted to a Paperclip company", not "this repository owns the arrangement". The Decision below records that live rule; nothing awaits the owner.

## Steps

- [ ] Add a `### Declaration scope` subsection under `## Organisation identity` in `standards-agent-coordination-paperclip.md` stating that every repository admitted to a Paperclip company declares the skill with its owning `organisation_code`; that the declaration means admission, not ownership of the arrangement; that the skill and role records live in `ki-agentic-harness` and the execution fabric in `ki-techne-harness`, as a description of where they live rather than an authority allocation; and the revisit condition from the Decision.
- [ ] Run the verification below and record the results in `## Discussion`.

## Files touched

`skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md` only.

## Verify

1. The standard states who declares the skill, why, and the condition that reopens the question.
2. No `.ki.toml` outside this repository is edited by this record.
3. The commands below pass.

```bash
ki repo audit --skill ki-agent-coordination-paperclip --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

Nothing blocks this record and it blocks nothing. Sequencing preference: land before [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md), whose mechanical items run in every declaring repository; that record is correct under either scope. Blocker removed as ordering only; decided by the Fable reviewer under delegated autonomy, reversible.

## Documentation impact

### Decision Records

None. The 2026-10-05 decision places the rule in the coordination standard itself, with no separate decision record.

### Specifications

None. `docs/specs/` does not describe coordination declarations.

### Guides

None.

### Roadmap

None. [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md) is sequenced after this record by preference only.

## Discussion

### The revisit condition

This was the revisit condition for the original two-repository rule; the Decision below replaces it.

The first repository that holds its own distinct coordination arrangement - rather than participating in the single archipelago-wide one - is the trigger to reopen this. At that point the declaration starts describing something repository-local, and the two-repository rule stops being a proxy for "the repositories that own the arrangement's identity anchors".

A second, weaker trigger: if a criterion ever acquires a mechanical form that reads repository-local evidence, the cost of declaring more widely falls and the argument for restraint weakens with it.

### Whether this needs a decision record

Open. The case for one is that the declaring set is an authority boundary, it spans repositories, and it will be cited by later arguments about where coordination doctrine applies. The case against is that it is a placement judgment inside an existing standard that deliberately leaves placement open, and that the reasoning fits in a work item with a revisit condition - which is how the accepted coordination-lane delivery handled a structurally similar choice.

The question is entangled with a larger one that has no record yet: the coordination rules themselves are accepted on a coordination task and written into no repository. If that decision record is created, this scope rule is a natural section of it rather than a record of its own. Settle the larger question first.

### Why the declaration is not free

An empty table is not a null act. It selects the repository into every future criterion this skill gains, including ones written after the declaring decision was made and by someone who never considered that repository. A repository that declares a skill it cannot satisfy produces either a standing failure or a permanent exception, and the exception is the more likely outcome. The restraint here is about what the set will cost when `KI-HARNESS-GOV-107` succeeds, not about what it costs today when the audit checks nothing.

### Governing coordination task

Captured from the `KNO-19` proposal document on the external coordination plane, which names this discovery as `D2` and whose section 3 is the scope argument summarised above. That task owns the two declarations; this record owns the rule they were made under.

### Decision

Record the live rule: every repository admitted to a Paperclip company declares the skill with its owning `organisation_code`; the declaration means admission, not ownership of the arrangement. The skill and role records live in `ki-agentic-harness` and the execution fabric in `ki-techne-harness` (a description of where they live, not a new cross-repository authority allocation). Revisit condition as written: the first criterion that can fail in a declaring repository with no coordinated work, which [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md) answers by reporting such repositories as not applicable. No decision record. Decided by the Fable reviewer under delegated autonomy, reversible; restoring a two-repository rule would be an owner decision.
