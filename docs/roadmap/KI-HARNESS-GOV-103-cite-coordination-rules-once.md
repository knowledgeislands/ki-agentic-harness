---
id: KI-HARNESS-GOV-103
area: GOV
title: Cite coordination rules once
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T14:34:49Z
updated_at: 2026-09-26T18:20:00Z
---

# KI-HARNESS-GOV-103: Cite coordination rules once

## Goal

Each rule governing Knowledge Islands coordination through Paperclip is citable from exactly one governed location, so that a coordination-plane agent configuration can carry a citation instead of a copy of the rule text.

## Context

Seven rules governing the Knowledge Islands–Paperclip boundary were accepted by the responsible human on 2026-09-26 on coordination task `KNO-1`. They are not in this repository as a set. Three of the four coordination-plane agent configurations restate them inline; the fourth does not.

The three copies have already diverged, one day after they were written. Rule 1 appears as "A Paperclip task never accepts KI work" in one configuration, with "`done` on a task means the coordinated execution ended, not that the work was accepted" appended in a second, and "acceptance stays with human review and `ki-accept`" in a third. Rule 5 is one clause in one copy and three in another. Rule 6 is a bare sentence in one and carries a projection clause in the others. No copy is marked as derived from another and none names a revision, so there is no way to tell which is current and no check that would notice the next divergence. This is the **inert doctrine** and **two-way link** failure at once: the rule text is the authority, and nothing is watching it.

the accepted coordination-lane delivery declined to add a fourth, fifth, sixth and seventh copy into the role records for exactly this reason — "they have no decision record yet, and inlining them would create four more unversioned copies of doctrine" — and recorded the removal of the existing copies as a follow-on.

Checked at `3f409aac`, six of the seven rules already have a citable home in this repository, so the follow-on is smaller than it looked:

| Rule | Home |
| ---- | ---- |
| 1 — Repositories decide; Paperclip coordinates | `COORD-1` → `standards-agent-coordination-paperclip.md#position-and-authority`, `#knowledge-boundary` |
| 2 — Every task names its governing work, and every item names its tasks | `COORD-3` → `#task-to-work-relationship`, **task side only** |
| 3 — Discovered work goes to KI Triage | `ki-next` → `standards-next-work.md`, "Capture substantive prospective work" |
| 4 — One writer per checkout | `COORD-4` → `#workspace-model` |
| 5 — Two entry paths, one set of checks | `COORD-5` → `#interaction-and-skill-composition` |
| 6 — A role is a repository record before it is an agent | `ADR-KI-HARNESS-AGENTS-002`, pending `KI-HARNESS-GOV-102` |
| 7 — All delivery happens under a roadmap item | no confirmed home; candidates are `ki-work-roadmap` and `ADR-KI-HARNESS-SKILLS-011` |

So the work is to confirm each citation, close the two gaps, and only then remove the copies.

## Boundary

In scope: confirming the citation for each rule against the standard as written rather than as remembered; establishing a home for rule 7; recording what part of rule 2 is unhomed and who owns it; and stating in the coordination standard that an agent configuration cites these rules rather than restating them, so that the removal has something to point at.

Out of scope, and this is the load-bearing exclusion: **editing the agent configurations themselves.** They are Paperclip agent instruction files in a Paperclip instance directory, outside every repository in the archipelago. A roadmap item here cannot own an edit to a file no repository contains. This item makes the citation exist; removing each copy is a coordination-plane action taken against it and belongs to a task, not to this record.

Also out of scope: authoring a new decision record for the seven rules, which the citation table above shows is not needed; deciding what a role record physically is, which is `KI-HARNESS-GOV-102`; declaring `[skills.ki-agent-coordination-paperclip]` in any `.ki.toml`, which is separate activation work; and the four role records delivered under the accepted coordination-lane delivery, which correctly carry no rule text.

## Discussion

The temptation is to treat this as a tidy-up: delete seven paragraphs from three files. It is not, because the copies are currently the only place three of the rules are written down in the form the agents act on, and two rules have no complete home to be sent to.

Rule 2 is the sharp one. `COORD-3` requires each task to identify at most one governing work item, which is the task half. The other half — every governing item naming its covering tasks — has no home because it has no field: roadmap front matter is a closed allow-list checked at parse time in `tools-ki` at `src/core/work/items.ts`, and no covering-task field is in it. Until one is, the item side of rule 2 is prose in a `## Current state` section, which is what the accepted coordination-lane delivery does and says it is doing. That field is owned by `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness`. The honest outcome is a citation to `COORD-3` for the task side and a named, owned gap for the item side, not a citation that quietly overstates its coverage.

Rule 7 is the other gap and is probably cheap: "all delivery happens under a roadmap item" is close to what `ki-work-roadmap` already governs, and `ADR-KI-HARNESS-SKILLS-011` decided that non-KB repositories carry roadmaps. Whether either states the rule as a requirement on delivery, rather than as a description of where work items live, has to be read before it is claimed.

Rule 6's citation target is what `KI-HARNESS-GOV-102` decides. `ADR-KI-HARNESS-AGENTS-002` already makes `ki-subagents` the portable parent owning identity, purpose, instructions, lane, grounding, hand-offs and outcome evidence, with runtime adapters owning native representation and same-identity definitions treated as corresponding projections rather than copies. That is enough to cite the rule. It is not enough to act on it, because the same decision states that `ki-subagents` owns no runtime serialization, so "the record" currently resolves to a Claude file. A citation is still honest here; it just points at something less solid than it sounds, and that should be said rather than smoothed over.

There is an order that keeps every step verifiable: confirm the four solid citations first, close rule 7, record rule 2's gap with its owner, and leave rule 6 until `KI-HARNESS-GOV-102` lands. That yields a partial removal that is safe and a remainder that is named, rather than one removal that waits on everything.

What would fail if this were violated? Today, nothing — which is the point. Nothing reads the agent configurations, nothing compares them to the standard, and `.ki.toml` does not declare `[skills.ki-agent-coordination-paperclip]`, so `ki repo audit --skill ki-agent-coordination-paperclip` has no target in any repository. Shaping this item should decide whether the outcome includes a check that would notice a rule copy reappearing, because without one this work is reversible by anyone who finds it convenient to paste the rules back in.

- the accepted coordination-lane delivery recorded this as a follow-on and declined to add four more copies.
- `KI-HARNESS-GOV-102` owns what a role record physically is, which rule 6's citation depends on.
- `TECHNE-TOOLS-CTRL-001` in `ki-techne-harness` owns the covering-task front-matter field that rule 2's item side needs.
