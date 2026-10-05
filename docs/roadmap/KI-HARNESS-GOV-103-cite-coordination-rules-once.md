---
id: KI-HARNESS-GOV-103
area: GOV
title: Cite coordination rules once
theme: governance-consistency
horizon: now
status: draft
blocks: []
blocked_by: [KI-HARNESS-GOV-102]
baseline_ref: null
task_links:
  paperclip:
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: 3dbfe169-6f44-4706-941c-5517253a5aef
      key: KIS-21
      url: http://127.0.0.1:3100/KIS/issues/KIS-21
      relation: evaluation
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: abdf6827-ee50-474f-91e7-7421da53c64a
      key: KIS-24
      url: http://127.0.0.1:3100/KIS/issues/KIS-24
      relation: related
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: 9015b82f-c285-4c1c-a257-c748cd5e9ea3
      key: KIS-1
      url: http://127.0.0.1:3100/KIS/issues/KIS-1
      relation: related
    - authority: http://127.0.0.1:3100
      scope: 558dd49e-7615-409f-b7b2-7f19e22171d9
      id: b76a4ec9-be48-4a3c-8568-7885b5e6789b
      key: KIS-5
      url: http://127.0.0.1:3100/KIS/issues/KIS-5
      relation: related
created_at: 2026-09-26T14:34:49Z
updated_at: 2026-10-05T08:41:49Z
---

# KI-HARNESS-GOV-103: Cite coordination rules once

## Goal

Each rule governing Knowledge Islands coordination through Paperclip is citable from exactly one governed location, so that a coordination-plane agent configuration can carry a citation instead of a copy of the rule text.

## Context

Seven rules governing the Knowledge Islands-Paperclip boundary were accepted by the responsible human on 2026-09-26 on coordination task `KNO-1`. They are not in this repository as a set. Three of the four coordination-plane agent configurations restate them inline; the fourth does not.

The three copies have already diverged, one day after they were written. Rule 1 appears as "A Paperclip task never accepts KI work" in one configuration, with "`done` on a task means the coordinated execution ended, not that the work was accepted" appended in a second, and "acceptance stays with human review and `ki-accept`" in a third. Rule 5 is one clause in one copy and three in another. Rule 6 is a bare sentence in one and carries a projection clause in the others. No copy is marked as derived from another and none names a revision, so there is no way to tell which is current and no check that would notice the next divergence. This is the **inert doctrine** and **two-way link** failure at once: the rule text is the authority, and nothing is watching it.

The accepted coordination-lane delivery declined to add a fourth, fifth, sixth and seventh copy into the role records for exactly this reason - "they have no decision record yet, and inlining them would create four more unversioned copies of doctrine" - and recorded the removal of the existing copies as a follow-on.

Checked at `3f409aac`, six of the seven rules already have a citable home in this repository, so the follow-on is smaller than it looked:

| Rule | Home |
| ---- | ---- |
| 1 - Repositories decide; Paperclip coordinates | `COORD-1` → `standards-agent-coordination-paperclip.md#position-and-authority`, `#knowledge-boundary` |
| 2 - Every task names its governing work, and every item names its tasks | `COORD-3` → `#task-to-work-relationship`; item side now `ki-work-roadmap` `standards-work-item-format.md#task-links`, delivered by `KI-HARNESS-GOV-116` |
| 3 - Discovered work goes to KI Triage | `ki-next` → `standards-next-work.md`, "Capture substantive prospective work" |
| 4 - One writer per checkout | `COORD-4` → `#workspace-model` |
| 5 - Two entry paths, one set of checks | `COORD-5` → `#interaction-and-skill-composition` |
| 6 - A role is a repository record before it is an agent | `ADR-KI-HARNESS-AGENTS-002` and `standards-portable-subagents.md#record-and-projections`, once `KI-HARNESS-GOV-102` lands |
| 7 - All delivery happens under a roadmap item | `ki-work-roadmap` `standards-repository-roadmaps.md#work-item-discipline`, after this record adds the sentence |

