<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Knowledge Islands coordination through Paperclip

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-agent-coordination-paperclip --write`.

Line-by-line criteria for auditing ki-agent-coordination-paperclip. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [COORD — KI–Paperclip coordination](#coord--kipaperclip-coordination)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## COORD — KI–Paperclip coordination

→ [standard](standards-agent-coordination-paperclip.md)

Repository authority, identity separation, work linkage, workspace isolation, and evidence return.

- **COORD-1 [J] — Repository authority** — Paperclip coordinates execution without becoming durable KI knowledge or work authority. (standards-agent-coordination-paperclip.md#position-and-authority, standards-agent-coordination-paperclip.md#knowledge-boundary)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the arrangement keep durable knowledge, work lifecycle, acceptance, and repository authority in the owning KI repositories?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **COORD-2 [J] — Distinct execution identities** — Agent role, run or session, workspace, and worker remain distinct identities. (standards-agent-coordination-paperclip.md#identity-model)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the arrangement distinguish the durable agent role from each run or session, workspace, and worker?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **COORD-3 [J] — Task-to-work linkage** — Each Paperclip task has an unambiguous governing KI work relationship and independent lifecycle. (standards-agent-coordination-paperclip.md#task-to-work-relationship)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each task identify at most one governing KI work item, preserve repository and baseline context, and avoid treating Paperclip completion as KI acceptance?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **COORD-4 [J] — Workspace isolation** — Every mutating run uses an isolated writable workspace under a safe Paperclip-owned root and an explicit baseline. (standards-agent-coordination-paperclip.md#workspace-model)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every mutating run use its own writable checkout under a collision-safe Paperclip-owned root outside the repository and Git common directory, with explicit repository and baseline evidence?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **COORD-5 [J] — Direct interaction and control-plane boundary** — Direct sessions remain valid and Paperclip API mechanics stay with Paperclip’s own skill. (standards-agent-coordination-paperclip.md#interaction-and-skill-composition)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Can a human address an agent directly while control-plane operations remain governed by Paperclip’s official skill and existing authority?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **COORD-6 [J] — Evidence return** — Coordination, repository, KI lifecycle, and durable-learning evidence are reconciled explicitly. (standards-agent-coordination-paperclip.md#evidence-and-completion)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does completion reconcile Paperclip task evidence, repository evidence, the KI work record, and durable knowledge promotion without converting unavailable evidence into a pass?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
