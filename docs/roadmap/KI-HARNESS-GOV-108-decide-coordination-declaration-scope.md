---
id: KI-HARNESS-GOV-108
area: GOV
title: Decide coordination declaration scope
theme: governance-consistency
horizon: now
status: draft
blocks: [KI-HARNESS-GOV-107]
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T15:14:21Z
updated_at: 2026-10-05T08:19:22Z
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

In scope: the rule for who declares this skill, the reasoning behind the current two, the named exclusions, the revisit condition, and where that reasoning is durably recorded.

Out of scope, deliberately:

- reversing the two declarations already made, which were approved on `KNO-19` and stand until this item proposes otherwise;
- declaring the skill in any further repository, which needs its own approval on its own record;
- what the audit actually checks once declared, which is [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md);
- the content of the coordination rules and the standard, which this item takes as given;
- any change to `ki-applicability` or to the declaration mechanism itself, which is a `ki-skills` contract.

## Current state

The premise of this record no longer holds. Read-only inspection of local `.ki.toml` files on 2026-10-05 found `[skills.ki-agent-coordination-paperclip]` declared in 43 repositories across seven organisation codes: 23 `KIS` repositories (every registered `knowledgeislands` repository with a `.ki.toml`, including `tools-ki`, `ki-techne-principal` and `ki-arcadia-principal`, which this record names as exclusions), plus `HNR`, `ER`, `KIT`, `LGL`, `TMX` and `VA` repositories. The `KIS` declarations landed as `chore: baseline` commits on 2026-09-27, alongside `7d7b247d` ("resolve kinds and shape-driven Paperclip bootstrap") and `00de1d36` (required `organisation_code`, criterion `ORG-1`).

The standard has already moved with them. `standards-agent-coordination-paperclip.md#organisation-identity` says "Every repository using this skill declares its owning Paperclip company code in its own `.ki.toml`", and bootstrap admits a repository to its company through that declaration. The declaration now means "this repository is admitted to a Paperclip company", not "this repository owns the arrangement".

## Steps

- [ ] Obtain the owner's answer to the question in `## Discussion` before any further step; the record stays `draft` until then.
- [ ] Under the recommended option 1, add a `### Declaration scope` subsection under `## Organisation identity` in `standards-agent-coordination-paperclip.md` stating that every repository coordinated through a Paperclip company declares the skill, that the harness and Arcadia own the doctrine, and the condition that reopens the question.
- [ ] Under option 2 instead, record the two-repository rule and its revisit condition in the same subsection, amend the "every repository using this skill" sentence, and raise trades to the 41 other declaring repositories to remove their declarations; no declaration outside this repository is changed by this record.
- [ ] Run the verification below and record the results in `## Discussion`.

## Files touched

Expected, under either answer: `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md` only.

## Verify

1. The standard states who declares the skill, why, and the condition that reopens the question.
2. No `.ki.toml` outside this repository is edited by this record.
3. The commands below pass.

```bash
ki repo audit --skill ki-agent-coordination-paperclip --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

Blocks [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md), whose mechanical items run in every declaring repository. Nothing blocks this record.

## Documentation impact

### Decision Records

None. The 2026-10-05 decision places the rule in the coordination standard itself, with no separate decision record.

### Specifications

None. `docs/specs/` does not describe coordination declarations.

### Guides

None.

### Roadmap

Blocks [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md). Under option 2 the declaration removals are trades to the other declaring repositories, raised as follow-ons and outside this record's acceptance.

## Discussion

### The revisit condition

The first repository that holds its own distinct coordination arrangement - rather than participating in the single archipelago-wide one - is the trigger to reopen this. At that point the declaration starts describing something repository-local, and the two-repository rule stops being a proxy for "the repositories that own the arrangement's identity anchors".

A second, weaker trigger: if a criterion ever acquires a mechanical form that reads repository-local evidence, the cost of declaring more widely falls and the argument for restraint weakens with it.

### Whether this needs a decision record

Open. The case for one is that the declaring set is an authority boundary, it spans repositories, and it will be cited by later arguments about where coordination doctrine applies. The case against is that it is a placement judgment inside an existing standard that deliberately leaves placement open, and that the reasoning fits in a work item with a revisit condition - which is how the accepted coordination-lane delivery handled a structurally similar choice.

The question is entangled with a larger one that has no record yet: the coordination rules themselves are accepted on a coordination task and written into no repository. If that decision record is created, this scope rule is a natural section of it rather than a record of its own. Settle the larger question first.

### Why the declaration is not free

An empty table is not a null act. It selects the repository into every future criterion this skill gains, including ones written after the declaring decision was made and by someone who never considered that repository. A repository that declares a skill it cannot satisfy produces either a standing failure or a permanent exception, and the exception is the more likely outcome. The restraint here is about what the set will cost when `KI-HARNESS-GOV-107` succeeds, not about what it costs today when the audit checks nothing.

### Governing coordination task

Captured from the `KNO-19` proposal document on the external coordination plane, which names this discovery as `D2` and whose section 3 is the scope argument summarised above. That task owns the two declarations; this record owns the rule they were made under.

### Question for Kris - 2026-10-05

The decision to record the two-repository rule cannot be applied as written: 43 repositories now declare the skill, and the standard already requires every repository admitted to a Paperclip company to declare its `organisation_code`. Which rule should the standard record?

1. **Recommended: record the rule that is live.** Every repository admitted to a Paperclip company declares the skill with its owning `organisation_code`; the declaration is admission, not ownership of the arrangement. Record separately that the arrangement's doctrine is owned by `ki-agentic-harness` (role records and this skill) and `ki-techne-harness` (execution fabric). Revisit condition: the first criterion that can fail in a declaring repository with no coordinated work, which [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md) answers by reporting such repositories as not applicable. No decision record, as decided.
2. **Restore the two-repository rule.** Remove the declaration from 41 repositories and move organisation binding elsewhere. This reverses the bootstrap design in `7d7b247d` and `ORG-1`, touches every repository, and needs its own record in each.

Until answered this record stays `draft`; [KI-HARNESS-GOV-107](KI-HARNESS-GOV-107-make-coordination-audit-mechanical.md) is Ready but blocked by it.

### Decision

Record the two-repository rule and its revisit condition in the coordination standard itself, with no separate decision record. Held pending the owner question above, because the rule contradicts 43 live declarations and the standard's own organisation-identity section; the record stays `draft` until it is answered. Decided by the Fable reviewer under delegated autonomy, reversible.