So the work is to confirm each citation, close the two gaps, and only then remove the copies. The table above is the state at `3f409aac` with the 2026-10-05 decisions applied; the rule-2 item side and the `TECHNE-TOOLS-CTRL-001` covering-task field are both done, so rule 2 needs only confirmation.

## Boundary

Decided 2026-10-05 under delegated owner authority: rule 7 cites `ki-work-roadmap`; the other six citations are confirmed against the current tree; then the copies are removed.

In scope:

- one rule-citation table in the coordination standard, the single governed location an agent configuration cites, with one row per rule pointing at its normative home;
- one sentence in `ki-work-roadmap` that makes rule 7 normative: delivery that changes a repository happens under a governing work item, or under explicit direct authority as the coordination standard already allows;
- one sentence in the coordination standard saying that agent configuration and role records cite these rules rather than restating them;
- removing the restated rule 4 sentence from `subagents/coordination/ki-wright.md` in favour of a citation;
- removing the rule copies from the three local Paperclip agent instruction files that carry them, replacing each with a citation of the new table, through Paperclip's supported managed-instruction route on the local instance.

Out of scope: authoring a decision record for the seven rules, since every rule has a home; deciding what a role record physically is, which is [KI-HARNESS-GOV-102](KI-HARNESS-GOV-102-decide-role-record-serialization.md); any mechanical check that a copy has reappeared, which this record notes but does not build; declaring the skill anywhere; and any remote or non-local Paperclip operation, which the Techne programme hold excludes.

## Current state

- Six rules have a home in the tree today: rules 1, 4 and 5 in `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md` at `#position-and-authority`, `#knowledge-boundary`, `#workspace-model` and `#interaction-and-skill-composition`; rule 2 at `#task-to-work-relationship` together with `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md#task-links`; rule 3 at `skills/change-management/ki-next/references/standards-next-work.md#capture-substantive-prospective-work`; rule 6 at `ADR-KI-HARNESS-AGENTS-002`, which [KI-HARNESS-GOV-102](KI-HARNESS-GOV-102-decide-role-record-serialization.md) amends.
- Rule 7 has no normative sentence. `standards-repository-roadmaps.md` `## Work-item discipline` describes items and task links but never requires delivery to happen under one; the coordination standard's `#delivery-ownership-and-local-integration` already names "governing work or explicit direct authority" as the two admissible bases.
- The coordination standard has no citation table and no statement that configuration cites rather than restates.
- Read-only inspection on 2026-10-05 of the local Paperclip instance directory found the rule text in three managed agent instruction files (agents `61d06d85`, `48c0ddf2` and `9bd94a34`, each `instructions/AGENTS.md` under `# Where the work lives`) and none in the Convenor's (`4b312799`). No service call was made.
- `subagents/coordination/ki-wright.md` `## Orchestration` restates rule 4 verbatim ("One writer per checkout. ..."), contrary to this record's earlier claim that the role records carry no rule text.

## Steps

- [ ] Confirm each of the six existing homes still states its rule at the cited anchor on the admitted baseline; record any drift in `## Discussion` and stop if a home no longer carries its rule.
- [ ] Add the rule 7 sentence to `## Work-item discipline` in `standards-repository-roadmaps.md`, deferring the direct-authority exception to the coordination standard rather than restating it.
- [ ] Add a `### Coordination rules` subsection under `## Position and authority` in the coordination standard: a seven-row table of rule name and citation, plus one sentence that agent configuration and role records cite a row rather than restating it. Add it to `## Contents`.
- [ ] Replace the rule 4 restatement in `subagents/coordination/ki-wright.md` with a one-line citation of `#workspace-model`, keeping the role's own instruction about Triage capture intact.
- [ ] Regenerate any generated rubric whose cited sources moved, and run the verification below.
- [ ] Under a Paperclip coordination task linked from this record's `task_links`, replace the rule text in the three instruction files with a citation of the new subsection at the admitted revision, using Paperclip's supported managed-instruction update on the local instance. Record before and after digests of each file in `## Discussion`.

## Files touched

- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `subagents/coordination/ki-wright.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md` and `skills/change-management/ki-work-roadmap/references/rubric.md` (generated, only if a cited source anchor changes)
- Outside the repository, through Paperclip only: the three agents' managed `instructions/AGENTS.md`

## Verify

1. The coordination standard has one `### Coordination rules` table with seven rows, each naming a resolvable anchor or decision record; every link resolves under `ki repo audit --skill ki-authoring`.
2. `standards-repository-roadmaps.md#work-item-discipline` states rule 7 normatively and does not contradict the direct-authority basis in the coordination standard.
3. `grep -rn -i -E "repositories decide|one writer per checkout|two entry paths|all delivery happens under" skills subagents` returns only the citation table, not restated rule text.
4. A read-only grep of the three instruction files after the Paperclip update returns citations of the table and none of the rule sentences, with the before and after digests recorded in `## Discussion`. This managed agent instruction file update is evidence recorded in Discussion, not a gate on this repository's `done`.
5. The commands below pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-agent-coordination-paperclip --progress never
ki repo audit --skill ki-work-roadmap --progress never
ki repo audit --skill ki-subagents --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

Blocked by [KI-HARNESS-GOV-102](KI-HARNESS-GOV-102-decide-role-record-serialization.md): rule 6's row cites the anchor that record creates. `KI-HARNESS-GOV-116` and `TECHNE-TOOLS-CTRL-001` were prerequisites for rule 2 and are done.

Sequencing: this record, [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) and [KI-HARNESS-GOV-095](KI-HARNESS-GOV-095-align-roadmap-diagnostics.md) all edit `ki-work-roadmap` `references/standards-repository-roadmaps.md`. The anchors differ; whichever lands second rebases.

Plan complete; ready once [KI-HARNESS-GOV-102](KI-HARNESS-GOV-102-decide-role-record-serialization.md) is done.

## Documentation impact

### Decision Records

None. Every rule already has a normative home; this record only cites them.

### Specifications

None. `docs/specs/` does not restate the coordination rules; the coordination and roadmap standards change as skill references, covered by the steps above.

### Guides

None. No guide restates the rules.

### Roadmap

Depends on [KI-HARNESS-GOV-102](KI-HARNESS-GOV-102-decide-role-record-serialization.md) for the rule 6 citation target. Removing the copies from the local Paperclip agent instruction files is a coordination-plane action on the local instance under the Techne Programme Hold's local allowance, evidenced in this record, not a handoff to another repository.

## Task associations

Verified on 2026-09-27 against the local Paperclip instance at `http://127.0.0.1:3100`, company `558dd49e-7615-409f-b7b2-7f19e22171d9`. Each UUID is the stable task identity; KNO keys below remain historical citations, not separate tasks.

- [KIS-21](http://127.0.0.1:3100/KIS/issues/KIS-21), `3dbfe169-6f44-4706-941c-5517253a5aef`: evaluation and capture of this record.
- [KIS-24](http://127.0.0.1:3100/KIS/issues/KIS-24), `abdf6827-ee50-474f-91e7-7421da53c64a`: related duplicate-capture reconciliation.
- [KIS-1](http://127.0.0.1:3100/KIS/issues/KIS-1), `9015b82f-c285-4c1c-a257-c748cd5e9ea3`: related rule-origin evidence, historically cited as KNO-1; not this item's delivery task.
- [KIS-5 plan](http://127.0.0.1:3100/KIS/issues/KIS-5#document-plan), `b76a4ec9-be48-4a3c-8568-7885b5e6789b`: related per-item task-link work. Its replacement proposal separates harness contract ownership from tools-ki implementation; it does not resume or transfer the held Techné record cited below.

This is an association-only recovery check, not a complete task/worktree census or an availability grant. No active implementation claim was verified, but none was released either. Before direct or coordinated implementation, reconcile retained work and ownership and obtain the normal selection/readiness authority. Keep these references on this item; migrate them to the provider-neutral map only after KIS-5's contract and parser are available.

## Discussion

### Pickup checkpoint - 2026-09-27

- Verified partial delivery: `a98cce65` implemented the item-side association contract. [Task links](../../skills/change-management/ki-work-roadmap/references/standards-work-item-format.md#task-links) and [task-to-work reconciliation](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#task-to-work-relationship) now supply the formerly missing item-side part of rule 2. Receiving-repository commit `c0857d5652060d644fecc7c2f20a308f59feec7c` in `knowledgeislands/tools-ki` implements `src/core/work/items.ts::parseTaskLinks`; its CLI-088 review packet remains awaiting review. That committed snapshot, not unrelated receiving-checkout edits, is the evidence used here.
- Remaining: complete the seven-rule citation reconciliation, resolve the rule-6 serialization question with GOV-102, and establish rule 7’s actual authority without overriding the current explicit-direct-instruction path. No live agent configuration or removal of duplicated rule text was verified. This item still does not own edits to Paperclip agent configurations.
- Closure route: revisit the Triage scope against delivered GOV-116 before human-approved adoption or an applicable disposition. Do not recreate the task-link schema or treat historical task associations as active ownership.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

The temptation is to treat this as a tidy-up: delete seven paragraphs from three files. It is not, because the copies are currently the only place three of the rules are written down in the form the agents act on, and two rules have no complete home to be sent to.

Rule 2 is the sharp one. `COORD-3` requires each task to identify at most one governing work item, which is the task half. The other half - every governing item naming its covering tasks - has no home because it has no field: roadmap front matter is a closed allow-list checked at parse time in `tools-ki` at `src/core/work/items.ts`, and no covering-task field is in it. Until one is, the item side of rule 2 is prose in a `## Current state` section, which is what the accepted coordination-lane delivery does and says it is doing. That field is owned by `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness`. The honest outcome is a citation to `COORD-3` for the task side and a named, owned gap for the item side, not a citation that quietly overstates its coverage.

Rule 7 is the other gap and is probably cheap: "all delivery happens under a roadmap item" is close to what `ki-work-roadmap` already governs, and `ADR-KI-HARNESS-SKILLS-011` decided that non-KB repositories carry roadmaps. Whether either states the rule as a requirement on delivery, rather than as a description of where work items live, has to be read before it is claimed.

Rule 6's citation target is what `KI-HARNESS-GOV-102` decides. `ADR-KI-HARNESS-AGENTS-002` already makes `ki-subagents` the portable parent owning identity, purpose, instructions, lane, grounding, hand-offs and outcome evidence, with runtime adapters owning native representation and same-identity definitions treated as corresponding projections rather than copies. That is enough to cite the rule. It is not enough to act on it, because the same decision states that `ki-subagents` owns no runtime serialization, so "the record" currently resolves to a Claude file. A citation is still honest here; it just points at something less solid than it sounds, and that should be said rather than smoothed over.

There is an order that keeps every step verifiable: confirm the four solid citations first, close rule 7, record rule 2's gap with its owner, and leave rule 6 until `KI-HARNESS-GOV-102` lands. That yields a partial removal that is safe and a remainder that is named, rather than one removal that waits on everything.

What would fail if this were violated? Today, nothing - which is the point. Nothing reads the agent configurations, nothing compares them to the standard, and `.ki.toml` does not declare `[skills.ki-agent-coordination-paperclip]`, so `ki repo audit --skill ki-agent-coordination-paperclip` has no target in any repository. Shaping this item should decide whether the outcome includes a check that would notice a rule copy reappearing, because without one this work is reversible by anyone who finds it convenient to paste the rules back in.

- The accepted coordination-lane delivery recorded this as a follow-on and declined to add four more copies.
- `KI-HARNESS-GOV-102` owns what a role record physically is, which rule 6's citation depends on.
- `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` owns the covering-task front-matter field that rule 2's item side needs.

### Decision

Rule 7 cites `ki-work-roadmap`; confirm the other six citations, then remove the copies, now that `KI-HARNESS-GOV-116` and `TECHNE-TOOLS-CTRL-001` are done. Decided by the Fable reviewer under delegated autonomy, reversible.
